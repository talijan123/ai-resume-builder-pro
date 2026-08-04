import { useState } from "react";
import { Link } from "react-scroll";
import { HiBars3, HiXMark } from "react-icons/hi2";

import Container from "../../UI/Container/Container";
import Button from "../../UI/Button/Button";

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

          {/* Logo */}

          <Link
            to="hero"
            smooth
            duration={600}
            offset={-80}
            className="flex cursor-pointer items-center gap-3"
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
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 lg:flex">

            {links.map((link) => (
              <Link
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
              </Link>
            ))}

          </nav>

          {/* Desktop Right */}

          <div className="hidden items-center gap-4 lg:flex">

            <button
              className="
                font-medium

                text-slate-300

                transition

                hover:text-white
              "
            >
              Login
            </button>

            <Button>
              Get Started
            </Button>

          </div>

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
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

      {/* Mobile Menu */}

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

              {links.map((link) => (
                <Link
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
                </Link>
              ))}

              <button
                className="
                  mt-6

                  rounded-xl

                  border
                  border-slate-700

                  py-3

                  text-slate-300
                "
              >
                Login
              </button>

              <div className="mt-4">
                <Button>
                  Get Started
                </Button>
              </div>

            </div>

          </Container>
        </div>
      )}
    </header>
  );
}