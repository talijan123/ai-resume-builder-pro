import { useResume } from "../../context/ResumeContext";

export default function MinimalTemplate() {
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
      return `${start} — ${end}`;
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
    <div className="min-h-[1123px] bg-white px-12 py-12 text-slate-800">

      {/* =========================================
          Header
      ========================================= */}

      <header className="border-b border-slate-200 pb-8">

        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg text-slate-500">
          {personalInfo.jobTitle || "Professional"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

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
          Summary
      ========================================= */}

      {personalInfo.summary && (
        <section className="border-b border-slate-200 py-7">

          <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600">
            {personalInfo.summary}
          </p>

        </section>
      )}

      {/* =========================================
          Experience
      ========================================= */}

      {experience.length > 0 && (
        <section className="border-b border-slate-200 py-7">

          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Experience
          </h2>

          <div className="mt-6 space-y-7">

            {experience.map((item, index) => (
              <article
                key={
                  item.id ||
                  `experience-${index}`
                }
              >

                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">

                  <div>

                    <h3 className="font-bold text-slate-900">
                      {item.position ||
                        item.jobTitle ||
                        item.title ||
                        "Position"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.company || "Company"}
                    </p>

                  </div>

                  {getDateRange(item) && (
                    <p className="text-xs text-slate-400">
                      {getDateRange(item)}
                    </p>
                  )}

                </div>

                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location}
                  </p>
                )}

                {getDescription(item) && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
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
        <section className="border-b border-slate-200 py-7">

          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Education
          </h2>

          <div className="mt-6 space-y-6">

            {education.map((item, index) => (
              <article
                key={
                  item.id ||
                  `education-${index}`
                }
              >

                <div className="flex flex-col gap-1 md:flex-row md:justify-between">

                  <div>

                    <h3 className="font-bold text-slate-900">
                      {item.degree ||
                        item.program ||
                        item.title ||
                        "Degree"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.institution ||
                        item.school ||
                        "Institution"}
                    </p>

                  </div>

                  {getDateRange(item) && (
                    <p className="text-xs text-slate-400">
                      {getDateRange(item)}
                    </p>
                  )}

                </div>

                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location}
                  </p>
                )}

                {/* Education Description */}

                {getDescription(item) && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
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
        <section className="border-b border-slate-200 py-7">

          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Skills
          </h2>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">

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
                  className="text-sm text-slate-600"
                >
                  {skillName}
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
        <section className="border-b border-slate-200 py-7">

          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Projects
          </h2>

          <div className="mt-6 space-y-6">

            {projects.map((project, index) => (
              <article
                key={
                  project.id ||
                  `project-${index}`
                }
              >

                <h3 className="font-bold text-slate-900">
                  {project.name ||
                    project.title ||
                    "Project"}
                </h3>

                {project.role && (
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {project.role}
                  </p>
                )}

                {getDescription(project) && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {getDescription(project)}
                  </p>
                )}

                {project.technologies && (
                  <p className="mt-2 text-xs text-slate-500">
                    <span className="font-semibold">
                      Technologies:
                    </span>{" "}
                    {getTechnologies(
                      project.technologies
                    )}
                  </p>
                )}

                {project.url && (
                  <p className="mt-1 break-all text-xs text-slate-400">
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
        <section className="py-7">

          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Certifications
          </h2>

          <div className="mt-5 space-y-5">

            {certifications.map((cert, index) => (
              <article
                key={
                  cert.id ||
                  `certification-${index}`
                }
              >

                <h3 className="font-semibold text-slate-900">
                  {cert.name ||
                    cert.title ||
                    "Certification"}
                </h3>

                {cert.issuer && (
                  <p className="mt-1 text-sm text-slate-500">
                    {cert.issuer}
                  </p>
                )}

                {cert.date && (
                  <p className="mt-1 text-xs text-slate-400">
                    {cert.date}
                  </p>
                )}

                {/* Certification Description */}

                {getDescription(cert) && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {getDescription(cert)}
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