import { motion } from "framer-motion";

import {
  HiDocumentText,
  HiArrowDownTray,
  HiSparkles,
  HiChartBar,
} from "react-icons/hi2";

const stats = [
  {
    title: "Total Resumes",
    value: 3,
    icon: HiDocumentText,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Best ATS Score",
    value: "92%",
    icon: HiChartBar,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Downloads",
    value: 12,
    icon: HiArrowDownTray,
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "AI Credits",
    value: 48,
    icon: HiSparkles,
    color: "from-purple-500 to-pink-600",
  },
];

export default function StatsCards() {
  return (
    <section
      className="
        grid

        gap-6

        sm:grid-cols-2

        xl:grid-cols-4
      "
    >
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="
              rounded-3xl

              border
              border-slate-200

              bg-white

              p-6

              shadow-sm

              transition-all
              duration-300

              hover:shadow-xl
            "
          >
            <div className="flex items-center justify-between">

              <div>

                <p
                  className="
                    text-sm

                    font-medium

                    text-slate-500
                  "
                >
                  {item.title}
                </p>

                <h2
                  className="
                    mt-3

                    text-4xl

                    font-black

                    text-slate-900
                  "
                >
                  {item.value}
                </h2>

              </div>

              <div
                className={`
                  flex

                  h-16
                  w-16

                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-r
                  ${item.color}

                  text-white

                  shadow-lg
                `}
              >
                <Icon size={30} />
              </div>

            </div>

          </motion.div>
        );
      })}
    </section>
  );
}