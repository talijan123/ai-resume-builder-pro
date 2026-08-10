import { supabase } from "../lib/supabase";

/* =========================================================
   GET CREDIT BALANCE
========================================================= */

export async function getCreditBalance() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const { data, error } = await supabase
    .from("credit_balances")
    .select("credits")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to get credit balance:",
      error
    );

    throw error;
  }

  return data?.credits ?? 0;
}

/* =========================================================
   DEDUCT CREDIT
========================================================= */

export async function deductCredit(
  amount = 1,
  description = "AI resume generation"
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("USER_NOT_AUTHENTICATED");
  }

  const { data, error } = await supabase.rpc(
    "deduct_credit",
    {
      p_amount: amount,
      p_description: description,
    }
  );

  if (error) {
    console.error(
      "Failed to deduct credit:",
      error
    );

    throw error;
  }

  return data;
}