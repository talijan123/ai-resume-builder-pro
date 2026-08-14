import { useNavigate } from "react-router-dom";

import {
  HiOutlineDocumentPlus,
  HiOutlineSparkles,
  HiOutlineEnvelope,
  HiOutlineUserCircle,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { usePricing } from "../../context/PricingContext";

export default function QuickActions() {
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    availableCredits,
    loading: pricingLoading,
  } = usePricing();

  /* =========================================================
     CREATE RESUME
  ========================================================= */

  const handleCreateResume = () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/builder");
  };

  /* =========================================================
     AI RESUME
  ========================================================= */

  const handleAIResume = () => {
    if (
      authLoading ||
      pricingLoading
    ) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    if (availableCredits <= 0) {
      navigate("/settings");
      return;
    }

    navigate("/builder");
  };

  /* =========================================================
     COVER LETTER
  ========================================================= */

  const handleCoverLetter = () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/cover-letter");
  };

  /* =========================================================
     MY PROFILE
  ========================================================= */

  const handleProfile = () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/profile");
  };

  /* =========================================================
     ACTIONS
  ========================================================= */

  const actions = [
    {
      title: "Create Resume",
      description:
        "Start a new professional resume",
      icon: HiOutlineDocumentPlus,
      onClick: handleCreateResume,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "AI Resume",
      description:
        pricingLoading
          ? "Checking credits..."
          : availableCredits > 0
            ? `${availableCredits} AI credits available`
            : "No AI credits remaining",
      icon: HiOutlineSparkles,
      onClick: handleAIResume,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },

    {
      title: "Cover Letter",
      description:
        "Create a tailored cover letter",
      icon: HiOutlineEnvelope,
      onClick: handleCoverLetter,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "My Profile",
      description:
        "Manage your professional information",
      icon: HiOutlineUserCircle,
      onClick: handleProfile,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section>
      {/* Header */}

      <div className="mb-5">
        <h2
          className="
            text-2xl
            font-black
            text-slate-900
          "
        >
          Quick Actions
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Quickly access your most important tools.
        </p>
      </div>

      {/* Actions */}

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              disabled={
                action.title === "AI Resume" &&
                pricingLoading
              }
              className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-wait
                disabled:opacity-70
              "
            >
              {/* Icon */}

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  ${action.iconBg}
                `}
              >
                <Icon
                  size={24}
                  className={action.iconColor}
                />
              </div>

              {/* Content */}

              <h3
                className="
                  mt-5
                  font-bold
                  text-slate-900
                "
              >
                {action.title}
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {action.description}
              </p>

              {/* AI Credit Status */}

              {action.title === "AI Resume" && (
                <div className="mt-4">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold

                      ${
                        pricingLoading
                          ? "bg-slate-100 text-slate-500"
                          : availableCredits > 0
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-red-50 text-red-600"
                      }
                    `}
                  >
                    {pricingLoading
                      ? "Checking..."
                      : availableCredits > 0
                        ? `${availableCredits} credits`
                        : "Buy credits"}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}