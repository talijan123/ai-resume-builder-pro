import { useEffect, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineCreditCard,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { getCreditBalance } from "../../services/creditService";

export default function StatsCards() {
  const { user, loading: authLoading } = useAuth();

  const [credits, setCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  /* =========================================================
     LOAD CREDIT BALANCE
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadCredits() {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (mounted) {
          setCredits(0);
          setCreditsLoading(false);
        }

        return;
      }

      try {
        setCreditsLoading(true);

        const balance = await getCreditBalance();

        if (mounted) {
          setCredits(balance);
        }
      } catch (error) {
        console.error(
          "Failed to load credit balance:",
          error
        );

        if (mounted) {
          setCredits(0);
        }
      } finally {
        if (mounted) {
          setCreditsLoading(false);
        }
      }
    }

    loadCredits();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = [
    {
      title: "Resumes Created",
      value: "0",
      description: "Total resumes",
      icon: HiOutlineDocumentText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "AI Credits",
      value: creditsLoading ? "..." : credits,
      description:
        credits === 0 && !creditsLoading
          ? "No credits remaining"
          : "Credits available",
      icon: HiOutlineSparkles,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },

    {
      title: "Plan",
      value: "Starter",
      description: "Current subscription",
      icon: HiOutlineCreditCard,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "Profile",
      value: "0%",
      description: "Profile completion",
      icon: HiOutlineArrowTrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              {/* Header */}

              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-500
                    "
                  >
                    {stat.title}
                  </p>

                  <h3
                    className="
                      mt-3
                      text-3xl
                      font-black
                      text-slate-900
                    "
                  >
                    {stat.value}
                  </h3>
                </div>

                {/* Icon */}

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    ${stat.iconBg}
                  `}
                >
                  <Icon
                    className={stat.iconColor}
                    size={24}
                  />
                </div>
              </div>

              {/* Description */}

              <p
                className="
                  mt-4
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}