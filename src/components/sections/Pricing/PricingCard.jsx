import { AnimatePresence, motion } from "framer-motion";
import { HiCheck } from "react-icons/hi2";

export default function PricingCard({
  id,
  name,
  monthlyPrice,
  yearlyPrice,
  yearlyTotal,
  yearly,
  description,
  badge,
  buttonText,
  buttonStyle,
  features,
  featured,
  onSelectPlan,
}) {
  /* =====================================================
     CURRENT PRICE
  ===================================================== */

  const currentPrice = yearly
    ? yearlyPrice
    : monthlyPrice;

  /* =====================================================
     BUTTON STYLES
  ===================================================== */

  const buttonClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl",

    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200",

    dark:
      "bg-slate-900 text-white hover:bg-slate-800",
  };

  /* =====================================================
     PLAN OBJECT
  ===================================================== */

  const plan = {
    id,
    name,
    monthlyPrice,
    yearlyPrice,
    yearlyTotal,
    description,
    badge,
    buttonText,
    buttonStyle,
    features,
    featured,
  };

  /* =====================================================
     HANDLE PLAN SELECTION
  ===================================================== */

  const handleSelectPlan = () => {
    if (typeof onSelectPlan !== "function") {
      console.error(
        "PricingCard: onSelectPlan handler is missing."
      );

      return;
    }

    onSelectPlan(plan);
  };

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`
        relative

        flex
        flex-col

        rounded-3xl

        border

        p-8

        shadow-lg

        transition-all
        duration-300

        ${
          featured
            ? "border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-2xl"
            : "border-slate-200 bg-white"
        }
      `}
    >
      {/* =================================================
          BADGE
      ================================================= */}

      {badge && (
        <div
          className="
            absolute
            -top-4
            left-1/2
            -translate-x-1/2

            rounded-full

            bg-blue-600

            px-5
            py-2

            text-xs
            font-bold
            uppercase
            tracking-wider

            text-white

            shadow-lg
          "
        >
          {badge}
        </div>
      )}

      {/* =================================================
          PLAN
      ================================================= */}

      <div className="text-center">
        <h3
          className="
            text-2xl
            font-black
            text-slate-900
          "
        >
          {name}
        </h3>

        <p
          className="
            mt-3
            leading-7
            text-slate-600
          "
        >
          {description}
        </p>
      </div>

      {/* =================================================
          PRICE
      ================================================= */}

      <div className="mt-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${currentPrice}-${yearly}`}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <span
              className="
                text-6xl
                font-black
                text-slate-900
              "
            >
              ${currentPrice}
            </span>

            {currentPrice > 0 && (
              <span
                className="
                  ml-1
                  text-lg
                  text-slate-500
                "
              >
                /month
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* =================================================
            SAVE BADGE
        ================================================= */}

        {yearly && currentPrice > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              mt-4

              inline-flex

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
          </motion.div>
        )}

        {/* =================================================
            ANNUAL BILLING
        ================================================= */}

        {yearly && yearlyTotal > 0 && (
          <motion.p
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-3
              text-sm
              text-slate-500
            "
          >
            Billed annually{" "}
            <span className="font-semibold">
              (${yearlyTotal}/year)
            </span>
          </motion.p>
        )}
      </div>

      {/* =================================================
          DIVIDER
      ================================================= */}

      <div
        className="
          my-8

          h-px

          bg-slate-200
        "
      />

      {/* =================================================
          FEATURES
      ================================================= */}

      <div className="flex-1 space-y-4">
        {Array.isArray(features) &&
          features.map((feature) => (
            <div
              key={feature}
              className="
                flex
                items-start
                gap-3
              "
            >
              <div
                className="
                  mt-1

                  rounded-full

                  bg-green-100

                  p-1
                "
              >
                <HiCheck
                  size={16}
                  className="text-green-600"
                />
              </div>

              <span
                className="
                  leading-7

                  text-slate-700
                "
              >
                {feature}
              </span>
            </div>
          ))}
      </div>

      {/* =================================================
          BUTTON
      ================================================= */}

      <motion.button
        type="button"
        onClick={handleSelectPlan}
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.97,
        }}
        className={`
          mt-10

          w-full

          rounded-2xl

          py-4

          font-semibold

          transition-all
          duration-300

          ${buttonClasses[buttonStyle] || buttonClasses.primary}
        `}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
}