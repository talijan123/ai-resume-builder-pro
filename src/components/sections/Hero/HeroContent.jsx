import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowRight, HiPlay } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

const ROTATING_PHRASES = [
  "Actually Read.",
  "Can't Ignore.",
  "Love to Hire.",
  "Pass ATS With.",
];

export default function HeroContent() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  /* =========================================================
     TYPEWRITER EFFECT FOR ACCENT HEADLINE
  ========================================================= */
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(ROTATING_PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = ROTATING_PHRASES[phraseIndex];
    let timeoutId;

    if (!isDeleting) {
      // Typing phase (~90ms per character)
      if (displayText.length < currentPhrase.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 90);
      } else {
        // Full phrase displayed, pause for 2.2 seconds
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      // Deleting phase (~45ms per character)
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 45);
      } else {
        // Complete deletion, rotate to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting, phraseIndex]);

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
          dark:border-blue-800/60
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
            dark:text-slate-200
          "
        >
          AI Resume Builder
        </span>
      </motion.div>

      {/* =====================================================
          HEADING WITH ANIMATED TYPEWRITER
      ===================================================== */}

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="
          mt-8
          text-5xl
          font-black
          leading-[0.95]
          tracking-[-0.05em]
          text-slate-900
          dark:text-white
          lg:text-7xl
        "
      >
        Build a Resume
        <br />
        Recruiters{" "}
        <span
          className="
            block
            bg-gradient-to-r
            from-blue-600
            via-indigo-500
            to-cyan-500
            bg-clip-text
            text-transparent
            min-h-[1.15em]
          "
        >
          {displayText}
          <span
            aria-hidden="true"
            className="
              inline-block
              w-[3px]
              sm:w-1
              h-[0.85em]
              bg-blue-500
              dark:bg-blue-400
              animate-pulse
              ml-1
              align-baseline
              rounded-full
            "
          />
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
          mt-6
          sm:mt-8
          max-w-xl
          text-lg
          sm:text-xl
          leading-relaxed
          text-slate-600
          dark:text-slate-300
        "
      >
        Design beautiful resumes, optimize them for ATS
        systems, and land more interviews — all in one
        AI-powered workspace built for modern job seekers.
      </motion.p>

      {/* =====================================================
          BUTTONS (CTA ACTION ROW)
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="
          mt-6
          sm:mt-8
          flex
          flex-wrap
          items-center
          gap-4
        "
      >
        {/* BUILD MY RESUME / GO TO DASHBOARD */}
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
            hover:shadow-blue-500/40
            disabled:cursor-not-allowed
            disabled:opacity-60
            cursor-pointer
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

        {/* WATCH DEMO */}
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
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            px-8
            py-4
            font-semibold
            text-slate-700
            dark:text-slate-200
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-blue-500
            dark:hover:border-blue-400
            hover:text-blue-600
            dark:hover:text-blue-400
            hover:shadow-lg
            dark:hover:shadow-blue-500/10
          "
        >
          <HiPlay
            size={18}
            className="
              transition-transform
              duration-300
              group-hover:scale-110
              text-blue-600
              dark:text-blue-400
            "
          />
          Watch Demo
        </button>
      </motion.div>

      {/* =====================================================
          TRUST STATS METRICS (GROUNDED BELOW CTA BUTTONS)
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="
          mt-8
          sm:mt-10
          border-t
          border-slate-200
          dark:border-slate-800
          pt-6
          flex
          flex-wrap
          items-center
          gap-x-8
          gap-y-4
        "
      >
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            20K+
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Resumes Created
          </p>
        </div>

        <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            98%
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            ATS Success
          </p>
        </div>

        <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />

        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            4.9★
          </h3>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            User Rating
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}