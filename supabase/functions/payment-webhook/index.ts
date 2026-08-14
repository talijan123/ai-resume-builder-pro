import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}

Deno.serve(async (req) => {
  /*
  |--------------------------------------------------------------------------
  | CORS
  |--------------------------------------------------------------------------
  */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | METHOD
  |--------------------------------------------------------------------------
  */

  if (req.method !== "POST") {
    return jsonResponse(
      {
        success: false,
        error: "Method not allowed.",
      },
      405,
    );
  }

  try {
    /*
    |--------------------------------------------------------------------------
    | ENVIRONMENT
    |--------------------------------------------------------------------------
    */

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const supabaseServiceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY",
      );

    if (
      !supabaseUrl ||
      !supabaseServiceRoleKey
    ) {
      throw new Error(
        "Supabase server environment variables are missing.",
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SERVICE ROLE CLIENT
    |--------------------------------------------------------------------------
    */

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    /*
    |--------------------------------------------------------------------------
    | REQUEST BODY
    |--------------------------------------------------------------------------
    */

    let body: {
      order_id?: string;
      payment_id?: string;
      test_payment?: boolean;

      provider_payment_id?: string;
      provider_subscription_id?: string;
    };

    try {
      body = await req.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "Invalid JSON.",
        },
        400,
      );
    }

    console.log(
      "payment-webhook request body:",
      body,
    );

    /*
    |--------------------------------------------------------------------------
    | READ VALUES
    |--------------------------------------------------------------------------
    */

    const orderId =
      body?.order_id;

    const paymentId =
      body?.payment_id ?? null;

    const testPayment =
      body?.test_payment === true;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!orderId) {
      console.error(
        "Missing order_id in payment-webhook request.",
      );

      return jsonResponse(
        {
          success: false,
          error: "order_id is required.",
        },
        400,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FIND PAYMENT TRANSACTION
    |--------------------------------------------------------------------------
    */

    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payment_transactions")
      .select(
        `
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
        `,
      )
      .eq("order_id", orderId)
      .maybeSingle();

    if (paymentError) {
      console.error(
        "Payment lookup failed:",
        paymentError,
      );

      return jsonResponse(
        {
          success: false,
          error: "Failed to find payment.",
          details: paymentError.message,
        },
        500,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PAYMENT NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!payment) {
      console.error(
        "Payment transaction not found:",
        orderId,
      );

      return jsonResponse(
        {
          success: false,
          error:
            "Payment transaction not found.",
          order_id: orderId,
        },
        404,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | TEST PAYMENT VALIDATION
    |--------------------------------------------------------------------------
    */

    if (testPayment && payment.provider !== "test") {
      console.error(
        "Test payment requested but provider is:",
        payment.provider,
      );

      return jsonResponse(
        {
          success: false,
          error:
            "This payment is not a test payment.",
          provider: payment.provider,
        },
        403,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PAYMENT ID VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      paymentId &&
      paymentId !== payment.id
    ) {
      console.error(
        "Payment ID mismatch:",
        {
          received: paymentId,
          database: payment.id,
        },
      );

      return jsonResponse(
        {
          success: false,
          error: "Payment ID does not match order.",
        },
        400,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ALREADY PAID
    |--------------------------------------------------------------------------
    */

    if (payment.status === "paid") {
      console.log(
        "Payment already processed:",
        orderId,
      );

      return jsonResponse({
        success: true,
        already_processed: true,
        order_id: orderId,
        payment_id: payment.id,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | PROVIDER PAYMENT ID
    |--------------------------------------------------------------------------
    */

    const providerPaymentId =
      body?.provider_payment_id ??
      payment.provider_payment_id ??
      paymentId ??
      null;

    const providerSubscriptionId =
      body?.provider_subscription_id ??
      payment.provider_subscription_id ??
      null;

    /*
    |--------------------------------------------------------------------------
    | ACTIVATE SUBSCRIPTION
    |--------------------------------------------------------------------------
    */

    console.log(
      "Activating paid subscription:",
      {
        orderId,
        paymentId: payment.id,
        planId: payment.plan_id,
        billingCycle:
          payment.billing_cycle,
        amount: payment.amount,
        provider: payment.provider,
      },
    );

    const {
      data: activationResult,
      error: activationError,
    } = await supabase.rpc(
      "activate_paid_subscription",
      {
        p_order_id: orderId,

        p_provider_payment_id:
          providerPaymentId,

        p_provider_subscription_id:
          providerSubscriptionId,
      },
    );

    if (activationError) {
      console.error(
        "Subscription activation failed:",
        activationError,
      );

      return jsonResponse(
        {
          success: false,

          error:
            "Payment received but subscription activation failed.",

          order_id: orderId,

          details:
            activationError.message,

          code:
            activationError.code ?? null,
        },
        500,
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    console.log(
      "Payment processed successfully:",
      {
        orderId,
        paymentId: payment.id,
        activationResult,
      },
    );

    return jsonResponse({
      success: true,

      already_processed: false,

      order_id: orderId,

      payment_id: payment.id,

      activation:
        activationResult,
    });
  } catch (error) {
    console.error(
      "payment-webhook error:",
      error,
    );

    return jsonResponse(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      500,
    );
  }
});