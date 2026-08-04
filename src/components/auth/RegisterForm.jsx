import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "./AuthInput";
import SocialLogin from "./SocialLogin";

import { signUp } from "../../services/authService";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account created successfully!\n\nPlease check your email to verify your account."
    );

    navigate("/login");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Full Name */}

      <AuthInput
        label="Full Name"
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        autoComplete="name"
        required
      />

      {/* Email */}

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

      {/* Password */}

      <AuthInput
        label="Password"
        name="password"
        type="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />

      {/* Confirm Password */}

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

      {/* Terms */}

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
          required
          className="
            mt-1
            h-4
            w-4
            rounded
            border-slate-300
            text-blue-600
            focus:ring-blue-500
          "
        />

        <span className="text-sm leading-6 text-slate-600">
          I agree to the{" "}
          <a
            href="#"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Privacy Policy
          </a>.
        </span>
      </label>

      {/* Create Account */}

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
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Google */}

      <SocialLogin />

      {/* Login */}

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}