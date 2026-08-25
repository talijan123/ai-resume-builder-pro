import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  HiCheckCircle,
  HiXCircle,
  HiArrowPath,
  HiSparkles,
  HiArrowRight,
  HiShieldCheck,
} from "react-icons/hi2";

import { supabase } from "../lib/supabase";
import { usePricing } from "../context/PricingContext";
import { useAuth } from "../context/AuthContext";

async function verifyPaymentWithSafepay(orderId) {
  const { data, error } = await supabase.functions.invoke(
    "verify-payment-status",
    { body: { order_id: orderId } }
  );

  if (error) {
    throw error;
  }

  return data;
}

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { refreshPricing } = usePricing();

  const receivedSearchParams = Object.fromEntries(searchParams.entries());
  const safepayOrderId =
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("order") ||
    searchParams.get("reference");
  const storedOrderId =
    localStorage.getItem("safepay_pending_order_id") ||
    sessionStorage.getItem("safepay_pending_order_id");
  const orderId = safepayOrderId || storedOrderId;
  const beacon = searchParams.get("beacon") || searchParams.get("token");

  console.log("Safepay callback parameters:", {
    url: window.location.href,
    params: receivedSearchParams,
    entries: Array.from(searchParams.entries()),
    safepayOrderId,
    storedOrderId,
    selectedOrderId: orderId,
    beacon,
  });

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed" | "pending"
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          redirectTo: `/payment/callback?order_id=${encodeURIComponent(orderId || "")}`,
        },
      });
      return;
    }

    if (!orderId) {
      setStatus("failed");
      setErrorMessage("No order reference was provided in the callback URL.");
      return;
    }

    let isMounted = true;
    let timer = null;

    async function checkPaymentStatus() {
      try {
        attemptsRef.current += 1;

        let { data, error } = await supabase
          .from("payment_transactions")
          .select(`
            id,
            order_id,
            plan_id,
            billing_cycle,
            amount,
            currency,
            status,
            created_at,
            plans (
              name,
              slug,
              monthly_credits
            )
          `)
          .eq("order_id", orderId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data && safepayOrderId && storedOrderId && safepayOrderId !== storedOrderId) {
          const { data: storedPayment, error: storedPaymentError } = await supabase
            .from("payment_transactions")
            .select(`
              id,
              order_id,
              plan_id,
              billing_cycle,
              amount,
              currency,
              status,
              created_at,
              plans (
                name,
                slug,
                monthly_credits
              )
            `)
            .eq("order_id", storedOrderId)
            .maybeSingle();

          if (storedPaymentError) {
            throw storedPaymentError;
          }

          if (storedPayment) {
            data = storedPayment;
          }
        }

        if (!data) {
          if (attemptsRef.current < 4) {
            timer = setTimeout(checkPaymentStatus, 1500);
            return;
          }
          if (isMounted) {
            setStatus("failed");
            setErrorMessage("Payment record could not be found for this order.");
          }
          return;
        }

        if (isMounted) {
          setPaymentDetails(data);
        }

        if (data.status === "paid") {
          if (isMounted) {
            setStatus("success");
            localStorage.removeItem("safepay_pending_order_id");
            sessionStorage.removeItem("safepay_pending_order_id");
            try {
              await refreshPricing();
            } catch (e) {
              console.warn("Pricing refresh after payment callback:", e);
            }
          }
          return;
        }

        if (data.status === "failed" || data.status === "cancelled") {
          if (isMounted) {
            setStatus("failed");
            setErrorMessage(
              data.status === "cancelled"
                ? "The payment session was cancelled."
                : "The payment could not be completed by the payment provider."
            );
          }
          return;
        }

        // Still pending (webhook might be in flight)
        if (attemptsRef.current < 6) {
          timer = setTimeout(checkPaymentStatus, 2000);
        } else {
          try {
            const verification = await verifyPaymentWithSafepay(orderId);

            if (verification?.status === "paid") {
              if (isMounted) {
                setPaymentDetails((current) =>
                  current ? { ...current, status: "paid" } : current
                );
                setStatus("success");
                localStorage.removeItem("safepay_pending_order_id");
                sessionStorage.removeItem("safepay_pending_order_id");
                await refreshPricing();
              }
              return;
            }

            if (verification?.status === "failed") {
              if (isMounted) {
                setStatus("failed");
                setErrorMessage(
                  verification.message ||
                    verification.error ||
                    "The payment was not completed."
                );
              }
              return;
            }
          } catch (verificationError) {
            console.error("Safepay fallback verification failed:", verificationError);
          }

          if (isMounted) {
            setStatus("pending");
          }
        }
      } catch (err) {
        console.error("Error verifying payment callback:", err);
        if (isMounted) {
          setStatus("failed");
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to verify transaction status."
          );
        }
      }
    }

    checkPaymentStatus();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, user, authLoading, navigate, refreshPricing]);

  /* =========================================================
     MANUAL RETRY / RE-CHECK
  ========================================================= */
  const handleManualRecheck = async () => {
    setStatus("verifying");
    attemptsRef.current = 0;

    try {
      const verification = await verifyPaymentWithSafepay(orderId);

      if (verification?.status === "paid") {
        const { data: paidPayment } = await supabase
          .from("payment_transactions")
          .select(`
            id,
            order_id,
            plan_id,
            billing_cycle,
            amount,
            currency,
            status,
            plans (
              name,
              slug,
              monthly_credits
            )
          `)
          .eq("order_id", orderId)
          .maybeSingle();

        setPaymentDetails(paidPayment);
        setStatus("success");
        localStorage.removeItem("safepay_pending_order_id");
        sessionStorage.removeItem("safepay_pending_order_id");
        await refreshPricing();
        return;
      }

      if (verification?.status === "failed") {
        setStatus("failed");
        setErrorMessage(
          verification.message || verification.error || "Payment was unsuccessful."
        );
        return;
      }

      const { data, error } = await supabase
        .from("payment_transactions")
        .select(`
          id,
          order_id,
          plan_id,
          billing_cycle,
          amount,
          currency,
          status,
          plans (
            name,
            slug,
            monthly_credits
          )
        `)
        .eq("order_id", orderId)
        .maybeSingle();

      if (error || !data) {
        setStatus("failed");
        setErrorMessage("Payment transaction not found.");
        return;
      }

      setPaymentDetails(data);

      if (data.status === "paid") {
        setStatus("success");
        localStorage.removeItem("safepay_pending_order_id");
        sessionStorage.removeItem("safepay_pending_order_id");
        await refreshPricing();
      } else if (data.status === "failed" || data.status === "cancelled") {
        setStatus("failed");
        setErrorMessage("Payment was unsuccessful.");
      } else {
        setStatus("pending");
      }
    } catch (e) {
      setStatus("failed");
      setErrorMessage("Verification error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl md:p-10">
        
        {/* ===================================================
            VERIFYING STATE
        ==================================================== */}
        {status === "verifying" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Safepay Verification
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                Verifying Your Payment
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Please wait while we confirm your transaction and activate your plan benefits...
              </p>
            </div>

            {orderId && (
              <div className="rounded-2xl bg-slate-50 p-4 text-xs font-medium text-slate-500">
                Order Reference: <span className="font-mono text-slate-700">{orderId}</span>
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            SUCCESS STATE
        ==================================================== */}
        {status === "success" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              <HiCheckCircle size={52} />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                <HiSparkles size={14} />
                Payment Confirmed
              </span>
              <h1 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
                Welcome to {paymentDetails?.plans?.name || "Pro"}! 🎉
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Your payment has been successfully processed. Your plan is now active with{" "}
                <strong className="text-slate-900">
                  {paymentDetails?.plans?.monthly_credits || "500"} AI credits
                </strong>.
              </p>
            </div>

            {paymentDetails && (
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">{paymentDetails.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan / Billing:</span>
                  <span className="font-semibold capitalize text-slate-800">
                    {paymentDetails.plans?.name} ({paymentDetails.billing_cycle})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-green-600">
                    {paymentDetails.amount} {paymentDetails.currency}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate("/dashboard?payment=success", { replace: true })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <span>Go to Dashboard</span>
              <HiArrowRight size={20} />
            </button>
          </div>
        )}

        {/* ===================================================
            FAILED STATE
        ==================================================== */}
        {status === "failed" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
              <HiXCircle size={52} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                Payment Incomplete
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                Payment Not Completed
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {errorMessage || "The payment transaction could not be verified or was cancelled."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/#pricing"
                className="flex w-full items-center justify-center rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800"
              >
                Back to Pricing
              </Link>
              <Link
                to="/dashboard"
                className="flex w-full items-center justify-center rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* ===================================================
            PENDING STATE (WEBHOOK DELAY)
        ==================================================== */}
        {status === "pending" && (
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <HiShieldCheck size={48} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">
                Processing Delay
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-900">
                Payment Confirmation Pending
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Your payment was received, but we are still waiting for final confirmation from the payment provider. Your plan will activate automatically once processed.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleManualRecheck}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 font-bold text-white transition-all hover:bg-blue-700"
              >
                <HiArrowPath size={18} />
                <span>Check Status Again</span>
              </button>

              <Link
                to="/dashboard"
                className="flex w-full items-center justify-center rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
