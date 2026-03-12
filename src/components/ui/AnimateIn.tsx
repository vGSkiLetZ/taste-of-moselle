"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

export default function AnimateIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimateInProps) {
  const offsets = {
    up: { y: 24, x: 0 },
    left: { y: 0, x: -24 },
    right: { y: 0, x: 24 },
    none: { y: 0, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <AnimateIn key={i} delay={i * staggerDelay}>
          {child}
        </AnimateIn>
      ))}
    </div>
  );
}
