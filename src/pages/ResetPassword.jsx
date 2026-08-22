import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        alert(`Failed to reset password: ${error.message}`);
        setLoading(false);
        return;
      }

      alert("Password reset successfully! Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create New Password 🔑"
      subtitle="Enter your new password to reset your account."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="New Password"
          name="password"
          type="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <AuthInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-800">
            💡 Password must be at least 6 characters long.
          </p>
        </div>

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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
