import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adresses } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { getSession } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  // Auth check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: 0, errors: ["Non autorisé"] }, { status: 401 });
  }

  try {
    const text = await request.text();
    const lines = text.split("\n").filter((l) => l.trim());

    if (lines.length < 2) {
      return NextResponse.json({ success: 0, errors: ["Le fichier est vide ou ne contient qu'un en-tête"] });
    }

    // Parse header
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const requiredFields = ["name", "category", "geozone", "budget", "petitplus", "description", "address", "lat", "lng"];
    const missingFields = requiredFields.filter((f) => !header.includes(f));

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: 0,
        errors: [`Colonnes manquantes : ${missingFields.join(", ")}`],
      });
    }

    let success = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length !== header.length) {
        errors.push(`Ligne ${i + 1}: nombre de colonnes incorrect (${values.length} au lieu de ${header.length})`);
        continue;
      }

      const row: Record<string, string> = {};
      header.forEach((h, idx) => {
        row[h] = values[idx]?.trim() || "";
      });

      const name = row["name"];
      if (!name) {
        errors.push(`Ligne ${i + 1}: nom manquant`);
        continue;
      }

      const scoreAccueil = Number(row["scoreaccueil"]) || 7;
      const scoreAssiette = Number(row["scoreassiette"]) || 7;
      const scoreCadre = Number(row["scorecadre"]) || 7;
      const scoreRapportQP = Number(row["scorerapportqp"]) || 7;
      const tastyScore = (scoreAccueil + scoreAssiette + scoreCadre + scoreRapportQP) / 4;

      try {
        await db.insert(adresses).values({
          id: crypto.randomUUID().slice(0, 8),
          slug: slugify(name),
          name,
          category: row["category"] || "brasserie",
          geoZone: row["geozone"] || "metz",
          budget: Number(row["budget"]) || 2,
          petitPlus: row["petitplus"] || "",
          description: row["description"] || "",
          address: row["address"] || "",
          lat: Number(row["lat"]) || 49.12,
          lng: Number(row["lng"]) || 6.18,
          phone: row["phone"] || null,
          website: row["website"] || null,
          openingHours: row["openinghours"] || null,
          coverUrl: "/images/hero/placeholder-restaurant.png",
          coverAlt: name,
          scoreAccueil,
          scoreAssiette,
          scoreCadre,
          scoreRapportQP,
          tastyScore,
          publishedAt: new Date().toISOString().split("T")[0],
        });
        success++;
      } catch (e: any) {
        errors.push(`Ligne ${i + 1} (${name}): ${e.message}`);
      }
    }

    return NextResponse.json({ success, errors });
  } catch {
    return NextResponse.json({ success: 0, errors: ["Erreur de parsing du fichier"] });
  }
}

// Simple CSV line parser that handles quoted fields
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
