import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import DeleteButton from "@/components/admin/DeleteButton";
import { db } from "@/lib/db";
import { adresses } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { deleteAdresseAction } from "@/lib/admin/adresse-actions";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { BUDGET_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminAdressesPage() {
  await requireAuth();

  const allAdresses = await db.select().from(adresses).orderBy(desc(adresses.updatedAt));

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text">
            Adresses ({allAdresses.length})
          </h1>
          <Link
            href="/admin/adresses/new"
            className="inline-flex items-center gap-1.5 bg-moselle-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-moselle-green/90 transition-colors"
          >
            <Plus size={16} /> Nouvelle adresse
          </Link>
        </div>

        <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-moselle-cream/50 text-left">
                  <th className="px-4 py-3 font-semibold">Nom</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Categorie</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Zone</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Budget</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Score</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-moselle-cream-dark">
                {allAdresses.map((a) => (
                  <tr key={a.id} className="hover:bg-moselle-cream/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-moselle-text-light">{a.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-moselle-text-light">{a.geoZone}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{BUDGET_LABELS[a.budget]}</td>
                    <td className="px-4 py-3 hidden sm:table-cell font-semibold text-moselle-green">{a.tastyScore}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/adresses/${a.id}/edit`} className="flex items-center gap-1 text-moselle-green hover:underline">
                          <Pencil size={14} /> Modifier
                        </Link>
                        <DeleteButton action={deleteAdresseAction} id={a.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
