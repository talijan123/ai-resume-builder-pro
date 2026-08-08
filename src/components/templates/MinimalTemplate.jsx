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
  } = resumeData;

  return (
    <div className="min-h-[1123px] bg-white px-12 py-12 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg text-slate-500">
          {personalInfo.jobTitle || "Professional"}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span>{personalInfo.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="border-b border-slate-200 py-7">
          <p className="max-w-3xl text-sm leading-7 text-slate-600">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="border-b border-slate-200 py-7">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Experience
          </h2>

          <div className="mt-6 space-y-7">
            {experience.map((item) => (
              <article key={item.id}>
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {item.position || item.jobTitle || "Position"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.company || "Company"}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400">
                    {item.startDate || ""}{" "}
                    {item.endDate ? `— ${item.endDate}` : ""}
                  </p>
                </div>

                {item.description && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="border-b border-slate-200 py-7">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Education
          </h2>

          <div className="mt-6 space-y-5">
            {education.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 md:flex-row md:justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    {item.degree || "Degree"}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.institution || "Institution"}
                  </p>
                </div>

                <p className="text-xs text-slate-400">
                  {item.startDate || ""}{" "}
                  {item.endDate ? `— ${item.endDate}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="border-b border-slate-200 py-7">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Skills
          </h2>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm text-slate-600"
              >
                {skill.name || skill.skill || skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="border-b border-slate-200 py-7">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Projects
          </h2>

          <div className="mt-6 space-y-5">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-bold text-slate-900">
                  {project.name || project.title || "Project"}
                </h3>

                {project.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="py-7">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-950">
            Certifications
          </h2>

          <div className="mt-5 space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {cert.name || cert.title || "Certification"}
                </span>

                {cert.issuer && ` — ${cert.issuer}`}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}