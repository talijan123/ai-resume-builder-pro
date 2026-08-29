import { useResume } from "../../context/ResumeContext";

import {
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
  HiSparkles,
} from "react-icons/hi2";

import BuilderTabs from "./BuilderTabs";
import PersonalInfoForm from "./sections/PersonalInfoForm";
import ExperienceForm from "./sections/ExperienceForm";
import EducationForm from "./sections/EducationForm";
import SkillsForm from "./sections/SkillsForm";
import ProjectsForm from "./sections/ProjectsForm";
import CertificationsForm from "./sections/CertificationsForm";

/* ==========================================
   Sections
========================================== */

const sections = {
  personal: {
    title: "Personal Information",
    description:
      "Tell employers who you are and how they can contact you.",
    icon: HiUser,
  },

  experience: {
    title: "Work Experience",
    description:
      "Showcase your professional work experience.",
    icon: HiBriefcase,
  },

  education: {
    title: "Education",
    description:
      "Add your educational background.",
    icon: HiAcademicCap,
  },

  skills: {
    title: "Skills",
    description:
      "Highlight your technical and professional skills.",
    icon: HiWrenchScrewdriver,
  },

  projects: {
    title: "Projects",
    description:
      "Show your best projects and achievements.",
    icon: HiFolder,
  },

  certifications: {
    title: "Certificates",
    description:
      "Add certifications and professional courses.",
    icon: HiTrophy,
  },
};

/* ==========================================
   Builder Content
========================================== */

export default function BuilderContent({
  onGenerateResume,
  generating = false,
}) {
  const { activeSection } = useResume();

  const current =
    sections[activeSection] ||
    sections.personal;

  const Icon = current.icon;

  /* ==========================================
     Render Active Section
  ========================================== */

  function renderSection() {
    switch (activeSection) {
      case "personal":
        return <PersonalInfoForm />;

      case "experience":
        return <ExperienceForm />;

      case "education":
        return <EducationForm />;

      case "skills":
        return <SkillsForm />;

      case "projects":
        return <ProjectsForm />;

      case "certifications":
        return <CertificationsForm />;

      default:
        return <PersonalInfoForm />;
    }
  }

  return (
    <div
      className="
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
      {/* Mobile / Tablet Horizontal Section Navigation Tabs */}
      <div className="xl:hidden">
        <BuilderTabs />
      </div>

      {/* ======================================
          Header
      ======================================= */}
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Section Information */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div
              className="
                flex
                h-11
                w-11
                sm:h-13
                sm:w-13
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                shadow-md
                shadow-blue-500/20
              "
            >
              <Icon size={24} />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                {current.title}
              </h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                {current.description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="
              hidden
              sm:flex
              items-center
              gap-2
              rounded-full
              bg-green-50
              dark:bg-green-500/10
              border
              border-green-200
              dark:border-green-500/30
              px-3.5
              py-1.5
              text-xs
              font-bold
              text-green-700
              dark:text-green-300
              shrink-0
            "
          >
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Editing</span>
          </div>
        </div>
      </div>

      {/* ======================================
          Active Form
      ======================================= */}
      <div className="p-4 sm:p-6 lg:p-8">
        {renderSection()}
      </div>

      {/* ======================================
          AI GENERATION PROMPT FOOTER
      ======================================= */}
      <div
        className="
          border-t
          border-slate-200
          dark:border-slate-800
          bg-slate-50/70
          dark:bg-slate-950/60
          p-4
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-blue-100
            dark:border-blue-500/30
            bg-white
            dark:bg-slate-900
            p-4
            sm:p-6
            shadow-sm
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Text */}
          <div className="flex items-start gap-3.5">
            <div
              className="
                flex
                h-10
                w-10
                sm:h-12
                sm:w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-500
                to-indigo-600
                text-white
                shadow-md
                shadow-blue-500/20
              "
            >
              <HiSparkles size={22} />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                AI Resume Generation
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Generate an optimized resume draft using your profile info and AI.
              </p>
              <p className="mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                1 credit will be used for each draft.
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={onGenerateResume}
            disabled={generating || !onGenerateResume}
            className="
              inline-flex
              w-full
              sm:w-auto
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-5
              py-3
              text-xs
              sm:text-sm
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition-all
              hover:shadow-xl
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-60
              cursor-pointer
            "
          >
            <HiSparkles size={18} />
            <span>{generating ? "Generating..." : "Generate Resume"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}