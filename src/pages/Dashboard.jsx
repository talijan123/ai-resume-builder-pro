import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentResumes from "../components/dashboard/RecentResumes";

import { usePricing } from "../context/PricingContext";

export default function Dashboard() {
  const {
    plan,
    planName,
    availableCredits,
    maxResumes,
    maxCoverLetters,
    canUsePremiumTemplates,
    canUseCoverLetters,
    canUseAI,
    loading: pricingLoading,
  } = usePricing();

  /* =======================================================
     LOADING
  ======================================================= */

  if (pricingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          HEADER
      ================================================= */}

      <DashboardHeader />

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="
          mx-auto
          max-w-7xl
          space-y-8
          px-6
          py-10
        "
      >
        {/* =================================================
            WELCOME
        ================================================= */}

        <WelcomeBanner />

        {/* =================================================
            PLAN / CREDITS SUMMARY
        ================================================= */}

        <section
          className="
            grid
            gap-5
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* Plan */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm font-semibold text-slate-500">
              Current Plan
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {planName}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {plan?.description ||
                "Your current ResumeForge plan"}
            </p>
          </div>

          {/* Credits */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm font-semibold text-slate-500">
              Available Credits
            </p>

            <h2 className="mt-2 text-2xl font-black text-blue-600">
              {availableCredits}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Credits available for AI features
            </p>
          </div>

          {/* Resume Limit */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm font-semibold text-slate-500">
              Resume Limit
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {maxResumes}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Maximum resumes for your plan
            </p>
          </div>

          {/* Cover Letters */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <p className="text-sm font-semibold text-slate-500">
              Cover Letters
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {canUseCoverLetters
                ? maxCoverLetters
                : "Locked"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {canUseCoverLetters
                ? "Available on your plan"
                : "Upgrade to unlock"}
            </p>
          </div>
        </section>

        {/* =================================================
            EXISTING STATS
        ================================================= */}

        <StatsCards />

        {/* =================================================
            FEATURE ACCESS
        ================================================= */}

        <section
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                Plan Benefits
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Your available features
              </h2>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-2">
              <span className="text-sm font-bold text-slate-700">
                {planName} Plan
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {/* AI */}

            <FeatureItem
              title="AI Features"
              enabled={canUseAI}
            />

            {/* Premium Templates */}

            <FeatureItem
              title="Premium Templates"
              enabled={canUsePremiumTemplates}
            />

            {/* Cover Letters */}

            <FeatureItem
              title="Cover Letters"
              enabled={canUseCoverLetters}
            />
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <QuickActions />

        {/* =================================================
            RECENT RESUMES
        ================================================= */}

        <RecentResumes />
      </main>
    </div>
  );
}

/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({
  title,
  enabled,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-4
        ${
          enabled
            ? "border-green-200 bg-green-50"
            : "border-slate-200 bg-slate-50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-sm
            font-black
            ${
              enabled
                ? "bg-green-100 text-green-600"
                : "bg-slate-200 text-slate-500"
            }
          `}
        >
          {enabled ? "✓" : "🔒"}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800">
            {title}
          </p>

          <p
            className={`
              text-xs
              font-semibold
              ${
                enabled
                  ? "text-green-600"
                  : "text-slate-500"
              }
            `}
          >
            {enabled
              ? "Available"
              : "Upgrade required"}
          </p>
        </div>
      </div>
    </div>
  );
}