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

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      if (!user) {
        if (mounted) {
          setStats({
            resumesCreated: 0,
            atsScore: 0,
            templatesUsed: 0,
            profileCompletion: 0,
          });

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        const [
          resumesResult,
          profileResult,
        ] = await Promise.all([
          supabase
            .from("resumes")
            .select(
              "id, ats_score, template, created_at"
            )
            .eq("user_id", user.id),

          supabase
            .from("profiles")
            .select(`
              full_name,
              professional_title,
              location,
              summary,
              years_of_experience,
              desired_job_title,
              email,
              phone,
              website,
              linkedin,
              github,
              photo_url
            `)
            .eq("id", user.id)
            .maybeSingle(),
        ]);

        if (resumesResult.error) {
          throw resumesResult.error;
        }

        if (profileResult.error) {
          throw profileResult.error;
        }

        const resumes =
          resumesResult.data || [];

        const profile =
          profileResult.data || {};

        const resumesCreated =
          resumes.length;

        let atsScore = 0;

        const validScores = resumes
          .map((resume) =>
            Number(resume.ats_score)
          )
          .filter((score) =>
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

        const uniqueTemplates =
          new Set(
            resumes
              .map(
                (resume) =>
                  resume.template
              )
              .filter(Boolean)
          );

        const templatesUsed =
          uniqueTemplates.size;

        const profileFields = [
          profile.full_name,
          profile.professional_title,
          profile.location,
          profile.summary,
          profile.years_of_experience,
          profile.desired_job_title,
          profile.email,
          profile.phone,
          profile.website,
          profile.linkedin,
          profile.github,
        ];

        const completedProfileFields =
          profileFields.filter(
            (field) =>
              field !== null &&
              field !== undefined &&
              String(field).trim() !== ""
          ).length;

        const profileCompletion =
          profileFields.length > 0
            ? Math.round(
                (completedProfileFields /
                  profileFields.length) *
                  100
              )
            : 0;

        if (mounted) {
          setStats({
            resumesCreated,
            atsScore,
            templatesUsed,
            profileCompletion,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard statistics:",
          error
        );

        if (mounted) {
          setStats({
            resumesCreated: 0,
            atsScore: 0,
            templatesUsed: 0,
            profileCompletion: 0,
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const profileChannel =
      supabase
        .channel(
          `dashboard-profile-${user.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          async () => {
            const {
              data,
              error,
            } = await supabase
              .from("profiles")
              .select(`
                full_name,
                professional_title,
                location,
                summary,
                years_of_experience,
                desired_job_title,
                email,
                phone,
                website,
                linkedin,
                github,
                photo_url
              `)
              .eq("id", user.id)
              .maybeSingle();

            if (error) {
              console.error(
                "Failed to refresh profile stats:",
                error
              );

              return;
            }

            const profile =
              data || {};

            const profileFields = [
              profile.full_name,
              profile.professional_title,
              profile.location,
              profile.summary,
              profile.years_of_experience,
              profile.desired_job_title,
              profile.email,
              profile.phone,
              profile.website,
              profile.linkedin,
              profile.github,
            ];

            const completed =
              profileFields.filter(
                (field) =>
                  field !== null &&
                  field !== undefined &&
                  String(field).trim() !== ""
              ).length;

            const profileCompletion =
              Math.round(
                (completed /
                  profileFields.length) *
                  100
              );

            setStats((previous) => ({
              ...previous,
              profileCompletion,
            }));
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        profileChannel
      );
    };
  }, [user]);

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
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-black text-slate-900">
                    {stat.value}
                  </h3>
                </div>

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

              <p className="mt-4 text-xs font-medium text-slate-400">
                {stat.description}
              </p>

              {stat.title === "Profile" &&
                !loading && (
                  <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-purple-600
                          to-indigo-600
                          transition-all
                          duration-700
                        "
                        style={{
                          width: `${stats.profileCompletion}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </section>
  );
}