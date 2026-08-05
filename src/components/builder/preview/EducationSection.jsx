import { useResume } from "../../../context/ResumeContext";

export default function EducationSection() {
  const { resumeData } = useResume();

  const education = resumeData.education;

  return (
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

              {edu.field && ` • ${edu.field}`}

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
  );
}