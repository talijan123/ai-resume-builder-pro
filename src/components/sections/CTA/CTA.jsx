import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";

import Section from "../../UI/Section/Section";

export default function CTA() {
  return (
    <Section id="cta" className="relative overflow-hidden">

      {/* Background */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-r
          from-blue-700
          via-indigo-700
          to-blue-600
        "
      />

      {/* Glow */}

      <div
        className="
          absolute

          -top-24
          -left-24

          h-72
          w-72

          rounded-full

          bg-white/10

          blur-[120px]
        "
      />

      <div
        className="
          absolute

          -bottom-24
          -right-24

          h-72
          w-72

          rounded-full

          bg-cyan-300/20

          blur-[120px]
        "
      />

      {/* Content */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        viewport={{
          once: true,
        }}
        className="
          relative
          z-10

          mx-auto

          max-w-4xl

          text-center
        "
      >
        <p
          className="
            text-sm
            font-semibold

            uppercase

            tracking-[0.3em]

            text-blue-200
          "
        >
          START TODAY
        </p>

        <h2
          className="
            mt-6

            text-5xl
            lg:text-7xl

            font-black

            leading-tight

            text-white
          "
        >
          Ready to Build
          <br />

          Your Dream Resume?
        </h2>

        <p
          className="
            mx-auto
            mt-8

            max-w-2xl

            text-xl

            leading-9

            text-blue-100
          "
        >
          Create a professional ATS-friendly resume,
          generate AI-powered content,
          and impress recruiters in minutes.
        </p>

        {/* Button */}

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="
            mt-12

            inline-flex

            items-center
            gap-3

            rounded-full

            bg-white

            px-10
            py-5

            text-lg

            font-bold

            text-blue-700

            shadow-2xl

            transition-all
            duration-300
          "
        >
          Start Building Free

          <HiArrowRight size={22} />
        </motion.button>

        {/* Trust */}

        <div
          className="
            mt-12

            flex
            flex-wrap

            items-center
            justify-center

            gap-8
          "
        >
          <div className="flex items-center gap-2">

            <FaCheckCircle className="text-green-300" />

            <span className="text-blue-100">
              Free Forever Plan
            </span>

          </div>

          <div className="flex items-center gap-2">

            <FaShieldAlt className="text-green-300" />

            <span className="text-blue-100">
              ATS Optimized
            </span>

          </div>

          <div className="flex items-center gap-2">

            <FaBolt className="text-green-300" />

            <span className="text-blue-100">
              AI Powered
            </span>

          </div>

        </div>

      </motion.div>

    </Section>
  );
}