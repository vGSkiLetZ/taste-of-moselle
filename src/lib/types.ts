// ===== Enums / Union Types =====

export type Category =
  | "winstub"
  | "gastronomique"
  | "street-food"
  | "producteur-local"
  | "vins-caves"
  | "brasserie"
  | "salon-de-the"
  | "traiteur";

export type GeoZone =
  | "metz"
  | "thionville-frontiere"
  | "sarrebourg"
  | "pays-de-bitche"
  | "vallee-moselle"
  | "bassin-houiller";

export type BudgetLevel = 1 | 2 | 3 | 4;

export type BlogPillar =
  | "dossier-thematique"
  | "rencontre"
  | "echappee";

// ===== Data Models =====

export interface TastyScoreCriteria {
  accueil: number;          // 0-10
  assiette: number;         // 0-10
  cadre: number;            // 0-10
  rapportQualitePrix: number; // 0-10
}

export interface ImageAsset {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Adresse {
  id: string;
  slug: string;
  name: string;
  category: Category;
  geoZone: GeoZone;
  tastyScore: number;
  scoreCriteria: TastyScoreCriteria;
  budget: BudgetLevel;
  petitPlus: string;
  description: string;
  coverImage: ImageAsset;
  gallery: ImageAsset[];
  coordinates: { lat: number; lng: number };
  googleMapsId?: string;
  phone?: string;
  reservationUrl?: string;
  website?: string;
  address: string;
  openingHours?: string;
  tags: string[];
  publishedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  pillar: BlogPillar;
  excerpt: string;
  content: string;
  coverImage: ImageAsset;
  author: string;
  publishedAt: string;
  readingTime: number;
  relatedAdresses: string[];
  tags: string[];
}

// ===== Filter State =====

export interface AdresseFilters {
  search: string;
  categories: Category[];
  zones: GeoZone[];
  budgetMin: BudgetLevel;
  budgetMax: BudgetLevel;
  sortBy: "score" | "name" | "budget" | "recent";
}
