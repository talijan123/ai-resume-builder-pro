import {
  HiBriefcase,
  HiMapPin,
  HiCalendarDays,
  HiPencilSquare,
  HiTrash,
} from "react-icons/hi2";

import { useResume } from "../../../context/ResumeContext";

export default function ExperienceCard({
  experience,
  empty = false,
}) {
  const { deleteExperience } = useResume();

  if (empty) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-slate-50
          p-10
          text-center
        "
      >
        <div
          className="
            mx-auto
            mb-4

            flex
            h-16
            w-16

            items-center
            justify-center

            rounded-full

            bg-blue-100

            text-blue-600
          "
        >
          <HiBriefcase size={30} />
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          No Experience Added
        </h3>

        <p className="mt-2 text-slate-500">
          Click "Add Experience" to create
          your first job experience.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="flex justify-between gap-6">
        {/* Left */}

        <div className="flex gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
            "
          >
            <HiBriefcase size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {experience.jobTitle}
            </h3>

            <p className="mt-1 font-medium text-blue-600">
              {experience.company}
            </p>

            <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <HiMapPin />

                {experience.location || "Remote"}
              </div>

              <div className="flex items-center gap-2">
                <HiCalendarDays />

                {experience.startDate}

                {" - "}

                {experience.currentlyWorking
                  ? "Present"
                  : experience.endDate}
              </div>
            </div>

            {experience.employmentType && (
              <span
                className="
                  mt-3
                  inline-block

                  rounded-full

                  bg-blue-100

                  px-3
                  py-1

                  text-xs

                  font-medium

                  text-blue-700
                "
              >
                {experience.employmentType}
              </span>
            )}

            {experience.description && (
              <p
                className="
                  mt-5
                  leading-7
                  text-slate-700
                "
              >
                {experience.description}
              </p>
            )}
          </div>
        </div>

        {/* Right */}

        <div className="flex gap-2">
          <button
            className="
              rounded-xl
              bg-slate-100
              p-3
              text-slate-600
              transition
              hover:bg-slate-200
            "
          >
            <HiPencilSquare size={18} />
          </button>

          <button
            onClick={() =>
              deleteExperience(experience.id)
            }
            className="
              rounded-xl
              bg-red-100
              p-3
              text-red-600
              transition
              hover:bg-red-200
            "
          >
            <HiTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}