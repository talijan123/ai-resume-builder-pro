import {
    HiEnvelope,
    HiPhone,
    HiMapPin,
} from "react-icons/hi2";

import { useResume } from "../../context/ResumeContext";

export default function ResumePreview() {
    const { resumeData } = useResume();

    const personal = resumeData.personalInfo;
    const experiences = resumeData.experience;
    const education = resumeData.education;
    const skills = resumeData.skills;

    return (
        <div
            className="
        sticky
        top-24
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-lg
      "
        >
            {/* Preview Header */}

            <div className="border-b border-slate-200 p-5">
                <h2 className="text-xl font-bold text-slate-900">
                    Live Preview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Your resume updates in real time.
                </p>
            </div>

            {/* Resume Paper */}

            <div className="
    bg-slate-100
    p-6
    max-h-[calc(100vh-180px)]
    overflow-y-auto
  ">
                <div
                    className="
    mx-auto
    w-full
    min-h-[1123px]
    rounded-lg
    bg-white
    p-8
    shadow-xl
  "
                >
                    {/* Name */}

                    <h1 className="text-3xl font-black text-slate-900">
                        {personal.fullName || "Your Name"}
                    </h1>

                    {/* Job Title */}

                    <p className="mt-2 text-lg font-medium text-blue-600">
                        {personal.jobTitle || "Professional Title"}
                    </p>

                    {/* Contact */}

                    <div
                        className="
              mt-5
              flex
              flex-wrap
              gap-4
              text-sm
              text-slate-600
            "
                    >
                        <div className="flex items-center gap-2">
                            <HiEnvelope />
                            {personal.email || "email@example.com"}
                        </div>

                        <div className="flex items-center gap-2">
                            <HiPhone />
                            {personal.phone || "+92 XXX XXXXXXX"}
                        </div>

                        <div className="flex items-center gap-2">
                            <HiMapPin />
                            {personal.location || "Your Location"}
                        </div>
                    </div>

                    {/* Summary */}

                    <section className="mt-8">
                        <h2
                            className="
                border-b
                border-slate-300
                pb-2
                text-lg
                font-bold
                text-slate-900
              "
                        >
                            Professional Summary
                        </h2>

                        <p
                            className="
                mt-3
                text-sm
                leading-7
                text-slate-700
              "
                        >
                            {personal.summary ||
                                "Write a short professional summary to introduce yourself."}
                        </p>
                    </section>

                    {/* Experience */}

                    <section className="mt-8">
                        <h2
                            className="
                border-b
                border-slate-300
                pb-2
                text-lg
                font-bold
                text-slate-900
              "
                        >
                            Experience
                        </h2>

                        {experiences.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">
                                No experience added yet.
                            </p>
                        ) : (
                            experiences.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="mt-5"
                                >
                                    <h3 className="font-semibold text-slate-900">
                                        {exp.jobTitle}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {exp.company}

                                        {exp.location &&
                                            ` • ${exp.location}`}

                                        {" • "}

                                        {exp.startDate || "Start"}

                                        {" - "}

                                        {exp.currentlyWorking
                                            ? "Present"
                                            : exp.endDate || "End"}
                                    </p>

                                    {exp.employmentType && (
                                        <p className="mt-1 text-xs font-medium text-blue-600">
                                            {exp.employmentType}
                                        </p>
                                    )}

                                    {exp.description && (
                                        <p
                                            className="
                        mt-3
                        text-sm
                        leading-7
                        text-slate-700
                      "
                                        >
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </section>

                    {/* Education */}

                    <section className="mt-8">
                        <h2
                            className="
      border-b
      border-slate-300
      pb-2
      text-lg
      font-bold
      text-slate-900
    "
                        >
                            Education
                        </h2>

                        {education.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">
                                No education added yet.
                            </p>
                        ) : (
                            education.map((edu) => (
                                <div
                                    key={edu.id}
                                    className="mt-5"
                                >
                                    <h3 className="font-semibold text-slate-900">
                                        {edu.degree}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {edu.school}

                                        {edu.field &&
                                            ` • ${edu.field}`}

                                        {" • "}

                                        {edu.startDate || "Start"}

                                        {" - "}

                                        {edu.currentlyStudying
                                            ? "Present"
                                            : edu.endDate || "End"}
                                    </p>

                                    {edu.grade && (
                                        <p className="mt-1 text-xs font-medium text-blue-600">
                                            Grade / CGPA: {edu.grade}
                                        </p>
                                    )}

                                    {edu.description && (
                                        <p
                                            className="
              mt-3
              text-sm
              leading-7
              text-slate-700
            "
                                        >
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </section>



                    {/* Skills */}

                    <section className="mt-8">
                        <h2
                            className="
      border-b
      border-slate-300
      pb-2
      text-lg
      font-bold
      text-slate-900
    "
                        >
                            Skills
                        </h2>

                        {skills.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">
                                No skills added yet.
                            </p>
                        ) : (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="
            rounded-full
            bg-blue-100
            px-3
            py-1
            text-xs
            font-medium
            text-blue-700
          "
                                    >
                                        {skill.name}

                                        {skill.level && (
                                            <span className="ml-1 text-blue-500">
                                                • {skill.level}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}