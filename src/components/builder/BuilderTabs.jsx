import React from "react";
import {
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
  HiCheck,
  HiSparkles,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";
import { calculateResumeCompletion } from "../../utils/resumeCompletion";
import calculateATSScore from "../../utils/ats/calculateATSScore";

const tabs = [
  {
    id: "personal",
    label: "Personal",
    icon: HiUser,
  },
  {
    id: "experience",
    label: "Experience",
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
];

export default function BuilderTabs({ onToggleAi, showAi = false }) {
  const { activeSection, setActiveSection, resumeData } = useResume();
  const { percentage, completedSections } = calculateResumeCompletion(resumeData);
  const atsResult = calculateATSScore(resumeData);
  const atsScore = typeof atsResult === "number" ? atsResult : atsResult?.score || 0;

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-5 py-2.5 sm:py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Horizontal Navigation Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            const isDone = completedSections.includes(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                }`}
              >
                <Icon
                  size={15}
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                  }`}
                />
                <span>{tab.label}</span>

                {isDone && (
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    <HiCheck size={10} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Info: Completion & ATS Score Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            title={`Resume Completion: ${percentage}%`}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400"
          >
            <div className="h-1.5 w-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span>{percentage}%</span>
          </div>

          <div
            title={`ATS Optimization Score: ${atsScore}/100`}
            className={`hidden md:flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
              atsScore >= 80
                ? "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                : atsScore >= 60
                ? "border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span>ATS</span>
            <span className="font-extrabold">{atsScore}</span>
          </div>

          {onToggleAi && (
            <button
              type="button"
              onClick={onToggleAi}
              title="Toggle AI Generation & ATS Scanner"
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                showAi
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-blue-400"
              }`}
            >
              <HiSparkles size={14} className="text-blue-500" />
              <span className="hidden sm:inline">AI Tools</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}