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
        y: -8,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        shadow-sm
        transition-all
        duration-300
        hover:border-blue-300
        dark:hover:border-blue-500/40
        hover:shadow-2xl
        hover:shadow-blue-500/10
      "
    >
      {/* Top Gradient Stripe */}
      <div
        className={`
          h-2
          w-full
          bg-gradient-to-r
          ${color}
        `}
      />

      {/* Preview Container with subtle mat background and micro-interaction */}
      <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/80">
        <div className="group-hover:scale-[1.02] transition-transform duration-300 ease-out shadow-sm rounded-xl overflow-hidden">
          <TemplatePreview templateId={templateId} color={color} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <span
          className="
            inline-flex
            rounded-full
            bg-blue-50
            dark:bg-blue-950/60
            border
            border-blue-200/60
            dark:border-blue-800/40
            px-3
            py-1
            text-xs
            font-bold
            text-blue-600
            dark:text-blue-400
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
            dark:text-white
          "
        >
          {title}
        </h3>

        {/* Rating */}
        <div className="mt-4 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <HiStar
              key={index}
              className="text-amber-400"
              size={18}
            />
          ))}

          <span className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            4.9
          </span>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200 dark:border-slate-800 dark:bg-slate-800" />

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
            dark:bg-blue-600
            px-6
            py-4
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-blue-600
            dark:hover:bg-blue-500
            hover:shadow-lg
            hover:shadow-blue-500/20
            cursor-pointer
          "
        >
          Use Template
          <HiArrowRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            size={18}
          />
        </button>
      </div>
    </motion.div>
  );
}