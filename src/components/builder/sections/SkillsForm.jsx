import { useState } from "react";

import { useResume } from "../../../context/ResumeContext";

import SkillCard from "./SkillCard";
import SkillModal from "../modals/SkillModal";

export default function SkillsForm() {
  const {
    resumeData,
    addSkill,
    updateSkill,
    deleteSkill,
  } = useResume();

  const [openModal, setOpenModal] =
    useState(false);

  const [editingSkill, setEditingSkill] =
    useState(null);

  function handleAdd() {
    setEditingSkill(null);
    setOpenModal(true);
  }

  function handleEdit(skill) {
    setEditingSkill(skill);
    setOpenModal(true);
  }

  function handleSave(data) {
    if (editingSkill) {
      updateSkill(editingSkill.id, data);
    } else {
      addSkill(data);
    }

    setOpenModal(false);
  }

  return (
    <>
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Skills
          </h3>

          <p className="mt-1 text-slate-500">
            Add your technical and professional
            skills.
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
          + Add Skill
        </button>
      </div>

      {/* Skills List */}

      <div className="mt-8 space-y-5">
        {resumeData.skills.length === 0 ? (
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
              No skills added yet
            </h4>

            <p className="mt-2 text-slate-500">
              Click "Add Skill" to get started.
            </p>
          </div>
        ) : (
          resumeData.skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() =>
                handleEdit(skill)
              }
              onDelete={() =>
                deleteSkill(skill.id)
              }
            />
          ))
        )}
      </div>

      {/* Modal */}

      <SkillModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        initialData={editingSkill}
        onSave={handleSave}
      />
    </>
  );
}