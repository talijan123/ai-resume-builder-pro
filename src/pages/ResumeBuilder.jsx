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
import { motion, AnimatePresence } from "framer-motion";

import { useReactToPrint } from "react-to-print";

import DashboardHeader from "../components/layout/DashboardHeader";
import BuilderSubHeader from "../components/builder/BuilderSubHeader";
import ResumePreview from "../components/builder/ResumePreview";
import EditorBanner from "../components/builder/EditorBanner";
import SectionTileGrid, { SECTION_TILES } from "../components/builder/SectionTileGrid";
import FocusedSectionCard from "../components/builder/FocusedSectionCard";
import ResumeSettingsCard from "../components/builder/ResumeSettingsCard";
import PreviewModal from "../components/builder/PreviewModal";
import AIToolsModal from "../components/builder/AIToolsModal";

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
  const generationMessageTimerRef = useRef(null);

  useEffect(() => {
    if (generationMessageTimerRef.current) {
      clearTimeout(generationMessageTimerRef.current);
      generationMessageTimerRef.current = null;
    }

    const isInProgress =
      generating ||
      generationMessage === "Generating your AI resume draft..." ||
      generationMessage === "Checking your AI credits...";

    if (generationMessage && !isInProgress) {
      generationMessageTimerRef.current = setTimeout(() => {
        setGenerationMessage("");
      }, 3500);
    }

    return () => {
      if (generationMessageTimerRef.current) {
        clearTimeout(generationMessageTimerRef.current);
      }
    };
  }, [generationMessage, generating]);
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
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiActiveTab, setAiActiveTab] = useState("generator"); // "generator" | "ats"
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  /* ==========================================
     Resume Context
  ========================================== */

  const {
    resumeData,
    setResumeData,
    setTemplate,
    activeSection,
    setActiveSection,
    addExperience,
    addEducation,
    addSkill,
    addProject,
    addCertification,
    updatePersonalInfo,
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

      const remainingCredits =
        await deductCredit(
          1,
          "AI resume generation"
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
      setShowAiPanel(false);
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
    setShowAiPanel(false);
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
     AI FILL ACTIVE SECTION
  ========================================== */

  function handleAiFillActiveSection() {
    switch (activeSection) {
      case "personal":
        updatePersonalInfo("fullName", resumeData?.personalInfo?.fullName || "John Doe");
        updatePersonalInfo("jobTitle", resumeData?.personalInfo?.jobTitle || "Senior Full-Stack Engineer");
        updatePersonalInfo("email", resumeData?.personalInfo?.email || "john.doe@example.com");
        updatePersonalInfo("phone", resumeData?.personalInfo?.phone || "+1 (555) 019-2834");
        updatePersonalInfo("location", resumeData?.personalInfo?.location || "San Francisco, CA");
        updatePersonalInfo("website", resumeData?.personalInfo?.website || "https://johndoe.dev");
        updatePersonalInfo("linkedin", resumeData?.personalInfo?.linkedin || "linkedin.com/in/johndoe");
        updatePersonalInfo("github", resumeData?.personalInfo?.github || "github.com/johndoe");
        setGenerationMessage("Personal information filled with sample draft.");
        break;
      case "summary":
        updatePersonalInfo(
          "summary",
          "Passionate and results-driven Senior Full-Stack Engineer with 6+ years of experience designing scalable web architectures, microservices, and high-performance cloud applications. Adept at driving cross-functional team success and accelerating product delivery."
        );
        setGenerationMessage("Professional summary filled with tailored draft.");
        break;
      case "experience":
        addExperience({
          company: "TechCorp Global",
          jobTitle: "Senior Full-Stack Developer",
          employmentType: "Full-time",
          location: "San Francisco, CA",
          startDate: "March 2021",
          endDate: "Present",
          currentlyWorking: true,
          description: "• Architected high-throughput microservices handling 250k+ daily API requests.\n• Reduced page load times by 45% by migrating legacy code to modern React and optimized Edge rendering.\n• Mentored 8 junior and mid-level developers in testing best practices and CI/CD pipelines.",
        });
        setGenerationMessage("Sample work experience added to your resume.");
        break;
      case "education":
        addEducation({
          school: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Science",
          location: "Berkeley, CA",
          startDate: "September 2016",
          endDate: "June 2020",
          currentlyStudying: false,
          grade: "3.85 GPA",
          description: "• Graduated Magna Cum Laude with honors.\n• Relevant Coursework: Data Structures & Algorithms, Distributed Computing, Database Systems.",
        });
        setGenerationMessage("Sample education credential added to your resume.");
        break;
      case "skills":
        [
          { name: "React / Next.js", level: "Expert" },
          { name: "Node.js & Express", level: "Advanced" },
          { name: "TypeScript", level: "Advanced" },
          { name: "PostgreSQL & Supabase", level: "Advanced" },
          { name: "Docker & AWS", level: "Intermediate" },
        ].forEach((s) => addSkill(s));
        setGenerationMessage("Key technical skills populated.");
        break;
      case "projects":
        addProject({
          title: "AI-Powered Automation Engine",
          role: "Lead Creator",
          technologies: "React, Node.js, Gemini API, Tailwind CSS",
          liveLink: "https://demo.example.com",
          githubLink: "https://github.com/example/engine",
          startDate: "Jan 2024",
          endDate: "Present",
          description: "• Engineered autonomous workflow orchestration platform with 99.9% uptime.\n• Integrated real-time generative AI pipeline saving enterprise users over 15 hours per week.",
        });
        setGenerationMessage("Standout portfolio project added.");
        break;
      case "certifications":
        addCertification({
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services (AWS)",
          issueDate: "2023",
          expiryDate: "2026",
          neverExpires: false,
          credentialId: "AWS-PSA-948201",
          credentialUrl: "https://aws.amazon.com/verification",
          description: "Demonstrated expertise in architecting secure, robust, and cost-effective cloud infrastructures.",
        });
        setGenerationMessage("Verified certification credential added.");
        break;
      default:
        setShowAiPanel(true);
        break;
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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors">
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
        onToggleAi={() => {
          setAiActiveTab("generator");
          setShowAiPanel((prev) => !prev);
        }}
        onOpenAts={() => {
          setAiActiveTab("ats");
          setShowAiPanel(true);
        }}
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

      <AnimatePresence>
        {generationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed right-6 top-24 z-50 flex max-w-sm items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-md print:hidden pointer-events-auto ${
              generationMessage.includes("applied") ||
              generationMessage.includes("ready") ||
              generationMessage.includes("completed") ||
              generationMessage.includes("successfully")
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 shadow-emerald-500/10"
                : generationMessage.includes("credit") ||
                  generationMessage.includes("remaining") ||
                  generationMessage.includes("Checking")
                ? "border-blue-200 dark:border-blue-800 bg-blue-50/95 dark:bg-blue-950/90 text-blue-800 dark:text-blue-200 shadow-blue-500/10"
                : "border-red-200 dark:border-red-800 bg-red-50/95 dark:bg-red-950/90 text-red-800 dark:text-red-200 shadow-red-500/10"
            }`}
            role="status"
          >
            <div className="flex items-center gap-2">
              <HiSparkles
                size={16}
                className={
                  generationMessage.includes("applied") ||
                  generationMessage.includes("ready") ||
                  generationMessage.includes("completed")
                    ? "text-emerald-600 dark:text-emerald-400 shrink-0"
                    : generationMessage.includes("credit") ||
                      generationMessage.includes("remaining") ||
                      generationMessage.includes("Checking")
                    ? "text-blue-600 dark:text-blue-400 shrink-0"
                    : "text-red-600 dark:text-red-400 shrink-0"
                }
              />
              <span className="leading-snug">{generationMessage}</span>
            </div>

            <button
              type="button"
              onClick={() => setGenerationMessage("")}
              className="rounded-lg p-1 text-current opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <HiXMark size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================
          TOP GRADIENT HERO BANNER
      ====================================== */}

      <EditorBanner activeSection={activeSection} />

      {/* ======================================
          MAIN WORKSPACE
      ====================================== */}

      <div className="flex-1 flex flex-col relative">
        {/* ===================================================
            OVERLAPPING 3-COLUMN FLOATING CARDS WORKSPACE
        =================================================== */}
        <div className="-mt-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10 flex-1">
          {/* Mobile & Tablet Horizontal Scrollable Section Switcher */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 mb-4 no-scrollbar">
            {SECTION_TILES.map((tile) => {
              const Icon = tile.icon;
              const isActive = activeSection === tile.id;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setActiveSection(tile.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ff3366] text-white shadow-md shadow-rose-500/20"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tile.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Floating Cards Grid (Desktop lg:grid-cols-12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (3/12 width) — Square Icon Tile Grid + Primary CTA */}
            <div className="col-span-12 lg:col-span-3">
              <SectionTileGrid
                onTriggerAiFullDraft={() => {
                  setAiActiveTab("generator");
                  setShowAiPanel(true);
                }}
              />
            </div>

            {/* Center Column (6/12 width) — Focused Single-Section Form Card */}
            <div className="col-span-12 lg:col-span-6">
              <FocusedSectionCard
                onPreviewResume={() => setShowPreviewModal(true)}
              />
            </div>

            {/* Right Column (3/12 width) — Resume Settings Card */}
            <div className="col-span-12 lg:col-span-3">
              <ResumeSettingsCard
                onPreviewResume={() => setShowPreviewModal(true)}
                onDownloadPDF={handleDownloadPDF}
                onOpenATSScan={() => {
                  setAiActiveTab("ats");
                  setShowAiPanel(true);
                }}
                onAiFillSection={handleAiFillActiveSection}
              />
            </div>
          </div>
        </div>

        {/* Hidden Printable Resume for react-to-print */}
        <div className="hidden print:block">
          <ResumePreview ref={resumeRef} />
        </div>

        {/* Live A4 Resume Preview Modal */}
        <PreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          onDownloadPDF={handleDownloadPDF}
          downloading={downloading}
        />

        {/* Floating AI Studio Modal */}
        <AIToolsModal
          isOpen={showAiPanel}
          onClose={() => setShowAiPanel(false)}
          activeTab={aiActiveTab}
          setActiveTab={setAiActiveTab}
          generationMode={generationMode}
          setGenerationMode={setGenerationMode}
          generationJobDescription={generationJobDescription}
          setGenerationJobDescription={setGenerationJobDescription}
          generationJobTitle={generationJobTitle}
          setGenerationJobTitle={setGenerationJobTitle}
          generationIndustry={generationIndustry}
          setGenerationIndustry={setGenerationIndustry}
          generationYearsOfExperience={generationYearsOfExperience}
          setGenerationYearsOfExperience={setGenerationYearsOfExperience}
          generationKeySkills={generationKeySkills}
          setGenerationKeySkills={setGenerationKeySkills}
          generationError={generationError}
          generating={generating}
          onGenerateResume={handleGenerateResume}
          atsJobDescription={atsJobDescription}
          setAtsJobDescription={setAtsJobDescription}
          atsScanning={atsScanning}
          atsError={atsError}
          atsResult={atsResult}
          onScanResumeATS={handleScanResumeATS}
        />

        {/* Subtle Copyright Footer Bar */}
        <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 px-4 sm:px-8 mt-auto text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>Copyrights © 2026 ResumeForge Pro. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Terms of use</a>
              <span>|</span>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition">Privacy policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}