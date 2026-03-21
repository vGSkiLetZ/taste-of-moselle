import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { adminLogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const actionIcons = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
};

const actionColors = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
};

const actionLabels = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
};

const entityLabels: Record<string, string> = {
  adresse: "Adresse",
  blog: "Article",
  review: "Avis",
  comment: "Commentaire",
};

export default async function AdminLogsPage() {
  await requireAuth();

  const logs = await db
    .select()
    .from(adminLogs)
    .orderBy(desc(adminLogs.createdAt))
    .limit(100);

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Historique d&apos;activité
        </h1>

        {logs.length === 0 ? (
          <p className="text-moselle-text-light italic">Aucune activité enregistrée.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const Icon = actionIcons[log.action as keyof typeof actionIcons] || Pencil;
              const color = actionColors[log.action as keyof typeof actionColors] || "bg-gray-100 text-gray-700";
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-3 bg-moselle-white rounded-xl border border-moselle-cream-dark px-4 py-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-moselle-text">
                      <span className="font-semibold">
                        {actionLabels[log.action as keyof typeof actionLabels]}
                      </span>
                      {" "}
                      {entityLabels[log.entity] || log.entity}
                      {" : "}
                      <span className="font-medium">{log.entityName}</span>
                    </p>
                  </div>
                  <span className="text-xs text-moselle-text-light whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
