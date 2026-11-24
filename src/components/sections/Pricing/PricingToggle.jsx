import { motion } from "framer-motion";

export default function PricingToggle({
  yearly,
  setYearly,
}) {
  return (
    <div
      className="
        mt-10

        flex
        items-center
        justify-center

        gap-5
      "
    >
      {/* Monthly */}

      <span
        className={`
          text-sm
          font-semibold
          transition-all
          duration-300

          ${
            !yearly
              ? "text-slate-900"
              : "text-slate-400"
          }
        `}
      >
        Monthly
      </span>

      {/* Toggle */}

      <button
        onClick={() => setYearly(!yearly)}
        className="
          relative

          flex

          h-9
          w-20

          items-center

          rounded-full

          bg-blue-600

          p-1

          transition-all
          duration-300
        "
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="
            h-7
            w-7

            rounded-full

            bg-white

            shadow-md
          "
          style={{
            marginLeft: yearly
              ? "44px"
              : "0px",
          }}
        />
      </button>

      {/* Yearly */}

      <div className="flex items-center gap-3">

        <span
          className={`
            text-sm
            font-semibold
            transition-all
            duration-300

            ${
              yearly
                ? "text-slate-900"
                : "text-slate-400"
            }
          `}
        >
          Yearly
        </span>

        <span
          className="
            rounded-full

            bg-green-100

            px-3
            py-1

            text-xs

            font-bold

            uppercase

            tracking-wide

            text-green-700
          "
        >
          Save 25%
        </span>

      </div>

    </div>
  );
}