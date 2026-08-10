import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

/* =========================================================
   PRICING CONTEXT
========================================================= */

const PricingContext = createContext(null);

/* =========================================================
   PROVIDER
========================================================= */

export function PricingProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [plan, setPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [credits, setCredits] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =======================================================
     LOAD PRICING DATA
  ======================================================= */

  const loadPricingData = useCallback(async () => {
    if (!user) {
      setPlan(null);
      setSubscription(null);
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      /* ===================================================
         GET USER SUBSCRIPTION + PLAN
      =================================================== */

      const {
        data: subscriptionData,
        error: subscriptionError,
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
        .eq("user_id", user.id)
        .maybeSingle();

      if (subscriptionError) {
        throw subscriptionError;
      }

      /* ===================================================
         GET CREDIT BALANCE
      =================================================== */

      const {
        data: creditData,
        error: creditError,
      } = await supabase
        .from("credit_balances")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (creditError) {
        throw creditError;
      }

      setSubscription(subscriptionData || null);

      setPlan(
        subscriptionData?.plan || null
      );

      setCredits(creditData || null);
    } catch (err) {
      console.error(
        "Failed to load pricing data:",
        err
      );

      setError(
        err?.message ||
          "Failed to load pricing information."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* =======================================================
     LOAD WHEN USER CHANGES
  ======================================================= */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadPricingData();
  }, [
    authLoading,
    loadPricingData,
  ]);

  /* =======================================================
     CALCULATE AVAILABLE CREDITS
  ======================================================= */

  const availableCredits = useMemo(() => {
    if (!credits) {
      return 0;
    }

    return (
      Number(credits.monthly_credits || 0) +
      Number(credits.purchased_credits || 0) +
      Number(credits.bonus_credits || 0)
    );
  }, [credits]);

  /* =======================================================
     PLAN NAME
  ======================================================= */

  const planName = useMemo(() => {
    return plan?.name || "Starter";
  }, [plan]);

  /* =======================================================
     PLAN SLUG
  ======================================================= */

  const planSlug = useMemo(() => {
    return plan?.slug || "starter";
  }, [plan]);

  /* =======================================================
     CHECK PLAN
  ======================================================= */

  const isStarter = planSlug === "starter";

  const isPro = planSlug === "pro";

  const isTeam = planSlug === "team";

  /* =======================================================
     FEATURE ACCESS
  ======================================================= */

  const canUsePremiumTemplates = useMemo(() => {
    return Boolean(
      plan?.premium_templates
    );
  }, [plan]);

  const canUseCoverLetters = useMemo(() => {
    /*
      Cover letters are available only
      for paid plans.
    */

    return (
      isPro ||
      isTeam ||
      plan?.name?.toLowerCase() === "starter-paid"
    );
  }, [isPro, isTeam, plan]);

  const canUseAI = useMemo(() => {
    return Boolean(
      plan?.ai_features
    );
  }, [plan]);

  /* =======================================================
     RESUME LIMIT
  ======================================================= */

  const maxResumes = useMemo(() => {
    return Number(
      plan?.max_resumes || 3
    );
  }, [plan]);

  /* =======================================================
     COVER LETTER LIMIT
  ======================================================= */

  const maxCoverLetters = useMemo(() => {
    return Number(
      plan?.max_cover_letters || 0
    );
  }, [plan]);

  /* =======================================================
     GENERIC FEATURE CHECK
  ======================================================= */

  const canUseFeature = useCallback(
    (feature) => {
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
            isPro ||
            isTeam ||
            plan?.name?.toLowerCase() ===
              "starter-paid"
          );

        case "ai":
          return Boolean(
            plan.ai_features
          );

        case "team":
          return isTeam;

        default:
          return false;
      }
    },
    [
      plan,
      isPro,
      isTeam,
    ]
  );

  /* =======================================================
     HAS ENOUGH CREDITS
  ======================================================= */

  const hasEnoughCredits = useCallback(
    (requiredCredits = 1) => {
      return (
        availableCredits >=
        Number(requiredCredits)
      );
    },
    [availableCredits]
  );

  /* =======================================================
     REFRESH PRICING DATA
  ======================================================= */

  const refreshPricing = useCallback(async () => {
    await loadPricingData();
  }, [loadPricingData]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      /* Subscription */

      subscription,

      /* Current plan */

      plan,

      planName,

      planSlug,

      /* Plan helpers */

      isStarter,
      isPro,
      isTeam,

      /* Credits */

      credits,

      availableCredits,

      hasEnoughCredits,

      /* Limits */

      maxResumes,
      maxCoverLetters,

      /* Features */

      canUsePremiumTemplates,
      canUseCoverLetters,
      canUseAI,

      canUseFeature,

      /* State */

      loading,
      error,

      /* Actions */

      refreshPricing,
    }),
    [
      subscription,
      plan,
      planName,
      planSlug,

      isStarter,
      isPro,
      isTeam,

      credits,
      availableCredits,
      hasEnoughCredits,

      maxResumes,
      maxCoverLetters,

      canUsePremiumTemplates,
      canUseCoverLetters,
      canUseAI,

      canUseFeature,

      loading,
      error,

      refreshPricing,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <PricingContext.Provider
      value={value}
    >
      {children}
    </PricingContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function usePricing() {
  const context =
    useContext(PricingContext);

  if (!context) {
    throw new Error(
      "usePricing must be used inside PricingProvider."
    );
  }

  return context;
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default PricingContext;