import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  HiPlus,
  HiSquares2X2,
} from "react-icons/hi2";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import ResumeCard from "../components/resumes/ResumeCard";
import EmptyState from "../components/resumes/EmptyState";

import { supabase } from "../lib/supabase";

export default function MyResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================
     Load Resumes
  ========================================== */

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      setLoading(true);

      /* --------------------------------------
         Current Logged-in User
      -------------------------------------- */

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setResumes([]);
        return;
      }

      /* --------------------------------------
         Get User Resumes
      -------------------------------------- */

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", {
          ascending: false,
        });

      if (error) throw error;

      setResumes(data || []);
    } catch (error) {
      console.error("Failed to load resumes:", error);

      alert("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==========================================
          Dashboard Header
      ========================================== */}

      <DashboardHeader />

      {/* ==========================================
          Main
      ========================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* ========================================
            Top Section
        ======================================== */}

        <div
          className="
            mb-10
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* ======================================
              Page Title
          ====================================== */}

          <div>
            <h1 className="text-4xl font-black text-slate-900">
              My Resumes
            </h1>

            <p className="mt-3 text-slate-500">
              Manage, edit, duplicate, and download your
              saved resumes.
            </p>
          </div>

          {/* ======================================
              Actions
          ====================================== */}

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Resume Templates */}

            <Link
              to="/templates"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-6
                py-4
                font-semibold
                text-slate-700
                shadow-sm
                transition-all
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-700
                hover:shadow-md
              "
            >
              <HiSquares2X2 size={21} />

              Resume Templates
            </Link>

            {/* Create Resume */}

            <Link
              to="/builder"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-6
                py-4
                font-semibold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition-all
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              <HiPlus size={22} />

              Create Resume
            </Link>
          </div>
        </div>

        {/* ========================================
            Loading
        ======================================== */}

        {loading ? (
          <div className="py-20 text-center">
            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-blue-600
              "
            />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading your resumes...
            </p>
          </div>
        ) : resumes.length === 0 ? (
          /* ======================================
             Empty State
          ====================================== */

          <EmptyState />
        ) : (
          /* ======================================
             Resume Grid
          ====================================== */

          <div className="grid gap-6 lg:grid-cols-2">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                refreshResumes={loadResumes}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}