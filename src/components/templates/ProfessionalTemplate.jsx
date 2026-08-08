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
          {personalInfo.jobTitle || "Professional Title"}
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

          <p className="mt-3 text-sm leading-6 text-slate-700">
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
            {experience.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.jobTitle ||
                        item.position ||
                        "Job Title"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {item.company || "Company Name"}
                    </p>
                  </div>

                  <div className="text-right text-sm text-slate-500">
                    {(item.startDate || item.start) && (
                      <span>
                        {item.startDate || item.start}
                      </span>
                    )}

                    {(item.startDate || item.start) &&
                      (item.endDate || item.end) && (
                        <span> - </span>
                      )}

                    {(item.endDate || item.end) && (
                      <span>
                        {item.endDate || item.end}
                      </span>
                    )}
                  </div>
                </div>

                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location}
                  </p>
                )}

                {item.description && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {item.description}
                  </p>
                )}
              </div>
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
            {education.map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.degree ||
                        item.program ||
                        "Degree"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {item.institution ||
                        item.school ||
                        "Institution"}
                    </p>
                  </div>

                  <div className="text-right text-sm text-slate-500">
                    {(item.startDate || item.start) && (
                      <span>
                        {item.startDate || item.start}
                      </span>
                    )}

                    {(item.startDate || item.start) &&
                      (item.endDate || item.end) && (
                        <span> - </span>
                      )}

                    {(item.endDate || item.end) && (
                      <span>
                        {item.endDate || item.end}
                      </span>
                    )}
                  </div>
                </div>

                {item.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location}
                  </p>
                )}

                {item.description && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {item.description}
                  </p>
                )}
              </div>
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
            {skills.map((skill) => {
              const skillName =
                typeof skill === "string"
                  ? skill
                  : skill.name ||
                    skill.skill ||
                    skill.title;

              if (!skillName) return null;

              return (
                <span
                  key={skill.id || skillName}
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
            {projects.map((project) => (
              <div key={project.id}>
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

                {project.description && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                    {project.description}
                  </p>
                )}

                {project.technologies && (
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold">
                      Technologies:
                    </span>{" "}
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(", ")
                      : project.technologies}
                  </p>
                )}

                {project.url && (
                  <p className="mt-1 text-sm text-slate-500">
                    {project.url}
                  </p>
                )}
              </div>
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

          <div className="mt-4 space-y-3">
            {certifications.map((item) => (
              <div key={item.id}>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.name ||
                    item.title ||
                    "Certification"}
                </h3>

                <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                  {item.issuer && (
                    <span>{item.issuer}</span>
                  )}

                  {item.date && (
                    <>
                      <span>•</span>
                      <span>{item.date}</span>
                    </>
                  )}
                </div>
              </div>
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