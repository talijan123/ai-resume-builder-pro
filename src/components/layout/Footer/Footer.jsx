import Container from "../../UI/Container/Container";

import FooterColumn from "./FooterColumn";
import FooterSocials from "./FooterSocials";

import { footerColumns } from "./footerData";

export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-slate-200

        bg-gradient-to-b
        from-white
        to-slate-50
      "
    >
      <Container>

        {/* Top */}

        <div
          className="
            grid

            gap-16

            py-20

            lg:grid-cols-[1.2fr_2fr]
          "
        >

          {/* Left */}

          <div>

            {/* Logo */}

            <div className="flex items-center gap-3">

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

                <h2
                  className="
                    text-2xl
                    font-black

                    text-slate-900
                  "
                >
                  ResumeForge
                </h2>

                <p
                  className="
                    text-sm

                    text-slate-500
                  "
                >
                  AI Resume Builder
                </p>

              </div>

            </div>

            {/* Description */}

            <p
              className="
                mt-8

                max-w-md

                leading-8

                text-slate-600
              "
            >
              ResumeForge AI helps job seekers create
              beautiful, ATS-friendly resumes using
              artificial intelligence, modern templates,
              and smart career tools.
            </p>

            {/* Social */}

            <div className="mt-10">
              <FooterSocials />
            </div>

          </div>

          {/* Right */}

          <div
            className="
              grid

              gap-12

              sm:grid-cols-2

              lg:grid-cols-3
            "
          >
            {footerColumns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>

        </div>

        {/* Divider */}

        <div
          className="
            h-px

            bg-slate-200
          "
        />

        {/* Bottom */}

        <div
          className="
            flex

            flex-col

            items-center
            justify-between

            gap-6

            py-8

            text-sm

            text-slate-500

            md:flex-row
          "
        >

          <p>
            © {new Date().getFullYear()} ResumeForge AI.
            All rights reserved.
          </p>

          <div
            className="
              flex

              items-center

              gap-8
            "
          >

            <a
              href="#"
              className="
                transition-colors
                duration-300

                hover:text-blue-600
              "
            >
              Privacy
            </a>

            <a
              href="#"
              className="
                transition-colors
                duration-300

                hover:text-blue-600
              "
            >
              Terms
            </a>

            <a
              href="#"
              className="
                transition-colors
                duration-300

                hover:text-blue-600
              "
            >
              Cookies
            </a>

          </div>

        </div>

      </Container>
    </footer>
  );
}