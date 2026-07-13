"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * React Bits–style BlurText:
 * Words fade + unblur into view one by one when the element enters the viewport.
 */
export default function BlurText({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(14px)", y: 6 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.55, ease: [0.215, 0.61, 0.355, 1.0] },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
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
