import { useResume } from "../../context/ResumeContext";

export default function ExecutiveTemplate() {
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
    <div className="min-h-[1123px] bg-white font-serif text-slate-800">

      {/* =========================================
          Header
      ========================================= */}

      <header className="border-b-4 border-slate-900 px-12 py-10">

        <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-slate-950">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          {personalInfo.jobTitle ||
            "Executive Professional"}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">

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
          Main Content
      ========================================= */}

      <div className="px-12 py-10">

        {/* =======================================
            Summary
        ======================================= */}

        {personalInfo.summary && (
          <section className="mb-10">

            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Executive Profile
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {personalInfo.summary}
            </p>

          </section>
        )}

        {/* =======================================
            Experience
        ======================================= */}

        {experience.length > 0 && (
          <section className="mb-10">

            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Professional Experience
            </h2>

            <div className="mt-6 space-y-8">

              {experience.map((item, index) => (
                <article
                  key={
                    item.id ||
                    `experience-${index}`
                  }
                >

                  <div className="flex flex-col justify-between gap-2 md:flex-row">

                    <div>

                      <h3 className="text-lg font-bold text-slate-950">
                        {item.position ||
                          item.jobTitle ||
                          item.title ||
                          "Position"}
                      </h3>

                      <p className="mt-1 font-semibold text-slate-600">
                        {item.company || "Company"}
                      </p>

                    </div>

                    {getDateRange(item) && (
                      <p className="text-sm font-medium text-slate-500">
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
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {getDescription(item)}
                    </p>
                  )}

                </article>
              ))}

            </div>
          </section>
        )}

        {/* =======================================
            Education + Skills
        ======================================= */}

        {(education.length > 0 ||
          skills.length > 0) && (
          <div className="grid gap-10 md:grid-cols-2">

            {/* ===================================
                Education
            =================================== */}

            {education.length > 0 && (
              <section>

                <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
                  Education
                </h2>

                <div className="mt-5 space-y-6">

                  {education.map((item, index) => (
                    <div
                      key={
                        item.id ||
                        `education-${index}`
                      }
                    >

                      <h3 className="font-bold text-slate-950">
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

                      {getDateRange(item) && (
                        <p className="mt-1 text-xs text-slate-400">
                          {getDateRange(item)}
                        </p>
                      )}

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

                    </div>
                  ))}

                </div>

              </section>
            )}

            {/* ===================================
                Skills
            =================================== */}

            {skills.length > 0 && (
              <section>

                <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
                  Core Skills
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">

                  {skills.map((skill, index) => {
                    const skillName =
                      getSkillName(skill);

                    if (!skillName) {
                      return null;
                    }

                    return (
                      <div
                        key={
                          skill?.id ||
                          `skill-${index}`
                        }
                        className="text-sm font-medium text-slate-700"
                      >
                        • {skillName}
                      </div>
                    );
                  })}

                </div>

              </section>
            )}

          </div>
        )}

        {/* =======================================
            Projects
        ======================================= */}

        {projects.length > 0 && (
          <section className="mt-10">

            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Selected Projects
            </h2>

            <div className="mt-5 grid gap-6 md:grid-cols-2">

              {projects.map((project, index) => (
                <div
                  key={
                    project.id ||
                    `project-${index}`
                  }
                >

                  <h3 className="font-bold text-slate-950">
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
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
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

                </div>
              ))}

            </div>

          </section>
        )}

        {/* =======================================
            Certifications
        ======================================= */}

        {certifications.length > 0 && (
          <section className="mt-10">

            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Certifications
            </h2>

            <div className="mt-5 grid gap-6 md:grid-cols-2">

              {certifications.map((cert, index) => (
                <div
                  key={
                    cert.id ||
                    `certification-${index}`
                  }
                >

                  <h3 className="font-bold text-slate-900">
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

                </div>
              ))}

            </div>

          </section>
        )}

      </div>
    </div>
  );
}