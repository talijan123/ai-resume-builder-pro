import {
  useEffect,
  useRef,
  useState,
} from "react";

import { usePricing } from "../context/PricingContext";
import { useProfile } from "../context/ProfileContext";
import {
  generateResume,
  scanResumeATS,
} from "../services/aiService";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useReactToPrint } from "react-to-print";

import BuilderHeader from "../components/builder/BuilderHeader";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import BuilderContent from "../components/builder/BuilderContent";
import ResumePreview from "../components/builder/ResumePreview";

import { useResume } from "../context/ResumeContext";
import { useAuth } from "../context/AuthContext";

import { supabase } from "../lib/supabase";
import { deductCredit } from "../services/creditService";

/* ==========================================
   Empty Resume
========================================== */

const emptyResume = {
  template: "modern",

  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  },

  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

/* ==========================================
   Valid Templates
========================================== */

const validTemplates = [
  "modern",
  "professional",
  "creative",
  "executive",
  "minimal",
];

/* ==========================================
   Resume Builder
========================================== */

export default function ResumeBuilder() {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  /* ==========================================
     Refs
  ========================================== */

  const resumeRef = useRef(null);
  const autoDownloadHandled = useRef(false);

  /* ==========================================
     State
  ========================================== */

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] =
    useState("");
  const [generationError, setGenerationError] =
    useState("");
  const [generationMode, setGenerationMode] = useState(
    "job-description"
  );
  const [generationJobTitle, setGenerationJobTitle] =
    useState("");
  const [generationIndustry, setGenerationIndustry] =
    useState("");
  const [generationYearsOfExperience, setGenerationYearsOfExperience] =
    useState("");
  const [generationKeySkills, setGenerationKeySkills] =
    useState("");
  const [generationJobDescription, setGenerationJobDescription] =
    useState("");
  const [generationPreview, setGenerationPreview] =
    useState(null);
  const [showGenerationPreview, setShowGenerationPreview] =
    useState(false);
  const [atsJobDescription, setAtsJobDescription] = useState("");
  const [atsScanning, setAtsScanning] = useState(false);
  const [atsError, setAtsError] = useState("");
  const [atsResult, setAtsResult] = useState(null);

  /* ==========================================
     Resume Context
  ========================================== */

  const {
    resumeData,
    setResumeData,
    setTemplate,
  } = useResume();

  /* ==========================================
     Auth Context
  ========================================== */

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const { profileData } = useProfile();
  const { refreshPricing } = usePricing();

  /* ==========================================
     TEMPLATE FROM URL
  ========================================== */

  useEffect(() => {
    /*
      Existing resumes already have their
      own saved template.
    */

    if (id) {
      return;
    }

    const params = new URLSearchParams(
      location.search
    );

    const requestedTemplate =
      params.get("template");

    if (
      requestedTemplate &&
      validTemplates.includes(requestedTemplate)
    ) {
      setTemplate(requestedTemplate);
    } else {
      setTemplate("modern");
    }
  }, [
    id,
    location.search,
    setTemplate,
  ]);

  /* ==========================================
     SECURE CREDIT DEDUCTION
  ========================================== */

  async function deductGenerationCredit() {
    if (!user) {
      navigate("/login");
      return false;
    }

    try {
      setGenerationMessage(
        "Checking your AI credits..."
      );

      console.log(
        "💳 Attempting to deduct 1 AI credit..."
      );

      const remainingCredits =
        await deductCredit(
          1,
          "AI resume generation"
        );

      console.log(
        "✅ AI credit deducted successfully.",
        "Remaining credits:",
        remainingCredits
      );

      setGenerationMessage(
        `1 credit used. ${remainingCredits} credits remaining.`
      );

      return true;
    } catch (error) {
      console.error(
        "❌ Credit deduction failed:",
        error
      );

      const message =
        error?.message || "";

      /* --------------------------------------
         Insufficient credits
      -------------------------------------- */

      if (
        message.includes(
          "INSUFFICIENT_CREDITS"
        )
      ) {
        setGenerationMessage(
          "You do not have enough AI credits."
        );

        return false;
      }

      /* --------------------------------------
         No active subscription
      -------------------------------------- */

      if (
        message.includes(
          "ACTIVE_SUBSCRIPTION_NOT_FOUND"
        )
      ) {
        setGenerationMessage(
          "No active subscription was found."
        );

        return false;
      }

      /* --------------------------------------
         Authentication
      -------------------------------------- */

      if (
        message.includes(
          "USER_NOT_AUTHENTICATED"
        )
      ) {
        setGenerationMessage(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return false;
      }

      /* --------------------------------------
         Invalid amount
      -------------------------------------- */

      if (
        message.includes(
          "CREDIT_AMOUNT_INVALID"
        )
      ) {
        setGenerationMessage(
          "Invalid credit amount."
        );

        return false;
      }

      /* --------------------------------------
         Generic error
      -------------------------------------- */

      setGenerationMessage(
        "Unable to use an AI credit right now."
      );

      return false;
    }
  }

  /* ==========================================
     AI RESUME GENERATION
  ========================================== */

  async function handleGenerateResume() {
    if (generating) {
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    const normalizedMode =
      String(generationMode).trim().toLowerCase() === "guided"
        ? "guided"
        : "job-description";

    const safeKeySkills = generationKeySkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const safeJobDescription = generationJobDescription.trim();

    if (
      normalizedMode === "guided" &&
      (!generationJobTitle.trim() || safeKeySkills.length === 0)
    ) {
      setGenerationError(
        "Add a job title and at least one key skill before generating a resume."
      );
      return;
    }

    if (
      normalizedMode === "job-description" &&
      !safeJobDescription
    ) {
      setGenerationError(
        "Paste a job description before generating a resume."
      );
      return;
    }

    setGenerationError("");
    setGenerationMessage("Generating your AI resume draft...");
    setGenerating(true);

    try {
      const existingProfile = {
        fullName: profileData?.profile?.fullName || "",
        jobTitle: profileData?.profile?.jobTitle || "",
        professionalTitle: profileData?.profile?.professionalTitle || "",
        desiredJobTitle: profileData?.profile?.desiredJobTitle || "",
        summary: profileData?.profile?.summary || "",
        yearsOfExperience: profileData?.profile?.yearsOfExperience || "",
        location: profileData?.profile?.location || "",
        email: profileData?.contact?.email || "",
        phone: profileData?.contact?.phone || "",
        website: profileData?.contact?.website || "",
        linkedin: profileData?.contact?.linkedin || "",
        github: profileData?.contact?.github || "",
      };

      const generationPayload =
        normalizedMode === "guided"
          ? {
              jobTitle: generationJobTitle,
              industry: generationIndustry,
              yearsOfExperience: generationYearsOfExperience,
              keySkills: safeKeySkills,
            }
          : {
              jobDescription: safeJobDescription,
            };

      const result = await generateResume(
        normalizedMode,
        generationPayload,
        existingProfile
      );

      setGenerationPreview(result.resumeData ?? null);
      setShowGenerationPreview(true);
      setGenerationMessage("AI resume draft ready for review.");
      await refreshPricing();
    } catch (error) {
      console.error("❌ AI resume generation failed:", error);
      setGenerationPreview(null);
      setShowGenerationPreview(false);
      setGenerationError(
        error?.message || "Resume generation failed. Please try again."
      );
      setGenerationMessage("");
    } finally {
      setGenerating(false);
    }
  }

  function applyGeneratedResume() {
    if (!generationPreview) {
      return;
    }

    const withIds = {
      ...resumeData,
      ...generationPreview,
      personalInfo: {
        ...resumeData.personalInfo,
        ...(generationPreview.personalInfo || {}),
      },
      experience: (generationPreview.experience || []).map((entry) => ({
        ...entry,
        id: crypto.randomUUID(),
      })),
      education: (generationPreview.education || []).map((entry) => ({
        ...entry,
        id: crypto.randomUUID(),
      })),
      skills: (generationPreview.skills || []).map((entry) => ({
        ...entry,
        id: crypto.randomUUID(),
      })),
      projects: (generationPreview.projects || []).map((entry) => ({
        ...entry,
        id: crypto.randomUUID(),
      })),
      certifications: (generationPreview.certifications || []).map((entry) => ({
        ...entry,
        id: crypto.randomUUID(),
      })),
    };

    setResumeData(withIds);
    setGenerationPreview(null);
    setShowGenerationPreview(false);
    setGenerationError("");
    setGenerationMessage("AI resume draft applied to your current resume.");
  }

  async function handleScanResumeATS() {
    if (atsScanning) {
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    const safeJobDescription = atsJobDescription.trim();

    if (!safeJobDescription) {
      setAtsError("Paste a job description before scanning your resume.");
      return;
    }

    setAtsError("");
    setAtsScanning(true);

    try {
      const result = await scanResumeATS(
        resumeData,
        safeJobDescription
      );

      setAtsResult(result);
      await refreshPricing();
    } catch (error) {
      console.error("❌ AI ATS scan failed:", error);
      setAtsError(
        error?.message || "ATS scan failed. Please try again."
      );
    } finally {
      setAtsScanning(false);
    }
  }

  function StatCard({ label, value }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
      </div>
    );
  }

  /* ==========================================
     PDF PRINT CONFIGURATION
  ========================================== */

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,

    documentTitle:
      resumeData.personalInfo?.fullName ||
      "Resume",

    /*
      Global print CSS.

      The actual resume is treated as an A4
      document while allowing multiple pages.
    */

    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }

      @media print {

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;

          width: 100% !important;

          background: white !important;
        }

        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /*
          Main resume container
        */

        #resume-preview,
        [data-print-content="resume"] {
          width: 100% !important;

          min-height: 0 !important;

          height: auto !important;

          margin: 0 !important;

          padding: 0 !important;

          background: white !important;

          border-radius: 0 !important;

          box-shadow: none !important;

          overflow: visible !important;
        }

        /*
          Keep complete resume entries
          together whenever possible.
        */

        .resume-entry,
        .resume-section,
        .resume-education-item,
        .resume-experience-item,
        .resume-project-item,
        .resume-certification-item {
          break-inside: avoid !important;

          page-break-inside: avoid !important;
        }

        /*
          Keep section heading with the
          content immediately following it.
        */

        .resume-section-title {
          break-after: avoid !important;

          page-break-after: avoid !important;
        }

        /*
          Avoid splitting common elements.
        */

        table,
        tr,
        td,
        th,
        figure,
        blockquote {
          break-inside: avoid !important;

          page-break-inside: avoid !important;
        }

        /*
          Prevent unnecessary forced
          page breaks.
        */

        #resume-preview > *:last-child {
          break-after: auto !important;

          page-break-after: auto !important;
        }

        /*
          Hide screen-only elements.
        */

        .print\\:hidden {
          display: none !important;
        }

        /*
          Links should appear as normal
          text in the PDF.
        */

        a {
          color: inherit !important;

          text-decoration: none !important;
        }
      }
    `,

    /*
      Reset download indicator after
      browser print dialog finishes.
    */

    onAfterPrint: () => {
      setDownloading(false);
    },
  });

  /* ==========================================
     LOAD RESUME FROM SUPABASE
  ========================================== */

  useEffect(() => {
    let mounted = true;

    async function loadResume() {
      setLoading(true);

      /* --------------------------------------
         NEW RESUME
      -------------------------------------- */

      if (!id) {
        const params = new URLSearchParams(
          location.search
        );

        const requestedTemplate =
          params.get("template");

        const selectedTemplate =
          requestedTemplate &&
          validTemplates.includes(
            requestedTemplate
          )
            ? requestedTemplate
            : "modern";

        if (mounted) {
          setResumeData({
            ...emptyResume,

            template: selectedTemplate,

            personalInfo: {
              ...emptyResume.personalInfo,
            },

            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
          });

          setLoading(false);
        }

        return;
      }

      /* --------------------------------------
         EXISTING RESUME
      -------------------------------------- */

      try {
        const {
          data: {
            user: currentUser,
          },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          alert("Please login first.");

          navigate("/login");

          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", id)
          .eq(
            "user_id",
            currentUser.id
          )
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          alert(
            "Resume not found."
          );

          navigate("/my-resumes");

          return;
        }

        if (mounted) {
          const savedResumeData =
            data.resume_data || {};

          const savedTemplate =
            savedResumeData.template ||
            data.template ||
            "modern";

          setResumeData({
            ...emptyResume,

            ...savedResumeData,

            template:
              validTemplates.includes(
                savedTemplate
              )
                ? savedTemplate
                : "modern",

            personalInfo: {
              ...emptyResume.personalInfo,

              ...(savedResumeData.personalInfo ||
                {}),
            },

            experience:
              savedResumeData.experience ||
              [],

            education:
              savedResumeData.education ||
              [],

            skills:
              savedResumeData.skills ||
              [],

            projects:
              savedResumeData.projects ||
              [],

            certifications:
              savedResumeData.certifications ||
              [],
          });
        }
      } catch (error) {
        console.error(
          "❌ Failed to load resume:",
          error
        );

        alert(
          error?.message ||
            "Failed to load resume."
        );

        navigate("/my-resumes");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => {
      mounted = false;
    };
  }, [
    id,
    location.search,
    setResumeData,
    navigate,
  ]);

  /* ==========================================
     INCREMENT DOWNLOAD COUNT
  ========================================== */

  async function incrementDownloadCount() {
    if (!id) {
      return;
    }

    try {
      const {
        data: resume,
        error: fetchError,
      } = await supabase
        .from("resumes")
        .select("downloads")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentDownloads =
        Number(
          resume?.downloads
        ) || 0;

      const {
        error: updateError,
      } = await supabase
        .from("resumes")
        .update({
          downloads:
            currentDownloads + 1,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      console.log(
        "✅ Download count updated successfully."
      );
    } catch (error) {
      /*
        Download count failure should NOT
        make the PDF download fail.
      */

      console.error(
        "❌ Failed to update download count:",
        error
      );
    }
  }

  /* ==========================================
     DOWNLOAD PDF
  ========================================== */

  async function handleDownloadPDF() {
    /*
      Prevent multiple download clicks.
    */

    if (downloading) {
      return;
    }

    /*
      New unsaved resume doesn't have an ID.
      We can still print it, but there is no
      database download count to increment.
    */

    setDownloading(true);

    try {
      /*
        Wait one frame so React has time to
        render the latest resume changes.
      */

      await new Promise((resolve) =>
        requestAnimationFrame(resolve)
      );

      /*
        Start browser PDF/print process.
      */

      await handlePrint();

      /*
        Only existing resumes have a
        download counter.
      */

      if (id) {
        await incrementDownloadCount();
      }
    } catch (error) {
      console.error(
        "❌ PDF download failed:",
        error
      );

      setDownloading(false);
    }
  }

  /* ==========================================
     AUTOMATIC DOWNLOAD
  ========================================== */

  useEffect(() => {
    if (
      !location.state?.autoDownload
    ) {
      return;
    }

    if (!id) {
      return;
    }

    if (loading) {
      return;
    }

    if (
      autoDownloadHandled.current
    ) {
      return;
    }

    autoDownloadHandled.current = true;

    setDownloading(true);

    const timer = setTimeout(
      async () => {
        try {
          /*
            Give the preview a little time to
            finish rendering before printing.
          */

          await new Promise((resolve) =>
            requestAnimationFrame(resolve)
          );

          await handlePrint();

          await incrementDownloadCount();

          /*
            Remove autoDownload state so
            refreshing the builder doesn't
            download again.
          */

          navigate(
            `/builder/${id}`,
            {
              replace: true,
              state: {},
            }
          );
        } catch (error) {
          console.error(
            "❌ Automatic PDF download failed:",
            error
          );

          setDownloading(false);
        }
      },
      800
    );

    return () =>
      clearTimeout(timer);
  }, [
    id,
    loading,
    location.state,
    navigate,
  ]);

  /* ==========================================
     LOADING SCREEN
  ========================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-blue-600
            "
          />

          <p
            className="
              mt-4
              font-semibold
              text-slate-700
            "
          >
            Loading resume...
          </p>

        </div>
      </div>
    );
  }

  /* ==========================================
     BUILDER
  ========================================== */

  return (
    <div className="min-h-screen bg-slate-50">
      {showGenerationPreview && generationPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Review draft
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Apply AI-generated resume?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGenerationPreview(false);
                  setGenerationPreview(null);
                }}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Full name
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {generationPreview.personalInfo?.fullName || "Your Name"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Job title
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {generationPreview.personalInfo?.jobTitle || "Target role"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard label="Experience" value={generationPreview.experience?.length || 0} />
                <StatCard label="Education" value={generationPreview.education?.length || 0} />
                <StatCard label="Skills" value={generationPreview.skills?.length || 0} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Projects" value={generationPreview.projects?.length || 0} />
                <StatCard label="Certifications" value={generationPreview.certifications?.length || 0} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Summary
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {generationPreview.personalInfo?.summary || "No summary generated yet."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowGenerationPreview(false);
                  setGenerationPreview(null);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={applyGeneratedResume}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20"
              >
                Apply to my resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
          HEADER
      ====================================== */}

      <BuilderHeader
        onDownloadPDF={handleDownloadPDF}
        resumeId={id}
      />

      {/* ======================================
          DOWNLOAD INDICATOR
      ====================================== */}

      {downloading && (
        <div
          className="
            fixed
            right-6
            top-24
            z-50

            rounded-2xl
            border
            border-blue-200
            bg-blue-50

            px-5
            py-3

            text-sm
            font-semibold
            text-blue-700

            shadow-lg

            print:hidden
          "
        >
          Preparing your PDF...
        </div>
      )}

      {/* ======================================
          GENERATION INDICATOR
      ====================================== */}

      {generationMessage && (
        <div
          className={`
            fixed
            right-6
            top-40
            z-50

            max-w-sm

            rounded-2xl
            border

            px-5
            py-4

            text-sm
            font-semibold

            shadow-lg

            print:hidden

            ${
              generationMessage.includes(
                "completed"
              )
                ? "border-green-200 bg-green-50 text-green-700"
                : generationMessage.includes(
                    "credit used"
                  ) ||
                  generationMessage.includes(
                    "Credit used"
                  )
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : generationMessage.includes(
                    "remaining"
                  )
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-red-200 bg-red-50 text-red-700"
            }
          `}
        >
          {generationMessage}
        </div>
      )}

      {/* ======================================
          MAIN
      ====================================== */}

      <div
        className="
          mx-auto
          max-w-[1800px]
          px-6
          py-8
        "
      >
        <div className="mb-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                AI Resume Generation
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Create a resume draft
              </h3>
            </div>
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setGenerationMode("job-description")}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  generationMode === "job-description"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600"
                }`}
              >
                Job description
              </button>
              <button
                type="button"
                onClick={() => setGenerationMode("guided")}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  generationMode === "guided"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600"
                }`}
              >
                Guided fields
              </button>
            </div>
          </div>

          {generationMode === "job-description" ? (
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Paste the job description
              </span>
              <textarea
                value={generationJobDescription}
                onChange={(event) => setGenerationJobDescription(event.target.value)}
                rows={8}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Paste the job description and the AI will generate a resume draft based on it."
              />
            </label>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Job title
                </span>
                <input
                  value={generationJobTitle}
                  onChange={(event) => setGenerationJobTitle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Senior Product Designer"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Industry
                </span>
                <input
                  value={generationIndustry}
                  onChange={(event) => setGenerationIndustry(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="SaaS, fintech, healthcare..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Years of experience
                </span>
                <input
                  value={generationYearsOfExperience}
                  onChange={(event) => setGenerationYearsOfExperience(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="3"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Key skills
                </span>
                <input
                  value={generationKeySkills}
                  onChange={(event) => setGenerationKeySkills(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="React, product strategy, analytics, stakeholder management"
                />
              </label>
            </div>
          )}

          {generationError && (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {generationError}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleGenerateResume}
              disabled={generating}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate Resume"}
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                AI ATS Scanner
              </p>
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Scan against a job description
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Compare your current resume with a specific role before you apply.
              </p>
            </div>
            <button
              type="button"
              onClick={handleScanResumeATS}
              disabled={atsScanning}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {atsScanning ? "Scanning..." : "Scan Resume"}
            </button>
          </div>

          <textarea
            value={atsJobDescription}
            onChange={(event) => setAtsJobDescription(event.target.value)}
            rows={7}
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Paste the job description you want to compare against your resume."
          />

          {atsError && (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {atsError}
            </p>
          )}

          {atsResult && (
            <div className="mt-6 space-y-5 border-t border-slate-200 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                  Match percentage
                </p>
                <p className="text-4xl font-black text-emerald-600">
                  {atsResult.keywordMatchPercent}%
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-black text-emerald-700">
                    Matched keywords
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {atsResult.matchedKeywords.length > 0 ? (
                      atsResult.matchedKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">None identified.</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black text-amber-700">
                    Missing keywords
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {atsResult.missingKeywords.length > 0 ? (
                      atsResult.missingKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">None identified.</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-slate-700">
                  Formatting warnings
                </p>
                {atsResult.formattingWarnings.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {atsResult.formattingWarnings.map((warning) => (
                      <li key={warning} className="flex gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No formatting warnings identified.</p>
                )}
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-700">Summary</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {atsResult.summary}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className="
            grid
            gap-8
            xl:grid-cols-[320px_1fr_650px]
          "
        >

          {/* Sidebar */}

          <BuilderSidebar />

          {/* Content */}

          <BuilderContent
            onGenerateResume={
              handleGenerateResume
            }
            generating={generating}
          />

          {/* Preview */}

          <ResumePreview
            ref={resumeRef}
          />

        </div>
      </div>
    </div>
  );
}