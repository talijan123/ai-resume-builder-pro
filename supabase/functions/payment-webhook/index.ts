import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * ============================================================================
 * REQUIRED SUPABASE EDGE FUNCTION SECRETS
 * ============================================================================
 * Set these secrets in your Supabase project (Settings -> Edge Functions -> Secrets):
 * 
 * 1. SAFEPAY_WEBHOOK_SECRET   -> Secret key from Safepay Merchant Dashboard to sign webhooks
 * 2. ALLOW_TEST_PAYMENTS      -> Optional boolean ("true" / "false").
 *                                ⚠️ SECURITY CRITICAL: MUST NEVER be set to "true" in production!
 *                                When false/absent, any unverified or test payload is rejected.
 * 3. SUPABASE_URL             -> Automatically injected by Supabase
 * 4. SUPABASE_SERVICE_ROLE_KEY-> Automatically injected by Supabase
 * ============================================================================
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sfpy-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
   TIMING-SAFE HMAC-SHA256 SIGNATURE VERIFICATION
========================================================= */

async function computeHmacSha256Hex(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const computedBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  return Array.from(new Uint8Array(computedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase();
}

async function verifyHmacSha256(
  rawBody: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  try {
    const computedHex = await computeHmacSha256Hex(rawBody, secret);
    const cleanSignature = signatureHeader.trim().toLowerCase();

    if (computedHex.length !== cleanSignature.length) {
      return false;
    }

    // Timing-safe XOR comparison to mitigate side-channel timing attacks
    let match = 0;
    for (let i = 0; i < computedHex.length; i++) {
      match |= computedHex.charCodeAt(i) ^ cleanSignature.charCodeAt(i);
    }

    return match === 0;
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

/* =========================================================
   EDGE FUNCTION: PAYMENT WEBHOOK HANDLER
========================================================= */

Deno.serve(async (req) => {
  /* -------------------------------------------------------
     ⚡ DIAGNOSTIC: Log every inbound request immediately
     Remove this block once webhook delivery is confirmed.
  ------------------------------------------------------- */
  console.log("🔔 WEBHOOK HIT", req.method, req.url);

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
      { success: false, error: "Method not allowed." },
      405
    );
  }

  try {
    /* -----------------------------------------------------
       3. ENVIRONMENT VALIDATION (FAIL-CLOSED SECURITY)
    ----------------------------------------------------- */
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const webhookSecret = Deno.env.get("SAFEPAY_WEBHOOK_SECRET");
    const allowTestPayments = (Deno.env.get("ALLOW_TEST_PAYMENTS") || "false").toLowerCase() === "true";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("❌ Supabase server environment variables are missing.");
      return jsonResponse(
        { success: false, error: "Server misconfigured: database credentials missing." },
        500
      );
    }

    // Fail closed: Webhook secret MUST be configured unless explicit local dev test flag is active
    if (!webhookSecret && !allowTestPayments) {
      console.error("❌ CRITICAL: SAFEPAY_WEBHOOK_SECRET is not configured on the server.");
      return jsonResponse(
        { success: false, error: "Server misconfigured: webhook secret not set." },
        500
      );
    }

    /* -----------------------------------------------------
       4. READ RAW BODY (MANDATORY FOR HMAC INTEGRITY)
    ----------------------------------------------------- */
    const rawBody = await req.text();

    if (!rawBody || rawBody.trim() === "") {
      return jsonResponse(
        { success: false, error: "Empty webhook payload." },
        400
      );
    }

    let parsedBody: Record<string, any> = {};

    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        { success: false, error: "Invalid JSON payload." },
        400
      );
    }

    const isTestPayment = parsedBody?.test_payment === true;

    /* -----------------------------------------------------
       5. SECURITY & SIGNATURE VERIFICATION
    ----------------------------------------------------- */
    if (isTestPayment) {
      if (!allowTestPayments) {
        console.error("🚫 Test payment rejected: ALLOW_TEST_PAYMENTS is disabled.");
        return jsonResponse(
          {
            success: false,
            error: "Test payment simulation is disabled on this server.",
          },
          403
        );
      }
      console.warn("⚠️ Processing test payment simulation (ALLOW_TEST_PAYMENTS is active).");
    } else {
      const headerCandidates = {
        x_sfpy_signature: req.headers.get("x-sfpy-signature"),
        X_SFPY_SIGNATURE: req.headers.get("X-SFPY-SIGNATURE"),
        x_safepay_signature: req.headers.get("x-safepay-signature"),
      };
      const signature =
        headerCandidates.x_sfpy_signature ||
        headerCandidates.X_SFPY_SIGNATURE ||
        headerCandidates.x_safepay_signature;

      const timestampHeader =
        req.headers.get("x-sfpy-timestamp") ||
        req.headers.get("X-SFPY-TIMESTAMP") ||
        req.headers.get("x-safepay-timestamp") ||
        null;

      const computedHmacHex = webhookSecret
        ? await computeHmacSha256Hex(rawBody, webhookSecret)
        : null;

      console.log("🔎 Safepay webhook signature debug:", {
        allHeaderNames: Array.from(req.headers.keys()),
        signatureHeaderValues: headerCandidates,
        selectedSignatureHeader: signature || null,
        timestampHeader,
        rawBodyLength: rawBody.length,
        rawBodyFirst20: rawBody.slice(0, 20),
        rawBodyLast20: rawBody.slice(-20),
        computedHmacHex,
        hasWebhookSecret: Boolean(webhookSecret && webhookSecret.trim().length > 0),
      });

      if (!signature) {
        console.error("❌ Missing x-sfpy-signature header on incoming webhook.");
        return jsonResponse(
          { success: false, error: "Unauthorized: Missing webhook signature." },
          401
        );
      }

      if (!webhookSecret) {
        console.error("❌ SAFEPAY_WEBHOOK_SECRET missing during signature check.");
        return jsonResponse(
          { success: false, error: "Server misconfigured: webhook secret not set." },
          500
        );
      }

      const isValid = await verifyHmacSha256(rawBody, signature, webhookSecret);

      if (!isValid) {
        console.error("❌ Invalid Safepay webhook signature.");
        return jsonResponse(
          { success: false, error: "Unauthorized: Invalid webhook signature." },
          401
        );
      }

      console.log("✅ Safepay webhook signature verified successfully.");
    }

    /* -----------------------------------------------------
       6. INITIALIZE ADMIN SUPABASE CLIENT
    ----------------------------------------------------- */
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    /* -----------------------------------------------------
       7. EXTRACT ORDER & PAYMENT STATE
    ----------------------------------------------------- */
    const orderId =
      parsedBody?.data?.order_id ||
      parsedBody?.data?.metadata?.order_id ||
      parsedBody?.data?.tracker?.order_id ||
      parsedBody?.order_id;

    const trackerToken =
      parsedBody?.data?.token ||
      parsedBody?.data?.tracker?.token ||
      parsedBody?.token ||
      parsedBody?.payment_id ||
      null;

    const rawState = String(
      parsedBody?.data?.state ||
      parsedBody?.data?.tracker?.state ||
      parsedBody?.state ||
      parsedBody?.event ||
      (isTestPayment ? "PAID" : "")
    ).toUpperCase();

    console.log("📦 Webhook Event Data:", {
      orderId,
      trackerToken,
      rawState,
      isTestPayment,
    });

    if (!orderId) {
      console.error("❌ Missing order_id in payment webhook payload.");
      return jsonResponse(
        { success: false, error: "Missing order_id." },
        400
      );
    }

    /* -----------------------------------------------------
       8. FIND TRANSACTION IN DATABASE
    ----------------------------------------------------- */
    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payment_transactions")
      .select(`
        id,
        user_id,
        order_id,
        provider,
        plan_id,
        billing_cycle,
        amount,
        currency,
        status,
        provider_payment_id,
        provider_subscription_id
      `)
      .eq("order_id", orderId)
      .maybeSingle();

    if (paymentError) {
      console.error("Payment lookup failed:", paymentError);
      return jsonResponse(
        {
          success: false,
          error: "Database error during payment lookup.",
          details: paymentError.message,
        },
        500
      );
    }

    if (!payment) {
      console.error("❌ Payment transaction not found for order:", orderId);
      return jsonResponse(
        {
          success: false,
          error: "Payment transaction not found.",
          order_id: orderId,
        },
        404
      );
    }

    /* -----------------------------------------------------
       9. IDEMPOTENCY CHECK
    ----------------------------------------------------- */
    if (payment.status === "paid") {
      console.log("⚡ Payment already marked as paid (Idempotent return):", orderId);
      return jsonResponse({
        success: true,
        already_processed: true,
        order_id: orderId,
        payment_id: payment.id,
      });
    }

    /* -----------------------------------------------------
       10. TEST PAYMENT PROVIDER VALIDATION
    ----------------------------------------------------- */
    if (isTestPayment && payment.provider !== "test") {
      console.error("Test payment simulation rejected on non-test transaction:", payment.provider);
      return jsonResponse(
        {
          success: false,
          error: "Test payment simulation not permitted on live transactions.",
        },
        403
      );
    }

    /* -----------------------------------------------------
       11. PROCESS OUTCOMES (SUCCESS vs FAILED/CANCELLED)
    ----------------------------------------------------- */
    const isSuccessful =
      rawState === "PAID" ||
      rawState === "TRACKER_COMPLETED" ||
      rawState === "PAYMENT:CREATED" ||
      rawState === "COMPLETED";

    const isFailedOrCancelled =
      rawState === "FAILED" ||
      rawState === "CANCELLED" ||
      rawState === "EXPIRED" ||
      rawState === "PAYMENT:FAILED";

    if (isSuccessful) {
      console.log("💳 Triggering activate_paid_subscription RPC for order:", orderId);

      const providerPaymentId = trackerToken || payment.provider_payment_id || null;

      const {
        data: activationResult,
        error: activationError,
      } = await supabase.rpc("activate_paid_subscription", {
        p_order_id: orderId,
        p_provider_payment_id: providerPaymentId,
        p_provider_subscription_id: null,
      });

      if (activationError) {
        console.error("❌ Subscription activation RPC error:", activationError);
        return jsonResponse(
          {
            success: false,
            error: "Payment verified but subscription activation failed.",
            order_id: orderId,
            details: activationError.message,
          },
          500
        );
      }

      console.log("✅ Subscription activated successfully:", {
        orderId,
        paymentId: payment.id,
        activationResult,
      });

      return jsonResponse({
        success: true,
        already_processed: false,
        order_id: orderId,
        payment_id: payment.id,
        status: "paid",
        activation: activationResult,
      });
    } else if (isFailedOrCancelled) {
      console.warn(`⚠️ Payment transaction marked as ${rawState} for order:`, orderId);

      await supabase
        .from("payment_transactions")
        .update({
          status: rawState === "CANCELLED" ? "cancelled" : "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      return jsonResponse({
        success: true,
        order_id: orderId,
        payment_id: payment.id,
        status: rawState === "CANCELLED" ? "cancelled" : "failed",
      });
    } else {
      console.log(`ℹ️ Unhandled payment state (${rawState}) for order:`, orderId);

      return jsonResponse({
        success: true,
        received: true,
        order_id: orderId,
        state: rawState,
      });
    }
  } catch (error) {
    console.error("payment-webhook unhandled exception:", error);
    return jsonResponse(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      500
    );
  }
});