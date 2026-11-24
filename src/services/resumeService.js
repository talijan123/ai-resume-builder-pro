import { supabase } from "../lib/supabase";

/* ===========================================
   CREATE RESUME
=========================================== */

export async function createResume(userId, resumeData) {
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title:
        resumeData.personalInfo?.fullName || "Untitled Resume",
      resume_data: resumeData,
      ats_score: 0,
      downloads: 0,
      template: "modern",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ===========================================
   GET ALL USER RESUMES
=========================================== */

export async function getUserResumes(userId) {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

/* ===========================================
   GET SINGLE RESUME
=========================================== */

export async function getResume(id) {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

/* ===========================================
   UPDATE RESUME
=========================================== */

export async function updateResume(
  id,
  resumeData
) {
  const { data, error } = await supabase
    .from("resumes")
    .update({
      title:
        resumeData.personalInfo?.fullName ||
        "Untitled Resume",

      resume_data: resumeData,

      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ===========================================
   DELETE RESUME
=========================================== */

export async function deleteResume(id) {
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}