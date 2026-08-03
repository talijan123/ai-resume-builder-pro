import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { HiPlay } from "react-icons/hi";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-8"
    >
      {/* Badge */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="
          inline-flex
          items-center
          rounded-full
          border
          border-blue-500/30
          bg-blue-500/10
          px-4
          py-2
          text-sm
          font-medium
          text-blue-400
          backdrop-blur-xl
        "
      >
        ✨ AI-Powered Resume Builder
      </motion.div>

      {/* Heading */}

      <div className="space-y-3">
        <h1
          className="
            text-5xl
            font-black
            leading-tight
            tracking-tight
            text-white

            md:text-6xl
            lg:text-7xl
          "
        >
          Create Job-Winning
          <br />

          <span className="text-blue-500">
            Resumes with AI
          </span>

          <br />

          in Minutes
        </h1>

        <p
          className="
            max-w-xl

            text-lg
            leading-8

            text-slate-400
          "
        >
          Build ATS-friendly resumes, professional cover letters,
          and AI-powered summaries that help you stand out
          and land more interviews.
        </p>
      </div>

      {/* Buttons */}

      <div className="flex flex-wrap gap-4">

        <button
          className="
            group

            inline-flex
            items-center
            gap-2

            rounded-full

            bg-blue-600

            px-7
            py-4

            font-semibold
            text-white

            transition

            hover:bg-blue-500
          "
        >
          Start Building Free

          <HiArrowRight
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />
        </button>

        <button
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-slate-700

            bg-slate-900

            px-7
            py-4

            font-semibold
            text-white

            transition

            hover:border-blue-500
          "
        >
          <HiPlay />

          Watch Demo
        </button>

      </div>

      {/* Trust Indicators */}

      <div className="flex flex-wrap gap-6 text-sm text-slate-400">

        <span>✅ ATS Optimized</span>

        <span>🤖 AI Powered</span>

        <span>📄 PDF Export</span>

      </div>
    </motion.div>
  );
}