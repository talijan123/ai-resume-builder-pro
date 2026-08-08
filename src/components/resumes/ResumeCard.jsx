import { Link, useNavigate } from "react-router-dom";

import {
  HiPencilSquare,
  HiArrowDownTray,
  HiTrash,
  HiDocumentDuplicate,
  HiDocumentText,
} from "react-icons/hi2";

import { supabase } from "../../lib/supabase";

export default function ResumeCard({
  resume,
  refreshResumes,
}) {
  const navigate = useNavigate();

  /* =======================================
     Delete Resume
  ======================================= */

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id);

      if (error) throw error;

      alert("Resume deleted successfully.");

      refreshResumes();
    } catch (error) {
      console.error("Delete resume error:", error);

      alert(error.message || "Failed to delete resume.");
    }
  }

  /* =======================================
     Duplicate Resume
  ======================================= */

  async function handleDuplicate() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first.");
        return;
      }

      const copy = {
        user_id: user.id,

        title: `${resume.title || "Untitled Resume"} (Copy)`,

        resume_data: resume.resume_data,

        ats_score: resume.ats_score || 0,

        downloads: 0,

        template: resume.template || "modern",
      };

      const { error } = await supabase
        .from("resumes")
        .insert(copy);

      if (error) throw error;

      alert("Resume duplicated successfully.");

      refreshResumes();
    } catch (error) {
      console.error("Duplicate resume error:", error);

      alert(
        error.message ||
          "Failed to duplicate resume."
      );
    }
  }

  /* =======================================
     Download Resume
  ======================================= */

  function handleDownload() {
    /*
      ResumeCard itself does not contain the
      ResumePreview/PDF renderer.

      Therefore we open the existing resume
      in ResumeBuilder and tell ResumeBuilder
      that this visit came from the Download
      button.

      ResumeBuilder will then:
      1. Load the resume from Supabase.
      2. Render the resume.
      3. Generate the PDF.
      4. Increment downloads in Supabase.
    */

    navigate(`/builder/${resume.id}`, {
      state: {
        autoDownload: true,
      },
    });
  }

  /* =======================================
     Format Date
  ======================================= */

  function formatDate(date) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* =======================================
          Header
      ======================================= */}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">

          {/* Icon */}

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              text-white
              shadow-lg
            "
          >
            <HiDocumentText size={28} />
          </div>

          {/* Resume Info */}

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {resume.title || "Untitled Resume"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Updated {formatDate(resume.updated_at)}
            </p>
          </div>
        </div>

        {/* ATS */}

        <span
          className="
            rounded-full
            bg-green-100
            px-4
            py-2
            text-sm
            font-bold
            text-green-700
          "
        >
          ATS {resume.ats_score || 0}%
        </span>
      </div>

      {/* =======================================
          Info
      ======================================= */}

      <div className="mt-6 space-y-2 text-sm text-slate-600">

        <p>
          <span className="font-semibold">
            Created:
          </span>{" "}
          {formatDate(resume.created_at)}
        </p>

        <p>
          <span className="font-semibold">
            Last Updated:
          </span>{" "}
          {formatDate(resume.updated_at)}
        </p>

        <p>
          <span className="font-semibold">
            Downloads:
          </span>{" "}
          {resume.downloads || 0}
        </p>
      </div>

      {/* =======================================
          Buttons
      ======================================= */}

      <div className="mt-8 flex flex-wrap gap-3">

        {/* Edit */}

        <Link
          to={`/builder/${resume.id}`}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-300
            px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:bg-slate-100
          "
        >
          <HiPencilSquare size={18} />

          Edit
        </Link>

        {/* Download */}

        <button
          onClick={handleDownload}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-300
            px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:bg-slate-100
            hover:shadow-sm
          "
        >
          <HiArrowDownTray size={18} />

          Download
        </button>

        {/* Duplicate */}

        <button
          onClick={handleDuplicate}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-300
            px-4
            py-2
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:bg-slate-100
            hover:shadow-sm
          "
        >
          <HiDocumentDuplicate size={18} />

          Duplicate
        </button>

        {/* Delete */}

        <button
          onClick={handleDelete}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-2
            text-sm
            font-semibold
            text-red-600
            transition-all
            hover:bg-red-100
          "
        >
          <HiTrash size={18} />

          Delete
        </button>
      </div>
    </div>
  );
}