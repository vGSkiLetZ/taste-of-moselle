"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Map, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/adresses", label: "Adresses", icon: MapPin },
  { href: "/carte", label: "Carte", icon: Map },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useWishlist();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-moselle-white/85 backdrop-blur-xl border-t border-moselle-cream-dark/50 safe-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 relative transition-colors",
                isActive
                  ? "text-moselle-green"
                  : "text-moselle-text-light"
              )}
            >
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {item.href === "/wishlist" && count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-moselle-red text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {count}
                  </span>
                )}
              </div>
              <span className={cn(
                "font-[family-name:var(--font-heading)] text-[10px] uppercase tracking-wider",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-moselle-green" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
