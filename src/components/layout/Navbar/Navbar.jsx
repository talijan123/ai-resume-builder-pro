import Container from "../../UI/Container/Container";
import Button from "../../UI/Button/Button";

const links = [
  "Features",
  "How It Works",
  "Pricing",
  "Contact",
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <Container>
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
              RF
            </div>

            <div>

              <h1 className="text-xl font-black text-white">
                ResumeForge
              </h1>

              <p className="text-xs text-slate-400">
                AI Resume Builder
              </p>

            </div>

          </div>

          {/* Nav */}

          <nav className="hidden lg:flex items-center gap-8">

            {links.map((link) => (
              <a
                key={link}
                href="#"
                className="text-slate-300 hover:text-white transition"
              >
                {link}
              </a>
            ))}

          </nav>

          {/* Right */}

          <div className="flex items-center gap-4">

            <button className="text-slate-300 hover:text-white transition">
              Login
            </button>

            <Button>
              Get Started
            </Button>

          </div>

        </div>
      </Container>
    </header>
  );
}