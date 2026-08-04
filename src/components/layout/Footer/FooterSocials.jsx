import { motion } from "framer-motion";
import { socialLinks } from "./footerData";

export default function FooterSocials() {
  return (
    <div className="flex items-center gap-4">

      {socialLinks.map((social) => {
        const Icon = social.icon;

        return (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"

            whileHover={{
              y: -4,
              scale: 1.08,
            }}

            whileTap={{
              scale: 0.95,
            }}

            transition={{
              duration: 0.2,
            }}

            className="
              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-full

              border
              border-slate-200

              bg-white

              text-slate-600

              shadow-sm

              transition-all
              duration-300

              hover:border-blue-500
              hover:bg-blue-600
              hover:text-white
              hover:shadow-lg
              hover:shadow-blue-500/25
            "

            aria-label={social.name}
          >
            <Icon size={20} />
          </motion.a>
        );
      })}

    </div>
  );
}