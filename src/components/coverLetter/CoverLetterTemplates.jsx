import { HiCheck, HiSparkles } from "react-icons/hi2";
import { useCoverLetter } from "../../context/CoverLetterContext";

const templates = [
  { id: "modern", name: "Modern", description: "Clean & modern", badge: "Popular" },
  { id: "professional", name: "Professional", description: "Corporate & polished", badge: "Corporate" },
  { id: "minimal", name: "Minimal", description: "Simple & elegant", badge: "ATS Friendly" },
];

export default function CoverLetterTemplates() {
  const { coverLetterData, setTemplate } = useCoverLetter();
  const selectedTemplate = coverLetterData.selectedTemplate;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"><HiSparkles size={14} />Choose Your Design</div>
        <h2 className="text-lg font-black tracking-tight text-slate-900">Select a cover letter template</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">Switch templates without losing your information.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
        {templates.map((template) => {
          const selected = selectedTemplate === template.id;
          return (
            <button key={template.id} type="button" onClick={() => setTemplate(template.id)} className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${selected ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"}`}>
              <span><span className="block text-sm font-black">{template.name}</span><span className="mt-1 block text-xs text-slate-500">{template.description}</span></span>
              {selected ? <HiCheck size={18} /> : <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">{template.badge}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
