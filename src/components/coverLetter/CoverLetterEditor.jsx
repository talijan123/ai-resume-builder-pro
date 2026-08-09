import { useCoverLetter } from "../../context/CoverLetterContext";

/* =========================================================
   CoverLetterEditor
========================================================= */

export default function CoverLetterEditor() {
  const {
    coverLetterData,
    updatePersonalInfo,
    updateRecipient,
    updateLetter,
    setTemplate,
    resetCoverLetter,
  } = useCoverLetter();

  const {
    personalInfo,
    recipient,
    letter,
    template,
  } = coverLetterData;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8">
        <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
          Cover Letter Builder
        </div>

        <h2 className="text-2xl font-black text-slate-900">
          Build your letter
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add your information and letter content. Your
          changes will appear instantly in the preview.
        </p>
      </div>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

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
              updatePersonalInfo("fullName", value)
            }
            placeholder="Talal Hassan"
          />

          <Input
            label="Email"
            type="email"
            value={personalInfo.email}
            onChange={(value) =>
              updatePersonalInfo("email", value)
            }
            placeholder="talal@example.com"
          />

          <Input
            label="Phone"
            value={personalInfo.phone}
            onChange={(value) =>
              updatePersonalInfo("phone", value)
            }
            placeholder="+92 300 1234567"
          />

          <Input
            label="Location"
            value={personalInfo.location}
            onChange={(value) =>
              updatePersonalInfo("location", value)
            }
            placeholder="Abbottabad, Pakistan"
          />

          <Input
            label="Website"
            value={personalInfo.website}
            onChange={(value) =>
              updatePersonalInfo("website", value)
            }
            placeholder="yourwebsite.com"
          />

          <Input
            label="LinkedIn"
            value={personalInfo.linkedin}
            onChange={(value) =>
              updatePersonalInfo("linkedin", value)
            }
            placeholder="linkedin.com/in/yourname"
          />
        </div>
      </div>

      {/* =====================================================
          RECIPIENT
      ===================================================== */}

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
              updateRecipient("company", value)
            }
            placeholder="Acme Technologies"
          />

          <Input
            label="Job Title"
            value={recipient.jobTitle}
            onChange={(value) =>
              updateRecipient("jobTitle", value)
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

      {/* =====================================================
          LETTER CONTENT
      ===================================================== */}

      <div className="mb-8">
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
              updateLetter("date", value)
            }
          />

          <Input
            label="Greeting"
            value={letter.greeting}
            onChange={(value) =>
              updateLetter("greeting", value)
            }
            placeholder="Dear Hiring Manager,"
          />

          <Textarea
            label="Opening"
            value={letter.opening}
            onChange={(value) =>
              updateLetter("opening", value)
            }
            placeholder="Introduce yourself and explain why you are interested in the position."
          />

          <Textarea
            label="Main Body"
            rows={8}
            value={letter.body}
            onChange={(value) =>
              updateLetter("body", value)
            }
            placeholder="Explain your relevant experience, skills, achievements, and why you would be a strong fit for the company."
          />

          <Textarea
            label="Closing"
            rows={5}
            value={letter.closing}
            onChange={(value) =>
              updateLetter("closing", value)
            }
            placeholder="Thank the employer and express your interest in discussing the opportunity."
          />

          <Input
            label="Signature"
            value={letter.signature}
            onChange={(value) =>
              updateLetter("signature", value)
            }
            placeholder="Talal Hassan"
          />
        </div>
      </div>

      {/* =====================================================
          TEMPLATE
      ===================================================== */}

      <div className="mb-8">
        <SectionTitle
          number="04"
          title="Template"
        />

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              id: "modern",
              name: "Modern",
              description: "Clean & modern",
            },
            {
              id: "professional",
              name: "Professional",
              description: "Corporate & polished",
            },
            {
              id: "minimal",
              name: "Minimal",
              description: "Simple & elegant",
            },
          ].map((item) => {
            const selected = template === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTemplate(item.id)}
                className={`
                  rounded-xl
                  border
                  px-3
                  py-3
                  text-left
                  transition-all

                  ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                <span className="block text-sm font-black">
                  {item.name}
                </span>

                <span
                  className={`
                    mt-1
                    block
                    text-xs
                    ${
                      selected
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  `}
                >
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          RESET
      ===================================================== */}

      <div className="border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={resetCoverLetter}
          className="
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            font-bold
            text-slate-600
            transition
            hover:bg-slate-50
            hover:text-slate-900
          "
        >
          Reset Cover Letter
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   Section Title
========================================================= */

function SectionTitle({ number, title }) {
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
   Input
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
   Textarea
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