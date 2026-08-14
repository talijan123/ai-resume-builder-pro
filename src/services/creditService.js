import { supabase } from "../lib/supabase";

/* =========================================================
   GET CREDIT BALANCE
========================================================= */

export async function getSubscriptionCredits() {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌ getUser error:", {
        message: userError.message,
        code: userError.code,
        details: userError.details,
        hint: userError.hint,
      });

      throw userError;
    }

    if (!user) {
      console.warn("⚠️ No authenticated user");
      return 0;
    }

    const {
      data,
      error,
    } = await supabase
      .from("user_subscriptions")
      .select("user_id, credits_remaining")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error("❌ Credit balance error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      throw error;
    }

    console.log("✅ Credit balance:", data);

    return Number(
      data?.credits_remaining ?? 0
    );
  } catch (error) {
    console.error(
      "❌ getSubscriptionCredits failed:",
      {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        fullError: error,
      }
    );

    throw error;
  }
}

/* =========================================================
   DEDUCT CREDIT
========================================================= */

export async function deductCredit(
  amount = 1,
  description = "Resume creation"
) {
  try {
    /* -------------------------------------------------------
       Get authenticated user
    ------------------------------------------------------- */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log(
      "🔐 Auth before deduction:",
      {
        userId: user?.id,
        email: user?.email,
        authError,
      }
    );

    if (authError) {
      console.error(
        "❌ Authentication error:",
        {
          message: authError.message,
          code: authError.code,
          details: authError.details,
          hint: authError.hint,
        }
      );

      throw authError;
    }

    if (!user) {
      const error =
        new Error("USER_NOT_AUTHENTICATED");

      console.error(
        "❌ No authenticated user."
      );

      throw error;
    }

    /* -------------------------------------------------------
       Validate amount
    ------------------------------------------------------- */

    if (!Number.isInteger(amount) || amount <= 0) {
      const error =
        new Error(
          "CREDIT_AMOUNT_INVALID"
        );

      console.error(
        "❌ Invalid credit amount:",
        amount
      );

      throw error;
    }

    /* -------------------------------------------------------
       Log RPC request
    ------------------------------------------------------- */

    console.log(
      "💳 Attempting to deduct credit:",
      {
        amount,
        description,
        userId: user.id,
      }
    );

    console.log(
      "💳 Calling deduct_credit RPC..."
    );

    /* -------------------------------------------------------
       Call Supabase RPC
    ------------------------------------------------------- */

    const {
      data,
      error,
    } = await supabase.rpc(
      "deduct_credit",
      {
        p_amount: amount,
        p_description:
          description,
      }
    );

    /* -------------------------------------------------------
       RPC ERROR
    ------------------------------------------------------- */

    if (error) {
      console.error(
        "❌ RPC DEDUCTION ERROR"
      );

      console.error(
        "➡️ Error code:",
        error?.code
      );

      console.error(
        "➡️ Error message:",
        error?.message
      );

      console.error(
        "➡️ Error details:",
        error?.details
      );

      console.error(
        "➡️ Error hint:",
        error?.hint
      );

      /*
        This is important because browser
        console often displays Supabase
        objects simply as "Object".
      */

      console.error(
        "➡️ FULL RPC ERROR:",
        JSON.stringify(
          {
            code: error?.code,
            message: error?.message,
            details: error?.details,
            hint: error?.hint,
          },
          null,
          2
        )
      );

      throw error;
    }

    /* -------------------------------------------------------
       RPC SUCCESS
    ------------------------------------------------------- */

    console.log(
      "✅ RPC SUCCESS:",
      data
    );

    const remainingCredits =
      Number(data);

    console.log(
      "💰 Remaining credits:",
      remainingCredits
    );

    return remainingCredits;
  } catch (error) {
    console.error(
      "❌ deductCredit() FAILED"
    );

    console.error(
      "Code:",
      error?.code
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Details:",
      error?.details
    );

    console.error(
      "Hint:",
      error?.hint
    );

    console.error(
      "Full error:",
      JSON.stringify(
        {
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
        },
        null,
        2
      )
    );

    throw error;
  }
}