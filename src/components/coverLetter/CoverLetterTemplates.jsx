import { HiCheck, HiSparkles } from "react-icons/hi2";
import { useCoverLetter } from "../../context/CoverLetterContext";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description:
      "A clean and contemporary design with a strong accent header. Great for technology, startups, and creative roles.",
    badge: "Popular",
  },
  {
    id: "professional",
    name: "Professional",
    description:
      "A structured and formal design created for corporate, business, finance, and traditional applications.",
    badge: "Corporate",
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "A simple, elegant, and highly readable design that keeps attention on your experience and message.",
    badge: "ATS Friendly",
  },
];

export default function CoverLetterTemplates() {
  const { coverLetterData, setTemplate } = useCoverLetter();

  const selectedTemplate =
    coverLetterData?.template || "modern";

  return (
    <section className="mb-8">
      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
          <HiSparkles size={14} />

          Choose Your Design
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Select a cover letter template
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Choose a professional design before writing your
          letter. You can switch templates at any time without
          losing your information.
        </p>
      </div>

      {/* =====================================================
          TEMPLATE GRID
      ===================================================== */}

      <div className="grid gap-5 md:grid-cols-3">
        {templates.map((template) => {
          const selected =
            selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => setTemplate(template.id)}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-white
                text-left
                transition-all
                duration-300
                ${
                  selected
                    ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50"
                    : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                }
              `}
            >
              {/* =================================================
                  TEMPLATE PREVIEW
              ================================================= */}

              <div className="relative h-[270px] overflow-hidden bg-slate-100 p-5">
                {/* Badge */}

                <div className="absolute left-4 top-4 z-20">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-black
                      uppercase
                      tracking-wide
                      shadow-sm
                      ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-600"
                      }
                    `}
                  >
                    {template.badge}
                  </span>
                </div>

                {/* Selected Check */}

                {selected && (
                  <div className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                    <HiCheck size={17} />
                  </div>
                )}

                {/* =================================================
                    PAPER
                ================================================= */}

                <div
                  className={`
                    mx-auto
                    h-[430px]
                    w-[305px]
                    origin-top
                    scale-[0.72]
                    overflow-hidden
                    bg-white
                    shadow-xl
                    transition-transform
                    duration-300
                    group-hover:scale-[0.74]
                  `}
                >
                  <TemplateMiniPreview
                    template={template.id}
                  />
                </div>
              </div>

              {/* =================================================
                  TEMPLATE INFORMATION
              ================================================= */}

              <div className="border-t border-slate-100 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {template.name}
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {template.description}
                    </p>
                  </div>

                  {selected && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <HiCheck size={15} />
                    </div>
                  )}
                </div>

                <div
                  className={`
                    mt-4
                    rounded-xl
                    px-3
                    py-2.5
                    text-center
                    text-xs
                    font-bold
                    transition
                    ${
                      selected
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-700"
                    }
                  `}
                >
                  {selected
                    ? "Selected Template"
                    : "Use This Template"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   MINI TEMPLATE PREVIEW
========================================================= */

function TemplateMiniPreview({ template }) {
  if (template === "professional") {
    return <ProfessionalMiniPreview />;
  }

  if (template === "minimal") {
    return <MinimalMiniPreview />;
  }

  return <ModernMiniPreview />;
}

/* =========================================================
   MODERN
========================================================= */

function ModernMiniPreview() {
  return (
    <div className="h-full bg-white px-8 py-7 text-slate-900">
      {/* Header */}

      <div className="border-b-[3px] border-blue-600 pb-5">
        <div className="text-xl font-black tracking-tight">
          TALAL HASSAN
        </div>

        <div className="mt-1 text-[8px] font-semibold text-blue-600">
          FRONTEND DEVELOPER
        </div>

        <div className="mt-3 flex gap-2 text-[6px] text-slate-400">
          <span>email@example.com</span>
          <span>•</span>
          <span>+92 300 1234567</span>
        </div>
      </div>

      {/* Date */}

      <div className="mt-7 text-[7px] text-slate-400">
        July 30, 2026
      </div>

      {/* Recipient */}

      <div className="mt-5 space-y-1 text-[7px] text-slate-600">
        <div className="font-bold text-slate-800">
          Hiring Manager
        </div>

        <div>Acme Technologies</div>

        <div>Islamabad, Pakistan</div>
      </div>

      {/* Greeting */}

      <div className="mt-7 text-[7px] font-bold">
        Dear Hiring Manager,
      </div>

      {/* Content */}

      <div className="mt-4 space-y-3">
        <FakeParagraph />

        <FakeParagraph lines={5} />

        <FakeParagraph lines={3} />
      </div>

      {/* Signature */}

      <div className="mt-6 text-[7px]">
        <div>Best regards,</div>

        <div className="mt-3 font-black">
          Talal Hassan
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL
========================================================= */

function ProfessionalMiniPreview() {
  return (
    <div className="h-full bg-white px-9 py-8 text-slate-900">
      {/* Header */}

      <div className="text-center">
        <div className="text-xl font-black tracking-wide">
          TALAL HASSAN
        </div>

        <div className="mt-1 text-[7px] text-slate-500">
          FRONTEND DEVELOPER
        </div>

        <div className="mx-auto mt-3 h-px w-full bg-slate-300" />

        <div className="mt-3 text-[6px] text-slate-500">
          email@example.com&nbsp;&nbsp; | &nbsp;&nbsp;+92 300
          1234567&nbsp;&nbsp; | &nbsp;&nbsp;Abbottabad, Pakistan
        </div>
      </div>

      {/* Date */}

      <div className="mt-8 text-[7px] text-slate-600">
        July 30, 2026
      </div>

      {/* Recipient */}

      <div className="mt-5 space-y-1 text-[7px] leading-4 text-slate-700">
        <div className="font-bold">
          Hiring Manager
        </div>

        <div className="font-semibold">
          Acme Technologies
        </div>

        <div>Islamabad, Pakistan</div>
      </div>

      {/* Greeting */}

      <div className="mt-7 text-[7px] font-semibold">
        Dear Hiring Manager,
      </div>

      {/* Content */}

      <div className="mt-4 space-y-3">
        <FakeParagraph />

        <FakeParagraph lines={5} />

        <FakeParagraph lines={4} />
      </div>

      {/* Closing */}

      <div className="mt-6 text-[7px] text-slate-700">
        Sincerely,
      </div>

      <div className="mt-3 text-[7px] font-bold">
        Talal Hassan
      </div>
    </div>
  );
}

/* =========================================================
   MINIMAL
========================================================= */

function MinimalMiniPreview() {
  return (
    <div className="h-full bg-white px-9 py-8 text-slate-900">
      {/* Header */}

      <div>
        <div className="text-xl font-semibold tracking-tight">
          Talal Hassan
        </div>

        <div className="mt-2 text-[6px] text-slate-400">
          email@example.com · +92 300 1234567 ·
          Abbottabad, Pakistan
        </div>
      </div>

      {/* Divider */}

      <div className="mt-5 h-px bg-slate-200" />

      {/* Date */}

      <div className="mt-8 text-[7px] text-slate-400">
        July 30, 2026
      </div>

      {/* Recipient */}

      <div className="mt-6 space-y-1 text-[7px] text-slate-600">
        <div>Hiring Manager</div>

        <div>Acme Technologies</div>

        <div>Islamabad, Pakistan</div>
      </div>

      {/* Greeting */}

      <div className="mt-8 text-[7px]">
        Dear Hiring Manager,
      </div>

      {/* Content */}

      <div className="mt-5 space-y-4 text-slate-600">
        <FakeParagraph />

        <FakeParagraph lines={5} />

        <FakeParagraph lines={4} />
      </div>

      {/* Signature */}

      <div className="mt-7 text-[7px]">
        <div>Kind regards,</div>

        <div className="mt-3 font-semibold text-slate-900">
          Talal Hassan
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FAKE TEXT LINES
========================================================= */

function FakeParagraph({ lines = 4 }) {
  const widths = [
    "w-full",
    "w-[94%]",
    "w-[88%]",
    "w-[96%]",
    "w-[72%]",
    "w-[91%]",
  ];

  return (
    <div className="space-y-1.5">
      {Array.from({ length: lines }).map(
        (_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full bg-slate-200 ${
              widths[index % widths.length]
            }`}
          />
        )
      )}
    </div>
  );
}