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
  } = resumeData;

  return (
    <div className="min-h-[1123px] bg-white font-serif text-slate-800">
      {/* Header */}
      <header className="border-b-4 border-slate-900 px-12 py-10">
        <h1 className="text-4xl font-black uppercase tracking-[0.08em] text-slate-950">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="mt-2 text-lg font-semibold uppercase tracking-[0.15em] text-slate-500">
          {personalInfo.jobTitle || "Executive Professional"}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="px-12 py-10">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-10">
            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Executive Profile
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-10">
            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Professional Experience
            </h2>

            <div className="mt-6 space-y-8">
              {experience.map((item) => (
                <article key={item.id}>
                  <div className="flex flex-col justify-between gap-2 md:flex-row">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {item.position || item.jobTitle || "Position"}
                      </h3>

                      <p className="mt-1 font-semibold text-slate-600">
                        {item.company || "Company"}
                      </p>
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                      {item.startDate || ""}{" "}
                      {item.endDate ? `— ${item.endDate}` : ""}
                    </p>
                  </div>

                  {item.description && (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-10 md:grid-cols-2">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
                Education
              </h2>

              <div className="mt-5 space-y-5">
                {education.map((item) => (
                  <div key={item.id}>
                    <h3 className="font-bold text-slate-950">
                      {item.degree || "Degree"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {item.institution || "Institution"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
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
            <section>
              <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
                Core Skills
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="text-sm font-medium text-slate-700"
                  >
                    • {skill.name || skill.skill || skill}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mt-10">
            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Selected Projects
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-bold text-slate-950">
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
          <section className="mt-10">
            <h2 className="border-b border-slate-300 pb-2 text-lg font-black uppercase tracking-widest text-slate-900">
              Certifications
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-sm">
                  <span className="font-bold text-slate-900">
                    {cert.name || cert.title || "Certification"}
                  </span>

                  {cert.issuer && (
                    <span className="text-slate-500">
                      {" "}
                      — {cert.issuer}
                    </span>
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