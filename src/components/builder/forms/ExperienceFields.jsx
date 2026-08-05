import { useState } from "react";

export default function ExperienceFields({
  initialData = {},
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    company: initialData.company || "",
    jobTitle: initialData.jobTitle || "",
    employmentType:
      initialData.employmentType || "",
    location: initialData.location || "",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    currentlyWorking:
      initialData.currentlyWorking || false,
    description:
      initialData.description || "",
  });

  function handleChange(e) {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Company */}

      <div>
        <label className="mb-2 block font-medium">
          Company
        </label>

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Google"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Job Title */}

      <div>
        <label className="mb-2 block font-medium">
          Job Title
        </label>

        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="Frontend Developer"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Employment Type */}

      <div>
        <label className="mb-2 block font-medium">
          Employment Type
        </label>

        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">
            Select
          </option>

          <option>
            Full Time
          </option>

          <option>
            Part Time
          </option>

          <option>
            Internship
          </option>

          <option>
            Freelance
          </option>

          <option>
            Contract
          </option>
        </select>
      </div>

      {/* Location */}

      <div>
        <label className="mb-2 block font-medium">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Abbottabad"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Dates */}

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block font-medium">
            Start Date
          </label>

          <input
            type="month"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            End Date
          </label>

          <input
            type="month"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            disabled={
              formData.currentlyWorking
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>
      </div>

      {/* Checkbox */}

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="currentlyWorking"
          checked={
            formData.currentlyWorking
          }
          onChange={handleChange}
        />

        I currently work here
      </label>

      {/* Description */}

      <div>
        <label className="mb-2 block font-medium">
          Job Description
        </label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your responsibilities..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-6 py-3"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Save Experience
        </button>
      </div>
    </form>
  );
}