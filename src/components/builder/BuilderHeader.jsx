import { HiArrowLeft, HiCloudArrowUp } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function BuilderHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-6">
        {/* Left */}

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              transition-all
              hover:bg-slate-100
            "
          >
            <HiArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Resume Builder
            </h1>

            <p className="text-sm text-slate-500">
              Build your ATS-friendly resume
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-4">
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Saved
          </span>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-5
              py-3
              font-semibold
              text-white
              transition-all
              hover:shadow-lg
            "
          >
            <HiCloudArrowUp size={20} />

            Save Resume
          </button>
        </div>
      </div>
    </header>
  );
}