import { useResume } from "../../context/ResumeContext";

export default function ProfessionalTemplate() {
  const { resumeData } = useResume();

  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = resumeData || {};

  /* =========================================
     Helpers
  ========================================= */

  function getDescription(item) {
    if (!item) return "";

    return (
      item.description ||
      item.details ||
      item.notes ||
      ""
    );
  }

  function getSkillName(skill) {
    if (typeof skill === "string") {
      return skill;
    }

    return (
      skill?.name ||
      skill?.skill ||
      skill?.title ||
      ""
    );
  }

  function getDateRange(item) {
    if (!item) return "";

    const start =
      item.startDate ||
      item.start ||
      "";

    const end =
      item.endDate ||
      item.end ||
      "";

    if (start && end) {
      return `${start} - ${end}`;
    }

    return start || end;
  }

  function getTechnologies(technologies) {
    if (!technologies) return "";

    if (Array.isArray(technologies)) {
      return technologies.join(", ");
    }

    return technologies;
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[794px]
        min-h-[1123px]
        bg-white
        px-12
        py-10
        text-slate-800
      "
    >
      {/* =========================================
          Header
      ========================================= */}

      <header className="border-b-2 border-slate-800 pb-6">

        <h1 className="text-4xl font-black uppercase tracking-wide text-slate-900">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg font-semibold text-slate-600">
          {personalInfo.jobTitle ||
            "Professional Title"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">

          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}

          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}

          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}

          {personalInfo.website && (
            <span>{personalInfo.website}</span>
          )}

          {personalInfo.linkedin && (
            <span>{personalInfo.linkedin}</span>
          )}

          {personalInfo.github && (
            <span>{personalInfo.github}</span>
          )}

        </div>
      </header>

      {/* =========================================
          Professional Summary
      ========================================= */}

      {personalInfo.summary && (
        <section className="mt-7">

          <SectionTitle title="Professional Summary" />

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
            {personalInfo.summary}
          </p>

        </section>
      )}

      {/* =========================================
          Experience
      ========================================= */}

      {experience.length > 0 && (
        <section className="mt-7">

          <SectionTitle title="Professional Experience" />

          <div className="mt-4 space-y-5">

            {experience.map((item, index) => (
              <article
                key={
                  item.id ||
                  `experience-${index}`
                }
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-base font-bold text-slate-900">
                      {item.jobTitle ||
                        item.position ||
                        item.title ||
                        "Job Title"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {item.company ||
                        "Company Name"}
                    </p>

                  </div>

                  {getDateRange(item) && (
                    <div className="text-right text-sm text-slate-500">
                      {getDateRange(item)}
                    </div>
                  )}

                </div>

                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location}
                  </p>
                )}

                {getDescription(item) && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {getDescription(item)}
                  </p>
                )}

              </article>
            ))}

          </div>
        </section>
      )}

      {/* =========================================
          Education
      ========================================= */}

      {education.length > 0 && (
        <section className="mt-7">

          <SectionTitle title="Education" />

          <div className="mt-4 space-y-5">

            {education.map((item, index) => (
              <article
                key={
                  item.id ||
                  `education-${index}`
                }
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-base font-bold text-slate-900">
                      {item.degree ||
                        item.program ||
                        item.title ||
                        "Degree"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {item.institution ||
                        item.school ||
                        "Institution"}
                    </p>

                  </div>

                  {getDateRange(item) && (
                    <div className="text-right text-sm text-slate-500">
                      {getDateRange(item)}
                    </div>
                  )}

                </div>

                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location}
                  </p>
                )}

                {/* Education Description */}

                {getDescription(item) && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {getDescription(item)}
                  </p>
                )}

              </article>
            ))}

          </div>
        </section>
      )}

      {/* =========================================
          Skills
      ========================================= */}

      {skills.length > 0 && (
        <section className="mt-7">

          <SectionTitle title="Skills" />

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">

            {skills.map((skill, index) => {
              const skillName =
                getSkillName(skill);

              if (!skillName) {
                return null;
              }

              return (
                <span
                  key={
                    skill?.id ||
                    `skill-${index}`
                  }
                  className="text-sm font-medium text-slate-700"
                >
                  • {skillName}
                </span>
              );
            })}

          </div>
        </section>
      )}

      {/* =========================================
          Projects
      ========================================= */}

      {projects.length > 0 && (
        <section className="mt-7">

          <SectionTitle title="Projects" />

          <div className="mt-4 space-y-5">

            {projects.map((project, index) => (
              <article
                key={
                  project.id ||
                  `project-${index}`
                }
              >

                <h3 className="text-base font-bold text-slate-900">
                  {project.name ||
                    project.title ||
                    "Project"}
                </h3>

                {project.role && (
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {project.role}
                  </p>
                )}

                {getDescription(project) && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {getDescription(project)}
                  </p>
                )}

                {project.technologies && (
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold">
                      Technologies:
                    </span>{" "}
                    {getTechnologies(
                      project.technologies
                    )}
                  </p>
                )}

                {project.url && (
                  <p className="mt-1 break-all text-sm text-slate-500">
                    {project.url}
                  </p>
                )}

              </article>
            ))}

          </div>
        </section>
      )}

      {/* =========================================
          Certifications
      ========================================= */}

      {certifications.length > 0 && (
        <section className="mt-7">

          <SectionTitle title="Certifications" />

          <div className="mt-4 space-y-4">

            {certifications.map((item, index) => (
              <article
                key={
                  item.id ||
                  `certification-${index}`
                }
              >

                <h3 className="text-sm font-bold text-slate-900">
                  {item.name ||
                    item.title ||
                    "Certification"}
                </h3>

                <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">

                  {item.issuer && (
                    <span>{item.issuer}</span>
                  )}

                  {item.issuer && item.date && (
                    <span>•</span>
                  )}

                  {item.date && (
                    <span>{item.date}</span>
                  )}

                </div>

                {/* Certification Description */}

                {getDescription(item) && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {getDescription(item)}
                  </p>
                )}

              </article>
            ))}

          </div>
        </section>
      )}

    </div>
  );
}

/* =========================================
   Section Title
========================================= */

function SectionTitle({ title }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">
        {title}
      </h2>

      <div className="mt-2 h-[2px] w-full bg-slate-800" />
    </div>
  );
}