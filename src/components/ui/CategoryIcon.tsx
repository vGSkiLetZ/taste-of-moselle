import { Utensils, Wine, Wheat, Coffee, ChefHat } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  category: Category;
  size?: number;
  className?: string;
}

const iconMap: Record<Category, React.ElementType> = {
  winstub: Utensils,
  gastronomique: ChefHat,
  "street-food": Utensils,
  brasserie: Utensils,
  "salon-de-the": Coffee,
  traiteur: Utensils,
  "producteur-local": Wheat,
  "vins-caves": Wine,
};

const colorMap: Record<Category, string> = {
  winstub: "text-moselle-brown",
  gastronomique: "text-moselle-red",
  "street-food": "text-moselle-green",
  brasserie: "text-moselle-brown-dark",
  "salon-de-the": "text-moselle-blue",
  traiteur: "text-moselle-brown",
  "producteur-local": "text-moselle-green",
  "vins-caves": "text-moselle-red",
};

export default function CategoryIcon({
  category,
  size = 18,
  className,
}: CategoryIconProps) {
  const Icon = iconMap[category] || Utensils;
  return (
    <Icon
      size={size}
      className={cn(colorMap[category], className)}
      aria-hidden="true"
    />
  );
}
