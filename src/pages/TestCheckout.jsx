import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  HiCheck,
  HiShieldCheck,
} from "react-icons/hi2";

import { supabase } from "../lib/supabase";

export default function TestCheckout() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("orderId");

  const [payment, setPayment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState(null);

  /*
  =====================================================
  LOAD PAYMENT
  =====================================================
  */

  useEffect(() => {
    async function loadPayment() {
      if (!import.meta.env.DEV) {
        setError(
          "Test checkout is disabled in production environments. Please use the live Safepay checkout flow."
        );
        setLoading(false);
        return;
      }

      if (!orderId) {
        setError(
          "Payment order was not found."
        );

        setLoading(false);
        return;
      }

      try {
        const {
          data,
          error,
        } = await supabase
          .from(
            "payment_transactions"
          )
          .select(
            `
              id,
              order_id,
              plan_id,
              billing_cycle,
              amount,
              currency,
              status
            `
          )
          .eq(
            "order_id",
            orderId
          )
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(
            "Payment order not found."
          );
        }

        setPayment(data);
      } catch (err) {
        console.error(
          "Failed to load payment:",
          err
        );

        setError(
          err?.message ||
            "Unable to load payment."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [orderId]);

  /*
  =====================================================
  COMPLETE TEST PAYMENT
  =====================================================
  */

  const handleTestPayment =
    async () => {
      if (!payment) {
        return;
      }

      setProcessing(true);
      setError(null);

      try {
        /*
        IMPORTANT:

        We do NOT directly update:

        user_subscriptions
        credit_balances

        The webhook does that.
        */

        const {
          data,
          error,
        } =
          await supabase.functions.invoke(
            "payment-webhook",
            {
              body: {
                order_id:
                  payment.order_id,

                payment_id:
                  payment.id,

                test_payment: true,
              },
            }
          );

        if (error) {
          console.error(
            "payment-webhook error:",
            error
          );

          throw new Error(
            error.message ||
              "Test payment failed."
          );
        }

        if (!data?.success) {
          throw new Error(
            data?.error ||
              "Payment could not be completed."
          );
        }

        /*
        Payment successful.

        Give the database a moment,
        then go to dashboard.
        */

        navigate(
          "/dashboard?payment=success",
          {
            replace: true,
          }
        );
      } catch (err) {
        console.error(
          "Test payment failed:",
          err
        );

        setError(
          err?.message ||
            "Unable to complete test payment."
        );
      } finally {
        setProcessing(false);
      }
    };

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
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
            Loading test checkout...
          </p>
        </div>
      </div>
    );
  }

  /*
  =====================================================
  ERROR
  =====================================================
  */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-black text-slate-900">
            Checkout Error
          </h1>

          <p className="mt-3 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              mt-6
              rounded-xl
              bg-slate-900
              px-6
              py-3
              font-bold
              text-white
            "
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="font-black text-slate-900">
            ResumeForge
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <HiShieldCheck
                size={32}
                className="text-blue-600"
              />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wider text-blue-600">
              Test Checkout
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Complete Test Payment
            </h1>

            <p className="mt-3 leading-6 text-slate-600">
              This is a development-only checkout.
              No real money will be charged.
            </p>
          </div>

          <div className="my-8 h-px bg-slate-200" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Order ID
              </span>

              <span className="max-w-[220px] truncate font-semibold text-slate-900">
                {payment.order_id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Billing
              </span>

              <span className="font-semibold capitalize text-slate-900">
                {payment.billing_cycle}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Status
              </span>

              <span className="font-semibold capitalize text-yellow-600">
                {payment.status}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-5">
              <span className="text-lg font-bold text-slate-900">
                Total
              </span>

              <span className="text-3xl font-black text-slate-900">
                {payment.amount}{" "}
                {payment.currency}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleTestPayment
            }
            disabled={
              processing ||
              payment.status !==
                "pending"
            }
            className="
              mt-8
              w-full
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
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {processing
              ? "Processing Test Payment..."
              : "Complete Test Payment"}
          </button>

          <div className="mt-6 rounded-2xl bg-green-50 p-4">
            <div className="flex gap-3">
              <HiCheck
                size={22}
                className="shrink-0 text-green-600"
              />

              <p className="text-sm leading-6 text-green-700">
                After completion, the secure
                webhook will activate the plan
                and grant the correct credits.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}