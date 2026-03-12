import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "brown" | "blue" | "red" | "cream";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-moselle-green-pale text-moselle-green",
  brown: "bg-moselle-cream-dark text-moselle-brown-dark",
  blue: "bg-moselle-blue-light text-moselle-blue",
  red: "bg-red-100 text-moselle-red",
  cream: "bg-moselle-cream text-moselle-text-light",
};

export default function Badge({
  children,
  variant = "green",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1",
        "rounded-lg text-xs font-semibold uppercase tracking-wider",
        "font-[family-name:var(--font-heading)]",
        "border border-current/15",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Budget badge specifically for euro signs
export function BudgetBadge({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  return (
    <span className={cn("text-sm font-semibold", className)}>
      {Array.from({ length: 4 }, (_, i) => (
        <span
          key={i}
          className={i < level ? "text-moselle-brown" : "text-moselle-cream-dark"}
        >
          €
        </span>
      ))}
    </span>
  );
}
