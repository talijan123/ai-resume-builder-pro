import React, { useState } from "react";
import {
  HiChevronDown,
  HiPaintBrush,
  HiRectangleGroup,
  HiEye,
  HiArrowDownTray,
  HiSparkles,
  HiCheck,
} from "react-icons/hi2";
import { useResume, VALID_TEMPLATES } from "../../context/ResumeContext";

/* =========================================================
   Accent Colors
========================================================= */

const COLOR_SWATCHES = [
  { name: "Blue", hex: "#2563eb" },
  { name: "Red", hex: "#dc2626" },
  { name: "Green", hex: "#16a34a" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Rose", hex: "#ff3366" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Sky", hex: "#0284c7" },
];

/* =========================================================
   Template Styles with Patterns/Thumbnails
========================================================= */

const TEMPLATE_STYLES = [
  { id: "modern", label: "Modern", pattern: "bg-blue-600" },
  { id: "professional", label: "Professional", pattern: "bg-slate-800" },
  { id: "minimal", label: "Minimal", pattern: "bg-zinc-400" },
  { id: "creative", label: "Creative", pattern: "bg-violet-600" },
  { id: "executive", label: "Executive", pattern: "bg-emerald-700" },
  { id: "sidebar-photo", label: "Sidebar Photo", pattern: "bg-indigo-900 border-l-4 border-amber-400" },
  { id: "modern-photo", label: "Modern Photo", pattern: "bg-sky-700 border-t-4 border-rose-500" },
];

export default function ResumeSettingsCard({
  onPreviewResume,
  onDownloadPDF,
  onOpenATSScan,
  onAiFillSection,
}) {
  const { resumeData, setTemplate, themeColor, setThemeColor } = useResume();

  const [openTemplateOptions, setOpenTemplateOptions] = useState(true);
  const [openColorSettings, setOpenColorSettings] = useState(true);
  const [openBackgroundStyles, setOpenBackgroundStyles] = useState(true);

  const currentTemplateId = resumeData?.template || "modern";
  const activeColor = themeColor || resumeData?.themeColor || "#2563eb";

  function handleCycleTemplate() {
    const currentIndex = VALID_TEMPLATES.indexOf(currentTemplateId);
    const nextIndex = (currentIndex + 1) % VALID_TEMPLATES.length;
    setTemplate(VALID_TEMPLATES[nextIndex]);
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 space-y-5 transition-colors">
      {/* =======================================================
          Accordion 1: Template Options
      ======================================================= */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <button
          type="button"
          onClick={() => setOpenTemplateOptions(!openTemplateOptions)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-100 py-1 transition-colors hover:text-[#ff3366] cursor-pointer"
        >
          <span>Template Options</span>
          <HiChevronDown
            size={18}
            className={`transition-transform duration-200 text-slate-400 ${
              openTemplateOptions ? "rotate-180" : ""
            }`}
          />
        </button>

        {openTemplateOptions && (
          <div className="mt-4 space-y-3">
            {/* 2x2 Grid of Clean Square Icon Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Fill Section */}
              <button
                type="button"
                onClick={onAiFillSection}
                className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:border-rose-300 dark:hover:border-rose-800/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              >
                <div className="h-9 w-9 rounded-lg bg-rose-100/70 dark:bg-rose-950/50 text-[#ff3366] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <HiPaintBrush size={18} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#ff3366]">
                  Fill Section
                </span>
              </button>

              {/* Change Template */}
              <button
                type="button"
                onClick={handleCycleTemplate}
                className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-800/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              >
                <div className="h-9 w-9 rounded-lg bg-blue-100/70 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <HiRectangleGroup size={18} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600">
                  Change Template
                </span>
              </button>

              {/* Preview Resume */}
              <button
                type="button"
                onClick={onPreviewResume}
                className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:border-violet-300 dark:hover:border-violet-800/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              >
                <div className="h-9 w-9 rounded-lg bg-violet-100/70 dark:bg-violet-950/50 text-violet-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <HiEye size={18} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-violet-600">
                  Preview Resume
                </span>
              </button>

              {/* Download PDF */}
              <button
                type="button"
                onClick={onDownloadPDF}
                className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-800/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              >
                <div className="h-9 w-9 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <HiArrowDownTray size={18} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600">
                  Download PDF
                </span>
              </button>
            </div>

            {/* ATS Score Check Full-Width Button */}
            <button
              type="button"
              onClick={onOpenATSScan}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <HiSparkles size={16} className="text-[#ff3366]" />
              <span>ATS Score Check</span>
            </button>
          </div>
        )}
      </div>

      {/* =======================================================
          Accordion 2: Color Settings
      ======================================================= */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <button
          type="button"
          onClick={() => setOpenColorSettings(!openColorSettings)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-100 py-1 transition-colors hover:text-[#ff3366] cursor-pointer"
        >
          <span>Color Settings</span>
          <HiChevronDown
            size={18}
            className={`transition-transform duration-200 text-slate-400 ${
              openColorSettings ? "rotate-180" : ""
            }`}
          />
        </button>

        {openColorSettings && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {COLOR_SWATCHES.map((swatch) => {
                const isSelected = activeColor === swatch.hex;
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    title={swatch.name}
                    onClick={() => setThemeColor(swatch.hex)}
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm hover:scale-115 ${
                      isSelected
                        ? "ring-3 ring-offset-2 ring-[#ff3366] dark:ring-offset-slate-900 scale-110"
                        : "hover:shadow-md"
                    }`}
                  >
                    {isSelected && <HiCheck size={14} className="text-white drop-shadow-sm stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =======================================================
          Accordion 3: Template Style / Background
      ======================================================= */}
      <div>
        <button
          type="button"
          onClick={() => setOpenBackgroundStyles(!openBackgroundStyles)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 dark:text-slate-100 py-1 transition-colors hover:text-[#ff3366] cursor-pointer"
        >
          <span>Background / Template Style</span>
          <HiChevronDown
            size={18}
            className={`transition-transform duration-200 text-slate-400 ${
              openBackgroundStyles ? "rotate-180" : ""
            }`}
          />
        </button>

        {openBackgroundStyles && (
          <div className="mt-4">
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
              {TEMPLATE_STYLES.map((tmpl) => {
                const isSelected = currentTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    title={tmpl.label}
                    onClick={() => setTemplate(tmpl.id)}
                    className="flex flex-col items-center gap-1.5 p-1 rounded-xl transition-all cursor-pointer group"
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${tmpl.pattern} flex items-center justify-center shadow-sm transition-all group-hover:scale-105 ${
                        isSelected
                          ? "ring-3 ring-offset-2 ring-[#ff3366] dark:ring-offset-slate-900 scale-105"
                          : "border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {isSelected && <HiCheck size={16} className="text-white drop-shadow-sm stroke-[3]" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold text-center truncate max-w-[64px] ${
                        isSelected
                          ? "text-[#ff3366] dark:text-rose-400"
                          : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}
                    >
                      {tmpl.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
