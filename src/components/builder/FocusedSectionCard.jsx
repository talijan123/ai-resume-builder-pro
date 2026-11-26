import React, { useState, useEffect, useRef } from "react";
import {
  HiQuestionMarkCircle,
  HiPencilSquare,
  HiTrash,
  HiSparkles,
  HiEye,
  HiArrowRight,
  HiXMark,
  HiPlus,
  HiCheck,
  HiPhoto,
  HiArrowUpTray,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

import { useResume, templateSupportsPhoto } from "../../context/ResumeContext";
import { usePricing } from "../../context/PricingContext";
import {
  improveBulletPoint,
  generateSummaries,
  generateCoverLetter,
} from "../../services/aiService";
import { processProfileImage } from "../../utils/imageUtils";
import { SECTION_TILES } from "./SectionTileGrid";
import { SECTION_METADATA } from "./EditorBanner";

/* =========================================================
   Date Dropdown Options
========================================================= */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 45 }, (_, i) => String(CURRENT_YEAR + 5 - i));

const SECTION_ORDER = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "cover-letter",
];

export default function FocusedSectionCard({ onPreviewResume }) {
  const {
    activeSection,
    setActiveSection,
    resumeData,
    setResumeData,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    currentTemplate,
    supportsPhoto: contextSupportsPhoto,
  } = useResume();

  const { refreshPricing } = usePricing();

  /* =========================================================
     Local UI States
  ========================================================= */
  const [showTip, setShowTip] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Status message state with 3.5s auto-dismiss
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info"); // "info" | "success" | "error"
  const [isAiLoading, setIsAiLoading] = useState(false);
  const statusTimerRef = useRef(null);

  // Photo upload & processing states
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const photoFileInputRef = useRef(null);

  async function handlePhotoFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    try {
      const { dataUrl } = await processProfileImage(file, {
        maxDimension: 400,
        quality: 0.85,
      });
      updatePersonalInfo("photo", dataUrl);
      triggerNotification("✨ Profile photo updated and optimized (400×400px)!");
    } catch (err) {
      triggerNotification(err?.message || "Failed to process photo.", "error");
    } finally {
      setIsProcessingPhoto(false);
      if (photoFileInputRef.current) {
        photoFileInputRef.current.value = "";
      }
    }
  }

  function handleRemovePhoto() {
    updatePersonalInfo("photo", "");
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = "";
    }
    triggerNotification("Photo removed.");
  }

  function triggerNotification(message, type = "success") {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
    setStatusMessage(message);
    setStatusType(type);
    statusTimerRef.current = setTimeout(() => {
      setStatusMessage("");
    }, 3500);
  }

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  // Reset active item index on section switch
  useEffect(() => {
    setActiveItemIndex(0);
    setStatusMessage("");
  }, [activeSection]);

  const currentMeta =
    SECTION_METADATA[activeSection] || SECTION_METADATA.personal;

  const activeTemplate = resumeData?.template || "modern";
  const supportsPhoto =
    currentTemplate?.supportsPhoto ??
    contextSupportsPhoto ??
    templateSupportsPhoto(activeTemplate);

  /* =========================================================
     Section Stepper (Next Section)
  ========================================================= */
  const currentIndex = SECTION_ORDER.indexOf(activeSection);
  const nextSectionId =
    currentIndex < SECTION_ORDER.length - 1
      ? SECTION_ORDER[currentIndex + 1]
      : SECTION_ORDER[0];

  function handleNextSection() {
    setActiveSection(nextSectionId);
  }

  /* =========================================================
     Rich-Text Toolbar Insertion Helper
  ========================================================= */
  const textareaRef = useRef(null);

  function applyFormatting(formatType, currentText, onUpdate) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selectedText = currentText.substring(start, end);

    let newText = currentText;
    let newCursorPos = end;

    switch (formatType) {
      case "bold":
        if (selectedText) {
          newText =
            currentText.substring(0, start) +
            `**${selectedText}**` +
            currentText.substring(end);
          newCursorPos = end + 4;
        } else {
          newText =
            currentText.substring(0, start) +
            "**bold text**" +
            currentText.substring(end);
          newCursorPos = start + 13;
        }
        break;
      case "italic":
        if (selectedText) {
          newText =
            currentText.substring(0, start) +
            `*${selectedText}*` +
            currentText.substring(end);
          newCursorPos = end + 2;
        } else {
          newText =
            currentText.substring(0, start) +
            "*italic text*" +
            currentText.substring(end);
          newCursorPos = start + 13;
        }
        break;
      case "underline":
        if (selectedText) {
          newText =
            currentText.substring(0, start) +
            `<u>${selectedText}</u>` +
            currentText.substring(end);
          newCursorPos = end + 7;
        } else {
          newText =
            currentText.substring(0, start) +
            "<u>underlined text</u>" +
            currentText.substring(end);
          newCursorPos = start + 22;
        }
        break;
      case "bullet":
        if (selectedText) {
          const lines = selectedText.split("\n");
          const bulleted = lines.map((l) => (l.startsWith("• ") ? l : `• ${l}`)).join("\n");
          newText =
            currentText.substring(0, start) +
            bulleted +
            currentText.substring(end);
          newCursorPos = start + bulleted.length;
        } else {
          newText =
            currentText.substring(0, start) +
            "\n• " +
            currentText.substring(end);
          newCursorPos = start + 3;
        }
        break;
      default:
        break;
    }

    onUpdate(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  }

  /* =========================================================
     AI Rewrite Handler
  ========================================================= */
  async function handleAiRewriteText(currentText, onUpdate) {
    if (!currentText || !currentText.trim()) {
      triggerNotification("Please enter some text before using AI Rewrite.", "error");
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await improveBulletPoint(currentText.trim());
      if (result?.rewrittenBullet) {
        onUpdate(result.rewrittenBullet);
        triggerNotification("✨ Text enhanced and polished with AI!");
        try {
          await refreshPricing();
        } catch {}
      }
    } catch (err) {
      triggerNotification(err?.message || "AI Rewrite failed. Please try again.", "error");
    } finally {
      setIsAiLoading(false);
    }
  }

  /* =========================================================
     SECTION 1: Personal Info
  ========================================================= */
  const personal = resumeData?.personalInfo || {};

  function renderPersonalInfo() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={personal.fullName || ""}
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Professional Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={personal.jobTitle || ""}
              onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={personal.email || ""}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
              placeholder="e.g. alex.morgan@email.com"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={personal.phone || ""}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Location / City, Country
            </label>
            <input
              type="text"
              name="location"
              value={personal.location || ""}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
              placeholder="e.g. New York, USA"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Portfolio / Website
            </label>
            <input
              type="text"
              name="website"
              value={personal.website || ""}
              onChange={(e) => updatePersonalInfo("website", e.target.value)}
              placeholder="e.g. https://portfolio.dev"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              LinkedIn Profile
            </label>
            <input
              type="text"
              name="linkedin"
              value={personal.linkedin || ""}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              placeholder="e.g. linkedin.com/in/username"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              GitHub Profile
            </label>
            <input
              type="text"
              name="github"
              value={personal.github || ""}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
              placeholder="e.g. github.com/username"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>
        </div>

        {supportsPhoto && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-4 sm:p-5 space-y-3.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Profile Photo / Avatar
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Featured on Modern Photo & Sidebar Photo templates. Auto-cropped to 400×400px.
                </p>
              </div>

              {/* URL toggle */}
              <button
                type="button"
                onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
                className="text-[11px] font-bold text-[#ff3366] hover:underline cursor-pointer"
              >
                {showPhotoUrlInput ? "Hide URL input" : "Or paste image URL"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Circular Live Thumbnail Preview */}
              <div className="relative h-20 w-20 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                {personal.photo ? (
                  <img
                    src={personal.photo}
                    alt="Profile thumbnail"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <HiPhoto size={28} />
                  </div>
                )}
                {isProcessingPhoto && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 w-full space-y-2">
                <input
                  ref={photoFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isProcessingPhoto}
                    onClick={() => photoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-60"
                  >
                    <HiArrowUpTray size={14} />
                    <span>{personal.photo ? "Change Photo" : "Upload Photo"}</span>
                  </button>

                  {personal.photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/60 transition cursor-pointer"
                    >
                      <HiTrash size={14} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  PNG, JPG, or WEBP up to 5MB. Automatically cropped & optimized.
                </p>
              </div>
            </div>

            {/* Optional URL input field (collapsible) */}
            {showPhotoUrlInput && (
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                  Image Direct URL
                </label>
                <input
                  type="text"
                  name="photo"
                  value={personal.photo || ""}
                  onChange={(e) => updatePersonalInfo("photo", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-xs text-slate-900 dark:text-white focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     SECTION 2: Summary
  ========================================================= */
  async function handleGenerateAiSummaries() {
    setIsAiLoading(true);
    try {
      const result = await generateSummaries(
        resumeData.experience || [],
        resumeData.skills || []
      );
      if (result?.summaries && result.summaries.length > 0) {
        updatePersonalInfo("summary", result.summaries[0]);
        triggerNotification("✨ Generated impactful summary tailored to your background!");
        try {
          await refreshPricing();
        } catch {}
      }
    } catch (err) {
      triggerNotification(err?.message || "Failed to generate summaries.", "error");
    } finally {
      setIsAiLoading(false);
    }
  }

  function renderSummary() {
    const summaryText = personal.summary || "";

    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Professional Summary
            </label>
            <button
              type="button"
              onClick={handleGenerateAiSummaries}
              disabled={isAiLoading}
              className="text-xs font-bold text-[#ff3366] hover:text-[#e62557] flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={14} />
              <span>{isAiLoading ? "Generating..." : "Generate with AI"}</span>
            </button>
          </div>

          {/* Attached Rich-Text & AI Toolbar Header */}
          <div className="rounded-t-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyFormatting("bold", summaryText, (t) => updatePersonalInfo("summary", t))}
                title="Bold"
                className="w-7 h-7 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("italic", summaryText, (t) => updatePersonalInfo("summary", t))}
                title="Italic"
                className="w-7 h-7 rounded-lg text-xs font-serif italic text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("underline", summaryText, (t) => updatePersonalInfo("summary", t))}
                title="Underline"
                className="w-7 h-7 rounded-lg text-xs underline text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("bullet", summaryText, (t) => updatePersonalInfo("summary", t))}
                title="Bullet List"
                className="w-7 h-7 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer font-bold"
              >
                •
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAiRewriteText(summaryText, (t) => updatePersonalInfo("summary", t))}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] shadow-xs hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={13} />
              <span>{isAiLoading ? "Rewriting..." : "AI Rewrite"}</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={6}
            value={summaryText}
            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
            placeholder="Write a concise overview of your background, key achievements, and target role..."
            className="w-full rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none resize-y min-h-[140px]"
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     SECTION 3: Work Experience
  ========================================================= */
  const experiences = resumeData?.experience || [];
  const currentExp = experiences[activeItemIndex] || {
    id: "temp",
    company: "",
    jobTitle: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  };

  function handleAddExperience() {
    const newExp = {
      company: "",
      jobTitle: "",
      employmentType: "Full-time",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    };
    addExperience(newExp);
    setActiveItemIndex(experiences.length);
  }

  function handleUpdateCurrentExp(field, value) {
    if (experiences[activeItemIndex]) {
      updateExperience(experiences[activeItemIndex].id, {
        [field]: value,
      });
    } else {
      addExperience({
        company: "",
        jobTitle: "",
        [field]: value,
      });
    }
  }

  function parseDateParts(dateStr = "") {
    const parts = dateStr.split(" ");
    if (parts.length === 2) {
      return { month: parts[0], year: parts[1] };
    }
    return { month: "", year: parts[0] || "" };
  }

  function renderExperience() {
    const startParts = parseDateParts(currentExp.startDate);
    const endParts = parseDateParts(currentExp.endDate);

    return (
      <div className="space-y-4">
        {/* Entry Tabs / Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {experiences.length === 0 ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/30">
              Position 1 (New Entry)
            </span>
          ) : (
            experiences.map((exp, idx) => (
              <button
                key={exp.id || idx}
                type="button"
                onClick={() => setActiveItemIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeItemIndex === idx
                    ? "bg-[#ff3366] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {exp.company || exp.jobTitle || `Position ${idx + 1}`}
              </button>
            ))
          )}

          <button
            type="button"
            onClick={handleAddExperience}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#ff3366] hover:text-[#ff3366] transition cursor-pointer"
          >
            <HiPlus size={14} />
            <span>Add Position</span>
          </button>
        </div>

        {/* 2-Column Grid of Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Company Name
            </label>
            <input
              type="text"
              value={currentExp.company || ""}
              onChange={(e) => handleUpdateCurrentExp("company", e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Job Title
            </label>
            <input
              type="text"
              value={currentExp.jobTitle || ""}
              onChange={(e) => handleUpdateCurrentExp("jobTitle", e.target.value)}
              placeholder="e.g. Senior Product Designer"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Employment Type
            </label>
            <select
              value={currentExp.employmentType || "Full-time"}
              onChange={(e) => handleUpdateCurrentExp("employmentType", e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Location / City, Country
            </label>
            <input
              type="text"
              value={currentExp.location || ""}
              onChange={(e) => handleUpdateCurrentExp("location", e.target.value)}
              placeholder="e.g. San Francisco, CA (or Remote)"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>
        </div>

        {/* Time Period: Month/Year Dropdowns + Checkbox */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Time Period
            </label>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#ff3366] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(currentExp.currentlyWorking)}
                onChange={(e) => {
                  handleUpdateCurrentExp("currentlyWorking", e.target.checked);
                  if (e.target.checked) {
                    handleUpdateCurrentExp("endDate", "Present");
                  }
                }}
                className="rounded text-[#ff3366] focus:ring-[#ff3366]"
              />
              <span>Currently working here</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Start Month */}
            <select
              value={startParts.month}
              onChange={(e) => {
                const newDate = `${e.target.value} ${startParts.year}`.trim();
                handleUpdateCurrentExp("startDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366]"
            >
              <option value="">Start Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Start Year */}
            <select
              value={startParts.year}
              onChange={(e) => {
                const newDate = `${startParts.month} ${e.target.value}`.trim();
                handleUpdateCurrentExp("startDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366]"
            >
              <option value="">Start Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* End Month */}
            <select
              disabled={Boolean(currentExp.currentlyWorking)}
              value={currentExp.currentlyWorking ? "" : endParts.month}
              onChange={(e) => {
                const newDate = `${e.target.value} ${endParts.year}`.trim();
                handleUpdateCurrentExp("endDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366] disabled:opacity-40"
            >
              <option value="">End Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* End Year */}
            <select
              disabled={Boolean(currentExp.currentlyWorking)}
              value={currentExp.currentlyWorking ? "Present" : endParts.year}
              onChange={(e) => {
                const newDate = `${endParts.month} ${e.target.value}`.trim();
                handleUpdateCurrentExp("endDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366] disabled:opacity-40"
            >
              <option value="">End Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attached Rich-Text & AI Toolbar Description Field */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
            Responsibilities & Key Achievements
          </label>

          <div className="rounded-t-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyFormatting("bold", currentExp.description || "", (t) => handleUpdateCurrentExp("description", t))}
                title="Bold"
                className="w-7 h-7 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("italic", currentExp.description || "", (t) => handleUpdateCurrentExp("description", t))}
                title="Italic"
                className="w-7 h-7 rounded-lg text-xs font-serif italic text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("underline", currentExp.description || "", (t) => handleUpdateCurrentExp("description", t))}
                title="Underline"
                className="w-7 h-7 rounded-lg text-xs underline text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("bullet", currentExp.description || "", (t) => handleUpdateCurrentExp("description", t))}
                title="Bullet List"
                className="w-7 h-7 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer font-bold"
              >
                •
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAiRewriteText(currentExp.description || "", (t) => handleUpdateCurrentExp("description", t))}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] shadow-xs hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={13} />
              <span>{isAiLoading ? "Rewriting..." : "AI Rewrite"}</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={5}
            value={currentExp.description || ""}
            onChange={(e) => handleUpdateCurrentExp("description", e.target.value)}
            placeholder="• Led cross-functional team of 6 engineers to ship high-impact feature&#10;• Increased system performance by 32% using optimized caching"
            className="w-full rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none resize-y min-h-[130px]"
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     SECTION 4: Education
  ========================================================= */
  const educations = resumeData?.education || [];
  const currentEdu = educations[activeItemIndex] || {
    id: "temp",
    school: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    grade: "",
    description: "",
  };

  function handleAddEducation() {
    const newEdu = {
      school: "",
      degree: "Bachelor of Science",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      grade: "",
      description: "",
    };
    addEducation(newEdu);
    setActiveItemIndex(educations.length);
  }

  function handleUpdateCurrentEdu(field, value) {
    if (educations[activeItemIndex]) {
      updateEducation(educations[activeItemIndex].id, {
        [field]: value,
      });
    } else {
      addEducation({
        school: "",
        [field]: value,
      });
    }
  }

  function renderEducation() {
    const startParts = parseDateParts(currentEdu.startDate);
    const endParts = parseDateParts(currentEdu.endDate);

    return (
      <div className="space-y-4">
        {/* Entry Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {educations.length === 0 ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/30">
              Degree 1 (New Entry)
            </span>
          ) : (
            educations.map((edu, idx) => (
              <button
                key={edu.id || idx}
                type="button"
                onClick={() => setActiveItemIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeItemIndex === idx
                    ? "bg-[#ff3366] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {edu.school || edu.degree || `Degree ${idx + 1}`}
              </button>
            ))
          )}

          <button
            type="button"
            onClick={handleAddEducation}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#ff3366] hover:text-[#ff3366] transition cursor-pointer"
          >
            <HiPlus size={14} />
            <span>Add Degree</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Institution Name
            </label>
            <input
              type="text"
              value={currentEdu.school || ""}
              onChange={(e) => handleUpdateCurrentEdu("school", e.target.value)}
              placeholder="e.g. Harvard University / MIT"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Field of Study / Major
            </label>
            <input
              type="text"
              value={currentEdu.field || ""}
              onChange={(e) => handleUpdateCurrentEdu("field", e.target.value)}
              placeholder="e.g. Computer Science / Business"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Degree
            </label>
            <input
              type="text"
              value={currentEdu.degree || ""}
              onChange={(e) => handleUpdateCurrentEdu("degree", e.target.value)}
              placeholder="e.g. Bachelor of Science"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Location / City, Country
            </label>
            <input
              type="text"
              value={currentEdu.location || ""}
              onChange={(e) => handleUpdateCurrentEdu("location", e.target.value)}
              placeholder="e.g. Boston, United States"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>
        </div>

        {/* Time Period */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Time Period
            </label>
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#ff3366] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(currentEdu.currentlyStudying)}
                onChange={(e) => {
                  handleUpdateCurrentEdu("currentlyStudying", e.target.checked);
                  if (e.target.checked) {
                    handleUpdateCurrentEdu("endDate", "Expected Graduation");
                  }
                }}
                className="rounded text-[#ff3366] focus:ring-[#ff3366]"
              />
              <span>Currently study here</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={startParts.month}
              onChange={(e) => {
                const newDate = `${e.target.value} ${startParts.year}`.trim();
                handleUpdateCurrentEdu("startDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366]"
            >
              <option value="">Start Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={startParts.year}
              onChange={(e) => {
                const newDate = `${startParts.month} ${e.target.value}`.trim();
                handleUpdateCurrentEdu("startDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366]"
            >
              <option value="">Start Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              disabled={Boolean(currentEdu.currentlyStudying)}
              value={currentEdu.currentlyStudying ? "" : endParts.month}
              onChange={(e) => {
                const newDate = `${e.target.value} ${endParts.year}`.trim();
                handleUpdateCurrentEdu("endDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366] disabled:opacity-40"
            >
              <option value="">End Month</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              disabled={Boolean(currentEdu.currentlyStudying)}
              value={currentEdu.currentlyStudying ? "Present" : endParts.year}
              onChange={(e) => {
                const newDate = `${endParts.month} ${e.target.value}`.trim();
                handleUpdateCurrentEdu("endDate", newDate);
              }}
              className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 text-sm text-slate-900 dark:text-white outline-none focus:border-[#ff3366] disabled:opacity-40"
            >
              <option value="">End Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attached Rich-Text Toolbar Description Field */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
            Academic Achievements & Relevant Coursework
          </label>

          <div className="rounded-t-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyFormatting("bold", currentEdu.description || "", (t) => handleUpdateCurrentEdu("description", t))}
                title="Bold"
                className="w-7 h-7 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("italic", currentEdu.description || "", (t) => handleUpdateCurrentEdu("description", t))}
                title="Italic"
                className="w-7 h-7 rounded-lg text-xs font-serif italic text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("underline", currentEdu.description || "", (t) => handleUpdateCurrentEdu("description", t))}
                title="Underline"
                className="w-7 h-7 rounded-lg text-xs underline text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("bullet", currentEdu.description || "", (t) => handleUpdateCurrentEdu("description", t))}
                title="Bullet List"
                className="w-7 h-7 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer font-bold"
              >
                •
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAiRewriteText(currentEdu.description || "", (t) => handleUpdateCurrentEdu("description", t))}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] shadow-xs hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={13} />
              <span>{isAiLoading ? "Rewriting..." : "AI Rewrite"}</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={4}
            value={currentEdu.description || ""}
            onChange={(e) => handleUpdateCurrentEdu("description", e.target.value)}
            placeholder="• Dean's Honor Roll (All semesters)&#10;• Relevant coursework: Algorithms, Distributed Systems, Machine Learning"
            className="w-full rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none resize-y min-h-[120px]"
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     SECTION 5: Skills
  ========================================================= */
  const skills = resumeData?.skills || [];
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Advanced");

  function handleAddSkillSubmit(e) {
    e?.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill({
      name: newSkillName.trim(),
      level: newSkillLevel,
    });
    setNewSkillName("");
    triggerNotification(`Added skill: ${newSkillName.trim()}`);
  }

  function renderSkills() {
    return (
      <div className="space-y-5">
        <form onSubmit={handleAddSkillSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. React, TypeScript, Python, Figma"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div className="w-full sm:w-44">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Proficiency
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] outline-none transition"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <HiPlus size={16} />
            <span>Add Skill</span>
          </button>
        </form>

        {/* Current Skills List */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
            Added Skills ({skills.length})
          </label>

          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No skills added yet. Add a skill above.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] font-normal text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-md">
                    {skill.level || "Skill"}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteSkill(skill.id)}
                    className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                    title="Remove Skill"
                  >
                    <HiXMark size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     SECTION 6: Projects
  ========================================================= */
  const projects = resumeData?.projects || [];
  const currentProj = projects[activeItemIndex] || {
    id: "temp",
    title: "",
    role: "",
    technologies: "",
    liveLink: "",
    githubLink: "",
    startDate: "",
    endDate: "",
    description: "",
  };

  function handleAddProject() {
    const newProj = {
      title: "",
      role: "",
      technologies: "",
      liveLink: "",
      githubLink: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    addProject(newProj);
    setActiveItemIndex(projects.length);
  }

  function handleUpdateCurrentProj(field, value) {
    if (projects[activeItemIndex]) {
      updateProject(projects[activeItemIndex].id, {
        [field]: value,
      });
    } else {
      addProject({
        title: "",
        [field]: value,
      });
    }
  }

  function renderProjects() {
    return (
      <div className="space-y-4">
        {/* Entry Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {projects.length === 0 ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/30">
              Project 1 (New Entry)
            </span>
          ) : (
            projects.map((proj, idx) => (
              <button
                key={proj.id || idx}
                type="button"
                onClick={() => setActiveItemIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeItemIndex === idx
                    ? "bg-[#ff3366] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {proj.title || `Project ${idx + 1}`}
              </button>
            ))
          )}

          <button
            type="button"
            onClick={handleAddProject}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#ff3366] hover:text-[#ff3366] transition cursor-pointer"
          >
            <HiPlus size={14} />
            <span>Add Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Project Title
            </label>
            <input
              type="text"
              value={currentProj.title || ""}
              onChange={(e) => handleUpdateCurrentProj("title", e.target.value)}
              placeholder="e.g. AI Workflow Platform"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Your Role
            </label>
            <input
              type="text"
              value={currentProj.role || ""}
              onChange={(e) => handleUpdateCurrentProj("role", e.target.value)}
              placeholder="e.g. Lead Architect / Full-Stack"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Technologies Used
            </label>
            <input
              type="text"
              value={
                Array.isArray(currentProj.technologies)
                  ? currentProj.technologies.join(", ")
                  : currentProj.technologies || ""
              }
              onChange={(e) => handleUpdateCurrentProj("technologies", e.target.value)}
              placeholder="e.g. Next.js, Node.js, Supabase, Tailwind"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Live Link / Demo URL
            </label>
            <input
              type="text"
              value={currentProj.liveLink || ""}
              onChange={(e) => handleUpdateCurrentProj("liveLink", e.target.value)}
              placeholder="e.g. https://myproject.app"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>
        </div>

        {/* Attached Rich-Text Toolbar Description Field */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
            Project Overview & Contributions
          </label>

          <div className="rounded-t-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyFormatting("bold", currentProj.description || "", (t) => handleUpdateCurrentProj("description", t))}
                title="Bold"
                className="w-7 h-7 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("italic", currentProj.description || "", (t) => handleUpdateCurrentProj("description", t))}
                title="Italic"
                className="w-7 h-7 rounded-lg text-xs font-serif italic text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("underline", currentProj.description || "", (t) => handleUpdateCurrentProj("description", t))}
                title="Underline"
                className="w-7 h-7 rounded-lg text-xs underline text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("bullet", currentProj.description || "", (t) => handleUpdateCurrentProj("description", t))}
                title="Bullet List"
                className="w-7 h-7 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer font-bold"
              >
                •
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAiRewriteText(currentProj.description || "", (t) => handleUpdateCurrentProj("description", t))}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] shadow-xs hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={13} />
              <span>{isAiLoading ? "Rewriting..." : "AI Rewrite"}</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={4}
            value={currentProj.description || ""}
            onChange={(e) => handleUpdateCurrentProj("description", e.target.value)}
            placeholder="• Architected microservices backend handling 50k daily requests&#10;• Implemented automated CI/CD pipeline reducing release cycles by 40%"
            className="w-full rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none resize-y min-h-[120px]"
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     SECTION 7: Certifications
  ========================================================= */
  const certifications = resumeData?.certifications || [];
  const currentCert = certifications[activeItemIndex] || {
    id: "temp",
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    neverExpires: false,
    credentialId: "",
    credentialUrl: "",
    description: "",
  };

  function handleAddCertification() {
    const newCert = {
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      neverExpires: false,
      credentialId: "",
      credentialUrl: "",
      description: "",
    };
    addCertification(newCert);
    setActiveItemIndex(certifications.length);
  }

  function handleUpdateCurrentCert(field, value) {
    if (certifications[activeItemIndex]) {
      updateCertification(certifications[activeItemIndex].id, {
        [field]: value,
      });
    } else {
      addCertification({
        name: "",
        [field]: value,
      });
    }
  }

  function renderCertifications() {
    return (
      <div className="space-y-4">
        {/* Entry Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          {certifications.length === 0 ? (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ff3366]/10 text-[#ff3366] border border-[#ff3366]/30">
              Certificate 1 (New Entry)
            </span>
          ) : (
            certifications.map((cert, idx) => (
              <button
                key={cert.id || idx}
                type="button"
                onClick={() => setActiveItemIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeItemIndex === idx
                    ? "bg-[#ff3366] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cert.name || `Certificate ${idx + 1}`}
              </button>
            ))
          )}

          <button
            type="button"
            onClick={handleAddCertification}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#ff3366] hover:text-[#ff3366] transition cursor-pointer"
          >
            <HiPlus size={14} />
            <span>Add Certificate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Certificate Name
            </label>
            <input
              type="text"
              value={currentCert.name || ""}
              onChange={(e) => handleUpdateCurrentCert("name", e.target.value)}
              placeholder="e.g. AWS Solutions Architect Professional"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Issuing Organization
            </label>
            <input
              type="text"
              value={currentCert.issuer || ""}
              onChange={(e) => handleUpdateCurrentCert("issuer", e.target.value)}
              placeholder="e.g. Amazon Web Services (AWS)"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Issue Date (Year or Month Year)
            </label>
            <input
              type="text"
              value={currentCert.issueDate || ""}
              onChange={(e) => handleUpdateCurrentCert("issueDate", e.target.value)}
              placeholder="e.g. 2024"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Credential ID
            </label>
            <input
              type="text"
              value={currentCert.credentialId || ""}
              onChange={(e) => handleUpdateCurrentCert("credentialId", e.target.value)}
              placeholder="e.g. AWS-12345678"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition"
            />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     SECTION 8: Cover Letter
  ========================================================= */
  const [coverRecipient, setCoverRecipient] = useState("Hiring Team");
  const [coverCompany, setCoverCompany] = useState("");
  const [coverRole, setCoverRole] = useState("");
  const [coverBody, setCoverBody] = useState("");

  async function handleGenerateCoverLetterDraft() {
    if (!coverRole.trim() && !coverCompany.trim()) {
      triggerNotification("Enter a job title or target company to generate cover letter.", "error");
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await generateCoverLetter(
        coverRole || personal.jobTitle || "Software Engineer",
        coverCompany || "Target Company",
        "Seeking an experienced professional to drive business growth and technical excellence.",
        {
          fullName: personal.fullName || "Candidate",
          email: personal.email || "",
          experience: resumeData.experience || [],
          skills: resumeData.skills || [],
        }
      );
      if (result?.coverLetter) {
        setCoverBody(result.coverLetter);
        triggerNotification("✨ Cover letter draft created successfully!");
        try {
          await refreshPricing();
        } catch {}
      }
    } catch (err) {
      triggerNotification(err?.message || "Cover letter generation failed.", "error");
    } finally {
      setIsAiLoading(false);
    }
  }

  function renderCoverLetter() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Recipient Name / Team
            </label>
            <input
              type="text"
              value={coverRecipient}
              onChange={(e) => setCoverRecipient(e.target.value)}
              placeholder="e.g. Hiring Manager"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Target Company
            </label>
            <input
              type="text"
              value={coverCompany}
              onChange={(e) => setCoverCompany(e.target.value)}
              placeholder="e.g. Google, Stripe"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Target Role
            </label>
            <input
              type="text"
              value={coverRole}
              onChange={(e) => setCoverRole(e.target.value)}
              placeholder="e.g. Product Manager"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Letter Body
            </label>
            <button
              type="button"
              onClick={handleGenerateCoverLetterDraft}
              disabled={isAiLoading}
              className="text-xs font-bold text-[#ff3366] hover:text-[#e62557] flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={14} />
              <span>{isAiLoading ? "Writing with AI..." : "AI Generate Letter"}</span>
            </button>
          </div>

          <div className="rounded-t-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyFormatting("bold", coverBody, setCoverBody)}
                title="Bold"
                className="w-7 h-7 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("italic", coverBody, setCoverBody)}
                title="Italic"
                className="w-7 h-7 rounded-lg text-xs font-serif italic text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormatting("underline", coverBody, setCoverBody)}
                title="Underline"
                className="w-7 h-7 rounded-lg text-xs underline text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                U
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAiRewriteText(coverBody, setCoverBody)}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] shadow-xs hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-50"
            >
              <HiSparkles size={13} />
              <span>{isAiLoading ? "Rewriting..." : "AI Polish"}</span>
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={7}
            value={coverBody}
            onChange={(e) => setCoverBody(e.target.value)}
            placeholder="Dear Hiring Team,&#10;&#10;I am writing to express my strong interest in the role..."
            className="w-full rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3.5 text-sm text-slate-900 dark:text-white focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none resize-y min-h-[160px]"
          />
        </div>
      </div>
    );
  }

  /* =========================================================
     Section Dispatcher
  ========================================================= */
  function renderActiveForm() {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfo();
      case "summary":
        return renderSummary();
      case "experience":
        return renderExperience();
      case "education":
        return renderEducation();
      case "skills":
        return renderSkills();
      case "projects":
        return renderProjects();
      case "certifications":
        return renderCertifications();
      case "cover-letter":
        return renderCoverLetter();
      default:
        return renderPersonalInfo();
    }
  }

  /* =========================================================
     Utility Actions (Header: Tip, AI, Clear/Delete)
  ========================================================= */
  function handleDeleteCurrent() {
    switch (activeSection) {
      case "experience":
        if (experiences[activeItemIndex]) {
          deleteExperience(experiences[activeItemIndex].id);
          setActiveItemIndex(Math.max(0, activeItemIndex - 1));
          triggerNotification("Position deleted");
        }
        break;
      case "education":
        if (educations[activeItemIndex]) {
          deleteEducation(educations[activeItemIndex].id);
          setActiveItemIndex(Math.max(0, activeItemIndex - 1));
          triggerNotification("Degree deleted");
        }
        break;
      case "skills":
        if (skills.length > 0) {
          deleteSkill(skills[skills.length - 1].id);
          triggerNotification("Latest skill removed");
        }
        break;
      case "projects":
        if (projects[activeItemIndex]) {
          deleteProject(projects[activeItemIndex].id);
          setActiveItemIndex(Math.max(0, activeItemIndex - 1));
          triggerNotification("Project deleted");
        }
        break;
      case "certifications":
        if (certifications[activeItemIndex]) {
          deleteCertification(certifications[activeItemIndex].id);
          setActiveItemIndex(Math.max(0, activeItemIndex - 1));
          triggerNotification("Certification deleted");
        }
        break;
      case "summary":
        updatePersonalInfo("summary", "");
        triggerNotification("Summary cleared");
        break;
      default:
        break;
    }
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 flex flex-col justify-between min-h-[580px] transition-colors relative">
      {/* Top Header of the Card */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            {currentMeta.title}
          </h3>

          {/* Compact Utility Icon Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* ? Writing Tip Button */}
            <button
              type="button"
              onClick={() => setShowTip(!showTip)}
              title="Toggle Writing Tip"
              className={`p-2 rounded-xl transition cursor-pointer ${
                showTip
                  ? "bg-[#ff3366]/10 text-[#ff3366]"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <HiQuestionMarkCircle size={20} />
            </button>

            {/* ✏️ / ✨ AI Assist */}
            <button
              type="button"
              onClick={() => {
                if (activeSection === "summary") {
                  handleGenerateAiSummaries();
                } else if (activeSection === "cover-letter") {
                  handleGenerateCoverLetterDraft();
                } else if (activeSection === "experience") {
                  handleAiRewriteText(currentExp.description || "", (t) => handleUpdateCurrentExp("description", t));
                } else if (activeSection === "education") {
                  handleAiRewriteText(currentEdu.description || "", (t) => handleUpdateCurrentEdu("description", t));
                } else if (activeSection === "projects") {
                  handleAiRewriteText(currentProj.description || "", (t) => handleUpdateCurrentProj("description", t));
                } else {
                  triggerNotification("✨ Section active and ready for editing.");
                }
              }}
              title="AI Assist for Section"
              className="p-2 rounded-xl text-[#ff3366] hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              <HiPencilSquare size={20} />
            </button>

            {/* 🗑️ Clear / Delete Entry */}
            <button
              type="button"
              onClick={handleDeleteCurrent}
              title="Delete or Clear Entry"
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
            >
              <HiTrash size={20} />
            </button>
          </div>
        </div>

        {/* Expandable Tip Banner */}
        <AnimatePresence>
          {showTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-3.5 text-xs text-rose-900 dark:text-rose-200 leading-relaxed flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold shrink-0">💡 Writing Tip:</span>
                  <span>{currentMeta.writingTip}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTip(false)}
                  className="text-rose-400 hover:text-rose-600 transition cursor-pointer"
                >
                  <HiXMark size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-Dismissing (3.5s) Notification Popup */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`mb-4 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs font-semibold shadow-xs ${
                statusType === "error"
                  ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200"
                  : "border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <HiSparkles size={14} className="text-[#ff3366] shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage("")}
                className="text-current opacity-60 hover:opacity-100 transition cursor-pointer"
              >
                <HiXMark size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Focused Section Form */}
        <div className="pb-6">
          {renderActiveForm()}
        </div>
      </div>

      {/* Card Footer: Side-by-Side Preview & Next Section Buttons */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onPreviewResume}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <HiEye size={16} />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={handleNextSection}
          className="rounded-xl bg-gradient-to-r from-[#ff3366] via-[#ff416c] to-[#ff4b2b] hover:from-[#e62557] hover:to-[#e63a1f] text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md shadow-[#ff3366]/25 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Next Section</span>
          <HiArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
