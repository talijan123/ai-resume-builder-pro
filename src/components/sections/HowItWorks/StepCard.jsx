import { motion } from "framer-motion";

export default function StepCard({
  number,
  title,
  description,
  icon: Icon,
}) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group

        relative

        rounded-3xl

        border
        border-slate-200

        bg-white

        p-8

        shadow-sm

        transition-all
        duration-300

        hover:border-blue-300
        hover:shadow-2xl
        hover:shadow-blue-100
      "
    >
      {/* Step Number */}

      <div
        className="
          absolute

          right-6
          top-6

          text-6xl

          font-black

          text-slate-100

          transition-colors
          duration-300

          group-hover:text-blue-50
        "
      >
        {number}
      </div>

      {/* Icon */}

      <div
        className="
          flex

          h-16
          w-16

          items-center
          justify-center

          rounded-2xl

          bg-gradient-to-br

          from-blue-500
          to-indigo-600

          text-white

          shadow-lg
          shadow-blue-500/30

          transition-transform
          duration-300

          group-hover:scale-110
          group-hover:rotate-6
        "
      >
        <Icon size={30} />
      </div>

      {/* Title */}

      <h3
        className="
          mt-8

          text-2xl

          font-bold

          text-slate-900
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-4

          leading-7

          text-slate-600
        "
      >
        {description}
      </p>
    </motion.div>
  );
}