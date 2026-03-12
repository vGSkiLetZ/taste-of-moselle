import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://tasteofmoselle.fr" },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://tasteofmoselle.fr${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-moselle-text-light overflow-x-auto hide-scrollbar">
        <Link
          href="/"
          className="shrink-0 hover:text-moselle-green transition-colors"
          aria-label="Accueil"
        >
          <Home size={14} />
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight size={12} className="text-moselle-text-light/50" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-moselle-green transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-moselle-text font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
