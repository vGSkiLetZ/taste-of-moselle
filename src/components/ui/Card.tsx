import { cn } from "@/lib/utils";

type CardBorderColor = "green" | "brown" | "blue" | "red";

interface CardProps {
  children: React.ReactNode;
  borderColor?: CardBorderColor;
  className?: string;
  hover?: boolean;
}

const borderMap: Record<CardBorderColor, string> = {
  green: "card-border-green",
  brown: "card-border-brown",
  blue: "card-border-blue",
  red: "card-border-red",
};

export default function Card({
  children,
  borderColor = "green",
  className,
  hover = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "paper-texture bg-moselle-cream rounded-[var(--radius-card)] overflow-hidden",
        "shadow-[var(--shadow-card)]",
        borderMap[borderColor],
        hover && "card-hover-lift",
        className
      )}
    >
      <div className="relative z-2">{children}</div>
    </div>
  );
}
