import React from "react";

/* =========================================================
   Section Metadata & Writing Tips
========================================================= */

export const SECTION_METADATA = {
  personal: {
    id: "personal",
    title: "Personal Information",
    badgeTitle: "Personal Info",
    writingTip:
      "Include your first and last name and at least one reliable way for employers to reach you.",
  },
  summary: {
    id: "summary",
    title: "Professional Summary",
    badgeTitle: "Summary",
    writingTip:
      "Highlight your key achievements, core skills, and career objective in 3-4 impactful sentences.",
  },
  experience: {
    id: "experience",
    title: "Work Experience",
    badgeTitle: "Work Experience",
    writingTip:
      "Highlight measurable outcomes, leadership initiatives, and technologies used in each role.",
  },
  education: {
    id: "education",
    title: "Education",
    badgeTitle: "Education",
    writingTip:
      "Include your degree, field of study, university name, and graduation year or expected completion.",
  },
  skills: {
    id: "skills",
    title: "Skills & Proficiencies",
    badgeTitle: "Skills",
    writingTip:
      "Group technical proficiencies, frameworks, tools, and domain expertise relevant to target roles.",
  },
  projects: {
    id: "projects",
    title: "Projects",
    badgeTitle: "Projects",
    writingTip:
      "Showcase notable projects with live links, tech stack details, and your specific contributions.",
  },
  certifications: {
    id: "certifications",
    title: "Certifications",
    badgeTitle: "Certificates",
    writingTip:
      "Add accredited industry certifications, issuing authorities, credential IDs, and valid dates.",
  },
  "cover-letter": {
    id: "cover-letter",
    title: "Cover Letter",
    badgeTitle: "Cover Letter",
    writingTip:
      "Personalize your message to the hiring manager and explain why you're a great fit for the role.",
  },
};

export default function EditorBanner({ activeSection = "personal" }) {
  const currentMeta = SECTION_METADATA[activeSection] || SECTION_METADATA.personal;

  return (
    <section className="relative w-full bg-gradient-to-r from-[#ff3366] via-[#ff416c] to-[#ff4b2b] dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white pt-8 pb-28 px-4 sm:px-6 lg:px-8 transition-colors overflow-hidden">
      {/* Subtle Background Pattern & Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Aligned 3 Column Headers (Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column Header (3/12) */}
          <div className="lg:col-span-3">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Fill Section
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mt-1 font-medium leading-relaxed">
              Select a section to edit or auto-fill with AI
            </p>
          </div>

          {/* Center Column Header (6/12) */}
          <div className="lg:col-span-6">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentMeta.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mt-1 font-medium leading-relaxed">
              {currentMeta.writingTip}
            </p>
          </div>

          {/* Right Column Header (3/12) */}
          <div className="lg:col-span-3">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Resume Settings
            </h2>
            <p className="text-xs sm:text-sm text-white/85 mt-1 font-medium leading-relaxed">
              Customize template, colors, and export options
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
