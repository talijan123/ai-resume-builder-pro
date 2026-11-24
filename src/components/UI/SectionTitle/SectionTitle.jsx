export default function SectionTitle({ children }) {
  return (
    <h2
      className="
        mx-auto
        mt-4

        max-w-4xl

        text-center

        text-4xl
        font-black

        leading-tight
        tracking-[-0.03em]

        text-slate-900

        sm:text-5xl
        lg:text-6xl
      "
    >
      {children}
    </h2>
  );
}