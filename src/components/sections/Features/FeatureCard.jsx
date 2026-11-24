import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function FeatureCard({
  icon: Icon,
  title,
  slug,
  description,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const targetSlug = slug || "ai-resume-builder";

  function handleClick() {
    if (user) {
      navigate(`/blog/${targetSlug}`);
    } else {
      navigate(`/login?redirect=/blog/${targetSlug}`);
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      whileHover={{
        y: -8,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group
        relative
        overflow-hidden
        cursor-pointer
        text-left

        rounded-3xl

        border
        border-slate-200

        bg-white

        p-8

        shadow-sm

        transition-all
        duration-300

        hover:border-blue-400
        hover:shadow-2xl
        hover:shadow-blue-500/10
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
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
          transition-colors
          group-hover:text-blue-600
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
        Learn More Guide

        <HiArrowRight
          className="
            transition-transform
            duration-300

            group-hover:translate-x-1.5
          "
        />
      </div>
    </motion.div>
  );
}