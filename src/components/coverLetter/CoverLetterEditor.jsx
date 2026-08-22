import { useState } from "react";
import { HiCheck, HiPrinter, HiSparkles } from "react-icons/hi2";
import { useCoverLetter } from "../../context/CoverLetterContext";
import { usePricing } from "../../context/PricingContext";
import { generateCoverLetter } from "../../services/aiService";

export default function CoverLetterEditor({ profile, contact, resumeData, planName, onPrint }) {
  const { coverLetterData, updateLetter, resetCoverLetter, saveCoverLetter } = useCoverLetter();
  const { refreshPricing } = usePricing();
  const { letter } = coverLetterData;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    try {
      saveCoverLetter();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setMessage(error?.message || "Failed to save cover letter.");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!letter.jobDescription.trim()) {
      setMessage("Add a job description before generating a letter.");
      return;
    }

    setGenerating(true);
    setMessage("");
    try {
      const result = await generateCoverLetter(letter.jobDescription, resumeData, {
        companyName: letter.companyName,
        recipientName: letter.recipientName,
      });
      updateLetter("body", result.coverLetter);
      setMessage("AI draft inserted. Review and edit it before saving.");
      try {
        await refreshPricing();
      } catch (refreshError) {
        console.error("Failed to refresh AI credits:", refreshError);
      }
    } catch (error) {
      setMessage(error?.message || "Unable to generate a cover letter.");
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    if (!window.confirm("Are you sure you want to start a new cover letter?")) {
      return;
    }
    resetCoverLetter();
    setSaved(false);
    setMessage("");
  }

  function handleDownload() {
    const text = buildPlainText(letter, profile, contact);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFilename(letter.jobTitle || "cover-letter")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <aside className="space-y-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <EditorSectionHeader number="02" title="Job Information" description="Add the position and company information." />
        <div className="space-y-4">
          <Field label="Job Title" value={letter.jobTitle} onChange={(value) => updateLetter("jobTitle", value)} />
          <Field label="Company Name" value={letter.companyName} onChange={(value) => updateLetter("companyName", value)} />
          <Field label="Recipient Name" value={letter.recipientName} onChange={(value) => updateLetter("recipientName", value)} />
          <Field label="Subject" value={letter.subject} onChange={(value) => updateLetter("subject", value)} />
          <Field label="Greeting" value={letter.greeting} onChange={(value) => updateLetter("greeting", value)} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <EditorSectionHeader number="03" title="Letter Content" description="Write and refine the main content of your letter." />
        <div className="space-y-4">
          <TextareaField label="Opening" value={letter.opening} onChange={(value) => updateLetter("opening", value)} rows={6} />
          <TextareaField label="Main Body" value={letter.body} onChange={(value) => updateLetter("body", value)} rows={8} />
          <TextareaField label="Closing" value={letter.closing} onChange={(value) => updateLetter("closing", value)} rows={5} />
          <TextareaField label="Sign Off" value={letter.signOff} onChange={(value) => updateLetter("signOff", value)} rows={2} />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <EditorSectionHeader number="04" title="Job Description" description="Add the job description to tailor your letter." />
        <TextareaField label="Job Description" value={letter.jobDescription} onChange={(value) => updateLetter("jobDescription", value)} rows={8} />
        <button type="button" onClick={handleGenerate} disabled={generating} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
          <HiSparkles size={16} />
          {generating ? "Generating..." : "Generate with AI"}
        </button>
        {message && <p className="mt-3 text-sm font-semibold text-slate-600" role="status">{message}</p>}
      </section>

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm font-black text-slate-900">Pro / Team feature</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">Your cover letter is available because your current plan is <span className="font-black">{planName}</span>.</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={handleDownload} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50">Download TXT</button>
          <button type="button" onClick={onPrint} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"><HiPrinter size={14} />Print / PDF</button>
        </div>
      </section>

      <div className="flex gap-2">
        <button type="button" onClick={handleReset} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600">New Letter</button>
        <button type="button" onClick={handleSave} disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60"><HiCheck size={16} />{saving ? "Saving..." : saved ? "Saved" : "Save"}</button>
      </div>
    </aside>
  );
}

function EditorSectionHeader({ number, title, description }) {
  return <div className="mb-5"><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white">{number}</span><h2 className="text-sm font-black text-slate-900">{title}</h2></div><p className="mt-2 pl-10 text-xs leading-5 text-slate-500">{description}</p></div>;
}

function Field({ label, value, onChange }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-black text-slate-700">{label}</span><input value={value || ""} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>;
}

function TextareaField({ label, value, onChange, rows = 5 }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-black text-slate-700">{label}</span><textarea rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>;
}

function buildPlainText(letter, profile, contact) {
  return [profile?.fullName || "Your Name", profile?.professionalTitle, contact?.email, contact?.phone, "", letter.recipientName || "Hiring Manager", letter.companyName || "Company Name", "", letter.subject || `Application for ${letter.jobTitle || "the position"}`, "", letter.greeting, "", letter.opening, "", letter.body, "", letter.closing, "", letter.signOff, "", profile?.fullName || "Your Name"].filter((line) => line !== undefined).join("\n");
}

function sanitizeFilename(value) {
  return String(value).trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "cover-letter";
}
