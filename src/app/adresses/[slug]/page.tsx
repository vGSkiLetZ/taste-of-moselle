import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, ExternalLink, Clock, ArrowLeft } from "lucide-react";
import { getAllAdresses, getAdresseBySlug } from "@/lib/api";
import { CATEGORIES, GEO_ZONES } from "@/lib/constants";
import { generateRestaurantSchema, generateReviewSchema } from "@/lib/seo";
import Badge, { BudgetBadge } from "@/components/ui/Badge";
import TastyScore from "@/components/ui/TastyScore";
import CategoryIcon from "@/components/ui/CategoryIcon";
import WishlistButton from "@/components/engagement/WishlistButton";
import ShareButton from "@/components/ui/ShareButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ImageGallery from "@/components/ui/ImageGallery";
import ReviewSection from "@/components/adresses/ReviewSection";
import ViewTracker from "@/components/analytics/ViewTracker";
import SwipeNavigation from "@/components/adresses/SwipeNavigation";

export async function generateStaticParams() {
  const adresses = await getAllAdresses();
  return adresses.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const adresse = await getAdresseBySlug(slug);
  if (!adresse) return { title: "Adresse introuvable" };

  return {
    title: adresse.name,
    description: adresse.petitPlus,
    openGraph: {
      title: `${adresse.name} | Taste of Moselle`,
      description: adresse.petitPlus,
      images: [adresse.coverImage.url],
    },
  };
}

export default async function AdresseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adresse = await getAdresseBySlug(slug);
  if (!adresse) notFound();

  // Get adjacent addresses for swipe navigation
  const allAdresses = await getAllAdresses();
  const currentIndex = allAdresses.findIndex((a) => a.slug === slug);
  const prevAdresse = currentIndex > 0 ? allAdresses[currentIndex - 1] : null;
  const nextAdresse = currentIndex < allAdresses.length - 1 ? allAdresses[currentIndex + 1] : null;

  const category = CATEGORIES.find((c) => c.value === adresse.category);
  const zone = GEO_ZONES.find((z) => z.value === adresse.geoZone);

  const restaurantSchema = generateRestaurantSchema(adresse);
  const reviewSchema = generateReviewSchema(adresse);

  return (
    <>
      <ViewTracker pageType="adresse" pageSlug={adresse.slug} />
      <SwipeNavigation
        prevSlug={prevAdresse?.slug ?? null}
        nextSlug={nextAdresse?.slug ?? null}
        prevName={prevAdresse?.name ?? null}
        nextName={nextAdresse?.name ?? null}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      {/* Hero image full-width */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <Image
          src={adresse.coverImage.url}
          alt={adresse.coverImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover vintage-img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-moselle-text/70 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            href="/adresses"
            className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ShareButton title={adresse.name} text={adresse.petitPlus} />
          <WishlistButton slug={adresse.slug} />
        </div>
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={adresse.category === "gastronomique" ? "red" : "green"}>
                <CategoryIcon category={adresse.category} size={14} />
                {category?.label}
              </Badge>
              <Badge variant="cream">
                <MapPin size={14} />
                {zone?.label}
              </Badge>
              <BudgetBadge level={adresse.budget} className="text-lg" />
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight [text-shadow:_0_2px_12px_rgba(0,0,0,0.4)]">
              {adresse.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-1">
        <Breadcrumbs
          items={[
            { label: "Les Adresses", href: "/adresses" },
            { label: adresse.name },
          ]}
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 relative z-10 pb-12">
        {/* Petit Plus card */}
        <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-5 sm:p-6 mb-8 shadow-lg">
          <div className="relative z-2">
            <p className="font-[family-name:var(--font-accent)] text-xl sm:text-2xl text-moselle-green text-center">
              &ldquo;{adresse.petitPlus}&rdquo;
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Score */}
            <div className="paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-5">
              <div className="relative z-2">
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-moselle-text mb-3 section-heading">
                  Tasty Score
                </h2>
                <TastyScore
                  score={adresse.tastyScore}
                  criteria={adresse.scoreCriteria}
                  size="lg"
                  showCriteria
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-moselle-text mb-3 section-heading">
                Notre avis
              </h2>
              <p className="font-[family-name:var(--font-body)] text-moselle-text leading-relaxed whitespace-pre-line">
                {adresse.description}
              </p>
            </div>

            {/* Gallery */}
            {adresse.gallery && adresse.gallery.length > 0 && (
              <ImageGallery images={adresse.gallery} />
            )}

            {/* Reviews */}
            <div>
              <h2 className="font-[family-name:var(--font-heading)] font-semibold text-xl text-moselle-text mb-4 section-heading">
                Avis des visiteurs
              </h2>
              <ReviewSection adresseId={adresse.id} />
            </div>
          </div>

          {/* Sidebar - Practical info */}
          <div className="md:col-span-1">
            <div className="sticky top-20 paper-texture bg-moselle-cream rounded-[var(--radius-card)] p-5">
              <div className="relative z-2 space-y-4">
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-moselle-text section-heading">
                  Infos pratiques
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-moselle-green shrink-0 mt-0.5" />
                    <span className="text-moselle-text">{adresse.address}</span>
                  </div>

                  {adresse.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-moselle-green shrink-0" />
                      <a
                        href={`tel:${adresse.phone.replace(/\s/g, "")}`}
                        className="text-moselle-green hover:underline"
                      >
                        {adresse.phone}
                      </a>
                    </div>
                  )}

                  {adresse.openingHours && (
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-moselle-green shrink-0 mt-0.5" />
                      <span className="text-moselle-text">{adresse.openingHours}</span>
                    </div>
                  )}

                  {(adresse.reservationUrl || adresse.website) && (
                    <div className="flex items-center gap-3">
                      <ExternalLink size={18} className="text-moselle-green shrink-0" />
                      <a
                        href={adresse.reservationUrl || adresse.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-moselle-green hover:underline"
                      >
                        {adresse.reservationUrl ? "Réserver" : "Site web"}
                      </a>
                    </div>
                  )}
                </div>

                <Link
                  href={`/carte?highlight=${adresse.slug}`}
                  className="flex items-center justify-center gap-2 w-full mt-4 px-5 py-2.5 bg-moselle-green text-white rounded-full text-sm font-semibold hover:bg-moselle-green-light transition-colors btn-press"
                >
                  <MapPin size={16} />
                  Voir sur la Tasty Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
