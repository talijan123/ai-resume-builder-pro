import React, { useEffect } from "react";
import {
  HiXMark,
  HiSparkles,
  HiChartBar,
  HiDocumentText,
  HiCheckBadge,
  HiArrowRight,
} from "react-icons/hi2";

export default function AIToolsModal({
  isOpen,
  onClose,
  activeTab = "generator", // "generator" | "ats"
  setActiveTab,
  // Generator props
  generationMode = "job-description",
  setGenerationMode,
  generationJobDescription = "",
  setGenerationJobDescription,
  generationJobTitle = "",
  setGenerationJobTitle,
  generationIndustry = "",
  setGenerationIndustry,
  generationYearsOfExperience = "",
  setGenerationYearsOfExperience,
  generationKeySkills = "",
  setGenerationKeySkills,
  generationError = "",
  generating = false,
  onGenerateResume,
  // ATS Scanner props
  atsJobDescription = "",
  setAtsJobDescription,
  atsScanning = false,
  atsError = "",
  atsResult = null,
  onScanResumeATS,
}) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================
            Top Gradient Header (Matching EditorBanner aesthetic)
        ========================================================= */}
        <div className="relative w-full bg-gradient-to-r from-[#ff3366] via-[#ff416c] to-[#ff4b2b] dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white p-5 sm:p-6 overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white">
                <HiSparkles size={12} />
                <span>AI-Powered Studio</span>
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-white tracking-tight">
                ResumeForge AI Studio
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-white/85 font-medium leading-relaxed">
                Generate tailored resume drafts or run intelligent ATS keyword scans
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer shrink-0"
              aria-label="Close AI Studio"
            >
              <HiXMark size={22} />
            </button>
          </div>
        </div>

        {/* =========================================================
            Modal Body
        ========================================================= */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Card-Style Mode Switcher (Matching SectionTileGrid style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tile 1: AI Resume Generator */}
            <button
              type="button"
              onClick={() => setActiveTab("generator")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 select-none ${
                activeTab === "generator"
                  ? "bg-rose-50/70 dark:bg-rose-950/30 border-[#ff3366] dark:border-rose-400 ring-2 ring-[#ff3366]/20 shadow-xs"
                  : "bg-slate-50/70 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700/80 hover:border-slate-300 dark:hover:border-zinc-600"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 transition-colors ${
                  activeTab === "generator"
                    ? "bg-[#ff3366] text-white shadow-sm"
                    : "bg-rose-100/70 dark:bg-rose-950/60 text-[#ff3366] dark:text-rose-400"
                }`}
              >
                <HiSparkles size={20} />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-xs font-black block tracking-tight ${
                    activeTab === "generator"
                      ? "text-[#ff3366] dark:text-rose-400"
                      : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  AI Resume Generator
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Generate tailored full draft from Job Description or Guided Fields
                </p>
              </div>
            </button>

            {/* Tile 2: AI ATS Scanner */}
            <button
              type="button"
              onClick={() => setActiveTab("ats")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 select-none ${
                activeTab === "ats"
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs"
                  : "bg-slate-50/70 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700/80 hover:border-slate-300 dark:hover:border-zinc-600"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 transition-colors ${
                  activeTab === "ats"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <HiChartBar size={20} />
              </div>
              <div className="min-w-0">
                <span
                  className={`text-xs font-black block tracking-tight ${
                    activeTab === "ats"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-800 dark:text-slate-100"
                  }`}
                >
                  AI ATS Scanner
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Scan resume keyword match & formatting against a job posting
                </p>
              </div>
            </button>
          </div>

          {/* =========================================================
              Mode 1: AI Resume Generator
          ========================================================= */}
          {activeTab === "generator" && (
            <div className="space-y-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select generation method:
                </p>

                <div className="inline-flex rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 p-1 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setGenerationMode("job-description")}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      generationMode === "job-description"
                        ? "bg-white dark:bg-zinc-900 text-[#ff3366] dark:text-rose-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Job Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenerationMode("guided")}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      generationMode === "guided"
                        ? "bg-white dark:bg-zinc-900 text-[#ff3366] dark:text-rose-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Guided Fields
                  </button>
                </div>
              </div>

              {generationMode === "job-description" ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Paste Target Job Description
                  </label>
                  <textarea
                    rows={5}
                    value={generationJobDescription}
                    onChange={(e) => setGenerationJobDescription(e.target.value)}
                    placeholder="Paste the job posting text here (e.g. role requirements, qualifications, company overview)..."
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/20 outline-none transition resize-y"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Target Job Title
                    </label>
                    <input
                      type="text"
                      value={generationJobTitle}
                      onChange={(e) => setGenerationJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#ff3366] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      value={generationIndustry}
                      onChange={(e) => setGenerationIndustry(e.target.value)}
                      placeholder="e.g. Fintech, SaaS, Healthcare"
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#ff3366] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={generationYearsOfExperience}
                      onChange={(e) => setGenerationYearsOfExperience(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#ff3366] outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Key Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={generationKeySkills}
                      onChange={(e) => setGenerationKeySkills(e.target.value)}
                      placeholder="e.g. React, TypeScript, GraphQL, Node"
                      className="w-full h-10 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 px-3.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#ff3366] outline-none transition"
                    />
                  </div>
                </div>
              )}

              {generationError && (
                <p className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:text-red-400">
                  {generationError}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onGenerateResume}
                  disabled={generating}
                  className="rounded-xl bg-gradient-to-r from-[#ff3366] via-[#ff416c] to-[#ff4b2b] hover:from-[#e62557] hover:to-[#e63a1f] text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md shadow-rose-500/25 transition cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  <HiSparkles size={16} />
                  <span>{generating ? "Generating Draft..." : "Generate Resume Draft"}</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              Mode 2: AI ATS Scanner
          ========================================================= */}
          {activeTab === "ats" && (
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Job Description for ATS Keyword Audit
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      atsJobDescription.length > 8000
                        ? "text-red-500 font-bold"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {atsJobDescription.length.toLocaleString()} / 8,000 characters
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={atsJobDescription}
                  onChange={(e) => setAtsJobDescription(e.target.value)}
                  placeholder="Paste the target job description to analyze keyword match rate and missing qualifications against your resume..."
                  className={`w-full rounded-xl border p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white outline-none transition resize-y ${
                    atsJobDescription.length > 8000
                      ? "border-red-500 bg-red-50/50 dark:bg-red-950/20"
                      : "border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/80 focus:bg-white dark:focus:bg-zinc-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
              </div>

              {atsError && (
                <p className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:text-red-400">
                  {atsError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onScanResumeATS}
                  disabled={
                    atsScanning ||
                    atsJobDescription.length > 8000 ||
                    atsJobDescription.trim().length === 0
                  }
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <HiCheckBadge size={16} />
                  <span>{atsScanning ? "Scanning Resume..." : "Run ATS Scan"}</span>
                </button>
              </div>

              {/* ATS Scan Result Card */}
              {atsResult && (
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-700/80 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Match Compatibility Score
                    </span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {atsResult.keywordMatchPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                        Matched Keywords
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {atsResult.matchedKeywords?.length > 0 ? (
                          atsResult.matchedKeywords.map((k) => (
                            <span
                              key={k}
                              className="rounded-lg bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300"
                            >
                              {k}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None detected</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                        Missing Keywords
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {atsResult.missingKeywords?.length > 0 ? (
                          atsResult.missingKeywords.map((k) => (
                            <span
                              key={k}
                              className="rounded-lg bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300"
                            >
                              {k}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
