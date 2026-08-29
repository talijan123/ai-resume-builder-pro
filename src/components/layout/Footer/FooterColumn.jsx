import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FooterColumn({
  title,
  links,
}) {
  return (
    <div>

      {/* Title */}

      <h3
        className="
          mb-6

          text-lg

          font-bold

          text-slate-900
        "
      >
        {title}
      </h3>

      {/* Links */}

      <ul className="space-y-4">

        {links.map((link) => {
          const isInternal = link.href.startsWith("/") && !link.href.startsWith("/#");

          return (
            <li key={link.name}>
              {isInternal ? (
                <Link
                  to={link.href}
                  className="
                    inline-flex

                    text-slate-600

                    transition-colors
                    duration-300

                    hover:text-blue-600
                    hover:translate-x-1.5
                    transition-transform
                  "
                >
                  {link.name}
                </Link>
              ) : (
                <motion.a
                  href={link.href}
                  whileHover={{
                    x: 6,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    inline-flex

                    text-slate-600

                    transition-colors
                    duration-300

                    hover:text-blue-600
                  "
                >
                  {link.name}
                </motion.a>
              )}
            </li>
          );
        })}

      </ul>

    </div>
  );
}