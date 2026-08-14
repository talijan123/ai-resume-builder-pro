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
  const {
    user,
    loading: authLoading,
  } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [plan, setPlan] = useState(null);
  const [subscription, setSubscription] =
    useState(null);

  /*
    IMPORTANT:

    Credits now come from:

    user_subscriptions.credits_remaining

    We are no longer using credit_balances.
  */
  const [credits, setCredits] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /* =======================================================
     LOAD PRICING DATA
  ======================================================= */

  const loadPricingData =
    useCallback(async () => {
      /* -----------------------------------------------------
         No authenticated user
      ----------------------------------------------------- */

      if (!user) {
        setPlan(null);
        setSubscription(null);
        setCredits(null);
        setError(null);
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(
          "🔄 Loading pricing data for user:",
          user.id
        );

        /* ===================================================
           1. GET USER SUBSCRIPTION
        =================================================== */

        const {
          data: subscriptionData,
          error: subscriptionError,
        } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (subscriptionError) {
          throw subscriptionError;
        }

        console.log(
          "✅ Subscription:",
          subscriptionData
        );

        /* ===================================================
           2. GET PLAN
        =================================================== */

        let planData = null;

        if (subscriptionData?.plan_id) {
          const {
            data,
            error: planError,
          } = await supabase
            .from("plans")
            .select(`
              id,
              name,
              slug,
              description,
              price_monthly,
              price_yearly,
              currency,
              max_resumes,
              monthly_credits,
              premium_templates,
              cover_letters,
              ats_optimization,
              ai_resume_generation,
              ai_resume_analysis,
              team_workspace,
              max_team_members,
              is_active,
              features
            `)
            .eq(
              "id",
              subscriptionData.plan_id
            )
            .maybeSingle();

          if (planError) {
            throw planError;
          }

          planData = data;

          /*
            Helpful debugging if subscription exists
            but the plan cannot be read.
          */

          if (
            subscriptionData &&
            !planData
          ) {
            console.warn(
              "⚠️ Subscription exists, but no plan was returned for plan_id:",
              subscriptionData.plan_id
            );
          }
        }

        console.log(
          "✅ Plan:",
          planData
        );

        /* ===================================================
           3. GET CREDIT BALANCE
           
           IMPORTANT:

           We DO NOT query credit_balances anymore.

           The source of truth is:

           user_subscriptions.credits_remaining
        =================================================== */

        const creditData =
          subscriptionData
            ? {
                user_id: user.id,

                credits_remaining:
                  Number(
                    subscriptionData.credits_remaining
                  ) || 0,
              }
            : null;

        console.log(
          "✅ Credit balance:",
          creditData
        );

        /* ===================================================
           4. SAVE STATE
        =================================================== */

        setSubscription(
          subscriptionData || null
        );

        setPlan(
          planData || null
        );

        setCredits(
          creditData
        );

      } catch (err) {
        console.error(
          "❌ Failed to load pricing data:",
          err
        );

        setError(
          err?.message ||
            "Failed to load pricing information."
        );

        setSubscription(null);
        setPlan(null);
        setCredits(null);

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
     REALTIME SUBSCRIPTION LISTENER
     
     IMPORTANT:

     Credits are stored inside the same table,
     so we only need ONE realtime listener.
  ======================================================= */

  useEffect(() => {
    if (
      !user ||
      authLoading
    ) {
      return;
    }

    console.log(
      "📡 Starting pricing realtime listener"
    );

    const pricingChannel =
      supabase
        .channel(
          `pricing-${user.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_subscriptions",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log(
              "🔄 Subscription realtime update:",
              payload
            );

            /*
              Reload:

              - subscription
              - credits_remaining
              - plan
            */

            loadPricingData();
          }
        )
        .subscribe((status) => {
          console.log(
            "📡 Pricing realtime status:",
            status
          );
        });

    return () => {
      console.log(
        "🧹 Cleaning pricing realtime listener"
      );

      supabase.removeChannel(
        pricingChannel
      );
    };
  }, [
    user,
    authLoading,
    loadPricingData,
  ]);

  /* =======================================================
     AVAILABLE CREDITS
  ======================================================= */

  const availableCredits =
    useMemo(() => {
      if (!credits) {
        return 0;
      }

      return Number(
        credits.credits_remaining || 0
      );
    }, [credits]);

  /* =======================================================
     PLAN NAME
  ======================================================= */

  const planName =
    useMemo(() => {
      return (
        plan?.name ||
        "Starter"
      );
    }, [plan]);

  /* =======================================================
     PLAN SLUG
  ======================================================= */

  const planSlug =
    useMemo(() => {
      return (
        plan?.slug ||
        "starter"
      );
    }, [plan]);

  /* =======================================================
     PLAN CHECKS
  ======================================================= */

  const isStarter =
    planSlug === "starter";

  const isPro =
    planSlug === "pro";

  const isTeam =
    planSlug === "team";

  /* =======================================================
     PREMIUM TEMPLATES
  ======================================================= */

  const canUsePremiumTemplates =
    useMemo(() => {
      return Boolean(
        plan?.premium_templates
      );
    }, [plan]);

  /* =======================================================
     COVER LETTERS
  ======================================================= */

  const canUseCoverLetters =
    useMemo(() => {
      return Boolean(
        plan?.cover_letters
      );
    }, [plan]);

  /* =======================================================
     AI RESUME GENERATION
  ======================================================= */

  const canUseAIResumeGeneration =
    useMemo(() => {
      return Boolean(
        plan?.ai_resume_generation
      );
    }, [plan]);

  /* =======================================================
     AI RESUME ANALYSIS
  ======================================================= */

  const canUseAIResumeAnalysis =
    useMemo(() => {
      return Boolean(
        plan?.ai_resume_analysis
      );
    }, [plan]);

  /* =======================================================
     ATS OPTIMIZATION
  ======================================================= */

  const canUseATSOptimization =
    useMemo(() => {
      return Boolean(
        plan?.ats_optimization
      );
    }, [plan]);

  /* =======================================================
     TEAM WORKSPACE
  ======================================================= */

  const canUseTeamWorkspace =
    useMemo(() => {
      return Boolean(
        plan?.team_workspace
      );
    }, [plan]);

  /* =======================================================
     MAX RESUMES
  ======================================================= */

  const maxResumes =
    useMemo(() => {
      /*
        null means unlimited.
      */

      if (
        plan?.max_resumes === null ||
        plan?.max_resumes === undefined
      ) {
        return null;
      }

      return Number(
        plan.max_resumes
      );
    }, [plan]);

  /* =======================================================
     MAX COVER LETTERS
  ======================================================= */

  const maxCoverLetters =
    useMemo(() => {
      /*
        Current plans schema does not contain
        max_cover_letters.

        If cover letters are enabled,
        return null to represent unlimited.
      */

      if (!canUseCoverLetters) {
        return 0;
      }

      return null;
    }, [
      canUseCoverLetters,
    ]);

  /* =======================================================
     MAX TEAM MEMBERS
  ======================================================= */

  const maxTeamMembers =
    useMemo(() => {
      return Number(
        plan?.max_team_members || 1
      );
    }, [plan]);

  /* =======================================================
     GENERIC FEATURE CHECK
  ======================================================= */

  const canUseFeature =
    useCallback(
      (feature) => {
        if (!plan) {
          return false;
        }

        switch (feature) {
          /* ---------------------------------------------
             Premium templates
          --------------------------------------------- */

          case "premium_templates":
            return Boolean(
              plan.premium_templates
            );

          /* ---------------------------------------------
             Cover letters
          --------------------------------------------- */

          case "cover_letters":
            return Boolean(
              plan.cover_letters
            );

          /* ---------------------------------------------
             AI
          --------------------------------------------- */

          case "ai":
          case "ai_resume_generation":
            return Boolean(
              plan.ai_resume_generation
            );

          /* ---------------------------------------------
             AI Resume Analysis
          --------------------------------------------- */

          case "ai_resume_analysis":
            return Boolean(
              plan.ai_resume_analysis
            );

          /* ---------------------------------------------
             ATS
          --------------------------------------------- */

          case "ats":
          case "ats_optimization":
            return Boolean(
              plan.ats_optimization
            );

          /* ---------------------------------------------
             Team
          --------------------------------------------- */

          case "team":
          case "team_workspace":
            return Boolean(
              plan.team_workspace
            );

          /* ---------------------------------------------
             Resume
          --------------------------------------------- */

          case "resume":
          case "resume_builder":
            return (
              Number(
                plan.max_resumes || 0
              ) > 0 ||
              plan.max_resumes === null
            );

          /* ---------------------------------------------
             Unknown
          --------------------------------------------- */

          default:
            return false;
        }
      },
      [plan]
    );

  /* =======================================================
     HAS ENOUGH CREDITS
  ======================================================= */

  const hasEnoughCredits =
    useCallback(
      (
        requiredCredits = 1
      ) => {
        return (
          availableCredits >=
          Number(
            requiredCredits
          )
        );
      },
      [availableCredits]
    );

  /* =======================================================
     REFRESH PRICING
  ======================================================= */

  const refreshPricing =
    useCallback(async () => {
      await loadPricingData();
    }, [
      loadPricingData,
    ]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({
        /* ---------------------------------------------
           Subscription
        --------------------------------------------- */

        subscription,

        /* ---------------------------------------------
           Current plan
        --------------------------------------------- */

        plan,

        planName,

        planSlug,

        /* ---------------------------------------------
           Plan checks
        --------------------------------------------- */

        isStarter,

        isPro,

        isTeam,

        /* ---------------------------------------------
           Credits
        --------------------------------------------- */

        credits,

        availableCredits,

        hasEnoughCredits,

        /* ---------------------------------------------
           Limits
        --------------------------------------------- */

        maxResumes,

        maxCoverLetters,

        maxTeamMembers,

        /* ---------------------------------------------
           Features
        --------------------------------------------- */

        canUsePremiumTemplates,

        canUseCoverLetters,

        canUseAIResumeGeneration,

        canUseAIResumeAnalysis,

        canUseATSOptimization,

        canUseTeamWorkspace,

        canUseFeature,

        /* ---------------------------------------------
           State
        --------------------------------------------- */

        loading,

        error,

        /* ---------------------------------------------
           Actions
        --------------------------------------------- */

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
        maxTeamMembers,

        canUsePremiumTemplates,
        canUseCoverLetters,
        canUseAIResumeGeneration,
        canUseAIResumeAnalysis,
        canUseATSOptimization,
        canUseTeamWorkspace,

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
    useContext(
      PricingContext
    );

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