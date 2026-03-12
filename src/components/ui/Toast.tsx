"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Heart, Link2, Send, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "wishlist-add" | "wishlist-remove" | "link-copied" | "form-sent" | "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  leaving?: boolean;
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  "wishlist-add": <Heart size={18} fill="currentColor" className="text-moselle-red" />,
  "wishlist-remove": <Heart size={18} className="text-moselle-text-light" />,
  "link-copied": <Link2 size={18} className="text-moselle-blue" />,
  "form-sent": <Send size={18} className="text-moselle-green" />,
  success: <Check size={18} className="text-moselle-green" />,
  error: <X size={18} className="text-moselle-red" />,
};

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev.slice(-2), { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full",
              "bg-moselle-white/95 backdrop-blur-xl shadow-lg border border-moselle-cream-dark/60",
              "font-[family-name:var(--font-heading)] text-sm font-semibold text-moselle-text",
              t.leaving
                ? "animate-[toast-out_0.3s_ease-in_forwards]"
                : "animate-[toast-in_0.3s_ease-out]"
            )}
          >
            {ICON_MAP[t.type]}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
