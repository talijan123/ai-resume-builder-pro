export default function SectionTitle({
  badge,
  title,
  description,
}) {
  return (
    <div className="max-w-3xl">

      {badge}

      <h2
        className="
          mt-6
          text-5xl
          font-black
          tracking-tight
          text-white
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-6
          text-lg
          leading-8
          text-slate-400
        "
      >
        {description}
      </p>

    </div>
  );
}