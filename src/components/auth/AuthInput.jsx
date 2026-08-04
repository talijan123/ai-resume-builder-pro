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

      <input
        id={name}
        name={name}
        type={type}
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

    </div>
  );
}