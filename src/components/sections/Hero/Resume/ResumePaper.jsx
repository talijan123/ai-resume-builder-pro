export default function ResumePaper() {
  return (
    <div
      className="
        w-full
        max-w-[500px]

        rounded-3xl

        border
        border-slate-200

        bg-white

        p-8

        shadow-[0_35px_90px_rgba(15,23,42,.18)]
      "
    >
      {/* Header */}

      <div className="border-b border-slate-200 pb-6">

        <h2
          className="
            text-3xl
            font-black
            tracking-tight

            text-slate-900
          "
        >
          Talal Hassan
        </h2>

        <p
          className="
            mt-2

            text-lg

            text-blue-600

            font-semibold
          "
        >
          Frontend Developer
        </p>

        <p
          className="
            mt-4

            text-sm

            leading-7

            text-slate-500
          "
        >
          Passionate Frontend Developer specializing in
          React, Tailwind CSS, and AI-powered web
          applications with a focus on performance,
          responsive design, and exceptional user
          experience.
        </p>

      </div>

      {/* Experience */}

      <section className="mt-8">

        <h3
          className="
            text-xs

            font-bold

            uppercase

            tracking-[0.25em]

            text-slate-400
          "
        >
          Experience
        </h3>

        <div className="mt-4">

          <h4 className="font-bold text-slate-900">
            Frontend Developer
          </h4>

          <p className="text-sm text-slate-500">
            ResumeForge AI • 2026 — Present
          </p>

          <p
            className="
              mt-2

              text-sm

              leading-6

              text-slate-600
            "
          >
            Built responsive React applications,
            optimized UI performance, and designed
            premium SaaS interfaces with modern
            development practices.
          </p>

        </div>

      </section>

      {/* Education */}

      <section className="mt-8">

        <h3
          className="
            text-xs

            font-bold

            uppercase

            tracking-[0.25em]

            text-slate-400
          "
        >
          Education
        </h3>

        <div className="mt-4">

          <h4 className="font-bold text-slate-900">
            Bachelor of Science
          </h4>

          <p className="text-sm text-slate-500">
            Government Post Graduate College Abbottabad
          </p>

        </div>

      </section>

      {/* Skills */}

      <section className="mt-8">

        <h3
          className="
            text-xs

            font-bold

            uppercase

            tracking-[0.25em]

            text-slate-400
          "
        >
          Skills
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">

          {[
            "React",
            "JavaScript",
            "Tailwind CSS",
            "Node.js",
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

      {/* Projects */}

      <section className="mt-8">

        <h3
          className="
            text-xs

            font-bold

            uppercase

            tracking-[0.25em]

            text-slate-400
          "
        >
          Projects
        </h3>

        <div className="mt-4">

          <h4 className="font-bold text-slate-900">
            ResumeForge AI
          </h4>

          <p
            className="
              mt-2

              text-sm

              leading-6

              text-slate-600
            "
          >
            AI-powered resume builder with ATS
            optimization, modern templates, and PDF
            export built using React, Tailwind CSS,
            and Framer Motion.
          </p>

        </div>

      </section>

    </div>
  );
}