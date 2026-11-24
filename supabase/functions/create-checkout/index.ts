import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * ============================================================================
 * REQUIRED SUPABASE EDGE FUNCTION SECRETS
 * ============================================================================
 * Set these secrets in your Supabase project (Settings -> Edge Functions -> Secrets):
 * 
 * 1. SAFEPAY_API_KEY          -> Your Safepay API / Client Key (from Safepay Merchant Portal)
 * 2. SAFEPAY_SECRET_KEY       -> Your Safepay Secret Key (optional for init, used for merchant auth)
 * 3. SAFEPAY_ENVIRONMENT      -> "sandbox" (default for testing) or "production"
 * 4. APP_FRONTEND_URL         -> "http://localhost:5173" (dev) or "https://yourdomain.com" (prod)
 * 5. ALLOW_TEST_PAYMENTS      -> Optional boolean ("true" / "false").
 *                                ⚠️ SECURITY WARNING: MUST NEVER be set to "true" in production!
 *                                Only set to "true" in local dev environments where Safepay keys are not yet configured.
 * 6. SUPABASE_URL             -> Automatically injected by Supabase
 * 7. SUPABASE_SERVICE_ROLE_KEY-> Automatically injected by Supabase
 * ============================================================================
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/* =========================================================
   ALLOWED PLANS (TRUSTED DB CONFIGURATION)
========================================================= */

const ALLOWED_PLANS = {
  pro: true,
  team: true,
} as const;

type PlanSlug = keyof typeof ALLOWED_PLANS;

/* =========================================================
   JSON RESPONSE HELPER
========================================================= */

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

/* =========================================================
   EDGE FUNCTION: CREATE SAFEPAY CHECKOUT
========================================================= */

Deno.serve(async (req) => {
  /* -------------------------------------------------------
     1. CORS PREFLIGHT
  ------------------------------------------------------- */
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  /* -------------------------------------------------------
     2. METHOD VALIDATION
  ------------------------------------------------------- */
  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "Method not allowed.",
      },
      405
    );
  }

  try {
    /* -----------------------------------------------------
       3. ENVIRONMENT VALIDATION & SECURITY CONFIG
    ----------------------------------------------------- */
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const safepayApiKey = Deno.env.get("SAFEPAY_API_KEY");
    const safepaySecretKey = Deno.env.get("SAFEPAY_SECRET_KEY") || "";
    const safepayEnv = (Deno.env.get("SAFEPAY_ENVIRONMENT") || "sandbox").toLowerCase();
    const frontendUrl = Deno.env.get("APP_FRONTEND_URL") || "http://localhost:5173";
    const allowTestPayments = (Deno.env.get("ALLOW_TEST_PAYMENTS") || "false").toLowerCase() === "true";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables.");
      return jsonResponse(
        { error: "Server configuration error: Supabase credentials missing." },
        500
      );
    }

    /* Fail closed if Safepay is not configured and test payments are not explicitly enabled */
    if (!safepayApiKey && !allowTestPayments) {
      console.error("❌ SAFEPAY_API_KEY is not configured and ALLOW_TEST_PAYMENTS is not enabled.");
      return jsonResponse(
        {
          error: "Payment gateway is not configured on this server (SAFEPAY_API_KEY is missing).",
        },
        500
      );
    }

    const isProduction = safepayEnv === "production";
    const safepayApiBase = isProduction
      ? "https://api.getsafepay.com"
      : "https://sandbox.api.getsafepay.com";
    const safepayCheckoutBase = isProduction
      ? "https://getsafepay.com/checkout/pay"
      : "https://sandbox.api.getsafepay.com/checkout/pay";

    /* -----------------------------------------------------
       4. AUTHENTICATION (VALIDATE USER JWT)
    ----------------------------------------------------- */
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse(
        { error: "Authentication required. Please log in." },
        401
      );
    }

    const userClient = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error("Authentication error:", userError);
      return jsonResponse(
        { error: "Invalid or expired session. Please log in again." },
        401
      );
    }

    /* -----------------------------------------------------
       5. READ & VALIDATE REQUEST PAYLOAD
    ----------------------------------------------------- */
    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON request body." },
        400
      );
    }

    const requestedPlan = body?.planId;
    const billing = body?.billing === "yearly" ? "yearly" : "monthly";

    if (typeof requestedPlan !== "string" || !Object.prototype.hasOwnProperty.call(ALLOWED_PLANS, requestedPlan)) {
      return jsonResponse(
        { error: "Invalid or unavailable plan selected." },
        400
      );
    }

    const planSlug = requestedPlan as PlanSlug;

    /* -----------------------------------------------------
       6. FETCH TRUSTED PLAN DETAILS FROM DATABASE
    ----------------------------------------------------- */
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: plan,
      error: planError,
    } = await adminClient
      .from("plans")
      .select(`
        id,
        name,
        slug,
        price_monthly,
        price_yearly,
        currency,
        monthly_credits,
        is_active
      `)
      .eq("slug", planSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (planError || !plan) {
      console.error("Plan lookup failed:", planError);
      return jsonResponse(
        { error: "Selected plan is currently unavailable." },
        404
      );
    }

    const amount = billing === "yearly"
      ? Number(plan.price_yearly)
      : Number(plan.price_monthly);

    const currency = plan.currency || "PKR";

    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse(
        { error: "Invalid plan pricing configuration." },
        500
      );
    }

    /* -----------------------------------------------------
       7. GENERATE INTERNAL ORDER ID
    ----------------------------------------------------- */
    const orderId = `RF-${crypto.randomUUID()}`;

    /* -----------------------------------------------------
       8. INITIALIZE SAFEPAY PAYMENT TRACKER

       IMPORTANT: Verified against real Safepay dashboard transaction data,
       not just API docs: for a PKR 2,999 plan, sending amount: 2999 to
       /order/v1/init correctly shows as PKR 2,999.00 in the dashboard,
       while amount: 299900 (100x inflated) appeared as PKR 299,900.00.

       Safepay's v1 payment init request expects the plain rupee amount as-is
       for PKR, not the smallest-unit paisa value.
    ----------------------------------------------------- */
    let trackerToken = "";
    let checkoutUrl = "";

    if (safepayApiKey) {
      console.log(`📡 Initializing Safepay Tracker (${safepayEnv}):`, {
        orderId,
        amount,
        currency,
        plan: plan.name,
      });

      const trackerHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (safepaySecretKey) {
        trackerHeaders["X-SFPY-MERCHANT-SECRET"] = safepaySecretKey;
      }

      const trackerRes = await fetch(`${safepayApiBase}/order/v1/init`, {
        method: "POST",
        headers: trackerHeaders,
        body: JSON.stringify({
          client: safepayApiKey,
          amount: amount,
          currency: currency,
          environment: safepayEnv,
        }),
      });

      const trackerData = await trackerRes.json().catch(() => null);

      if (!trackerRes.ok || !trackerData?.data?.token) {
        console.error("❌ Safepay Tracker init failed:", {
          status: trackerRes.status,
          response: trackerData,
        });

        return jsonResponse(
          {
            error: trackerData?.status?.message || trackerData?.message || "Failed to initialize Safepay payment session. Please try again.",
            details: trackerData?.status?.errors || [],
          },
          502
        );
      }

      trackerToken = trackerData.data.token;

      const redirectUrl = `${frontendUrl}/payment/callback`;
      const cancelUrl = `${frontendUrl}/checkout?plan=${encodeURIComponent(plan.slug)}&billing=${encodeURIComponent(billing)}&cancelled=true`;

      checkoutUrl = `${safepayCheckoutBase}?beacon=${encodeURIComponent(trackerToken)}&source=custom&env=${encodeURIComponent(safepayEnv)}&order_id=${encodeURIComponent(orderId)}&webhooks=true&redirect_url=${encodeURIComponent(redirectUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
    } else if (allowTestPayments) {
      /* Strictly gated test fallback for local development only */
      console.warn("⚠️ ALLOW_TEST_PAYMENTS enabled for development. Using mock test checkout.");
      trackerToken = `mock-trk-${crypto.randomUUID()}`;
      checkoutUrl = `${frontendUrl}/test-checkout?orderId=${encodeURIComponent(orderId)}`;
    }

    /* -----------------------------------------------------
       9. RECORD TRANSACTION IN DATABASE
    ----------------------------------------------------- */
    const {
      data: payment,
      error: paymentError,
    } = await adminClient
      .from("payment_transactions")
      .insert({
        user_id: user.id,
        order_id: orderId,
        provider: safepayApiKey ? "safepay" : "test",
        plan_id: plan.id,
        billing_cycle: billing,
        amount,
        currency,
        status: "pending",
        provider_payment_id: trackerToken,
      })
      .select("id, order_id, plan_id, billing_cycle, amount, currency, status")
      .single();

    if (paymentError) {
      console.error("Payment transaction insert failed:", paymentError);
      return jsonResponse(
        { error: "Could not create payment transaction." },
        500
      );
    }

    console.log("✅ Checkout session created successfully:", {
      orderId,
      paymentId: payment.id,
      provider: safepayApiKey ? "safepay" : "test",
      trackerToken,
    });

    /* -----------------------------------------------------
       10. RETURN SUCCESSFUL CHECKOUT RESPONSE
    ----------------------------------------------------- */
    return jsonResponse({
      success: true,
      checkoutReady: true,
      orderId,
      paymentId: payment.id,
      plan: {
        id: plan.id,
        name: plan.name,
        slug: plan.slug,
      },
      billing,
      amount,
      currency,
      trackerToken,
      checkoutUrl,
    });
  } catch (error) {
    console.error("create-checkout unhandled error:", error);
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout initialization failed unexpectedly.",
      },
      500
    );
  }
});