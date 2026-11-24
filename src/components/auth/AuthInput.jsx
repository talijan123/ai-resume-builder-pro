import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2">

      {/* Label */}

      <label
        htmlFor={name}
        className="
          block

          text-sm

          font-semibold

          text-slate-700
        "
      >
        {label}
      </label>

      {/* Input */}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="
            w-full

            rounded-2xl

            border
            border-slate-300

            bg-white

            px-5
            pr-14
            py-4

            text-slate-900

            outline-none

            transition-all
            duration-300

            placeholder:text-slate-400

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-slate-500
              transition-colors
              hover:text-slate-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        )}
      </div>

    </div>
  );
}