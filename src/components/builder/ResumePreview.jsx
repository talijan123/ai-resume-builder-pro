import {
  forwardRef,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  useResume,
} from "../../context/ResumeContext";

import ModernTemplate from "../templates/ModernTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";

/* =========================================================
   AVAILABLE TEMPLATES
========================================================= */

const templates = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
};

/* =========================================================
   RESUME PREVIEW
========================================================= */

const ResumePreview = forwardRef(
  (props, ref) => {
    /* =======================================================
       RESUME CONTEXT
    ======================================================= */

    const {
      resumeData,
    } = useResume();

    /* =======================================================
       URL SEARCH PARAMS
       
       Used mainly when creating a NEW resume:
       
       /builder?template=professional
    ======================================================= */

    const [searchParams] =
      useSearchParams();

    const urlTemplate =
      searchParams.get("template");

    /* =======================================================
       SELECT TEMPLATE
       
       Priority:
       
       1. resumeData.template
          → Saved resume / current context
       
       2. URL ?template=
          → New resume template selection
       
       3. modern
          → Final fallback
    ======================================================= */

    const templateName =
      resumeData?.template ||
      urlTemplate ||
      "modern";

    /* =======================================================
       SELECT TEMPLATE COMPONENT
    ======================================================= */

    const SelectedTemplate =
      templates[templateName] ||
      ModernTemplate;

    /* =======================================================
       DISPLAY TEMPLATE NAME
    ======================================================= */

    const displayTemplateName =
      templateName
        .charAt(0)
        .toUpperCase() +
      templateName.slice(1);

    /* =======================================================
       RENDER
    ======================================================= */

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

              html,
              body {
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

              /* =========================================
                 KEEP RESUME ENTRIES TOGETHER
              ========================================= */

              .resume-entry,
              .resume-section,
              .resume-education-item,
              .resume-experience-item,
              .resume-project-item,
              .resume-certification-item {
                break-inside: avoid !important;

                page-break-inside: avoid !important;
              }

              /* =========================================
                 KEEP SECTION HEADINGS WITH CONTENT
              ========================================= */

              .resume-section-title {
                break-after: avoid !important;

                page-break-after: avoid !important;
              }

              /* =========================================
                 PREVENT COMMON ELEMENTS FROM SPLITTING
              ========================================= */

              table,
              tr,
              td,
              th,
              figure,
              blockquote {
                break-inside: avoid !important;

                page-break-inside: avoid !important;
              }

              /* =========================================
                 AVOID UNNECESSARY FINAL PAGE BREAK
              ========================================= */

              #resume-preview > *:last-child {
                break-after: auto !important;

                page-break-after: auto !important;
              }

              /* =========================================
                 HIDE SCREEN-ONLY ELEMENTS
              ========================================= */

              .print\\:hidden {
                display: none !important;
              }

              /* =========================================
                 LINKS
              ========================================= */

              a {
                color: inherit !important;

                text-decoration: none !important;
              }

              /* =========================================
                 RESUME PAGE BREAK HELPERS
              ========================================= */

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

              /* =========================================
                 HEADINGS
              ========================================= */

              h1,
              h2,
              h3,
              h4,
              h5,
              h6 {
                break-after: avoid !important;

                page-break-after: avoid !important;
              }

              /* =========================================
                 PARAGRAPHS
              ========================================= */

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
            sticky
            top-24

            h-[calc(100vh-120px)]

            overflow-hidden

            rounded-3xl

            border
            border-slate-200

            bg-white

            shadow-xl

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
              PREVIEW HEADER
          ======================================= */}

          <div
            className="
              border-b
              border-slate-200

              p-5

              print:hidden
            "
          >
            <h2
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Live Preview
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {displayTemplateName} Template
            </p>
          </div>

          {/* =======================================
              RESUME SCROLL AREA
          ======================================= */}

          <div
            id="resume-print-area"
            className="
              h-full

              overflow-y-auto

              bg-slate-100

              p-6

              print:h-auto
              print:overflow-visible
              print:bg-white
              print:p-0
            "
          >
            {/* =====================================
                A4 RESUME PAPER
            ===================================== */}

            <div
              ref={ref}
              id="resume-preview"
              data-print-content="resume"
              className="
                mx-auto

                w-full
                max-w-[794px]

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
      </>
    );
  }
);

ResumePreview.displayName =
  "ResumePreview";

export default ResumePreview;