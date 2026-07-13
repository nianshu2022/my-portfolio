"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** split by "char" or "word" */
  by?: "char" | "word";
}

/**
 * React Bits–style SplitText:
 * Splits text into characters or words and animates each in with a stagger.
 * Uses `motion` (Framer Motion v12) which is already installed.
 */
export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
  by = "char",
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 14, stiffness: 120 },
    },
  };

  const tokens = by === "word" ? text.split(" ") : text.split("");

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block"
          aria-hidden="true"
        >
          {/* non-breaking space preserves word gaps */}
          {token === " " ? "\u00A0" : token}
          {by === "word" && i < tokens.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
