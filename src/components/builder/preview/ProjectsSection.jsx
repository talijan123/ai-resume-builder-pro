import {
  HiCodeBracket,
  HiGlobeAlt,
} from "react-icons/hi2";

import { useResume } from "../../../context/ResumeContext";

export default function ProjectsSection() {
  const { resumeData } = useResume();

  const projects = resumeData.projects;

  return (
    <section className="mt-8">
      <h2
        className="
          border-b
          border-slate-300
          pb-2

          text-lg
          font-bold
          text-slate-900
        "
      >
        Projects
      </h2>

      {projects.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No projects added yet.
        </p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="mt-5"
          >
            {/* Project Title */}

            <h3 className="font-semibold text-slate-900">
              {project.title}
            </h3>

            {/* Role + Dates */}

            <p className="text-sm text-slate-500">
              {project.role && `${project.role} • `}

              {project.startDate || "Start"}

              {" - "}

              {project.currentlyWorking
                ? "Present"
                : project.endDate || "End"}
            </p>

            {/* Technologies */}

            {project.technologies && (
              <div className="mt-3 flex flex-wrap gap-2">
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
                  mt-3
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

            {(project.githubLink ||
              project.liveLink) && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      font-medium
                      text-slate-700
                      hover:text-blue-600
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
                      font-medium
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    <HiGlobeAlt />

                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
}