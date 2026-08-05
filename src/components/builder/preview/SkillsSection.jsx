import { useResume } from "../../../context/ResumeContext";

export default function SkillsSection() {
  const { resumeData } = useResume();

  const skills = resumeData.skills;

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
                inline-flex
                items-center
                gap-1

                rounded-full

                bg-blue-100

                px-3
                py-1

                text-xs
                font-medium

                text-blue-700
              "
            >
              <span>{skill.name}</span>

              {skill.level && (
                <span className="text-blue-500">
                  • {skill.level}
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}