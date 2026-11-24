import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowUp } from "react-icons/hi2";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(true);
    }

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <AnimatePresence>

      {visible && (

        <motion.button
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
          onClick={scrollToTop}
          className="
            fixed

            bottom-8
            right-8

            z-50

            flex
            h-14
            w-14

            items-center
            justify-center

            rounded-full

            bg-gradient-to-r
            from-blue-600
            to-indigo-600

            text-white

            shadow-xl

            transition-all
            duration-300

            hover:scale-110
            hover:shadow-2xl
          "
        >
          <HiArrowUp size={24} />
        </motion.button>

      )}

    </AnimatePresence>
  );
}