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

  const csvRows = [headers.map(csvField).join(",")];

  for (const a of allAdresses) {
    const row = [
      a.name,
      a.slug,
      a.category,
      a.geoZone,
      a.budget,
      a.tastyScore,
      a.scoreAccueil,
      a.scoreAssiette,
      a.scoreCadre,
      a.scoreRapportQP,
      a.petitPlus,
      a.description,
      a.address,
      a.lat,
      a.lng,
      a.phone || "",
      a.website || "",
      a.reservationUrl || "",
      a.openingHours || "",
      a.tags,
      a.publishedAt,
    ];
    csvRows.push(row.map(csvField).join(","));
  }

  // Excel-on-Windows wants UTF-8 BOM + CRLF line endings.
  const csv = "﻿" + csvRows.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="taste-of-moselle-adresses-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

function csvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = String(value);
  // Defang formula injection: =, +, -, @, TAB, CR cells starting with these
  // are interpreted as formulas in Excel/LibreOffice.
  if (/^[=+\-@\t\r]/.test(s)) {
    s = "'" + s;
  }
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
