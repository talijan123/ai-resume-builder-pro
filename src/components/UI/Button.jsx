export default function Button({
  children,
  className = "",
}) {
  return (
    <button
      className={`
        px-6
        py-3
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        transition-all
        duration-300
        font-semibold
        text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
}