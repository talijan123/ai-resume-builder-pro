import { supabase } from "../lib/supabase";

/* =========================================================
   GET ALL ACTIVE PLANS
========================================================= */

export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("price_monthly", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Failed to fetch plans:",
      error
    );

    throw error;
  }

  return data || [];
}

/* =========================================================
   GET PLAN BY ID
========================================================= */

export async function getPlanById(planId) {
  if (!planId) {
    return null;
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch plan:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================================================
   GET PLAN BY SLUG
========================================================= */

export async function getPlanBySlug(slug) {
  if (!slug) {
    return null;
  }

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch plan by slug:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================================================
   GET CURRENT USER SUBSCRIPTION
========================================================= */

export async function getUserSubscription(
  userId
) {
  if (!userId) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("user_subscriptions")
    .select(
      `
        *,
        plan:plans (
          id,
          name,
          slug,
          description,
          price_monthly,
          price_yearly,
          monthly_credits,
          max_resumes,
          max_cover_letters,
          premium_templates,
          ai_features,
          team_members,
          is_active
        )
      `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch user subscription:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================================================
   GET CREDIT BALANCE
========================================================= */

export async function getCreditBalance(
  userId
) {
  if (!userId) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("credit_balances")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch credit balance:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================================================
   GET AVAILABLE CREDITS
========================================================= */

export async function getAvailableCredits(
  userId
) {
  const balance =
    await getCreditBalance(userId);

  if (!balance) {
    return 0;
  }

  return (
    Number(
      balance.monthly_credits || 0
    ) +
    Number(
      balance.purchased_credits || 0
    ) +
    Number(
      balance.bonus_credits || 0
    )
  );
}

/* =========================================================
   GET CREDIT TRANSACTIONS
========================================================= */

export async function getCreditTransactions(
  userId,
  limit = 50
) {
  if (!userId) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    console.error(
      "Failed to fetch credit transactions:",
      error
    );

    throw error;
  }

  return data || [];
}

/* =========================================================
   CHECK IF USER HAS ENOUGH CREDITS
========================================================= */

export async function hasEnoughCredits(
  userId,
  requiredCredits
) {
  const available =
    await getAvailableCredits(userId);

  return (
    available >=
    Number(requiredCredits || 0)
  );
}

/* =========================================================
   GET USER PRICING SUMMARY
========================================================= */

export async function getPricingSummary(
  userId
) {
  if (!userId) {
    return {
      subscription: null,
      plan: null,
      credits: null,
      availableCredits: 0,
    };
  }

  const [
    subscription,
    credits,
  ] = await Promise.all([
    getUserSubscription(userId),
    getCreditBalance(userId),
  ]);

  const plan =
    subscription?.plan || null;

  const availableCredits = credits
    ? Number(
        credits.monthly_credits || 0
      ) +
      Number(
        credits.purchased_credits || 0
      ) +
      Number(
        credits.bonus_credits || 0
      )
    : 0;

  return {
    subscription,
    plan,
    credits,
    availableCredits,
  };
}

/* =========================================================
   CHECK FEATURE ACCESS
========================================================= */

export function canUseFeature(
  plan,
  feature
) {
  if (!plan) {
    return false;
  }

  switch (feature) {
    case "premium_templates":
      return Boolean(
        plan.premium_templates
      );

    case "cover_letters":
      return (
        plan.slug === "starter" ||
        plan.slug === "pro" ||
        plan.slug === "team"
      );

    case "ai":
      return Boolean(
        plan.ai_features
      );

    case "team":
      return (
        plan.slug === "team"
      );

    default:
      return false;
  }
}

/* =========================================================
   GET PLAN LIMIT
========================================================= */

export function getPlanLimit(
  plan,
  limitName,
  fallback = 0
) {
  if (!plan) {
    return fallback;
  }

  const value =
    plan[limitName];

  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return Number(value);
}

/* =========================================================
   PLAN COMPARISON
========================================================= */

export function isPlanAtLeast(
  currentPlan,
  requiredPlan
) {
  if (
    !currentPlan ||
    !requiredPlan
  ) {
    return false;
  }

  const levels = {
    free: 0,
    starter: 1,
    pro: 2,
    team: 3,
  };

  const currentLevel =
    levels[
      currentPlan.slug
    ] ?? 0;

  const requiredLevel =
    levels[
      requiredPlan.slug
    ] ?? 0;

  return (
    currentLevel >=
    requiredLevel
  );
}