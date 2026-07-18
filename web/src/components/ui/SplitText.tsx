"use client";

import { motion, type Variants } from "motion/react";

interface SplitTextProps {
  text: string;
  /** Applied to the outer wrapper span */
  className?: string;
  /** Applied to each individual character / word span.
   *  Use this for styles like gradient-text that rely on background-clip,
   *  which only work when the styled element directly contains text nodes. */
  itemClassName?: string;
  delay?: number;
  stagger?: number;
  /** split by "char" or "word" */
  by?: "char" | "word";
}

/**
 * React Bits–style SplitText.
 * For above-the-fold hero content — animates in on mount (no IntersectionObserver),
 * so the text is never stuck invisible.
 *
 * NOTE: pass gradient / background-clip styles via `itemClassName`, not `className`,
 * because background-clip:text only takes effect on elements that directly hold text.
 */
export default function SplitText({
  text,
  className = "",
  itemClassName = "",
  delay = 0,
  stagger = 0.04,
  by = "char",
}: SplitTextProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
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
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"   // ← always animate on mount, no IntersectionObserver
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className={`inline-block ${itemClassName}`}
          aria-hidden="true"
        >
          {token === " " ? "\u00A0" : token}
          {by === "word" && i < tokens.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
