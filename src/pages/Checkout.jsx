import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  HiCheck,
  HiArrowLeft,
  HiShieldCheck,
  HiLockClosed,
} from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";
import { pricingPlans } from "../components/sections/Pricing/pricingData";
import { supabase } from "../lib/supabase";

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, loading: authLoading } = useAuth();

  const [plan, setPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [pageError, setPageError] = useState("");

  const planId = searchParams.get("plan");

  const billingParam = searchParams.get("billing");

  const billing =
    billingParam === "yearly"
      ? "yearly"
      : "monthly";

  /* =====================================================
     FIND SELECTED PLAN
  ===================================================== */

  useEffect(() => {
    if (!planId) {
      navigate("/#pricing", {
        replace: true,
      });

      return;
    }

    /*
     * PricingCard currently sends the local pricing
     * plan ID.
     *
     * Example:
     * 1 = Starter
     * 2 = Pro
     * 3 = Team
     */

    const selectedPlan = pricingPlans.find(
      (item) =>
        String(item.id) === String(planId)
    );

    if (!selectedPlan) {
      navigate("/#pricing", {
        replace: true,
      });

      return;
    }

    setPlan(selectedPlan);
  }, [planId, navigate]);

  /* =====================================================
     CANCELLED PAYMENT CHECK
  ===================================================== */

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setPageError("Payment was cancelled or expired. You have not been charged.");
    }
  }, [searchParams]);

  /* =====================================================
     AUTH CHECK
  ===================================================== */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          redirectTo:
            `/checkout?plan=${planId}&billing=${billing}`,
        },
      });
    }
  }, [
    user,
    authLoading,
    navigate,
    planId,
    billing,
  ]);

  /* =====================================================
     PRICE
  ===================================================== */

  const price = useMemo(() => {
    if (!plan) {
      return 0;
    }

    return billing === "yearly"
      ? Number(plan.yearlyPrice || 0)
      : Number(plan.monthlyPrice || 0);
  }, [plan, billing]);

  const yearlyTotal = useMemo(() => {
    if (!plan) {
      return 0;
    }

    return Number(plan.yearlyTotal || 0);
  }, [plan]);

  /* =====================================================
     START CHECKOUT
  ===================================================== */

  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!plan) {
      return;
    }

    setProcessing(true);
    setPageError("");

    try {
      /* =================================================
         GET CURRENT SESSION
      ================================================= */

      const {
        data: {
          session,
        },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        navigate("/login", {
          replace: true,
          state: {
            redirectTo:
              `/checkout?plan=${planId}&billing=${billing}`,
          },
        });

        return;
      }

      /* =================================================
         IMPORTANT
         
         Do NOT send the price from the frontend.

         The Edge Function determines:
         - real plan
         - real price
         - currency
         - payment provider
      ================================================= */

      const {
        data,
        error,
      } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            planId:
              plan.name?.toLowerCase() === "pro"
                ? "pro"
                : plan.name?.toLowerCase() === "team"
                ? "team"
                : "starter",

            billing,
          },
        }
      );

      if (error) {
        console.error(
          "create-checkout error:",
          error
        );

        /*
         * Try to extract the actual Edge Function
         * response when Supabase returns a non-2xx error.
         */

        let message =
          "Unable to create checkout.";

        try {
          if (error.context) {
            const response =
              await error.context.json();

            if (response?.error) {
              message = response.error;
            }
          }
        } catch {
          // Ignore response parsing errors.
        }

        throw new Error(message);
      }

      console.log(
        "Checkout created successfully:",
        data
      );

      /* =================================================
         VALIDATE RESPONSE
      ================================================= */

      if (!data?.success) {
        throw new Error(
          data?.error ||
            "Checkout could not be created."
        );
      }

      /*
       * IMPORTANT:
       *
       * create-checkout has now created the pending
       * payment transaction.
       *
       * We do NOT activate Pro here.
       *
       * For our test payment flow, go to:
       *
       * /test-checkout
       *
       * and pass the INTERNAL payment ID.
       */

      /* =================================================
         REDIRECT TO SAFEPAY HOSTED CHECKOUT
      ================================================= */

      if (data?.checkoutUrl) {
        if (data.orderId) {
          localStorage.setItem("safepay_pending_order_id", data.orderId);
          sessionStorage.setItem("safepay_pending_order_id", data.orderId);
        }
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(
          "Checkout was created, but no checkout URL was returned."
        );
      }
    } catch (error) {
      console.error(
        "Checkout failed:",
        error
      );

      setPageError(
        error?.message ||
          "Unable to start checkout. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (authLoading || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-blue-600
            "
          />

          <p className="mt-4 font-semibold text-slate-700">
            Preparing checkout...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-5
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate("/#pricing")
            }
            className="
              flex
              items-center
              gap-2
              font-semibold
              text-slate-600
              transition
              hover:text-blue-600
            "
          >
            <HiArrowLeft size={20} />

            Back to Pricing
          </button>

          <div className="font-black text-slate-900">
            ResumeForge
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-500
            "
          >
            <HiLockClosed size={18} />

            Secure Checkout
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="
          mx-auto
          max-w-5xl
          px-6
          py-16
        "
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="mb-12 text-center">
          <p
            className="
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-blue-600
            "
          >
            Secure Checkout
          </p>

          <h1
            className="
              mt-3
              text-4xl
              font-black
              text-slate-900
              md:text-5xl
            "
          >
            Upgrade your ResumeForge plan
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              leading-7
              text-slate-600
            "
          >
            Review your plan before continuing
            to payment.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {pageError && (
          <div
            className="
              mb-8
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
              text-red-700
            "
          >
            <p className="font-bold">
              Checkout Error
            </p>

            <p className="mt-1 text-sm">
              {pageError}
            </p>
          </div>
        )}

        {/* =================================================
            CHECKOUT GRID
        ================================================= */}

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[1fr_420px]
          "
        >

          {/* =================================================
              PLAN SUMMARY
          ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-6
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-wider
                    text-blue-600
                  "
                >
                  Selected Plan
                </p>

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-slate-900
                  "
                >
                  {plan.name}
                </h2>

                <p
                  className="
                    mt-2
                    leading-7
                    text-slate-600
                  "
                >
                  {plan.description}
                </p>
              </div>

              {plan.badge && (
                <span
                  className="
                    rounded-full
                    bg-blue-100
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-blue-700
                  "
                >
                  {plan.badge}
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-slate-200" />

            <h3
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >
              What's included
            </h3>

            <div className="mt-5 space-y-4">
              {plan.features?.map(
                (feature) => (
                  <div
                    key={feature}
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <HiCheck
                      size={20}
                      className="
                        mt-0.5
                        shrink-0
                        text-green-500
                      "
                    />

                    <span className="text-slate-700">
                      {feature}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div
            className="
              h-fit
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-8
              shadow-xl
            "
          >
            <h2
              className="
                text-xl
                font-black
                text-slate-900
              "
            >
              Order Summary
            </h2>

            {/* PLAN */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-between
              "
            >
              <span className="text-slate-600">
                {plan.name}
              </span>

              <span
                className="
                  font-bold
                  text-slate-900
                "
              >
                ${price.toFixed(2)}
              </span>
            </div>

            {/* BILLING */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
              "
            >
              <span className="text-slate-600">
                Billing
              </span>

              <span
                className="
                  font-semibold
                  capitalize
                  text-slate-900
                "
              >
                {billing}
              </span>
            </div>

            {/* YEARLY */}

            {billing === "yearly" &&
              yearlyTotal > 0 && (
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span className="text-slate-600">
                    Annual total
                  </span>

                  <span
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    ${yearlyTotal.toFixed(2)}
                  </span>
                </div>
              )}

            <div className="my-6 h-px bg-slate-200" />

            {/* TOTAL */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                Total
              </span>

              <span
                className="
                  text-3xl
                  font-black
                  text-slate-900
                "
              >
                ${price.toFixed(2)}
              </span>
            </div>

            {/* PAYMENT BUTTON */}

            <button
              type="button"
              onClick={handlePayment}
              disabled={processing}
              className="
                mt-8
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                py-4
                font-bold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {processing ? (
                <>
                  <span
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />

                  Creating Checkout...
                </>
              ) : (
                `Continue with ${plan.name}`
              )}
            </button>

            {/* SECURITY */}

            <div
              className="
                mt-6
                flex
                items-start
                gap-3
                rounded-2xl
                bg-green-50
                p-4
              "
            >
              <HiShieldCheck
                size={24}
                className="
                  shrink-0
                  text-green-600
                "
              />

              <p
                className="
                  text-sm
                  leading-6
                  text-green-700
                "
              >
                Your subscription is not activated
                from this page. Payment confirmation
                will be handled securely by the backend.
              </p>
            </div>

            {/* TEST MODE NOTICE */}

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-blue-100
                bg-blue-50
                p-4
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-blue-700
                "
              >
                Development Mode
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-blue-700
                "
              >
                You will continue to the test payment
                screen. No real payment will be charged.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}