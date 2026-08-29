import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiCloudArrowUp,
  HiArrowDownTray,
  HiSparkles,
  HiChevronDown,
  HiSun,
  HiMoon,
  HiGlobeAlt,
  HiUser,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiDocumentDuplicate,
  HiChartBar,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";
import { usePricing } from "../../context/PricingContext";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import calculateATSScore from "../../utils/ats/calculateATSScore";
import { deductCredit } from "../../services/creditService";

export default function BuilderHeader({
  onDownloadPDF,
  resumeId,
}) {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const { availableCredits, planName, refreshPricing } = usePricing();
  const { settings, setTheme } = useSettings();
  const { user } = useAuth();

  const [lastSaved, setLastSaved] = useState("Never");
  const [saving, setSaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  // User metadata
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // Active theme calculation
  const currentTheme = settings?.appearance?.theme || "system";
  const isDarkMode =
    currentTheme === "dark" ||
    (currentTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  function toggleTheme() {
    const nextTheme = isDarkMode ? "light" : "dark";
    if (setTheme) {
      setTheme(nextTheme);
    } else {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
  }

  // Live ATS score
  const atsResult = calculateATSScore(resumeData);
  const atsScore =
    typeof atsResult === "number" ? atsResult : atsResult?.score || 0;

  // Auto-save timer simulation
  useEffect(() => {
    if (saving) return;

    const interval = setInterval(() => {
      setLastSaved("Just now");
    }, 15000);

    return () => clearInterval(interval);
  }, [saving]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setProfileOpen(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    navigate("/login");
  }

  async function handleSaveResume() {
    if (saving) {
      console.log("⏳ Save already in progress...");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!authUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const selectedTemplate = resumeData?.template || "modern";

      const resumePayload = {
        user_id: authUser.id,
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
        alert(
          `✅ Resume updated successfully!\n\nATS Score: ${atsScore}/100\nTemplate: ${selectedTemplate}`
        );
        return;
      }

      let remainingCredits;
      try {
        remainingCredits = await deductCredit(1, "Resume creation");
      } catch (creditError) {
        const errorMessage =
          creditError?.message || "Unable to use your credit.";

        if (errorMessage.includes("INSUFFICIENT_CREDITS")) {
          alert(
            "❌ You don't have enough credits to create a new resume.\n\nPlease upgrade your plan or purchase more credits."
          );
        } else if (errorMessage.includes("ACTIVE_SUBSCRIPTION_NOT_FOUND")) {
          alert(
            "❌ You don't have an active subscription.\n\nPlease choose a plan before creating a resume."
          );
        } else if (errorMessage.includes("USER_NOT_AUTHENTICATED")) {
          alert("❌ Your session has expired.\n\nPlease login again.");
          navigate("/login");
        } else {
          alert(`❌ Unable to use a credit.\n\n${errorMessage}`);
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
      alert(
        `✅ Resume created successfully!\n\nATS Score: ${atsScore}/100\nTemplate: ${selectedTemplate}`
      );

      if (insertData?.id) {
        navigate(`/builder/${insertData.id}`, { replace: true });
      }
    } catch (err) {
      console.error("❌ Unexpected save error:", err);
      alert("❌ Something went wrong while saving your resume.");
    } finally {
      setSaving(false);
    }
  }

  const documentName =
    resumeData?.personalInfo?.fullName?.trim() || "Untitled Resume";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1800px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            LEFT SECTION: Back + Brand + Document Title + Template
        =================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 min-w-0">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/my-resumes")}
            title="Back to My Resumes"
            aria-label="Back to My Resumes"
            className="
              flex
              h-9
              w-9
              sm:h-10
              sm:w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-900
              text-slate-700
              dark:text-slate-300
              shadow-sm
              transition
              hover:bg-slate-50
              dark:hover:bg-slate-800
              hover:text-slate-900
              dark:hover:text-white
              cursor-pointer
            "
          >
            <HiArrowLeft size={17} />
          </button>

          {/* Brand Logo */}
          <Link
            to="/dashboard"
            title="ResumeForge Dashboard"
            className="flex items-center gap-2 group shrink-0"
          >
            <div
              className="
                flex
                h-9
                w-9
                sm:h-10
                sm:w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                via-indigo-600
                to-blue-700
                text-xs
                font-black
                text-white
                shadow-md
                shadow-blue-500/20
                transition-transform
                group-hover:scale-105
              "
            >
              RF
            </div>
          </Link>

          {/* Breadcrumb / Document Name */}
          <div className="text-left leading-tight min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Link
                to="/my-resumes"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition hidden sm:inline"
              >
                My Resumes
              </Link>
              <span className="hidden sm:inline">/</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[200px] md:max-w-[260px]">
                {documentName}
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden md:block">
              Resume Builder & Live Editor
            </p>
          </div>

          {/* Template Badge */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="capitalize">{resumeData?.template || "modern"}</span>
          </div>
        </div>

        {/* ===================================================
            CENTER SECTION: Auto Save Status & ATS Pill
        =================================================== */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Auto Save Pulse */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 shadow-inner">
            <div
              className={`h-2 w-2 rounded-full ${
                saving ? "bg-amber-400 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span className="text-[11px] font-medium">
              {saving ? "Saving changes..." : `Auto-saved ${lastSaved}`}
            </span>
          </div>

          {/* Compact ATS Score Pill */}
          <div
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-sm ${
              atsScore >= 80
                ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : atsScore >= 60
                ? "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            }`}
          >
            <HiChartBar size={14} />
            <span>ATS Score: {atsScore}/100</span>
          </div>
        </div>

        {/* ===================================================
            RIGHT SECTION: Download + Save + Credits + Theme + Profile
        =================================================== */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={saving}
            title="Export as PDF"
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-900
              px-3
              py-2
              text-xs
              font-bold
              text-slate-700
              dark:text-slate-200
              shadow-sm
              transition
              hover:bg-slate-50
              dark:hover:bg-slate-800
              hover:border-slate-400
              active:scale-95
              disabled:opacity-60
              cursor-pointer
            "
          >
            <HiArrowDownTray size={15} />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Save / Update Button */}
          <button
            type="button"
            onClick={handleSaveResume}
            disabled={saving}
            title={resumeId ? "Update Resume" : "Save Resume (1 Credit)"}
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-3.5
              py-2
              text-xs
              font-bold
              text-white
              shadow-md
              shadow-blue-500/20
              transition
              hover:from-blue-500
              hover:to-indigo-500
              active:scale-95
              disabled:opacity-70
              cursor-pointer
            "
          >
            <HiCloudArrowUp size={16} />
            <span>{saving ? "Saving..." : resumeId ? "Update" : "Save"}</span>
          </button>

          {/* Credits Badge */}
          <Link
            to="/checkout"
            title="Available AI Credits"
            className="
              hidden
              md:flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-amber-200
              dark:border-amber-500/30
              bg-amber-50
              dark:bg-amber-500/10
              px-2.5
              py-2
              text-xs
              font-bold
              text-amber-800
              dark:text-amber-300
              shadow-sm
              transition
              hover:scale-105
            "
          >
            <HiSparkles size={14} className="text-amber-500" />
            <span>{availableCredits ?? 0}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle color theme"
            className="
              flex
              h-9
              w-9
              sm:h-10
              sm:w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-900
              text-slate-600
              dark:text-slate-300
              shadow-sm
              transition
              hover:bg-slate-100
              dark:hover:bg-slate-800
              cursor-pointer
            "
          >
            {isDarkMode ? (
              <HiSun size={18} className="text-amber-400" />
            ) : (
              <HiMoon size={18} className="text-slate-700" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
              aria-expanded={profileOpen}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-slate-900
                p-1
                sm:p-1.5
                sm:pr-2.5
                shadow-sm
                transition
                hover:border-slate-300
                dark:hover:border-slate-700
                cursor-pointer
              "
            >
              <div
                className="
                  flex
                  h-7
                  w-7
                  sm:h-8
                  sm:w-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-tr
                  from-blue-600
                  to-indigo-600
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                "
              >
                {userInitial}
              </div>

              <HiChevronDown
                size={13}
                className={`text-slate-400 transition-transform duration-200 hidden sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Menu Dropdown */}
            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-60
                  rounded-2xl
                  border
                  border-slate-200
                  dark:border-slate-800
                  bg-white
                  dark:bg-slate-900
                  p-2
                  shadow-2xl
                  z-50
                  text-slate-800
                  dark:text-slate-100
                  animate-in
                  fade-in
                  slide-in-from-top-2
                  duration-150
                "
              >
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {userEmail}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
                      {planName || "Starter Plan"}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      {availableCredits ?? 0} Credits
                    </span>
                  </div>
                </div>

                <div className="mt-1 space-y-0.5">
                  <Link
                    to="/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <HiGlobeAlt size={15} className="text-blue-500" />
                    Landing Page
                  </Link>
                  <Link
                    to="/my-resumes"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <HiDocumentDuplicate size={15} className="text-slate-400" />
                    My Resumes
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <HiUser size={15} className="text-slate-400" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <HiCog6Tooth size={15} className="text-slate-400" />
                    Settings
                  </Link>
                </div>

                <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                  >
                    <HiArrowRightOnRectangle size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}