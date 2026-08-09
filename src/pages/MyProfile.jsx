import { useMemo, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext";

export default function MyProfile() {
  const {
    profileData,
    updateProfile,
    updateContact,
    resetProfile,
  } = useProfile();

  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  const {
    profile = {},
    contact = {},
  } = profileData || {};

  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

  const completion = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.professionalTitle,
      profile.location,
      profile.summary,
      contact.email,
      contact.phone,
      contact.linkedin,
      contact.github,
    ];

    const completed = fields.filter(
      (field) =>
        field &&
        String(field).trim() !== ""
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [profile, contact]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleProfileChange = (field, value) => {
    updateProfile(field, value);
    setSaved(false);
  };

  const handleContactChange = (field, value) => {
    updateContact(field, value);
    setSaved(false);
  };

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /* Only allow images */

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    /* Maximum file size: 5MB */

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateProfile("photo", reader.result);
      setSaved(false);
    };

    reader.readAsDataURL(file);
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const handleRemovePhoto = () => {
    updateProfile("photo", "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setSaved(false);
  };

  /* =========================================================
     OPEN FILE SELECTOR
  ========================================================= */

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset your profile?"
    );

    if (confirmed) {
      resetProfile();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSaved(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">

          {/* Left */}

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              ←
            </button>

            <div>
              <h1 className="text-xl font-black text-slate-900">
                My Profile
              </h1>

              <p className="hidden text-sm text-slate-500 sm:block">
                Manage your personal and professional information.
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="
                hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-bold
                text-slate-600
                transition
                hover:bg-slate-50
                sm:block
              "
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-md
                shadow-blue-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >
              {saved ? "✓ Saved" : "Save Profile"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="text-center">

                {/* =================================================
                    PROFILE PHOTO
                ================================================= */}

                <div className="relative mx-auto h-28 w-28">

                  {/* Photo / Initials */}

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-black text-white shadow-lg">

                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt={
                          profile.fullName ||
                          "Profile"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.fullName
                        ? getInitials(
                            profile.fullName
                          )
                        : "YN"
                    )}
                  </div>

                  {/* Camera Button */}

                  <button
                    type="button"
                    onClick={handleChoosePhoto}
                    title="Upload profile photo"
                    className="
                      absolute
                      bottom-0
                      right-0
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border-4
                      border-white
                      bg-blue-600
                      text-sm
                      text-white
                      shadow-md
                      transition
                      hover:bg-blue-700
                    "
                  >
                    📷
                  </button>
                </div>

                {/* Hidden File Input */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Upload Controls */}

                <div className="mt-4 flex items-center justify-center gap-2">

                  <button
                    type="button"
                    onClick={handleChoosePhoto}
                    className="
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-slate-700
                      transition
                      hover:bg-slate-50
                    "
                  >
                    {profile.photo
                      ? "Change Photo"
                      : "Upload Photo"}
                  </button>

                  {profile.photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-red-500
                        transition
                        hover:bg-red-50
                      "
                    >
                      Remove
                    </button>
                  )}
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  JPG, PNG, WEBP or GIF · Max 5MB
                </p>

                {/* Name */}

                <h2 className="mt-5 text-xl font-black text-slate-900">
                  {profile.fullName ||
                    "Your Name"}
                </h2>

                {/* Title */}

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {profile.professionalTitle ||
                    "Professional Title"}
                </p>

                {/* Location */}

                {profile.location && (
                  <p className="mt-2 text-xs text-slate-500">
                    📍 {profile.location}
                  </p>
                )}
              </div>

              {/* Completion */}

              <div className="mt-7">

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    Profile Completion
                  </span>

                  <span className="text-xs font-black text-blue-600">
                    {completion}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      transition-all
                      duration-500
                    "
                    style={{
                      width: `${completion}%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                PROFILE TIPS
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Profile Tips
              </h3>

              <div className="mt-5 space-y-4">

                <Tip
                  title="Add a professional photo"
                  text="Use a clear and professional profile photo for your resume and profile."
                />

                <Tip
                  title="Complete your profile"
                  text="A complete profile makes your resume creation faster."
                />

                <Tip
                  title="Use a professional title"
                  text="For example: Frontend Developer or Software Engineer."
                />

                <Tip
                  title="Write a strong summary"
                  text="Keep your professional summary clear and focused."
                />
              </div>
            </section>
          </aside>

          {/* =================================================
              FORM
          ================================================= */}

          <div className="space-y-8">

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                number="01"
                title="Personal Information"
                description="Basic information that identifies you."
              />

              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(value) =>
                    handleProfileChange(
                      "fullName",
                      value
                    )
                  }
                  placeholder="Talal Hassan"
                />

                <Input
                  label="Location"
                  value={profile.location}
                  onChange={(value) =>
                    handleProfileChange(
                      "location",
                      value
                    )
                  }
                  placeholder="Abbottabad, Pakistan"
                />

                <Input
                  label="Years of Experience"
                  value={
                    profile.yearsOfExperience
                  }
                  onChange={(value) =>
                    handleProfileChange(
                      "yearsOfExperience",
                      value
                    )
                  }
                  placeholder="2"
                />

                <Input
                  label="Desired Job Title"
                  value={
                    profile.desiredJobTitle
                  }
                  onChange={(value) =>
                    handleProfileChange(
                      "desiredJobTitle",
                      value
                    )
                  }
                  placeholder="Frontend Developer"
                />
              </div>
            </section>

            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                number="02"
                title="Contact Information"
                description="Add the contact details employers can use to reach you."
              />

              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="Email"
                  type="email"
                  value={contact.email}
                  onChange={(value) =>
                    handleContactChange(
                      "email",
                      value
                    )
                  }
                  placeholder="talal@example.com"
                />

                <Input
                  label="Phone"
                  value={contact.phone}
                  onChange={(value) =>
                    handleContactChange(
                      "phone",
                      value
                    )
                  }
                  placeholder="+92 300 1234567"
                />

                <Input
                  label="Website"
                  value={contact.website}
                  onChange={(value) =>
                    handleContactChange(
                      "website",
                      value
                    )
                  }
                  placeholder="https://yourwebsite.com"
                />

                <Input
                  label="LinkedIn"
                  value={contact.linkedin}
                  onChange={(value) =>
                    handleContactChange(
                      "linkedin",
                      value
                    )
                  }
                  placeholder="https://linkedin.com/in/yourname"
                />

                <Input
                  label="GitHub"
                  value={contact.github}
                  onChange={(value) =>
                    handleContactChange(
                      "github",
                      value
                    )
                  }
                  placeholder="https://github.com/username"
                />
              </div>
            </section>

            {/* =================================================
                PROFESSIONAL INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <SectionHeader
                number="03"
                title="Professional Information"
                description="Tell employers who you are and what you do."
              />

              <div className="space-y-5">

                <Input
                  label="Professional Title"
                  value={
                    profile.professionalTitle
                  }
                  onChange={(value) =>
                    handleProfileChange(
                      "professionalTitle",
                      value
                    )
                  }
                  placeholder="Frontend Developer"
                />

                <Textarea
                  label="Professional Summary"
                  value={profile.summary}
                  onChange={(value) =>
                    handleProfileChange(
                      "summary",
                      value
                    )
                  }
                  rows={7}
                  placeholder="Write a short professional summary about your experience, skills, strengths, and career goals."
                />
              </div>
            </section>

            {/* =================================================
                SAVE AREA
            ================================================= */}

            <section className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:flex-row">

              <div>
                <h3 className="font-black text-slate-900">
                  Keep your profile updated
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Your profile information can be reused when
                  creating resumes and cover letters.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="
                  shrink-0
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-md
                  shadow-blue-500/20
                  transition
                  hover:-translate-y-0.5
                  hover:bg-blue-700
                "
              >
                {saved
                  ? "✓ Profile Saved"
                  : "Save Changes"}
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  number,
  title,
  description,
}) {
  return (
    <div className="mb-7">

      <div className="flex items-center gap-3">

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
          {number}
        </span>

        <h2 className="text-lg font-black text-slate-900">
          {title}
        </h2>
      </div>

      <p className="mt-2 pl-11 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="
          h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          text-sm
          text-slate-800
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          resize-y
          rounded-xl
          border
          border-slate-200
          bg-white
          px-4
          py-3
          text-sm
          leading-6
          text-slate-800
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />
    </label>
  );
}

/* =========================================================
   TIP
========================================================= */

function Tip({ title, text }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">

      <h4 className="text-sm font-bold text-slate-800">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}