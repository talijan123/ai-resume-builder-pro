import {
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
  HiCheckCircle,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";
import { calculateResumeCompletion } from "../../utils/resumeCompletion";

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

  return (
    <div
      className="
        sticky
        top-24

        rounded-3xl

        border
        border-slate-200

        bg-white

        p-6

        shadow-sm
      "
    >
      {/* Heading */}

      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900">
          Resume Sections
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Complete every section to build a
          professional resume.
        </p>
      </div>

      {/* Navigation */}

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;

          const active =
            activeSection === section.id;

          const completed =
            completedSections.includes(
              section.id
            );

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

                px-5
                py-4

                transition-all
                duration-300

                ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "hover:bg-slate-100 text-slate-700"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <Icon size={22} />

                <span className="font-medium">
                  {section.title}
                </span>
              </div>

              {completed && (
                <HiCheckCircle
                  className={
                    active
                      ? "text-white"
                      : "text-green-600"
                  }
                  size={20}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress */}

      <div
        className="
          mt-10

          rounded-2xl

          bg-slate-50

          p-5
        "
      >
        <div className="flex justify-between">
          <span className="text-sm font-medium text-slate-500">
            Resume Completion
          </span>

          <span className="font-bold text-blue-600">
            {percentage}%
          </span>
        </div>

        <div
          className="
            mt-4

            h-3

            overflow-hidden

            rounded-full

            bg-slate-200
          "
        >
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

        <p className="mt-4 text-sm leading-6 text-slate-500">
          Complete every section to unlock
          your best ATS score.
        </p>
      </div>
    </div>
  );
}