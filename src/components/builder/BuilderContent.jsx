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
        bg-white
        shadow-sm
      "
    >
      {/* ======================================
          Header
      ======================================= */}

      <div className="border-b border-slate-200 p-6">

        <div className="flex items-center justify-between gap-6">

          {/* Section Information */}

          <div className="flex items-center gap-5">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center

                rounded-2xl

                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                text-white
              "
            >
              <Icon size={28} />
            </div>

            <div>
              <h2
                className="
                  text-3xl
                  font-black
                  text-slate-900
                "
              >
                {current.title}
              </h2>

              <p
                className="
                  mt-2
                  text-slate-500
                "
              >
                {current.description}
              </p>
            </div>

          </div>

          {/* Status */}

          <div
            className="
              hidden
              items-center
              gap-2

              rounded-full

              bg-green-50

              px-4
              py-2

              text-sm
              font-medium

              text-green-700

              md:flex
            "
          >
            <div
              className="
                h-2
                w-2
                rounded-full
                bg-green-500
              "
            />

            Editing Draft
          </div>

        </div>
      </div>

      {/* ======================================
          Active Form
      ======================================= */}

      <div className="p-8">
        {renderSection()}
      </div>

      {/* ======================================
          AI GENERATION
      ======================================= */}

      <div
        className="
          border-t
          border-slate-200

          bg-slate-50

          p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5

            rounded-3xl

            border
            border-blue-100

            bg-white

            p-6

            shadow-sm

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* Text */}

          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center

                rounded-2xl

                bg-gradient-to-br
                from-blue-500
                to-indigo-600

                text-white
              "
            >
              <HiSparkles size={24} />
            </div>

            <div>
              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                AI Resume Generation
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Generate an optimized resume using
                your profile information and AI.
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-blue-600
                "
              >
                1 credit will be used for each
                generation.
              </p>
            </div>

          </div>

          {/* Generate Button */}

          <button
            type="button"
            onClick={onGenerateResume}
            disabled={
              generating ||
              !onGenerateResume
            }
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-2xl

              bg-gradient-to-r
              from-blue-600
              to-indigo-600

              px-6
              py-3.5

              font-semibold
              text-white

              shadow-lg
              shadow-blue-500/20

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:shadow-xl

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <HiSparkles size={20} />

            {generating
              ? "Generating..."
              : "Generate Resume"}
          </button>

        </div>
      </div>
    </div>
  );
}