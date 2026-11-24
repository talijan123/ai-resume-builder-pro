import React from "react";
import {
  HiUser,
  HiDocumentText,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
  HiEnvelope,
  HiSparkles,
} from "react-icons/hi2";
import { useResume } from "../../context/ResumeContext";

/* =========================================================
   8 Tile Definitions
========================================================= */

export const SECTION_TILES = [
  {
    id: "personal",
    label: "Personal Info",
    icon: HiUser,
  },
  {
    id: "summary",
    label: "Summary",
    icon: HiDocumentText,
  },
  {
    id: "experience",
    label: "Work Experience",
    icon: HiBriefcase,
  },
  {
    id: "education",
    label: "Education",
    icon: HiAcademicCap,
  },
  {
    id: "skills",
    label: "Skills",
    icon: HiWrenchScrewdriver,
  },
  {
    id: "projects",
    label: "Projects",
    icon: HiFolder,
  },
  {
    id: "certifications",
    label: "Certificates",
    icon: HiTrophy,
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: HiEnvelope,
  },
];

export default function SectionTileGrid({ onTriggerAiFullDraft }) {
  const { activeSection, setActiveSection, resumeData } = useResume();

  // Helper to count entries per section
  function getSectionCount(id) {
    if (!resumeData) return null;
    switch (id) {
      case "experience":
        return resumeData.experience?.length || null;
      case "education":
        return resumeData.education?.length || null;
      case "skills":
        return resumeData.skills?.length || null;
      case "projects":
        return resumeData.projects?.length || null;
      case "certifications":
        return resumeData.certifications?.length || null;
      default:
        return null;
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* 2-Column Square Floating Tile Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {SECTION_TILES.map((tile) => {
          const Icon = tile.icon;
          const isActive = activeSection === tile.id;
          const count = getSectionCount(tile.id);

          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => setActiveSection(tile.id)}
              className={`group relative aspect-square p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-2 border-[#ff3366] dark:border-rose-400 ring-4 ring-[#ff3366]/15 dark:ring-rose-400/20 shadow-lg shadow-[#ff3366]/10 -translate-y-0.5"
                  : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-[#ff3366]/40 dark:hover:border-rose-400/40 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Optional Entry Count Pill */}
              {count !== null && (
                <span
                  className={`absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#ff3366] text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/40 group-hover:text-[#ff3366]"
                  }`}
                >
                  {count}
                </span>
              )}

              {/* Centered Colored Icon */}
              <div
                className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl transition-all duration-200 mb-2 ${
                  isActive
                    ? "bg-[#ff3366] text-white shadow-md shadow-[#ff3366]/30"
                    : "bg-rose-50 dark:bg-rose-950/40 text-[#ff3366] dark:text-rose-400 group-hover:bg-[#ff3366]/10"
                }`}
              >
                <Icon size={22} />
              </div>

              {/* Clean Label */}
              <span
                className={`text-xs font-bold tracking-tight transition-colors ${
                  isActive
                    ? "text-[#ff3366] dark:text-rose-400"
                    : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                }`}
              >
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary Full-Width CTA Directly Below Grid */}
      <button
        type="button"
        onClick={onTriggerAiFullDraft}
        className="w-full mt-4 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ff3366] via-[#ff416c] to-[#ff4b2b] hover:from-[#e62557] hover:to-[#e63a1f] text-white font-bold text-sm shadow-lg shadow-[#ff3366]/30 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
      >
        <HiSparkles size={18} className="animate-pulse" />
        <span>AI Full Draft</span>
      </button>
    </div>
  );
}
