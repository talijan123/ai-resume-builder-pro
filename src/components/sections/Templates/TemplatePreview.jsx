import React from "react";
import {
  HiCheckCircle,
} from "react-icons/hi2";

/**
 * Realistic, stylized vector mini-resume previews representing each template layout.
 * Replaces generic wireframe bars with authentic miniature resume typography and structure.
 */
export default function TemplatePreview({ templateId = "modern", color = "from-blue-500 to-indigo-600" }) {
  if (templateId === "sidebar-photo") {
    return (
      <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/60 select-none text-left flex">
        {/* Left Dark Sidebar with Profile Photo */}
        <div className="w-[38%] bg-slate-900 text-white p-3.5 flex flex-col justify-between shrink-0">
          <div>
            {/* Stylized Profile Photo Avatar */}
            <div className="mx-auto mb-2.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-400/60 bg-gradient-to-tr from-indigo-600 via-blue-500 to-purple-500 shadow-md">
              <span className="text-sm font-black tracking-wider text-white">DC</span>
            </div>

            <div className="text-center mb-3">
              <p className="text-[10px] font-extrabold text-white leading-tight">David Chen</p>
              <p className="text-[7.5px] text-indigo-300 font-medium">VP of Engineering</p>
            </div>

            {/* Contact Micro Details */}
            <div className="space-y-1.5 border-t border-slate-800 pt-2 text-[7px] text-slate-300">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">Seattle, WA</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="truncate">dchen@eng.io</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="truncate">github.com/dchen</span>
              </div>
            </div>

            {/* Sidebar Skills with Micro-Bars */}
            <div className="mt-3 border-t border-slate-800 pt-2">
              <p className="text-[7.5px] font-bold uppercase tracking-wider text-indigo-300 mb-1.5">
                Core Skills
              </p>
              <div className="space-y-1.5 text-[7px]">
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>System Architecture</span>
                    <span className="text-indigo-400">95%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div className="h-1 rounded-full bg-indigo-500" style={{ width: "95%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>Cloud & K8s</span>
                    <span className="text-indigo-400">90%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div className="h-1 rounded-full bg-indigo-500" style={{ width: "90%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>Team Leadership</span>
                    <span className="text-indigo-400">98%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div className="h-1 rounded-full bg-indigo-500" style={{ width: "98%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Education Snippet */}
          <div className="border-t border-slate-800 pt-1.5 text-[7px]">
            <p className="font-bold text-slate-200">M.S. Computer Science</p>
            <p className="text-slate-400">Univ. of Washington</p>
          </div>
        </div>

        {/* Right Main Body Content */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-white">
          <div>
            {/* Header Accent & Summary */}
            <div className="border-b border-slate-100 pb-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-600">
                Executive Profile
              </p>
              <p className="mt-1 text-[7.5px] leading-relaxed text-slate-600 line-clamp-3">
                High-impact engineering leader with 10+ years scaling cloud platforms to 99.99% uptime and building top-tier engineering organizations.
              </p>
            </div>

            {/* Experience Section */}
            <div className="mt-3">
              <p className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                Leadership Experience
              </p>

              <div className="space-y-2.5">
                <div className="border-l-2 border-indigo-100 pl-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-bold text-slate-900">Director of Engineering</p>
                    <span className="text-[6.5px] font-semibold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">2021 - Present</span>
                  </div>
                  <p className="text-[7px] text-slate-500 font-medium">CloudScale Inc.</p>
                  <p className="text-[6.5px] text-slate-600 mt-0.5 line-clamp-2 leading-tight">
                    • Directed 35+ engineers across cloud infrastructure & developer tooling.
                  </p>
                </div>

                <div className="border-l-2 border-slate-200 pl-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] font-bold text-slate-900">Principal Architect</p>
                    <span className="text-[6.5px] text-slate-400">2018 - 2021</span>
                  </div>
                  <p className="text-[7px] text-slate-500 font-medium">Veloce Technologies</p>
                  <p className="text-[6.5px] text-slate-600 mt-0.5 line-clamp-2 leading-tight">
                    • Spearheaded multi-region microservices architecture cutting latency 45%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Achievements Mini Badge */}
          <div className="mt-2 rounded-lg bg-indigo-50/70 p-1.5 border border-indigo-100 text-[6.5px] text-indigo-950 flex items-center justify-between">
            <span className="font-bold">ATS Scored: 98%</span>
            <span className="text-indigo-600 font-semibold">Photo Optimized</span>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "creative") {
    return (
      <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/60 select-none text-left flex flex-col justify-between">
        {/* Creative Gradient Top Accent Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-black tracking-tight text-white leading-tight">Sophia Martinez</p>
              <p className="text-[8px] font-medium text-pink-100">Lead Product Designer & UX Architect</p>
            </div>
            <div className="rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[6.5px] font-bold uppercase tracking-wider text-white">
              Portfolio
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-[6.5px] text-white/90">
            <span>London, UK</span>
            <span>•</span>
            <span>sophia.design</span>
            <span>•</span>
            <span>dribbble.com/sophia</span>
          </div>
        </div>

        {/* Creative Dual-Column Content */}
        <div className="p-3.5 flex-1 flex gap-3 bg-white">
          {/* Left Column: Design Experience */}
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-[8px] font-black uppercase tracking-wider text-purple-700 mb-1.5">
                Featured Experience
              </p>
              <div className="space-y-1.5">
                <div className="bg-purple-50/50 rounded-lg p-1.5 border border-purple-100/60">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[8px] font-bold text-slate-900">Principal Designer</p>
                    <span className="text-[6.5px] font-semibold text-purple-600">2022 - Present</span>
                  </div>
                  <p className="text-[7px] text-purple-900 font-medium">Studio Vanguard</p>
                  <p className="text-[6.5px] text-slate-600 mt-0.5 leading-tight">
                    • Established unified multi-brand design system for 2M+ active consumers.
                  </p>
                </div>

                <div className="rounded-lg p-1.5 border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <p className="text-[8px] font-bold text-slate-900">Senior UX Lead</p>
                    <span className="text-[6.5px] text-slate-400">2019 - 2022</span>
                  </div>
                  <p className="text-[7px] text-slate-500 font-medium">Fintech Horizon</p>
                  <p className="text-[6.5px] text-slate-600 mt-0.5 leading-tight">
                    • Re-architected mobile banking app achieving 4.9★ rating on iOS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Portfolio Highlights */}
          <div className="w-[36%] space-y-2.5 border-l border-slate-100 pl-2.5">
            <div>
              <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-800 mb-1.5">
                Design Arsenal
              </p>
              <div className="flex flex-wrap gap-1">
                {["Design Systems", "Figma", "Design Sprint", "Motion UI", "User Research", "Prototyping"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[6px] font-bold text-purple-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-800 mb-1">
                Education
              </p>
              <p className="text-[7px] font-bold text-slate-800">BA Visual Design</p>
              <p className="text-[6.5px] text-slate-500">Royal College of Art</p>
            </div>
          </div>
        </div>

        {/* Bottom Micro Footer */}
        <div className="border-t border-slate-100 px-3.5 py-1.5 bg-slate-50/60 flex items-center justify-between text-[6.5px] text-slate-500">
          <span className="font-semibold text-purple-700">Creative & Designer Layout</span>
          <span>A4 Vector Preview</span>
        </div>
      </div>
    );
  }

  // Default: Modern Professional Template
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200/90 bg-white p-4 shadow-md shadow-slate-200/60 select-none text-left flex flex-col justify-between">
      <div>
        {/* Modern Header */}
        <div className="border-b border-slate-200 pb-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-extrabold tracking-tight text-slate-900 leading-tight">
              Alex Morgan
            </h4>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[7px] font-bold text-blue-700 uppercase tracking-wider">
              ATS-Optimized
            </span>
          </div>

          <p className="mt-0.5 text-[8.5px] font-semibold text-blue-600">
            Senior Software Engineer
          </p>

          <div className="mt-1.5 flex flex-wrap gap-2 text-[7px] text-slate-500">
            <span>San Francisco, CA</span>
            <span>•</span>
            <span>alex.morgan@email.com</span>
            <span>•</span>
            <span>github.com/alexmorgan</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mt-2.5">
          <p className="text-[8px] font-extrabold uppercase tracking-wider text-slate-800">
            Professional Summary
          </p>
          <p className="mt-1 text-[7px] leading-relaxed text-slate-600 line-clamp-2">
            Full-stack engineer with 6+ years specializing in high-concurrency Node.js microservices, React web applications, and resilient cloud architectures.
          </p>
        </div>

        {/* Work Experience */}
        <div className="mt-3">
          <p className="text-[8px] font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
            Work Experience
          </p>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-[7.5px]">
                <span className="font-bold text-slate-900">TechFlow Systems</span>
                <span className="text-[6.5px] font-semibold text-slate-400">2022 - Present</span>
              </div>
              <p className="text-[7px] font-medium text-blue-600">Lead Frontend Engineer</p>
              <ul className="mt-0.5 space-y-0.5 text-[6.5px] text-slate-600">
                <li className="flex items-start gap-1">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Architected real-time analytics suite handling 150k+ daily users.</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Reduced Web Vitals LCP by 45% with optimized bundle chunking.</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between text-[7.5px]">
                <span className="font-bold text-slate-900">Apex Labs</span>
                <span className="text-[6.5px] font-semibold text-slate-400">2020 - 2022</span>
              </div>
              <p className="text-[7px] font-medium text-slate-600">Software Engineer</p>
              <p className="text-[6.5px] text-slate-600">
                • Built event-driven pipelines processing 10M+ daily events using Kafka & Go.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Pill Chips */}
      <div className="border-t border-slate-100 pt-2">
        <p className="text-[7.5px] font-extrabold uppercase tracking-wider text-slate-800 mb-1">
          Technical Skills
        </p>
        <div className="flex flex-wrap gap-1">
          {["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "Tailwind", "AWS", "Docker"].map((skill) => (
            <span
              key={skill}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[6.5px] font-medium text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}