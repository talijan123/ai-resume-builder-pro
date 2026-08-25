import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiCheck,
  HiDocumentText,
  HiPencilSquare,
  HiTrash,
} from "react-icons/hi2";
import { supabase } from "../../lib/supabase";

export default function CoverLetterCard({ coverLetter, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(coverLetter.title || "Untitled Cover Letter");

  async function handleRename() {
    const nextTitle = title.trim() || "Untitled Cover Letter";
    if (nextTitle === coverLetter.title) {
      setEditing(false);
      return;
    }

    const { data, error } = await supabase
      .from("cover_letters")
      .update({ title: nextTitle, updated_at: new Date().toISOString() })
      .eq("id", coverLetter.id)
      .select()
      .single();

    if (error) {
      alert(error.message || "Failed to rename cover letter.");
      return;
    }

    setEditing(false);
    onRename(data);
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  const letter = coverLetter.letter_data?.letter || {};

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
            <HiDocumentText size={28} />
          </div>
          <div className="min-w-0">
            {editing ? (
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleRename();
                }}
                className="h-10 w-full rounded-xl border border-emerald-300 px-3 text-lg font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-100"
                autoFocus
              />
            ) : (
              <h2 className="truncate text-xl font-bold text-slate-900">
                {coverLetter.title || "Untitled Cover Letter"}
              </h2>
            )}
            <p className="mt-1 text-sm text-slate-500">
              Updated {formatDate(coverLetter.updated_at)}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700">
          {coverLetter.selected_template || "professional"}
        </span>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p><span className="font-semibold">Position:</span> {letter.jobTitle || "Not specified"}</p>
        <p><span className="font-semibold">Company:</span> {letter.companyName || "Not specified"}</p>
        <p><span className="font-semibold">Created:</span> {formatDate(coverLetter.created_at)}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={`/cover-letter/${coverLetter.id}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
          <HiPencilSquare size={18} /> Edit
        </Link>
        <button type="button" onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          <HiPencilSquare size={18} /> Rename
        </button>
        {editing && (
          <button type="button" onClick={handleRename} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
            <HiCheck size={18} /> Save title
          </button>
        )}
        <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
          <HiTrash size={18} /> Delete
        </button>
      </div>
    </article>
  );
}
