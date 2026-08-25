import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi2";
import DashboardHeader from "../components/layout/DashboardHeader";
import CoverLetterCard from "../components/coverLetter/CoverLetterCard";
import CoverLetterImportPrompt from "../components/coverLetter/CoverLetterImportPrompt";
import {
  clearStoredCoverLetter,
  dismissCoverLetterImport,
  getStoredCoverLetterForImport,
  isCoverLetterImportDismissed,
  useCoverLetter,
} from "../context/CoverLetterContext";

export default function MyCoverLetters() {
  const navigate = useNavigate();
  const {
    coverLetters,
    loadCoverLetters,
    deleteCoverLetter,
    importCoverLetter,
  } = useCoverLetter();
  const [loading, setLoading] = useState(true);
  const [importData, setImportData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    loadCoverLetters()
      .catch((loadError) => {
        if (mounted) setError(loadError.message || "Failed to load cover letters.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const storedData = getStoredCoverLetterForImport();
    if (storedData && !isCoverLetterImportDismissed()) {
      setImportData(storedData);
    }

    return () => {
      mounted = false;
    };
  }, [loadCoverLetters]);

  async function handleImport() {
    if (!importData) return;
    setImporting(true);
    setError("");
    try {
      const imported = await importCoverLetter(importData);
      clearStoredCoverLetter();
      setImportData(null);
      navigate(`/cover-letter/${imported.id}`);
    } catch (importError) {
      setError(importError.message || "Failed to import cover letter.");
    } finally {
      setImporting(false);
    }
  }

  function handleSkip() {
    dismissCoverLetterImport();
    setImportData(null);
  }

  function handleShowImport() {
    const storedData = getStoredCoverLetterForImport();
    if (storedData) setImportData(storedData);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this cover letter?")) return;
    try {
      await deleteCoverLetter(id);
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete cover letter.");
    }
  }

  function handleRename() {
    loadCoverLetters().catch((loadError) => {
      setError(loadError.message || "Failed to refresh cover letters.");
    });
  }

  const hasLocalImport = Boolean(getStoredCoverLetterForImport());

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-900">My Cover Letters</h1>
            <p className="mt-3 text-slate-500">Manage, edit, and organize your saved cover letters.</p>
          </div>
          <button type="button" onClick={() => navigate("/cover-letter")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <HiPlus size={22} /> Create Cover Letter
          </button>
        </div>

        {importData && (
          <div className="mb-8">
            <CoverLetterImportPrompt onImport={handleImport} onSkip={handleSkip} importing={importing} />
          </div>
        )}

        {!importData && hasLocalImport && (
          <button type="button" onClick={handleShowImport} className="mb-8 text-sm font-bold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-900">
            Import existing letter
          </button>
        )}

        {error && <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

        {loading ? (
          <div className="py-20 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" /><p className="mt-4 text-sm font-medium text-slate-500">Loading your cover letters...</p></div>
        ) : coverLetters.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">No cover letters yet</h2>
            <p className="mt-3 text-slate-500">Create a tailored letter for your next application.</p>
            <button type="button" onClick={() => navigate("/cover-letter")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800"><HiPlus size={19} /> Create your first letter</button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {coverLetters.map((coverLetter) => (
              <CoverLetterCard key={coverLetter.id} coverLetter={coverLetter} onDelete={() => handleDelete(coverLetter.id)} onRename={handleRename} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
