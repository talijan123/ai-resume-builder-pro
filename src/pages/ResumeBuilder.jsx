import {
  useEffect,
  useRef,
  useState,
} from "react";

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
    /*
      Prevent double clicks.
    */

    if (generating) {
      console.log(
        "⚠️ Generation already in progress."
      );

      return;
    }

    /*
      Wait for authentication.
    */

    if (authLoading) {
      console.log(
        "⏳ Authentication still loading..."
      );

      return;
    }

    /*
      User must be logged in.
    */

    if (!user) {
      navigate("/login");
      return;
    }

    setGenerationMessage("");
    setGenerating(true);

    try {
      /* ======================================
         STEP 1
         DEDUCT ONE CREDIT
      ====================================== */

      const creditDeducted =
        await deductGenerationCredit();

      /*
        If credit deduction fails,
        stop generation.
      */

      if (!creditDeducted) {
        return;
      }

      /* ======================================
         STEP 2
         AI GENERATION
      ====================================== */

      setGenerationMessage(
        "Credit used. Generating your AI resume..."
      );

      console.log(
        "🤖 AI resume generation started:",
        resumeData
      );

      /*
        Temporary test delay.

        Replace this later with your
        actual AI generation API.
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      /* ======================================
         GENERATION COMPLETE
      ====================================== */

      setGenerationMessage(
        "AI resume generation completed."
      );

      console.log(
        "✅ AI resume generation completed."
      );
    } catch (error) {
      console.error(
        "❌ AI resume generation failed:",
        error
      );

      setGenerationMessage(
        error?.message ||
          "Resume generation failed."
      );
    } finally {
      setGenerating(false);
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
        margin: 0;
      }

      @media print {

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;

          width: 210mm !important;

          background: white !important;
        }

        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /*
          Main resume container
        */

        #resume-preview {
          width: 210mm !important;

          min-height: 297mm !important;

          height: auto !important;

          margin: 0 !important;

          padding: 10mm !important;

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