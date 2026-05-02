import { getAllAdresses } from "@/lib/api";
import { CATEGORIES, GEO_ZONES } from "@/lib/constants";
import { formatBudget } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TastyScore from "@/components/ui/TastyScore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparer les adresses",
};

export default async function ComparerPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const slugs = s?.split(",").filter(Boolean) || [];

  if (slugs.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-moselle-text-light mb-4">
          Selectionnez au moins 2 adresses pour les comparer.
        </p>
        <Link href="/adresses" className="text-moselle-green hover:underline">
          <ArrowLeft size={16} className="inline mr-1" />
          Retour aux adresses
        </Link>
      </div>
    );
  }

  const allAdresses = await getAllAdresses();
  const adresses = slugs
    .map((slug) => allAdresses.find((a) => a.slug === slug))
    .filter(Boolean);

  if (adresses.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-moselle-text-light">Adresses introuvables.</p>
      </div>
    );
  }

  const rows: { label: string; values: (string | React.ReactNode)[] }[] = [
    {
      label: "Categorie",
      values: adresses.map((a) => CATEGORIES.find((c) => c.value === a!.category)?.label || ""),
    },
    {
      label: "Zone",
      values: adresses.map((a) => GEO_ZONES.find((z) => z.value === a!.geoZone)?.label || ""),
    },
    {
      label: "Budget",
      values: adresses.map((a) => formatBudget(a!.budget)),
    },
    {
      label: "TastyScore",
      values: adresses.map((a) => (
        <TastyScore key={a!.slug} score={a!.tastyScore} size="sm" />
      )),
    },
    {
      label: "Accueil",
      values: adresses.map((a) => `${a!.scoreCriteria.accueil}/10`),
    },
    {
      label: "Assiette",
      values: adresses.map((a) => `${a!.scoreCriteria.assiette}/10`),
    },
    {
      label: "Cadre",
      values: adresses.map((a) => `${a!.scoreCriteria.cadre}/10`),
    },
    {
      label: "Rapport Q/P",
      values: adresses.map((a) => `${a!.scoreCriteria.rapportQualitePrix}/10`),
    },
    {
      label: "Le petit plus",
      values: adresses.map((a) => (
        <span key={a!.slug} className="text-sm italic text-moselle-text-light">
          &ldquo;{a!.petitPlus}&rdquo;
        </span>
      )),
    },
  ];

  return (
    <div className="section-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/adresses"
          className="inline-flex items-center gap-1 text-sm text-moselle-green hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Retour aux adresses
        </Link>

        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-moselle-text mb-8">
          Comparateur
        </h1>

        <div className="overflow-x-auto -mx-4 px-4 pb-4">
          <table className="w-full min-w-[600px]">
            {/* Header with images */}
            <thead>
              <tr>
                <th className="w-32" />
                {adresses.map((a) => (
                  <th key={a!.slug} className="px-3 pb-4 text-center">
                    <Link href={`/adresses/${a!.slug}`} className="group block">
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2">
                        <Image
                          src={a!.coverImage.url}
                          alt={a!.coverImage.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-cover group-hover:scale-105 transition-transform vintage-img"
                        />
                      </div>
                      <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-moselle-text group-hover:text-moselle-green transition-colors">
                        {a!.name}
                      </h2>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-moselle-cream-dark">
                  <td className="py-3 px-2 text-sm font-semibold text-moselle-text-light whitespace-nowrap">
                    {row.label}
                  </td>
                  {row.values.map((val, i) => (
                    <td key={i} className="py-3 px-3 text-center text-sm text-moselle-text">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
