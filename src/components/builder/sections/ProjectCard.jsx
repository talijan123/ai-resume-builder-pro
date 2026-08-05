import {
  HiPencilSquare,
  HiTrash,
  HiCodeBracket,
  HiGlobeAlt,
  HiCalendarDays,
} from "react-icons/hi2";

export default function ProjectCard({
  project,
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
        hover:shadow-lg
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {project.title || "Untitled Project"}
          </h3>

          {project.role && (
            <p className="mt-1 text-sm font-medium text-blue-600">
              {project.role}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <HiPencilSquare size={20} />
          </button>

          <button
            onClick={onDelete}
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-red-50
              hover:text-red-600
            "
          >
            <HiTrash size={20} />
          </button>
        </div>
      </div>

      {/* Duration */}

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <HiCalendarDays />

        <span>
          {project.startDate || "Start"}

          {" - "}

          {project.currentlyWorking
            ? "Present"
            : project.endDate || "End"}
        </span>
      </div>

      {/* Technologies */}

      {project.technologies && (
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies
            .split(",")
            .map((tech) => (
              <span
                key={tech}
                className="
                  rounded-full
                  bg-blue-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-blue-700
                "
              >
                {tech.trim()}
              </span>
            ))}
        </div>
      )}

      {/* Description */}

      {project.description && (
        <p
          className="
            mt-5
            whitespace-pre-line
            text-sm
            leading-7
            text-slate-700
          "
        >
          {project.description}
        </p>
      )}

      {/* Links */}

      <div className="mt-6 flex flex-wrap gap-3">
        {project.githubLink && (
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-slate-100
              px-4
              py-2
              text-sm
              font-medium
              text-slate-700
              transition
              hover:bg-slate-200
            "
          >
            <HiCodeBracket />

            GitHub
          </a>
        )}

        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <HiGlobeAlt />

            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}