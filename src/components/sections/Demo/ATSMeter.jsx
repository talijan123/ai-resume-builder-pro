import { useEffect, useState } from "react";
import { demoData } from "./demoData";

export default function ATSMeter() {
  const targetScore = demoData.ats.score;

  const [score, setScore] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current++;

      setScore(current);

      if (current >= targetScore) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [targetScore]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const progress =
    circumference - (score / 100) * circumference;

  return (
    <div
      className="
        rounded-3xl
        border
        border-green-200
        dark:border-emerald-500/30
        bg-gradient-to-br
        from-green-50
        to-emerald-50
        dark:from-slate-900
        dark:to-emerald-950/40
        p-6
        shadow-sm
        transition-colors
      "
    >
      {/* Heading */}

      <div className="text-center">

        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-[0.25em]
            text-green-600
            dark:text-emerald-400
          "
        >
          ATS Compatibility
        </p>

      </div>

      {/* Circular Progress */}

      <div className="mt-8 flex justify-center">

        <div className="relative h-36 w-36">

          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 120 120"
          >
            {/* Background */}

            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-green-100 dark:text-slate-800"
              strokeWidth="10"
            />

            {/* Progress */}

            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              style={{
                transition:
                  "stroke-dashoffset .15s linear",
              }}
            />

            <defs>

              <linearGradient
                id="gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="#22c55e"
                />

                <stop
                  offset="100%"
                  stopColor="#10b981"
                />

              </linearGradient>

            </defs>

          </svg>

          {/* Percentage */}

          <div
            className="
              absolute
              inset-0

              flex
              flex-col

              items-center
              justify-center
            "
          >

            <h3
              className="
                text-4xl
                font-black
                text-green-600
                dark:text-emerald-400
              "
            >
              {score}%
            </h3>

            <span
              className="
                text-xs
                font-bold
                uppercase

                tracking-wider

                text-slate-500
                dark:text-slate-400
              "
            >
              ATS
            </span>

          </div>

        </div>

      </div>

      {/* Status */}

      <div className="mt-8 text-center">

        <h4
          className="
            text-xl
            font-bold
            text-green-700
            dark:text-emerald-400
          "
        >
          {demoData.ats.status}
        </h4>

        <p
          className="
            mt-2
            text-sm
            leading-7
            text-slate-600
            dark:text-slate-300
          "
        >
          {demoData.ats.message}
        </p>

      </div>

      {/* Progress Bar */}

      <div className="mt-8">

        <div
          className="
            h-3
            overflow-hidden
            rounded-full
            bg-green-100
            dark:bg-slate-800
          "
        >
          <div
            className="
              h-full
              rounded-full

              bg-gradient-to-r
              from-green-500
              to-emerald-500

              transition-all
              duration-150
            "
            style={{
              width: `${score}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}