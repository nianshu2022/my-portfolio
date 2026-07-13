"use client";

import { motion, type Variants } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * React Bits–style BlurText.
 * For above-the-fold hero content — animates in on mount (no IntersectionObserver).
 */
export default function BlurText({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
}: BlurTextProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(12px)", y: 6 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1.0] },
    },
  };

  return (
    <motion.span
      className={`inline ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"   // ← always animate on mount
      aria-label={text}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block"
          aria-hidden="true"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.span>
  );
}
