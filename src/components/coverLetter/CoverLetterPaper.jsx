import { forwardRef } from "react";

const CoverLetterPaper = forwardRef(function CoverLetterPaper({
  template,
  letter,
  profile,
  contact,
}, ref) {
  const fullName = profile?.fullName || "Your Name";
  const professionalTitle =
    profile?.professionalTitle || profile?.desiredJobTitle || "";

  if (template === "professional") {
    return (
      <article ref={ref} className="print-paper mx-auto min-h-[1120px] w-full max-w-[820px] bg-white px-8 py-10 shadow-2xl sm:px-14 sm:py-14">
        <div className="border-b-2 border-slate-900 pb-7">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{fullName}</h1>
          {professionalTitle && <p className="mt-1 text-sm font-bold text-slate-600">{professionalTitle}</p>}
          <ContactLine contact={contact} />
        </div>
        <div className="mt-9">
          <p className="text-sm font-semibold text-slate-600">{letter.recipientName || "Hiring Manager"}</p>
          <p className="mt-1 text-sm text-slate-500">{letter.companyName || "Company Name"}</p>
          <p className="mt-6 text-sm font-bold text-slate-900">{letter.subject || `Application for ${letter.jobTitle || "the position"}`}</p>
        </div>
        <LetterContent letter={letter} fullName={fullName} className="mt-8" />
      </article>
    );
  }

  if (template === "modern") {
    return (
      <article ref={ref} className="print-paper mx-auto min-h-[1120px] w-full max-w-[820px] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10 text-white sm:px-14">
          <h1 className="text-3xl font-black tracking-tight">{fullName}</h1>
          {professionalTitle && <p className="mt-2 text-sm font-semibold text-blue-100">{professionalTitle}</p>}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-blue-100">
            {[contact?.email, contact?.phone, contact?.website].filter(Boolean).map((value) => <span key={value}>{value}</span>)}
          </div>
        </div>
        <div className="px-8 py-10 sm:px-14">
          <div className="grid gap-8 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="text-sm">
              <p className="font-black text-slate-900">To</p>
              <p className="mt-2 font-bold text-slate-700">{letter.recipientName || "Hiring Manager"}</p>
              <p className="mt-1 text-slate-500">{letter.companyName || "Company Name"}</p>
              <p className="mt-6 font-black text-slate-900">Role</p>
              <p className="mt-2 text-slate-500">{letter.jobTitle || "Position"}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-700">{letter.subject || `Application for ${letter.jobTitle || "the position"}`}</p>
              <LetterContent letter={letter} fullName={fullName} className="mt-7" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article ref={ref} className="print-paper mx-auto min-h-[1120px] w-full max-w-[820px] bg-white px-8 py-12 shadow-2xl sm:px-16 sm:py-16">
      <header>
        <h1 className="text-2xl font-black text-slate-950">{fullName}</h1>
        {professionalTitle && <p className="mt-1 text-sm text-slate-500">{professionalTitle}</p>}
        <div className="mt-4 h-px bg-slate-200" />
        <ContactLine contact={contact} />
      </header>
      <div className="mt-12">
        <p className="text-sm text-slate-500">{letter.recipientName || "Hiring Manager"}</p>
        <p className="mt-1 text-sm text-slate-500">{letter.companyName || "Company Name"}</p>
        <h2 className="mt-9 text-base font-black text-slate-950">{letter.subject || `Application for ${letter.jobTitle || "the position"}`}</h2>
        <LetterContent letter={letter} fullName={fullName} className="mt-7" />
      </div>
    </article>
  );
});

CoverLetterPaper.displayName = "CoverLetterPaper";

export default CoverLetterPaper;

function LetterContent({ letter, fullName, className }) {
  return (
    <div className={`${className} space-y-5 text-[15px] leading-7 text-slate-700`}>
      <p>{letter.greeting}</p>
      <p>{letter.opening}</p>
      <p>{letter.body}</p>
      {letter.jobDescription && <p>I am particularly interested in this opportunity because my background aligns well with the requirements of the role.</p>}
      <p>{letter.closing}</p>
      <div className="pt-4">
        <p>{letter.signOff}</p>
        <p className="mt-5 font-black text-slate-950">{fullName}</p>
      </div>
    </div>
  );
}

function ContactLine({ contact }) {
  const values = [contact?.email, contact?.phone, contact?.website, contact?.linkedin, contact?.github].filter(Boolean);

  if (!values.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      {values.map((value) => <span key={value}>{value}</span>)}
    </div>
  );
}
