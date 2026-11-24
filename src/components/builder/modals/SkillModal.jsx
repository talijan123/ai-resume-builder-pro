import { useEffect, useState } from "react";

import Modal from "../../UI/Modal/Modal";

const initialForm = {
  name: "",
  level: "Intermediate",
};

export default function SkillModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialForm);
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave(form);

    setForm(initialForm);
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={
        initialData
          ? "Edit Skill"
          : "Add Skill"
      }
      width="max-w-xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Skill Name */}

        <div>
          <label className="mb-2 block font-medium">
            Skill Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="React"
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
              outline-none
              transition
              focus:border-blue-500
            "
            required
          />
        </div>

        {/* Skill Level */}

        <div>
          <label className="mb-2 block font-medium">
            Skill Level
          </label>

          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
              outline-none
              transition
              focus:border-blue-500
            "
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-slate-300
              px-6
              py-3
              font-medium
              transition
              hover:bg-slate-100
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            {initialData
              ? "Update Skill"
              : "Save Skill"}
          </button>
        </div>
      </form>
    </Modal>
  );
}