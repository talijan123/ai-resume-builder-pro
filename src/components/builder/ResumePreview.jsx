import { forwardRef } from "react";
import { useSearchParams } from "react-router-dom";

import ModernTemplate from "../templates/ModernTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";

const templates = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
};

const ResumePreview = forwardRef((props, ref) => {
  const [searchParams] = useSearchParams();

  const templateName =
    searchParams.get("template") || "modern";

  const SelectedTemplate =
    templates[templateName] || ModernTemplate;

  return (
    <>
      {/* =========================================
          PRINT STYLES
      ========================================= */}

      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }

          @media print {

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              background: white !important;
            }

            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            #resume-print-area {
              width: 210mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            #resume-preview {
              width: 210mm !important;
              min-height: 297mm !important;
              height: auto !important;

              margin: 0 !important;
              padding: 10mm !important;

              border-radius: 0 !important;
              box-shadow: none !important;

              overflow: visible !important;
              background: white !important;
            }

            /*
              Prevent individual resume entries
              from being split between pages.
            */

            .resume-entry,
            .resume-section,
            .resume-education-item,
            .resume-experience-item,
            .resume-project-item,
            .resume-certification-item {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /*
              Keep section headings with the
              content immediately below them.
            */

            .resume-section-title {
              break-after: avoid !important;
              page-break-after: avoid !important;
            }

            /*
              Prevent tables, cards and common
              resume blocks from splitting.
            */

            table,
            tr,
            td,
            th,
            figure,
            blockquote {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /*
              Don't create an unnecessary page
              after the final resume content.
            */

            #resume-preview > *:last-child {
              break-after: auto !important;
              page-break-after: auto !important;
            }

            /*
              Remove screen-only UI.
            */

            .print\\:hidden {
              display: none !important;
            }

            /*
              Links should print as normal text.
            */

            a {
              color: inherit !important;
              text-decoration: none !important;
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
            Preview Header
        ======================================= */}

        <div
          className="
            border-b
            border-slate-200
            p-5

            print:hidden
          "
        >
          <h2 className="text-xl font-bold text-slate-900">
            Live Preview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {templateName.charAt(0).toUpperCase() +
              templateName.slice(1)}{" "}
            Template
          </p>
        </div>

        {/* =======================================
            Resume Scroll Area
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
              A4 Resume Paper
          ===================================== */}

          <div
            ref={ref}
            id="resume-preview"
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
              print:w-[210mm]
              print:max-w-none
              print:min-h-[297mm]
              print:h-auto
              print:rounded-none
              print:bg-white
              print:p-[10mm]
              print:shadow-none
            "
          >
            <SelectedTemplate />
          </div>
        </div>
      </div>
    </>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;