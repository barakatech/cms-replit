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

// ============================================
// LANDING PAGE BUILDER TYPES
// ============================================

// Section Types Enum
export type LandingPageSectionType = 
  | 'hero'
  | 'valueProps'
  | 'features'
  | 'socialProof'
  | 'pricing'
  | 'offerBannerRail'
  | 'content'
  | 'faq'
  | 'leadForm'
  | 'newsletter'
  | 'footerCta';

// Localized content structure
export interface LocalizedText {
  en: string;
  ar: string;
}

// CTA Button
export interface CTAButton {
  text: LocalizedText;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

// Section Base
export interface LandingPageSectionBase {
  id: string;
  type: LandingPageSectionType;
  enabled: boolean;
  order: number;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    paddingY?: string;
  };
  rules?: {
    localeVisibility?: 'both' | 'en' | 'ar';
    deviceVisibility?: 'both' | 'desktop' | 'mobile';
  };
}

// Hero Section
export interface HeroSectionData extends LandingPageSectionBase {
  type: 'hero';
  data: {
    eyebrowText?: LocalizedText;
    headline: LocalizedText;
    subheadline?: LocalizedText;
    primaryCTA: CTAButton;
    secondaryCTA?: CTAButton;
    heroImageUrl?: string;
    trustBadges?: Array<{ imageUrl?: string; text?: LocalizedText }>;
  };
}

// Value Props Section
export interface ValuePropsSectionData extends LandingPageSectionBase {
  type: 'valueProps';
  data: {
    title: LocalizedText;
    cards: Array<{
      icon: string;
      title: LocalizedText;
      description: LocalizedText;
    }>;
  };
}

// Features Section
export interface FeaturesSectionData extends LandingPageSectionBase {
  type: 'features';
  data: {
    title: LocalizedText;
    features: Array<{
      title: LocalizedText;
      description: LocalizedText;
      imageUrl?: string;
    }>;
  };
}

// Social Proof Section
export interface SocialProofSectionData extends LandingPageSectionBase {
  type: 'socialProof';
  data: {
    title: LocalizedText;
    logos: Array<{ imageUrl: string; name: string }>;
    testimonials?: Array<{
      quote: LocalizedText;
      author: string;
      role?: string;
      avatarUrl?: string;
    }>;
  };
}

// Pricing Section
export interface PricingSectionData extends LandingPageSectionBase {
  type: 'pricing';
  data: {
    title: LocalizedText;
    plans: Array<{
      planName: LocalizedText;
      priceText: LocalizedText;
      billingPeriod: LocalizedText;
      highlightBadge?: LocalizedText;
      features: LocalizedText[];
      ctaText: LocalizedText;
      ctaUrl: string;
    }>;
    complianceNote: LocalizedText;
  };
}

// Offer Banner Rail Section
export interface OfferBannerRailSectionData extends LandingPageSectionBase {
  type: 'offerBannerRail';
  data: {
    positionKey: string;
    title?: LocalizedText;
  };
}

// Content Section (Rich Text)
export interface ContentSectionData extends LandingPageSectionBase {
  type: 'content';
  data: {
    title?: LocalizedText;
    richText: LocalizedText;
  };
}

// FAQ Section
export interface FAQSectionData extends LandingPageSectionBase {
  type: 'faq';
  data: {
    title: LocalizedText;
    items: Array<{
      question: LocalizedText;
      answer: LocalizedText;
    }>;
  };
}

// Lead Form Section
export interface LeadFormSectionData extends LandingPageSectionBase {
  type: 'leadForm';
  data: {
    title: LocalizedText;
    subtitle?: LocalizedText;
    fields: {
      name: boolean;
      email: boolean;
      phone: boolean;
      country: boolean;
    };
    submitText: LocalizedText;
    successMessage: LocalizedText;
    formKey: string;
  };
}

// Newsletter Section
export interface NewsletterSectionData extends LandingPageSectionBase {
  type: 'newsletter';
  data: {
    title: LocalizedText;
    subtitle?: LocalizedText;
    buttonText: LocalizedText;
    privacyNote?: LocalizedText;
  };
}

// Footer CTA Section
export interface FooterCTASectionData extends LandingPageSectionBase {
  type: 'footerCta';
  data: {
    headline: LocalizedText;
    supportingText?: LocalizedText;
    cta: CTAButton;
    disclaimers?: LocalizedText;
  };
}

// Union of all section types
export type LandingPageSection =
  | HeroSectionData
  | ValuePropsSectionData
  | FeaturesSectionData
  | SocialProofSectionData
  | PricingSectionData
  | OfferBannerRailSectionData
  | ContentSectionData
  | FAQSectionData
  | LeadFormSectionData
  | NewsletterSectionData
  | FooterCTASectionData;

// SEO Settings
export interface LandingPageSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemas?: object[];
}

// Landing Page Status
export type LandingPageStatus = 'draft' | 'published' | 'archived';

// Template Keys
export type LandingPageTemplateKey = 
  | 'subscription'
  | 'promoOffer'
  | 'learnGuide'
  | 'appDownload'
  | 'webinarEvent'
  | 'blank';

// Landing Page
export interface LandingPage {
  id: string;
  slug: string;
  status: LandingPageStatus;
  templateKey: LandingPageTemplateKey;
  localeContent: {
    en: {
      title: string;
      description: string;
      sections: LandingPageSection[];
      seo: LandingPageSEO;
    };
    ar: {
      title: string;
      description: string;
      sections: LandingPageSection[];
      seo: LandingPageSEO;
    };
  };
  settings: {
    themeVariantKey?: string;
    headerVariant: 'default' | 'minimal' | 'hidden';
    footerVariant: 'default' | 'minimal' | 'hidden';
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string;
  updatedByUserId?: string;
}

// Landing Page Version (for history)
export interface LandingPageVersion {
  id: string;
  landingPageId: string;
  versionNumber: number;
  snapshotJson: LandingPage;
  createdAt: string;
  createdByUserId?: string;
}

// Page Component Library (reusable sections)
export interface PageComponent {
  id: string;
  key: string;
  name: LocalizedText;
  sectionType: LandingPageSectionType;
  dataJson: object;
  createdAt: string;
  updatedAt: string;
}

// Form Submission
export interface FormSubmission {
  id: string;
  landingPageId: string;
  pageSlug: string;
  formKey: string;
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    [key: string]: unknown;
  };
  locale: 'en' | 'ar';
  createdAt: string;
}

// Analytics Event Types
export type AnalyticsEventType = 'page_view' | 'cta_click' | 'form_submit' | 'banner_click' | 'section_view';

// Analytics Event
export interface AnalyticsEvent {
  id: string;
  landingPageId: string;
  pageSlug: string;
  sessionId?: string;
  eventType: AnalyticsEventType;
  metadata: {
    sectionId?: string;
    ctaText?: string;
    formKey?: string;
    locale?: string;
    device?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}

// Insert types for storage
export type InsertLandingPage = Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertFormSubmission = Omit<FormSubmission, 'id' | 'createdAt'>;
export type InsertAnalyticsEvent = Omit<AnalyticsEvent, 'id' | 'createdAt'>;
