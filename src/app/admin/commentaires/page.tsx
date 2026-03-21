import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import { db } from "@/lib/db";
import { blogComments, blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import { approveCommentAction, deleteCommentAction } from "@/lib/admin/comment-actions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  await requireAuth();

  const comments = await db
    .select({
      id: blogComments.id,
      pseudo: blogComments.pseudo,
      comment: blogComments.comment,
      approved: blogComments.approved,
      createdAt: blogComments.createdAt,
      postTitle: blogPosts.title,
    })
    .from(blogComments)
    .leftJoin(blogPosts, eq(blogComments.postId, blogPosts.id))
    .orderBy(desc(blogComments.createdAt));

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Commentaires ({comments.length})
        </h1>

        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-yellow-800 bg-yellow-100 inline-block px-3 py-1 rounded-full mb-4">
              En attente ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((c) => (
                <div key={c.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-moselle-text">{c.pseudo}</p>
                      <p className="text-xs text-moselle-text-light mb-1">
                        sur &quot;{c.postTitle}&quot; · {formatDate(c.createdAt)}
                      </p>
                      <p className="text-sm text-moselle-text">{c.comment}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <form action={approveCommentAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">
                          Approuver
                        </button>
                      </form>
                      <form action={deleteCommentAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {approved.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-green-800 bg-green-100 inline-block px-3 py-1 rounded-full mb-4">
              Approuvés ({approved.length})
            </h2>
            <div className="space-y-3">
              {approved.map((c) => (
                <div key={c.id} className="bg-moselle-white border border-moselle-cream-dark rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-moselle-text">{c.pseudo}</p>
                      <p className="text-xs text-moselle-text-light mb-1">
                        sur &quot;{c.postTitle}&quot; · {formatDate(c.createdAt)}
                      </p>
                      <p className="text-sm text-moselle-text">{c.comment}</p>
                    </div>
                    <form action={deleteCommentAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200">
                        Supprimer
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {comments.length === 0 && (
          <p className="text-moselle-text-light italic">Aucun commentaire.</p>
        )}
      </div>
    </>
  );
}
