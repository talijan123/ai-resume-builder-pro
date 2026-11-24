export default function Badge({
  children,
}) {
  return (
    <span
      className="
        inline-flex
        items-center

        rounded-full

        bg-blue-500/10

        border
        border-blue-500/30

        px-4
        py-2

        text-sm
        font-semibold

        text-blue-400
      "
    >
      {children}
    </span>
  );
}