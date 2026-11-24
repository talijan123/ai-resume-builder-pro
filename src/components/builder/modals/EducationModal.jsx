import { useEffect, useState } from "react";

import Modal from "../../UI/Modal/Modal";

const initialForm = {
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  currentlyStudying: false,
  grade: "",
  description: "",
};

export default function EducationModal({
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
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
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
          ? "Edit Education"
          : "Add Education"
      }
      width="max-w-3xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* School */}

        <div>
          <label className="mb-2 block font-medium">
            Institution
          </label>

          <input
            type="text"
            name="school"
            value={form.school}
            onChange={handleChange}
            placeholder="Harvard University"
            className="w-full rounded-xl border border-slate-300 p-3"
            required
          />
        </div>

        {/* Degree */}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Degree
            </label>

            <input
              type="text"
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="Bachelor of Science"
              className="w-full rounded-xl border border-slate-300 p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Field of Study
            </label>

            <input
              type="text"
              name="field"
              value={form.field}
              onChange={handleChange}
              placeholder="Computer Science"
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        {/* Dates */}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Start Date
            </label>

            <input
              type="month"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              End Date
            </label>

            <input
              type="month"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              disabled={
                form.currentlyStudying
              }
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        {/* Checkbox */}

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="currentlyStudying"
            checked={
              form.currentlyStudying
            }
            onChange={handleChange}
          />

          I currently study here
        </label>

        {/* Grade */}

        <div>
          <label className="mb-2 block font-medium">
            Grade / CGPA
          </label>

          <input
            type="text"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            placeholder="3.8 / 4.0"
            className="w-full rounded-xl border border-slate-300 p-3"
          />
        </div>

        {/* Description */}

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            rows={5}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Relevant coursework, achievements..."
            className="w-full rounded-xl border border-slate-300 p-3"
          />
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {initialData
              ? "Update Education"
              : "Save Education"}
          </button>
        </div>
      </form>
    </Modal>
  );
}