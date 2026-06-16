"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Fade + rise on scroll into view. Respects prefers-reduced-motion
 * (motion is disabled, content stays fully visible) per the a11y rule
 * in DOCUMENTATION-STANDARD.md §5.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
