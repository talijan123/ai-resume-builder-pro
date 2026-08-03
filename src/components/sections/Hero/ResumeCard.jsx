import { FaCircleCheck } from "react-icons/fa6";

export default function ResumeCard() {
  return (
    <div
      className="
        relative
        w-full
        max-w-[430px]

        rounded-3xl

        bg-white

        shadow-[0_30px_80px_rgba(0,0,0,0.35)]

        border
        border-slate-200

        overflow-hidden
      "
    >
      {/* Header */}

      <div className="border-b border-slate-200 p-6">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Resume
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900">
              Talal Hassan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Frontend Developer
            </p>
          </div>

          <div className="text-right">

            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              ATS Score
            </p>

            <h2 className="mt-2 text-4xl font-black text-green-500">
              98
            </h2>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-6 p-6">

        {/* Summary */}

        <section>

          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Professional Summary
          </h3>

          <div className="space-y-2">

            <div className="h-2 rounded-full bg-slate-200" />

            <div className="h-2 w-5/6 rounded-full bg-slate-200" />

            <div className="h-2 w-4/6 rounded-full bg-slate-200" />

          </div>

        </section>

        {/* Experience */}

        <section>

          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Experience
          </h3>

          <div className="space-y-2">

            <div className="h-2 w-2/3 rounded-full bg-slate-300" />

            <div className="h-2 w-1/2 rounded-full bg-slate-200" />

          </div>

        </section>

        {/* Skills */}

        <section>

          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Skills
          </h3>

          <div className="flex flex-wrap gap-2">

            {[
              "React",
              "JavaScript",
              "Tailwind",
              "Node",
              "MongoDB",
              "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="
                  rounded-full
                  bg-slate-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-slate-700
                "
              >
                {skill}
              </span>
            ))}

          </div>

        </section>

      </div>

      {/* Footer */}

      <div
        className="
          flex
          items-center
          justify-between

          border-t
          border-slate-200

          bg-slate-50

          px-6
          py-4
        "
      >

        <div className="flex items-center gap-2 text-green-600">

          <FaCircleCheck />

          <span className="text-sm font-semibold">
            AI Optimized
          </span>

        </div>

        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          ResumeForge AI
        </span>

      </div>

    </div>
  );
}