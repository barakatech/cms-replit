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

// CMS Team Member - for user management with roles
export type CmsTeamMemberRole = 'admin' | 'editor' | 'viewer';
export type CmsTeamMemberStatus = 'active' | 'invited' | 'deactivated';

export interface CmsTeamMember {
  id: string;
  name: string;
  email: string;
  role: CmsTeamMemberRole;
  status: CmsTeamMemberStatus;
  avatarUrl?: string;
  joinedAt: string;
  lastActiveAt?: string;
  invitedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsertCmsTeamMember {
  name: string;
  email: string;
  role: CmsTeamMemberRole;
  avatarUrl?: string;
}

// CMS Settings - global configuration
export interface CmsGeneralSettings {
  siteName_en: string;
  siteName_ar: string;
  defaultLanguage: 'en' | 'ar';
  timezone: string;
  dateFormat: string;
  contactEmail: string;
}

export interface CmsBrandingSettings {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface CmsSeoDefaults {
  defaultMetaTitle_en: string;
  defaultMetaTitle_ar: string;
  defaultMetaDescription_en: string;
  defaultMetaDescription_ar: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleAnalyticsId?: string;
}

export interface CmsContentSettings {
  defaultAuthor: string;
  requireFeaturedImage: boolean;
  enableContentApproval: boolean;
  autoSaveInterval: number; // in seconds
  maxUploadSizeMb: number;
}

export interface CmsSecuritySettings {
  sessionTimeoutMinutes: number;
  requireTwoFactor: boolean;
  allowedIpRanges: string[];
  passwordMinLength: number;
}

export interface CmsSettings {
  id: string;
  general: CmsGeneralSettings;
  branding: CmsBrandingSettings;
  seoDefaults: CmsSeoDefaults;
  content: CmsContentSettings;
  security: CmsSecuritySettings;
  updatedAt: string;
  updatedBy?: string;
}

export interface StockSeoTemplates {
  stockMetaTitleTemplate_en: string;
  stockMetaTitleTemplate_ar: string;
  stockMetaDescriptionTemplate_en: string;
  stockMetaDescriptionTemplate_ar: string;
  stockOgTitleTemplate_en: string;
  stockOgTitleTemplate_ar: string;
  stockOgDescriptionTemplate_en: string;
  stockOgDescriptionTemplate_ar: string;
  updatedAt?: string;
}

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

// Stock Watch Subscription - for watching specific stocks with notifications
export const stockWatchSubscriptions = pgTable("stock_watch_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  mobile: text("mobile").notNull(),
  ticker: text("ticker").notNull(),
  stockName: text("stock_name").notNull(),
  frequency: text("frequency").notNull(), // 'daily' | 'weekly' | 'monthly'
  locale: text("locale").notNull().default('en'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStockWatchSubscriptionSchema = createInsertSchema(stockWatchSubscriptions).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  mobile: z.string().min(7).max(20),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

export type InsertStockWatchSubscription = z.infer<typeof insertStockWatchSubscriptionSchema>;
export type StockWatchSubscription = typeof stockWatchSubscriptions.$inferSelect;

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

export interface StockThemeHighlight {
  icon: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
}

export interface StockThemeSEO {
  metaTitle_en?: string;
  metaTitle_ar?: string;
  metaDescription_en?: string;
  metaDescription_ar?: string;
  canonicalUrl?: string;
  schemaJsonLd?: object;
}

export interface StockTheme {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  longDescription_en?: string;
  longDescription_ar?: string;
  tickers: string[];
  heroImage: string;
  icon: string;
  badges: string[];
  highlights: StockThemeHighlight[];
  sortMode: 'manual' | 'marketCap' | 'volume' | 'performance';
  relatedPostTags: string[];
  seo: StockThemeSEO;
  order: number;
  status: 'draft' | 'published' | 'archived';
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InsertStockTheme = Omit<StockTheme, 'id' | 'createdAt' | 'updatedAt'>;

// Stock Collection (for dynamic lists like "Top by Volume")
export type StockCollectionSortRule = 'volume' | 'marketCap' | 'gainers' | 'losers' | 'mostWatched' | 'manual';

export interface StockCollection {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  sortRule: StockCollectionSortRule;
  tickers: string[];
  limit: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type InsertStockCollection = Omit<StockCollection, 'id' | 'createdAt' | 'updatedAt'>;

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
    customFields?: Array<{
      key: string;
      label: LocalizedText;
      type: 'text' | 'url' | 'number' | 'textarea' | 'select';
      required: boolean;
      placeholder?: LocalizedText;
      options?: Array<{ value: string; label: LocalizedText }>;
    }>;
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
  imageUrl?: string; // Banner background or promotional image
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
// ASSET LINKS (Curated stock link collections)
// ============================================

export interface AssetLink {
  id: string;
  collectionKey: string; // e.g., 'assets-under-500', 'top-gainers'
  ticker: string; // Stock ticker symbol
  displayOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InsertAssetLink = Omit<AssetLink, 'id' | 'createdAt' | 'updatedAt'>;

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
// STOCK PAGE BUILDER BLOCKS
// ============================================

export type StockPageBlockType = 
  | 'stockHeader'
  | 'priceSnapshot'
  | 'priceChart'
  | 'keyStatistics'
  | 'aboutCompany'
  | 'analystRatings'
  | 'earnings'
  | 'newsList'
  | 'trendingStocks'
  | 'risksDisclosure';

export interface StockPageBlockBase {
  id: string;
  type: StockPageBlockType;
  enabled: boolean;
  order: number;
}

export interface StockHeaderBlock extends StockPageBlockBase {
  type: 'stockHeader';
}

export interface PriceSnapshotBlock extends StockPageBlockBase {
  type: 'priceSnapshot';
}

export interface PriceChartBlock extends StockPageBlockBase {
  type: 'priceChart';
  config?: {
    defaultTimeframe?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  };
}

export interface KeyStatisticsBlock extends StockPageBlockBase {
  type: 'keyStatistics';
}

export interface AboutCompanyBlock extends StockPageBlockBase {
  type: 'aboutCompany';
  content_en?: string;
  content_ar?: string;
}

export interface AnalystRatingsBlock extends StockPageBlockBase {
  type: 'analystRatings';
}

export interface EarningsBlock extends StockPageBlockBase {
  type: 'earnings';
}

export interface NewsListBlock extends StockPageBlockBase {
  type: 'newsList';
  config?: {
    maxItems?: number;
  };
}

export interface TrendingStocksBlock extends StockPageBlockBase {
  type: 'trendingStocks';
  tickers?: string[];
}

export interface RisksDisclosureBlock extends StockPageBlockBase {
  type: 'risksDisclosure';
  content_en?: string;
  content_ar?: string;
}

export type StockPageBlock = 
  | StockHeaderBlock
  | PriceSnapshotBlock
  | PriceChartBlock
  | KeyStatisticsBlock
  | AboutCompanyBlock
  | AnalystRatingsBlock
  | EarningsBlock
  | NewsListBlock
  | TrendingStocksBlock
  | RisksDisclosureBlock;

export interface StockPageSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  schemasJson?: object[];
}

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
  currency?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  seo_en: StockPageSEO;
  seo_ar: StockPageSEO;
  pageBuilderJson: StockPageBlock[];
  relatedTickers: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertStockPage = Omit<StockPage, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// STOCK THEME MEMBER (join table)
// ============================================

export interface StockThemeMember {
  id: string;
  themeId: string;
  stockId: string;
  order: number;
  isFeatured: boolean;
  createdAt: string;
}

export type InsertStockThemeMember = Omit<StockThemeMember, 'id' | 'createdAt'>;

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

// ============================================
// MARKETING PIXELS (Meta, TikTok, Snapchat, Google Ads, Google Analytics)
// ============================================

export type PixelPlatform = 'meta' | 'tiktok' | 'snapchat' | 'google_ads' | 'google_analytics';

export interface MarketingPixel {
  id: string;
  name: string;
  platform: PixelPlatform;
  pixelId: string;
  enabled: boolean;
  testMode: boolean;
  locales: ('en' | 'ar')[];
  devices: ('mobile' | 'desktop' | 'tablet')[];
  pages: string[]; // Route patterns like "/stocks/*", "/blog/*", "*" for all
  createdAt: string;
  updatedAt: string;
}

export type InsertMarketingPixel = Omit<MarketingPixel, 'id' | 'createdAt' | 'updatedAt'>;

// CMS Event to Pixel Event Mapping
export type CmsEventName = 
  | 'page_view'
  | 'banner_impression'
  | 'banner_click'
  | 'newsletter_submit'
  | 'lead_submit'
  | 'app_install_click';

export interface PixelEventMap {
  id: string;
  pixelId: string;
  cmsEvent: CmsEventName;
  pixelEventName: string; // e.g., 'Lead', 'ViewContent', 'Subscribe'
  enabled: boolean;
  customParams?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type InsertPixelEventMap = Omit<PixelEventMap, 'id' | 'createdAt' | 'updatedAt'>;

// Pixel Event Dispatch Payload
export interface PixelDispatchPayload {
  eventName: CmsEventName;
  pagePath: string;
  locale: 'en' | 'ar';
  device: 'mobile' | 'desktop' | 'tablet';
  metadata?: Record<string, unknown>;
}

// App Download Configuration - for sign-up CTAs
export interface AppDownloadConfig {
  id: string;
  iosAppStoreUrl: string;
  androidPlayStoreUrl: string;
  iosDeepLink: string; // Adjust/AppsFlyer deep link for iOS
  androidDeepLink: string; // Adjust/AppsFlyer deep link for Android
  qrCodeUrl: string; // URL encoded in QR code (typically a smart link)
  ctaText_en: string;
  ctaText_ar: string;
  popupTitle_en: string;
  popupTitle_ar: string;
  popupSubtitle_en: string;
  popupSubtitle_ar: string;
  updatedAt: string;
}

export type InsertAppDownloadConfig = Omit<AppDownloadConfig, 'id' | 'updatedAt'>;

// ============================================
// CTA REGISTRY (CRO System)
// ============================================

export type CTAActionType = 'link' | 'qr_modal' | 'os_store_redirect' | 'scroll_anchor';

export interface CallToAction {
  id: string;
  key: string; // Unique identifier like 'discover.start_trading'
  text_en: string;
  text_ar: string;
  url: string; // URL or anchor like #pricing
  actionType: CTAActionType;
  allowedPages: string[]; // Route patterns: /discover, /stocks/*, /blog/*
  metaJson?: {
    tickerAware?: boolean;
    plan?: string;
    promo?: string;
    anchorId?: string;
    os?: 'ios' | 'android';
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InsertCallToAction = Omit<CallToAction, 'id' | 'createdAt' | 'updatedAt'>;

// Zod validation schema for CTA insert
export const insertCallToActionSchema = z.object({
  key: z.string().min(1),
  text_en: z.string().min(1),
  text_ar: z.string().min(1),
  url: z.string().min(1),
  actionType: z.enum(['link', 'qr_modal', 'os_store_redirect', 'scroll_anchor']),
  allowedPages: z.array(z.string()),
  metaJson: z.object({
    tickerAware: z.boolean().optional(),
    plan: z.string().optional(),
    promo: z.string().optional(),
    anchorId: z.string().optional(),
    os: z.enum(['ios', 'android']).optional(),
  }).optional(),
  enabled: z.boolean(),
});

// CTA Event Types for tracking
export type CTAEventType = 
  | 'cta_click'
  | 'qr_modal_view'
  | 'qr_modal_close'
  | 'store_redirect'
  | 'continue_on_web_click';

export interface CTAEvent {
  id: string;
  ctaKey: string;
  eventType: CTAEventType;
  pagePath: string;
  locale: 'en' | 'ar';
  device: 'mobile' | 'desktop' | 'tablet';
  os?: 'ios' | 'android' | 'other';
  ticker?: string;
  metaJson?: Record<string, unknown>;
  createdAt: string;
}

export type InsertCTAEvent = Omit<CTAEvent, 'id' | 'createdAt'>;

// Zod validation schema for CTA event insert
export const insertCTAEventSchema = z.object({
  ctaKey: z.string().min(1),
  eventType: z.enum(['cta_click', 'qr_modal_view', 'qr_modal_close', 'store_redirect', 'continue_on_web_click']),
  pagePath: z.string().min(1),
  locale: z.enum(['en', 'ar']),
  device: z.enum(['mobile', 'desktop', 'tablet']),
  os: z.enum(['ios', 'android', 'other']).optional(),
  ticker: z.string().optional(),
  metaJson: z.record(z.unknown()).optional(),
});

// Store URLs (centralized)
export const BARAKA_STORE_URLS = {
  ios: 'https://apps.apple.com/us/app/baraka-buy-us-stocks-etfs/id1532264769',
  android: 'https://play.google.com/store/apps/details?id=com.baraka.app&hl=en',
};

// ============================================
// NEWSLETTER + SPOTLIGHT + BLOG SYNC MODULE
// ============================================

// Blog Post Status
export type BlogPostStatus = 'draft' | 'scheduled' | 'published';

// Enhanced Blog Post for CMS
export interface CMSBlogPost {
  id: string;
  title_en: string;
  title_ar: string;
  slug_en: string;
  slug_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_html_en: string;
  content_html_ar: string;
  content_json_en?: object;
  content_json_ar?: object;
  coverImageUrl: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: BlogPostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle_en: string;
  seoTitle_ar: string;
  seoDescription_en: string;
  seoDescription_ar: string;
  canonicalUrl?: string;
  linkedSpotlightId?: string;
  linkedNewsletterId?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertCMSBlogPost = Omit<CMSBlogPost, 'id' | 'createdAt' | 'updatedAt' | 'linkedSpotlightId' | 'linkedNewsletterId'>;

// Story Status
export type StoryStatus = 'draft' | 'published';

// Story for Newsletter content
export interface Story {
  id: string;
  title_en: string;
  title_ar: string;
  snippet_en: string;
  snippet_ar: string;
  imageUrl: string;
  content_html_en: string;
  content_html_ar: string;
  whyItMatters_en: string;
  whyItMatters_ar: string;
  tickers: string[];
  status: StoryStatus;
  locale: 'en' | 'ar' | 'both';
  linkedSpotlightId?: string;
  linkedNewsletterId?: string;
  sourceBlogPostId?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertStory = Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'linkedSpotlightId' | 'linkedNewsletterId'>;

// Newsletter Template Block Type
export type NewsletterBlockType = 
  | 'hero'
  | 'introduction'
  | 'featured_content'
  | 'articles_list'
  | 'stock_collection'
  | 'assets_under_500'
  | 'what_users_picked'
  | 'asset_highlight'
  | 'term_of_the_day'
  | 'in_other_news'
  | 'call_to_action'
  | 'footer'
  | 'main_article'
  | 'market_overview'
  | 'promo_banner'
  | 'featured_story'
  | 'why_it_matters'
  | 'premium_cta'
  | 'feedback'
  | 'referral';

// Template Zone Types
export type TemplateZoneType = 'header' | 'body' | 'footer';

// Reusable Schema Block (stored independently from templates)
export interface SchemaBlock {
  id: string;
  name: string;
  description: string;
  type: NewsletterBlockType;
  locale: 'en' | 'ar' | 'global';
  defaultConfig: {
    label: string;
    required: boolean;
    tickers?: string[];
    newsItems?: Array<{ title: string; url: string; source?: string }>;
    term?: string;
    termDefinition?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type InsertSchemaBlock = Omit<SchemaBlock, 'id' | 'createdAt' | 'updatedAt'>;

// Template Zone Configuration
export interface TemplateZone {
  zone: TemplateZoneType;
  allowedBlockTypes: NewsletterBlockType[];
  maxBlocks?: number;
}

// Newsletter Template (defines layout + zones, NOT blocks)
export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  locale: 'en' | 'ar' | 'global';
  zones: TemplateZone[];
  htmlWrapper: string;
  defaultValuesJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type InsertNewsletterTemplate = Omit<NewsletterTemplate, 'id' | 'createdAt' | 'updatedAt'>;

// Newsletter Status
export type NewsletterStatus = 'draft' | 'ready' | 'scheduled' | 'sent';

// Newsletter Content Block
export interface NewsletterContentBlock {
  type: NewsletterBlockType;
  title?: string;
  content?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  articles?: Array<{ title: string; excerpt: string; url: string; imageUrl?: string }>;
  tickers?: string[];
}

// NEW SCHEMA BLOCKS DATA STRUCTURES

// Introduction Block
export interface IntroductionBlockData {
  title: string;
  subtitle?: string;
  body?: string;
}

// Featured Content Block (with articles)
export interface FeaturedContentBlockData {
  title: string;
  articles: Array<{
    articleId: string;
    articleTitle: string;
    articleExcerpt?: string;
    articleImageUrl?: string;
    articleUrl?: string;
  }>;
}

// Articles List Block
export interface ArticlesListBlockData {
  title: string;
  sourceType: 'internal' | 'external';
  // Internal source options
  selectionMode?: 'manual' | 'latest';
  numberOfArticles?: number;
  articles: Array<{
    articleId: string;
    articleTitle: string;
    articleExcerpt?: string;
    articleImageUrl?: string;
    articleUrl?: string;
  }>;
  // Latest filters (when selectionMode is 'latest')
  latestFilters?: {
    category?: string;
    tag?: string;
    locale?: 'en' | 'ar';
  };
  // External source items
  externalItems?: Array<{
    title: string;
    source: string;
    url: string;
    imageUrl?: string;
  }>;
  showExcerpts?: boolean;
}

// Stock Collection Block
export interface StockCollectionBlockData {
  title: string;
  description?: string;
  mode: 'manual' | 'dynamic';
  limit?: number;
  // Manual mode - selected stocks
  stocks: Array<{
    stockId: string;
    ticker: string;
    companyName: string;
    note?: string;
  }>;
  // Dynamic mode options
  dynamicType?: 'top_traded' | 'top_gainers' | 'top_losers' | 'most_viewed';
  filters?: {
    market?: 'US' | 'UAE';
    assetType?: 'stock' | 'etf';
    exchange?: string;
  };
}

// Assets Under $500 Block
export interface AssetsUnder500BlockData {
  title: string;
  description?: string;
  maxPrice?: number;
  limit?: number;
  sortBy?: 'volume' | 'performance' | 'popularity';
  filters?: {
    market?: 'US' | 'UAE';
    assetType?: 'stock' | 'etf';
  };
  stocks: Array<{
    stockId: string;
    ticker: string;
    companyName: string;
    price?: number;
    note?: string;
  }>;
}

// What Users Picked Block
export interface WhatUsersPickedBlockData {
  title: string;
  description?: string;
  timeWindow?: '24h' | '7d' | '30d';
  limit?: number;
  filters?: {
    market?: 'US' | 'UAE';
  };
  stocks: Array<{
    stockId: string;
    ticker: string;
    companyName: string;
    pickCount?: number;
    note?: string;
  }>;
}

// Asset Highlight Block (single stock feature)
export interface AssetHighlightBlockData {
  title: string;
  stockId: string;
  ticker: string;
  companyName: string;
  description?: string;
  whyItMatters?: string;
  imageUrl?: string;
}

// Term Of The Day Block
export interface TermOfTheDayBlockData {
  term: string;
  definition: string;
  example?: string;
  relatedTerms?: string[];
}

// In Other News Block
export interface InOtherNewsBlockData {
  title: string;
  sourceType?: 'internal' | 'external';
  // Internal source - selection of articles
  selectionMode?: 'manual' | 'latest';
  limit?: number;
  articles?: Array<{
    articleId: string;
    articleTitle: string;
    articleUrl?: string;
  }>;
  // External source - news items
  newsItems: Array<{
    headline: string;
    source?: string;
    url?: string;
    summary?: string;
  }>;
}

// Call To Action Block
export interface CallToActionBlockData {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
}

// Union type for all block data
export type NewsletterBlockData = 
  | IntroductionBlockData 
  | FeaturedContentBlockData 
  | ArticlesListBlockData 
  | StockCollectionBlockData 
  | AssetsUnder500BlockData 
  | WhatUsersPickedBlockData 
  | AssetHighlightBlockData 
  | TermOfTheDayBlockData 
  | InOtherNewsBlockData 
  | CallToActionBlockData 
  | Record<string, unknown>;

// Block Settings Interfaces (configurable defaults/overrides)
export interface IntroductionBlockSettings {
  showSubtitle: boolean;
  showBody: boolean;
}

export interface FeaturedContentBlockSettings {
  maxArticles: number;
  showImages: boolean;
  showExcerpts: boolean;
}

export interface ArticlesListBlockSettings {
  maxArticles: number;
  showImages: boolean;
  showExcerpts: boolean;
  layout: 'list' | 'grid';
}

export interface StockCollectionBlockSettings {
  maxStocks: number;
  showNotes: boolean;
  cardStyle: 'compact' | 'detailed';
}

export interface AssetsUnder500BlockSettings {
  maxStocks: number;
  showPrice: boolean;
  showNotes: boolean;
}

export interface WhatUsersPickedBlockSettings {
  maxStocks: number;
  showPickCount: boolean;
  showNotes: boolean;
}

export interface AssetHighlightBlockSettings {
  showDescription: boolean;
  showWhyItMatters: boolean;
  showImage: boolean;
}

export interface TermOfTheDayBlockSettings {
  showExample: boolean;
  showRelatedTerms: boolean;
}

export interface InOtherNewsBlockSettings {
  maxItems: number;
  showSource: boolean;
  showSummary: boolean;
}

export interface CallToActionBlockSettings {
  showSecondaryButton: boolean;
  showImage: boolean;
  buttonStyle: 'primary' | 'secondary' | 'outline';
}

export interface EducationCardSettings {
  showExample: boolean;
  showRelatedTerms: boolean;
}

export interface PromoBannerSettings {
  showTermsText: boolean;
  backgroundStyle: 'gradient' | 'image' | 'solid';
}

// Union type for all block settings
export type NewsletterBlockSettings = 
  | IntroductionBlockSettings 
  | FeaturedContentBlockSettings 
  | ArticlesListBlockSettings 
  | StockCollectionBlockSettings 
  | AssetsUnder500BlockSettings 
  | WhatUsersPickedBlockSettings
  | AssetHighlightBlockSettings
  | TermOfTheDayBlockSettings
  | InOtherNewsBlockSettings
  | CallToActionBlockSettings 
  | EducationCardSettings 
  | PromoBannerSettings
  | Record<string, unknown>;

// Schema Block Definition (canonical structure + defaults)
export interface SchemaBlockDefinition {
  id: string;
  blockType: NewsletterBlockType;
  name: string;
  description: string;
  defaultSchemaJson: Record<string, unknown>;
  defaultSettingsJson: NewsletterBlockSettings;
  createdAt: string;
  updatedAt: string;
}

export type InsertSchemaBlockDefinition = Omit<SchemaBlockDefinition, 'id' | 'createdAt' | 'updatedAt'>;

// Newsletter Template Block Override (template-level settings)
export interface NewsletterTemplateBlockOverride {
  id: string;
  templateId: string;
  blockType: NewsletterBlockType;
  overrideSettingsJson: Partial<NewsletterBlockSettings>;
  createdAt: string;
  updatedAt: string;
}

export type InsertNewsletterTemplateBlockOverride = Omit<NewsletterTemplateBlockOverride, 'id' | 'createdAt' | 'updatedAt'>;

// Newsletter Block Instance (per-newsletter)
export interface NewsletterBlockInstance {
  id: string;
  newsletterId: string;
  blockType: NewsletterBlockType;
  blockDataJson: NewsletterBlockData;
  overrideSettingsJson?: Partial<NewsletterBlockSettings>;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type InsertNewsletterBlockInstance = Omit<NewsletterBlockInstance, 'id' | 'createdAt' | 'updatedAt'>;

// Block Library Template (reusable)
export interface BlockLibraryTemplate {
  id: string;
  name: string;
  blockType: NewsletterBlockType;
  blockDataJson: NewsletterBlockData;
  createdAt: string;
  updatedAt: string;
}

export type InsertBlockLibraryTemplate = Omit<BlockLibraryTemplate, 'id' | 'createdAt' | 'updatedAt'>;

// Ticker Catalog (manual)
export interface TickerCatalogEntry {
  id: string;
  ticker: string;
  displayName?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertTickerCatalogEntry = Omit<TickerCatalogEntry, 'id' | 'createdAt' | 'updatedAt'>;

// Newsletter
export interface Newsletter {
  id: string;
  subject: string;
  preheader: string;
  issueNumber?: number;
  issueDate?: string;
  templateId: string;
  contentBlocks: NewsletterContentBlock[];
  htmlOutput: string;
  status: NewsletterStatus;
  scheduledAt?: string;
  sentAt?: string;
  sourceBlogPostId?: string;
  locale: 'en' | 'ar';
  lastTestSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InsertNewsletter = Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt' | 'htmlOutput' | 'sentAt' | 'lastTestSentAt'>;

// Spotlight Banner Placement
export type SpotlightPlacement = 'home' | 'discover' | 'blog' | 'stock' | 'custom';

// Spotlight Banner Status
export type SpotlightStatus = 'draft' | 'active' | 'inactive';

// Spotlight Banner Source Type
export type SpotlightSourceType = 'manual' | 'from_blog' | 'from_newsletter';

// Spotlight Banner
export interface SpotlightBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  portraitImageUrl?: string;
  landscapeImageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  appDeepLink?: string;
  placements: SpotlightPlacement[];
  startAt?: string;
  endAt?: string;
  status: SpotlightStatus;
  sourceType: SpotlightSourceType;
  blogPostId?: string;
  newsletterId?: string;
  locale: 'en' | 'ar';
  createdAt: string;
  updatedAt: string;
}

export type InsertSpotlightBanner = Omit<SpotlightBanner, 'id' | 'createdAt' | 'updatedAt'>;

// Subscriber Status
export type SubscriberStatus = 'active' | 'unsubscribed';

// Subscriber
export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  locale: 'en' | 'ar';
  status: SubscriberStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  unsubscribedAt?: string;
}

export type InsertSubscriber = Omit<Subscriber, 'id' | 'createdAt' | 'updatedAt' | 'unsubscribedAt'>;

// Audit Log Action Types
export type AuditActionType = 
  | 'blog_created'
  | 'blog_updated'
  | 'blog_published'
  | 'blog_deleted'
  | 'spotlight_auto_created'
  | 'spotlight_created'
  | 'spotlight_updated'
  | 'spotlight_deleted'
  | 'newsletter_auto_draft_created'
  | 'newsletter_created'
  | 'newsletter_updated'
  | 'newsletter_sent'
  | 'newsletter_test_sent'
  | 'newsletter_deleted'
  | 'template_created'
  | 'template_updated'
  | 'template_deleted'
  | 'subscriber_created'
  | 'subscriber_updated'
  | 'subscriber_unsubscribed'
  | 'scan_created'
  | 'scan_approved'
  | 'scan_rejected'
  | 'scan_pending'
  | 'english_analysis_run'
  | 'english_edits_applied'
  | 'compliance_amendments_applied';

// Audit Log Entity Types
export type AuditEntityType = 'blog_post' | 'spotlight' | 'newsletter' | 'template' | 'subscriber' | 'compliance_scan';

// Audit Log
export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId: string;
  metaJson?: Record<string, unknown>;
  createdAt: string;
}

export type InsertAuditLog = Omit<AuditLog, 'id' | 'createdAt'>;

// Newsletter Settings
export interface NewsletterSettings {
  id: string;
  defaultTemplateId_en: string;
  defaultTemplateId_ar: string;
  websiteBaseUrl: string;
  appDeepLinkBase: string;
  autoActivateSpotlightOnPublish: boolean;
  defaultSpotlightPlacements: SpotlightPlacement[];
  defaultCtaText_en: string;
  defaultCtaText_ar: string;
  brandLogoUrl: string;
  emailSenderName: string;
  emailSenderEmail: string;
  updatedAt: string;
}

export type InsertNewsletterSettings = Omit<NewsletterSettings, 'id' | 'updatedAt'>;

// Zod schemas for validation
export const insertNewsletterSchema = z.object({
  subject: z.string().min(1),
  preheader: z.string().max(120),
  templateId: z.string(),
  contentBlocks: z.array(z.object({
    type: z.enum(['hero', 'intro', 'featured', 'articles', 'cta', 'footer']),
    title: z.string().optional(),
    content: z.string().optional(),
    imageUrl: z.string().optional(),
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
    articles: z.array(z.object({
      title: z.string(),
      excerpt: z.string(),
      url: z.string(),
      imageUrl: z.string().optional(),
    })).optional(),
  })),
  status: z.enum(['draft', 'ready', 'scheduled', 'sent']),
  scheduledAt: z.string().optional(),
  sourceBlogPostId: z.string().optional(),
  locale: z.enum(['en', 'ar']),
});

export const insertSpotlightBannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().max(120),
  imageUrl: z.string(),
  portraitImageUrl: z.string().optional(),
  landscapeImageUrl: z.string().optional(),
  ctaText: z.string().min(1),
  ctaUrl: z.string().min(1),
  appDeepLink: z.string().optional(),
  placements: z.array(z.enum(['home', 'discover', 'blog', 'stock', 'custom'])),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  status: z.enum(['draft', 'active', 'inactive']),
  sourceType: z.enum(['manual', 'from_blog', 'from_newsletter']),
  blogPostId: z.string().optional(),
  newsletterId: z.string().optional(),
  locale: z.enum(['en', 'ar']),
});

export const insertSubscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  locale: z.enum(['en', 'ar']),
  status: z.enum(['active', 'unsubscribed']),
  tags: z.array(z.string()),
});

export const insertAuditLogSchema = z.object({
  actorUserId: z.string(),
  actorName: z.string(),
  actionType: z.enum([
    'blog_created', 'blog_updated', 'blog_published', 'blog_deleted',
    'spotlight_auto_created', 'spotlight_created', 'spotlight_updated', 'spotlight_deleted',
    'newsletter_auto_draft_created', 'newsletter_created', 'newsletter_updated', 
    'newsletter_sent', 'newsletter_test_sent', 'newsletter_deleted',
    'template_created', 'template_updated', 'template_deleted',
    'subscriber_created', 'subscriber_updated', 'subscriber_unsubscribed'
  ]),
  entityType: z.enum(['blog_post', 'spotlight', 'newsletter', 'template', 'subscriber']),
  entityId: z.string(),
  metaJson: z.record(z.unknown()).optional(),
});

export const insertNewsletterSettingsSchema = z.object({
  defaultTemplateId_en: z.string(),
  defaultTemplateId_ar: z.string(),
  websiteBaseUrl: z.string(),
  appDeepLinkBase: z.string(),
  autoActivateSpotlightOnPublish: z.boolean(),
  defaultSpotlightPlacements: z.array(z.enum(['home', 'discover', 'blog', 'stock', 'custom'])),
  defaultCtaText_en: z.string(),
  defaultCtaText_ar: z.string(),
  brandLogoUrl: z.string(),
  emailSenderName: z.string(),
  emailSenderEmail: z.string(),
});

export const insertSchemaBlockSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(['hero', 'intro', 'featured', 'articles', 'cta', 'footer', 'stockCollection', 'assetsUnder500', 'userPicks', 'assetHighlight', 'termOfTheDay', 'inOtherNews']),
  locale: z.enum(['en', 'ar', 'global']),
  defaultConfig: z.object({
    label: z.string(),
    required: z.boolean(),
    tickers: z.array(z.string()).optional(),
    newsItems: z.array(z.object({
      title: z.string(),
      url: z.string(),
      source: z.string().optional(),
    })).optional(),
    term: z.string().optional(),
    termDefinition: z.string().optional(),
  }),
});

export const insertNewsletterTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  locale: z.enum(['en', 'ar', 'global']),
  zones: z.array(z.object({
    zone: z.enum(['header', 'body', 'footer']),
    allowedBlockTypes: z.array(z.enum(['hero', 'intro', 'featured', 'articles', 'cta', 'footer', 'stockCollection', 'assetsUnder500', 'userPicks', 'assetHighlight', 'termOfTheDay', 'inOtherNews'])),
    maxBlocks: z.number().optional(),
  })),
  htmlWrapper: z.string(),
  defaultValuesJson: z.record(z.unknown()),
});

export const insertStorySchema = z.object({
  title_en: z.string().min(1),
  title_ar: z.string(),
  snippet_en: z.string().min(1),
  snippet_ar: z.string(),
  imageUrl: z.string(),
  content_html_en: z.string(),
  content_html_ar: z.string(),
  whyItMatters_en: z.string(),
  whyItMatters_ar: z.string(),
  tickers: z.array(z.string()),
  status: z.enum(['draft', 'published']),
  locale: z.enum(['en', 'ar', 'both']),
});

// =============================================
// COMPLIANCE CHECKER TYPES
// =============================================

export type ComplianceFindingSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ComplianceContentType = 'blog' | 'newsletter' | 'social' | 'stock_page';
export type EnglishIssueSeverity = 'low' | 'medium' | 'high';
export type EnglishIssueType = 'grammar' | 'clarity' | 'tone' | 'spelling';
export type ComplianceLabel = 'compliant' | 'needs_review' | 'high_risk';
export type EnglishQualityLabel = 'excellent' | 'good' | 'needs_edits' | 'not_configured';

export interface ComplianceFinding {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: ComplianceFindingSeverity;
  message: string;
  dfsaRef?: string;
  startOffset: number;
  endOffset: number;
  suggestedFix?: string;
}

export interface EnglishIssue {
  type: EnglishIssueType;
  severity: EnglishIssueSeverity;
  message: string;
  start: number;
  end: number;
  suggestion: string;
}

export interface EnglishEdit {
  start: number;
  end: number;
  replacement: string;
}

export interface ComplianceScanRun {
  id: string;
  contentType: ComplianceContentType;
  contentId: string;
  contentTitle: string;
  originalText: string;
  scannedAt: string;
  scannedBy?: string;
  
  // Compliance scoring
  riskScore: number; // 0-100, higher = more risk
  complianceScore: number; // 0-100, higher = more compliant (100 - riskScore)
  complianceLabel: ComplianceLabel;
  complianceFindings: ComplianceFinding[];
  
  // English quality scoring
  englishScore: number | null; // 0-100 or null if not configured
  englishLabel: EnglishQualityLabel;
  englishFindings: EnglishIssue[];
  englishSuggestedEdits: EnglishEdit[];
  englishProvider?: 'writing_assistant' | 'openai' | 'fallback';
  
  // Overall
  overallScore?: number;
  
  // Approval status
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  approvalNotes?: string;
  
  // Metadata
  locale: 'en' | 'ar';
  channel?: string;
  audience?: 'retail' | 'pro';
  createdAt: string;
  updatedAt: string;
}

export interface InsertComplianceScanRun {
  contentType: ComplianceContentType;
  contentId: string;
  contentTitle: string;
  originalText: string;
  locale: 'en' | 'ar';
  channel?: string;
  audience?: 'retail' | 'pro';
  scannedBy?: string;
}

export const insertComplianceScanRunSchema = z.object({
  contentType: z.enum(['blog', 'newsletter', 'social', 'stock_page']),
  contentId: z.string().min(1),
  contentTitle: z.string().min(1),
  originalText: z.string().min(1),
  locale: z.enum(['en', 'ar']),
  channel: z.string().optional(),
  audience: z.enum(['retail', 'pro']).optional(),
  scannedBy: z.string().optional(),
});

export const insertComplianceRuleSchema = z.object({
  name: z.string().min(1),
  phrase: z.string().min(1),
  description: z.string(),
  category: z.enum(['guaranteed_returns', 'fomo_urgency', 'misleading_claims', 'advice_language', 'regulatory_claims', 'personalized_claims', 'performance_claims', 'other']),
  matchType: z.enum(['exact', 'contains', 'regex']),
  dfsaRef: z.string().optional(),
  pattern: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  message: z.string().min(1),
  suggestedFix: z.string().optional(),
});

// Writing Assistant Integration (generic HTTP)
export interface WritingAssistantIntegration {
  id: string;
  name: string;
  baseUrl: string;
  authType: 'api_key' | 'bearer' | 'basic' | 'none';
  headers: Record<string, string>;
  analyzePath: string;
  applyPath?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsertWritingAssistantIntegration {
  name: string;
  baseUrl: string;
  authType: 'api_key' | 'bearer' | 'basic' | 'none';
  headers: Record<string, string>;
  analyzePath: string;
  applyPath?: string;
}

// Compliance Rule Match Types
export type ComplianceMatchType = 'exact' | 'contains' | 'regex';

// Compliance Rule Categories
export type ComplianceRuleCategory = 
  | 'guaranteed_returns'
  | 'fomo_urgency'
  | 'misleading_claims'
  | 'advice_language'
  | 'regulatory_claims'
  | 'personalized_claims'
  | 'performance_claims'
  | 'other';

// Compliance Checker Settings
export interface ComplianceCheckerSettings {
  enableEnglishQualityScoring: boolean;
  englishScoringProvider: 'writing_assistant' | 'openai';
  openaiModel?: string;
  writingAssistantIntegrationId?: string;
  
  // Auto-scan settings
  autoScanOnSave: boolean;
  blockPublishOnHighSeverity: boolean;
  scanOnPublishAlways: boolean;
  
  // DFSA Rule thresholds
  complianceThresholds: {
    compliant: number; // Score >= this is "Compliant" (default 85)
    needsReview: number; // Score >= this is "Needs Review" (default 60)
    // Below needsReview is "High Risk"
  };
  
  // English quality thresholds
  englishThresholds: {
    excellent: number; // Score >= this (default 90)
    good: number; // Score >= this (default 70)
    // Below good is "Needs Edits"
  };
}

// Compliance Rules (DFSA rules engine)
export interface ComplianceRule {
  id: string;
  name: string;
  phrase: string; // The keyword/phrase to match
  description: string;
  category: ComplianceRuleCategory;
  matchType: ComplianceMatchType;
  dfsaRef?: string;
  pattern: string; // regex pattern (auto-generated from phrase + matchType)
  severity: ComplianceFindingSeverity;
  message: string; // Why it's flagged
  suggestedFix?: string; // Safer alternative
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsertComplianceRule {
  name: string;
  phrase: string;
  description: string;
  category: ComplianceRuleCategory;
  matchType: ComplianceMatchType;
  dfsaRef?: string;
  pattern?: string; // Optional - will be auto-generated if not provided
  severity: ComplianceFindingSeverity;
  message: string;
  suggestedFix?: string;
}

// Default event mappings per platform
export const DEFAULT_PIXEL_EVENT_MAPPINGS: Record<PixelPlatform, Partial<Record<CmsEventName, string>>> = {
  meta: {
    page_view: 'PageView',
    banner_impression: 'ViewContent',
    banner_click: 'Lead',
    newsletter_submit: 'Subscribe',
    lead_submit: 'Lead',
    app_install_click: 'Lead',
  },
  tiktok: {
    page_view: 'ViewContent',
    banner_impression: 'ViewContent',
    banner_click: 'ClickButton',
    newsletter_submit: 'Subscribe',
    lead_submit: 'SubmitForm',
    app_install_click: 'Download',
  },
  snapchat: {
    page_view: 'PAGE_VIEW',
    banner_impression: 'VIEW_CONTENT',
    banner_click: 'ADD_TO_CART',
    newsletter_submit: 'SIGN_UP',
    lead_submit: 'SIGN_UP',
    app_install_click: 'APP_INSTALL',
  },
  google_ads: {
    page_view: 'page_view',
    banner_impression: 'view_item',
    banner_click: 'generate_lead',
    newsletter_submit: 'sign_up',
    lead_submit: 'generate_lead',
    app_install_click: 'conversion',
  },
  google_analytics: {
    page_view: 'page_view',
    banner_impression: 'view_promotion',
    banner_click: 'select_promotion',
    newsletter_submit: 'sign_up',
    lead_submit: 'generate_lead',
    app_install_click: 'select_content',
  },
};
