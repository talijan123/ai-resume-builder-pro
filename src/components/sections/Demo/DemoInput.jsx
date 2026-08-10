import { HiSparkles } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import TypingAnimation from "./TypingAnimation";
import { demoData } from "./demoData";

import { useAuth } from "../../../context/AuthContext";

export default function DemoInput({
  showName,
  showJob,
  showSkills,
}) {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  /* =========================================================
     GENERATE RESUME
  ========================================================= */

  const handleGenerateResume = () => {
    // Wait until Supabase finishes checking authentication
    if (loading) {
      return;
    }

    // Logged-in user → Resume Builder
    if (user) {
      navigate("/builder");
      return;
    }

    // Guest user → Login
    navigate("/login");
  };

  return (
    <div>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex items-center gap-4">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-500
            to-indigo-600
            text-white
          "
        >
          <HiSparkles size={28} />
        </div>

        <div>
          <h3
            className="
              text-2xl
              font-bold
              text-slate-900
            "
          >
            Resume Information
          </h3>

          <p className="text-slate-500">
            AI is preparing your resume...
          </p>
        </div>
      </div>

      {/* =====================================================
          FULL NAME
      ===================================================== */}

      <div className="mb-6">
        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Full Name
        </label>

        <div
          className="
            flex
            min-h-[52px]
            items-center
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
          "
        >
          {showName && (
            <TypingAnimation
              text={demoData.personal.name}
              speed={70}
            />
          )}
        </div>
      </div>

      {/* =====================================================
          JOB TITLE
      ===================================================== */}

      <div className="mb-6">
        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Job Title
        </label>

        <div
          className="
            flex
            min-h-[52px]
            items-center
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
          "
        >
          {showJob && (
            <TypingAnimation
              text={demoData.personal.title}
              speed={70}
            />
          )}
        </div>
      </div>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      <div>
        <label
          className="
            mb-3
            block
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Skills
        </label>

        <div className="flex flex-wrap gap-3">
          {showSkills &&
            demoData.skills.map((skill) => (
              <div
                key={skill}
                className="
                  rounded-full
                  bg-blue-50
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-blue-600
                "
              >
                <TypingAnimation
                  text={skill}
                  speed={40}
                />
              </div>
            ))}
        </div>
      </div>

      {/* =====================================================
          AI STATUS
      ===================================================== */}

      <div
        className="
          mt-8
          flex
          items-center
          justify-between
          rounded-2xl
          bg-green-50
          px-5
          py-4
        "
      >
        <div>
          <p
            className="
              font-semibold
              text-green-700
            "
          >
            🤖 AI Ready
          </p>

          <p
            className="
              text-sm
              text-green-600
            "
          >
            Resume generation initialized.
          </p>
        </div>

        <div
          className="
            h-3
            w-3
            animate-pulse
            rounded-full
            bg-green-500
          "
        />
      </div>

      {/* =====================================================
          GENERATE RESUME BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={handleGenerateResume}
        disabled={loading}
        className="
          mt-8
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          py-4
          font-semibold
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:translate-y-0
          disabled:hover:shadow-lg
        "
      >
        {loading
          ? "Checking..."
          : user
            ? "Generate Resume"
            : "Login to Generate Resume"}
      </button>
    </div>
  );
}