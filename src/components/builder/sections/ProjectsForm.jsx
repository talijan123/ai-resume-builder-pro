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
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Projects
          </h3>

          <p className="mt-1 text-slate-500">
            Showcase your best work.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
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