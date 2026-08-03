const links = [
  "Features",
  "Templates",
  "Pricing",
  "Resources",
];

export default function NavLinks() {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {links.map((link) => (
        <button
          key={link}
          className="
            relative
            text-slate-300
            font-medium
            transition
            hover:text-white

            after:absolute
            after:left-0
            after:-bottom-2

            after:h-[2px]
            after:w-0

            after:bg-blue-500

            after:transition-all
            after:duration-300

            hover:after:w-full
          "
        >
          {link}
        </button>
      ))}
    </nav>
  );
}