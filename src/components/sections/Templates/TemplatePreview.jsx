export default function TemplatePreview() {
  return (
    <div
      className="
        h-80

        rounded-2xl

        border
        border-slate-200

        bg-white

        p-5

        shadow-inner
      "
    >
      {/* Header */}

      <div className="space-y-2">

        <div className="h-4 w-36 rounded bg-slate-800" />

        <div className="h-2 w-20 rounded bg-blue-500" />

      </div>

      {/* Divider */}

      <div className="my-5 h-px bg-slate-200" />

      {/* Summary */}

      <div className="space-y-2">

        <div className="h-2 rounded bg-slate-200" />

        <div className="h-2 rounded bg-slate-200" />

        <div className="h-2 w-3/4 rounded bg-slate-200" />

      </div>

      {/* Skills */}

      <div className="mt-6 flex flex-wrap gap-2">

        {["React", "Node", "UI", "Tailwind"].map((skill) => (
          <span
            key={skill}
            className="
              rounded-full

              bg-slate-100

              px-3
              py-1

              text-xs

              text-slate-600
            "
          >
            {skill}
          </span>
        ))}

      </div>

      {/* Experience */}

      <div className="mt-8 space-y-3">

        <div className="h-3 w-2/3 rounded bg-slate-300" />

        <div className="h-2 rounded bg-slate-200" />

        <div className="h-2 rounded bg-slate-200" />

        <div className="h-2 w-4/5 rounded bg-slate-200" />

      </div>
    </div>
  );
}