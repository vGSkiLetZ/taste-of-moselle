import type { Adresse, BlogPost } from "./types";
import { CATEGORIES, GEO_ZONES, BUDGET_LABELS } from "./constants";

export function generateRestaurantSchema(adresse: Adresse) {
  const category = CATEGORIES.find((c) => c.value === adresse.category);
  const zone = GEO_ZONES.find((z) => z.value === adresse.geoZone);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: adresse.name,
    description: adresse.description.slice(0, 200),
    image: adresse.coverImage.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: adresse.address,
      addressLocality: zone?.label ?? "",
      addressRegion: "Moselle",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: adresse.coordinates.lat,
      longitude: adresse.coordinates.lng,
    },
    telephone: adresse.phone,
    url: adresse.website,
    servesCuisine: category?.label,
    priceRange: BUDGET_LABELS[adresse.budget],
    openingHours: adresse.openingHours,
  };
}

export function generateReviewSchema(adresse: Adresse) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Restaurant",
      name: adresse.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: adresse.tastyScore,
      bestRating: 10,
      worstRating: 0,
    },
    author: {
      "@type": "Person",
      name: "Les Tasty",
    },
    publisher: {
      "@type": "Organization",
      name: "Taste of Moselle",
    },
    reviewBody: adresse.petitPlus,
  };
}

export function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.url,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Taste of Moselle",
    },
    datePublished: post.publishedAt,
  };
}
