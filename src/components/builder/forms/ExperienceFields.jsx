import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";

import { usePricing } from "../../../context/PricingContext";
import { improveBulletPoint } from "../../../services/aiService";

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
    description: initialData.description || "",
  });
  const [bullets, setBullets] = useState(() =>
    (initialData.description || "").split(/\r?\n/)
  );
  const [improvingBullet, setImprovingBullet] =
    useState(null);
  const [aiMessage, setAiMessage] =
    useState("");
  const { refreshPricing } = usePricing();

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

    onSubmit({
      ...formData,
      description: bullets
        .map((bullet) => bullet.trim())
        .filter(Boolean)
        .join("\n"),
    });
  }

  function updateBullet(index, value) {
    setBullets((previous) =>
      previous.map((bullet, bulletIndex) =>
        bulletIndex === index ? value : bullet
      )
    );
    setAiMessage("");
  }

  async function handleImproveBullet(index) {
    const bullet = bullets[index].trim();

    if (!bullet) {
      setAiMessage("Enter a bullet point before improving it.");
      return;
    }

    setImprovingBullet(index);
    setAiMessage("");

    try {
      const result = await improveBulletPoint(bullet);

      setBullets((previous) =>
        previous.map((currentBullet, bulletIndex) =>
          bulletIndex === index
            ? result.rewrittenBullet
            : currentBullet
        )
      );

      setAiMessage("Bullet improved. Review it before saving.");

      try {
        await refreshPricing();
      } catch (refreshError) {
        console.error(
          "Failed to refresh AI credits:",
          refreshError
        );
      }
    } catch (error) {
      setAiMessage(
        error?.message ||
          "Unable to improve this bullet point."
      );
    } finally {
      setImprovingBullet(null);
    }
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

        <div className="space-y-3">
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="flex items-start gap-2"
            >
              <textarea
                rows={2}
                value={bullet}
                onChange={(event) =>
                  updateBullet(index, event.target.value)
                }
                placeholder="Describe one responsibility or achievement..."
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => handleImproveBullet(index)}
                disabled={improvingBullet !== null}
                title="Enhance with AI"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiSparkles size={16} />
                {improvingBullet === index
                  ? "Improving..."
                  : "Enhance with AI"}
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setBullets((previous) => [...previous, ""])}
          className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          + Add bullet
        </button>

        {aiMessage && (
          <p className="mt-2 text-sm text-slate-600">
            {aiMessage}
          </p>
        )}
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