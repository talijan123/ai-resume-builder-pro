export default function Logo() {
  return (
    <div className="flex items-center gap-3">

      <div
        className="
          w-11
          h-11
          rounded-2xl

          bg-gradient-to-br
          from-blue-500
          to-blue-700

          flex
          items-center
          justify-center

          text-white
          font-black
        "
      >
        RF
      </div>

      <div>

        <h1 className="text-white text-xl font-black tracking-tight">
          ResumeForge
        </h1>

        <p className="text-xs text-slate-400">
          AI Resume Builder
        </p>

      </div>

    </div>
  );
}