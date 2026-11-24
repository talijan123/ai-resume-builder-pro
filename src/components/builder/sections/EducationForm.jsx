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
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {resumeData.education.length} {resumeData.education.length === 1 ? "School/Degree" : "Schools/Degrees"} Added
        </p>

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