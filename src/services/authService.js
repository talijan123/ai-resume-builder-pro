import { supabase } from "../lib/supabase";

/**
 * Register a new user
 */
export async function signUp({
  fullName,
  email,
  password,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return {
    data,
    error,
  };
}

/**
 * Login existing user
 */
export async function signIn({
  email,
  password,
}) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  return {
    data,
    error,
  };
}

/**
 * Logout current user
 */
export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  return {
    error,
  };
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    user,
    error,
  };
}

/**
 * Get current session
 */
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return {
    session,
    error,
  };
}