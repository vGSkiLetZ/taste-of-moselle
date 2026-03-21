import { requireAuth } from "@/lib/admin/auth";
import AdminNav from "@/components/admin/AdminNav";
import CsvImporter from "@/components/admin/CsvImporter";

export const dynamic = "force-dynamic";

export default async function AdminImportPage() {
  await requireAuth();

  return (
    <>
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-moselle-text mb-2">
          Import CSV
        </h1>
        <p className="text-sm text-moselle-text-light mb-6">
          Importez plusieurs adresses en une seule fois via un fichier CSV.
        </p>

        <div className="bg-moselle-white rounded-2xl border border-moselle-cream-dark p-6 mb-6">
          <h2 className="font-semibold text-moselle-text mb-3">Format attendu</h2>
          <p className="text-sm text-moselle-text-light mb-3">
            Le fichier CSV doit contenir les colonnes suivantes (séparées par des virgules) :
          </p>
          <div className="bg-moselle-cream/50 rounded-xl p-4 font-mono text-xs overflow-x-auto">
            name,category,geoZone,budget,petitPlus,description,address,lat,lng,phone,website,openingHours,scoreAccueil,scoreAssiette,scoreCadre,scoreRapportQP
          </div>
          <div className="mt-3 text-xs text-moselle-text-light space-y-1">
            <p><strong>category</strong> : winstub, gastronomique, street-food, producteur-local, vins-caves, brasserie, salon-de-the, traiteur</p>
            <p><strong>geoZone</strong> : metz, thionville-frontiere, sarrebourg, pays-de-bitche, vallee-moselle, bassin-houiller</p>
            <p><strong>budget</strong> : 1 à 4</p>
            <p><strong>scores</strong> : 0 à 10</p>
          </div>
        </div>

        <CsvImporter />
      </div>
    </>
  );
}
