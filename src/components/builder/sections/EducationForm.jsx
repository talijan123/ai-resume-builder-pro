import { useState } from "react";

import { useResume } from "../../../context/ResumeContext";

import EducationCard from "./EducationCard";
import EducationModal from "../modals/EducationModal";

export default function EducationForm() {
  const {
    resumeData,
    addEducation,
    updateEducation,
    deleteEducation,
  } = useResume();

  const [openModal, setOpenModal] = useState(false);

  const [editingEducation, setEditingEducation] =
    useState(null);

  function handleAdd() {
    setEditingEducation(null);
    setOpenModal(true);
  }

  function handleEdit(education) {
    setEditingEducation(education);
    setOpenModal(true);
  }

  function handleSave(data) {
    if (editingEducation) {
      updateEducation(editingEducation.id, data);
    } else {
      addEducation(data);
    }

    setOpenModal(false);
  }

  return (
    <>
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Education
          </h3>

          <p className="mt-1 text-slate-500">
            Add your academic background.
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
          + Add Education
        </button>
      </div>

      {/* List */}

      <div className="mt-8 space-y-5">
        {resumeData.education.length === 0 ? (
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
            <h4 className="text-lg font-semibold">
              No education added yet
            </h4>

            <p className="mt-2 text-slate-500">
              Click "Add Education" to get started.
            </p>
          </div>
        ) : (
          resumeData.education.map((education) => (
            <EducationCard
              key={education.id}
              education={education}
              onEdit={() =>
                handleEdit(education)
              }
              onDelete={() =>
                deleteEducation(education.id)
              }
            />
          ))
        )}
      </div>

      {/* Modal */}

      <EducationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={editingEducation}
        onSave={handleSave}
      />
    </>
  );
}