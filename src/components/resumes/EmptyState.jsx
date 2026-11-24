import { Link } from "react-router-dom";
import {
  HiDocumentText,
  HiPlus,
} from "react-icons/hi2";

export default function EmptyState() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center

        rounded-3xl
        border-2
        border-dashed
        border-slate-300

        bg-white

        px-8
        py-20

        text-center

        shadow-sm
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-24
          w-24
          items-center
          justify-center

          rounded-full

          bg-gradient-to-r
          from-blue-600
          to-indigo-600

          text-white

          shadow-xl
        "
      >
        <HiDocumentText size={46} />
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-3xl font-black text-slate-900">
        No Resumes Yet
      </h2>

      {/* Description */}

      <p
        className="
          mt-4
          max-w-xl
          text-lg
          leading-8
          text-slate-500
        "
      >
        You haven't created any resumes yet.
        Start building your first ATS-friendly resume
        in just a few minutes.
      </p>

      {/* Button */}

      <Link
        to="/builder"
        className="
          mt-10

          inline-flex
          items-center
          gap-3

          rounded-2xl

          bg-gradient-to-r
          from-blue-600
          to-indigo-600

          px-8
          py-4

          text-lg
          font-semibold

          text-white

          shadow-lg

          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-2xl
        "
      >
        <HiPlus size={22} />

        Create Your First Resume
      </Link>

      {/* Footer */}

      <p className="mt-6 text-sm text-slate-400">
        Professional • ATS Optimized • AI Powered
      </p>
    </div>
  );
}