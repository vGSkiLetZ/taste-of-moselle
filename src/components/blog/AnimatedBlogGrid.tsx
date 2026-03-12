"use client";

import AnimateIn from "@/components/ui/AnimateIn";
import type { ReactNode } from "react";

export function AnimatedItem({ children, index }: { children: ReactNode; index: number }) {
  return (
    <AnimateIn delay={index * 0.08}>
      {children}
    </AnimateIn>
  );
}
