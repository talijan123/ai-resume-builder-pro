import { useState } from "react";

import { useResume } from "../../../context/ResumeContext";

import ProjectCard from "./ProjectCard";
import ProjectModal from "../modals/ProjectModal";

export default function ProjectsForm() {
  const {
    resumeData,

    addProject,
    updateProject,
    deleteProject,
  } = useResume();

  const [openModal, setOpenModal] = useState(false);

  const [editingProject, setEditingProject] =
    useState(null);

  function handleAdd() {
    setEditingProject(null);

    setOpenModal(true);
  }

  function handleEdit(project) {
    setEditingProject(project);

    setOpenModal(true);
  }

  function handleSave(project) {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }

    setOpenModal(false);

    setEditingProject(null);
  }

  function handleDelete(id) {
    deleteProject(id);
  }

  return (
    <>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Projects
          </h3>

          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showcase your best work and portfolio projects.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            px-4
            sm:px-5
            py-2.5
            sm:py-3
            text-xs
            sm:text-sm
            font-bold
            text-white
            shadow-md
            shadow-blue-500/20
            transition
            hover:bg-blue-700
            cursor-pointer
          "
        >
          + Add Project
        </button>
      </div>

      {/* Projects */}

      {resumeData.projects.length === 0 ? (
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
          <h3 className="text-lg font-semibold text-slate-900">
            No projects yet
          </h3>

          <p className="mt-2 text-slate-500">
            Add your best projects to impress recruiters.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {resumeData.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEdit(project)}
              onDelete={() =>
                handleDelete(project.id)
              }
            />
          ))}
        </div>
      )}

      {/* Modal */}

      <ProjectModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
        initialData={editingProject}
      />
    </>
  );
}