import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  HiBars3,
  HiXMark,
} from "react-icons/hi2";

import Container from "../../UI/Container/Container";
import Button from "../../UI/Button/Button";

import { useAuth } from "../../../context/AuthContext";

const links = [
  {
    name: "Features",
    to: "features",
  },
  {
    name: "How It Works",
    to: "how-it-works",
  },
  {
    name: "Templates",
    to: "templates",
  },
  {
    name: "Pricing",
    to: "pricing",
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { user, loading } = useAuth();

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = () => {
    setMenuOpen(false);

    navigate("/login");
  };

  /* =========================================================
     GET STARTED
  ========================================================= */

  const handleGetStarted = () => {
    setMenuOpen(false);

    if (loading) {
      return;
    }

    if (user) {
      navigate("/dashboard");
      return;
    }

    navigate("/register");
  };

  /* =========================================================
     DASHBOARD
  ========================================================= */

  const handleDashboard = () => {
    setMenuOpen(false);

    navigate("/dashboard");
  };

  return (
    <header
      className="
        fixed
        top-0
        left-0
        z-50
        w-full
        border-b
        border-slate-800/70
        bg-slate-950/80
        backdrop-blur-xl
      "
    >
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* =================================================
              LOGO
          ================================================= */}

          <ScrollLink
            to="hero"
            smooth
            duration={600}
            offset={-80}
            className="
              flex
              cursor-pointer
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-indigo-600
                font-black
                text-white
                shadow-lg
                shadow-blue-500/30
              "
            >
              RF
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-black
                  text-white
                "
              >
                ResumeForge
              </h1>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                AI Resume Builder
              </p>
            </div>
          </ScrollLink>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav
            className="
              hidden
              items-center
              gap-8
              lg:flex
            "
          >
            {links.map((link) => (
              <ScrollLink
                key={link.name}
                to={link.to}
                smooth
                spy
                duration={600}
                offset={-80}
                activeClass="text-white after:w-full"
                className="
                  relative
                  cursor-pointer
                  font-medium
                  text-slate-300
                  transition-all
                  duration-300
                  hover:text-white

                  after:absolute
                  after:-bottom-2
                  after:left-0
                  after:h-[2px]
                  after:w-0
                  after:bg-blue-500
                  after:transition-all
                  after:duration-300

                  hover:after:w-full
                "
              >
                {link.name}
              </ScrollLink>
            ))}
          </nav>

          {/* =================================================
              DESKTOP RIGHT
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-4
              lg:flex
            "
          >
            {loading ? (
              <span className="text-sm text-slate-400">
                Loading...
              </span>
            ) : user ? (
              <>
                {/* Dashboard */}

                <button
                  type="button"
                  onClick={handleDashboard}
                  className="
                    font-medium
                    text-slate-300
                    transition
                    hover:text-white
                  "
                >
                  Dashboard
                </button>

                {/* Profile */}

                <RouterLink
                  to="/profile"
                  className="
                    font-medium
                    text-slate-300
                    transition
                    hover:text-white
                  "
                >
                  Profile
                </RouterLink>
              </>
            ) : (
              <>
                {/* Login */}

                <button
                  type="button"
                  onClick={handleLogin}
                  className="
                    font-medium
                    text-slate-300
                    transition
                    hover:text-white
                  "
                >
                  Login
                </button>

                {/* Get Started */}

                <Button onClick={handleGetStarted}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="
              text-white
              lg:hidden
            "
          >
            {menuOpen ? (
              <HiXMark size={28} />
            ) : (
              <HiBars3 size={28} />
            )}
          </button>
        </div>
      </Container>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (
        <div
          className="
            border-t
            border-slate-800
            bg-slate-950
            lg:hidden
          "
        >
          <Container>
            <div className="flex flex-col py-6">

              {/* Landing Page Links */}

              {links.map((link) => (
                <ScrollLink
                  key={link.name}
                  to={link.to}
                  smooth
                  duration={600}
                  offset={-80}
                  onClick={() => setMenuOpen(false)}
                  className="
                    cursor-pointer
                    border-b
                    border-slate-800
                    py-4
                    text-slate-300
                    transition
                    hover:text-white
                  "
                >
                  {link.name}
                </ScrollLink>
              ))}

              {/* =================================================
                  AUTH ACTIONS
              ================================================= */}

              {loading ? (
                <div
                  className="
                    mt-6
                    rounded-xl
                    border
                    border-slate-800
                    py-3
                    text-center
                    text-sm
                    text-slate-400
                  "
                >
                  Checking account...
                </div>
              ) : user ? (
                <>
                  {/* Dashboard */}

                  <button
                    type="button"
                    onClick={handleDashboard}
                    className="
                      mt-6
                      rounded-xl
                      border
                      border-slate-700
                      py-3
                      font-medium
                      text-slate-300
                      transition
                      hover:border-blue-500
                      hover:text-white
                    "
                  >
                    Dashboard
                  </button>

                  {/* Profile */}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="
                      mt-3
                      rounded-xl
                      border
                      border-slate-700
                      py-3
                      font-medium
                      text-slate-300
                      transition
                      hover:border-blue-500
                      hover:text-white
                    "
                  >
                    My Profile
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}

                  <button
                    type="button"
                    onClick={handleLogin}
                    className="
                      mt-6
                      rounded-xl
                      border
                      border-slate-700
                      py-3
                      font-medium
                      text-slate-300
                      transition
                      hover:border-blue-500
                      hover:text-white
                    "
                  >
                    Login
                  </button>

                  {/* Get Started */}

                  <div className="mt-4">
                    <Button onClick={handleGetStarted}>
                      Get Started
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}