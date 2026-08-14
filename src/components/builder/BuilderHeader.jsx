import { useEffect, useState } from "react";

import {
  HiArrowLeft,
  HiCloudArrowUp,
  HiArrowDownTray,
} from "react-icons/hi2";

import { Link, useNavigate } from "react-router-dom";

import { useResume } from "../../context/ResumeContext";
import { usePricing } from "../../context/PricingContext";

import { supabase } from "../../lib/supabase";

import calculateATSScore from "../../utils/ats/calculateATSScore";

import { deductCredit } from "../../services/creditService";

export default function BuilderHeader({
  onDownloadPDF,
  resumeId,
}) {
  const navigate = useNavigate();

  const { resumeData } = useResume();

  /* =======================================
     PRICING CONTEXT
  ======================================= */

  const {
    availableCredits,
    refreshPricing,
  } = usePricing();

  const [lastSaved, setLastSaved] =
    useState("Never");

  const [saving, setSaving] =
    useState(false);

  /* =======================================
     AUTO SAVE STATUS
  ======================================= */

  useEffect(() => {
    if (saving) return;

    const interval = setInterval(() => {
      setLastSaved("A few seconds ago");
    }, 5000);

    return () => clearInterval(interval);
  }, [saving]);

  /* =======================================
     SAVE / UPDATE RESUME
  ======================================= */

  async function handleSaveResume() {
    /*
      Prevent double clicks.

      This is especially important because
      creating a new resume costs 1 credit.
    */

    if (saving) {
      console.log(
        "⏳ Save already in progress..."
      );

      return;
    }

    try {
      setSaving(true);

      /* =====================================
         GET CURRENT USER
      ===================================== */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        alert("Please login first.");

        navigate("/login");

        return;
      }

      console.log(
        "👤 Current user:",
        user.id
      );

      /* =====================================
         CALCULATE ATS SCORE
      ===================================== */

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

      /* =====================================
         SELECTED TEMPLATE
      ===================================== */

      const selectedTemplate =
        resumeData?.template || "modern";

      console.log(
        "Template being saved:",
        selectedTemplate
      );

      /* =====================================
         RESUME PAYLOAD
      ===================================== */

      const resumePayload = {
        user_id: user.id,

        title:
          resumeData?.personalInfo?.fullName ||
          "Untitled Resume",

        resume_data: {
          ...resumeData,
          template: selectedTemplate,
        },

        ats_score: atsScore,

        template: selectedTemplate,
      };

      /* =====================================
         UPDATE EXISTING RESUME

         Updating an existing resume is FREE.

         NO CREDIT IS DEDUCTED.
      ===================================== */

      if (resumeId) {
        console.log(
          "📝 Updating existing resume..."
        );

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

        return;
      }

      /* =====================================
         CREATE NEW RESUME

         Creating a NEW resume costs 1 credit.
      ===================================== */

      console.log(
        "🆕 Creating new resume..."
      );

      /* =====================================
         CHECK CURRENT CREDIT DISPLAY
      ===================================== */

      console.log(
        "💰 Current dashboard credits:",
        availableCredits
      );

      /* =====================================
         DEDUCT ONE CREDIT
      ===================================== */

      console.log(
        "💳 Deducting 1 credit..."
      );

      let remainingCredits;

      try {
        remainingCredits =
          await deductCredit(
            1,
            "Resume creation"
          );

        console.log(
          "✅ Credit deducted successfully."
        );

        console.log(
          "💳 Remaining credits:",
          remainingCredits
        );
      } catch (creditError) {
        console.error(
          "❌ Credit deduction failed:",
          creditError
        );

        /* ===================================
           DO NOT SAVE RESUME
           
           If credit deduction failed,
           the resume must NOT be created.
        =================================== */

        const errorMessage =
          creditError?.message ||
          "Unable to use your credit.";

        if (
          errorMessage.includes(
            "INSUFFICIENT_CREDITS"
          )
        ) {
          alert(
            "❌ You don't have enough credits to create a new resume.\n\nPlease upgrade your plan or purchase more credits."
          );
        } else if (
          errorMessage.includes(
            "ACTIVE_SUBSCRIPTION_NOT_FOUND"
          )
        ) {
          alert(
            "❌ You don't have an active subscription.\n\nPlease choose a plan before creating a resume."
          );
        } else if (
          errorMessage.includes(
            "USER_NOT_AUTHENTICATED"
          )
        ) {
          alert(
            "❌ Your session has expired.\n\nPlease login again."
          );

          navigate("/login");
        } else {
          alert(
            `❌ Unable to use a credit.\n\n${errorMessage}`
          );
        }

        return;
      }

      /* =====================================
         IMPORTANT FIX

         The RPC already changed:

         500 → 499

         But PricingContext still has its
         previous local value.

         Refresh it now.
      ===================================== */

      console.log(
        "🔄 Refreshing pricing context..."
      );

      try {
        await refreshPricing();

        console.log(
          "✅ Pricing context refreshed."
        );
      } catch (refreshError) {
        /*
          The credit was already deducted.

          Do NOT cancel the resume creation
          just because the UI refresh failed.

          The database is still correct.
        */

        console.error(
          "⚠️ Pricing refresh failed:",
          refreshError
        );
      }

      /* =====================================
         SAVE NEW RESUME
      ===================================== */

      console.log(
        "💾 Saving new resume..."
      );

      const {
        data,
        error: insertError,
      } = await supabase
        .from("resumes")
        .insert(resumePayload)
        .select()
        .single();

      /* =====================================
         HANDLE INSERT FAILURE
      ===================================== */

      if (insertError) {
        console.error(
          "❌ Resume insert failed after credit deduction:",
          insertError
        );

        /*
          IMPORTANT:

          The credit has already been deducted.

          We are not automatically refunding it here.

          Later, we can make resume creation + credit
          deduction one PostgreSQL transaction.
        */

        alert(
          "❌ Resume could not be saved after the credit was used.\n\nPlease contact support before trying again."
        );

        return;
      }

      /* =====================================
         RESUME SAVED
      ===================================== */

      console.log(
        "✅ Saved resume:",
        data
      );

      setLastSaved("Just now");

      /* =====================================
         SUCCESS MESSAGE
      ===================================== */

      alert(
        `✅ Resume created successfully!\n\n💳 1 credit used\n💳 Remaining credits: ${
          remainingCredits ?? "updated"
        }\n\nATS Score: ${atsScore}/100\nTemplate: ${selectedTemplate}`
      );

      /* =====================================
         NAVIGATE TO SAVED RESUME
      ===================================== */

      navigate(`/builder/${data.id}`);
    } catch (error) {
      console.error(
        "❌ Failed to save resume:",
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
            LEFT
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
            RIGHT
        ================================= */}

        <div className="flex items-center gap-4">
          {/* ---------------------------------
              SELECTED TEMPLATE
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
              AUTO SAVE STATUS
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
              DOWNLOAD
          --------------------------------- */}

          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={saving}
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

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <HiArrowDownTray size={20} />

            Download PDF
          </button>

          {/* ---------------------------------
              SAVE
          --------------------------------- */}

          <button
            type="button"
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