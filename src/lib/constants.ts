import type { Category, GeoZone, BlogPillar } from "./types";

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "winstub", label: "Winstub", icon: "utensils" },
  { value: "gastronomique", label: "Gastronomique", icon: "utensils" },
  { value: "street-food", label: "Street Food", icon: "utensils" },
  { value: "brasserie", label: "Brasserie", icon: "utensils" },
  { value: "salon-de-the", label: "Salon de Thé", icon: "utensils" },
  { value: "traiteur", label: "Traiteur", icon: "utensils" },
  { value: "producteur-local", label: "Producteur", icon: "wheat" },
  { value: "vins-caves", label: "Vins & Caves", icon: "grape" },
];

export const GEO_ZONES: { value: GeoZone; label: string }[] = [
  { value: "metz", label: "Metz & alentours" },
  { value: "thionville-frontiere", label: "Thionville / Frontière" },
  { value: "sarrebourg", label: "Pays de Sarrebourg" },
  { value: "pays-de-bitche", label: "Pays de Bitche" },
  { value: "vallee-moselle", label: "Vallée de la Moselle" },
  { value: "bassin-houiller", label: "Bassin Houiller" },
];

export const BUDGET_LABELS: Record<number, string> = {
  1: "€",
  2: "€€",
  3: "€€€",
  4: "€€€€",
};

export const BLOG_PILLARS: { value: BlogPillar; label: string; description: string }[] = [
  {
    value: "dossier-thematique",
    label: "Dossiers",
    description: "Guides thématiques et tops",
  },
  {
    value: "rencontre",
    label: "Rencontres",
    description: "Portraits de chefs et artisans",
  },
  {
    value: "echappee",
    label: "L'Échappée",
    description: "Nos voyages hors Moselle",
  },
];

export const SCORE_CRITERIA_LABELS: Record<string, string> = {
  accueil: "Accueil",
  assiette: "Assiette",
  cadre: "Cadre",
  rapportQualitePrix: "Rapport Q/P",
};

export const MAP_CENTER = { lat: 49.12, lng: 6.18 };
export const MAP_DEFAULT_ZOOM = 10;

export const SITE_NAME = "Taste of Moselle";
export const SITE_TAGLINE = "Le guide gourmand de la Moselle";
export const SITE_DESCRIPTION =
  "Le guide Michelin de la bienveillance en Moselle. Découvrez les meilleures adresses gourmandes.";
