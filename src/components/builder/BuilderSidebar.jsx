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
        text: "text-green-600",
        bg: "from-green-500 to-emerald-500",
      };

    if (score >= 75)
      return {
        text: "text-blue-600",
        bg: "from-blue-500 to-indigo-500",
      };

    if (score >= 60)
      return {
        text: "text-yellow-600",
        bg: "from-yellow-500 to-orange-500",
      };

    return {
      text: "text-red-600",
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
        bg-white

        shadow-sm
        overflow-hidden
      "
    >
      {/* Header */}

      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-black text-slate-900">
          Resume Sections
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Complete every section to build a
          professional ATS-friendly resume.
        </p>
      </div>

      {/* Navigation */}

      <div className="p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;

          const active =
            activeSection === section.id;

          const completed =
            completedSections.includes(section.id);

          return (
            <button
              key={section.id}
              onClick={() =>
                setActiveSection(section.id)
              }
              className={`
                flex
                w-full
                items-center
                justify-between

                rounded-2xl

                px-4
                py-3

                transition-all

                ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />

                <span className="font-medium">
                  {section.title}
                </span>
              </div>

              {completed && (
                <HiCheckCircle
                  size={20}
                  className={
                    active
                      ? "text-white"
                      : "text-green-600"
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Resume Completion */}

      <div className="border-t border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">
            Resume Completion
          </span>

          <span className="font-bold text-blue-600">
            {percentage}%
          </span>
        </div>

        <div className="mt-3 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              transition-all
              duration-500
            "
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      {/* ATS Score */}

      <div className="border-t border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-700">
            ATS Score
          </span>

          <span
            className={`text-2xl font-black ${color.text}`}
          >
            {ats.score}/100
          </span>
        </div>

        <div className="mt-3 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${color.bg}`}
            style={{
              width: `${ats.score}%`,
            }}
          />
        </div>

        <div className="mt-5 space-y-3">
          {ats.suggestions.length > 0 ? (
            ats.suggestions
              .slice(0, 3)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <HiExclamationTriangle
                    className="mt-0.5 text-yellow-500"
                    size={18}
                  />

                  <p className="text-sm text-slate-600 leading-6">
                    {item}
                  </p>
                </div>
              ))
          ) : (
            <div className="flex items-center gap-3">
              <HiCheckCircle
                className="text-green-600"
                size={18}
              />

              <p className="text-sm text-green-700">
                Excellent! Your resume is
                ATS-friendly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}