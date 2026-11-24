import { HiArrowRight } from "react-icons/hi2";

export default function CTAButton() {
  return (
    <button
      className="
        group

        inline-flex
        items-center
        gap-2

        rounded-full

        bg-gradient-to-r
        from-blue-600
        to-blue-500

        px-6
        py-3

        font-semibold
        text-white

        shadow-lg
        shadow-blue-600/20

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-blue-600/30
      "
    >
      Start Building

      <HiArrowRight
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      />
    </button>
  );
}