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

// ============================================
// CMS WEB EVENTS (Internal Analytics Pipeline)
// ============================================

export type CmsWebEventType = 
  | 'page_view'
  | 'banner_view'
  | 'banner_click'
  | 'cta_click'
  | 'newsletter_submit'
  | 'adjust_outbound_click'
  | 'install_banner_view'
  | 'install_banner_click';

export interface CmsWebEvent {
  id: string;
  eventType: CmsWebEventType;
  pagePath: string;
  locale: 'en' | 'ar';
  deviceCategory: 'mobile' | 'desktop' | 'tablet';
  userAgentHash?: string;
  metaJson: {
    bannerId?: string;
    bannerPlacement?: string;
    ctaText?: string;
    adjustUrl?: string;
    os?: 'ios' | 'android' | 'other';
    sessionId?: string;
    referrer?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}

export type InsertCmsWebEvent = Omit<CmsWebEvent, 'id' | 'createdAt'>;

// ============================================
// BANNER EVENTS (For tracking banner performance)
// ============================================

export interface BannerEvent {
  id: string;
  bannerId: string;
  bannerType: 'offer' | 'mobile_install';
  eventType: 'view' | 'click';
  placement: string;
  pagePath: string;
  locale: 'en' | 'ar';
  deviceCategory: 'mobile' | 'desktop' | 'tablet';
  createdAt: string;
}

export type InsertBannerEvent = Omit<BannerEvent, 'id' | 'createdAt'>;

// ============================================
// MOBILE INSTALL BANNER
// ============================================

export interface MobileInstallBanner {
  id: string;
  name: string;
  enabled: boolean;
  locales: ('en' | 'ar')[];
  pages: string[]; // Route patterns like "/stocks/*", "/blog/*"
  styleVariant: 'top' | 'bottom';
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  ctaText_en: string;
  ctaText_ar: string;
  iconUrl?: string;
  backgroundStyle: 'surface' | 'tertiary' | 'brand';
  adjustLinkIos: string;
  adjustLinkAndroid: string;
  frequencyCapDays: number;
  showAfterSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export type InsertMobileInstallBanner = Omit<MobileInstallBanner, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// ANALYTICS SETTINGS (GA4 Configuration)
// ============================================

export interface AnalyticsSettings {
  id: string;
  ga4PropertyId?: string;
  authType: 'service_account' | 'oauth' | 'none';
  enabled: boolean;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertAnalyticsSettings = Omit<AnalyticsSettings, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// BLOG POSTS (for Learn/Blog section)
// ============================================

export interface BlogPost {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  seo: {
    metaTitle_en?: string;
    metaTitle_ar?: string;
    metaDescription_en?: string;
    metaDescription_ar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertBlogPost = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// STOCK PAGES (for Stocks section)
// ============================================

export interface StockPage {
  id: string;
  ticker: string;
  slug: string;
  companyName_en: string;
  companyName_ar: string;
  description_en: string;
  description_ar: string;
  content_en: string;
  content_ar: string;
  sector: string;
  exchange: string;
  status: 'draft' | 'published' | 'archived';
  seo: {
    metaTitle_en?: string;
    metaTitle_ar?: string;
    metaDescription_en?: string;
    metaDescription_ar?: string;
  };
  relatedTickers: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertStockPage = Omit<StockPage, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// REAL-TIME PRESENCE (for collaborative editing)
// ============================================

export interface UserPresence {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  avatarUrl?: string;
  contentType: 'stock' | 'blog' | 'banner' | 'discover';
  contentId: string;
  field?: string;
  lastActive: number;
  cursorPosition?: { x: number; y: number };
}

export interface PresenceMessage {
  type: 'join' | 'leave' | 'update' | 'sync' | 'heartbeat';
  presence?: UserPresence;
  presences?: UserPresence[];
  timestamp: number;
}

export const PRESENCE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];
