import { useResume } from "../../context/ResumeContext";

export default function ModernTemplate({ previewData = null }) {
    const { resumeData } = useResume();

    // Use preview data when this component is being
    // displayed inside the Templates page.
    // Otherwise use the user's actual resume data.
    const data = previewData || resumeData;

    const {
        personalInfo = {},
        experience = [],
        education = [],
        skills = [],
        projects = [],
        certifications = [],
    } = data;

    return (
        <div className="min-h-[1123px] bg-white p-10 text-slate-900">
            {/* ================================
                Header
            ================================= */}

            <header className="border-b-4 border-blue-600 pb-6">
                <h1 className="text-4xl font-black text-slate-900">
                    {personalInfo.fullName || "Your Name"}
                </h1>

                <p className="mt-2 text-xl font-semibold text-blue-600">
                    {personalInfo.jobTitle || "Professional Title"}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
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

            {/* ================================
                Summary
            ================================= */}

            {personalInfo.summary && (
                <section className="mt-7">
                    <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-blue-600">
                        Professional Summary
                    </h2>

                    <p className="text-sm leading-7 text-slate-600">
                        {personalInfo.summary}
                    </p>
                </section>
            )}

            {/* ================================
                Experience
            ================================= */}

            {experience.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-blue-600">
                        Work Experience
                    </h2>

                    <div className="space-y-6">
                        {experience.map((item) => (
                            <div key={item.id}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {item.jobTitle ||
                                                item.position}
                                        </h3>

                                        <p className="mt-1 font-semibold text-slate-600">
                                            {item.company}
                                        </p>
                                    </div>

                                    <p className="whitespace-nowrap text-sm text-slate-500">
                                        {item.startDate}

                                        {item.startDate &&
                                        item.endDate
                                            ? " - "
                                            : ""}

                                        {item.endDate}
                                    </p>
                                </div>

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

            {/* ================================
                Education
            ================================= */}

            {education.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-blue-600">
                        Education
                    </h2>

                    <div className="space-y-5">
                        {education.map((item) => (
                            <div key={item.id}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {item.degree}
                                        </h3>

                                        <p className="mt-1 text-sm font-semibold text-slate-600">
                                            {item.institution}
                                        </p>
                                    </div>

                                    <p className="text-sm text-slate-500">
                                        {item.startDate}

                                        {item.startDate &&
                                        item.endDate
                                            ? " - "
                                            : ""}

                                        {item.endDate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ================================
                Skills
            ================================= */}

            {skills.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-blue-600">
                        Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                            >
                                {skill.name || skill.skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* ================================
                Projects
            ================================= */}

            {projects.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-blue-600">
                        Projects
                    </h2>

                    <div className="space-y-5">
                        {projects.map((project) => (
                            <div key={project.id}>
                                <h3 className="font-bold text-slate-900">
                                    {project.name ||
                                        project.title}
                                </h3>

                                {project.description && (
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {project.description}
                                    </p>
                                )}

                                {project.technologies && (
                                    <p className="mt-2 text-xs font-semibold text-blue-600">
                                        {Array.isArray(
                                            project.technologies
                                        )
                                            ? project.technologies.join(
                                                  ", "
                                              )
                                            : project.technologies}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ================================
                Certifications
            ================================= */}

            {certifications.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-blue-600">
                        Certifications
                    </h2>

                    <div className="space-y-4">
                        {certifications.map(
                            (certification) => (
                                <div
                                    key={certification.id}
                                >
                                    <h3 className="font-bold text-slate-900">
                                        {certification.name ||
                                            certification.title}
                                    </h3>

                                    {certification.issuer && (
                                        <p className="text-sm text-slate-600">
                                            {
                                                certification.issuer
                                            }
                                        </p>
                                    )}

                                    {certification.date && (
                                        <p className="text-xs text-slate-500">
                                            {
                                                certification.date
                                            }
                                        </p>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}