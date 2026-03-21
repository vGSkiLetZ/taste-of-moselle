import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import AdresseForm from "@/components/admin/AdresseForm";
import { createAdresseAction } from "@/lib/admin/adresse-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewAdressePage() {
  await requireAuth();

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/admin/adresses" className="inline-flex items-center gap-1 text-sm text-moselle-text-light hover:text-moselle-green mb-4">
          <ArrowLeft size={14} /> Retour aux adresses
        </Link>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-6">
          Nouvelle adresse
        </h1>
        <AdresseForm action={createAdresseAction} />
      </div>
    </>
  );
}
