import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiSparkles, HiPlus } from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name || "User";

  const firstName = fullName.split(" ")[0];

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        relative

        overflow-hidden

        rounded-3xl

        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-purple-600

        p-8

        text-white

        shadow-2xl
      "
    >
      {/* Decorative Blur */}

      <div
        className="
          absolute

          -right-20
          -top-20

          h-64
          w-64

          rounded-full

          bg-white/10

          blur-3xl
        "
      />

      <div
        className="
          relative

          flex

          flex-col

          gap-8

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Left */}

        <div>

          <div
            className="
              mb-5

              inline-flex

              items-center

              gap-2

              rounded-full

              bg-white/15

              px-4
              py-2

              text-sm
              font-medium

              backdrop-blur
            "
          >
            <HiSparkles size={18} />

            AI Resume Builder
          </div>

          <h1
            className="
              text-4xl

              font-black

              leading-tight
            "
          >
            Welcome back,
            <br />

            {firstName} 👋
          </h1>

          <p
            className="
              mt-5

              max-w-2xl

              text-lg

              leading-8

              text-blue-100
            "
          >
            Continue building professional
            ATS-friendly resumes powered by AI.
            Create, edit, optimize and download
            resumes in just minutes.
          </p>

        </div>

        {/* Right */}

        <div className="flex flex-col gap-4">

          <Link
            to="/builder"
            className="
              inline-flex

              items-center
              justify-center

              gap-3

              rounded-2xl

              bg-white

              px-8
              py-4

              font-semibold

              text-blue-700

              shadow-lg

              transition-all
              duration-300

              hover:scale-105
              hover:shadow-2xl
            "
          >
            <HiPlus size={20} />

            Create New Resume
          </Link>

          <Link
            to="/templates"
            className="
              inline-flex

              items-center
              justify-center

              rounded-2xl

              border
              border-white/30

              bg-white/10

              px-8
              py-4

              font-medium

              text-white

              backdrop-blur

              transition-all
              duration-300

              hover:bg-white/20
            "
          >
            Browse Templates
          </Link>

        </div>

      </div>
    </motion.section>
  );
}