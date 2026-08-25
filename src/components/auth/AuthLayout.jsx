import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div
      className="
        min-h-screen

        bg-gradient-to-br
        from-slate-50
        via-white
        to-blue-50
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-900

        flex
        items-center
        justify-center

        px-6
        py-12
      "
    >
      <div
        className="
          w-full
          max-w-lg

          rounded-3xl

          border
          border-slate-200

          bg-white

          p-10

          shadow-xl
        "
      >
        {/* Logo */}

        <Link
          to="/"
          className="flex items-center justify-center gap-3"
        >
          <div
            className="
              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-indigo-600

              text-xl
              font-black

              text-white
            "
          >
            RF
          </div>

          <div>

            <h1
              className="
                text-2xl

                font-black

                text-slate-900
              "
            >
              ResumeForge
            </h1>

            <p
              className="
                text-sm

                text-slate-500
              "
            >
              AI Resume Builder
            </p>

          </div>

        </Link>

        {/* Heading */}

        <div className="mt-10 text-center">

          <h2
            className="
              text-3xl

              font-black

              text-slate-900
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-4

              leading-7

              text-slate-600
            "
          >
            {subtitle}
          </p>

        </div>

        {/* Form */}

        <div className="mt-10">
          {children}
        </div>

      </div>
    </div>
  );
}