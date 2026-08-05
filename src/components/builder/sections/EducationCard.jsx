import {
  HiAcademicCap,
  HiPencilSquare,
  HiTrash,
} from "react-icons/hi2";

export default function EducationCard({
  education,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between">
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
            <HiAcademicCap size={24} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {education.degree || "Degree"}
            </h3>

            <p className="mt-1 font-medium text-slate-700">
              {education.school || "Institution"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {education.startDate || "Start"}

              {" - "}

              {education.currentlyStudying
                ? "Present"
                : education.endDate || "End"}
            </p>

            {education.grade && (
              <p className="mt-2 text-sm text-slate-600">
                Grade / CGPA:{" "}
                <span className="font-semibold">
                  {education.grade}
                </span>
              </p>
            )}

            {education.description && (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {education.description}
              </p>
            )}
          </div>
        </div>

        {/* Right */}

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="
              rounded-lg
              bg-slate-100
              p-2
              text-slate-600
              transition
              hover:bg-blue-100
              hover:text-blue-600
            "
          >
            <HiPencilSquare size={20} />
          </button>

          <button
            onClick={onDelete}
            className="
              rounded-lg
              bg-slate-100
              p-2
              text-slate-600
              transition
              hover:bg-red-100
              hover:text-red-600
            "
          >
            <HiTrash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}