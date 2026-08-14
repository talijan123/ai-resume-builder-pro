import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import {
  HiPencilSquare,
  HiArrowDownTray,
  HiDocumentText,
} from "react-icons/hi2";

import { supabase } from "../../lib/supabase";

export default function RecentResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================
     Load Recent Resumes
  ======================================= */

  useEffect(() => {
    async function loadRecentResumes() {
      try {
        setLoading(true);

        /* Get logged-in user */

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setResumes([]);
          return;
        }

        /* Get latest 3 resumes */

        const { data, error } = await supabase
          .from("resumes")
          .select(
            `
              id,
              title,
              ats_score,
              downloads,
              template,
              created_at,
              updated_at,
              resume_data
            `
          )
          .eq("user_id", user.id)
          .order("updated_at", {
            ascending: false,
          })
          .limit(3);

        if (error) {
          throw error;
        }

        setResumes(data || []);
      } catch (error) {
        console.error(
          "Failed to load recent resumes:",
          error
        );

        setResumes([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecentResumes();
  }, []);

  /* =======================================
     Format Date
  ======================================= */

  function formatDate(date) {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  /* =======================================
     DOWNLOAD RESUME
  ======================================= */

  function handleDownload(resumeId) {
    if (!resumeId) {
      return;
    }

    console.log(
      "📥 Opening resume for automatic PDF download:",
      resumeId
    );

    navigate(`/builder/${resumeId}`, {
      state: {
        autoDownload: true,
      },
    });
  }

  /* =======================================
     Loading
  ======================================= */

  if (loading) {
    return (
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Resumes
          </h2>

          <p className="mt-2 text-slate-500">
            Continue editing your latest resumes.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your resumes...
          </p>
        </div>
      </section>
    );
  }

  /* =======================================
     Render
  ======================================= */

  return (
    <section>
      {/* Heading */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Recent Resumes
          </h2>

          <p className="mt-2 text-slate-500">
            Continue editing your latest resumes.
          </p>
        </div>

        <Link
          to="/my-resumes"
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            font-medium
            text-slate-700
            transition-all
            hover:bg-slate-100
          "
        >
          View All
        </Link>
      </div>

      {/* No Resumes */}

      {resumes.length === 0 ? (
        <div
          className="
            rounded-3xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >
          <HiDocumentText
            size={42}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-xl font-bold text-slate-900">
            No Resume Found
          </h3>

          <p className="mt-2 text-slate-500">
            Create your first resume to see it here.
          </p>

          <Link
            to="/builder"
            className="
              mt-6
              inline-flex
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
              transition-all
              hover:bg-blue-700
            "
          >
            Create Resume
          </Link>
        </div>
      ) : (
        /* Resume List */

        <div className="space-y-5">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
              }}
              className="
                flex
                flex-col
                gap-6
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                hover:shadow-xl
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Resume Information */}

              <div className="flex items-center gap-5">
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
                  "
                >
                  <HiDocumentText size={28} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {resume.title ||
                      "Untitled Resume"}
                  </h3>

                  <p className="mt-1 text-slate-500">
                    Updated{" "}
                    {formatDate(
                      resume.updated_at
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}

              <div className="flex flex-wrap items-center gap-4">
                {/* ATS Score */}

                <span
                  className="
                    rounded-full
                    bg-green-100
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-green-700
                  "
                >
                  ATS {resume.ats_score || 0}%
                </span>

                {/* Downloads */}

                {resume.downloads > 0 && (
                  <span
                    className="
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    {resume.downloads}{" "}
                    {resume.downloads === 1
                      ? "download"
                      : "downloads"}
                  </span>
                )}

                {/* Edit */}

                <Link
                  to={`/builder/${resume.id}`}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-slate-700
                    transition-all
                    hover:bg-slate-100
                  "
                >
                  <HiPencilSquare
                    size={18}
                  />

                  Edit
                </Link>

                {/* Download */}

                <button
                  type="button"
                  onClick={() =>
                    handleDownload(resume.id)
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    px-5
                    py-3
                    font-medium
                    text-white
                    transition-all
                    hover:shadow-lg
                    active:scale-[0.98]
                  "
                >
                  <HiArrowDownTray
                    size={18}
                  />

                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}