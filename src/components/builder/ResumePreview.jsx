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
      "
    >
      {/* Preview Header */}

      <div className="border-b border-slate-200 p-5 print:hidden">
        <h2 className="text-xl font-bold text-slate-900">
          Live Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {templateName.charAt(0).toUpperCase() +
            templateName.slice(1)}{" "}
          Template
        </p>
      </div>

      {/* Resume Container */}

      <div
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
        {/* Resume Paper */}

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

            print:max-w-none
            print:rounded-none
            print:shadow-none
            print:min-h-0
            print:p-10
          "
        >
          <SelectedTemplate />
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;