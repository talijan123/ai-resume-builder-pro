import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  HiCheck,
  HiChevronDown,
  HiDocumentText,
  HiLockClosed,
  HiPencilSquare,
  HiPrinter,
  HiSparkles,
  HiStar,
} from "react-icons/hi2";

import DashboardHeader from "../components/layout/DashboardHeader";

import { usePricing } from "../context/PricingContext";

import { useProfile } from "../context/ProfileContext";

/* =========================================================
   COVER LETTER TEMPLATES
========================================================= */

const COVER_LETTER_TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    description:
      "Clean and traditional cover letter for corporate applications.",
  },

  {
    id: "modern",
    name: "Modern",
    description:
      "Contemporary layout with a strong professional tone.",
  },

  {
    id: "minimal",
    name: "Minimal",
    description:
      "Simple and elegant cover letter focused on content.",
  },
];

/* =========================================================
   DEFAULT COVER LETTER
========================================================= */

const defaultLetter = {
  recipientName: "",
  companyName: "",
  jobTitle: "",
  jobDescription: "",
  subject: "",
  greeting: "Dear Hiring Manager,",
  opening: "",
  body: "",
  closing:
    "Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience can contribute to your team.",
  signOff: "Sincerely,",
};

/* =========================================================
   COVER LETTER PAGE
========================================================= */

export default function CoverLetter() {
  /* =======================================================
     PRICING
  ======================================================= */

  const {
    planSlug,
    planName,
    canUseCoverLetters,
    loading: pricingLoading,
  } = usePricing();

  /* =======================================================
     PROFILE
  ======================================================= */

  const {
    profileData,
    loading: profileLoading,
  } = useProfile();

  /* =======================================================
     PROFILE DATA
  ======================================================= */

  const profile =
    profileData?.profile || {};

  const contact =
    profileData?.contact || {};

  /* =======================================================
     PLAN ACCESS
  ======================================================= */

  const hasAccess =
    planSlug === "pro" ||
    planSlug === "team";

  /*
    We intentionally use the explicit Pro/Team check.

    This prevents a Starter user from getting access simply
    because the database contains an incorrect cover_letters
    value.
  */

  const isStarter =
    planSlug === "starter" ||
    !planSlug;

  /* =======================================================
     STATE
  ======================================================= */

  const [selectedTemplate, setSelectedTemplate] =
    useState("professional");

  const [letter, setLetter] =
    useState(defaultLetter);

  const [saved, setSaved] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [templateOpen, setTemplateOpen] =
    useState(false);

  const [showJobDescription, setShowJobDescription] =
    useState(false);

  /* =======================================================
     LOAD SAVED LETTER
  ======================================================= */

  useEffect(() => {
    if (!hasAccess) {
      return;
    }

    try {
      const savedLetter =
        localStorage.getItem(
          "cover_letter_data"
        );

      const savedTemplate =
        localStorage.getItem(
          "cover_letter_template"
        );

      if (savedLetter) {
        const parsed =
          JSON.parse(savedLetter);

        setLetter({
          ...defaultLetter,
          ...parsed,
        });
      }

      if (savedTemplate) {
        setSelectedTemplate(
          savedTemplate
        );
      }
    } catch (error) {
      console.error(
        "Failed to load saved cover letter:",
        error
      );
    }
  }, [hasAccess]);

  /* =======================================================
     AUTO PROFILE INFORMATION
  ======================================================= */

  useEffect(() => {
    if (!hasAccess) {
      return;
    }

    setLetter((previous) => {
      const hasExistingOpening =
        Boolean(
          previous.opening?.trim()
        );

      const hasExistingBody =
        Boolean(
          previous.body?.trim()
        );

      return {
        ...previous,

        opening:
          hasExistingOpening
            ? previous.opening
            : buildOpening(profile),

        body:
          hasExistingBody
            ? previous.body
            : buildBody(profile),
      };
    });
  }, [
    hasAccess,
    profile,
  ]);

  /* =======================================================
     BUILD OPENING
  ======================================================= */

  function buildOpening(currentProfile) {
    const name =
      currentProfile?.fullName ||
      "I am";

    const title =
      currentProfile?.professionalTitle ||
      currentProfile?.desiredJobTitle ||
      "professional";

    return `I am excited to apply for the ${letter.jobTitle || "position"} at ${letter.companyName || "your company"}. As ${name}, a ${title}, I believe my technical skills, experience, and commitment to continuous learning would allow me to contribute effectively to your team.`;
  }

  /* =======================================================
     BUILD BODY
  ======================================================= */

  function buildBody(currentProfile) {
    const summary =
      currentProfile?.summary;

    const experience =
      currentProfile?.yearsOfExperience;

    if (summary) {
      return summary;
    }

    if (experience) {
      return `With ${experience} years of experience, I have developed a strong foundation in problem solving, technology, and professional development. I am comfortable learning new tools, working collaboratively, and taking responsibility for delivering high-quality results.`;
    }

    return "Throughout my academic and professional journey, I have developed strong problem-solving abilities, technical skills, and a commitment to learning. I am eager to bring these strengths to your organization and contribute positively to your team.";
  }

  /* =======================================================
     SELECTED TEMPLATE
  ======================================================= */

  const currentTemplate =
    useMemo(() => {
      return (
        COVER_LETTER_TEMPLATES.find(
          (template) =>
            template.id ===
            selectedTemplate
        ) ||
        COVER_LETTER_TEMPLATES[0]
      );
    }, [selectedTemplate]);

  /* =======================================================
     UPDATE LETTER
  ======================================================= */

  const updateLetter = (
    field,
    value
  ) => {
    setLetter((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  /* =======================================================
     SAVE LETTER
  ======================================================= */

  const handleSave = async () => {
    setSaving(true);

    try {
      localStorage.setItem(
        "cover_letter_data",
        JSON.stringify(letter)
      );

      localStorage.setItem(
        "cover_letter_template",
        selectedTemplate
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save cover letter:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     RESET LETTER
  ======================================================= */

  const handleReset = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to start a new cover letter?"
      );

    if (!confirmed) {
      return;
    }

    setLetter({
      ...defaultLetter,
      opening: buildOpening(profile),
      body: buildBody(profile),
    });

    setSelectedTemplate(
      "professional"
    );

    setSaved(false);
  };

  /* =======================================================
     DOWNLOAD TXT
  ======================================================= */

  const handleDownload = () => {
    const fullText =
      buildPlainText(
        letter,
        profile,
        contact
      );

    const blob =
      new Blob(
        [fullText],
        {
          type: "text/plain;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${sanitizeFilename(
        letter.jobTitle ||
          "cover-letter"
      )}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     PRINT / PDF
  ======================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    pricingLoading ||
    profileLoading
  ) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader
          title="Cover Letter"
          subtitle="Create a professional cover letter for your next application."
        />

        <main className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading cover letter builder...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =======================================================
     LOCK SCREEN
  ======================================================= */

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader
          title="Cover Letter"
          subtitle="Create a professional cover letter for your next application."
        />

        <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[1200px] items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            {/* ICON */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20">
              <HiLockClosed size={34} />
            </div>

            {/* BADGE */}

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-700">
              <HiSparkles size={14} />
              Pro Feature
            </div>

            {/* TITLE */}

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Cover letters are available on Pro & Team
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Your current plan is{" "}
              <span className="font-bold text-slate-700">
                {planName || "Starter"}
              </span>
              . Upgrade your plan to unlock the
              cover letter builder, professional
              templates, editing tools, and downloads.
            </p>

            {/* FEATURES */}

            <div className="mx-auto mt-8 max-w-md space-y-3 text-left">

              <LockedFeature text="Professional cover letter templates" />

              <LockedFeature text="Profile-powered cover letter content" />

              <LockedFeature text="Live cover letter editor and preview" />

              <LockedFeature text="Download and print your cover letters" />

            </div>

            {/* BUTTON */}

            <button
              type="button"
              onClick={() =>
                window.location.href =
                  "/checkout"
              }
              className="
                mt-9
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-2xl

                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                px-7
                py-3.5

                text-sm
                font-black
                text-white

                shadow-lg
                shadow-blue-500/20

                transition

                hover:-translate-y-0.5
                hover:shadow-xl

                active:scale-[0.98]
              "
            >
              <HiSparkles size={18} />

              Upgrade to Pro
            </button>

            {/* CURRENT PLAN */}

            <p className="mt-5 text-xs font-semibold text-slate-400">
              Pro and Team plans include cover letter access.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =======================================================
     MAIN COVER LETTER BUILDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================
          HEADER
      =================================================== */}

      <DashboardHeader
        title="Cover Letter"
        subtitle="Create a professional cover letter for your next application."
        rightContent={
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleReset}
              className="
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
              "
            >
              New Letter
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="
                inline-flex
                items-center
                gap-2

                rounded-xl

                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                px-5
                py-2.5

                text-sm
                font-black
                text-white

                shadow-md
                shadow-blue-500/20

                transition

                hover:-translate-y-0.5
                hover:shadow-lg

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <HiCheck size={17} />

              {saving
                ? "Saving..."
                : saved
                  ? "Saved"
                  : "Save"}
            </button>

          </div>
        }
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">

          {/* =================================================
              EDITOR SIDEBAR
          ================================================= */}

          <aside className="space-y-5">

            {/* =================================================
                TEMPLATE SELECTOR
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                    Step 01
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Choose Template
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Select a professional design for your cover letter.
                  </p>
                </div>

                <HiDocumentText
                  size={22}
                  className="text-slate-400"
                />

              </div>

              {/* TEMPLATE BUTTON */}

              <div className="relative mt-5">

                <button
                  type="button"
                  onClick={() =>
                    setTemplateOpen(
                      (previous) =>
                        !previous
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between

                    rounded-2xl

                    border
                    border-slate-200

                    bg-slate-50

                    px-4
                    py-3.5

                    text-left

                    transition

                    hover:border-blue-200
                    hover:bg-blue-50
                  "
                >
                  <div>

                    <p className="text-sm font-black text-slate-900">
                      {currentTemplate.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {currentTemplate.description}
                    </p>

                  </div>

                  <HiChevronDown
                    size={18}
                    className={`text-slate-400 transition ${
                      templateOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {templateOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">

                    {COVER_LETTER_TEMPLATES.map(
                      (template) => (
                        <button
                          key={
                            template.id
                          }
                          type="button"
                          onClick={() => {
                            setSelectedTemplate(
                              template.id
                            );

                            setTemplateOpen(
                              false
                            );

                            setSaved(
                              false
                            );
                          }}
                          className="
                            flex
                            w-full
                            items-start
                            gap-3

                            rounded-xl

                            px-3
                            py-3

                            text-left

                            transition

                            hover:bg-slate-50
                          "
                        >
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                              selectedTemplate ===
                              template.id
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {selectedTemplate ===
                              template.id && (
                              <HiCheck
                                size={14}
                              />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {
                                template.name
                              }
                            </p>

                            <p className="mt-0.5 text-xs leading-5 text-slate-500">
                              {
                                template.description
                              }
                            </p>
                          </div>
                        </button>
                      )
                    )}

                  </div>
                )}

              </div>

            </section>

            {/* =================================================
                JOB INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <EditorSectionHeader
                number="02"
                title="Job Information"
                description="Add the position and company information."
              />

              <div className="space-y-4">

                <Field
                  label="Job Title"
                  value={
                    letter.jobTitle
                  }
                  onChange={(value) =>
                    updateLetter(
                      "jobTitle",
                      value
                    )
                  }
                />

                <Field
                  label="Company Name"
                  value={
                    letter.companyName
                  }
                  onChange={(value) =>
                    updateLetter(
                      "companyName",
                      value
                    )
                  }
                />

                <Field
                  label="Recipient Name"
                  value={
                    letter.recipientName
                  }
                  onChange={(value) =>
                    updateLetter(
                      "recipientName",
                      value
                    )
                  }
                />

                <Field
                  label="Subject"
                  value={
                    letter.subject
                  }
                  onChange={(value) =>
                    updateLetter(
                      "subject",
                      value
                    )
                  }
                />

                <Field
                  label="Greeting"
                  value={
                    letter.greeting
                  }
                  onChange={(value) =>
                    updateLetter(
                      "greeting",
                      value
                    )
                  }
                />

              </div>

            </section>

            {/* =================================================
                CONTENT
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <EditorSectionHeader
                number="03"
                title="Letter Content"
                description="Write and refine the main content of your letter."
              />

              <div className="space-y-4">

                <TextareaField
                  label="Opening"
                  value={
                    letter.opening
                  }
                  onChange={(value) =>
                    updateLetter(
                      "opening",
                      value
                    )
                  }
                  rows={6}
                />

                <TextareaField
                  label="Main Body"
                  value={
                    letter.body
                  }
                  onChange={(value) =>
                    updateLetter(
                      "body",
                      value
                    )
                  }
                  rows={8}
                />

                <TextareaField
                  label="Closing"
                  value={
                    letter.closing
                  }
                  onChange={(value) =>
                    updateLetter(
                      "closing",
                      value
                    )
                  }
                  rows={5}
                />

                <TextareaField
                  label="Sign Off"
                  value={
                    letter.signOff
                  }
                  onChange={(value) =>
                    updateLetter(
                      "signOff",
                      value
                    )
                  }
                  rows={2}
                />

              </div>

            </section>

            {/* =================================================
                JOB DESCRIPTION
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setShowJobDescription(
                    (previous) =>
                      !previous
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Optional
                  </p>

                  <h2 className="mt-1 text-sm font-black text-slate-900">
                    Job Description
                  </h2>
                </div>

                <HiChevronDown
                  size={18}
                  className={`text-slate-400 transition ${
                    showJobDescription
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showJobDescription && (
                <div className="mt-4">
                  <TextareaField
                    label="Job Description"
                    value={
                      letter.jobDescription
                    }
                    onChange={(
                      value
                    ) =>
                      updateLetter(
                        "jobDescription",
                        value
                      )
                    }
                    rows={8}
                  />
                </div>
              )}

            </section>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <HiStar size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Pro / Team feature
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Your cover letter is available
                    because your current plan is{" "}
                    <span className="font-black">
                      {planName}
                    </span>
                    .
                  </p>
                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={
                    handleDownload
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-xs
                    font-black
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Download TXT
                </button>

                <button
                  type="button"
                  onClick={
                    handlePrint
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-slate-900

                    px-3
                    py-2.5

                    text-xs
                    font-black
                    text-white

                    transition

                    hover:bg-slate-800
                  "
                >
                  <HiPrinter
                    size={14}
                  />

                  Print / PDF
                </button>

              </div>

            </section>

          </aside>

          {/* =================================================
              PREVIEW
          ================================================= */}

          <section className="min-w-0">

            <div className="sticky top-[92px]">

              {/* PREVIEW TOOLBAR */}

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Live Preview
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {currentTemplate.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={
                      handleSave
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-xl

                      border
                      border-slate-200

                      bg-white

                      px-4
                      py-2.5

                      text-xs
                      font-black
                      text-slate-700

                      shadow-sm

                      transition

                      hover:bg-slate-50
                    "
                  >
                    <HiCheck
                      size={15}
                    />

                    {saved
                      ? "Saved"
                      : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handlePrint
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2

                      rounded-xl

                      bg-slate-900

                      px-4
                      py-2.5

                      text-xs
                      font-black
                      text-white

                      transition

                      hover:bg-slate-800
                    "
                  >
                    <HiPrinter
                      size={15}
                    />

                    Print
                  </button>

                </div>

              </div>

              {/* PAPER */}

              <div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-200/70 p-4 shadow-inner sm:p-8">

                <CoverLetterPaper
                  template={
                    selectedTemplate
                  }
                  letter={letter}
                  profile={profile}
                  contact={contact}
                />

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* ===================================================
          PRINT STYLES
      =================================================== */}

      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            header,
            aside,
            .no-print {
              display: none !important;
            }

            main {
              display: block !important;
              max-width: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            main > div {
              display: block !important;
            }

            section {
              display: block !important;
            }

            .print-paper {
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              width: 100% !important;
              min-height: auto !important;
              margin: 0 !important;
            }

            @page {
              size: A4;
              margin: 18mm;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   COVER LETTER PAPER
========================================================= */

function CoverLetterPaper({
  template,
  letter,
  profile,
  contact,
}) {
  const fullName =
    profile?.fullName ||
    "Your Name";

  const professionalTitle =
    profile?.professionalTitle ||
    profile?.desiredJobTitle ||
    "";

  const email =
    contact?.email ||
    "";

  const phone =
    contact?.phone ||
    "";

  const website =
    contact?.website ||
    "";

  const linkedin =
    contact?.linkedin ||
    "";

  const github =
    contact?.github ||
    "";

  /* =======================================================
     PROFESSIONAL
  ======================================================= */

  if (template === "professional") {
    return (
      <article className="print-paper mx-auto min-h-[1120px] w-full max-w-[820px] bg-white px-8 py-10 shadow-2xl sm:px-14 sm:py-14">

        <div className="border-b-2 border-slate-900 pb-7">

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            {fullName}
          </h1>

          {professionalTitle && (
            <p className="mt-1 text-sm font-bold text-slate-600">
              {professionalTitle}
            </p>
          )}

          <ContactLine
            email={email}
            phone={phone}
            website={website}
            linkedin={linkedin}
            github={github}
          />

        </div>

        <div className="mt-9">

          <p className="text-sm font-semibold text-slate-600">
            {letter.recipientName ||
              "Hiring Manager"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {letter.companyName ||
              "Company Name"}
          </p>

          <p className="mt-6 text-sm font-bold text-slate-900">
            {letter.subject ||
              `Application for ${
                letter.jobTitle ||
                "the position"
              }`}
          </p>

        </div>

        <div className="mt-8 space-y-5 text-[15px] leading-7 text-slate-700">

          <p>
            {letter.greeting}
          </p>

          <p>
            {letter.opening}
          </p>

          <p>
            {letter.body}
          </p>

          {letter.jobDescription && (
            <p>
              I am particularly interested in this opportunity because my background aligns well with the requirements of the role.
            </p>
          )}

          <p>
            {letter.closing}
          </p>

          <div className="pt-4">

            <p>
              {letter.signOff}
            </p>

            <p className="mt-5 font-black text-slate-950">
              {fullName}
            </p>

          </div>

        </div>

      </article>
    );
  }

  /* =======================================================
     MODERN
  ======================================================= */

  if (template === "modern") {
    return (
      <article className="print-paper mx-auto min-h-[1120px] w-full max-w-[820px] bg-white shadow-2xl">

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10 text-white sm:px-14">

          <h1 className="text-3xl font-black tracking-tight">
            {fullName}
          </h1>

          {professionalTitle && (
            <p className="mt-2 text-sm font-semibold text-blue-100">
              {professionalTitle}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-blue-100">

            {email && (
              <span>
                {email}
              </span>
            )}

            {phone && (
              <span>
                {phone}
              </span>
            )}

            {website && (
              <span>
                {website}
              </span>
            )}

          </div>

        </div>

        <div className="px-8 py-10 sm:px-14">

          <div className="grid gap-8 sm:grid-cols-[180px_minmax(0,1fr)]">

            <div className="text-sm">

              <p className="font-black text-slate-900">
                To
              </p>

              <p className="mt-2 font-bold text-slate-700">
                {letter.recipientName ||
                  "Hiring Manager"}
              </p>

              <p className="mt-1 text-slate-500">
                {letter.companyName ||
                  "Company Name"}
              </p>

              <p className="mt-6 font-black text-slate-900">
                Role
              </p>

              <p className="mt-2 text-slate-500">
                {letter.jobTitle ||
                  "Position"}
              </p>

            </div>

            <div>

              <p className="text-sm font-bold text-blue-700">
                {letter.subject ||
                  `Application for ${
                    letter.jobTitle ||
                    "the position"
                  }`}
              </p>

              <div className="mt-7 space-y-5 text-[15px] leading-7 text-slate-700">

                <p>
                  {letter.greeting}
                </p>

                <p>
                  {letter.opening}
                </p>

                <p>
                  {letter.body}
                </p>

                <p>
                  {letter.closing}
                </p>

                <div className="pt-4">

                  <p>
                    {letter.signOff}
                  </p>

                  <p className="mt-5 font-black text-slate-950">
                    {fullName}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </article>
    );
  }

  /* =======================================================
     MINIMAL
  ======================================================= */

  return (
    <article className="print-paper mx-auto min-h-[1120px] w-full max-w-[820px] bg-white px-8 py-12 shadow-2xl sm:px-16 sm:py-16">

      <header>

        <h1 className="text-2xl font-black text-slate-950">
          {fullName}
        </h1>

        {professionalTitle && (
          <p className="mt-1 text-sm text-slate-500">
            {professionalTitle}
          </p>
        )}

        <div className="mt-4 h-px bg-slate-200" />

        <ContactLine
          email={email}
          phone={phone}
          website={website}
          linkedin={linkedin}
          github={github}
        />

      </header>

      <div className="mt-12">

        <p className="text-sm text-slate-500">
          {letter.recipientName ||
            "Hiring Manager"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {letter.companyName ||
            "Company Name"}
        </p>

        <h2 className="mt-9 text-base font-black text-slate-950">
          {letter.subject ||
            `Application for ${
              letter.jobTitle ||
              "the position"
            }`}
        </h2>

        <div className="mt-7 space-y-6 text-[15px] leading-8 text-slate-700">

          <p>
            {letter.greeting}
          </p>

          <p>
            {letter.opening}
          </p>

          <p>
            {letter.body}
          </p>

          <p>
            {letter.closing}
          </p>

          <div className="pt-2">

            <p>
              {letter.signOff}
            </p>

            <p className="mt-5 font-black text-slate-950">
              {fullName}
            </p>

          </div>

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   CONTACT LINE
========================================================= */

function ContactLine({
  email,
  phone,
  website,
  linkedin,
  github,
}) {
  const values = [
    email,
    phone,
    website,
    linkedin,
    github,
  ].filter(Boolean);

  if (!values.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      {values.map(
        (value, index) => (
          <span key={index}>
            {value}
          </span>
        )
      )}
    </div>
  );
}

/* =========================================================
   EDITOR SECTION HEADER
========================================================= */

function EditorSectionHeader({
  number,
  title,
  description,
}) {
  return (
    <div className="mb-5">

      <div className="flex items-center gap-3">

        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white">
          {number}
        </span>

        <h2 className="text-sm font-black text-slate-900">
          {title}
        </h2>

      </div>

      <p className="mt-2 pl-10 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-xs font-black text-slate-700">
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

          px-3.5

          text-sm
          font-medium
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
   TEXTAREA FIELD
========================================================= */

function TextareaField({
  label,
  value,
  onChange,
  rows = 5,
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-xs font-black text-slate-700">
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

          px-3.5
          py-3

          text-sm
          font-medium
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
   LOCKED FEATURE
========================================================= */

function LockedFeature({
  text,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <HiCheck size={15} />
      </div>

      <p className="text-sm font-semibold text-slate-700">
        {text}
      </p>

    </div>
  );
}

/* =========================================================
   BUILD PLAIN TEXT
========================================================= */

function buildPlainText(
  letter,
  profile,
  contact
) {
  const fullName =
    profile?.fullName ||
    "Your Name";

  const lines = [];

  lines.push(fullName);

  if (profile?.professionalTitle) {
    lines.push(
      profile.professionalTitle
    );
  }

  if (contact?.email) {
    lines.push(contact.email);
  }

  if (contact?.phone) {
    lines.push(contact.phone);
  }

  lines.push("");

  lines.push(
    letter.recipientName ||
      "Hiring Manager"
  );

  lines.push(
    letter.companyName ||
      "Company Name"
  );

  lines.push("");

  lines.push(
    letter.subject ||
      `Application for ${
        letter.jobTitle ||
        "the position"
      }`
  );

  lines.push("");

  lines.push(
    letter.greeting
  );

  lines.push("");

  lines.push(
    letter.opening
  );

  lines.push("");

  lines.push(
    letter.body
  );

  lines.push("");

  lines.push(
    letter.closing
  );

  lines.push("");

  lines.push(
    letter.signOff
  );

  lines.push("");

  lines.push(fullName);

  return lines.join("\n");
}

/* =========================================================
   SANITIZE FILENAME
========================================================= */

function sanitizeFilename(
  value
) {
  return String(value)
    .trim()
    .replace(
      /[^a-z0-9-_]+/gi,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    )
    .toLowerCase() ||
    "cover-letter";
}