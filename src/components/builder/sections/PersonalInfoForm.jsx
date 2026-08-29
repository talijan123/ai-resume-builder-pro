import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";

import { useResume } from "../../../context/ResumeContext";
import { usePricing } from "../../../context/PricingContext";
import { generateSummaries } from "../../../services/aiService";

export default function PersonalInfoForm() {
  const {
    resumeData,
    updatePersonalInfo,
  } = useResume();
  const { refreshPricing } = usePricing();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState(null);
  const [aiMessage, setAiMessage] = useState("");

  const personal = resumeData.personalInfo;

  function handleChange(e) {
    if (e.target.name === "summary") {
      setSummaryOptions(null);
      setAiMessage("");
    }

    updatePersonalInfo(
      e.target.name,
      e.target.value
    );
  }

  async function handleGenerateSummaries() {
    if (
      resumeData.experience.length === 0 &&
      resumeData.skills.length === 0
    ) {
      setAiMessage("Add experience or skills before generating summaries.");
      return;
    }

    setIsGenerating(true);
    setAiMessage("");

    try {
      const result = await generateSummaries(
        resumeData.experience,
        resumeData.skills
      );

      setSummaryOptions(result.summaries);

      try {
        await refreshPricing();
      } catch (refreshError) {
        console.error("Failed to refresh AI credits:", refreshError);
      }
    } catch (error) {
      setAiMessage(error?.message || "Unable to generate summaries.");
    } finally {
      setIsGenerating(false);
    }
  }

  function selectSummary(summary) {
    updatePersonalInfo("summary", summary);
    setSummaryOptions(null);
    setAiMessage("Summary inserted. Review it before continuing.");
  }

  return (
    <div className="space-y-8">
      {/* Heading */}

      <div>
        <h3 className="text-2xl font-black text-slate-900">
          Personal Information
        </h3>

        <p className="mt-2 text-slate-500">
          This information will appear at the top of
          your resume.
        </p>
      </div>

      {/* Form */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}

        <Input
          label="Full Name"
          name="fullName"
          value={personal.fullName}
          onChange={handleChange}
          placeholder="Talal Hassan"
        />

        {/* Job Title */}

        <Input
          label="Professional Title"
          name="jobTitle"
          value={personal.jobTitle}
          onChange={handleChange}
          placeholder="Front-End Developer"
        />

        {/* Email */}

        <Input
          label="Email"
          name="email"
          type="email"
          value={personal.email}
          onChange={handleChange}
          placeholder="talal@gmail.com"
        />

        {/* Phone */}

        <Input
          label="Phone"
          name="phone"
          value={personal.phone}
          onChange={handleChange}
          placeholder="+92 300 1234567"
        />

        {/* Location */}

        <Input
          label="Location"
          name="location"
          value={personal.location}
          onChange={handleChange}
          placeholder="Abbottabad, Pakistan"
        />

        {/* Website */}

        <Input
          label="Website"
          name="website"
          value={personal.website}
          onChange={handleChange}
          placeholder="www.bytereviewer.com"
        />

        {/* LinkedIn */}

        <Input
          label="LinkedIn"
          name="linkedin"
          value={personal.linkedin}
          onChange={handleChange}
          placeholder="linkedin.com/in/username"
        />

        {/* GitHub */}

        <Input
          label="GitHub"
          name="github"
          value={personal.github}
          onChange={handleChange}
          placeholder="github.com/talijan123"
        />

        {/* Photo URL */}

        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <label className="mb-2 block font-semibold text-slate-800">
            Profile Photo / Avatar (for Photo Templates)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 rounded-full border-2 border-slate-300 bg-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
              {personal.photo ? (
                <img
                  src={personal.photo}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-slate-400">
                  {personal.fullName ? personal.fullName.charAt(0).toUpperCase() : "?"}
                </span>
              )}
            </div>

            <div className="flex-1 w-full space-y-3">
              <input
                type="text"
                name="photo"
                value={personal.photo || ""}
                onChange={handleChange}
                placeholder="Paste Image URL (https://...)"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  transition-all
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer rounded-xl bg-white border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updatePersonalInfo("photo", reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {personal.photo && (
                  <button
                    type="button"
                    onClick={() => updatePersonalInfo("photo", "")}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gender & DOB (Optional for International CVs) */}

        <Input
          label="Gender / Pronouns (Optional)"
          name="gender"
          value={personal.gender || ""}
          onChange={handleChange}
          placeholder="e.g. Female, Male, Non-binary"
        />

        <Input
          label="Date of Birth (Optional)"
          name="dob"
          value={personal.dob || ""}
          onChange={handleChange}
          placeholder="e.g. 14 March 1994"
        />
      </div>

      {/* Summary */}

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label className="block font-semibold text-slate-700">
            Professional Summary
          </label>

          <button
            type="button"
            onClick={handleGenerateSummaries}
            disabled={isGenerating || (resumeData.experience.length === 0 && resumeData.skills.length === 0)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiSparkles />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <textarea
          name="summary"
          rows={6}
          value={personal.summary}
          onChange={handleChange}
          placeholder="Write a short professional summary..."
          className="
            w-full

            rounded-2xl

            border
            border-slate-300

            px-5
            py-4

            outline-none

            transition-all

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        {resumeData.experience.length === 0 &&
          resumeData.skills.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Add experience or skills first to generate summary options.
            </p>
          )}

        {summaryOptions && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              Choose a summary to insert:
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              {Object.entries(summaryOptions).map(([style, summary]) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => selectSummary(summary)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="mb-2 block text-sm font-bold capitalize text-blue-700">
                    {style}
                  </span>
                  <span className="block text-sm leading-6 text-slate-600">
                    {summary}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {aiMessage && (
          <p className="mt-3 text-sm text-slate-600" role="status">
            {aiMessage}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------- */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          sm:rounded-2xl
          border
          border-slate-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-950
          px-4
          sm:px-5
          py-3
          sm:py-3.5
          text-xs
          sm:text-sm
          text-slate-900
          dark:text-white
          outline-none
          transition-all
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
          dark:focus:ring-blue-900/30
        "
      />
    </div>
  );
}