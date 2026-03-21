import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adresses } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { getSession } from "@/lib/admin/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const allAdresses = await db.select().from(adresses).orderBy(asc(adresses.name));

  const headers = [
    "name", "slug", "category", "geoZone", "budget", "tastyScore",
    "scoreAccueil", "scoreAssiette", "scoreCadre", "scoreRapportQP",
    "petitPlus", "description", "address", "lat", "lng",
    "phone", "website", "reservationUrl", "openingHours", "tags", "publishedAt",
  ];

  const csvRows = [headers.join(",")];

  for (const a of allAdresses) {
    const row = [
      escapeCsv(a.name),
      a.slug,
      a.category,
      a.geoZone,
      a.budget,
      a.tastyScore,
      a.scoreAccueil,
      a.scoreAssiette,
      a.scoreCadre,
      a.scoreRapportQP,
      escapeCsv(a.petitPlus),
      escapeCsv(a.description),
      escapeCsv(a.address),
      a.lat,
      a.lng,
      a.phone || "",
      a.website || "",
      a.reservationUrl || "",
      escapeCsv(a.openingHours || ""),
      a.tags,
      a.publishedAt,
    ];
    csvRows.push(row.join(","));
  }

  const csv = csvRows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="taste-of-moselle-adresses-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
