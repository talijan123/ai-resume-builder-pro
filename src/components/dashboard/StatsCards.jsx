import { useEffect, useState } from "react";

import {
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineSquares2X2,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function StatsCards() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    resumesCreated: 0,
    atsScore: 0,
    templatesUsed: 0,
    profileCompletion: 0,
  });

  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD REAL DASHBOARD STATISTICS
  ========================================================= */

  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setStats({
          resumesCreated: 0,
          atsScore: 0,
          templatesUsed: 0,
          profileCompletion: 0,
        });

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        console.log(
          "📊 Loading dashboard statistics for:",
          user.id
        );

        /* =====================================================
           GET USER RESUMES
        ===================================================== */

        const {
          data: resumes,
          error: resumesError,
        } = await supabase
          .from("resumes")
          .select(
            "id, ats_score, template, created_at"
          )
          .eq("user_id", user.id);

        if (resumesError) {
          throw resumesError;
        }

        console.log(
          "✅ User resumes:",
          resumes
        );

        /* =====================================================
           RESUMES CREATED
        ===================================================== */

        const resumesCreated =
          resumes?.length || 0;

        /* =====================================================
           AVERAGE ATS SCORE
        ===================================================== */

        let atsScore = 0;

        if (resumesCreated > 0) {
          const validScores =
            resumes
              .map((resume) =>
                Number(resume.ats_score)
              )
              .filter(
                (score) =>
                  Number.isFinite(score)
              );

          if (validScores.length > 0) {
            const totalScore =
              validScores.reduce(
                (total, score) =>
                  total + score,
                0
              );

            atsScore = Math.round(
              totalScore /
                validScores.length
            );
          }
        }

        /* =====================================================
           UNIQUE TEMPLATES USED
        ===================================================== */

        const uniqueTemplates =
          new Set(
            (resumes || [])
              .map(
                (resume) =>
                  resume.template
              )
              .filter(Boolean)
          );

        const templatesUsed =
          uniqueTemplates.size;

        /* =====================================================
           PROFILE COMPLETION
           
           IMPORTANT:
           This is temporarily calculated from
           Supabase Auth profile information.

           If your app has a profiles table,
           we should connect this calculation
           directly to that table instead.
        ===================================================== */

        const profileFields = [
          user.email,
          user.user_metadata?.full_name,
          user.user_metadata?.avatar_url,
        ];

        const completedFields =
          profileFields.filter(
            Boolean
          ).length;

        const profileCompletion =
          Math.round(
            (completedFields /
              profileFields.length) *
              100
          );

        /* =====================================================
           SAVE STATISTICS
        ===================================================== */

        setStats({
          resumesCreated,
          atsScore,
          templatesUsed,
          profileCompletion,
        });

        console.log(
          "📊 Dashboard stats:",
          {
            resumesCreated,
            atsScore,
            templatesUsed,
            profileCompletion,
          }
        );
      } catch (error) {
        console.error(
          "❌ Failed to load dashboard statistics:",
          error
        );

        setStats({
          resumesCreated: 0,
          atsScore: 0,
          templatesUsed: 0,
          profileCompletion: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user]);

  /* =========================================================
     STATS CARDS
  ========================================================= */

  const statCards = [
    {
      title: "Resumes Created",

      value: loading
        ? "..."
        : stats.resumesCreated,

      description:
        stats.resumesCreated === 1
          ? "1 resume saved"
          : `${stats.resumesCreated} resumes saved`,

      icon: HiOutlineDocumentText,

      iconBg: "bg-blue-50",

      iconColor: "text-blue-600",
    },

    {
      title: "ATS Score",

      value: loading
        ? "..."
        : `${stats.atsScore}%`,

      description:
        stats.resumesCreated === 0
          ? "Create a resume to get your score"
          : "Average resume ATS score",

      icon: HiOutlineChartBar,

      iconBg: "bg-indigo-50",

      iconColor: "text-indigo-600",
    },

    {
      title: "Templates Used",

      value: loading
        ? "..."
        : stats.templatesUsed,

      description:
        stats.templatesUsed === 0
          ? "No templates used yet"
          : stats.templatesUsed === 1
          ? "1 template used"
          : `${stats.templatesUsed} different templates`,

      icon: HiOutlineSquares2X2,

      iconBg: "bg-emerald-50",

      iconColor: "text-emerald-600",
    },

    {
      title: "Profile",

      value: loading
        ? "..."
        : `${stats.profileCompletion}%`,

      description:
        stats.profileCompletion >= 100
          ? "Profile complete"
          : "Profile completion",

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
        {statCards.map((stat) => {
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