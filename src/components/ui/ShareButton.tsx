"use client";

import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "./Toast";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: "icon" | "full";
}

export default function ShareButton({
  title,
  text,
  url,
  className,
  variant = "icon",
}: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareData = { title, text: text || title, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast("link-copied", "Lien copié !");
      } catch {
        toast("error", "Impossible de copier");
      }
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleShare}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-moselle-cream text-moselle-text text-sm font-[family-name:var(--font-heading)] font-semibold",
          "hover:bg-moselle-cream-dark transition-colors btn-press",
          className
        )}
      >
        <Share2 size={16} />
        Partager
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-full",
        "bg-white/90 backdrop-blur-sm shadow-md",
        "text-moselle-text-light hover:text-moselle-green transition-all hover:scale-110",
        className
      )}
      aria-label="Partager"
    >
      <Share2 size={18} />
    </button>
  );
}
