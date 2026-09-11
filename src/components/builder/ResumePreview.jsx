import {
  forwardRef,
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  HiMagnifyingGlassPlus,
  HiMagnifyingGlassMinus,
  HiArrowsPointingOut,
  HiArrowDownTray,
  HiSwatch,
  HiChevronDown,
} from "react-icons/hi2";

import {
  useResume,
  VALID_TEMPLATES,
} from "../../context/ResumeContext";

import ModernTemplate from "../templates/ModernTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import SidebarPhotoTemplate from "../templates/SidebarPhotoTemplate";
import ModernPhotoTemplate from "../templates/ModernPhotoTemplate";

/* =========================================================
   AVAILABLE TEMPLATES
========================================================= */

const templates = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  "sidebar-photo": SidebarPhotoTemplate,
  "modern-photo": ModernPhotoTemplate,
};

const templateOptions = [
  { id: "modern", name: "Modern" },
  { id: "professional", name: "Professional" },
  { id: "creative", name: "Creative" },
  { id: "executive", name: "Executive" },
  { id: "minimal", name: "Minimal" },
  { id: "sidebar-photo", name: "Sidebar Photo" },
  { id: "modern-photo", name: "Modern Photo" },
];

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

/* =========================================================
   RESUME PREVIEW CANVAS COMPONENT
========================================================= */

const ResumePreview = forwardRef(
  ({ onDownloadPDF }, ref) => {
    const { resumeData, setTemplate } = useResume();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlTemplate = searchParams.get("template");

    const templateName =
      resumeData?.template || urlTemplate || "modern";

    const SelectedTemplate =
      templates[templateName] || ModernTemplate;

    const displayTemplateName =
      templateName.charAt(0).toUpperCase() + templateName.slice(1).replace("-", " ");

    // Zoom and responsive scaling state
    const [scale, setScale] = useState(0.8);
    const [isAutoFit, setIsAutoFit] = useState(true);
    const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Auto-calculate scale on container size change
    useEffect(() => {
      function calculateFitScale() {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth - 48; // padding offset
        if (containerWidth > 0) {
          const widthScale = containerWidth / A4_WIDTH_PX;
          const autoScale = Math.min(1.05, Math.max(0.35, Number(widthScale.toFixed(2))));
          if (isAutoFit) {
            setScale(autoScale);
          }
        }
      }

      calculateFitScale();
      const observer = new ResizeObserver(calculateFitScale);
      if (containerRef.current) observer.observe(containerRef.current);
      window.addEventListener("resize", calculateFitScale);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", calculateFitScale);
      };
    }, [isAutoFit]);

    // Close template dropdown on outside click
    useEffect(() => {
      function handleClickOutside(e) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setTemplateDropdownOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleZoomIn() {
      setIsAutoFit(false);
      setScale((prev) => Math.min(1.5, Number((prev + 0.08).toFixed(2))));
    }

    function handleZoomOut() {
      setIsAutoFit(false);
      setScale((prev) => Math.max(0.35, Number((prev - 0.08).toFixed(2))));
    }

    function handleResetFit() {
      setIsAutoFit(true);
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48;
        setScale(Math.min(1.05, Math.max(0.35, Number((containerWidth / A4_WIDTH_PX).toFixed(2)))));
      }
    }

    function handleZoom100() {
      setIsAutoFit(false);
      setScale(1);
    }

    function handleSelectTemplate(newTemplateId) {
      if (setTemplate) {
        setTemplate(newTemplateId);
      }
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("template", newTemplateId);
        return next;
      });
      setTemplateDropdownOpen(false);
    }

    return (
      <>
        {/* =========================================
            PRINT STYLES
        ========================================= */}
        <style>
          {`
            @page {
              size: A4;
              margin: 15mm;
            }

            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                background: white !important;
              }

              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              #resume-print-area {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                overflow: visible !important;
                height: auto !important;
              }

              #resume-preview-wrapper {
                transform: none !important;
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
              }

              #resume-preview {
                width: 100% !important;
                min-height: 0 !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                overflow: visible !important;
                background: white !important;
              }

              .resume-entry,
              .resume-section,
              .resume-education-item,
              .resume-experience-item,
              .resume-project-item,
              .resume-certification-item {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }

              .resume-section-title {
                break-after: avoid !important;
                page-break-after: avoid !important;
              }

              table, tr, td, th, figure, blockquote {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }

              #resume-preview > *:last-child {
                break-after: auto !important;
                page-break-after: auto !important;
              }

              .print\\:hidden {
                display: none !important;
              }

              a {
                color: inherit !important;
                text-decoration: none !important;
              }

              .resume-page-break {
                break-before: page !important;
                page-break-before: always !important;
              }

              .resume-keep-together {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }

              .resume-keep-with-next {
                break-after: avoid !important;
                page-break-after: avoid !important;
              }

              h1, h2, h3, h4, h5, h6 {
                break-after: avoid !important;
                page-break-after: avoid !important;
              }

              p {
                orphans: 3;
                widows: 3;
              }
            }
          `}
        </style>

        {/* =========================================
            PREVIEW CANVAS CONTAINER
        ========================================= */}
        <div
          className="
            h-full
            w-full
            flex
            flex-col
            min-h-0
            bg-[#090d16]
            dark:bg-[#070a12]
            transition-colors
            relative
            print:static
            print:h-auto
            print:overflow-visible
            print:bg-white
          "
        >
          {/* =======================================
              FLOATING CANVAS TOOLBAR
          ======================================= */}
          <div
            className="
              sticky
              top-0
              z-30
              h-14
              px-4
              sm:px-6
              flex
              items-center
              justify-between
              gap-3
              border-b
              border-white/10
              bg-[#0d1322]/90
              backdrop-blur-md
              shrink-0
              print:hidden
            "
          >
            {/* Left: Template Switcher dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
              >
                <HiSwatch size={15} className="text-blue-400" />
                <span className="hidden sm:inline text-slate-400 font-normal">Template:</span>
                <span>{displayTemplateName}</span>
                <HiChevronDown size={13} className="text-slate-400" />
              </button>

              {templateDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Template
                  </div>
                  {templateOptions.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTemplate(t.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer ${
                        templateName === t.id
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{t.name}</span>
                      {templateName === t.id && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Zoom Controls & PDF Export */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Zoom Controls Bar */}
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom out"
                  aria-label="Zoom out"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
                >
                  <HiMagnifyingGlassMinus size={15} />
                </button>

                <span className="min-w-[40px] text-center text-[11px] font-bold text-slate-300">
                  {Math.round(scale * 100)}%
                </span>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom in"
                  aria-label="Zoom in"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition"
                >
                  <HiMagnifyingGlassPlus size={15} />
                </button>

                <div className="h-4 w-px bg-white/10 mx-0.5" />

                <button
                  type="button"
                  onClick={handleResetFit}
                  title="Fit to screen"
                  aria-label="Fit to screen"
                  className={`flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-bold transition ${
                    isAutoFit
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <HiArrowsPointingOut size={13} />
                  <span>Fit</span>
                </button>

                <button
                  type="button"
                  onClick={handleZoom100}
                  title="100% Size"
                  className={`hidden sm:flex h-7 items-center rounded-lg px-2 text-[11px] font-bold transition ${
                    scale === 1 && !isAutoFit
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  100%
                </button>
              </div>

              {/* Quick Export PDF button if callback passed */}
              {onDownloadPDF && (
                <button
                  type="button"
                  onClick={onDownloadPDF}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <HiArrowDownTray size={14} />
                  <span>Export</span>
                </button>
              )}
            </div>
          </div>

          {/* =======================================
              RESUME CANVAS SCROLL AREA
          ======================================= */}
          <div
            id="resume-print-area"
            ref={containerRef}
            className="
              flex-1
              overflow-y-auto
              overflow-x-hidden
              p-4
              sm:p-8
              flex
              justify-center
              items-start
              print:h-auto
              print:overflow-visible
              print:bg-white
              print:p-0
            "
          >
            {/* Centered Scaled Wrapper */}
            <div
              id="resume-preview-wrapper"
              className="mx-auto flex justify-center transition-transform duration-100 ease-out"
              style={{
                width: `${Math.round(A4_WIDTH_PX * scale)}px`,
                minHeight: `${Math.round(A4_HEIGHT_PX * scale)}px`,
              }}
            >
              <div
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                {/* A4 RESUME PAPER WITH REALISTIC ELEVATION */}
                <div
                  ref={ref}
                  id="resume-preview"
                  data-print-content="resume"
                  className="
                    w-[794px]
                    min-h-[1123px]
                    rounded-md
                    bg-white
                    p-8
                    shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]
                    print:mx-0
                    print:w-full
                    print:max-w-none
                    print:min-h-0
                    print:h-auto
                    print:rounded-none
                    print:bg-white
                    print:p-0
                    print:shadow-none
                  "
                >
                  <SelectedTemplate />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;