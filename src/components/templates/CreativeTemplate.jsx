import { useResume } from "../../context/ResumeContext";

export default function CreativeTemplate() {
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
    <div className="min-h-[1123px] bg-white text-slate-800">
      {/* Header */}
      <header className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-10 py-10 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {personalInfo.fullName || "Your Name"}
            </h1>

            <p className="mt-2 text-xl font-medium text-white/90">
              {personalInfo.jobTitle || "Professional"}
            </p>
          </div>

          <div className="text-sm leading-7 text-white/90 md:text-right">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 gap-10 px-10 py-10 md:grid-cols-[1fr_260px]">
        {/* Main */}
        <main>
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-black text-indigo-600">
                About Me
              </h2>

              <div className="h-1 w-16 rounded-full bg-indigo-600" />

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-black text-indigo-600">
                Experience
              </h2>

              <div className="h-1 w-16 rounded-full bg-indigo-600" />

              <div className="mt-6 space-y-7">
                {experience.map((item) => (
                  <div
                    key={item.id}
                    className="relative border-l-2 border-indigo-200 pl-6"
                  >
                    <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-indigo-600" />

                    <h3 className="text-lg font-bold text-slate-900">
                      {item.position || item.jobTitle || "Position"}
                    </h3>

                    <p className="mt-1 font-semibold text-indigo-600">
                      {item.company || "Company"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.startDate || ""}{" "}
                      {item.endDate ? `— ${item.endDate}` : ""}
                    </p>

                    {item.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-black text-indigo-600">
                Projects
              </h2>

              <div className="h-1 w-16 rounded-full bg-indigo-600" />

              <div className="mt-6 grid gap-5">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <h3 className="font-bold text-slate-900">
                      {project.name || project.title || "Project"}
                    </h3>

                    {project.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {project.description}
                      </p>
                    )}

                    {project.technologies && (
                      <p className="mt-3 text-xs font-semibold text-indigo-600">
                        {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside>
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-black text-slate-900">
                Skills
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-indigo-600" />

              <div className="mt-5 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700"
                  >
                    {skill.name || skill.skill || skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-black text-slate-900">
                Education
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-indigo-600" />

              <div className="mt-5 space-y-5">
                {education.map((item) => (
                  <div key={item.id}>
                    <h3 className="font-bold text-slate-900">
                      {item.degree || "Degree"}
                    </h3>

                    <p className="mt-1 text-sm text-indigo-600">
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

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-slate-900">
                Certifications
              </h2>

              <div className="mt-3 h-1 w-12 rounded-full bg-indigo-600" />

              <div className="mt-5 space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-slate-900">
                      {cert.name || cert.title || "Certification"}
                    </h3>

                    {cert.issuer && (
                      <p className="mt-1 text-sm text-slate-500">
                        {cert.issuer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}