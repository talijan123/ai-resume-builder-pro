import { motion } from "framer-motion";
import ResumeCard from "./ResumeCard";

export default function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="
        relative

        flex
        items-center
        justify-center
      "
    >
      {/* Blue Glow */}

      <div
        className="
          absolute

          h-[500px]
          w-[500px]

          rounded-full

          bg-blue-600/20

          blur-[120px]
        "
      />

      {/* Resume Card */}

      <ResumeCard />

      {/* Floating Badge */}

      <div
        className="
          absolute

          -top-6
          -left-8

          rounded-full

          border
          border-blue-500/20

          bg-slate-900/80

          px-5
          py-3

          text-sm
          font-medium

          text-white

          backdrop-blur-xl
        "
      >
        🤖 AI Powered
      </div>

      <div
        className="
          absolute

          bottom-10
          -right-8

          rounded-full

          border
          border-green-500/20

          bg-slate-900/80

          px-5
          py-3

          text-sm
          font-medium

          text-green-400

          backdrop-blur-xl
        "
      >
        ✅ ATS 98%
      </div>
    </motion.div>
  );
}