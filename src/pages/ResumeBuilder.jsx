import BuilderHeader from "../components/builder/BuilderHeader";
import BuilderSidebar from "../components/builder/BuilderSidebar";
import BuilderContent from "../components/builder/BuilderContent";
import ResumePreview from "../components/builder/ResumePreview";

export default function ResumeBuilder() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <BuilderHeader />

      {/* Main Builder */}

      <main
        className="
          mx-auto

          flex

          max-w-[1700px]

          gap-6

          p-6
        "
      >
        {/* Sidebar */}

        <aside className="w-72 shrink-0">
          <BuilderSidebar />
        </aside>

        {/* Form Area */}

        <section className="min-w-0 flex-1">
          <BuilderContent />
        </section>

        {/* Live Preview */}

        <aside className="hidden w-[430px] shrink-0 xl:block">
          <ResumePreview />
        </aside>
      </main>
    </div>
  );
}