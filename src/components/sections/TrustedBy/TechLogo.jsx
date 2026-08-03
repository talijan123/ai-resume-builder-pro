export default function TechLogo({
  icon: Icon,
  name,
}) {
  return (
    <div
      className="
        group

        flex
        flex-col
        items-center
        justify-center

        rounded-2xl

        border
        border-slate-200

        bg-white

        p-6

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-2
        hover:border-blue-500
        hover:shadow-xl
      "
    >
      <Icon
        className="
          text-5xl

          text-slate-400

          transition-colors
          duration-300

          group-hover:text-blue-600
        "
      />

      <p
        className="
          mt-4

          font-semibold

          text-slate-700
        "
      >
        {name}
      </p>
    </div>
  );
}