import { useResume } from "../../../context/ResumeContext";

export default function ExperienceSection() {
  const { resumeData } = useResume();

  const experiences = resumeData.experience;

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
            {/* Job Title */}

            <h3 className="font-semibold text-slate-900">
              {exp.jobTitle}
            </h3>

            {/* Company + Location + Dates */}

            <p className="text-sm text-slate-500">
              {exp.company}

              {exp.location && ` • ${exp.location}`}

              {" • "}

              {exp.startDate || "Start"}

              {" - "}

              {exp.currentlyWorking
                ? "Present"
                : exp.endDate || "End"}
            </p>

            {/* Employment Type */}

            {exp.employmentType && (
              <p className="mt-1 text-xs font-medium text-blue-600">
                {exp.employmentType}
              </p>
            )}

            {/* Description */}

            {exp.description && (
              <p
                className="
                  mt-3
                  whitespace-pre-line

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
  );
}