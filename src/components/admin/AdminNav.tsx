"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/admin/actions";
import { LayoutDashboard, MapPin, FileText, MessageSquare, BarChart3, MessageCircle, History, Upload, Users, Flame, ExternalLink, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/adresses", label: "Adresses", icon: MapPin },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/avis", label: "Avis", icon: MessageSquare },
  { href: "/admin/commentaires", label: "Commentaires", icon: MessageCircle },
  { href: "/admin/analytics", label: "Stats", icon: BarChart3 },
  { href: "/admin/heatmap", label: "Heatmap", icon: Flame },
  { href: "/admin/logs", label: "Logs", icon: History },
  { href: "/admin/import", label: "Import", icon: Upload },
  { href: "/admin/utilisateurs", label: "Équipe", icon: Users },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-moselle-green text-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-[family-name:var(--font-heading)] text-lg font-bold">
            Taste of Moselle <span className="text-moselle-cream text-sm font-normal ml-1">Admin</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-sm hover:text-moselle-cream transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Voir le site</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1 text-sm hover:text-red-200 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Deconnexion</span>
            </button>
          </form>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="sm:hidden flex border-t border-white/20">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
