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

export default function ResumeBuilder() {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const resumeRef = useRef(null);

  const autoDownloadHandled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] =
    useState("");

  const {
    resumeData,
    setResumeData,
    setTemplate,
  } = useResume();

  const { user, loading: authLoading } = useAuth();

  /* ==========================================
     Template From URL
  ========================================== */

  useEffect(() => {
    if (id) return;

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
     
     IMPORTANT:
     This is called ONLY when the user
     actually clicks "Generate Resume".
  ========================================== */

  async function deductGenerationCredit() {
    if (!user) {
      navigate("/login");
      return false;
    }

    try {
      const { data, error } =
        await supabase.rpc("deduct_credit", {
          p_amount: 1,
          p_description:
            "AI resume generation",
        });

      if (error) {
        console.error(
          "Credit deduction failed:",
          error
        );

        throw error;
      }

      /*
        The RPC should return something similar to:

        {
          success: true,
          remaining_credits: 9
        }

        We don't trust the frontend to decide
        whether the credit was actually deducted.
        Supabase RPC is the authority.
      */

      if (!data?.success) {
        const message =
          data?.message ||
          "You do not have enough credits.";

        setGenerationMessage(message);

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Failed to deduct generation credit:",
        error
      );

      setGenerationMessage(
        error?.message ||
          "Unable to use a credit right now."
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
      return;
    }

    /*
      Wait for authentication.
    */

    if (authLoading) {
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
      /*
        STEP 1
        Securely deduct one credit.

        Nothing is deducted when:
        - opening builder
        - editing fields
        - changing template
        - viewing preview
        - downloading PDF
      */

      const creditDeducted =
        await deductGenerationCredit();

      if (!creditDeducted) {
        return;
      }

      /*
        STEP 2
        ACTUAL AI GENERATION GOES HERE.

        For now we mark the generation as started.

        Later we will connect this section to
        your actual AI API.
      */

      setGenerationMessage(
        "Credit used. Generating your AI resume..."
      );

      console.log(
        "AI resume generation started:",
        resumeData
      );

      /*
        Example future flow:

        const generatedResume =
          await generateAIResume(resumeData);

        setResumeData(generatedResume);

        await saveResumeToSupabase(generatedResume);
      */

      /*
        Temporary delay so you can test
        the complete credit flow.
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setGenerationMessage(
        "AI resume generation completed."
      );
    } catch (error) {
      console.error(
        "AI resume generation failed:",
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
     PDF
  ========================================== */

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,

    documentTitle:
      resumeData.personalInfo?.fullName ||
      "Resume",

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
         New Resume
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
         Existing Resume
      -------------------------------------- */

      try {
        const {
          data: { user: currentUser },
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
          .eq("user_id", currentUser.id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          alert("Resume not found.");

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

            template: validTemplates.includes(
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
              savedResumeData.experience || [],

            education:
              savedResumeData.education || [],

            skills:
              savedResumeData.skills || [],

            projects:
              savedResumeData.projects || [],

            certifications:
              savedResumeData.certifications ||
              [],
          });
        }
      } catch (error) {
        console.error(
          "Failed to load resume:",
          error
        );

        alert(
          error.message ||
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
    if (!id) return;

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
        Number(resume?.downloads) || 0;

      const {
        error: updateError,
      } = await supabase
        .from("resumes")
        .update({
          downloads: currentDownloads + 1,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      console.log(
        "Download count updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update download count:",
        error
      );
    }
  }

  /* ==========================================
     AUTOMATIC DOWNLOAD
  ========================================== */

  useEffect(() => {
    if (!location.state?.autoDownload) {
      return;
    }

    if (!id) {
      return;
    }

    if (loading) {
      return;
    }

    if (autoDownloadHandled.current) {
      return;
    }

    autoDownloadHandled.current = true;

    setDownloading(true);

    const timer = setTimeout(async () => {
      try {
        await handlePrint();

        await incrementDownloadCount();

        navigate(`/builder/${id}`, {
          replace: true,
          state: {},
        });
      } catch (error) {
        console.error(
          "Automatic PDF download failed:",
          error
        );

        setDownloading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
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

          <p className="mt-4 font-semibold text-slate-700">
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

      {/* Header */}

      <BuilderHeader
        onDownloadPDF={async () => {
          setDownloading(true);

          try {
            await handlePrint();

            await incrementDownloadCount();
          } finally {
            setDownloading(false);
          }
        }}
        resumeId={id}
      />

      {/* Download Indicator */}

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
          "
        >
          Preparing your PDF...
        </div>
      )}

      {/* Generation Indicator */}

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

            ${
              generationMessage.includes(
                "completed"
              )
                ? "border-green-200 bg-green-50 text-green-700"
                : generationMessage.includes(
                    "Credit used"
                  )
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-red-200 bg-red-50 text-red-700"
            }
          `}
        >
          {generationMessage}
        </div>
      )}

      {/* Main */}

      <div className="mx-auto max-w-[1800px] px-6 py-8">
        <div
          className="
            grid
            gap-8
            xl:grid-cols-[320px_1fr_650px]
          "
        >
          <BuilderSidebar />

          <BuilderContent
            onGenerateResume={
              handleGenerateResume
            }
            generating={generating}
          />

          <ResumePreview
            ref={resumeRef}
          />
        </div>
      </div>
    </div>
  );
}