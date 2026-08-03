import { FaCheckCircle } from "react-icons/fa";

export default function ATSCard() {
  return (
    <div
      className="
        w-60

        rounded-3xl

        border
        border-white/40

        bg-white/90

        p-5

        backdrop-blur-xl

        shadow-[0_25px_60px_rgba(37,99,235,.20)]

        transition-all
        duration-500

        hover:-translate-y-2
        hover:scale-[1.03]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p
            className="
              text-xs

              font-bold

              uppercase

              tracking-[0.25em]

              text-slate-400
            "
          >
            ATS Score
          </p>

          <h2
            className="
              mt-2

              text-4xl

              font-black

              text-slate-900
            "
          >
            98%
          </h2>

        </div>

        <div
          className="
            flex

            h-12
            w-12

            items-center
            justify-center

            rounded-2xl

            bg-green-100

            text-green-600
          "
        >
          <FaCheckCircle size={24} />
        </div>

      </div>

      {/* Status */}

      <div className="mt-5">

        <div className="flex justify-between">

          <span
            className="
              text-sm

              font-semibold

              text-slate-700
            "
          >
            Excellent
          </span>

          <span
            className="
              text-sm

              text-green-600

              font-semibold
            "
          >
            +26%
          </span>

        </div>

        {/* Progress */}

        <div
          className="
            mt-3

            h-3

            overflow-hidden

            rounded-full

            bg-slate-200
          "
        >
          <div
            className="
              h-full

              w-[98%]

              rounded-full

              bg-gradient-to-r
              from-green-500
              via-emerald-500
              to-green-600
            "
          />
        </div>

      </div>

      {/* Footer */}

      <div
        className="
          mt-5

          flex
          items-center
          gap-2

          rounded-2xl

          bg-blue-50

          px-4
          py-3
        "
      >
        <div
          className="
            h-2
            w-2

            rounded-full

            bg-blue-600
          "
        />

        <p
          className="
            text-sm

            font-medium

            text-blue-700
          "
        >
          AI optimized for modern ATS systems
        </p>

      </div>

    </div>
  );
}