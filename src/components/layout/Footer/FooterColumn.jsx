import { motion } from "framer-motion";

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

        {links.map((link) => (

          <li key={link.name}>

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

          </li>

        ))}

      </ul>

    </div>
  );
}