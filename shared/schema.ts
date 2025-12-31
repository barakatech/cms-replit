import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Price Alert Subscription - for stock price alerts
export const priceAlertSubscriptions = pgTable("price_alert_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  tickers: text("tickers").array().notNull(),
  frequency: text("frequency").notNull(), // 'instant' | 'daily' | 'weekly'
  locale: text("locale").notNull().default('en'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPriceAlertSubscriptionSchema = createInsertSchema(priceAlertSubscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertPriceAlertSubscription = z.infer<typeof insertPriceAlertSubscriptionSchema>;
export type PriceAlertSubscription = typeof priceAlertSubscriptions.$inferSelect;

// Newsletter Signup
export const newsletterSignups = pgTable("newsletter_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  locale: text("locale").notNull().default('en'),
  source: text("source").notNull().default('discover'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterSignupSchema = createInsertSchema(newsletterSignups).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsletterSignup = z.infer<typeof insertNewsletterSignupSchema>;
export type NewsletterSignup = typeof newsletterSignups.$inferSelect;

// Discover Settings Types (for in-memory storage)
export interface HeroChip {
  label_en: string;
  label_ar: string;
  href: string;
}

export interface TrendingTab {
  key: string;
  label_en: string;
  label_ar: string;
  tickers: string[];
}

export interface DiscoverSettings {
  id: string;
  heroTitle_en: string;
  heroTitle_ar: string;
  heroSubtitle_en: string;
  heroSubtitle_ar: string;
  heroChips: HeroChip[];
  featuredThemeNewSlug: string;
  featuredThemeMonthSlug: string;
  otherThemeSlugs: string[];
  trendingTabs: TrendingTab[];
  featuredTickers: string[];
  learnFeaturedPostId: string;
  learnSecondaryPostIds: string[];
  learnCategorySlugs: string[];
  sectionVisibility: {
    offers: boolean;
    themes: boolean;
    trending: boolean;
    featured: boolean;
    priceAlerts: boolean;
    learn: boolean;
    newsletter: boolean;
    disclosures: boolean;
  };
}

export interface StockTheme {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  tickers: string[];
  heroImage: string;
  icon: string;
  order: number;
  status: 'active' | 'inactive';
  isNew: boolean;
  isFeatured: boolean;
}

export interface OfferBanner {
  id: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  ctaText_en: string;
  ctaText_ar: string;
  ctaUrl: string;
  backgroundImage: string;
  backgroundColor: string;
  placement: string;
  status: 'active' | 'scheduled' | 'inactive';
  startDate: string;
  endDate: string;
  order: number;
}
