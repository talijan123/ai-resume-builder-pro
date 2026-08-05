import { useResume } from "../../../context/ResumeContext";

export default function PersonalInfoForm() {
  const {
    resumeData,
    updatePersonalInfo,
  } = useResume();

  const personal = resumeData.personalInfo;

  function handleChange(e) {
    updatePersonalInfo(
      e.target.name,
      e.target.value
    );
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
      </div>

      {/* Summary */}

      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Professional Summary
        </label>

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
      <label className="mb-2 block font-semibold text-slate-700">
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
    </div>
  );
}