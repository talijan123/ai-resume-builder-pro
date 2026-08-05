import BuilderHeader from "../components/builder/BuilderHeader";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import BuilderContent from "../components/builder/BuilderContent";
import ResumePreview from "../components/builder/ResumePreview";


export default function ResumeBuilder() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <BuilderHeader />

      {/* Main */}

      <div
        className="
          mx-auto
          max-w-[1800px]
          px-6
          py-8
        "
      >
        <div
          className="
            grid
            gap-8

            xl:grid-cols-[300px_1fr_650px]
          "
        >
          {/* Left Sidebar */}

          
            <BuilderSidebar />

            
         

          {/* Builder */}

          <BuilderContent />

          {/* Resume Preview */}

          <ResumePreview />
        </div>
      </div>
    </div>
  );
}