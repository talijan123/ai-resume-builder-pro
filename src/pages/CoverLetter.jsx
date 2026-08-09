import { useCoverLetter } from "../context/CoverLetterContext";
import CoverLetterTemplates from "../components/coverLetter/CoverLetterTemplates";

export default function CoverLetter() {
  const {
    coverLetterData,
    updatePersonalInfo,
    updateRecipient,
    updateLetter,
    resetCoverLetter,
  } = useCoverLetter();

  const {
    personalInfo,
    recipient,
    letter,
    template,
  } = coverLetterData;

  /* =====================================================
     DOWNLOAD / PRINT ONLY COVER LETTER
  ===================================================== */

  function handleDownload() {
    const printStyle = document.createElement("style");

    printStyle.id = "cover-letter-print-style";

    printStyle.innerHTML = `
      @media print {

        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        body * {
          visibility: hidden !important;
        }

        #cover-letter-preview,
        #cover-letter-preview * {
          visibility: visible !important;
        }

        #cover-letter-preview {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;

          width: 794px !important;
          min-height: 1123px !important;

          margin: 0 !important;
          padding: 0 !important;

          background: white !important;
          box-shadow: none !important;

          overflow: visible !important;
        }

        #cover-letter-preview > div {
          width: 794px !important;
          min-height: 1123px !important;
          box-shadow: none !important;
        }
      }
    `;

    document.head.appendChild(printStyle);

    // Open browser print dialog
    window.print();

    // Remove print styles after printing
    setTimeout(() => {
      const style = document.getElementById(
        "cover-letter-print-style"
      );

      if (style) {
        style.remove();
      }
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">

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
                Cover Letter Builder
              </h1>

              <p className="hidden text-sm text-slate-500 sm:block">
                Choose a design, fill in your information, and
                create a professional cover letter.
              </p>
            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={resetCoverLetter}
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
              onClick={handleDownload}
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
              Download / PDF
            </button>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-6 py-8">

        {/* ===================================================
            TEMPLATE SELECTION
        =================================================== */}

        <div className="print:hidden">
          <CoverLetterTemplates />
        </div>

        {/* ===================================================
            BUILDER
        =================================================== */}

        <div className="grid gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">

          {/* =================================================
              EDITOR
          ================================================= */}

          <section
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              print:hidden
            "
          >

            {/* Header */}

            <div className="mb-8">

              <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                Cover Letter Editor
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                Fill in your information
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your information will automatically appear in
                the selected cover letter template.
              </p>

            </div>

            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="mb-8">

              <SectionTitle
                number="01"
                title="Your Information"
              />

              <div className="space-y-4">

                <Input
                  label="Full Name"
                  value={personalInfo.fullName}
                  onChange={(value) =>
                    updatePersonalInfo(
                      "fullName",
                      value
                    )
                  }
                  placeholder="Talal Hassan"
                />

                <Input
                  label="Email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(value) =>
                    updatePersonalInfo(
                      "email",
                      value
                    )
                  }
                  placeholder="talal@example.com"
                />

                <Input
                  label="Phone"
                  value={personalInfo.phone}
                  onChange={(value) =>
                    updatePersonalInfo(
                      "phone",
                      value
                    )
                  }
                  placeholder="+92 300 1234567"
                />

                <Input
                  label="Location"
                  value={personalInfo.location}
                  onChange={(value) =>
                    updatePersonalInfo(
                      "location",
                      value
                    )
                  }
                  placeholder="Abbottabad, Pakistan"
                />

                <Input
                  label="Website"
                  value={personalInfo.website}
                  onChange={(value) =>
                    updatePersonalInfo(
                      "website",
                      value
                    )
                  }
                  placeholder="yourwebsite.com"
                />

                <Input
                  label="LinkedIn"
                  value={personalInfo.linkedin}
                  onChange={(value) =>
                    updatePersonalInfo(
                      "linkedin",
                      value
                    )
                  }
                  placeholder="linkedin.com/in/yourname"
                />

              </div>
            </div>

            {/* =================================================
                RECIPIENT
            ================================================= */}

            <div className="mb-8">

              <SectionTitle
                number="02"
                title="Recipient"
              />

              <div className="space-y-4">

                <Input
                  label="Hiring Manager"
                  value={recipient.hiringManager}
                  onChange={(value) =>
                    updateRecipient(
                      "hiringManager",
                      value
                    )
                  }
                  placeholder="Sarah Johnson"
                />

                <Input
                  label="Company"
                  value={recipient.company}
                  onChange={(value) =>
                    updateRecipient(
                      "company",
                      value
                    )
                  }
                  placeholder="Acme Technologies"
                />

                <Input
                  label="Job Title"
                  value={recipient.jobTitle}
                  onChange={(value) =>
                    updateRecipient(
                      "jobTitle",
                      value
                    )
                  }
                  placeholder="Frontend Developer"
                />

                <Input
                  label="Company Address"
                  value={recipient.companyAddress}
                  onChange={(value) =>
                    updateRecipient(
                      "companyAddress",
                      value
                    )
                  }
                  placeholder="Islamabad, Pakistan"
                />

              </div>
            </div>

            {/* =================================================
                LETTER CONTENT
            ================================================= */}

            <div>

              <SectionTitle
                number="03"
                title="Letter Content"
              />

              <div className="space-y-4">

                <Input
                  label="Date"
                  type="date"
                  value={letter.date}
                  onChange={(value) =>
                    updateLetter(
                      "date",
                      value
                    )
                  }
                />

                <Input
                  label="Greeting"
                  value={letter.greeting}
                  onChange={(value) =>
                    updateLetter(
                      "greeting",
                      value
                    )
                  }
                  placeholder="Dear Hiring Manager,"
                />

                <Textarea
                  label="Opening Paragraph"
                  value={letter.opening}
                  onChange={(value) =>
                    updateLetter(
                      "opening",
                      value
                    )
                  }
                  placeholder="Introduce yourself and explain why you are interested in the position."
                />

                <Textarea
                  label="Main Body"
                  rows={8}
                  value={letter.body}
                  onChange={(value) =>
                    updateLetter(
                      "body",
                      value
                    )
                  }
                  placeholder="Explain your relevant experience, skills, achievements, and why you would be a strong fit for the company."
                />

                <Textarea
                  label="Closing"
                  rows={5}
                  value={letter.closing}
                  onChange={(value) =>
                    updateLetter(
                      "closing",
                      value
                    )
                  }
                  placeholder="Thank the employer and express your interest in discussing the opportunity."
                />

                <Input
                  label="Signature"
                  value={letter.signature}
                  onChange={(value) =>
                    updateLetter(
                      "signature",
                      value
                    )
                  }
                  placeholder="Talal Hassan"
                />

              </div>
            </div>
          </section>

          {/* =================================================
              LIVE PREVIEW
          ================================================= */}

          <section className="min-w-0">

            <div className="sticky top-24">

              {/* Preview Header */}

              <div className="mb-4 flex items-center justify-between print:hidden">

                <div>

                  <h2 className="text-xl font-black text-slate-900">
                    Live Preview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {getTemplateName(template)} template
                  </p>

                </div>

                <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                  Live
                </div>

              </div>

              {/* =================================================
                  PREVIEW AREA
              ================================================= */}

              <div
                className="
                  overflow-auto
                  rounded-3xl
                  border
                  border-slate-200
                  bg-slate-200
                  p-6
                  shadow-sm
                  print:overflow-visible
                  print:border-0
                  print:bg-white
                  print:p-0
                  print:shadow-none
                "
              >

                <div
                  id="cover-letter-preview"
                  className="
                    mx-auto
                    w-[794px]
                    bg-white
                    shadow-2xl
                    print:mx-0
                    print:w-[794px]
                    print:shadow-none
                  "
                >

                  {/* =============================================
                      SELECTED TEMPLATE
                  ============================================= */}

                  {template === "professional" && (
                    <ProfessionalTemplate
                      personalInfo={personalInfo}
                      recipient={recipient}
                      letter={letter}
                    />
                  )}

                  {template === "minimal" && (
                    <MinimalTemplate
                      personalInfo={personalInfo}
                      recipient={recipient}
                      letter={letter}
                    />
                  )}

                  {template === "modern" && (
                    <ModernTemplate
                      personalInfo={personalInfo}
                      recipient={recipient}
                      letter={letter}
                    />
                  )}

                </div>

              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   MODERN TEMPLATE
========================================================= */

function ModernTemplate({
  personalInfo,
  recipient,
  letter,
}) {
  return (
    <div className="min-h-[1123px] bg-white px-[72px] py-[70px] text-slate-900">

      <div className="border-b-[3px] border-blue-600 pb-7">

        <h1 className="text-4xl font-black tracking-tight">
          {personalInfo.fullName || "Your Name"}
        </h1>

        {recipient.jobTitle && (
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            {recipient.jobTitle}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}

          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}

          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}

        </div>

        {(personalInfo.website ||
          personalInfo.linkedin) && (
          <div className="mt-1 flex flex-wrap gap-x-5 text-xs text-blue-600">

            {personalInfo.website && (
              <span>{personalInfo.website}</span>
            )}

            {personalInfo.linkedin && (
              <span>{personalInfo.linkedin}</span>
            )}

          </div>
        )}

      </div>

      <div className="mt-10 text-sm text-slate-500">
        {formatDate(letter.date)}
      </div>

      <div className="mt-8 space-y-1 text-sm leading-6 text-slate-700">

        {recipient.hiringManager && (
          <div className="font-bold">
            {recipient.hiringManager}
          </div>
        )}

        {recipient.jobTitle && (
          <div>{recipient.jobTitle}</div>
        )}

        {recipient.company && (
          <div className="font-semibold">
            {recipient.company}
          </div>
        )}

        {recipient.companyAddress && (
          <div>{recipient.companyAddress}</div>
        )}

      </div>

      <div className="mt-10 text-sm font-bold text-slate-900">
        {letter.greeting || "Dear Hiring Manager,"}
      </div>

      <LetterContent
        letter={letter}
        accent="blue"
      />

      <Signature
        letter={letter}
        personalInfo={personalInfo}
        closing="Best regards,"
      />

    </div>
  );
}

/* =========================================================
   PROFESSIONAL TEMPLATE
========================================================= */

function ProfessionalTemplate({
  personalInfo,
  recipient,
  letter,
}) {
  return (
    <div className="min-h-[1123px] bg-white px-[82px] py-[72px] text-slate-900">

      <div className="text-center">

        <h1 className="text-4xl font-black tracking-wide">
          {personalInfo.fullName || "YOUR NAME"}
        </h1>

        {recipient.jobTitle && (
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
            {recipient.jobTitle}
          </p>
        )}

        <div className="mt-5 h-px bg-slate-300" />

        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-slate-500">

          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}

          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}

          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}

        </div>

        {(personalInfo.website ||
          personalInfo.linkedin) && (
          <div className="mt-1 flex justify-center gap-x-5 text-xs text-slate-500">

            {personalInfo.website && (
              <span>{personalInfo.website}</span>
            )}

            {personalInfo.linkedin && (
              <span>{personalInfo.linkedin}</span>
            )}

          </div>
        )}

      </div>

      <div className="mt-11 text-sm text-slate-600">
        {formatDate(letter.date)}
      </div>

      <div className="mt-8 space-y-1 text-sm leading-6 text-slate-700">

        {recipient.hiringManager && (
          <div className="font-bold">
            {recipient.hiringManager}
          </div>
        )}

        {recipient.jobTitle && (
          <div>{recipient.jobTitle}</div>
        )}

        {recipient.company && (
          <div className="font-semibold">
            {recipient.company}
          </div>
        )}

        {recipient.companyAddress && (
          <div>{recipient.companyAddress}</div>
        )}

      </div>

      <div className="mt-10 text-sm font-semibold">
        {letter.greeting || "Dear Hiring Manager,"}
      </div>

      <LetterContent
        letter={letter}
        accent="slate"
      />

      <Signature
        letter={letter}
        personalInfo={personalInfo}
        closing="Sincerely,"
      />

    </div>
  );
}

/* =========================================================
   MINIMAL TEMPLATE
========================================================= */

function MinimalTemplate({
  personalInfo,
  recipient,
  letter,
}) {
  return (
    <div className="min-h-[1123px] bg-white px-[84px] py-[78px] text-slate-900">

      <div>

        <h1 className="text-4xl font-semibold tracking-tight">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">

          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}

          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}

          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}

        </div>

        {(personalInfo.website ||
          personalInfo.linkedin) && (
          <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-400">

            {personalInfo.website && (
              <span>{personalInfo.website}</span>
            )}

            {personalInfo.linkedin && (
              <span>{personalInfo.linkedin}</span>
            )}

          </div>
        )}

      </div>

      <div className="mt-7 h-px bg-slate-200" />

      <div className="mt-11 text-sm text-slate-400">
        {formatDate(letter.date)}
      </div>

      <div className="mt-8 space-y-1 text-sm leading-6 text-slate-600">

        {recipient.hiringManager && (
          <div>{recipient.hiringManager}</div>
        )}

        {recipient.jobTitle && (
          <div>{recipient.jobTitle}</div>
        )}

        {recipient.company && (
          <div>{recipient.company}</div>
        )}

        {recipient.companyAddress && (
          <div>{recipient.companyAddress}</div>
        )}

      </div>

      <div className="mt-11 text-sm text-slate-800">
        {letter.greeting || "Dear Hiring Manager,"}
      </div>

      <LetterContent
        letter={letter}
        accent="minimal"
      />

      <Signature
        letter={letter}
        personalInfo={personalInfo}
        closing="Kind regards,"
      />

    </div>
  );
}

/* =========================================================
   LETTER CONTENT
========================================================= */

function LetterContent({ letter, accent }) {

  const emptyText =
    accent === "minimal"
      ? "text-slate-300"
      : "text-slate-400";

  return (
    <div className="mt-7 space-y-6 text-sm leading-7 text-slate-700">

      {letter.opening ? (
        <p className="whitespace-pre-line">
          {letter.opening}
        </p>
      ) : (
        <p className={emptyText}>
          Your opening paragraph will appear here.
        </p>
      )}

      {letter.body ? (
        <p className="whitespace-pre-line">
          {letter.body}
        </p>
      ) : (
        <p className={emptyText}>
          Your main letter content will appear here.
        </p>
      )}

      {letter.closing && (
        <p className="whitespace-pre-line">
          {letter.closing}
        </p>
      )}

    </div>
  );
}

/* =========================================================
   SIGNATURE
========================================================= */

function Signature({
  letter,
  personalInfo,
  closing,
}) {
  return (
    <div className="mt-11 text-sm text-slate-700">

      <p>{closing}</p>

      <p className="mt-6 font-bold text-slate-900">
        {letter.signature ||
          personalInfo.fullName ||
          "Your Name"}
      </p>

    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  number,
  title,
}) {
  return (
    <div className="mb-4 flex items-center gap-3">

      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
        {number}
      </span>

      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
        {title}
      </h3>

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
   DATE FORMATTER
========================================================= */

function formatDate(date) {

  if (!date) {
    return "Date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

/* =========================================================
   TEMPLATE NAME
========================================================= */

function getTemplateName(template) {

  if (template === "professional") {
    return "Professional";
  }

  if (template === "minimal") {
    return "Minimal";
  }

  return "Modern";
}