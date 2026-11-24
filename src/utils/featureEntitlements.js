/* =========================================================
   FEATURE ENTITLEMENTS
   Central place for plan-based access rules
========================================================= */

/* =========================================================
   PLAN LEVELS
========================================================= */

const PLAN_LEVELS = {
  free: 0,
  starter: 1,
  pro: 2,
  team: 3,
};

/* =========================================================
   GET PLAN SLUG
========================================================= */

export function getPlanSlug(plan) {
  if (!plan) {
    return "free";
  }

  return String(
    plan.slug || "free"
  ).toLowerCase();
}

/* =========================================================
   GET PLAN LEVEL
========================================================= */

export function getPlanLevel(plan) {
  const slug = getPlanSlug(plan);

  return PLAN_LEVELS[slug] ?? 0;
}

/* =========================================================
   CHECK IF PLAN IS AT LEAST REQUIRED PLAN
========================================================= */

export function hasMinimumPlan(
  plan,
  requiredPlan
) {
  const currentLevel =
    getPlanLevel(plan);

  const requiredLevel =
    PLAN_LEVELS[
      String(requiredPlan).toLowerCase()
    ] ?? 0;

  return (
    currentLevel >=
    requiredLevel
  );
}

/* =========================================================
   FREE USER
========================================================= */

export function isFreeUser(plan) {
  return (
    getPlanSlug(plan) === "free"
  );
}

/* =========================================================
   STARTER USER
========================================================= */

export function isStarterUser(plan) {
  return (
    getPlanSlug(plan) === "starter"
  );
}

/* =========================================================
   PRO USER
========================================================= */

export function isProUser(plan) {
  return (
    getPlanSlug(plan) === "pro"
  );
}

/* =========================================================
   TEAM USER
========================================================= */

export function isTeamUser(plan) {
  return (
    getPlanSlug(plan) === "team"
  );
}

/* =========================================================
   PAID USER
========================================================= */

export function isPaidUser(plan) {
  const slug =
    getPlanSlug(plan);

  return (
    slug === "starter" ||
    slug === "pro" ||
    slug === "team"
  );
}

/* =========================================================
   PREMIUM TEMPLATES
========================================================= */

export function canUsePremiumTemplates(
  plan
) {
  return Boolean(
    plan?.premium_templates
  );
}

/* =========================================================
   COVER LETTERS
========================================================= */

export function canUseCoverLetters(
  plan
) {
  /*
    Free users cannot create cover letters.

    Paid users:
      Starter → YES
      Pro     → YES
      Team    → YES
  */

  return isPaidUser(plan);
}

/* =========================================================
   AI FEATURES
========================================================= */

export function canUseAI(plan) {
  return Boolean(
    plan?.ai_features
  );
}

/* =========================================================
   TEAM FEATURES
========================================================= */

export function canUseTeamFeatures(
  plan
) {
  return isTeamUser(plan);
}

/* =========================================================
   RESUME LIMIT
========================================================= */

export function getResumeLimit(
  plan
) {
  /*
    Database value takes priority.

    Fallback:
      Free → 3
      Starter → 10
      Pro → 30
      Team → 100
  */

  if (
    plan?.max_resumes !==
    null &&
    plan?.max_resumes !==
      undefined
  ) {
    return Number(
      plan.max_resumes
    );
  }

  switch (
    getPlanSlug(plan)
  ) {
    case "starter":
      return 10;

    case "pro":
      return 30;

    case "team":
      return 100;

    default:
      return 3;
  }
}

/* =========================================================
   COVER LETTER LIMIT
========================================================= */

export function getCoverLetterLimit(
  plan
) {
  if (
    plan?.max_cover_letters !==
    null &&
    plan?.max_cover_letters !==
      undefined
  ) {
    return Number(
      plan.max_cover_letters
    );
  }

  switch (
    getPlanSlug(plan)
  ) {
    case "starter":
      return 5;

    case "pro":
      return 20;

    case "team":
      return 100;

    default:
      return 0;
  }
}

/* =========================================================
   MONTHLY CREDITS
========================================================= */

export function getMonthlyCredits(
  plan
) {
  if (
    plan?.monthly_credits !==
    null &&
    plan?.monthly_credits !==
      undefined
  ) {
    return Number(
      plan.monthly_credits
    );
  }

  switch (
    getPlanSlug(plan)
  ) {
    case "starter":
      return 150;

    case "pro":
      return 500;

    case "team":
      return 1500;

    default:
      return 50;
  }
}

/* =========================================================
   CHECK CREDIT BALANCE
========================================================= */

export function getAvailableCredits(
  credits
) {
  if (!credits) {
    return 0;
  }

  return (
    Number(
      credits.monthly_credits || 0
    ) +
    Number(
      credits.purchased_credits || 0
    ) +
    Number(
      credits.bonus_credits || 0
    )
  );
}

/* =========================================================
   CHECK IF USER HAS ENOUGH CREDITS
========================================================= */

export function hasEnoughCredits(
  credits,
  requiredCredits = 1
) {
  return (
    getAvailableCredits(
      credits
    ) >=
    Number(requiredCredits)
  );
}

/* =========================================================
   RESUME LIMIT CHECK
========================================================= */

export function canCreateResume({
  plan,
  resumeCount = 0,
}) {
  const limit =
    getResumeLimit(plan);

  return (
    Number(resumeCount) <
    limit
  );
}

/* =========================================================
   COVER LETTER LIMIT CHECK
========================================================= */

export function canCreateCoverLetter({
  plan,
  coverLetterCount = 0,
}) {
  if (
    !canUseCoverLetters(plan)
  ) {
    return false;
  }

  const limit =
    getCoverLetterLimit(plan);

  return (
    Number(coverLetterCount) <
    limit
  );
}

/* =========================================================
   GENERIC FEATURE CHECK
========================================================= */

export function canUseFeature(
  plan,
  feature
) {
  switch (feature) {
    case "premium_templates":
      return canUsePremiumTemplates(
        plan
      );

    case "cover_letters":
      return canUseCoverLetters(
        plan
      );

    case "ai":
      return canUseAI(plan);

    case "team":
      return canUseTeamFeatures(
        plan
      );

    default:
      return false;
  }
}

/* =========================================================
   ENTITLEMENT SUMMARY
========================================================= */

export function getFeatureEntitlements(
  plan,
  credits
) {
  return {
    plan: getPlanSlug(plan),

    isFree: isFreeUser(plan),
    isPaid: isPaidUser(plan),
    isStarter: isStarterUser(plan),
    isPro: isProUser(plan),
    isTeam: isTeamUser(plan),

    premiumTemplates:
      canUsePremiumTemplates(
        plan
      ),

    coverLetters:
      canUseCoverLetters(plan),

    ai:
      canUseAI(plan),

    teamFeatures:
      canUseTeamFeatures(plan),

    resumeLimit:
      getResumeLimit(plan),

    coverLetterLimit:
      getCoverLetterLimit(plan),

    monthlyCredits:
      getMonthlyCredits(plan),

    availableCredits:
      getAvailableCredits(
        credits
      ),
  };
}