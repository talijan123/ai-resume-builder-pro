import {
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
  HiCheckCircle,
  HiExclamationTriangle,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";
import { calculateResumeCompletion } from "../../utils/resumeCompletion";
import calculateATSScore from "../../utils/ats/calculateATSScore";

const sections = [
  {
    id: "personal",
    title: "Personal Info",
    icon: HiUser,
  },
  {
    id: "experience",
    title: "Experience",
    icon: HiBriefcase,
  },
  {
    id: "education",
    title: "Education",
    icon: HiAcademicCap,
  },
  {
    id: "skills",
    title: "Skills",
    icon: HiWrenchScrewdriver,
  },
  {
    id: "projects",
    title: "Projects",
    icon: HiFolder,
  },
  {
    id: "certifications",
    title: "Certificates",
    icon: HiTrophy,
  },
];

export default function BuilderSidebar() {
  const {
    activeSection,
    setActiveSection,
    resumeData,
  } = useResume();

  const {
    percentage,
    completedSections,
  } = calculateResumeCompletion(resumeData);

  const ats = calculateATSScore(resumeData);

  function getATSColor(score) {
    if (score >= 90)
      return {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "from-green-500 to-emerald-500",
      };

    if (score >= 75)
      return {
        text: "text-blue-600 dark:text-blue-400",
        bg: "from-blue-500 to-indigo-500",
      };

    if (score >= 60)
      return {
        text: "text-yellow-600 dark:text-amber-400",
        bg: "from-yellow-500 to-orange-500",
      };

    return {
      text: "text-red-600 dark:text-red-400",
      bg: "from-red-500 to-pink-500",
    };
  }

  const color = getATSColor(ats.score);

  return (
    <div
      className="
        sticky
        top-24
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        shadow-sm
        overflow-hidden
        transition-colors
      "
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
          Resume Sections
        </h2>

        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Complete each section to build an ATS-friendly resume.
        </p>
      </div>

      {/* Navigation */}
      <div className="p-3 sm:p-4 space-y-1.5">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;
          const completed = completedSections.includes(section.id);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-3.5
                py-2.5
                text-xs
                sm:text-sm
                font-bold
                transition-all
                cursor-pointer
                ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{section.title}</span>
              </div>

              {completed && (
                <HiCheckCircle
                  size={18}
                  className={
                    active
                      ? "text-white"
                      : "text-emerald-600 dark:text-emerald-400"
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Resume Completion */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Completion
          </span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {percentage}%
          </span>
        </div>

        <div className="mt-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* ATS Score */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            ATS Score
          </span>
          <span className={`text-xl font-black ${color.text}`}>
            {ats.score}/100
          </span>
        </div>

        <div className="mt-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color.bg}`}
            style={{ width: `${ats.score}%` }}
          />
        </div>

        <div className="mt-4 space-y-2">
          {ats.suggestions.length > 0 ? (
            ats.suggestions.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs">
                <HiExclamationTriangle
                  className="mt-0.5 text-amber-500 shrink-0"
                  size={15}
                />
                <p className="text-slate-600 dark:text-slate-400 leading-5">
                  {item}
                </p>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <HiCheckCircle
                className="text-emerald-600 dark:text-emerald-400 shrink-0"
                size={16}
              />
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                Excellent! Resume is ATS-optimized.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}