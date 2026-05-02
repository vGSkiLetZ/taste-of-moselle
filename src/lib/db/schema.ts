import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const adresses = sqliteTable(
  "adresses",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    geoZone: text("geo_zone").notNull(),
    tastyScore: real("tasty_score").notNull(),
    scoreAccueil: integer("score_accueil").notNull(),
    scoreAssiette: integer("score_assiette").notNull(),
    scoreCadre: integer("score_cadre").notNull(),
    scoreRapportQP: integer("score_rapport_qp").notNull(),
    budget: integer("budget").notNull(),
    petitPlus: text("petit_plus").notNull(),
    description: text("description").notNull(),
    coverUrl: text("cover_url").notNull(),
    coverAlt: text("cover_alt").notNull().default(""),
    coverWidth: integer("cover_width").notNull().default(800),
    coverHeight: integer("cover_height").notNull().default(600),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    googleMapsId: text("google_maps_id"),
    phone: text("phone"),
    reservationUrl: text("reservation_url"),
    website: text("website"),
    address: text("address").notNull(),
    openingHours: text("opening_hours"),
    tags: text("tags").notNull().default(""),
    publishedAt: text("published_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
    updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_adresses_category").on(table.category),
    index("idx_adresses_geo_zone").on(table.geoZone),
    index("idx_adresses_name").on(table.name),
  ]
);

export const adresseGallery = sqliteTable(
  "adresse_gallery",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    adresseId: text("adresse_id")
      .notNull()
      .references(() => adresses.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    width: integer("width").notNull().default(800),
    height: integer("height").notNull().default(600),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("idx_adresse_gallery_adresse").on(table.adresseId)]
);

export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    pillar: text("pillar").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverUrl: text("cover_url").notNull(),
    coverAlt: text("cover_alt").notNull().default(""),
    coverWidth: integer("cover_width").notNull().default(800),
    coverHeight: integer("cover_height").notNull().default(600),
    author: text("author").notNull().default("Les Tasty"),
    readingTime: integer("reading_time").notNull().default(5),
    relatedAdresses: text("related_adresses").notNull().default(""),
    tags: text("tags").notNull().default(""),
    status: text("status").notNull().default("draft"), // draft | scheduled | published
    publishedAt: text("published_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
    updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_blog_posts_status").on(table.status),
    index("idx_blog_posts_pillar").on(table.pillar),
    index("idx_blog_posts_published_at").on(table.publishedAt),
  ]
);

export const reviews = sqliteTable(
  "reviews",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    adresseId: text("adresse_id")
      .notNull()
      .references(() => adresses.id, { onDelete: "cascade" }),
    pseudo: text("pseudo").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment").notNull().default(""),
    approved: integer("approved", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_reviews_adresse_approved").on(table.adresseId, table.approved),
    index("idx_reviews_approved").on(table.approved),
  ]
);

export const blogComments = sqliteTable(
  "blog_comments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    postId: text("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    pseudo: text("pseudo").notNull(),
    comment: text("comment").notNull(),
    approved: integer("approved", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_blog_comments_post_approved").on(table.postId, table.approved),
    index("idx_blog_comments_approved").on(table.approved),
  ]
);

export const adminLogs = sqliteTable(
  "admin_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    action: text("action").notNull(), // create | update | delete
    entity: text("entity").notNull(), // adresse | blog | review | comment
    entityId: text("entity_id").notNull(),
    entityName: text("entity_name").notNull(),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [index("idx_admin_logs_created_at").on(table.createdAt)]
);

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export const pageViews = sqliteTable(
  "page_views",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageType: text("page_type").notNull(),
    pageSlug: text("page_slug").notNull(),
    viewedAt: text("viewed_at").notNull().default(sql`(current_timestamp)`),
  },
  (table) => [
    index("idx_page_views_type_slug").on(table.pageType, table.pageSlug),
    index("idx_page_views_viewed_at").on(table.viewedAt),
  ]
);
