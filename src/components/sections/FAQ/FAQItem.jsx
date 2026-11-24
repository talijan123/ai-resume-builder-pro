import { AnimatePresence, motion } from "framer-motion";
import { HiMinus, HiPlus } from "react-icons/hi2";

export default function FAQItem({
  faq,
  isOpen,
  onClick,
}) {
  return (
    <motion.div
      layout
      transition={{
        duration: 0.3,
      }}
      className="
        overflow-hidden

        rounded-3xl

        border
        border-slate-200

        bg-white

        shadow-sm

        transition-all
        duration-300

        hover:border-blue-300
        hover:shadow-lg
      "
    >
      {/* Question */}

      <button
        onClick={onClick}
        className="
          flex
          w-full

          items-center
          justify-between

          px-8
          py-6

          text-left
        "
      >
        <h3
          className="
            pr-8

            text-lg

            font-bold

            text-slate-900
          "
        >
          {faq.question}
        </h3>

        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            flex
            h-10
            w-10

            items-center
            justify-center

            rounded-full

            bg-blue-50

            text-blue-600
          "
        >
          {isOpen ? (
            <HiMinus size={20} />
          ) : (
            <HiPlus size={20} />
          )}
        </motion.div>
      </button>

      {/* Answer */}

      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <div
              className="
                border-t
                border-slate-100

                px-8
                pb-8
                pt-6
              "
            >
              <p
                className="
                  leading-8

                  text-slate-600
                "
              >
                {faq.answer}
              </p>
            </div>
          </motion.div>

        )}

      </AnimatePresence>

    </motion.div>
  );
}