import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const adresses = sqliteTable("adresses", {
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
});

export const adresseGallery = sqliteTable("adresse_gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adresseId: text("adresse_id")
    .notNull()
    .references(() => adresses.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  width: integer("width").notNull().default(800),
  height: integer("height").notNull().default(600),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const blogPosts = sqliteTable("blog_posts", {
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
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adresseId: text("adresse_id")
    .notNull()
    .references(() => adresses.id, { onDelete: "cascade" }),
  pseudo: text("pseudo").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull().default(""),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const blogComments = sqliteTable("blog_comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: text("post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  pseudo: text("pseudo").notNull(),
  comment: text("comment").notNull(),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const adminLogs = sqliteTable("admin_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(), // create | update | delete
  entity: text("entity").notNull(), // adresse | blog | review | comment
  entityId: text("entity_id").notNull(),
  entityName: text("entity_name").notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"), // admin | editor
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const pageViews = sqliteTable("page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageType: text("page_type").notNull(),
  pageSlug: text("page_slug").notNull(),
  viewedAt: text("viewed_at").notNull().default(sql`(current_timestamp)`),
});
