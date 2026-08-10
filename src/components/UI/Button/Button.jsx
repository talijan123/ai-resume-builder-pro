export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        rounded-full
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        px-6
        py-3
        font-semibold
        text-white
        shadow-lg
        shadow-blue-500/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </button>
  );
}