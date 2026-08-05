import ResumeHeader from "./preview/ResumeHeader";
import SummarySection from "./preview/SummarySection";
import ExperienceSection from "./preview/ExperienceSection";
import EducationSection from "./preview/EducationSection";
import SkillsSection from "./preview/SkillsSection";
import ProjectsSection from "./preview/ProjectsSection";
import CertificationsSection from "./preview/CertificationsSection";

export default function ResumePreview() {
  return (
    <div
      className="
        sticky
        top-24

        h-[calc(100vh-120px)]

        overflow-hidden

        rounded-3xl

        border
        border-slate-200

        bg-white

        shadow-xl
      "
    >
      {/* Preview Header */}

      <div className="border-b border-slate-200 p-5">
        <h2 className="text-xl font-bold text-slate-900">
          Live Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your resume updates in real time.
        </p>
      </div>

      {/* Resume Paper */}

      <div
        className="
          h-full

          overflow-y-auto

          bg-slate-100

          p-6
        "
      >
        <div
          className="
            mx-auto

            w-full

            min-h-[1123px]

            rounded-xl

            bg-white

            p-8

            shadow-xl

            transition-all
          "
        >
          <ResumeHeader />

          <SummarySection />

          <ExperienceSection />

          <EducationSection />

          <SkillsSection />
          <ProjectsSection />
          <CertificationsSection/>

        </div>
      </div>
    </div>
  );
}