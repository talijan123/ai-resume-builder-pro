import TypingAnimation from "./TypingAnimation";
import ATSMeter from "./ATSMeter";
import { demoData } from "./demoData";

export default function ResumeOutput({
  showResume,
  showATS,
}) {
  return (
    <div
      className="
        relative

        rounded-3xl

        border
        border-slate-200
        dark:border-slate-800

        bg-white
        dark:bg-slate-900

        p-8

        shadow-2xl
        transition-colors
      "
    >
      {/* Header */}

      <div
        className="
          mb-8

          flex
          items-center
          justify-between
        "
      >
        <div>

          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.25em]

              text-blue-600
              dark:text-blue-400
            "
          >
            AI GENERATED
          </p>

          <h3
            className="
              mt-2

              text-2xl

              font-black

              text-slate-900
              dark:text-white
            "
          >
            Resume Preview
          </h3>

        </div>

        <div
          className="
            flex
            items-center
            gap-2

            rounded-full

            bg-green-50
            dark:bg-green-500/10
            border
            border-green-200
            dark:border-green-500/30

            px-4
            py-2
          "
        >
          <div
            className="
              h-2.5
              w-2.5

              animate-pulse

              rounded-full

              bg-green-500
            "
          />

          <span
            className="
              text-sm

              font-medium

              text-green-700
              dark:text-green-400
            "
          >
            Live
          </span>

        </div>

      </div>

      {showResume && (

        <div className="space-y-8">

          {/* Personal */}

          <div>

            <h2
              className="
                text-3xl

                font-black

                text-slate-900
                dark:text-white
              "
            >
              <TypingAnimation
                text={demoData.personal.name}
                speed={60}
              />
            </h2>

            <p
              className="
                mt-2

                font-semibold

                text-blue-600
                dark:text-blue-400
              "
            >
              <TypingAnimation
                text={demoData.personal.title}
                speed={50}
                delay={700}
              />
            </p>

            <div
              className="
                mt-4

                flex
                flex-wrap

                gap-4

                text-sm

                text-slate-500
                dark:text-slate-400
              "
            >
              <span>{demoData.personal.email}</span>

              <span>{demoData.personal.phone}</span>

              <span>{demoData.personal.location}</span>

            </div>

          </div>

          {/* Summary */}

          <div>

            <h4
              className="
                mb-3

                font-bold

                text-slate-800
                dark:text-slate-200
              "
            >
              Professional Summary
            </h4>

            <TypingAnimation
              text={demoData.summary}
              speed={15}
              delay={1500}
              className="
                leading-7

                text-slate-600
                dark:text-slate-300
              "
            />

          </div>

          {/* Skills */}

          <div>

            <h4
              className="
                mb-3

                font-bold

                text-slate-800
                dark:text-slate-200
              "
            >
              Skills
            </h4>

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >

              {demoData.skills.map((skill, index) => (

                <span
                  key={skill}
                  className="
                    rounded-full

                    bg-slate-100
                    dark:bg-slate-800
                    border
                    border-slate-200/80
                    dark:border-slate-700/60

                    px-4
                    py-2

                    text-sm

                    font-medium

                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  <TypingAnimation
                    text={skill}
                    speed={30}
                    delay={2200 + index * 350}
                  />
                </span>

              ))}

            </div>

          </div>

          {/* Experience */}

          <div>

            <h4
              className="
                mb-4

                font-bold

                text-slate-800
                dark:text-slate-200
              "
            >
              Experience
            </h4>

            <div className="space-y-6">

              {demoData.experience.map((job, index) => (

                <div key={job.company}>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <h5
                      className="
                        font-semibold

                        text-slate-900
                        dark:text-white
                      "
                    >
                      {job.role}
                    </h5>

                    <span
                      className="
                        text-sm

                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {job.period}
                    </span>

                  </div>

                  <p
                    className="
                      mt-1

                      font-medium

                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    {job.company}
                  </p>

                  <TypingAnimation
                    text={job.description}
                    speed={10}
                    delay={3800 + index * 900}
                    className="
                      mt-2

                      block

                      text-sm

                      leading-7

                      text-slate-600
                      dark:text-slate-300
                    "
                  />

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

      {/* ATS */}

      <div className="mt-10">

        {showATS && <ATSMeter />}

      </div>

    </div>
  );
}