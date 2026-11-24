import ResumePaper from "./ResumePaper";
import ATSCard from "./ATSCard";
import FloatingBadge from "./FloatingBadge";

export default function ResumePreview() {
  return (
    <div className="relative flex items-center justify-center">

      {/* ATS Card */}

      <div className="absolute -top-8 right-0 z-20">
        <ATSCard />
      </div>

      {/* Resume */}

      <div
        className="
          relative

          transition-all
          duration-500

          hover:-translate-y-2
          hover:rotate-1
        "
      >
        <ResumePaper />
      </div>

      {/* Floating Badge */}

      <div className="absolute -bottom-8 -left-8 z-20">
        <FloatingBadge />
      </div>

    </div>
  );
}