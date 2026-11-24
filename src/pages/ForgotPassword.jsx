import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Don't reveal whether email exists (security/privacy)
        console.error("Reset password error:", error);
      }

      // Always show success message, regardless of whether email exists
      setSubmitted(true);
    } catch (err) {
      console.error("Reset password error:", err);
      // Still show success message for security
      setSubmitted(true);
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <AuthLayout
        title="Check Your Email 📧"
        subtitle="Password reset instructions have been sent to your email address."
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              If an account exists with this email address, you will receive a
              link to reset your password. Please check your inbox and follow
              the instructions.
            </p>
          </div>

          <Link
            to="/login"
            className="
              block
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              py-4
              text-center
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-xl
              active:scale-[0.98]
            "
          >
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password 🔐"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            py-4
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
            active:scale-[0.98]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
