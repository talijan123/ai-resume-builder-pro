import { supabase } from "../lib/supabase";

/* =========================================================
   GET CURRENT USER
========================================================= */

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  return user;
}

/* =========================================================
   GET USER SETTINGS
========================================================= */

export async function getUserSettings() {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================================
   CREATE OR UPDATE USER SETTINGS
========================================================= */

export async function saveUserSettings(settings) {
  const user = await getCurrentUser();

  const payload = {
    user_id: user.id,

    theme: settings.theme || "system",

    default_resume_template:
      settings.defaultResumeTemplate || "professional",

    default_cover_letter_template:
      settings.defaultCoverLetterTemplate || "professional",

    auto_save:
      settings.autoSave !== undefined
        ? settings.autoSave
        : true,

    show_profile_photo:
      settings.showProfilePhoto !== undefined
        ? settings.showProfilePhoto
        : true,

    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(payload, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================================
   UPDATE SINGLE SETTING
========================================================= */

export async function updateUserSetting(
  field,
  value
) {
  const user = await getCurrentUser();

  const payload = {
    user_id: user.id,
    [field]: value,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(payload, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================================================
   DELETE USER SETTINGS
========================================================= */

export async function deleteUserSettings() {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("user_settings")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return true;
}