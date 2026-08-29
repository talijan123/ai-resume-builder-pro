import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HiArrowRight,
  HiStar,
} from "react-icons/hi2";

import TemplatePreview from "./TemplatePreview";

export default function TemplateCard({
  title,
  templateId,
  category,
  color,
}) {
  const navigate = useNavigate();

  function handleUseTemplate() {
    navigate(`/builder?template=${templateId || "modern"}`);
  }
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        group
        overflow-hidden

        rounded-3xl

        border
        border-slate-200

        bg-white

        shadow-sm

        transition-all
        duration-300

        hover:border-blue-300
        hover:shadow-2xl
        hover:shadow-blue-100
      "
    >
      {/* Top Gradient */}

      <div
        className={`
          h-2
          w-full

          bg-gradient-to-r

          ${color}
        `}
      />

      {/* Preview */}

      <div
        className="
          p-6

          transition-transform
          duration-500

          group-hover:scale-[1.03]
        "
      >
        <TemplatePreview />
      </div>

      {/* Content */}

      <div className="px-6 pb-6">

        {/* Category */}

        <span
          className="
            inline-flex

            rounded-full

            bg-blue-50

            px-3
            py-1

            text-xs
            font-semibold

            text-blue-600
          "
        >
          {category}
        </span>

        {/* Title */}

        <h3
          className="
            mt-4

            text-2xl

            font-bold

            text-slate-900
          "
        >
          {title}
        </h3>

        {/* Rating */}

        <div
          className="
            mt-4

            flex
            items-center
            gap-1
          "
        >
          {[...Array(5)].map((_, index) => (
            <HiStar
              key={index}
              className="
                text-yellow-400
              "
              size={18}
            />
          ))

          }

          <span
            className="
              ml-2

              text-sm

              text-slate-500
            "
          >
            4.9
          </span>

        </div>

        {/* Divider */}

        <div
          className="
            my-6

            h-px

            bg-slate-200
          "
        />

        {/* Button */}

        <button
          type="button"
          onClick={handleUseTemplate}
          className="
            flex
            w-full

            items-center
            justify-center
            gap-2

            rounded-2xl

            bg-slate-900

            px-6
            py-4

            font-semibold

            text-white

            transition-all
            duration-300

            hover:bg-blue-600
            cursor-pointer
          "
        >
          Use Template

          <HiArrowRight
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
            size={18}
          />
        </button>

      </div>

    </motion.div>
  );
}