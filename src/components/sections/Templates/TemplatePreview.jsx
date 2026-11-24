import React from "react";
import {
  HiUser,
  HiEnvelope,
  HiMapPin,
  HiGlobeAlt,
  HiBriefcase,
  HiAcademicCap,
  HiTrophy,
  HiArrowTopRightOnSquare,
  HiSparkles,
} from "react-icons/hi2";

/**
 * High-Fidelity Miniature Previews for Landing Page Templates.
 * Replaces generic wireframe placeholders with realistic mini-resume UI layouts.
 */
export default function TemplatePreview({
  templateId = "modern",
  color = "from-blue-500 to-indigo-600",
}) {
  /* =========================================================================
     CARD 3: SIDEBAR PHOTO TEMPLATE
     - Distinct two-column split layout
     - Left narrow sidebar (darker slate) with circular avatar silhouette,
       contact icons, and technical tags
     - Right main content area with work history and education blocks
  ========================================================================= */
  if (templateId === "sidebar-photo") {
    return (
      <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm select-none text-left flex">
        {/* Left Dark Sidebar */}
        <div className="w-[36%] bg-slate-900 text-white p-3 flex flex-col justify-between shrink-0 border-r border-slate-800">
          <div>
            {/* Circular Avatar Silhouette with Gradient Glow Ring */}
            <div className="mx-auto mb-2 relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-slate-800 p-0.5 shadow-md">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 overflow-hidden">
                {/* Stylized Silhouette */}
                <HiUser className="h-9 w-9 text-indigo-300 translate-y-1" />
              </div>
            </div>

            {/* Candidate Identity */}
            <div className="text-center mb-2.5">
              <p className="text-[10px] font-black tracking-tight text-white leading-tight">
                David Chen
              </p>
              <p className="text-[7px] text-indigo-300 font-semibold mt-0.5">
                VP of Engineering
              </p>
            </div>

            {/* Contact Icons Row */}
            <div className="space-y-1.5 border-t border-slate-800/90 pt-2 text-[7px] text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <HiMapPin className="h-2.5 w-2.5 text-indigo-400 shrink-0" />
                <span className="truncate">Seattle, WA</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <HiEnvelope className="h-2.5 w-2.5 text-blue-400 shrink-0" />
                <span className="truncate">d.chen@cloud.io</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <HiGlobeAlt className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                <span className="truncate">github.com/dchen</span>
              </div>
            </div>

            {/* Technical Tags */}
            <div className="mt-2.5 border-t border-slate-800/90 pt-2">
              <p className="text-[7px] font-black uppercase tracking-wider text-indigo-300 mb-1.5">
                Technical Stack
              </p>
              <div className="flex flex-wrap gap-1">
                {["Cloud Arc", "K8s", "Go", "TypeScript", "System Design"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-800/90 border border-slate-700/60 px-1.5 py-0.5 text-[6px] font-semibold text-indigo-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Accent */}
          <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between text-[6.5px] text-slate-400">
            <span className="font-semibold text-indigo-400">Executive Edition</span>
            <span>A4 Verified</span>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 p-3.5 flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
          <div>
            {/* Executive Profile Summary */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <p className="text-[7.5px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                Executive Profile
              </p>
              <p className="mt-1 text-[7px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                Engineering leader with 10+ years driving high-reliability cloud platforms, scaling systems to 99.99% uptime, and leading distributed engineering teams.
              </p>
            </div>

            {/* Work History */}
            <div className="mt-2.5">
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                <HiBriefcase className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
                Work History
              </p>

              <div className="space-y-2">
                {/* Role 1 */}
                <div className="border-l-2 border-indigo-500/40 pl-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[7.5px] font-bold text-slate-900 dark:text-white">
                      Director of Engineering
                    </p>
                    <span className="text-[6.5px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.5 rounded">
                      2021 - Present
                    </span>
                  </div>
                  <p className="text-[6.5px] font-medium text-slate-500 dark:text-slate-400">
                    CloudScale Systems
                  </p>
                  <p className="text-[6.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                    • Directed 35+ engineers across core platform infra & tooling.
                  </p>
                </div>

                {/* Role 2 */}
                <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[7.5px] font-bold text-slate-900 dark:text-white">
                      Principal Systems Architect
                    </p>
                    <span className="text-[6.5px] text-slate-400">2018 - 2021</span>
                  </div>
                  <p className="text-[6.5px] font-medium text-slate-500 dark:text-slate-400">
                    Veloce Technologies
                  </p>
                  <p className="text-[6.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                    • Built distributed event pipeline handling 10M+ operations/sec.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Block */}
            <div className="mt-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-2">
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-900 dark:text-white mb-1 flex items-center gap-1">
                <HiAcademicCap className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400" />
                Education
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[7.5px] font-bold text-slate-900 dark:text-white">
                    M.S. Computer Science
                  </p>
                  <p className="text-[6.5px] text-slate-500 dark:text-slate-400">
                    University of Washington
                  </p>
                </div>
                <span className="text-[6.5px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5 rounded">
                  Magna Cum Laude
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Card Metric */}
          <div className="mt-1 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 p-1.5 border border-indigo-100 dark:border-indigo-900/50 text-[6.5px] text-indigo-950 dark:text-indigo-200 flex items-center justify-between">
            <span className="font-bold">ATS Score: 98/100</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Photo Verified
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     CARD 2: CREATIVE DESIGNER TEMPLATE
     - Asymmetric or accent-colored modern layout (indigo/violet border accent)
     - Prominent title, portfolio link placeholder
     - Clean two-column grid for skills and achievements
  ========================================================================= */
  if (templateId === "creative") {
    return (
      <div className="h-80 w-full overflow-hidden rounded-xl border-2 border-indigo-200 dark:border-indigo-800/80 bg-white dark:bg-slate-950 shadow-sm select-none text-left flex flex-col justify-between">
        {/* Asymmetric Gradient Top Accent Banner */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 p-3.5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] font-black tracking-tight text-white leading-tight">
                Sophia Martinez
              </p>
              <p className="text-[8px] font-bold text-violet-100 mt-0.5">
                Lead Product Designer & UX Architect
              </p>
            </div>
            {/* Portfolio Link Placeholder */}
            <div className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[6.5px] font-bold uppercase tracking-wider text-white border border-white/30 shadow-xs">
              <span>portfolio.design/sophia</span>
              <HiArrowTopRightOnSquare className="h-2 w-2" />
            </div>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-2 text-[6.5px] text-white/90">
            <span>London, UK</span>
            <span>•</span>
            <span>sophia.design@studio.io</span>
            <span>•</span>
            <span>dribbble.com/sophia</span>
          </div>
        </div>

        {/* Asymmetric Dual-Column Content */}
        <div className="p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-950">
          {/* Featured Role Banner */}
          <div className="rounded-lg bg-violet-50/70 dark:bg-violet-950/30 border-l-2 border-violet-500 p-2">
            <div className="flex justify-between items-baseline">
              <p className="text-[8px] font-bold text-slate-900 dark:text-white">
                Principal Designer & UX Lead
              </p>
              <span className="text-[6.5px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-100/60 dark:bg-violet-900/60 px-1 py-0.5 rounded">
                2022 - Present
              </span>
            </div>
            <p className="text-[6.5px] text-violet-900 dark:text-violet-300 font-semibold">
              Studio Vanguard
            </p>
            <p className="text-[6.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
              • Unified global multi-brand design system used across 12 product lines for 2M+ users.
            </p>
          </div>

          {/* Clean Two-Column Grid: Skills & Achievements */}
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            {/* Column 1: Skills */}
            <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2">
              <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <HiSparkles className="h-2 w-2 text-violet-500" />
                Design Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {[
                  "Figma",
                  "Design Systems",
                  "User Research",
                  "Motion UI",
                  "Prototyping",
                  "Tailwind",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-800/50 px-1.5 py-0.5 text-[6px] font-bold text-violet-700 dark:text-violet-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Achievements */}
            <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-2">
              <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                <HiTrophy className="h-2 w-2 text-amber-500" />
                Key Achievements
              </p>
              <ul className="space-y-1 text-[6.5px] text-slate-600 dark:text-slate-400 leading-tight">
                <li className="flex items-start gap-1">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>Best App Design (Awwwards '23)</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>4.9★ iOS App Store redesign</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-violet-500 font-bold">•</span>
                  <span>Mentored 10+ junior UX designers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Micro Footer */}
          <div className="mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-1.5 flex items-center justify-between text-[6.5px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              Creative Designer Layout
            </span>
            <span className="font-medium">Portfolio Ready</span>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     CARD 1: MODERN PROFESSIONAL TEMPLATE (DEFAULT)
     - Clean, single-column layout
     - Subtle header with simulated name/title
     - Professional summary block
     - Experience timeline
     - Skill badges (React, Node.js, Tailwind)
  ========================================================================= */
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm select-none text-left flex flex-col justify-between">
      <div>
        {/* Subtle Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Alex Morgan
            </h4>
            <span className="rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 px-1.5 py-0.5 text-[7px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              ATS-Optimized
            </span>
          </div>

          <p className="mt-0.5 text-[8.5px] font-semibold text-blue-600 dark:text-blue-400">
            Senior Software Engineer
          </p>

          <div className="mt-1 flex flex-wrap gap-2 text-[7px] text-slate-500 dark:text-slate-400">
            <span>San Francisco, CA</span>
            <span>•</span>
            <span>alex.morgan@email.com</span>
            <span>•</span>
            <span>github.com/alexmorgan</span>
          </div>
        </div>

        {/* Professional Summary Block */}
        <div className="mt-2.5">
          <p className="text-[8px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Professional Summary
          </p>
          <p className="mt-1 text-[7px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
            Results-driven software engineer with 6+ years specializing in high-concurrency Node.js microservices, React web applications, and resilient cloud architectures.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="mt-2.5">
          <p className="text-[8px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
            Work Experience
          </p>

          {/* Timeline with vertical line and dots */}
          <div className="relative border-l-2 border-blue-500/30 dark:border-blue-500/40 pl-2.5 space-y-2 ml-1">
            {/* Timeline Item 1 */}
            <div className="relative">
              <div className="absolute -left-[14px] top-1 h-2 w-2 rounded-full border border-white dark:border-slate-950 bg-blue-600" />
              <div className="flex items-center justify-between text-[7.5px]">
                <span className="font-bold text-slate-900 dark:text-white">
                  Lead Frontend Engineer
                </span>
                <span className="text-[6.5px] font-semibold text-blue-600 dark:text-blue-400">
                  2022 - Present
                </span>
              </div>
              <p className="text-[6.5px] font-medium text-slate-500 dark:text-slate-400">
                TechFlow Systems
              </p>
              <p className="text-[6.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                • Architected real-time analytics suite handling 150k+ daily users with 99.9% uptime.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative">
              <div className="absolute -left-[14px] top-1 h-2 w-2 rounded-full border border-white dark:border-slate-950 bg-slate-400 dark:bg-slate-600" />
              <div className="flex items-center justify-between text-[7.5px]">
                <span className="font-bold text-slate-900 dark:text-white">
                  Software Engineer
                </span>
                <span className="text-[6.5px] text-slate-400">2020 - 2022</span>
              </div>
              <p className="text-[6.5px] font-medium text-slate-500 dark:text-slate-400">
                Apex Labs
              </p>
              <p className="text-[6.5px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                • Built event-driven data pipelines processing 10M+ events using Kafka & Go.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Badges (Explicitly React, Node.js, Tailwind + complementary skills) */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2">
        <p className="text-[7.5px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
          Core Skills
        </p>
        <div className="flex flex-wrap gap-1">
          {["React", "Node.js", "Tailwind", "TypeScript", "Next.js", "PostgreSQL", "AWS"].map((skill) => (
            <span
              key={skill}
              className={`rounded-md px-1.5 py-0.5 text-[6.5px] font-bold border transition-colors ${
                ["React", "Node.js", "Tailwind"].includes(skill)
                  ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200/70 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-extrabold"
                  : "bg-slate-100 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-medium"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}