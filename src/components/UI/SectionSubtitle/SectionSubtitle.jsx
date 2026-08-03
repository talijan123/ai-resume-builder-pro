export default function SectionSubtitle({ children }) {
  return (
    <p
      className="
        mx-auto
        mt-6

        max-w-2xl

        text-center

        text-lg
        leading-8

        text-slate-500
      "
    >
      {children}
    </p>
  );
}