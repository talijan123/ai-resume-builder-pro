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

import {
  HiPencilSquare,
  HiEye,
  HiSparkles,
  HiXMark,
  HiArrowDownTray,
} from "react-icons/hi2";

import { useReactToPrint } from "react-to-print";

import DashboardHeader from "../components/layout/DashboardHeader";
import BuilderSubHeader from "../components/builder/BuilderSubHeader";
import BuilderContent from "../components/builder/BuilderContent";
import ResumePreview from "../components/builder/ResumePreview";

import { useResume, VALID_TEMPLATES } from "../context/ResumeContext";
import { useAuth } from "../context/AuthContext";

import { supabase } from "../lib/supabase";
import { deductCredit } from "../services/creditService";
import { toast } from "sonner";

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
    photo: "",
    gender: "",
    dob: "",
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

const validTemplates = VALID_TEMPLATES;

/* ==========================================
   Stat Card Helper Component
========================================== */

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

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
  const hasInitializedRef = useRef(false);

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
  const [mobileTab, setMobileTab] = useState("editor"); // "editor" | "preview"
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiActiveTab, setAiActiveTab] = useState("generator"); // "generator" | "ats"

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

    if (safeJobDescription.length > 8000) {
      setAtsError("Job description must be 8,000 characters or fewer.");
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
          if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;
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
          } else {
            setResumeData((prev) => ({
              ...prev,
              template: selectedTemplate,
            }));
          }

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
          toast.error("Please login first", {
            description: "You must be signed in to edit this resume.",
          });
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
          toast.error("Resume not found", {
            description: "The requested resume could not be located.",
          });
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

        toast.error("Failed to load resume", {
          description: error?.message || "Unable to load resume data. Please try again.",
        });

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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
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
          GLOBAL HEADER
      ====================================== */}

      <DashboardHeader />

      {/* ======================================
          DOCUMENT ACTIONS SUB-TOOLBAR
      ====================================== */}

      <BuilderSubHeader
        onDownloadPDF={handleDownloadPDF}
        resumeId={id}
        onToggleAi={() => setShowAiPanel(!showAiPanel)}
        showAi={showAiPanel}
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
          MAIN WORKSPACE (2-Column Split Layout)
      ====================================== */}

      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {/* Collapsible AI Assistant & ATS Scanner Drawer */}
        {showAiPanel && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shrink-0 z-30 max-h-[60vh] overflow-y-auto">
            <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAiActiveTab("generator")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      aiActiveTab === "generator"
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <HiSparkles size={15} />
                    <span>AI Resume Generator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiActiveTab("ats")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      aiActiveTab === "ats"
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>AI ATS Scanner</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAiPanel(false)}
                  title="Close AI Panel"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                >
                  <HiXMark size={20} />
                </button>
              </div>

              <div className="py-4">
                {aiActiveTab === "generator" ? (
                  /* AI Resume Generation Content */
                  <div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          Generate tailored resume draft with AI
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Paste a job description or provide key details to generate a complete resume draft.
                        </p>
                      </div>

                      <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setGenerationMode("job-description")}
                          className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                            generationMode === "job-description"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          Job description
                        </button>
                        <button
                          type="button"
                          onClick={() => setGenerationMode("guided")}
                          className={`rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                            generationMode === "guided"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          Guided fields
                        </button>
                      </div>
                    </div>

                    {generationMode === "job-description" ? (
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Paste target job description
                        </span>
                        <textarea
                          value={generationJobDescription}
                          onChange={(event) => setGenerationJobDescription(event.target.value)}
                          rows={4}
                          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                          placeholder="Paste job posting text here..."
                        />
                      </label>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Job title
                          </span>
                          <input
                            value={generationJobTitle}
                            onChange={(event) => setGenerationJobTitle(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500"
                            placeholder="e.g. Senior Full-Stack Developer"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Industry
                          </span>
                          <input
                            value={generationIndustry}
                            onChange={(event) => setGenerationIndustry(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500"
                            placeholder="e.g. Fintech, SaaS, Healthcare"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Years of experience
                          </span>
                          <input
                            value={generationYearsOfExperience}
                            onChange={(event) => setGenerationYearsOfExperience(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500"
                            placeholder="e.g. 5"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Key skills
                          </span>
                          <input
                            value={generationKeySkills}
                            onChange={(event) => setGenerationKeySkills(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-blue-500"
                            placeholder="e.g. React, Node.js, TypeScript"
                          />
                        </label>
                      </div>
                    )}

                    {generationError && (
                      <p className="mt-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 text-xs font-semibold text-red-700 dark:text-red-400">
                        {generationError}
                      </p>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleGenerateResume}
                        disabled={generating}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-60 cursor-pointer"
                      >
                        {generating ? "Generating Draft..." : "Generate Resume Draft"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* AI ATS Scanner Content */
                  <div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          Scan resume against job description
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Detect keyword match percentage and missing ATS qualifications.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleScanResumeATS}
                        disabled={
                          atsScanning ||
                          atsJobDescription.length > 8000 ||
                          atsJobDescription.trim().length === 0
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                      >
                        {atsScanning ? "Scanning..." : "Scan Against Job"}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <textarea
                        value={atsJobDescription}
                        onChange={(event) => setAtsJobDescription(event.target.value)}
                        rows={4}
                        className={`w-full rounded-2xl border ${
                          atsJobDescription.length > 8000
                            ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/40"
                            : "border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                        } bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-4`}
                        placeholder="Paste the job description you want to compare against your resume..."
                      />
                      <div className="flex items-center justify-between px-1 text-xs">
                        <span
                          className={
                            atsJobDescription.length > 8000
                              ? "font-semibold text-red-500 dark:text-red-400"
                              : "text-slate-400 dark:text-slate-500"
                          }
                        >
                          {atsJobDescription.length > 8000
                            ? "Character limit exceeded"
                            : "Target job description for ATS matching"}
                        </span>
                        <span
                          className={`font-mono transition-colors ${
                            atsJobDescription.length > 8000
                              ? "font-bold text-red-600 dark:text-red-400"
                              : atsJobDescription.length > 7000
                              ? "font-semibold text-amber-600 dark:text-amber-400"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {atsJobDescription.length.toLocaleString()} / 8,000 characters
                        </span>
                      </div>
                    </div>

                    {atsError && (
                      <p className="mt-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-2.5 text-xs font-semibold text-red-700 dark:text-red-400">
                        {atsError}
                      </p>
                    )}

                    {atsResult && (
                      <div className="mt-4 space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Match Score
                          </p>
                          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {atsResult.keywordMatchPercent}%
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                              Matched Keywords
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {atsResult.matchedKeywords?.length > 0 ? (
                                atsResult.matchedKeywords.map((k) => (
                                  <span key={k} className="rounded-md bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                                    {k}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500">None detected</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                              Missing Keywords
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {atsResult.missingKeywords?.length > 0 ? (
                                atsResult.missingKeywords.map((k) => (
                                  <span key={k} className="rounded-md bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                                    {k}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500">None</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            DESKTOP & TABLET (> 768px): 2-COLUMN SPLIT WORKSPACE
        =================================================== */}
        <div className="hidden md:grid h-full min-h-0 md:grid-cols-[48%_52%] lg:grid-cols-[46%_54%] xl:grid-cols-[45%_55%] 2xl:grid-cols-[44%_56%]">
          <BuilderContent
            onGenerateResume={handleGenerateResume}
            generating={generating}
            onToggleAi={() => setShowAiPanel(!showAiPanel)}
            showAi={showAiPanel}
          />
          <ResumePreview
            ref={resumeRef}
            onDownloadPDF={handleDownloadPDF}
          />
        </div>

        {/* ===================================================
            MOBILE (< 768px): CLEAN TABBED WORKSPACE
        =================================================== */}
        <div className="flex md:hidden flex-col h-full min-h-0">
          {/* Top Segmented Switcher */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 flex items-center justify-center shrink-0">
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-1 w-full max-w-xs">
              <button
                type="button"
                onClick={() => setMobileTab("editor")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  mobileTab === "editor"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <HiPencilSquare size={15} />
                <span>Edit Details</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  mobileTab === "preview"
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <HiEye size={15} />
                <span>Live Preview</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative overflow-hidden">
            {mobileTab === "editor" ? (
              <BuilderContent
                onGenerateResume={handleGenerateResume}
                generating={generating}
                onToggleAi={() => setShowAiPanel(!showAiPanel)}
                showAi={showAiPanel}
                onViewPreview={() => setMobileTab("preview")}
              />
            ) : (
              <div className="h-full relative">
                <ResumePreview
                  ref={resumeRef}
                  onDownloadPDF={handleDownloadPDF}
                />
                <div className="fixed bottom-5 right-5 z-40">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition cursor-pointer"
                  >
                    <HiArrowDownTray size={16} />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}