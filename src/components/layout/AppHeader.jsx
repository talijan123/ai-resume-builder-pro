import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiBars3,
  HiXMark,
  HiChevronDown,
  HiSparkles,
  HiGlobeAlt,
  HiUser,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiDocumentText,
  HiSun,
  HiMoon,
  HiDocumentDuplicate,
  HiSquares2X2,
} from "react-icons/hi2";

import { useAuth } from "../../context/AuthContext";
import { usePricing } from "../../context/PricingContext";
import { useSettings } from "../../context/SettingsContext";
import { supabase } from "../../lib/supabase";

export default function AppHeader({
  title = "",
  subtitle = "",
  breadcrumb = "",
  showBackButton = false,
  backTo = "/dashboard",
  showCredits = true,
  showProfile = true,
  showNavTabs = true,
  actions = null,
  rightContent = null,
  sticky = true,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { availableCredits, planName } = usePricing();
  const { settings, setTheme } = useSettings();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // User details
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // Active theme calculation
  const currentTheme = settings?.appearance?.theme || "system";
  const isDarkMode =
    currentTheme === "dark" ||
    (currentTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  function toggleTheme() {
    const nextTheme = isDarkMode ? "light" : "dark";
    if (setTheme) {
      setTheme(nextTheme);
    } else {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    navigate("/login");
  }

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: HiSquares2X2,
      active: location.pathname === "/dashboard",
    },
    {
      name: "My Resumes",
      path: "/my-resumes",
      icon: HiDocumentDuplicate,
      active:
        location.pathname === "/my-resumes" ||
        (location.pathname.startsWith("/builder") && !showBackButton),
    },
    {
      name: "Templates",
      path: "/templates",
      icon: HiDocumentText,
      active: location.pathname === "/templates",
    },
    {
      name: "Cover Letters",
      path: "/my-cover-letters",
      icon: HiSparkles,
      active:
        location.pathname === "/my-cover-letters" ||
        location.pathname.startsWith("/cover-letter"),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: HiCog6Tooth,
      active: location.pathname === "/settings",
    },
  ];

  return (
    <header
      className={`
        w-full
        border-b
        border-slate-200
        dark:border-slate-800
        bg-white/85
        dark:bg-slate-900/85
        backdrop-blur-md
        transition-colors
        duration-200
        z-40
        ${sticky ? "sticky top-0" : "relative"}
      `}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            LEFT: Brand & Context / Back Button
        =================================================== */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {showBackButton && (
            <button
              type="button"
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              aria-label="Go back"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-slate-900
                text-slate-700
                dark:text-slate-300
                shadow-sm
                transition
                hover:border-slate-300
                hover:bg-slate-50
                dark:hover:bg-slate-800
                dark:hover:text-white
                cursor-pointer
              "
            >
              <HiArrowLeft size={18} />
            </button>
          )}

          {/* Logo & Brand */}
          <Link
            to="/dashboard"
            title="ResumeForge Dashboard"
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                via-indigo-600
                to-blue-700
                font-black
                text-white
                shadow-md
                shadow-blue-500/20
                transition-transform
                duration-300
                group-hover:scale-105
              "
            >
              RF
            </div>

            <div className="hidden sm:block text-left leading-tight">
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                ResumeForge
              </span>
              {(title || breadcrumb) ? (
                <span className="block text-[11px] font-semibold text-blue-600 dark:text-blue-400 capitalize truncate max-w-[150px]">
                  {breadcrumb || title}
                </span>
              ) : (
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  AI Career Studio
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* ===================================================
            CENTER: Primary Navigation Tabs (Desktop)
        =================================================== */}
        {showNavTabs && (
          <nav className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/60 p-1.5 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-3.5
                  py-2
                  text-xs
                  font-bold
                  transition-all
                  duration-200
                  ${
                    link.active
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-900/50"
                  }
                `}
              >
                <link.icon size={16} />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* ===================================================
            RIGHT: Actions, Credits, Theme Toggle & Profile
        =================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Custom Action Slot (e.g. Save / Download in Builder) */}
          {(actions || rightContent) && (
            <div className="flex items-center gap-2">
              {actions || rightContent}
            </div>
          )}

          {/* Credits Badge */}
          {showCredits && (
            <Link
              to="/checkout"
              title="Available AI Credits - Click to upgrade"
              className="
                hidden
                sm:flex
                items-center
                gap-2
                rounded-xl
                border
                border-amber-200
                dark:border-amber-500/30
                bg-amber-50
                dark:bg-amber-500/10
                px-3
                py-2
                text-xs
                font-bold
                text-amber-800
                dark:text-amber-300
                shadow-sm
                transition
                hover:scale-105
                hover:border-amber-300
              "
            >
              <HiSparkles size={15} className="text-amber-500" />
              <span>
                {availableCredits ?? 0}{" "}
                <span className="hidden md:inline">Credits</span>
              </span>
            </Link>
          )}

          {/* Instant Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle color theme"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-900
              text-slate-600
              dark:text-slate-300
              shadow-sm
              transition-all
              hover:bg-slate-100
              dark:hover:bg-slate-800
              hover:text-slate-900
              dark:hover:text-white
              cursor-pointer
            "
          >
            {isDarkMode ? (
              <HiSun size={19} className="text-amber-400" />
            ) : (
              <HiMoon size={19} className="text-slate-700" />
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open user profile menu"
                aria-expanded={profileOpen}
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-2xl
                  border
                  border-slate-200
                  dark:border-slate-800
                  bg-white
                  dark:bg-slate-900
                  p-1.5
                  pr-2.5
                  shadow-sm
                  transition-all
                  hover:border-slate-300
                  dark:hover:border-slate-700
                  hover:bg-slate-50
                  dark:hover:bg-slate-800
                  cursor-pointer
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-tr
                    from-blue-600
                    to-indigo-600
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                  "
                >
                  {userInitial}
                </div>

                <div className="hidden xl:block text-left text-xs leading-tight pr-1">
                  <p className="font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                    {userName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">
                    {planName || "Starter"}
                  </p>
                </div>

                <HiChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-2.5
                    w-64
                    rounded-2xl
                    border
                    border-slate-200
                    dark:border-slate-800
                    bg-white
                    dark:bg-slate-900
                    p-2
                    shadow-2xl
                    z-50
                    text-slate-800
                    dark:text-slate-100
                    animate-in
                    fade-in
                    slide-in-from-top-2
                    duration-150
                  "
                >
                  {/* User Info Header */}
                  <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {userName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {userEmail}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        {planName || "Starter Plan"}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {availableCredits ?? 0} Credits
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="mt-1 space-y-0.5">
                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <HiGlobeAlt size={16} className="text-blue-500" />
                      View Landing Page
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <HiUser size={16} className="text-slate-400" />
                      My Profile
                    </Link>

                    <Link
                      to="/my-resumes"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <HiDocumentDuplicate size={16} className="text-slate-400" />
                      My Resumes
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <HiCog6Tooth size={16} className="text-slate-400" />
                      Account Settings
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                    >
                      <HiArrowRightOnRectangle size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="
              flex
              lg:hidden
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-900
              text-slate-700
              dark:text-slate-300
              shadow-sm
              transition
              hover:bg-slate-50
              dark:hover:bg-slate-800
              cursor-pointer
            "
          >
            {mobileMenuOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
          </button>
        </div>
      </div>

      {/* ===================================================
          MOBILE NAVIGATION DRAWER
      =================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-bold
                  transition
                  ${
                    link.active
                      ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }
                `}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              to="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
            >
              <HiSparkles size={14} className="text-amber-500" />
              {availableCredits ?? 0} Credits Available
            </Link>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <HiGlobeAlt size={15} /> Landing Page
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
