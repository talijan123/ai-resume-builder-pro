import { Link } from "react-router-dom";
import {
  HiMagnifyingGlass,
  HiBell,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name || "User";

  const avatar =
    fullName.charAt(0).toUpperCase();

  return (
    <header
      className="
        sticky
        top-0

        z-40

        border-b
        border-slate-200

        bg-white/80

        backdrop-blur-lg
      "
    >
      <div
        className="
          mx-auto

          flex

          h-20

          max-w-7xl

          items-center
          justify-between

          px-6
        "
      >
        {/* Logo */}

        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <div
            className="
              flex

              h-11
              w-11

              items-center
              justify-center

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-indigo-600

              font-black

              text-white
            "
          >
            RF
          </div>

          <div>

            <h1
              className="
                text-xl

                font-black

                text-slate-900
              "
            >
              ResumeForge
            </h1>

            <p
              className="
                text-xs

                text-slate-500
              "
            >
              Dashboard
            </p>

          </div>

        </Link>

        {/* Search */}

        <div
          className="
            hidden

            w-full
            max-w-md

            md:block
          "
        >
          <div className="relative">

            <HiMagnifyingGlass
              size={20}
              className="
                absolute

                left-4
                top-1/2

                -translate-y-1/2

                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search resumes..."
              className="
                w-full

                rounded-2xl

                border
                border-slate-200

                bg-slate-50

                py-3
                pl-12
                pr-4

                outline-none

                transition-all

                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-100
              "
            />

          </div>

        </div>

        {/* Right */}

        <div
          className="
            flex
            items-center

            gap-5
          "
        >
          {/* Notification */}

          <button
            className="
              rounded-xl

              p-2

              text-slate-600

              transition-all

              hover:bg-slate-100
            "
          >
            <HiBell size={24} />
          </button>

          {/* Avatar */}

          <div className="flex items-center gap-3">

            <div className="hidden text-right md:block">

              <p
                className="
                  font-semibold

                  text-slate-900
                "
              >
                {fullName}
              </p>

              <p
                className="
                  text-sm

                  text-slate-500
                "
              >
                {user?.email}
              </p>

            </div>

            <div
              className="
                flex

                h-11
                w-11

                items-center
                justify-center

                rounded-full

                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                font-bold

                text-white
              "
            >
              {avatar}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}