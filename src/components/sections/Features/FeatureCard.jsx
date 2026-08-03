import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group
        relative
        overflow-hidden

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
      {/* Background Glow */}

      <div
        className="
          absolute

          -right-20
          -top-20

          h-40
          w-40

          rounded-full

          bg-blue-500/10

          blur-3xl

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />

      {/* Icon */}

      <div
        className="
          relative

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

          group-hover:rotate-6
          group-hover:scale-110
        "
      >
        <Icon size={30} />
      </div>

      {/* Content */}

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

      <p
        className="
          mt-4

          leading-7

          text-slate-600
        "
      >
        {description}
      </p>

      {/* Learn More */}

      <div
        className="
          mt-8

          flex
          items-center
          gap-2

          font-semibold

          text-blue-600
        "
      >
        Learn More

        <HiArrowRight
          className="
            transition-transform
            duration-300

            group-hover:translate-x-1
          "
        />
      </div>
    </motion.div>
  );
}