import { motion } from "framer-motion";

import ResumePreview from "./Resume/ResumePreview";

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
      {/* Background Glow */}

      <div
        className="
          absolute

          h-[600px]
          w-[600px]

          rounded-full

          bg-blue-500/10

          blur-[160px]
        "
      />

      {/* Resume Showcase */}

      <ResumePreview />

    </motion.div>
  );
}