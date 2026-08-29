import {
  useState,
} from "react";

import {
  HiArrowLeft,
  HiBell,
  HiChevronDown,
  HiHome,
  HiSparkles,
  HiGlobeAlt,
  HiUser,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  usePricing,
} from "../../context/PricingContext";

import { supabase } from "../../lib/supabase";

/* =========================================================
   DASHBOARD HEADER
========================================================= */

export default function DashboardHeader({
  title = "Dashboard",

  subtitle = "",

  breadcrumb = "",

  showBackButton = false,

  backTo = "/dashboard",

  showCredits = true,

  showNotifications = true,

  showProfile = true,

  rightContent = null,

  sticky = true,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    user,
  } = useAuth();

  const {
    availableCredits,
  } = usePricing();

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  /* =======================================================
     USER INFORMATION
  ======================================================= */

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail =
    user?.email ||
    "";

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  /* =======================================================
     CURRENT PATH
  ======================================================= */

  const isDashboard =
    location.pathname === "/dashboard";

  /* =======================================================
     BACK HANDLER
  ======================================================= */

  function handleBack() {
    if (backTo) {
      navigate(backTo);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/dashboard");
  }

  /* =======================================================
     PROFILE MENU
  ======================================================= */

  function handleLandingPage() {
    navigate("/");
    setProfileOpen(false);
  }

  function handleProfile() {
    navigate("/profile");

    setProfileOpen(false);
  }

  function handleSettings() {
    navigate("/settings");

    setProfileOpen(false);
  }

  async function handleLogout() {
    setProfileOpen(false);
    await supabase.auth.signOut();
    navigate("/login");
  }

  /* =======================================================
     HEADER
  ======================================================= */

  return (
    <header
      className={`
        z-40
        w-full

        border-b
        border-slate-200/80
        dark:border-slate-800/80

        bg-white/95
        dark:bg-slate-900/95

        backdrop-blur-xl

        ${
          sticky
            ? "sticky top-0"
            : ""
        }
      `}
    >
      <div
        className="
          mx-auto
          flex
          min-h-[76px]
          max-w-[1800px]

          items-center
          justify-between

          gap-6

          px-4
          py-3

          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* -----------------------------------------------
              BACK BUTTON
          ----------------------------------------------- */}

          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="
                flex
                h-10
                w-10
                shrink-0

                items-center
                justify-center

                rounded-xl

                border
                border-slate-200

                bg-white

                text-slate-600

                shadow-sm

                transition-all
                duration-200

                hover:-translate-x-0.5
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-900

                active:scale-95
              "
            >
              <HiArrowLeft
                size={19}
              />
            </button>
          )}

          {/* -----------------------------------------------
              BRAND / HOME
          ----------------------------------------------- */}

          {!showBackButton && (
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              aria-label="Dashboard"
              className="
                hidden
                h-10
                w-10
                shrink-0

                items-center
                justify-center

                rounded-xl

                border
                border-slate-200

                bg-slate-50

                text-slate-600

                transition-all
                duration-200

                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600

                sm:flex
              "
            >
              <HiHome
                size={18}
              />
            </button>
          )}

          {/* -----------------------------------------------
              TITLE AREA
          ----------------------------------------------- */}

          <div
            className="
              min-w-0
            "
          >
            {/* Breadcrumb */}

            {breadcrumb && (
              <div
                className="
                  mb-0.5

                  hidden

                  items-center
                  gap-1.5

                  text-xs
                  font-medium
                  text-slate-400

                  md:flex
                "
              >
                <span>
                  Dashboard
                </span>

                <span>
                  /
                </span>

                <span
                  className="
                    text-slate-500
                  "
                >
                  {breadcrumb}
                </span>
              </div>
            )}

            {/* Title */}

            <h1
              className="
                truncate

                text-lg
                font-black
                tracking-tight

                text-slate-900

                sm:text-xl
                lg:text-2xl
              "
            >
              {title}
            </h1>

            {/* Subtitle */}

            {subtitle && (
              <p
                className="
                  mt-0.5

                  hidden
                  max-w-xl
                  truncate

                  text-xs
                  font-medium

                  text-slate-500

                  sm:block

                  sm:text-sm
                "
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2

            sm:gap-3
          "
        >
          {/* -----------------------------------------------
              CUSTOM RIGHT CONTENT
          ----------------------------------------------- */}

          {rightContent && (
            <div
              className="
                hidden
                items-center

                lg:flex
              "
            >
              {rightContent}
            </div>
          )}

          {/* -----------------------------------------------
              CREDITS
          ----------------------------------------------- */}

          {showCredits && (
            <button
              type="button"
              onClick={() =>
                navigate("/checkout")
              }
              className="
                group

                flex
                items-center
                gap-2

                rounded-xl

                border
                border-amber-200

                bg-amber-50

                px-3
                py-2

                transition-all
                duration-200

                hover:border-amber-300
                hover:bg-amber-100
                hover:shadow-sm

                sm:px-3.5
              "
            >
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center

                  rounded-lg

                  bg-amber-100

                  text-amber-600

                  group-hover:bg-amber-200
                "
              >
                <HiSparkles
                  size={15}
                />
              </div>

              <div
                className="
                  hidden
                  text-left

                  sm:block
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider

                    text-amber-600
                  "
                >
                  AI Credits
                </p>

                <p
                  className="
                    text-sm
                    font-black

                    text-amber-800
                  "
                >
                  {availableCredits ?? 0}
                </p>
              </div>

              <span
                className="
                  hidden

                  text-xs
                  font-bold

                  text-amber-700

                  lg:block
                "
              >
                Upgrade
              </span>
            </button>
          )}

          {/* -----------------------------------------------
              NOTIFICATIONS
          ----------------------------------------------- */}

          {showNotifications && (
            <button
              type="button"
              aria-label="Notifications"
              className="
                relative

                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                border
                border-slate-200

                bg-white

                text-slate-600

                shadow-sm

                transition-all
                duration-200

                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-900

                active:scale-95
              "
            >
              <HiBell
                size={19}
              />

              {/* Notification dot */}

              <span
                className="
                  absolute
                  right-2
                  top-2

                  h-2
                  w-2

                  rounded-full

                  bg-blue-600

                  ring-2
                  ring-white
                  dark:ring-slate-800
                "
              />
            </button>
          )}

          {/* -----------------------------------------------
              PROFILE
          ----------------------------------------------- */}

          {showProfile && (
            <div
              className="
                relative
              "
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    (previous) =>
                      !previous
                  )
                }
                className="
                  flex
                  items-center
                  gap-2

                  rounded-xl

                  border
                  border-slate-200

                  bg-white

                  px-2
                  py-1.5

                  shadow-sm

                  transition-all
                  duration-200

                  hover:border-slate-300
                  hover:bg-slate-50

                  sm:pl-1.5
                  sm:pr-3
                "
              >
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0

                    items-center
                    justify-center

                    rounded-lg

                    bg-gradient-to-br
                    from-blue-600
                    to-indigo-600

                    text-sm
                    font-black
                    text-white

                    shadow-sm
                  "
                >
                  {userInitial}
                </div>

                {/* User name */}

                <div
                  className="
                    hidden
                    max-w-[130px]
                    text-left

                    md:block
                  "
                >
                  <p
                    className="
                      truncate

                      text-sm
                      font-bold

                      text-slate-800
                    "
                  >
                    {userName}
                  </p>

                  <p
                    className="
                      truncate

                      text-[11px]

                      text-slate-400
                    "
                  >
                    {userEmail}
                  </p>
                </div>

                <HiChevronDown
                  size={16}
                  className={`
                    hidden
                    text-slate-400
                    transition-transform

                    md:block

                    ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* -------------------------------------------
                  PROFILE DROPDOWN
              ------------------------------------------- */}

              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]

                    z-50

                    w-64

                    overflow-hidden

                    rounded-2xl

                    border
                    border-slate-200

                    bg-white

                    shadow-2xl

                    ring-1
                    ring-black/5
                  "
                >
                  {/* User info */}

                  <div
                    className="
                      border-b
                      border-slate-100

                      bg-slate-50

                      px-4
                      py-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-11
                          w-11

                          shrink-0

                          items-center
                          justify-center

                          rounded-xl

                          bg-gradient-to-br
                          from-blue-600
                          to-indigo-600

                          font-black
                          text-white
                        "
                      >
                        {userInitial}
                      </div>

                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            truncate

                            text-sm
                            font-bold

                            text-slate-900
                          "
                        >
                          {userName}
                        </p>

                        <p
                          className="
                            truncate

                            text-xs

                            text-slate-500
                          "
                        >
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}

                  <div
                    className="
                      p-2
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        handleLandingPage
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5

                        rounded-xl

                        px-3
                        py-2.5

                        text-left

                        text-sm
                        font-semibold

                        text-slate-700

                        transition-colors

                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      <HiGlobeAlt size={18} className="text-slate-500" />
                      View Landing Page
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleProfile
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5

                        rounded-xl

                        px-3
                        py-2.5

                        text-left

                        text-sm
                        font-semibold

                        text-slate-700

                        transition-colors

                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      <HiUser size={18} className="text-slate-500" />
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleSettings
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5

                        rounded-xl

                        px-3
                        py-2.5

                        text-left

                        text-sm
                        font-semibold

                        text-slate-700

                        transition-colors

                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      <HiCog6Tooth size={18} className="text-slate-500" />
                      Settings
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2.5

                        rounded-xl

                        px-3
                        py-2.5

                        text-left

                        text-sm
                        font-semibold

                        text-red-600

                        transition-colors

                        hover:bg-red-50
                      "
                    >
                      <HiArrowRightOnRectangle size={18} className="text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------
              MOBILE DASHBOARD BUTTON
          ----------------------------------------------- */}

          {!isDashboard && (
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              aria-label="Dashboard"
              className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                border
                border-slate-200

                bg-white

                text-slate-600

                shadow-sm

                transition-all

                hover:bg-slate-50

                sm:hidden
              "
            >
              <HiHome
                size={18}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}