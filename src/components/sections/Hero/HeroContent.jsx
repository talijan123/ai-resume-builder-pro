import { motion } from "framer-motion";
import { HiArrowRight, HiPlay } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

export default function HeroContent() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  /* =========================================================
     BUILD RESUME
  ========================================================= */

  const handleBuildResume = () => {
    // Wait until Supabase finishes checking authentication
    if (loading) {
      return;
    }

    // Logged-in user → Dashboard
    if (user) {
      navigate("/dashboard");
      return;
    }

    // Guest user → Login
    navigate("/login");
  };

  /* =========================================================
     WATCH DEMO
  ========================================================= */

  const handleWatchDemo = () => {
    const demoSection = document.getElementById("live-demo");

    if (!demoSection) {
      console.warn(
        'Demo section with id="live-demo" was not found.'
      );

      return;
    }

    /*
      Navbar is fixed at the top,
      so we subtract its height from
      the final scroll position.
    */

    const navbarOffset = 80;

    const sectionPosition =
      demoSection.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: sectionPosition - navbarOffset,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl"
    >
      {/* =====================================================
          ANNOUNCEMENT BADGE
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="
          inline-flex
          items-center
          gap-3
          rounded-full
          border
          border-blue-200
          bg-white/80
          dark:bg-slate-800/80
          px-5
          py-2.5
          backdrop-blur-xl
          shadow-sm
        "
      >
        <span className="relative flex h-3 w-3">
          <span
            className="
              absolute
              inline-flex
              h-full
              w-full
              animate-ping
              rounded-full
              bg-emerald-400
            "
          />

          <span
            className="
              relative
              inline-flex
              h-3
              w-3
              rounded-full
              bg-emerald-500
            "
          />
        </span>

        <span
          className="
            text-sm
            font-semibold
            text-slate-700
          "
        >
          AI Resume Builder
        </span>
      </motion.div>

      {/* =====================================================
          HEADING
      ===================================================== */}

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="
          mt-8
          text-5xl
          font-black
          leading-[0.9]
          tracking-[-0.05em]
          text-slate-900
          lg:text-7xl
        "
      >
        Build a Resume

        <br />

        Recruiters

        <span
          className="
            block
            bg-gradient-to-r
            from-blue-600
            via-indigo-500
            to-cyan-500
            bg-clip-text
            text-transparent
          "
        >
          Actually Read.
        </span>
      </motion.h1>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="
          mt-8
          max-w-xl
          text-xl
          leading-9
          text-slate-600
        "
      >
        Design beautiful resumes, optimize them for ATS
        systems, and land more interviews — all in one
        AI-powered workspace built for modern job seekers.
      </motion.p>

      {/* =====================================================
          STATS
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="
          mt-10
          flex
          flex-wrap
          gap-10
        "
      >
        <div>
          <h3 className="text-3xl font-black text-slate-900">
            20K+
          </h3>

          <p className="mt-1 text-slate-500">
            Resumes Created
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900">
            98%
          </h3>

          <p className="mt-1 text-slate-500">
            ATS Success
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black text-slate-900">
            4.9★
          </h3>

          <p className="mt-1 text-slate-500">
            User Rating
          </p>
        </div>
      </motion.div>

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="
          mt-12
          flex
          flex-wrap
          gap-5
        "
      >
        {/* ===================================================
            BUILD MY RESUME
        =================================================== */}

        <button
          type="button"
          onClick={handleBuildResume}
          disabled={loading}
          className="
            group
            flex
            items-center
            gap-2
            rounded-full
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-8
            py-4
            font-semibold
            text-white
            shadow-xl
            shadow-blue-500/30
            transition-all
            duration-300
            hover:-translate-y-1
            hover:scale-[1.03]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Checking..."
            : user
              ? "Go to Dashboard"
              : "Build My Resume"}

          <HiArrowRight
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
            size={20}
          />
        </button>

        {/* ===================================================
            WATCH DEMO
        =================================================== */}

        <button
          type="button"
          onClick={handleWatchDemo}
          className="
            group
            flex
            cursor-pointer
            items-center
            gap-3
            rounded-full
            border
            border-slate-300
            bg-white
            px-8
            py-4
            font-semibold
            text-slate-700
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-blue-500
            hover:text-blue-600
            hover:shadow-lg
          "
        >
          <HiPlay
            size={18}
            className="
              transition-transform
              duration-300
              group-hover:scale-110
            "
          />

          Watch Demo
        </button>
      </motion.div>
    </motion.div>
  );
}