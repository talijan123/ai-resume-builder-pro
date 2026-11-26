import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HiPlus, HiTrash, HiXMark } from "react-icons/hi2";

import { useProfile } from "../context/ProfileContext";

import DashboardHeader from "../components/layout/DashboardHeader";

/* =========================================================
   MY PROFILE
========================================================= */

export default function MyProfile() {
  const {
    profileData,
    loading,
    saving,
    error,
    saveProfile,
    updateProfile,
    updateContact,
    resetProfile,
    uploadProfilePhoto,
    removeProfilePhoto,
    addSkill,
    removeSkill,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
  } = useProfile();

  const [saved, setSaved] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");

  const [photoPreview, setPhotoPreview] = useState("");

  const [photoLoading, setPhotoLoading] =
    useState(false);

  const fileInputRef = useRef(null);

  /* =======================================================
     PROFILE DATA
  ======================================================= */

  const profile =
    profileData?.profile || {};

  const contact =
    profileData?.contact || {};

  const skills =
    profileData?.skills || [];

  const education =
    profileData?.education || [];

  const experience =
    profileData?.experience || [];

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (newSkillInput.trim()) {
      addSkill(newSkillInput.trim());
      setNewSkillInput("");
      setSaved(false);
    }
  };

  const handleRemoveSkill = (skill) => {
    removeSkill(skill);
    setSaved(false);
  };

  const handleAddExp = () => {
    addExperience({
      company: "",
      position: "",
      location: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    });
    setSaved(false);
  };

  const handleAddEdu = () => {
    addEducation({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      description: "",
    });
    setSaved(false);
  };

  /* =======================================================
     SYNC PHOTO WITH PROFILE CONTEXT
  ======================================================= */

  useEffect(() => {
    setPhotoPreview(
      profile?.photo || ""
    );
  }, [profile?.photo]);

  /* =======================================================
     PROFILE COMPLETION
  ======================================================= */

  const completion = useMemo(() => {
    /*
      These are the main fields used to calculate
      profile completion.

      Each filled field contributes equally.
    */

    const fields = [
      profile?.fullName,
      profile?.professionalTitle,
      profile?.location,
      profile?.summary,
      profile?.yearsOfExperience,
      profile?.desiredJobTitle,

      contact?.email,
      contact?.phone,
      contact?.website,
      contact?.linkedin,
      contact?.github,

      skills?.length > 0 ? "has_skills" : "",
      experience?.length > 0 ? "has_experience" : "",
      education?.length > 0 ? "has_education" : "",
    ];

    const completed = fields.filter(
      (field) =>
        field !== null &&
        field !== undefined &&
        String(field).trim() !== ""
    ).length;

    if (fields.length === 0) {
      return 0;
    }

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [profile, contact, skills, education, experience]);

  /* =======================================================
     PROFILE CHANGE
  ======================================================= */

  const handleProfileChange = (
    field,
    value
  ) => {
    updateProfile(field, value);

    setSaved(false);
  };

  /* =======================================================
     CONTACT CHANGE
  ======================================================= */

  const handleContactChange = (
    field,
    value
  ) => {
    updateContact(field, value);

    setSaved(false);
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const handleSave = async () => {
    setSaved(false);

    const result = await saveProfile();

    if (result?.success) {
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    }
  };

  /* =======================================================
     PHOTO UPLOAD
  ======================================================= */

  const handlePhotoUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSaved(false);
    setPhotoLoading(true);

    try {
      /*
        The actual upload is handled by
        ProfileContext.

        It uploads the image to:
        profile-photos/{userId}/profile.ext

        Then stores the public URL inside:
        profiles.photo_url
      */

      const result =
        await uploadProfilePhoto(file);

      if (!result?.success) {
        return;
      }

      /*
        ProfileContext already updates
        profileData.profile.photo.
      */

      setPhotoPreview(
        result.url || ""
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (uploadError) {
      console.error(
        "Profile photo upload failed:",
        uploadError
      );
    } finally {
      setPhotoLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* =======================================================
     REMOVE PHOTO
  ======================================================= */

  const handleRemovePhoto = async () => {
    setSaved(false);
    setPhotoLoading(true);

    try {
      const result =
        await removeProfilePhoto();

      if (!result?.success) {
        return;
      }

      setPhotoPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (removeError) {
      console.error(
        "Profile photo removal failed:",
        removeError
      );
    } finally {
      setPhotoLoading(false);
    }
  };

  /* =======================================================
     RESET PROFILE
  ======================================================= */

  const handleReset = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to reset your profile? This will remove your saved profile information."
      );

    if (!confirmed) {
      return;
    }

    setSaved(false);

    const result =
      await resetProfile();

    if (result?.success) {
      setPhotoPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    }
  };

  /* =======================================================
     HEADER ACTIONS
  ======================================================= */

  const headerActions = (
    <div className="flex items-center gap-3">
      {/* RESET */}

      <button
        type="button"
        onClick={handleReset}
        disabled={saving || loading}
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
          hover:text-slate-900
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:block
        "
      >
        Reset
      </button>

      {/* SAVE */}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || loading}
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
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {saving
          ? "Saving..."
          : saved
          ? "✓ Saved"
          : "Save Profile"}
      </button>
    </div>
  );

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader
          title="My Profile"
          subtitle="Manage your personal and professional information."
        />

        <main
          className="
            mx-auto
            max-w-[1400px]
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              flex
              min-h-[500px]
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-slate-200
                  border-t-blue-600
                "
              />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading your profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <DashboardHeader
        title="My Profile"
        subtitle="Manage your personal and professional information."
        rightContent={headerActions}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto
          max-w-[1400px]
          px-4
          py-6
          sm:px-6
          sm:py-8
          lg:px-8
        "
      >
        <div
          className="
            grid
            gap-8
            lg:grid-cols-[320px_minmax(0,1fr)]
          "
        >
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="space-y-6">
            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="text-center">
                {/* PHOTO */}

                <div
                  className="
                    relative
                    mx-auto
                    h-28
                    w-28
                  "
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="
                        h-28
                        w-28
                        rounded-full
                        object-cover
                        shadow-lg
                        ring-4
                        ring-white
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-28
                        w-28
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-blue-600
                        to-indigo-600
                        text-3xl
                        font-black
                        text-white
                        shadow-lg
                      "
                    >
                      {profile.fullName
                        ? getInitials(
                            profile.fullName
                          )
                        : "YN"}
                    </div>
                  )}
                </div>

                {/* NAME */}

                <h2
                  className="
                    mt-5
                    text-xl
                    font-black
                    text-slate-900
                  "
                >
                  {profile.fullName ||
                    "Your Name"}
                </h2>

                {/* TITLE */}

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-blue-600
                  "
                >
                  {profile.professionalTitle ||
                    "Professional Title"}
                </p>

                {/* LOCATION */}

                {profile.location && (
                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-500
                    "
                  >
                    📍 {profile.location}
                  </p>
                )}
              </div>

              {/* COMPLETION */}

              <div className="mt-7">
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-600
                    "
                  >
                    Profile Completion
                  </span>

                  <span
                    className="
                      text-xs
                      font-black
                      text-blue-600
                    "
                  >
                    {completion}%
                  </span>
                </div>

                <div
                  className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                  "
                >
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

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {completion === 100
                    ? "Your profile is complete."
                    : "Complete more information to improve your profile."}
                </p>
              </div>
            </section>

            {/* =================================================
                PROFILE TIPS
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <h3
                className="
                  text-sm
                  font-black
                  uppercase
                  tracking-widest
                  text-slate-900
                "
              >
                Profile Tips
              </h3>

              <div className="mt-5 space-y-4">
                <Tip
                  title="Add a professional photo"
                  text="Use a clear and professional profile photo."
                />

                <Tip
                  title="Complete your profile"
                  text="A complete profile makes resume creation much faster."
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
                ERROR
            ================================================= */}

            {error && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50
                  px-5
                  py-4
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {saved && (
              <div
                className="
                  rounded-2xl
                  border
                  border-green-100
                  bg-green-50
                  px-5
                  py-4
                  text-sm
                  font-medium
                  text-green-700
                "
              >
                ✓ Your profile has been saved successfully.
              </div>
            )}

            {/* =================================================
                PHOTO
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <SectionHeader
                number="01"
                title="Profile Photo"
                description="Upload a professional photo for your profile."
              />

              <div
                className="
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* PHOTO */}

                <div className="shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="
                        h-28
                        w-28
                        rounded-2xl
                        object-cover
                        ring-1
                        ring-slate-200
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-28
                        w-28
                        items-center
                        justify-center
                        rounded-2xl
                        bg-slate-100
                        text-3xl
                        font-black
                        text-slate-400
                      "
                    >
                      👤
                    </div>
                  )}
                </div>

                {/* UPLOAD */}

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={photoLoading}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-blue-700
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {photoLoading
                      ? "Uploading..."
                      : "Upload Image"}
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      disabled={photoLoading}
                      onClick={
                        handleRemovePhoto
                      }
                      className="
                        ml-3
                        rounded-xl
                        border
                        border-red-200
                        bg-white
                        px-5
                        py-2.5
                        text-sm
                        font-bold
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      Remove
                    </button>
                  )}

                  <p
                    className="
                      mt-3
                      text-xs
                      text-slate-400
                    "
                  >
                    JPG, PNG or WebP. Maximum size: 5MB.
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <SectionHeader
                number="02"
                title="Personal Information"
                description="Basic information that identifies you."
              />

              <div
                className="
                  grid
                  gap-5
                  md:grid-cols-2
                "
              >
                <Input
                  label="Full Name"
                  value={
                    profile.fullName
                  }
                  onChange={(value) =>
                    handleProfileChange(
                      "fullName",
                      value
                    )
                  }
                />

                <Input
                  label="Location"
                  value={
                    profile.location
                  }
                  onChange={(value) =>
                    handleProfileChange(
                      "location",
                      value
                    )
                  }
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
                />
              </div>
            </section>

            {/* =================================================
                CONTACT
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <SectionHeader
                number="03"
                title="Contact Information"
                description="Add the contact details employers can use."
              />

              <div
                className="
                  grid
                  gap-5
                  md:grid-cols-2
                "
              >
                <Input
                  label="Email"
                  type="email"
                  value={
                    contact.email
                  }
                  onChange={(value) =>
                    handleContactChange(
                      "email",
                      value
                    )
                  }
                />

                <Input
                  label="Phone"
                  value={
                    contact.phone
                  }
                  onChange={(value) =>
                    handleContactChange(
                      "phone",
                      value
                    )
                  }
                />

                <Input
                  label="Website"
                  value={
                    contact.website
                  }
                  onChange={(value) =>
                    handleContactChange(
                      "website",
                      value
                    )
                  }
                />

                <Input
                  label="LinkedIn"
                  value={
                    contact.linkedin
                  }
                  onChange={(value) =>
                    handleContactChange(
                      "linkedin",
                      value
                    )
                  }
                />

                <Input
                  label="GitHub"
                  value={
                    contact.github
                  }
                  onChange={(value) =>
                    handleContactChange(
                      "github",
                      value
                    )
                  }
                />
              </div>
            </section>

            {/* =================================================
                PROFESSIONAL
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <SectionHeader
                number="04"
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
                />

                <Textarea
                  label="Professional Summary"
                  value={
                    profile.summary
                  }
                  onChange={(value) =>
                    handleProfileChange(
                      "summary",
                      value
                    )
                  }
                  rows={7}
                />
              </div>
            </section>

            {/* =================================================
                SKILLS
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <SectionHeader
                number="05"
                title="Skills & Proficiencies"
                description="Add technical, professional, and domain skills to reuse across your resumes."
              />

              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. React, TypeScript, Product Strategy, PostgreSQL"
                    className="
                      h-11
                      flex-1
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
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-blue-700
                      cursor-pointer
                    "
                  >
                    <HiPlus size={16} />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="pt-2">
                  {skills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      No skills added yet. Type a skill name above and click Add Skill.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => {
                        const skillLabel = typeof skill === "string" ? skill : skill?.name || skill?.skill || "";
                        return (
                          <div
                            key={index}
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              px-3.5
                              py-2
                              text-xs
                              font-bold
                              text-slate-800
                              shadow-xs
                            "
                          >
                            <span>{skillLabel}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skillLabel)}
                              className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                              title="Remove skill"
                            >
                              <HiXMark size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                WORK EXPERIENCE
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="flex items-center justify-between mb-2">
                <SectionHeader
                  number="06"
                  title="Work Experience"
                  description="Add past and current professional roles that can be auto-filled into your resumes."
                />
                <button
                  type="button"
                  onClick={handleAddExp}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-blue-600
                    hover:bg-blue-100
                    transition
                    cursor-pointer
                    shrink-0
                  "
                >
                  <HiPlus size={15} />
                  <span>Add Position</span>
                </button>
              </div>

              {experience.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-xs text-slate-400 italic mb-3">
                    No work experience added yet to your profile.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddExp}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-blue-600
                      px-4
                      py-2
                      text-xs
                      font-bold
                      text-white
                      hover:bg-blue-700
                      transition
                      cursor-pointer
                    "
                  >
                    <HiPlus size={14} />
                    <span>Add First Position</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/60
                        p-5
                        space-y-4
                        relative
                      "
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Position #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            removeExperience(exp.id);
                            setSaved(false);
                          }}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition cursor-pointer"
                        >
                          <HiTrash size={14} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Job Title / Position"
                          value={exp.position || exp.jobTitle || ""}
                          onChange={(val) => {
                            updateExperience(exp.id, "position", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Company Name"
                          value={exp.company || ""}
                          onChange={(val) => {
                            updateExperience(exp.id, "company", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Location"
                          value={exp.location || ""}
                          onChange={(val) => {
                            updateExperience(exp.id, "location", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Employment Type"
                          value={exp.employmentType || "Full-time"}
                          onChange={(val) => {
                            updateExperience(exp.id, "employmentType", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Start Date"
                          value={exp.startDate || ""}
                          onChange={(val) => {
                            updateExperience(exp.id, "startDate", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="End Date"
                          value={exp.endDate || ""}
                          onChange={(val) => {
                            updateExperience(exp.id, "endDate", val);
                            setSaved(false);
                          }}
                        />
                      </div>

                      <Textarea
                        label="Description & Key Achievements"
                        value={exp.description || ""}
                        onChange={(val) => {
                          updateExperience(exp.id, "description", val);
                          setSaved(false);
                        }}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                EDUCATION
            ================================================= */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="flex items-center justify-between mb-2">
                <SectionHeader
                  number="07"
                  title="Education"
                  description="Add your academic credentials, degrees, and institutions."
                />
                <button
                  type="button"
                  onClick={handleAddEdu}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-blue-600
                    hover:bg-blue-100
                    transition
                    cursor-pointer
                    shrink-0
                  "
                >
                  <HiPlus size={15} />
                  <span>Add Degree</span>
                </button>
              </div>

              {education.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-xs text-slate-400 italic mb-3">
                    No education credentials added yet to your profile.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddEdu}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-blue-600
                      px-4
                      py-2
                      text-xs
                      font-bold
                      text-white
                      hover:bg-blue-700
                      transition
                      cursor-pointer
                    "
                  >
                    <HiPlus size={14} />
                    <span>Add First Degree</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/60
                        p-5
                        space-y-4
                        relative
                      "
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Education #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            removeEducation(edu.id);
                            setSaved(false);
                          }}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition cursor-pointer"
                        >
                          <HiTrash size={14} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Institution / University Name"
                          value={edu.institution || edu.school || ""}
                          onChange={(val) => {
                            updateEducation(edu.id, "institution", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Degree"
                          value={edu.degree || ""}
                          onChange={(val) => {
                            updateEducation(edu.id, "degree", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Field of Study / Major"
                          value={edu.fieldOfStudy || edu.field || ""}
                          onChange={(val) => {
                            updateEducation(edu.id, "fieldOfStudy", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Location"
                          value={edu.location || ""}
                          onChange={(val) => {
                            updateEducation(edu.id, "location", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="Start Date"
                          value={edu.startDate || ""}
                          onChange={(val) => {
                            updateEducation(edu.id, "startDate", val);
                            setSaved(false);
                          }}
                        />
                        <Input
                          label="End Date"
                          value={edu.endDate || ""}
                          onChange={(val) => {
                            updateEducation(edu.id, "endDate", val);
                            setSaved(false);
                          }}
                        />
                      </div>

                      <Textarea
                        label="Description & Highlights"
                        value={edu.description || ""}
                        onChange={(val) => {
                          updateEducation(edu.id, "description", val);
                          setSaved(false);
                        }}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                SAVE
            ================================================= */}

            <section
              className="
                flex
                flex-col
                items-center
                justify-between
                gap-4
                rounded-3xl
                border
                border-blue-100
                bg-blue-50
                p-6
                sm:flex-row
              "
            >
              <div>
                <h3
                  className="
                    font-black
                    text-slate-900
                  "
                >
                  Keep your profile updated
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-600
                  "
                >
                  Your profile information can be
                  reused when creating resumes and
                  cover letters.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving
                  ? "Saving..."
                  : saved
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
        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-blue-600
            text-xs
            font-black
            text-white
          "
        >
          {number}
        </span>

        <h2
          className="
            text-lg
            font-black
            text-slate-900
          "
        >
          {title}
        </h2>
      </div>

      <p
        className="
          mt-2
          pl-11
          text-sm
          text-slate-500
        "
      >
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
  type = "text",
}) {
  return (
    <label className="block">
      <span
        className="
          mb-1.5
          block
          text-sm
          font-bold
          text-slate-700
        "
      >
        {label}
      </span>

      <input
        type={type}
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
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
  rows = 5,
}) {
  return (
    <label className="block">
      <span
        className="
          mb-1.5
          block
          text-sm
          font-bold
          text-slate-700
        "
      >
        {label}
      </span>

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
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

function Tip({
  title,
  text,
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-slate-50
        p-4
      "
    >
      <h4
        className="
          text-sm
          font-bold
          text-slate-800
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-1
          text-xs
          leading-5
          text-slate-500
        "
      >
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   GET INITIALS
========================================================= */

function getInitials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}