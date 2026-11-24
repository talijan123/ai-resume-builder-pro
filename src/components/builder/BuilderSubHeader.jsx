import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiCloudArrowUp,
  HiArrowDownTray,
  HiSparkles,
  HiChartBar,
  HiDocumentDuplicate,
  HiCheck,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";
import { usePricing } from "../../context/PricingContext";
import { supabase } from "../../lib/supabase";
import calculateATSScore from "../../utils/ats/calculateATSScore";
import { deductCredit } from "../../services/creditService";
import { toast } from "sonner";

export default function BuilderSubHeader({
  onDownloadPDF,
  resumeId,
  onToggleAi,
  showAi = false,
}) {
  const navigate = useNavigate();
  const { resumeData, updatePersonalInfo } = useResume();
  const { refreshPricing } = usePricing();

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");

  // Live ATS score
  const atsResult = calculateATSScore(resumeData);
  const atsScore =
    typeof atsResult === "number" ? atsResult : atsResult?.score || 0;

  // Auto-save timer indicator
  useEffect(() => {
    if (saving) return;
    const interval = setInterval(() => {
      setLastSaved("Just now");
    }, 20000);
    return () => clearInterval(interval);
  }, [saving]);

  async function handleSaveResume() {
    if (saving) return;

    try {
      setSaving(true);

      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!authUser) {
        toast.error("Please login first", {
          description: "You must be signed in to save your resume.",
        });
        navigate("/login");
        return;
      }

      const selectedTemplate = resumeData?.template || "modern";
      const displayTemplate =
        selectedTemplate.charAt(0).toUpperCase() +
        selectedTemplate.slice(1).replace("-", " ");

      const resumePayload = {
        user_id: authUser.id,
        title:
          resumeData?.personalInfo?.fullName?.trim() ||
          "Untitled Resume",
        resume_data: {
          ...resumeData,
          template: selectedTemplate,
        },
        ats_score: atsScore,
        template: selectedTemplate,
      };

      if (resumeId) {
        const { error: updateError } = await supabase
          .from("resumes")
          .update({
            ...resumePayload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", resumeId)
          .eq("user_id", authUser.id);

        if (updateError) throw updateError;

        setLastSaved("Just now");
        toast.success("Resume saved successfully!", {
          description: `ATS Score: ${atsScore}/100 • Template: ${displayTemplate}`,
          duration: 3000,
        });
        return;
      }

      // New resume requires 1 AI credit
      try {
        await deductCredit(1, "Resume creation");
      } catch (creditError) {
        const errorMessage =
          creditError?.message || "Unable to use your credit.";

        if (errorMessage.includes("INSUFFICIENT_CREDITS")) {
          toast.error("Insufficient credits", {
            description: "Please upgrade your plan or purchase more credits to create a new resume.",
          });
        } else if (errorMessage.includes("ACTIVE_SUBSCRIPTION_NOT_FOUND")) {
          toast.error("Subscription required", {
            description: "Please choose an active plan before creating a new resume.",
          });
        } else if (errorMessage.includes("USER_NOT_AUTHENTICATED")) {
          toast.error("Session expired", {
            description: "Please log in again to continue.",
          });
          navigate("/login");
        } else {
          toast.error("Unable to use credit", {
            description: errorMessage,
          });
        }
        return;
      }

      if (refreshPricing) {
        await refreshPricing();
      }

      const { data: insertData, error: insertError } = await supabase
        .from("resumes")
        .insert([resumePayload])
        .select()
        .single();

      if (insertError) throw insertError;

      setLastSaved("Just now");
      toast.success("Resume created successfully!", {
        description: `ATS Score: ${atsScore}/100 • Template: ${displayTemplate}`,
        duration: 3000,
      });

      if (insertData?.id) {
        navigate(`/builder/${insertData.id}`, { replace: true });
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save resume", {
        description: "Something went wrong while saving. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  const documentName = resumeData?.personalInfo?.fullName || "";

  return (
    <div className="relative z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200 shrink-0">
      <div className="mx-auto flex h-13 sm:h-14 max-w-[1800px] items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        {/* Left: Document Breadcrumb / Rename & Auto-save & Template badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <Link
            to="/my-resumes"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition shrink-0"
            title="Back to My Resumes"
          >
            <HiDocumentDuplicate size={15} />
            <span className="hidden sm:inline">My Resumes</span>
          </Link>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>

          {/* Editable Document Title Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={documentName}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              placeholder="Untitled Resume"
              title="Click to edit resume title"
              className="
                max-w-[130px]
                sm:max-w-[200px]
                md:max-w-[260px]
                rounded-lg
                border
                border-transparent
                bg-transparent
                px-2
                py-1
                text-xs
                sm:text-sm
                font-bold
                text-slate-900
                dark:text-white
                outline-none
                transition
                hover:border-slate-200
                dark:hover:border-slate-700
                hover:bg-slate-50
                dark:hover:bg-slate-800/60
                focus:border-blue-500
                focus:bg-white
                dark:focus:bg-slate-800
                focus:ring-2
                focus:ring-blue-100
                dark:focus:ring-blue-900/30
                truncate
              "
            />
          </div>

          {/* Auto-save Pill Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 shrink-0">
            <span className="relative flex h-2 w-2 shrink-0">
              {saving && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  saving ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
            </span>
            <span className="hidden md:inline">
              {saving ? "Saving changes..." : `Auto-saved ${lastSaved}`}
            </span>
            <span className="md:hidden">
              {saving ? "Saving..." : "Saved"}
            </span>
          </div>

          {/* Template Indicator Badge */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-blue-200/60 dark:border-blue-500/20 bg-blue-50/70 dark:bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="capitalize">{resumeData?.template || "modern"}</span>
          </div>
        </div>

        {/* Right: ATS Pill + AI Tools Toggle + Export PDF + Save Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* ATS Score Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold shadow-sm transition ${
              atsScore >= 80
                ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : atsScore >= 60
                ? "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            }`}
            title={`ATS Compatibility Score: ${atsScore}/100`}
          >
            <HiChartBar size={14} className="shrink-0" />
            <span className="hidden sm:inline">ATS:</span>
            <span>{atsScore}/100</span>
          </div>

          {/* AI Tools Toggle Button */}
          {onToggleAi && (
            <button
              type="button"
              onClick={onToggleAi}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                showAi
                  ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                  : "border-blue-200 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              }`}
              title="Toggle AI Resume Generator & ATS Scanner"
            >
              <HiSparkles size={14} className="shrink-0" />
              <span className="hidden md:inline">AI Tools</span>
            </button>
          )}

          {/* Export / Download PDF */}
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={saving}
            title="Download PDF document"
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-2.5
              sm:px-3.5
              py-1.5
              text-xs
              font-bold
              text-slate-700
              dark:text-slate-200
              shadow-sm
              transition
              hover:bg-slate-50
              dark:hover:bg-slate-700
              hover:border-slate-400
              active:scale-95
              disabled:opacity-60
              cursor-pointer
            "
          >
            <HiArrowDownTray size={14} className="shrink-0" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Save / Update Button */}
          <button
            type="button"
            onClick={handleSaveResume}
            disabled={saving}
            title={resumeId ? "Update existing resume in cloud" : "Save new resume to cloud (1 Credit)"}
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              hover:from-blue-500
              hover:to-indigo-500
              px-3.5
              sm:px-4
              py-1.5
              text-xs
              font-bold
              text-white
              shadow-sm
              shadow-blue-500/25
              transition
              active:scale-95
              disabled:opacity-70
              cursor-pointer
            "
          >
            <HiCloudArrowUp size={15} className="shrink-0" />
            <span>{saving ? "Saving..." : resumeId ? "Update" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
