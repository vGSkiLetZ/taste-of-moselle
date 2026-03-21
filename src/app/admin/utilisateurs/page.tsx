import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { createAdminUserAction, deleteAdminUserAction } from "@/lib/admin/user-actions";
import { formatDate } from "@/lib/utils";
import { UserPlus, Trash2, Shield, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAuth();

  const users = await db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));

  return (
    <>
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Utilisateurs admin
        </h1>

        {/* Add user form */}
        <form action={createAdminUserAction} className="bg-moselle-white rounded-2xl border border-moselle-cream-dark p-5 mb-6">
          <h2 className="font-semibold text-moselle-text mb-3 flex items-center gap-2">
            <UserPlus size={18} /> Ajouter un utilisateur
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              name="username"
              placeholder="Identifiant"
              required
              className="border-2 border-moselle-cream-dark rounded-xl px-4 py-2 text-sm focus:border-moselle-green outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              required
              minLength={8}
              className="border-2 border-moselle-cream-dark rounded-xl px-4 py-2 text-sm focus:border-moselle-green outline-none"
            />
            <div className="flex gap-2">
              <select
                name="role"
                className="flex-1 border-2 border-moselle-cream-dark rounded-xl px-3 py-2 text-sm focus:border-moselle-green outline-none"
              >
                <option value="editor">Éditeur</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="bg-moselle-green text-white px-4 rounded-xl text-sm font-semibold hover:bg-moselle-green/90"
              >
                Ajouter
              </button>
            </div>
          </div>
          <p className="text-xs text-moselle-text-light mt-2">
            <strong>Admin</strong> : accès complet · <strong>Éditeur</strong> : peut créer/modifier du contenu
          </p>
        </form>

        {/* Users list */}
        <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark divide-y divide-moselle-cream-dark">
          {users.length === 0 ? (
            <p className="p-4 text-sm text-moselle-text-light italic">
              Aucun utilisateur. Le mot de passe principal reste actif.
            </p>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    u.role === "admin" ? "bg-moselle-green/20 text-moselle-green" : "bg-moselle-blue/20 text-moselle-blue"
                  }`}>
                    <Shield size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-moselle-text">{u.username}</p>
                    <p className="text-xs text-moselle-text-light">
                      {u.role === "admin" ? "Administrateur" : "Éditeur"} · {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
                <form action={deleteAdminUserAction}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
