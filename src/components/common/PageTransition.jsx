import React from "react";
import { motion } from "framer-motion";

/**
 * Linear/Vercel standard subtle page transition
 * Entry: micro slide-up (y: 8px -> 0px) and fade-in (opacity: 0 -> 1) over 190ms (180ms–220ms) easeOut
 * Exit: quick fade-out (opacity: 0) over 110ms-120ms
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.19,
      ease: [0.22, 1, 0.36, 1], // easeOut
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.11,
      ease: "easeIn",
    },
  },
};

export default function PageTransition({
  children,
  className = "",
  style,
  ...rest
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-screen flex flex-col flex-1 ${className}`}
      style={{
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
