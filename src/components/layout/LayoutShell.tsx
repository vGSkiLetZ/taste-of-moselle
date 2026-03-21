"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CookieBanner from "@/components/ui/CookieBanner";
import SplashScreen from "@/components/ui/SplashScreen";
import { ToastProvider } from "@/components/ui/Toast";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <SplashScreen />
      <Header />
      <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <ScrollToTop />
      <CookieBanner />
    </ToastProvider>
  );
}
