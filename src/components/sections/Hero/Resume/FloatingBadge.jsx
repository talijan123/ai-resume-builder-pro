import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";

export default function FloatingBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: {
          duration: 0.6,
          delay: 0.6,
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className="
        flex
        items-center
        gap-3

        rounded-2xl

        border
        border-blue-100

        bg-white/90
        dark:bg-slate-800/90

        px-5
        py-3

        backdrop-blur-xl

        shadow-[0_20px_50px_rgba(37,99,235,.15)]
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-xl

          bg-gradient-to-br
          from-blue-500
          to-indigo-600

          text-white
        "
      >
        <HiSparkles size={20} />
      </div>

      {/* Text */}

      <div>

        <p
          className="
            text-xs
            uppercase
            tracking-[0.2em]
            font-bold

            text-slate-400
          "
        >
          AI STATUS
        </p>

        <h4
          className="
            mt-1

            font-semibold

            text-slate-900
          "
        >
          Resume Optimized
        </h4>

      </div>
    </motion.div>
  );
}