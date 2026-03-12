"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-moselle-green text-white hover:bg-moselle-green-light shadow-[var(--shadow-button)] border-2 border-moselle-green hover:border-moselle-green-light",
  secondary:
    "bg-moselle-brown text-white hover:bg-moselle-brown-dark shadow-[var(--shadow-button)] border-2 border-moselle-brown hover:border-moselle-brown-dark",
  outline:
    "border-2 border-moselle-green text-moselle-green hover:bg-moselle-green hover:text-white",
  ghost:
    "text-moselle-text hover:bg-moselle-cream",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "rounded-xl",
        "font-[family-name:var(--font-heading)] font-semibold tracking-wide uppercase",
        "transition-all duration-200",
        "touch-target cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
