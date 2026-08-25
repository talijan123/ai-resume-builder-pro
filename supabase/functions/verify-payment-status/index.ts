import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * ============================================================================
 * EDGE FUNCTION: verify-payment-status
 * ============================================================================
 * Webhook-independent payment verification using Safepay's tracker status
 * endpoint as the source of truth. Called by the frontend when webhook
 * delivery fails (the normal case in Safepay sandbox/production right now).
 *
 * Security model:
 *  - Requires a valid Supabase JWT (authenticated user)
 *  - Verifies the payment_transaction row belongs to the requesting user
 *    before touching any external API
 *  - Idempotent: returns immediately if already paid
 *  - Calls the SAME activate_paid_subscription RPC used by payment-webhook
 *    so both paths converge on a single atomic activation function
 *
 * Required Supabase secrets (already set by create-checkout):
 *  - SUPABASE_URL             (auto-injected)
 *  - SUPABASE_SERVICE_ROLE_KEY (auto-injected)
 *  - SAFEPAY_ENVIRONMENT      ("sandbox" | "production")
 * ============================================================================
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Case-insensitive currency comparison ("PKR" === "pkr"). */
function currencyMatches(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase();
}

Deno.serve(async (req) => {
  /* -------------------------------------------------------
     1. CORS PREFLIGHT
  ------------------------------------------------------- */
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    /* -----------------------------------------------------
       2. ENVIRONMENT SETUP
    ----------------------------------------------------- */
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const safepayEnv = (
      Deno.env.get("SAFEPAY_ENVIRONMENT") || "sandbox"
    ).toLowerCase();

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("❌ Missing Supabase environment variables.");
      return jsonResponse(
        { error: "Server configuration error: database credentials missing." },
        500
      );
    }

    // Mirror the base URL logic from create-checkout
    const safepayApiBase =
      safepayEnv === "production"
        ? "https://api.getsafepay.com"
        : "https://sandbox.api.getsafepay.com";

    /* -----------------------------------------------------
       3. AUTHENTICATE THE REQUESTING USER (JWT REQUIRED)
    ----------------------------------------------------- */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(
        { error: "Authentication required. Please log in." },
        401
      );
    }

    // Admin client — for DB writes and RPC calls (uses service-role key)
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // User client — validates the JWT and extracts the authenticated user
    const userClient = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      console.error("Auth error:", userError);
      return jsonResponse(
        { error: "Invalid or expired session. Please log in again." },
        401
      );
    }

    /* -----------------------------------------------------
       4. PARSE & VALIDATE REQUEST BODY
    ----------------------------------------------------- */
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request body." }, 400);
    }

    const orderId = body?.order_id;
    if (typeof orderId !== "string" || !orderId.trim()) {
      return jsonResponse(
        { error: "Missing or invalid order_id in request body." },
        400
      );
    }

    /* -----------------------------------------------------
       5. LOOK UP PAYMENT TRANSACTION + VERIFY OWNERSHIP
       Security: Confirm this order belongs to the JWT user
       before making any external API calls.
    ----------------------------------------------------- */
    const { data: payment, error: paymentError } = await adminClient
      .from("payment_transactions")
      .select(
        "id, user_id, order_id, provider, plan_id, billing_cycle, amount, currency, status, provider_payment_id, provider_subscription_id"
      )
      .eq("order_id", orderId)
      .maybeSingle();

    if (paymentError) {
      console.error("Payment lookup DB error:", paymentError);
      return jsonResponse(
        { error: "Database error during payment lookup." },
        500
      );
    }

    if (!payment) {
      return jsonResponse(
        { error: "Payment transaction not found for this order." },
        404
      );
    }

    // Row ownership check — reject if the transaction belongs to a different user
    if (payment.user_id !== user.id) {
      console.error(
        `🚫 Ownership mismatch: JWT user ${user.id} tried to verify order owned by ${payment.user_id}`
      );
      return jsonResponse(
        { error: "Access denied: this order does not belong to your account." },
        403
      );
    }

    /* -----------------------------------------------------
       6. IDEMPOTENCY SHORT-CIRCUIT
       If the webhook already processed this, return immediately
       without calling Safepay's API again.
    ----------------------------------------------------- */
    if (payment.status === "paid") {
      console.log("⚡ Already paid (idempotent return):", orderId);
      return jsonResponse({
        success: true,
        status: "paid",
        already_processed: true,
        order_id: orderId,
      });
    }

    // For non-Safepay providers (e.g. "test"), we can't poll Safepay's API
    if (!payment.provider_payment_id || payment.provider === "test") {
      console.warn(
        "⚠️ No Safepay tracker token on record (test provider or missing provider_payment_id):",
        orderId
      );
      return jsonResponse({
        success: false,
        status: payment.status,
        message:
          "This transaction has no Safepay tracker token and cannot be verified via the API.",
        order_id: orderId,
      });
    }

    /* -----------------------------------------------------
       7. CALL SAFEPAY TRACKER STATUS ENDPOINT
       GET /order/v1/{tracker_token}
       No auth header required — endpoint is public per probe results.
       Both sandbox and production use the same path structure.
    ----------------------------------------------------- */
    const trackerUrl = `${safepayApiBase}/order/v1/${payment.provider_payment_id}`;
    console.log(`📡 Polling Safepay tracker: ${trackerUrl}`);

    let safepayResponseData: Record<string, unknown>;
    try {
      const safepayRes = await fetch(trackerUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!safepayRes.ok) {
        console.error(
          `❌ Safepay API returned HTTP ${safepayRes.status} for tracker ${payment.provider_payment_id}`
        );
        return jsonResponse(
          {
            success: false,
            status: "pending",
            message:
              "Could not reach payment provider to verify status. Try again shortly.",
            order_id: orderId,
          },
          502
        );
      }

      safepayResponseData = await safepayRes.json();
    } catch (fetchErr) {
      console.error("Safepay fetch error:", fetchErr);
      return jsonResponse(
        {
          success: false,
          status: "pending",
          message: "Network error contacting payment provider.",
          order_id: orderId,
        },
        502
      );
    }

    const trackerData = safepayResponseData?.data as Record<string, unknown> | null;
    const trackerState = String(trackerData?.state ?? "").toUpperCase();
    const trackerTransaction = (trackerData?.transaction ?? null) as Record<string, unknown> | null;

    console.log("📦 Safepay tracker response:", {
      orderId,
      trackerToken: payment.provider_payment_id,
      trackerState,
      hasTransaction: trackerTransaction !== null,
    });

    /* -----------------------------------------------------
       8. EVALUATE TRACKER STATE
    ----------------------------------------------------- */

    // ── CASE A: Payment confirmed ─────────────────────────────────────────────
    if (trackerState === "TRACKER_ENDED" && trackerTransaction !== null) {
      // Amount comparison: numeric so DB's "2999.00" (decimal string) ===
      // Safepay's 2999 (JSON number). Both convert cleanly via Number().
      const safepayAmount = Number(trackerTransaction.amount);
      const safepayCurrency = String(trackerTransaction.currency ?? "");
      const expectedAmount = Number(payment.amount);
      const expectedCurrency = String(payment.currency ?? "");

      const amountMatches = safepayAmount === expectedAmount;
      const currencyOk = currencyMatches(safepayCurrency, expectedCurrency);

      if (!amountMatches || !currencyOk || safepayAmount <= 0) {
        console.error("❌ Amount/currency mismatch — refusing to activate:", {
          expected: { amount: expectedAmount, currency: expectedCurrency },
          received: { amount: safepayAmount, currency: safepayCurrency },
          orderId,
        });

        // Record the discrepancy as failed so we don't retry indefinitely
        await adminClient
          .from("payment_transactions")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", payment.id);

        return jsonResponse({
          success: false,
          status: "failed",
          error:
            "Payment amount or currency does not match the expected order value. Contact support.",
          order_id: orderId,
          expected: { amount: expectedAmount, currency: expectedCurrency },
          received: { amount: safepayAmount, currency: safepayCurrency },
        });
      }

      // ── Activate subscription via the SAME RPC the webhook uses ──────────
      console.log(
        "💳 Triggering activate_paid_subscription RPC for order:",
        orderId
      );

      const { data: activationResult, error: activationError } =
        await adminClient.rpc("activate_paid_subscription", {
          p_order_id: orderId,
          p_provider_payment_id: payment.provider_payment_id,
          p_provider_subscription_id: null,
        });

      if (activationError) {
        console.error("❌ RPC activation error:", activationError);
        return jsonResponse(
          {
            success: false,
            status: "failed",
            error:
              "Payment verified but subscription activation failed. Contact support.",
            order_id: orderId,
            details: activationError.message,
          },
          500
        );
      }

      console.log("✅ Subscription activated via verify-payment-status:", {
        orderId,
        paymentId: payment.id,
        activationResult,
      });

      return jsonResponse({
        success: true,
        status: "paid",
        already_processed: false,
        order_id: orderId,
        payment_id: payment.id,
        activation: activationResult,
        safepay: {
          state: trackerState,
          transaction_token: String(trackerTransaction.token ?? ""),
          amount: safepayAmount,
          currency: safepayCurrency,
        },
      });
    }

    // ── CASE B: Safepay reports terminal failure / cancellation ───────────────
    const terminalFailureStates = new Set([
      "TRACKER_CANCELLED",
      "TRACKER_FAILED",
      "TRACKER_EXPIRED",
      "PAYMENT_FAILED",
      "PAYMENT_CANCELLED",
      "FAILED",
      "CANCELLED",
      "EXPIRED",
    ]);

    if (
      terminalFailureStates.has(trackerState) ||
      (trackerState === "TRACKER_ENDED" && trackerTransaction === null)
    ) {
      console.warn(
        `⚠️ Safepay tracker in terminal failed state: ${trackerState}`,
        orderId
      );

      await adminClient
        .from("payment_transactions")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      return jsonResponse({
        success: true,
        status: "failed",
        order_id: orderId,
        safepay_state: trackerState,
        message:
          "The payment was declined or cancelled by the payment provider.",
      });
    }

    // ── CASE C: TRACKER_STARTED — payment genuinely still in progress ─────────
    // Do NOT treat this as an error; the user may still be on the payment page.
    console.log(
      `ℹ️ Tracker still pending (${trackerState}) for order: ${orderId}`
    );

    return jsonResponse({
      success: true,
      status: "pending",
      order_id: orderId,
      safepay_state: trackerState,
      message:
        "Payment is still being processed. Please wait a moment and try again.",
    });
  } catch (error) {
    console.error("verify-payment-status unhandled error:", error);
    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during payment verification.",
      },
      500
    );
  }
});
