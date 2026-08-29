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
} from "react-icons/hi2";

import {
  useResume,
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

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

/* =========================================================
   RESUME PREVIEW COMPONENT
========================================================= */

const ResumePreview = forwardRef(
  (props, ref) => {
    const { resumeData } = useResume();
    const [searchParams] = useSearchParams();
    const urlTemplate = searchParams.get("template");

    const templateName =
      resumeData?.template || urlTemplate || "modern";

    const SelectedTemplate =
      templates[templateName] || ModernTemplate;

    const displayTemplateName =
      templateName.charAt(0).toUpperCase() + templateName.slice(1);

    // Zoom and responsive scaling state
    const [scale, setScale] = useState(1);
    const [isAutoFit, setIsAutoFit] = useState(true);
    const containerRef = useRef(null);

    // Auto-calculate scale on resize when in AutoFit mode
    useEffect(() => {
      function calculateFitScale() {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth - 32; // padding offset
        if (containerWidth > 0) {
          const autoScale = Math.min(1, Math.max(0.35, containerWidth / A4_WIDTH_PX));
          if (isAutoFit) {
            setScale(autoScale);
          }
        }
      }

      calculateFitScale();
      window.addEventListener("resize", calculateFitScale);
      return () => window.removeEventListener("resize", calculateFitScale);
    }, [isAutoFit]);

    function handleZoomIn() {
      setIsAutoFit(false);
      setScale((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(2))));
    }

    function handleZoomOut() {
      setIsAutoFit(false);
      setScale((prev) => Math.max(0.35, Number((prev - 0.1).toFixed(2))));
    }

    function handleResetFit() {
      setIsAutoFit(true);
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32;
        setScale(Math.min(1, Math.max(0.35, containerWidth / A4_WIDTH_PX)));
      }
    }

    function handleZoom100() {
      setIsAutoFit(false);
      setScale(1);
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
            PREVIEW CONTAINER
        ========================================= */}
        <div
          className="
            xl:sticky
            xl:top-24
            w-full
            xl:h-[calc(100vh-120px)]
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            dark:border-slate-800
            bg-white
            dark:bg-slate-900
            shadow-xl
            transition-colors
            flex
            flex-col
            print:static
            print:h-auto
            print:overflow-visible
            print:rounded-none
            print:border-0
            print:bg-white
            print:shadow-none
          "
        >
          {/* =======================================
              PREVIEW HEADER & ZOOM TOOLBAR
          ======================================= */}
          <div
            className="
              border-b
              border-slate-200
              dark:border-slate-800
              p-3.5
              sm:p-4
              flex
              items-center
              justify-between
              gap-3
              bg-white/80
              dark:bg-slate-900/80
              backdrop-blur-sm
              shrink-0
              print:hidden
            "
          >
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Live Preview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {displayTemplateName} Template
              </p>
            </div>

            {/* Zoom Controls Bar */}
            <div className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-1">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom out"
                aria-label="Zoom out"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition shadow-none hover:shadow-sm"
              >
                <HiMagnifyingGlassMinus size={15} />
              </button>

              <span className="min-w-[38px] text-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom in"
                aria-label="Zoom in"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition shadow-none hover:shadow-sm"
              >
                <HiMagnifyingGlassPlus size={15} />
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

              <button
                type="button"
                onClick={handleResetFit}
                title="Fit to window"
                aria-label="Fit to window"
                className={`flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-bold transition ${
                  isAutoFit
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
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
                    : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                100%
              </button>
            </div>
          </div>

          {/* =======================================
              RESUME SCROLL & ZOOM AREA
          ======================================= */}
          <div
            id="resume-print-area"
            ref={containerRef}
            className="
              flex-1
              overflow-y-auto
              overflow-x-auto
              bg-slate-100
              dark:bg-slate-950/60
              p-3
              sm:p-6
              print:h-auto
              print:overflow-visible
              print:bg-white
              print:p-0
            "
          >
            {/* Scaled Wrapper */}
            <div
              id="resume-preview-wrapper"
              className="mx-auto flex justify-center origin-top transition-transform duration-150"
              style={{
                width: `${A4_WIDTH_PX * scale}px`,
                minHeight: `${A4_HEIGHT_PX * scale}px`,
              }}
            >
              <div
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                {/* A4 RESUME PAPER */}
                <div
                  ref={ref}
                  id="resume-preview"
                  data-print-content="resume"
                  className="
                    w-[794px]
                    min-h-[1123px]
                    rounded-xl
                    bg-white
                    p-8
                    shadow-xl
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