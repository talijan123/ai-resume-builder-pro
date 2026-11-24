import React from "react";
import { useResume } from "../../context/ResumeContext";

import {
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiWrenchScrewdriver,
  HiFolder,
  HiTrophy,
  HiArrowRight,
  HiArrowLeft,
} from "react-icons/hi2";

import BuilderTabs from "./BuilderTabs";
import PersonalInfoForm from "./sections/PersonalInfoForm";
import ExperienceForm from "./sections/ExperienceForm";
import EducationForm from "./sections/EducationForm";
import SkillsForm from "./sections/SkillsForm";
import ProjectsForm from "./sections/ProjectsForm";
import CertificationsForm from "./sections/CertificationsForm";

/* ==========================================
   Sections Definition
========================================== */

const sections = {
  personal: {
    title: "Personal Information",
    description: "Tell employers who you are and how they can contact you.",
    icon: HiUser,
  },
  experience: {
    title: "Work Experience",
    description: "Showcase your professional work experience and achievements.",
    icon: HiBriefcase,
  },
  education: {
    title: "Education",
    description: "Add your educational qualifications and academic background.",
    icon: HiAcademicCap,
  },
  skills: {
    title: "Skills",
    description: "Highlight your key technical and professional capabilities.",
    icon: HiWrenchScrewdriver,
  },
  projects: {
    title: "Projects",
    description: "Display notable projects, open-source work, and achievements.",
    icon: HiFolder,
  },
  certifications: {
    title: "Certificates",
    description: "Add certifications, licenses, and verified accreditations.",
    icon: HiTrophy,
  },
};

const sectionOrder = [
  "personal",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

export default function BuilderContent({
  onViewPreview,
}) {
  const { activeSection, setActiveSection } = useResume();

  const current = sections[activeSection] || sections.personal;
  const Icon = current.icon;

  const currentIndex = sectionOrder.indexOf(activeSection);
  const prevSectionId = currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;
  const nextSectionId =
    currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

  /* ==========================================
     Render Active Section Form
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
    <div className="flex h-full flex-col min-h-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Pinned Section Navigation Bar */}
      <BuilderTabs />

      {/* Independently Scrollable Form Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 sm:px-8 pt-5 sm:pt-7 pb-12">
        {/* Active Section Header */}
        <div className="mb-6 sm:mb-8 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">
              <Icon size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {current.title}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {current.description}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Editing</span>
          </div>
        </div>

        {/* Active Form */}
        <div className="pb-8">
          {renderSection()}
        </div>

        {/* Section Navigation Footer (Prev / Next Stepper) */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {prevSectionId ? (
            <button
              type="button"
              onClick={() => setActiveSection(prevSectionId)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <HiArrowLeft size={16} />
              <span>Back: {sections[prevSectionId].title.split(" ")[0]}</span>
            </button>
          ) : (
            <div />
          )}

          {nextSectionId ? (
            <button
              type="button"
              onClick={() => setActiveSection(nextSectionId)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition cursor-pointer"
            >
              <span>Next: {sections[nextSectionId].title.split(" ")[0]}</span>
              <HiArrowRight size={16} />
            </button>
          ) : onViewPreview ? (
            <button
              type="button"
              onClick={onViewPreview}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition cursor-pointer"
            >
              <span>Review Resume</span>
              <HiArrowRight size={16} />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}