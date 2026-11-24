import React, { useRef } from "react";
import { HiXMark, HiArrowDownTray } from "react-icons/hi2";
import ResumePreview from "./ResumePreview";

export default function PreviewModal({
  isOpen,
  onClose,
  onDownloadPDF,
  downloading,
}) {
  const modalResumeRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Live Resume Preview
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#ff4b2b] px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:from-[#e62557] hover:to-[#e63a1f] transition cursor-pointer disabled:opacity-50"
            >
              <HiArrowDownTray size={15} />
              <span>{downloading ? "Preparing PDF..." : "Export PDF"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close Preview"
            >
              <HiXMark size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body: A4 Preview Container */}
        <div className="flex-1 min-h-0 bg-slate-100 dark:bg-slate-950/60 overflow-hidden relative">
          <ResumePreview
            ref={modalResumeRef}
            onDownloadPDF={onDownloadPDF}
          />
        </div>
      </div>
    </div>
  );
}
