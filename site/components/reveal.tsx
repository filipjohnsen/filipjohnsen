"use client";

import { m } from "motion/react";

/** Blocks drop a few pixels and settle into place when they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const Component = as === "li" ? m.li : m.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 420, damping: 26, delay }}
    >
      {children}
    </Component>
  );
}
