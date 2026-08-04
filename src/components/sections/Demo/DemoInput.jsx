import { HiSparkles } from "react-icons/hi2";

import TypingAnimation from "./TypingAnimation";
import { demoData } from "./demoData";

export default function DemoInput({
  showName,
  showJob,
  showSkills,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-8
        shadow-xl
      "
    >
      {/* Header */}

      <div className="mb-8 flex items-center gap-4">

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center

            rounded-2xl

            bg-gradient-to-br
            from-blue-500
            to-indigo-600

            text-white
          "
        >
          <HiSparkles size={28} />
        </div>

        <div>

          <h3
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Resume Information
          </h3>

          <p className="text-slate-500">
            AI is preparing your resume...
          </p>

        </div>

      </div>

      {/* Full Name */}

      <div className="mb-6">

        <label
          className="
            mb-2
            block

            text-sm
            font-semibold

            text-slate-700
          "
        >
          Full Name
        </label>

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            min-h-[52px]
            flex
            items-center
          "
        >
          {showName && (
            <TypingAnimation
              text={demoData.personal.name}
              speed={70}
            />
          )}
        </div>

      </div>

      {/* Job Title */}

      <div className="mb-6">

        <label
          className="
            mb-2
            block

            text-sm
            font-semibold

            text-slate-700
          "
        >
          Job Title
        </label>

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            min-h-[52px]
            flex
            items-center
          "
        >
          {showJob && (
            <TypingAnimation
              text={demoData.personal.title}
              speed={70}
            />
          )}
        </div>

      </div>

      {/* Skills */}

      <div>

        <label
          className="
            mb-3
            block

            text-sm
            font-semibold

            text-slate-700
          "
        >
          Skills
        </label>

        <div className="flex flex-wrap gap-3">

          {showSkills &&
            demoData.skills.map((skill) => (

              <div
                key={skill}
                className="
                  rounded-full

                  bg-blue-50

                  px-4
                  py-2

                  text-sm
                  font-medium

                  text-blue-600
                "
              >
                <TypingAnimation
                  text={skill}
                  speed={40}
                />
              </div>

            ))}

        </div>

      </div>

      {/* AI Status */}

      <div
        className="
          mt-8

          flex
          items-center
          justify-between

          rounded-2xl

          bg-green-50

          px-5
          py-4
        "
      >

        <div>

          <p
            className="
              font-semibold
              text-green-700
            "
          >
            🤖 AI Ready
          </p>

          <p
            className="
              text-sm
              text-green-600
            "
          >
            Resume generation initialized.
          </p>

        </div>

        <div
          className="
            h-3
            w-3

            animate-pulse

            rounded-full

            bg-green-500
          "
        />

      </div>

      {/* Button */}

      <button
        className="
          mt-8

          w-full

          rounded-2xl

          bg-gradient-to-r
          from-blue-600
          to-indigo-600

          py-4

          font-semibold

          text-white

          shadow-lg

          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        Generate Resume
      </button>

    </div>
  );
}