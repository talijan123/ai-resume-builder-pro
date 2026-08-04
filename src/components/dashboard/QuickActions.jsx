import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  HiSparkles,
  HiDocumentText,
  HiSquares2X2,
  HiDocumentDuplicate,
} from "react-icons/hi2";

const actions = [
  {
    title: "AI Resume Builder",
    description: "Generate a professional resume with AI.",
    icon: HiSparkles,
    to: "/builder",
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "My Resumes",
    description: "View and manage your saved resumes.",
    icon: HiDocumentText,
    to: "/my-resumes",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Templates",
    description: "Browse premium ATS-friendly templates.",
    icon: HiSquares2X2,
    to: "/templates",
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Cover Letter",
    description: "Generate a matching cover letter instantly.",
    icon: HiDocumentDuplicate,
    to: "/cover-letter",
    color: "from-purple-500 to-pink-600",
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-2 text-slate-500">
          Jump directly into your most-used tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.div
              key={action.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
            >
              <Link
                to={action.to}
                className="
                  block

                  rounded-3xl

                  border
                  border-slate-200

                  bg-white

                  p-6

                  shadow-sm

                  transition-all
                  duration-300

                  hover:shadow-xl
                "
              >
                <div
                  className={`
                    mb-5

                    flex

                    h-16
                    w-16

                    items-center
                    justify-center

                    rounded-2xl

                    bg-gradient-to-r
                    ${action.color}

                    text-white

                    shadow-lg
                  `}
                >
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}