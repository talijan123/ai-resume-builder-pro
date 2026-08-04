import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentResumes from "../components/dashboard/RecentResumes";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <DashboardHeader />

      {/* Main Content */}

      <main
        className="
          mx-auto
          max-w-7xl

          px-6
          py-10

          space-y-8
        "
      >
        {/* Welcome */}

        <WelcomeBanner />

        {/* Stats */}

        <StatsCards />

        {/* Quick Actions */}

        <QuickActions />

        {/* Recent Resumes */}

        <RecentResumes />
      </main>
    </div>
  );
}