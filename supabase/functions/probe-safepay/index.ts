import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface ProbeResult {
  url: string;
  authMethod: string;
  status: number;
  statusText: string;
  responseBody: unknown;
  headers: Record<string, string>;
}

async function probeUrl(
  url: string,
  authMethod: string,
  headers: Record<string, string>
): Promise<ProbeResult> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        ...headers,
      },
    });

    const contentType = res.headers.get("content-type") || "";
    let responseBody: unknown;

    if (contentType.includes("application/json")) {
      responseBody = await res.json().catch(() => null);
    } else {
      const text = await res.text();
      try {
        responseBody = JSON.parse(text);
      } catch {
        responseBody = text.slice(0, 1000);
      }
    }

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    return {
      url,
      authMethod,
      status: res.status,
      statusText: res.statusText,
      responseBody,
      headers: responseHeaders,
    };
  } catch (err: unknown) {
    return {
      url,
      authMethod,
      status: 0,
      statusText: "Network/Fetch Error",
      responseBody: { error: err instanceof Error ? err.message : String(err) },
      headers: {},
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const safepayApiKey = Deno.env.get("SAFEPAY_API_KEY") || "";
  const safepaySecretKey = Deno.env.get("SAFEPAY_SECRET_KEY") || "";
  const safepayEnv = (Deno.env.get("SAFEPAY_ENVIRONMENT") || "sandbox").toLowerCase();

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("payment_transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  let body: Record<string, any> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  let trackerToken = body.trackerToken || "";
  let orderId = body.orderId || "";

  // If not provided, take from the most recent transaction or init a new one
  if (!trackerToken && recentTransactions && recentTransactions.length > 0) {
    const latest = recentTransactions[0];
    trackerToken = latest.provider_payment_id || "";
    orderId = latest.order_id || "";
  }

  // Also optionally create a fresh tracker token right now for probing
  let freshTrackerToken = "";
  let freshCheckoutUrl = "";
  if (body.initFresh || !trackerToken) {
    try {
      const initRes = await fetch("https://sandbox.api.getsafepay.com/order/v1/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(safepaySecretKey ? { "X-SFPY-MERCHANT-SECRET": safepaySecretKey } : {}),
        },
        body: JSON.stringify({
          client: safepayApiKey,
          amount: 2999,
          currency: "PKR",
          environment: "sandbox",
        }),
      });
      const initData = await initRes.json();
      freshTrackerToken = initData?.data?.token || "";
      if (freshTrackerToken) {
        freshCheckoutUrl = `https://sandbox.api.getsafepay.com/checkout/pay?beacon=${encodeURIComponent(freshTrackerToken)}&source=custom&env=sandbox&order_id=RF-PROBE-TEST&webhooks=true`;
      }
    } catch (e) {
      console.error("Failed to init fresh tracker:", e);
    }
  }

  const tokenToUse = body.trackerToken || freshTrackerToken || trackerToken;
  const orderIdToUse = body.orderId || orderId || "RF-PROBE-TEST";

  // Auth variations to test
  const authConfigs = [
    { name: "None (No Auth Header)", headers: {} },
    { name: "X-SFPY-MERCHANT-SECRET", headers: { "X-SFPY-MERCHANT-SECRET": safepaySecretKey } },
    { name: "Authorization: Bearer <SECRET_KEY>", headers: { Authorization: `Bearer ${safepaySecretKey}` } },
    { name: "Authorization: Bearer <API_KEY>", headers: { Authorization: `Bearer ${safepayApiKey}` } },
    { name: "X-API-KEY: <API_KEY>", headers: { "X-API-KEY": safepayApiKey } },
    { name: "X-SFPY-API-KEY: <API_KEY>", headers: { "X-SFPY-API-KEY": safepayApiKey } },
    { name: "Basic Auth: <API_KEY>:<SECRET_KEY>", headers: { Authorization: `Basic ${btoa(`${safepayApiKey}:${safepaySecretKey}`)}` } },
  ];

  // Candidates requested by user:
  // 1. GET https://sandbox.api.getsafepay.com/order/v1/{tracker_token}
  // 2. GET https://sandbox.api.getsafepay.com/order/v1/{order_id}
  // 3. GET https://sandbox.api.getsafepay.com/order/v1/init/{tracker_token}
  // 4. GET https://sandbox.api.getsafepay.com/premium/payments/v3/{tracker_token}
  // 5. GET https://sandbox.api.getsafepay.com/checkout/v1/{tracker_token}

  const pathTemplates = [
    `/order/v1/${tokenToUse}`,
    `/order/v1/${orderIdToUse}`,
    `/order/v1/init/${tokenToUse}`,
    `/premium/payments/v3/${tokenToUse}`,
    `/checkout/v1/${tokenToUse}`,
    // Additional common Safepay endpoint patterns:
    `/order/v1/details/${tokenToUse}`,
    `/order/v1/token/${tokenToUse}`,
    `/order/v1/tracker/${tokenToUse}`,
    `/order/v1/status/${tokenToUse}`,
    `/order/v1/status/${orderIdToUse}`,
    `/order/v1/transactions/${tokenToUse}`,
    `/order/v1/transaction/${tokenToUse}`,
    `/order/v1/tracking/${tokenToUse}`,
    `/payments/v1/${tokenToUse}`,
    `/client/passport/v1/token`,
    `/order/v1/init?token=${tokenToUse}`,
    `/order/v1?beacon=${tokenToUse}`,
    `/order/v1?tracker=${tokenToUse}`,
    `/order/v1?order_id=${orderIdToUse}`,
  ];

  const bases = [
    "https://sandbox.api.getsafepay.com",
    "https://api.getsafepay.com",
  ];

  const results: ProbeResult[] = [];

  for (const base of bases) {
    for (const path of pathTemplates) {
      const url = `${base}${path}`;
      // Test key auth variations
      for (const auth of authConfigs) {
        // Run probe
        const probe = await probeUrl(url, auth.name, auth.headers);
        results.push(probe);
      }
    }
  }

  return new Response(
    JSON.stringify({
      trackerTokenUsed: tokenToUse,
      orderIdUsed: orderIdToUse,
      freshTrackerToken,
      freshCheckoutUrl,
      recentTransactions,
      hasSafepayApiKey: Boolean(safepayApiKey),
      hasSafepaySecretKey: Boolean(safepaySecretKey),
      safepayEnv,
      totalProbes: results.length,
      successfulProbes: results.filter((r) => r.status >= 200 && r.status < 300),
      non404Probes: results.filter((r) => r.status !== 404 && r.status !== 0),
      allResults: results,
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
