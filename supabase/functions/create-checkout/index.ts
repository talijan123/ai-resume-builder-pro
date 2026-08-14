import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

/*
=========================================================
TRUSTED PLAN CONFIGURATION
=========================================================

The frontend sends only the plan slug.

The actual plan UUID is retrieved from the database.

The frontend NEVER supplies:
- price
- currency
- plan UUID
*/

const ALLOWED_PLANS = {
  pro: true,
  team: true,
} as const;

type PlanSlug = keyof typeof ALLOWED_PLANS;

/*
=========================================================
JSON RESPONSE
=========================================================
*/

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

/*
=========================================================
EDGE FUNCTION
=========================================================
*/

Deno.serve(async (req) => {
  /*
  =======================================================
  CORS
  =======================================================
  */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  /*
  =======================================================
  METHOD
  =======================================================
  */

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed.",
      },
      405
    );
  }

  try {
    /*
    =====================================================
    ENVIRONMENT
    =====================================================
    */

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      console.error(
        "Missing Supabase environment variables."
      );

      return jsonResponse(
        {
          error:
            "Server configuration error.",
        },
        500
      );
    }

    /*
    =====================================================
    AUTHENTICATION
    =====================================================
    */

    const authHeader =
      req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse(
        {
          error:
            "Authentication required.",
        },
        401
      );
    }

    /*
    =====================================================
    USER CLIENT
    =====================================================

    This client uses the user's JWT to verify
    the authenticated user.
    */

    const userClient =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          global: {
            headers: {
              Authorization:
                authHeader,
            },
          },
        }
      );

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await userClient.auth.getUser();

    if (
      userError ||
      !user
    ) {
      console.error(
        "Authentication error:",
        userError
      );

      return jsonResponse(
        {
          error:
            "Invalid authentication session.",
        },
        401
      );
    }

    /*
    =====================================================
    SERVICE ROLE CLIENT
    =====================================================

    Used only inside this trusted Edge Function.

    NEVER expose this key to React.
    */

    const adminClient =
      createClient(
        supabaseUrl,
        serviceRoleKey
      );

    /*
    =====================================================
    READ REQUEST
    =====================================================
    */

    let body: Record<
      string,
      unknown
    >;

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        {
          error:
            "Invalid JSON request.",
        },
        400
      );
    }

    const requestedPlan =
      body?.planId;

    const billing =
      body?.billing === "yearly"
        ? "yearly"
        : "monthly";

    /*
    =====================================================
    VALIDATE PLAN SLUG
    =====================================================
    */

    if (
      typeof requestedPlan !==
      "string"
    ) {
      return jsonResponse(
        {
          error:
            "Plan is required.",
        },
        400
      );
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        ALLOWED_PLANS,
        requestedPlan
      )
    ) {
      return jsonResponse(
        {
          error:
            "Invalid or unavailable plan.",
        },
        400
      );
    }

    const planSlug =
      requestedPlan as PlanSlug;

    /*
    =====================================================
    GET PLAN FROM DATABASE
    =====================================================

    IMPORTANT:

    We get the UUID, price and currency
    from the trusted database.

    We do NOT trust the frontend.
    */

    const {
      data: plan,
      error: planError,
    } =
      await adminClient
        .from("plans")
        .select(
          `
            id,
            name,
            slug,
            price_monthly,
            price_yearly,
            currency,
            monthly_credits,
            is_active
          `
        )
        .eq(
          "slug",
          planSlug
        )
        .eq(
          "is_active",
          true
        )
        .maybeSingle();

    if (
      planError
    ) {
      console.error(
        "Plan lookup failed:",
        planError
      );

      return jsonResponse(
        {
          error:
            "Unable to load plan.",
        },
        500
      );
    }

    if (!plan) {
      return jsonResponse(
        {
          error:
            "Selected plan is unavailable.",
        },
        404
      );
    }

    /*
    =====================================================
    TRUSTED PRICE
    =====================================================
    */

    const amount =
      billing === "yearly"
        ? Number(
            plan.price_yearly
          )
        : Number(
            plan.price_monthly
          );

    const currency =
      plan.currency || "USD";

    /*
    =====================================================
    VALIDATE PRICE
    =====================================================
    */

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return jsonResponse(
        {
          error:
            "Invalid plan pricing.",
        },
        500
      );
    }

    /*
    =====================================================
    CREATE INTERNAL ORDER ID
    =====================================================
    */

    const orderId =
      `RF-${crypto.randomUUID()}`;

    /*
    =====================================================
    CREATE PAYMENT TRANSACTION
    =====================================================

    plan_id receives:

    plan.id

    NOT:

    "pro"

    This fixes the UUID error.
    */

    const {
      data: payment,
      error: paymentError,
    } =
      await adminClient
        .from(
          "payment_transactions"
        )
        .insert({
          user_id: user.id,

          order_id: orderId,

          provider:
            "test",

          plan_id:
            plan.id,

          billing_cycle:
            billing,

          amount,

          currency,

          status:
            "pending",
        })
        .select(
          "id, order_id, plan_id, billing_cycle, amount, currency, status"
        )
        .single();

    if (
      paymentError
    ) {
      console.error(
        "Payment transaction insert failed:",
        paymentError
      );

      return jsonResponse(
        {
          error:
            "Could not create payment transaction.",
        },
        500
      );
    }

    /*
    =====================================================
    TEMPORARY TEST CHECKOUT
    =====================================================

    This is intentionally NOT activating Pro.

    The test checkout page/webhook will handle
    the successful payment simulation.
    */

    console.log(
      "Checkout created successfully:",
      {
        userId:
          user.id,

        orderId,

        paymentId:
          payment.id,

        planId:
          plan.id,

        planSlug:
          plan.slug,

        billing,

        amount,

        currency,
      }
    );

    /*
    =====================================================
    RESPONSE
    =====================================================
    */

    return jsonResponse({
      success: true,

      checkoutReady: true,

      orderId,

      paymentId:
        payment.id,

      plan: {
        id:
          plan.id,

        name:
          plan.name,

        slug:
          plan.slug,
      },

      billing,

      amount,

      currency,

      /*
      The frontend can now navigate
      to the test payment page.
      */

      checkoutUrl:
        `/test-checkout?orderId=${encodeURIComponent(
          orderId
        )}`,
    });
  } catch (error) {
    console.error(
      "create-checkout error:",
      error
    );

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout initialization failed.",
      },
      500
    );
  }
});