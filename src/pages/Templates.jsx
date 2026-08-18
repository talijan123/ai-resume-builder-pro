import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  HiCheck,
  HiEye,
  HiMagnifyingGlass,
  HiSparkles,
  HiAdjustmentsHorizontal,
} from "react-icons/hi2";

import DashboardHeader from "../components/layout/DashboardHeader";

import ModernTemplate from "../components/templates/ModernTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import CreativeTemplate from "../components/templates/CreativeTemplate";
import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";

import { ResumeProvider } from "../context/ResumeContext";
import { templatePreviewData } from "../data/templatePreviewData";

/* =========================================================
   Templates
========================================================= */

const templates = [
  {
    id: "modern",
    name: "Modern",
    category: "Modern",
    badge: "Popular",
    description:
      "A clean, modern layout designed for technology, startups, developers, and creative professionals.",
    component: ModernTemplate,
    recommended: true,
  },

  {
    id: "professional",
    name: "Professional",
    category: "Corporate",
    badge: "Professional",
    description:
      "A polished and structured design for corporate roles, business professionals, and traditional applications.",
    component: ProfessionalTemplate,
    recommended: false,
  },

  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    badge: "Creative",
    description:
      "A visually engaging layout for designers, marketers, developers, and creative professionals.",
    component: CreativeTemplate,
    recommended: false,
  },

  {
    id: "executive",
    name: "Executive",
    category: "Corporate",
    badge: "Executive",
    description:
      "A sophisticated resume design created for leadership, management, and experienced professionals.",
    component: ExecutiveTemplate,
    recommended: false,
  },

  {
    id: "minimal",
    name: "Minimal",
    category: "ATS Friendly",
    badge: "ATS Friendly",
    description:
      "A simple and elegant layout that keeps attention on your experience, skills, and achievements.",
    component: MinimalTemplate,
    recommended: true,
  },
];

/* =========================================================
   Categories
========================================================= */

const categories = [
  "All",
  "Modern",
  "Corporate",
  "Creative",
  "ATS Friendly",
];

/* =========================================================
   Templates Page
========================================================= */

export default function Templates() {
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] =
    useState("modern");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [previewTemplate, setPreviewTemplate] =
    useState(null);

  /* =======================================================
     Filter Templates
  ======================================================= */

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory =
        activeCategory === "All" ||
        template.category === activeCategory;

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        template.name
          .toLowerCase()
          .includes(searchText) ||
        template.description
          .toLowerCase()
          .includes(searchText) ||
        template.category
          .toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [activeCategory, search]);

  /* =======================================================
     Use Template
  ======================================================= */

  function handleUseTemplate(templateId) {
    navigate(`/builder?template=${templateId}`);
  }

  /* =======================================================
     Page
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================================================
          PROFESSIONAL GLOBAL HEADER
      =================================================== */}

      <DashboardHeader
        title="Resume Templates"
        subtitle="Choose a professional design for your resume"
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1500px] px-6 py-10">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="mb-10">
          <div className="max-w-3xl">
            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-blue-50
                px-4
                py-2
                text-sm
                font-bold
                text-blue-700
              "
            >
              <HiSparkles size={17} />

              Professional Resume Designs
            </div>

            <h2
              className="
                text-4xl
                font-black
                tracking-tight
                text-slate-900
                md:text-5xl
              "
            >
              Choose a template that
              <span className="text-blue-600">
                {" "}
                represents you.
              </span>
            </h2>

            <p
              className="
                mt-4
                text-lg
                leading-8
                text-slate-500
              "
            >
              Start with a professionally designed
              layout and customize your resume with
              your own experience, education, skills,
              projects, and achievements.
            </p>
          </div>
        </section>

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <section className="mb-10">
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* Search */}

            <div className="relative w-full lg:max-w-md">
              <HiMagnifyingGlass
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search templates..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            {/* Categories */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <div
                className="
                  mr-1
                  hidden
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-500
                  xl:flex
                "
              >
                <HiAdjustmentsHorizontal size={18} />

                Filter:
              </div>

              {categories.map((category) => {
                const active =
                  activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category)
                    }
                    className={`
                      rounded-full
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      transition-all

                      ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================
            RESULTS HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h3
              className="
                text-xl
                font-black
                text-slate-900
              "
            >
              Resume templates
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {filteredTemplates.length} template
              {filteredTemplates.length !== 1
                ? "s"
                : ""}{" "}
              available
            </p>
          </div>

          {selectedTemplate && (
            <div
              className="
                hidden
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-500
                sm:flex
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-green-500
                "
              />

              Selected:{" "}

              <span className="text-slate-900">
                {
                  templates.find(
                    (template) =>
                      template.id ===
                      selectedTemplate
                  )?.name
                }
              </span>
            </div>
          )}
        </div>

        {/* =================================================
            TEMPLATE GRID
        ================================================= */}

        {filteredTemplates.length > 0 ? (
          <div
            className="
              grid
              gap-8
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredTemplates.map((template) => {
              const TemplateComponent =
                template.component;

              const selected =
                selectedTemplate ===
                template.id;

              return (
                <article
                  key={template.id}
                  className={`
                    group
                    overflow-hidden
                    rounded-3xl
                    border
                    bg-white
                    transition-all
                    duration-300

                    ${
                      selected
                        ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-4 ring-blue-50"
                        : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                    }
                  `}
                >
                  {/* =====================================
                      PREVIEW AREA
                  ===================================== */}

                  <div
                    className="
                      relative
                      h-[570px]
                      overflow-hidden
                      bg-slate-100
                    "
                  >
                    {/* Badge */}

                    <div
                      className="
                        absolute
                        left-5
                        top-5
                        z-20
                      "
                    >
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          shadow-sm

                          ${
                            template.recommended
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-700"
                          }
                        `}
                      >
                        {template.recommended && (
                          <HiSparkles size={13} />
                        )}

                        {template.badge}
                      </span>
                    </div>

                    {/* Selected Indicator */}

                    {selected && (
                      <div
                        className="
                          absolute
                          right-5
                          top-5
                          z-20
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-600
                          text-white
                          shadow-lg
                        "
                      >
                        <HiCheck size={19} />
                      </div>
                    )}

                    {/* Resume Preview */}

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTemplate(
                          template.id
                        )
                      }
                      className="
                        absolute
                        inset-0
                        flex
                        cursor-pointer
                        items-start
                        justify-center
                        overflow-hidden
                        pt-8
                      "
                    >
                      <div
                        className="
                          pointer-events-none
                          w-[794px]
                          origin-top
                          scale-[0.62]
                          bg-white
                          shadow-2xl
                          transition-transform
                          duration-500
                          group-hover:scale-[0.65]
                        "
                      >
                        <ResumeProvider
                          initialData={
                            templatePreviewData[
                              template.id
                            ]
                          }
                        >
                          <TemplateComponent />
                        </ResumeProvider>
                      </div>
                    </button>

                    {/* Hover Overlay */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-10
                        flex
                        items-center
                        justify-center
                        bg-slate-900/0
                        transition-all
                        duration-300
                        group-hover:bg-slate-900/10
                      "
                    >
                      <div
                        className="
                          flex
                          translate-y-3
                          items-center
                          gap-2
                          rounded-xl
                          bg-white
                          px-5
                          py-3
                          font-bold
                          text-slate-800
                          opacity-0
                          shadow-xl
                          transition-all
                          duration-300
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      >
                        <HiEye size={19} />

                        Click to select
                      </div>
                    </div>
                  </div>

                  {/* =====================================
                      TEMPLATE INFO
                  ===================================== */}

                  <div
                    className="
                      border-t
                      border-slate-100
                      p-6
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div>
                        <h3
                          className="
                            text-xl
                            font-black
                            text-slate-900
                          "
                        >
                          {template.name}
                        </h3>

                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-500
                          "
                        >
                          {template.description}
                        </p>
                      </div>

                      {selected && (
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-600
                            text-white
                          "
                        >
                          <HiCheck size={17} />
                        </div>
                      )}
                    </div>

                    {/* Actions */}

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewTemplate(
                            template
                          )
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-slate-700
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <HiEye size={18} />

                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUseTemplate(
                            template.id
                          )
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-gradient-to-r
                          from-blue-600
                          to-indigo-600
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-white
                          shadow-md
                          shadow-blue-500/20
                          transition
                          hover:-translate-y-0.5
                          hover:shadow-lg
                        "
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* =============================================
             NO RESULTS
          ============================================= */

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              px-6
              py-20
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
              "
            >
              <HiMagnifyingGlass size={28} />
            </div>

            <h3
              className="
                mt-5
                text-xl
                font-black
                text-slate-900
              "
            >
              No templates found
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              Try another search term or select a
              different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="
                mt-6
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* =================================================
            BOTTOM INFO
        ================================================= */}

        <section
          className="
            mt-12
            overflow-hidden
            rounded-3xl
            border
            border-blue-100
            bg-gradient-to-r
            from-blue-50
            to-indigo-50
            p-7
            md:p-9
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="max-w-3xl">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-blue-700
                "
              >
                <HiSparkles size={20} />

                <span className="text-sm font-bold">
                  Need help choosing?
                </span>
              </div>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-slate-900
                "
              >
                Choose based on your career.
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                Use Modern for technology and
                startups, Professional or Executive
                for corporate roles, Creative for
                design-focused careers, and Minimal
                when you want a simple ATS-friendly
                resume.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                handleUseTemplate("modern")
              }
              className="
                shrink-0
                rounded-xl
                bg-white
                px-6
                py-3.5
                text-sm
                font-bold
                text-blue-700
                shadow-sm
                ring-1
                ring-blue-200
                transition
                hover:bg-blue-600
                hover:text-white
              "
            >
              Start With Modern
            </button>
          </div>
        </section>
      </main>

      {/* ===================================================
          FULL PREVIEW MODAL
      =================================================== */}

      {previewTemplate && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/70
            p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setPreviewTemplate(null)
          }
        >
          <div
            className="
              relative
              flex
              max-h-[95vh]
              w-full
              max-w-6xl
              flex-col
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-200
                px-6
                py-4
              "
            >
              <div>
                <h3
                  className="
                    text-lg
                    font-black
                    text-slate-900
                  "
                >
                  {previewTemplate.name} Template
                </h3>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Preview
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPreviewTemplate(null)
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-100
                "
              >
                Close
              </button>
            </div>

            {/* Modal Content */}

            <div
              className="
                flex-1
                overflow-auto
                bg-slate-100
                p-8
              "
            >
              <div
                className="
                  mx-auto
                  w-[794px]
                  bg-white
                  shadow-2xl
                "
              >
                {(() => {
                  const PreviewComponent =
                    previewTemplate.component;

                  return (
                    <ResumeProvider
                      initialData={
                        templatePreviewData[
                          previewTemplate.id
                        ]
                      }
                    >
                      <PreviewComponent />
                    </ResumeProvider>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-slate-200
                bg-white
                px-6
                py-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  setPreviewTemplate(null)
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  handleUseTemplate(
                    previewTemplate.id
                  )
                }
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                "
              >
                Use {previewTemplate.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}