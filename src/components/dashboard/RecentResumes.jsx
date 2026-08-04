import { motion } from "framer-motion";
import {
  HiPencilSquare,
  HiArrowDownTray,
  HiDocumentText,
} from "react-icons/hi2";

const resumes = [
  {
    id: 1,
    title: "Software Engineer Resume",
    ats: 92,
    updated: "Today",
  },
  {
    id: 2,
    title: "Frontend Developer Resume",
    ats: 88,
    updated: "Yesterday",
  },
  {
    id: 3,
    title: "UI/UX Designer Resume",
    ats: 90,
    updated: "2 days ago",
  },
];

export default function RecentResumes() {
  return (
    <section>
      {/* Heading */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Resumes
          </h2>

          <p className="mt-2 text-slate-500">
            Continue editing your latest resumes.
          </p>
        </div>

        <button
          className="
            rounded-xl

            border
            border-slate-200

            bg-white

            px-5
            py-3

            font-medium

            text-slate-700

            transition-all

            hover:bg-slate-100
          "
        >
          View All
        </button>
      </div>

      {/* Cards */}

      <div className="space-y-5">
        {resumes.map((resume, index) => (
          <motion.div
            key={resume.id}
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
              delay: index * 0.08,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              flex

              flex-col

              gap-6

              rounded-3xl

              border
              border-slate-200

              bg-white

              p-6

              shadow-sm

              transition-all

              hover:shadow-xl

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* Left */}

            <div className="flex items-center gap-5">

              <div
                className="
                  flex

                  h-14
                  w-14

                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600

                  text-white
                "
              >
                <HiDocumentText size={28} />
              </div>

              <div>

                <h3
                  className="
                    text-xl

                    font-bold

                    text-slate-900
                  "
                >
                  {resume.title}
                </h3>

                <p className="mt-1 text-slate-500">
                  Last updated {resume.updated}
                </p>

              </div>

            </div>

            {/* Right */}

            <div className="flex flex-wrap items-center gap-4">

              <span
                className="
                  rounded-full

                  bg-green-100

                  px-4
                  py-2

                  text-sm

                  font-semibold

                  text-green-700
                "
              >
                ATS {resume.ats}%
              </span>

              <button
                className="
                  flex

                  items-center

                  gap-2

                  rounded-xl

                  border
                  border-slate-200

                  px-4
                  py-3

                  font-medium

                  text-slate-700

                  transition-all

                  hover:bg-slate-100
                "
              >
                <HiPencilSquare size={18} />

                Edit
              </button>

              <button
                className="
                  flex

                  items-center

                  gap-2

                  rounded-xl

                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600

                  px-5
                  py-3

                  font-medium

                  text-white

                  transition-all

                  hover:shadow-lg
                "
              >
                <HiArrowDownTray size={18} />

                Download
              </button>

            </div>

          </motion.div>
        ))}
      </div>
    </section>
  );
}