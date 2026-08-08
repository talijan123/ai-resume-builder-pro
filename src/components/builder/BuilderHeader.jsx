import { useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiCloudArrowUp,
  HiArrowDownTray,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

import { useResume } from "../../context/ResumeContext";
import { supabase } from "../../lib/supabase";
import calculateATSScore from "../../utils/ats/calculateATSScore";

export default function BuilderHeader({
  onDownloadPDF,
  resumeId,
}) {
  const navigate = useNavigate();

  const { resumeData } = useResume();

  const [lastSaved, setLastSaved] =
    useState("Never");

  const [saving, setSaving] =
    useState(false);

  /* =======================================
     Auto Save Status
  ======================================= */

  useEffect(() => {
    if (saving) return;

    const interval = setInterval(() => {
      setLastSaved("A few seconds ago");
    }, 5000);

    return () => clearInterval(interval);
  }, [saving]);

  /* =======================================
     Save / Update Resume
  ======================================= */

  async function handleSaveResume() {
    try {
      setSaving(true);

      /* -----------------------------------
         Get Current User
      ----------------------------------- */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        alert("Please login first.");
        return;
      }

      /* -----------------------------------
         Calculate ATS Score
      ----------------------------------- */

      const atsResult =
        calculateATSScore(resumeData);

      const atsScore =
        typeof atsResult === "number"
          ? atsResult
          : atsResult?.score || 0;

      console.log(
        "ATS Score being saved:",
        atsScore
      );

      /* -----------------------------------
         Selected Template
      ----------------------------------- */

      const selectedTemplate =
        resumeData?.template || "modern";

      console.log(
        "Template being saved:",
        selectedTemplate
      );

      /* -----------------------------------
         Resume Payload
      ----------------------------------- */

      const resumePayload = {
        user_id: user.id,

        title:
          resumeData.personalInfo?.fullName ||
          "Untitled Resume",

        resume_data: {
          ...resumeData,
          template: selectedTemplate,
        },

        ats_score: atsScore,

        template: selectedTemplate,
      };

      /* ===================================
         UPDATE EXISTING RESUME
      =================================== */

      if (resumeId) {
        const {
          error: updateError,
        } = await supabase
          .from("resumes")
          .update({
            ...resumePayload,

            updated_at:
              new Date().toISOString(),
          })
          .eq("id", resumeId)
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }

        setLastSaved("Just now");

        alert(
          `✅ Resume updated successfully!\n\nATS Score: ${atsScore}/100\nTemplate: ${selectedTemplate}`
        );
      }

      /* ===================================
         CREATE NEW RESUME
      =================================== */

      else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("resumes")
          .insert(resumePayload)
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        console.log(
          "Saved resume:",
          data
        );

        setLastSaved("Just now");

        alert(
          `✅ Resume saved successfully!\n\nATS Score: ${atsScore}/100\nTemplate: ${selectedTemplate}`
        );

        /* ---------------------------------
           Navigate to Saved Resume
        --------------------------------- */

        navigate(`/builder/${data.id}`);
      }
    } catch (error) {
      console.error(
        "Failed to save resume:",
        error
      );

      alert(
        error?.message ||
          "Failed to save resume."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================
     UI
  ======================================= */

  return (
    <header
      className="
        sticky
        top-0
        z-40

        border-b
        border-slate-200

        bg-white/95
        backdrop-blur

        shadow-sm
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1800px]
          items-center
          justify-between

          gap-6

          px-6
          py-4
        "
      >
        {/* =================================
            Left
        ================================= */}

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              transition-all

              hover:bg-slate-100
              hover:shadow-sm
            "
          >
            <HiArrowLeft size={20} />
          </Link>

          <div>
            <h1
              className="
                text-2xl
                font-black
                text-slate-900
              "
            >
              Resume Builder
            </h1>

            <p className="text-sm text-slate-500">
              Build your ATS-friendly resume
            </p>
          </div>
        </div>

        {/* =================================
            Right
        ================================= */}

        <div className="flex items-center gap-4">
          {/* ---------------------------------
              Selected Template
          --------------------------------- */}

          <div
            className="
              hidden
              items-center
              gap-2

              rounded-2xl

              border
              border-blue-200

              bg-blue-50

              px-4
              py-2

              md:flex
            "
          >
            <div
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-blue-600
              "
            />

            <div className="leading-tight">
              <p className="text-xs font-medium text-slate-500">
                Template
              </p>

              <p className="text-sm font-bold capitalize text-blue-700">
                {resumeData?.template ||
                  "modern"}
              </p>
            </div>
          </div>

          {/* ---------------------------------
              Auto Save Status
          --------------------------------- */}

          <div
            className="
              hidden
              items-center
              gap-3

              rounded-2xl

              border
              border-green-200

              bg-green-50

              px-4
              py-2

              sm:flex
            "
          >
            <div
              className="
                h-3
                w-3
                animate-pulse
                rounded-full
                bg-green-500
              "
            />

            <div className="leading-tight">
              <p className="text-sm font-semibold text-green-700">
                Auto Saved
              </p>

              <p className="text-xs text-slate-500">
                Last saved {lastSaved}
              </p>
            </div>
          </div>

          {/* ---------------------------------
              Download
          --------------------------------- */}

          <button
            onClick={onDownloadPDF}
            className="
              flex
              items-center
              gap-2

              rounded-xl

              border
              border-slate-300

              bg-white

              px-5
              py-3

              font-semibold
              text-slate-700

              transition-all

              hover:bg-slate-100
              hover:shadow-md

              active:scale-[0.98]
            "
          >
            <HiArrowDownTray size={20} />

            Download PDF
          </button>

          {/* ---------------------------------
              Save
          --------------------------------- */}

          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="
              flex
              items-center
              gap-2

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-indigo-600

              px-5
              py-3

              font-semibold
              text-white

              transition-all

              hover:shadow-lg

              active:scale-[0.98]

              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            <HiCloudArrowUp size={20} />

            {saving
              ? "Saving..."
              : resumeId
              ? "Update Resume"
              : "Save Resume"}
          </button>
        </div>
      </div>
    </header>
  );
}