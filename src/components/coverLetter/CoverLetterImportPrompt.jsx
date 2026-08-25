import { HiArrowDownTray, HiXMark } from "react-icons/hi2";

export default function CoverLetterImportPrompt({
  onImport,
  onSkip,
  importing = false,
}) {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Existing letter found
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-900">
            Import your existing cover letter
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Move your saved local letter into your cloud library. Your local copy is kept unless the import succeeds.
          </p>
        </div>
        <HiArrowDownTray className="shrink-0 text-emerald-700" size={24} />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onImport}
          disabled={importing}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiArrowDownTray size={17} />
          {importing ? "Importing..." : "Import"}
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={importing}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-black text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
        >
          <HiXMark size={17} />
          Skip for now
        </button>
      </div>
    </section>
  );
}
