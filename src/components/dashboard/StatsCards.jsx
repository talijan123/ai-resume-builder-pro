import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  HiDocumentText,
  HiArrowDownTray,
  HiSparkles,
  HiChartBar,
} from "react-icons/hi2";

import { supabase } from "../../lib/supabase";

export default function StatsCards() {
  const [statsData, setStatsData] = useState({
    totalResumes: 0,
    bestATS: 0,
    totalDownloads: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ==========================================
     Fetch Resume Statistics
  ========================================== */

  async function fetchResumeStats() {
    try {
      setLoading(true);

      /* --------------------------------------
         Get Logged-In User
      -------------------------------------- */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setStatsData({
          totalResumes: 0,
          bestATS: 0,
          totalDownloads: 0,
        });

        return;
      }

      /* --------------------------------------
         Get User's Resumes
      -------------------------------------- */

      const {
        data: resumes,
        error: resumesError,
      } = await supabase
        .from("resumes")
        .select("id, ats_score, downloads")
        .eq("user_id", user.id);

      if (resumesError) {
        throw resumesError;
      }

      /* --------------------------------------
         Calculate Total Resumes
      -------------------------------------- */

      const totalResumes = resumes?.length || 0;

      /* --------------------------------------
         Calculate Best ATS Score
      -------------------------------------- */

      const bestATS =
        resumes && resumes.length > 0
          ? Math.max(
              ...resumes.map(
                (resume) =>
                  Number(resume.ats_score) || 0
              )
            )
          : 0;

      /* --------------------------------------
         Calculate Total Downloads
      -------------------------------------- */

      const totalDownloads =
        resumes?.reduce(
          (total, resume) =>
            total +
            (Number(resume.downloads) || 0),
          0
        ) || 0;

      /* --------------------------------------
         Update State
      -------------------------------------- */

      setStatsData({
        totalResumes,
        bestATS,
        totalDownloads,
      });
    } catch (error) {
      console.error(
        "Failed to load resume statistics:",
        error
      );

      setStatsData({
        totalResumes: 0,
        bestATS: 0,
        totalDownloads: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================
     Initial Load + Refresh When Dashboard
     Becomes Visible Again
  ========================================== */

  useEffect(() => {
    fetchResumeStats();

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchResumeStats();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* ==========================================
     AI Credits
  ========================================== */

  const aiCredits = 48;

  /* ==========================================
     Dashboard Stats
  ========================================== */

  const stats = [
    {
      title: "Total Resumes",
      value: loading
        ? "..."
        : statsData.totalResumes,
      icon: HiDocumentText,
      color: "from-blue-500 to-indigo-600",
    },

    {
      title: "Best ATS Score",
      value: loading
        ? "..."
        : `${statsData.bestATS}%`,
      icon: HiChartBar,
      color: "from-green-500 to-emerald-600",
    },

    {
      title: "Downloads",
      value: loading
        ? "..."
        : statsData.totalDownloads,
      icon: HiArrowDownTray,
      color: "from-orange-500 to-amber-600",
    },

    {
      title: "AI Credits",
      value: aiCredits,
      icon: HiSparkles,
      color: "from-purple-500 to-pink-600",
    },
  ];

  /* ==========================================
     UI
  ========================================== */

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:shadow-xl
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-4xl font-black text-slate-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-r
                  ${item.color}
                  text-white
                  shadow-lg
                `}
              >
                <Icon size={30} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}