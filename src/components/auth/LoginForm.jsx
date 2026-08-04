import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "./AuthInput";
import SocialLogin from "./SocialLogin";

import { signIn } from "../../services/authService";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    setLoading(true);

    const { error } = await signIn({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <AuthInput
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />

      <AuthInput
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />

      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Forgot Password?
        </Link>
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
          disabled:opacity-70
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <SocialLogin />

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Create Account
        </Link>
      </p>
    </form>
  );
}