import { 
  type User, 
  type InsertUser, 
  type InsertPriceAlertSubscription, 
  type PriceAlertSubscription,
  type InsertNewsletterSignup,
  type NewsletterSignup,
  type DiscoverSettings,
  type StockTheme,
  type OfferBanner,
  type LandingPage,
  type InsertLandingPage,
  type LandingPageVersion,
  type FormSubmission,
  type InsertFormSubmission,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type CmsWebEvent,
  type InsertCmsWebEvent,
  type BannerEvent,
  type InsertBannerEvent,
  type MobileInstallBanner,
  type InsertMobileInstallBanner,
  type AnalyticsSettings,
  type InsertAnalyticsSettings,
  type BlogPost,
  type InsertBlogPost,
  type StockPage,
  type InsertStockPage,
  type MarketingPixel,
  type InsertMarketingPixel,
  type PixelEventMap,
  type InsertPixelEventMap
} from "@shared/schema";
import { randomUUID } from "crypto";

const seedDiscoverSettings: DiscoverSettings = {
  id: '1',
  heroTitle_en: 'Discover',
  heroTitle_ar: 'اكتشف',
  heroSubtitle_en: 'Stocks, themes, and learning — in one place.',
  heroSubtitle_ar: 'الأسهم والموضوعات والتعلم — في مكان واحد.',
  heroChips: [
    { label_en: 'Trending', label_ar: 'الرائج', href: '#trending' },
    { label_en: 'Halal', label_ar: 'حلال', href: '/stocks/themes/halal-stocks' },
    { label_en: 'ETFs', label_ar: 'الصناديق المتداولة', href: '/stocks/themes/etfs' },
    { label_en: 'Beginner Guides', label_ar: 'أدلة المبتدئين', href: '/blog?category=beginners' },
    { label_en: 'Offers', label_ar: 'العروض', href: '#offers' },
  ],
  featuredThemeNewSlug: 'adr-international',
  featuredThemeMonthSlug: 'halal-stocks',
  otherThemeSlugs: ['ai-semiconductors', 'ev-mobility', 'tech-giants', 'fintech', 'dividend-stocks', 'healthcare'],
  trendingTabs: [
    { key: 'gainers', label_en: 'Gainers', label_ar: 'الرابحون', tickers: ['NVDA', 'RIVN', 'AMD', 'META', 'XOM', 'CVX', 'JPM', 'BAC'] },
    { key: 'losers', label_en: 'Losers', label_ar: 'الخاسرون', tickers: ['NIO', 'LCID', 'PYPL', 'INTC', 'NFLX', 'PEP', 'AVGO'] },
    { key: 'most_watched', label_en: 'Most Watched', label_ar: 'الأكثر متابعة', tickers: ['TSLA', 'AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META'] },
  ],
  featuredTickers: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD', 'NFLX', 'DIS', 'V', 'JPM'],
  learnFeaturedPostId: '1',
  learnSecondaryPostIds: ['2', '3'],
  learnCategorySlugs: ['education', 'analysis', 'strategy', 'beginners'],
  sectionVisibility: {
    offers: true,
    themes: true,
    trending: true,
    featured: true,
    priceAlerts: true,
    learn: true,
    newsletter: true,
    disclosures: true,
  },
};

const seedStockThemes: StockTheme[] = [
  {
    id: '1',
    slug: 'halal-stocks',
    title_en: 'Halal Stocks',
    title_ar: 'الأسهم الحلال',
    description_en: 'Shariah-compliant stocks vetted by leading scholars',
    description_ar: 'أسهم متوافقة مع الشريعة الإسلامية معتمدة من كبار العلماء',
    tickers: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN', 'META'],
    heroImage: '',
    icon: '🌙',
    order: 1,
    status: 'active',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'ai-semiconductors',
    title_en: 'AI & Semiconductors',
    title_ar: 'الذكاء الاصطناعي وأشباه الموصلات',
    description_en: 'Companies leading the AI and chip revolution',
    description_ar: 'الشركات الرائدة في ثورة الذكاء الاصطناعي والرقائق',
    tickers: ['NVDA', 'AMD', 'TSM', 'ASML', 'AVGO', 'INTC'],
    heroImage: '',
    icon: '🤖',
    order: 2,
    status: 'active',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '3',
    slug: 'ev-mobility',
    title_en: 'EV & Mobility',
    title_ar: 'السيارات الكهربائية والتنقل',
    description_en: 'Electric vehicle and future mobility leaders',
    description_ar: 'رواد السيارات الكهربائية والتنقل المستقبلي',
    tickers: ['TSLA', 'NIO', 'RIVN', 'LCID', 'GM', 'F'],
    heroImage: '',
    icon: '🚗',
    order: 3,
    status: 'active',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '4',
    slug: 'tech-giants',
    title_en: 'Tech Giants',
    title_ar: 'عمالقة التكنولوجيا',
    description_en: 'The largest technology companies by market cap',
    description_ar: 'أكبر شركات التكنولوجيا من حيث القيمة السوقية',
    tickers: ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NFLX'],
    heroImage: '',
    icon: '💻',
    order: 4,
    status: 'active',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '5',
    slug: 'fintech',
    title_en: 'Fintech & Payments',
    title_ar: 'التكنولوجيا المالية والمدفوعات',
    description_en: 'Companies transforming financial services',
    description_ar: 'الشركات التي تحول الخدمات المالية',
    tickers: ['V', 'MA', 'PYPL', 'SQ', 'JPM', 'BAC'],
    heroImage: '',
    icon: '💳',
    order: 5,
    status: 'active',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '6',
    slug: 'dividend-stocks',
    title_en: 'Dividend Champions',
    title_ar: 'أبطال توزيعات الأرباح',
    description_en: 'Reliable dividend-paying stocks',
    description_ar: 'أسهم توزيعات الأرباح الموثوقة',
    tickers: ['KO', 'PEP', 'JNJ', 'PG', 'XOM', 'CVX'],
    heroImage: '',
    icon: '💰',
    order: 6,
    status: 'active',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '7',
    slug: 'healthcare',
    title_en: 'Healthcare & Pharma',
    title_ar: 'الرعاية الصحية والأدوية',
    description_en: 'Leading healthcare and pharmaceutical companies',
    description_ar: 'شركات الرعاية الصحية والأدوية الرائدة',
    tickers: ['UNH', 'JNJ', 'PG', 'COST', 'WMT', 'HD'],
    heroImage: '',
    icon: '🏥',
    order: 7,
    status: 'active',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '8',
    slug: 'adr-international',
    title_en: 'ADRs & International',
    title_ar: 'الإيداع الأمريكي والدولي',
    description_en: 'Access global companies through US-listed ADRs',
    description_ar: 'الوصول إلى الشركات العالمية عبر إيصالات الإيداع الأمريكية',
    tickers: ['TSM', 'ASML', 'NIO', 'BABA', 'JD', 'PDD'],
    heroImage: '',
    icon: '🌍',
    order: 8,
    status: 'active',
    isNew: true,
    isFeatured: false,
  },
];

const seedOfferBanners: OfferBanner[] = [
  {
    id: '1',
    title_en: 'Zero Commission Trading',
    title_ar: 'تداول بدون عمولة',
    subtitle_en: 'Trade US stocks with zero commission for your first 30 days',
    subtitle_ar: 'تداول الأسهم الأمريكية بدون عمولة لأول 30 يومًا',
    ctaText_en: 'Start Trading',
    ctaText_ar: 'ابدأ التداول',
    ctaUrl: '/signup',
    backgroundImage: '',
    backgroundColor: '#FF6B2C',
    placement: 'discover_offers_rail',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    order: 1,
  },
  {
    id: '2',
    title_en: 'Refer & Earn $100',
    title_ar: 'احل واكسب 100$',
    subtitle_en: 'Invite friends and earn rewards for each signup',
    subtitle_ar: 'ادعُ أصدقاءك واكسب مكافآت لكل تسجيل',
    ctaText_en: 'Invite Now',
    ctaText_ar: 'ادعُ الآن',
    ctaUrl: '/referral',
    backgroundImage: '',
    backgroundColor: '#10B981',
    placement: 'discover_offers_rail',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    order: 2,
  },
  {
    id: '3',
    title_en: 'Premium Subscription',
    title_ar: 'الاشتراك المميز',
    subtitle_en: 'Get real-time data, advanced charts & priority support',
    subtitle_ar: 'احصل على بيانات فورية ورسوم بيانية متقدمة ودعم أولوي',
    ctaText_en: 'Upgrade Now',
    ctaText_ar: 'ترقية الآن',
    ctaUrl: '/premium',
    backgroundImage: '',
    backgroundColor: '#6366F1',
    placement: 'discover_offers_rail',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    order: 3,
  },
  {
    id: '4',
    title_en: 'Learn to Invest',
    title_ar: 'تعلم الاستثمار',
    subtitle_en: 'Free courses for beginners. Start your journey today.',
    subtitle_ar: 'دورات مجانية للمبتدئين. ابدأ رحلتك اليوم.',
    ctaText_en: 'Start Learning',
    ctaText_ar: 'ابدأ التعلم',
    ctaUrl: '/blog',
    backgroundImage: '',
    backgroundColor: '#8B5CF6',
    placement: 'discover_offers_rail',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    order: 4,
  },
];

// Seed Blog Posts
const seedBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'beginner-guide-stock-investing',
    title_en: 'Beginner\'s Guide to Stock Investing',
    title_ar: 'دليل المبتدئين للاستثمار في الأسهم',
    excerpt_en: 'Learn the basics of stock investing and start your journey to financial freedom.',
    excerpt_ar: 'تعلم أساسيات الاستثمار في الأسهم وابدأ رحلتك نحو الحرية المالية.',
    content_en: '<p>Investing in stocks can seem intimidating at first...</p>',
    content_ar: '<p>قد يبدو الاستثمار في الأسهم مخيفاً في البداية...</p>',
    featuredImage: '',
    category: 'education',
    tags: ['beginner', 'stocks', 'investing'],
    author: 'Baraka Team',
    status: 'published',
    seo: {
      metaTitle_en: 'Beginner\'s Guide to Stock Investing | Baraka',
      metaTitle_ar: 'دليل المبتدئين للاستثمار في الأسهم | بركة',
    },
    publishedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'understanding-halal-investing',
    title_en: 'Understanding Halal Investing',
    title_ar: 'فهم الاستثمار الحلال',
    excerpt_en: 'A comprehensive guide to Shariah-compliant investing principles.',
    excerpt_ar: 'دليل شامل لمبادئ الاستثمار المتوافق مع الشريعة الإسلامية.',
    content_en: '<p>Halal investing follows Islamic finance principles...</p>',
    content_ar: '<p>يتبع الاستثمار الحلال مبادئ التمويل الإسلامي...</p>',
    featuredImage: '',
    category: 'education',
    tags: ['halal', 'shariah', 'islamic-finance'],
    author: 'Baraka Team',
    status: 'published',
    seo: {},
    publishedAt: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    slug: 'market-analysis-tech-sector',
    title_en: 'Market Analysis: Tech Sector Q1 2024',
    title_ar: 'تحليل السوق: قطاع التكنولوجيا الربع الأول 2024',
    excerpt_en: 'An in-depth look at the tech sector performance and outlook.',
    excerpt_ar: 'نظرة معمقة على أداء قطاع التكنولوجيا وتوقعاته.',
    content_en: '<p>The technology sector continues to drive market growth...</p>',
    content_ar: '<p>يواصل قطاع التكنولوجيا دفع نمو السوق...</p>',
    featuredImage: '',
    category: 'analysis',
    tags: ['tech', 'analysis', 'market'],
    author: 'Baraka Research',
    status: 'published',
    seo: {},
    publishedAt: '2024-03-01T00:00:00Z',
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '4',
    slug: 'draft-post-dividends',
    title_en: 'Understanding Dividend Investing',
    title_ar: 'فهم الاستثمار في توزيعات الأرباح',
    excerpt_en: 'Learn how dividends can generate passive income.',
    excerpt_ar: 'تعلم كيف يمكن لتوزيعات الأرباح توليد دخل سلبي.',
    content_en: '<p>Draft content here...</p>',
    content_ar: '<p>محتوى المسودة هنا...</p>',
    featuredImage: '',
    category: 'strategy',
    tags: ['dividends', 'income'],
    author: 'Baraka Team',
    status: 'draft',
    seo: {},
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
];

// Seed Stock Pages
const seedStockPages: StockPage[] = [
  {
    id: '1',
    ticker: 'AAPL',
    slug: 'apple-aapl',
    companyName_en: 'Apple Inc.',
    companyName_ar: 'شركة أبل',
    description_en: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
    description_ar: 'تصمم أبل وتصنع وتسوق الهواتف الذكية وأجهزة الكمبيوتر الشخصية والأجهزة اللوحية.',
    content_en: '<p>Apple Inc. is one of the world\'s most valuable companies...</p>',
    content_ar: '<p>شركة أبل هي واحدة من أكثر الشركات قيمة في العالم...</p>',
    sector: 'Technology',
    exchange: 'NASDAQ',
    status: 'published',
    seo: {
      metaTitle_en: 'Apple (AAPL) Stock | Baraka',
      metaTitle_ar: 'سهم أبل (AAPL) | بركة',
    },
    relatedTickers: ['MSFT', 'GOOGL', 'AMZN'],
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    ticker: 'TSLA',
    slug: 'tesla-tsla',
    companyName_en: 'Tesla, Inc.',
    companyName_ar: 'شركة تسلا',
    description_en: 'Tesla designs, develops, manufactures, and sells electric vehicles and energy storage products.',
    description_ar: 'تصمم تسلا وتطور وتصنع وتبيع السيارات الكهربائية ومنتجات تخزين الطاقة.',
    content_en: '<p>Tesla has revolutionized the automotive industry...</p>',
    content_ar: '<p>أحدثت تسلا ثورة في صناعة السيارات...</p>',
    sector: 'Automotive',
    exchange: 'NASDAQ',
    status: 'published',
    seo: {},
    relatedTickers: ['RIVN', 'LCID', 'NIO'],
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    ticker: 'NVDA',
    slug: 'nvidia-nvda',
    companyName_en: 'NVIDIA Corporation',
    companyName_ar: 'شركة إنفيديا',
    description_en: 'NVIDIA designs graphics processing units and system on chip units for gaming, professional, and datacenter markets.',
    description_ar: 'تصمم إنفيديا وحدات معالجة الرسومات والرقائق المتكاملة لأسواق الألعاب والمحترفين ومراكز البيانات.',
    content_en: '<p>NVIDIA is at the forefront of AI computing...</p>',
    content_ar: '<p>إنفيديا في طليعة حوسبة الذكاء الاصطناعي...</p>',
    sector: 'Technology',
    exchange: 'NASDAQ',
    status: 'published',
    seo: {},
    relatedTickers: ['AMD', 'INTC', 'AVGO'],
    publishedAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    ticker: 'MSFT',
    slug: 'microsoft-msft',
    companyName_en: 'Microsoft Corporation',
    companyName_ar: 'شركة مايكروسوفت',
    description_en: 'Microsoft develops, licenses, and supports software, services, devices, and solutions worldwide.',
    description_ar: 'تطور مايكروسوفت وترخص وتدعم البرمجيات والخدمات والأجهزة والحلول في جميع أنحاء العالم.',
    content_en: '<p>Microsoft is a technology giant...</p>',
    content_ar: '<p>مايكروسوفت عملاق تكنولوجي...</p>',
    sector: 'Technology',
    exchange: 'NASDAQ',
    status: 'draft',
    seo: {},
    relatedTickers: ['AAPL', 'GOOGL', 'AMZN'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

// Seed Mobile Install Banner
const seedMobileInstallBanner: MobileInstallBanner = {
  id: '1',
  name: 'Default App Install Banner',
  enabled: true,
  locales: ['en', 'ar'],
  pages: ['/stocks/*', '/blog/*', '/discover'],
  styleVariant: 'bottom',
  title_en: 'Get the Baraka App',
  title_ar: 'حمّل تطبيق بركة',
  subtitle_en: 'Trade stocks commission-free',
  subtitle_ar: 'تداول الأسهم بدون عمولة',
  ctaText_en: 'Download Now',
  ctaText_ar: 'حمّل الآن',
  iconUrl: '',
  backgroundStyle: 'brand',
  adjustLinkIos: 'https://app.adjust.com/baraka_ios?campaign=web_install_banner',
  adjustLinkAndroid: 'https://app.adjust.com/baraka_android?campaign=web_install_banner',
  frequencyCapDays: 7,
  showAfterSeconds: 3,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Seed Analytics Settings
const seedAnalyticsSettings: AnalyticsSettings = {
  id: '1',
  ga4PropertyId: undefined,
  authType: 'none',
  enabled: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Seed CMS Web Events (sample data)
const seedCmsWebEvents: CmsWebEvent[] = [
  { id: '1', eventType: 'page_view', pagePath: '/stocks/apple-aapl', locale: 'en', deviceCategory: 'mobile', metaJson: { sessionId: 'sess1' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', eventType: 'page_view', pagePath: '/stocks/apple-aapl', locale: 'en', deviceCategory: 'desktop', metaJson: { sessionId: 'sess2' }, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '3', eventType: 'cta_click', pagePath: '/stocks/apple-aapl', locale: 'en', deviceCategory: 'mobile', metaJson: { ctaText: 'Trade Now' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', eventType: 'page_view', pagePath: '/blog/beginner-guide-stock-investing', locale: 'en', deviceCategory: 'desktop', metaJson: { sessionId: 'sess3' }, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '5', eventType: 'newsletter_submit', pagePath: '/blog/beginner-guide-stock-investing', locale: 'en', deviceCategory: 'desktop', metaJson: {}, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '6', eventType: 'install_banner_view', pagePath: '/stocks/tesla-tsla', locale: 'en', deviceCategory: 'mobile', metaJson: { bannerId: '1' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '7', eventType: 'install_banner_click', pagePath: '/stocks/tesla-tsla', locale: 'en', deviceCategory: 'mobile', metaJson: { bannerId: '1', os: 'ios' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '8', eventType: 'adjust_outbound_click', pagePath: '/stocks/nvidia-nvda', locale: 'ar', deviceCategory: 'mobile', metaJson: { os: 'android', adjustUrl: 'https://app.adjust.com/baraka_android' }, createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: '9', eventType: 'banner_view', pagePath: '/discover', locale: 'en', deviceCategory: 'desktop', metaJson: { bannerId: '1', bannerPlacement: 'discover_offers_rail' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '10', eventType: 'banner_click', pagePath: '/discover', locale: 'en', deviceCategory: 'desktop', metaJson: { bannerId: '1', bannerPlacement: 'discover_offers_rail' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

// Seed Banner Events
const seedBannerEvents: BannerEvent[] = [
  { id: '1', bannerId: '1', bannerType: 'offer', eventType: 'view', placement: 'discover_offers_rail', pagePath: '/discover', locale: 'en', deviceCategory: 'desktop', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', bannerId: '1', bannerType: 'offer', eventType: 'click', placement: 'discover_offers_rail', pagePath: '/discover', locale: 'en', deviceCategory: 'desktop', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', bannerId: '1', bannerType: 'mobile_install', eventType: 'view', placement: 'bottom', pagePath: '/stocks/apple-aapl', locale: 'en', deviceCategory: 'mobile', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', bannerId: '1', bannerType: 'mobile_install', eventType: 'click', placement: 'bottom', pagePath: '/stocks/apple-aapl', locale: 'en', deviceCategory: 'mobile', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', bannerId: '2', bannerType: 'offer', eventType: 'view', placement: 'discover_offers_rail', pagePath: '/discover', locale: 'ar', deviceCategory: 'mobile', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

// Seed Landing Pages
const seedLandingPages: LandingPage[] = [
  {
    id: '1',
    slug: 'subscription',
    status: 'published',
    templateKey: 'subscription',
    localeContent: {
      en: {
        title: 'baraka Premium',
        description: 'Unlock advanced trading tools and real-time data',
        sections: [
          {
            id: 'hero-1',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Premium Membership', ar: 'العضوية المميزة' },
              headline: { en: 'Trade Smarter with baraka Premium', ar: 'تداول بذكاء مع بركة المميز' },
              subheadline: { en: 'Get real-time data, advanced charts, and priority support', ar: 'احصل على بيانات فورية ورسوم بيانية متقدمة ودعم أولوي' },
              primaryCTA: { text: { en: 'Start Free Trial', ar: 'ابدأ التجربة المجانية' }, url: '/signup?plan=premium', variant: 'primary' },
              secondaryCTA: { text: { en: 'Compare Plans', ar: 'قارن الخطط' }, url: '#pricing', variant: 'outline' },
            },
          },
          {
            id: 'value-props-1',
            type: 'valueProps',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Go Premium?', ar: 'لماذا تختار المميز؟' },
              cards: [
                { icon: 'Zap', title: { en: 'Real-Time Data', ar: 'بيانات فورية' }, description: { en: 'Live market prices with zero delay', ar: 'أسعار السوق الحية بدون تأخير' } },
                { icon: 'LineChart', title: { en: 'Advanced Charts', ar: 'رسوم بيانية متقدمة' }, description: { en: 'Technical indicators and drawing tools', ar: 'مؤشرات فنية وأدوات رسم' } },
                { icon: 'Headphones', title: { en: 'Priority Support', ar: 'دعم أولوي' }, description: { en: '24/7 dedicated customer service', ar: 'خدمة عملاء مخصصة على مدار الساعة' } },
              ],
            },
          },
          {
            id: 'pricing-1',
            type: 'pricing',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'Choose Your Plan', ar: 'اختر خطتك' },
              plans: [
                {
                  planName: { en: 'Basic', ar: 'الأساسي' },
                  priceText: { en: 'Free', ar: 'مجاني' },
                  billingPeriod: { en: 'forever', ar: 'للأبد' },
                  features: [
                    { en: 'Delayed market data (15 min)', ar: 'بيانات السوق المتأخرة (15 دقيقة)' },
                    { en: 'Basic charts', ar: 'رسوم بيانية أساسية' },
                    { en: 'Email support', ar: 'دعم عبر البريد الإلكتروني' },
                  ],
                  ctaText: { en: 'Get Started', ar: 'ابدأ الآن' },
                  ctaUrl: '/signup',
                },
                {
                  planName: { en: 'Premium', ar: 'المميز' },
                  priceText: { en: '$9.99', ar: '٩.٩٩$' },
                  billingPeriod: { en: '/month', ar: '/شهر' },
                  highlightBadge: { en: 'Most Popular', ar: 'الأكثر شعبية' },
                  features: [
                    { en: 'Real-time market data', ar: 'بيانات السوق الفورية' },
                    { en: 'Advanced charts & indicators', ar: 'رسوم بيانية ومؤشرات متقدمة' },
                    { en: 'Priority 24/7 support', ar: 'دعم أولوي على مدار الساعة' },
                    { en: 'Extended trading hours', ar: 'ساعات تداول ممتدة' },
                  ],
                  ctaText: { en: 'Start Free Trial', ar: 'ابدأ التجربة المجانية' },
                  ctaUrl: '/signup?plan=premium',
                },
              ],
              complianceNote: { en: 'Prices are in USD. Subscription renews automatically. Cancel anytime.', ar: 'الأسعار بالدولار الأمريكي. يتم تجديد الاشتراك تلقائيًا. يمكنك الإلغاء في أي وقت.' },
            },
          },
          {
            id: 'faq-1',
            type: 'faq',
            enabled: true,
            order: 3,
            data: {
              title: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
              items: [
                { question: { en: 'Can I cancel anytime?', ar: 'هل يمكنني الإلغاء في أي وقت؟' }, answer: { en: 'Yes, you can cancel your subscription at any time from your account settings. No questions asked.', ar: 'نعم، يمكنك إلغاء اشتراكك في أي وقت من إعدادات حسابك. بدون أسئلة.' } },
                { question: { en: 'Is my data secure?', ar: 'هل بياناتي آمنة؟' }, answer: { en: 'Absolutely. We use bank-level encryption to protect all your personal and financial information.', ar: 'بالتأكيد. نستخدم تشفيرًا بمستوى البنوك لحماية جميع معلوماتك الشخصية والمالية.' } },
                { question: { en: 'What payment methods do you accept?', ar: 'ما طرق الدفع التي تقبلونها؟' }, answer: { en: 'We accept all major credit cards, Apple Pay, and Google Pay.', ar: 'نقبل جميع بطاقات الائتمان الرئيسية وApple Pay وGoogle Pay.' } },
              ],
            },
          },
          {
            id: 'lead-form-1',
            type: 'leadForm',
            enabled: true,
            order: 4,
            data: {
              title: { en: 'Get Started Today', ar: 'ابدأ اليوم' },
              subtitle: { en: 'Sign up for a free trial and experience Premium features', ar: 'سجل للحصول على تجربة مجانية واستمتع بالميزات المميزة' },
              fields: { name: true, email: true, phone: false, country: true },
              submitText: { en: 'Start Free Trial', ar: 'ابدأ التجربة المجانية' },
              successMessage: { en: 'Thanks! Check your email to activate your trial.', ar: 'شكرًا! تحقق من بريدك الإلكتروني لتفعيل تجربتك.' },
              formKey: 'premium-signup',
            },
          },
        ],
        seo: {
          metaTitle: 'baraka Premium - Advanced Trading Tools',
          metaDescription: 'Upgrade to baraka Premium for real-time data, advanced charts, and priority support.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
      ar: {
        title: 'بركة المميز',
        description: 'افتح أدوات التداول المتقدمة والبيانات الفورية',
        sections: [],
        seo: {
          metaTitle: 'بركة المميز - أدوات تداول متقدمة',
          metaDescription: 'ترقية إلى بركة المميز للحصول على بيانات فورية ورسوم بيانية متقدمة ودعم أولوي.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
    },
    settings: {
      headerVariant: 'default',
      footerVariant: 'default',
    },
    publishedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'stocks-offer',
    status: 'published',
    templateKey: 'promoOffer',
    localeContent: {
      en: {
        title: 'Zero Commission Trading',
        description: 'Trade US stocks with zero commission for 30 days',
        sections: [
          {
            id: 'hero-2',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Limited Time Offer', ar: 'عرض لفترة محدودة' },
              headline: { en: 'Trade US Stocks with Zero Commission', ar: 'تداول الأسهم الأمريكية بدون عمولة' },
              subheadline: { en: 'Start your investment journey with 30 days of commission-free trading', ar: 'ابدأ رحلتك الاستثمارية مع 30 يومًا من التداول بدون عمولة' },
              primaryCTA: { text: { en: 'Claim Offer', ar: 'احصل على العرض' }, url: '/signup?promo=zero-commission', variant: 'primary' },
              trustBadges: [
                { text: { en: 'Regulated by SEC', ar: 'مرخص من SEC' } },
                { text: { en: '1M+ Users', ar: 'أكثر من مليون مستخدم' } },
              ],
            },
          },
          {
            id: 'offer-rail-1',
            type: 'offerBannerRail',
            enabled: true,
            order: 1,
            data: {
              positionKey: 'landing_offers_rail',
              title: { en: 'More Ways to Save', ar: 'المزيد من طرق التوفير' },
            },
          },
          {
            id: 'features-1',
            type: 'features',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'Why Trade with baraka?', ar: 'لماذا تتداول مع بركة؟' },
              features: [
                { title: { en: 'Fractional Shares', ar: 'الأسهم الجزئية' }, description: { en: 'Own a piece of any stock with as little as $1', ar: 'امتلك جزءًا من أي سهم بأقل من دولار واحد' } },
                { title: { en: 'Halal Verified', ar: 'موثق حلال' }, description: { en: 'All stocks verified by leading Shariah scholars', ar: 'جميع الأسهم موثقة من كبار علماء الشريعة' } },
                { title: { en: 'Instant Deposits', ar: 'إيداعات فورية' }, description: { en: 'Start trading immediately with instant funding', ar: 'ابدأ التداول فورًا مع التمويل الفوري' } },
              ],
            },
          },
          {
            id: 'footer-cta-1',
            type: 'footerCta',
            enabled: true,
            order: 3,
            data: {
              headline: { en: 'Ready to Start Trading?', ar: 'مستعد لبدء التداول؟' },
              supportingText: { en: 'Join over 1 million investors who trust baraka', ar: 'انضم إلى أكثر من مليون مستثمر يثقون في بركة' },
              cta: { text: { en: 'Open Account', ar: 'افتح حسابًا' }, url: '/signup', variant: 'primary' },
              disclaimers: { en: 'Capital at risk. Terms apply.', ar: 'رأس المال معرض للخطر. تطبق الشروط.' },
            },
          },
        ],
        seo: {
          metaTitle: 'Zero Commission Trading | baraka',
          metaDescription: 'Trade US stocks with zero commission for your first 30 days. Join baraka today.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
      ar: {
        title: 'تداول بدون عمولة',
        description: 'تداول الأسهم الأمريكية بدون عمولة لمدة 30 يومًا',
        sections: [],
        seo: {
          metaTitle: 'تداول بدون عمولة | بركة',
          metaDescription: 'تداول الأسهم الأمريكية بدون عمولة لأول 30 يومًا. انضم إلى بركة اليوم.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
    },
    settings: {
      headerVariant: 'minimal',
      footerVariant: 'minimal',
    },
    publishedAt: '2024-02-01T00:00:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    slug: 'learn-investing',
    status: 'published',
    templateKey: 'learnGuide',
    localeContent: {
      en: {
        title: 'Learn to Invest',
        description: 'Free guides and courses for beginner investors',
        sections: [
          {
            id: 'hero-3',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              headline: { en: 'Start Your Investment Journey', ar: 'ابدأ رحلتك الاستثمارية' },
              subheadline: { en: 'Free courses and guides designed for beginners', ar: 'دورات وأدلة مجانية مصممة للمبتدئين' },
              primaryCTA: { text: { en: 'Browse Courses', ar: 'تصفح الدورات' }, url: '/blog?category=education', variant: 'primary' },
            },
          },
          {
            id: 'content-1',
            type: 'content',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Learn with baraka?', ar: 'لماذا تتعلم مع بركة؟' },
              richText: {
                en: '<p>Whether you\'re just starting out or looking to expand your knowledge, our educational resources are designed to help you become a confident investor.</p><p>Our courses cover everything from the basics of stock market investing to advanced strategies for portfolio management.</p>',
                ar: '<p>سواء كنت تبدأ للتو أو تتطلع إلى توسيع معرفتك، فإن مواردنا التعليمية مصممة لمساعدتك على أن تصبح مستثمرًا واثقًا.</p><p>تغطي دوراتنا كل شيء من أساسيات الاستثمار في سوق الأوراق المالية إلى استراتيجيات متقدمة لإدارة المحافظ.</p>',
              },
            },
          },
          {
            id: 'value-props-2',
            type: 'valueProps',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'What You\'ll Learn', ar: 'ما ستتعلمه' },
              cards: [
                { icon: 'BookOpen', title: { en: 'Stock Basics', ar: 'أساسيات الأسهم' }, description: { en: 'Understand how the stock market works', ar: 'افهم كيف يعمل سوق الأوراق المالية' } },
                { icon: 'PieChart', title: { en: 'Portfolio Building', ar: 'بناء المحفظة' }, description: { en: 'Learn to diversify and manage risk', ar: 'تعلم التنويع وإدارة المخاطر' } },
                { icon: 'Target', title: { en: 'Goal Setting', ar: 'تحديد الأهداف' }, description: { en: 'Set and achieve your financial goals', ar: 'حدد أهدافك المالية وحققها' } },
                { icon: 'Shield', title: { en: 'Halal Investing', ar: 'الاستثمار الحلال' }, description: { en: 'Invest according to Islamic principles', ar: 'استثمر وفقًا للمبادئ الإسلامية' } },
              ],
            },
          },
          {
            id: 'newsletter-1',
            type: 'newsletter',
            enabled: true,
            order: 3,
            data: {
              title: { en: 'Stay Updated', ar: 'ابقَ على اطلاع' },
              subtitle: { en: 'Get weekly investment tips and market insights', ar: 'احصل على نصائح استثمارية أسبوعية ورؤى السوق' },
              buttonText: { en: 'Subscribe', ar: 'اشترك' },
              privacyNote: { en: 'We respect your privacy. Unsubscribe at any time.', ar: 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.' },
            },
          },
        ],
        seo: {
          metaTitle: 'Learn to Invest | baraka Education',
          metaDescription: 'Free investment courses and guides for beginners. Start your journey to financial literacy today.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
      ar: {
        title: 'تعلم الاستثمار',
        description: 'أدلة ودورات مجانية للمستثمرين المبتدئين',
        sections: [],
        seo: {
          metaTitle: 'تعلم الاستثمار | تعليم بركة',
          metaDescription: 'دورات وأدلة استثمارية مجانية للمبتدئين. ابدأ رحلتك نحو الثقافة المالية اليوم.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
    },
    settings: {
      headerVariant: 'default',
      footerVariant: 'default',
    },
    publishedAt: '2024-02-15T00:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '4',
    slug: 'baraka-partners',
    status: 'published',
    templateKey: 'blank',
    localeContent: {
      en: {
        title: 'Baraka Partner Program',
        description: 'Join Baraka\'s Partner Program and earn rewards while making financial tools accessible to millions.',
        sections: [
          {
            id: 'hero-partners',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Partner with Baraka', ar: 'شارك معنا في Baraka' },
              headline: { en: 'Grow With Us. Empower Investors Across the Region.', ar: 'انمُ معنا. مَكّن المستثمرين في المنطقة.' },
              subheadline: { en: 'Join Baraka\'s Partner Program and earn rewards while making financial tools accessible to millions.', ar: 'انضم لبرنامج شركاء Baraka وحقق مكافآت بينما تُسهم في توسيع الأدوات المالية لآلاف المستثمرين.' },
              primaryCTA: { text: { en: 'Become a Partner', ar: 'انضم كـ شريك' }, url: '/p/baraka-partners#signup', variant: 'primary' },
              secondaryCTA: { text: { en: 'Learn More', ar: 'المزيد' }, url: '/p/baraka-partners#why-baraka', variant: 'outline' },
            },
          },
          {
            id: 'value-props-partners',
            type: 'valueProps',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Partner With Baraka', ar: 'لماذا Baraka شريكك المثالي' },
              cards: [
                { icon: 'Globe', title: { en: 'Wider Reach', ar: 'وصول أوسع' }, description: { en: 'Connect with a growing Arab and global investor community.', ar: 'تواصل مع مجتمع المستثمرين المتنامي محلياً وعالمياً.' } },
                { icon: 'Award', title: { en: 'Earn More', ar: 'اكسب أكثر' }, description: { en: 'Competitive referral rewards and performance-based incentives.', ar: 'مكافآت إحالة تنافسية وحوافز حسب الأداء.' } },
                { icon: 'Headphones', title: { en: 'Dedicated Support', ar: 'دعم مخصص' }, description: { en: 'Guided onboarding and ongoing marketing resources.', ar: 'دعم إطلاق الحملات وموارد تسويقية مستمرة.' } },
              ],
            },
          },
          {
            id: 'features-partners',
            type: 'features',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'What You Get', ar: 'مزايا البرنامج' },
              features: [
                { title: { en: 'Custom Referral Links', ar: 'روابط إحالة مخصصة' }, description: { en: 'Track signups and performance with unique referral URLs.', ar: 'تابع التسجيلات والأداء عبر روابط فريدة.' } },
                { title: { en: 'Real-Time Insights', ar: 'رؤى فورية' }, description: { en: 'Dashboard analytics to monitor clicks, conversions, and rewards.', ar: 'لوحة تحكم لرصد النقرات، التحويلات، والمكافآت.' } },
                { title: { en: 'Marketing Materials', ar: 'مواد تسويقية' }, description: { en: 'Access banners, social content, and email templates.', ar: 'احصل على بانرات ومحتوى اجتماعي ونماذج بريدية.' } },
                { title: { en: 'Flexible Payouts', ar: 'دفعات مرنة' }, description: { en: 'Payouts via bank, crypto, or Baraka credits.', ar: 'استلام المكافآت عبر بنكي، أو كريبتو، أو رصيد Baraka.' } },
              ],
            },
          },
          {
            id: 'social-proof-partners',
            type: 'socialProof',
            enabled: true,
            order: 3,
            data: {
              title: { en: 'Trusted by Partners Across the Region', ar: 'شركاء يثقون بـ Baraka' },
              logos: [
                { imageUrl: '/logos/partner1.png', name: 'Finance Insight MENA' },
                { imageUrl: '/logos/partner2.png', name: 'Investor Weekly' },
                { imageUrl: '/logos/partner3.png', name: 'EduFi Arabia' },
              ],
              testimonials: [
                { quote: { en: 'Integrating Baraka\'s referral tools boosted our engagement by 3×.', ar: 'أدوات الإحالة في Baraka زادت التفاعل بمقدار ثلاث مرات.' }, author: 'Sara Al-Farsi, Finance Insight' },
              ],
            },
          },
          {
            id: 'content-how-it-works',
            type: 'content',
            enabled: true,
            order: 4,
            data: {
              title: { en: 'How It Works', ar: 'كيفية عمل البرنامج' },
              richText: {
                en: '<ol><li><strong>Sign up</strong> and get your unique referral link.</li><li><strong>Share it</strong> in your community — website, newsletter, social channels.</li><li><strong>Track performance</strong> in real time with our dashboard.</li><li><strong>Earn rewards</strong> when people join and invest.</li></ol>',
                ar: '<ol><li><strong>سجّل</strong> واحصل على رابط إحالة فريد.</li><li><strong>شاركه</strong> مع مجتمعك – موقع، نشرة بريدية، أو منصات التواصل.</li><li><strong>راقب الأداء</strong> لحظة بلحظة عبر لوحة التحكم.</li><li><strong>اكسب المكافآت</strong> مع كل تسجيل واستثمار.</li></ol>',
              },
            },
          },
          {
            id: 'faq-partners',
            type: 'faq',
            enabled: true,
            order: 5,
            data: {
              title: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
              items: [
                { question: { en: 'Who can join the Baraka Partner Program?', ar: 'من يمكنه الانضمام لبرنامج الشركاء؟' }, answer: { en: 'Content creators, financial educators, publishers, influencers, and communities.', ar: 'صانعو المحتوى، المعلمون الماليون، الناشرون، والمؤثرون.' } },
                { question: { en: 'How are rewards calculated?', ar: 'كيف تُحسب المكافآت؟' }, answer: { en: 'Rewards are based on the number of qualified referrals and their first-month activity.', ar: 'تُحسب المكافآت على أساس عدد الإحالات المؤهلة ونشاطهم في الشهر الأول.' } },
                { question: { en: 'When do I get paid?', ar: 'متى يتم الدفع؟' }, answer: { en: 'Payouts are processed monthly with flexible settlement options.', ar: 'يتم الدفع شهرياً مع خيارات تسوية مرنة.' } },
              ],
            },
          },
          {
            id: 'lead-form-partners',
            type: 'leadForm',
            enabled: true,
            order: 6,
            data: {
              title: { en: 'Start Earning with Baraka', ar: 'ابدأ كسب المكافآت' },
              subtitle: { en: 'Join our partner community today.', ar: 'انضم لمجتمع شركاء Baraka الآن.' },
              fields: { name: true, email: true, phone: false, country: false },
              customFields: [
                { key: 'websiteUrl', label: { en: 'Website / Social URL', ar: 'رابط الموقع / حساب التواصل' }, type: 'url', required: true, placeholder: { en: 'https://example.com', ar: 'https://example.com' } },
                { key: 'audienceSize', label: { en: 'Audience Size', ar: 'حجم الجمهور' }, type: 'select', required: true, options: [
                  { value: '<1000', label: { en: 'Less than 1,000', ar: 'أقل من 1,000' } },
                  { value: '1000-10000', label: { en: '1,000 - 10,000', ar: '1,000 - 10,000' } },
                  { value: '10000-50000', label: { en: '10,000 - 50,000', ar: '10,000 - 50,000' } },
                  { value: '50000-100000', label: { en: '50,000 - 100,000', ar: '50,000 - 100,000' } },
                  { value: '>100000', label: { en: 'More than 100,000', ar: 'أكثر من 100,000' } },
                ] },
              ],
              submitText: { en: 'Apply Now', ar: 'قدّم الآن' },
              successMessage: { en: 'Thank you! Our team will review your application soon.', ar: 'شكراً! سيقوم فريقنا بمراجعة طلبك قريباً.' },
              formKey: 'partner-signup',
            },
          },
          {
            id: 'newsletter-partners',
            type: 'newsletter',
            enabled: true,
            order: 7,
            data: {
              title: { en: 'Stay Updated', ar: 'ابقَ على اطلاع' },
              subtitle: { en: 'Get program insights, partner tips, and growth guides.', ar: 'احصل على نصائح البرنامج ودلائل النمو.' },
              buttonText: { en: 'Subscribe', ar: 'اشترك' },
              privacyNote: { en: 'We respect your privacy. Unsubscribe anytime.', ar: 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.' },
            },
          },
          {
            id: 'footer-cta-partners',
            type: 'footerCta',
            enabled: true,
            order: 8,
            data: {
              headline: { en: 'Ready to Grow with Baraka?', ar: 'هل أنت مستعد للنمو مع Baraka؟' },
              supportingText: { en: 'Become a partner and help investors unlock new opportunities.', ar: 'انضم كشريك وساعد المستثمرين على اكتشاف فرص جديدة.' },
              cta: { text: { en: 'Apply as Partner', ar: 'قدّم الآن' }, url: '/p/baraka-partners#signup', variant: 'primary' },
            },
          },
        ],
        seo: {
          metaTitle: 'Baraka Partner Program | Grow & Earn with Baraka',
          metaDescription: 'Join the Baraka Partner Program — share with your audience, track performance, and earn rewards for financial engagement across MENA & global users.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
      ar: {
        title: 'برنامج شركاء Baraka',
        description: 'انضم لبرنامج شركاء Baraka وحقق مكافآت بينما تُسهم في توسيع الأدوات المالية لآلاف المستثمرين.',
        sections: [],
        seo: {
          metaTitle: 'برنامج شركاء Baraka | انمو واكسب المكافآت',
          metaDescription: 'انضم لبرنامج شركاء Baraka – شاركه مع جمهورك، راقب الأداء، واكسب المكافآت لمشاركة الأدوات المالية في المنطقة والعالم.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
    },
    settings: {
      headerVariant: 'minimal',
      footerVariant: 'minimal',
    },
    publishedAt: '2024-12-31T00:00:00Z',
    createdAt: '2024-12-31T00:00:00Z',
    updatedAt: '2024-12-31T00:00:00Z',
  },
];

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPriceAlertSubscription(subscription: InsertPriceAlertSubscription): Promise<PriceAlertSubscription>;
  getPriceAlertSubscriptions(): Promise<PriceAlertSubscription[]>;
  
  createNewsletterSignup(signup: InsertNewsletterSignup): Promise<NewsletterSignup>;
  getNewsletterSignups(): Promise<NewsletterSignup[]>;
  
  getDiscoverSettings(): Promise<DiscoverSettings>;
  updateDiscoverSettings(settings: Partial<DiscoverSettings>): Promise<DiscoverSettings>;
  
  getStockThemes(): Promise<StockTheme[]>;
  getOfferBanners(): Promise<OfferBanner[]>;
  
  // Landing Pages
  getLandingPages(): Promise<LandingPage[]>;
  getLandingPage(id: string): Promise<LandingPage | undefined>;
  getLandingPageBySlug(slug: string): Promise<LandingPage | undefined>;
  createLandingPage(page: InsertLandingPage): Promise<LandingPage>;
  updateLandingPage(id: string, page: Partial<LandingPage>): Promise<LandingPage | undefined>;
  deleteLandingPage(id: string): Promise<boolean>;
  publishLandingPage(id: string): Promise<LandingPage | undefined>;
  
  // Landing Page Versions
  getLandingPageVersions(landingPageId: string): Promise<LandingPageVersion[]>;
  createLandingPageVersion(landingPageId: string, userId?: string): Promise<LandingPageVersion>;
  
  // Form Submissions
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  getFormSubmissions(landingPageId?: string): Promise<FormSubmission[]>;
  
  // Analytics
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  getAnalyticsEvents(landingPageId?: string): Promise<AnalyticsEvent[]>;
  getAnalyticsSummary(landingPageId: string): Promise<{ views: number; ctaClicks: number; formSubmits: number }>;
  
  // CMS Web Events
  createCmsWebEvent(event: InsertCmsWebEvent): Promise<CmsWebEvent>;
  getCmsWebEvents(filters?: { eventType?: string; startDate?: string; endDate?: string }): Promise<CmsWebEvent[]>;
  
  // Banner Events
  createBannerEvent(event: InsertBannerEvent): Promise<BannerEvent>;
  getBannerEvents(filters?: { bannerId?: string; bannerType?: string }): Promise<BannerEvent[]>;
  
  // Mobile Install Banner
  getMobileInstallBanners(): Promise<MobileInstallBanner[]>;
  getMobileInstallBanner(id: string): Promise<MobileInstallBanner | undefined>;
  getActiveMobileInstallBanner(): Promise<MobileInstallBanner | undefined>;
  createMobileInstallBanner(banner: InsertMobileInstallBanner): Promise<MobileInstallBanner>;
  updateMobileInstallBanner(id: string, banner: Partial<MobileInstallBanner>): Promise<MobileInstallBanner | undefined>;
  deleteMobileInstallBanner(id: string): Promise<boolean>;
  
  // Analytics Settings
  getAnalyticsSettings(): Promise<AnalyticsSettings>;
  updateAnalyticsSettings(settings: Partial<AnalyticsSettings>): Promise<AnalyticsSettings>;
  
  // Blog Posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // Stock Pages
  getStockPages(): Promise<StockPage[]>;
  getStockPage(id: string): Promise<StockPage | undefined>;
  getStockPageBySlug(slug: string): Promise<StockPage | undefined>;
  createStockPage(page: InsertStockPage): Promise<StockPage>;
  updateStockPage(id: string, page: Partial<StockPage>): Promise<StockPage | undefined>;
  deleteStockPage(id: string): Promise<boolean>;
  
  // Dashboard Analytics
  getDashboardSummary(dateRange: { start: string; end: string }): Promise<DashboardSummary>;
  
  // Marketing Pixels
  getMarketingPixels(): Promise<MarketingPixel[]>;
  getMarketingPixel(id: string): Promise<MarketingPixel | undefined>;
  getEnabledMarketingPixels(): Promise<MarketingPixel[]>;
  createMarketingPixel(pixel: InsertMarketingPixel): Promise<MarketingPixel>;
  updateMarketingPixel(id: string, pixel: Partial<MarketingPixel>): Promise<MarketingPixel | undefined>;
  deleteMarketingPixel(id: string): Promise<boolean>;
  
  // Pixel Event Mappings
  getPixelEventMaps(pixelId?: string): Promise<PixelEventMap[]>;
  getPixelEventMap(id: string): Promise<PixelEventMap | undefined>;
  createPixelEventMap(mapping: InsertPixelEventMap): Promise<PixelEventMap>;
  updatePixelEventMap(id: string, mapping: Partial<PixelEventMap>): Promise<PixelEventMap | undefined>;
  deletePixelEventMap(id: string): Promise<boolean>;
}

// Dashboard Summary Types
export interface DashboardSummary {
  kpis: {
    pageViews: number;
    uniqueSessions: number;
    ctaClicks: number;
    newsletterSignups: number;
    bannerClicks: number;
    adjustOutboundClicks: number;
  };
  topStockPages: Array<{ path: string; views: number; clicks: number }>;
  topBlogPosts: Array<{ path: string; views: number; newsletterClicks: number }>;
  bannerPerformance: Array<{ bannerId: string; views: number; clicks: number; ctr: number }>;
  contentHealth: {
    draftStocks: number;
    draftBlogs: number;
    missingSeo: number;
    recentlyPublished: number;
  };
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private priceAlertSubscriptions: Map<string, PriceAlertSubscription>;
  private newsletterSignups: Map<string, NewsletterSignup>;
  private discoverSettings: DiscoverSettings;
  private stockThemes: StockTheme[];
  private offerBanners: OfferBanner[];
  private landingPages: Map<string, LandingPage>;
  private landingPageVersions: Map<string, LandingPageVersion>;
  private formSubmissions: Map<string, FormSubmission>;
  private analyticsEvents: Map<string, AnalyticsEvent>;
  private cmsWebEvents: Map<string, CmsWebEvent>;
  private bannerEvents: Map<string, BannerEvent>;
  private mobileInstallBanners: Map<string, MobileInstallBanner>;
  private analyticsSettings: AnalyticsSettings;
  private blogPosts: Map<string, BlogPost>;
  private stockPages: Map<string, StockPage>;
  private marketingPixels: Map<string, MarketingPixel>;
  private pixelEventMaps: Map<string, PixelEventMap>;

  constructor() {
    this.users = new Map();
    this.priceAlertSubscriptions = new Map();
    this.newsletterSignups = new Map();
    this.discoverSettings = { ...seedDiscoverSettings };
    this.stockThemes = [...seedStockThemes];
    this.offerBanners = [...seedOfferBanners];
    this.landingPages = new Map();
    this.landingPageVersions = new Map();
    this.formSubmissions = new Map();
    this.analyticsEvents = new Map();
    this.cmsWebEvents = new Map();
    this.bannerEvents = new Map();
    this.mobileInstallBanners = new Map();
    this.analyticsSettings = { ...seedAnalyticsSettings };
    this.blogPosts = new Map();
    this.stockPages = new Map();
    this.marketingPixels = new Map();
    this.pixelEventMaps = new Map();
    
    // Seed landing pages
    seedLandingPages.forEach(page => this.landingPages.set(page.id, page));
    
    // Seed blog posts
    seedBlogPosts.forEach(post => this.blogPosts.set(post.id, post));
    
    // Seed stock pages
    seedStockPages.forEach(page => this.stockPages.set(page.id, page));
    
    // Seed mobile install banner
    this.mobileInstallBanners.set(seedMobileInstallBanner.id, seedMobileInstallBanner);
    
    // Seed CMS web events
    seedCmsWebEvents.forEach(event => this.cmsWebEvents.set(event.id, event));
    
    // Seed banner events
    seedBannerEvents.forEach(event => this.bannerEvents.set(event.id, event));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPriceAlertSubscription(subscription: InsertPriceAlertSubscription): Promise<PriceAlertSubscription> {
    const id = randomUUID();
    const newSubscription: PriceAlertSubscription = { 
      email: subscription.email,
      tickers: subscription.tickers,
      frequency: subscription.frequency,
      locale: subscription.locale ?? 'en',
      id, 
      createdAt: new Date() 
    };
    this.priceAlertSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getPriceAlertSubscriptions(): Promise<PriceAlertSubscription[]> {
    return Array.from(this.priceAlertSubscriptions.values());
  }

  async createNewsletterSignup(signup: InsertNewsletterSignup): Promise<NewsletterSignup> {
    const id = randomUUID();
    const newSignup: NewsletterSignup = { 
      email: signup.email,
      locale: signup.locale ?? 'en',
      source: signup.source ?? 'discover',
      id, 
      createdAt: new Date() 
    };
    this.newsletterSignups.set(id, newSignup);
    return newSignup;
  }

  async getNewsletterSignups(): Promise<NewsletterSignup[]> {
    return Array.from(this.newsletterSignups.values());
  }

  async getDiscoverSettings(): Promise<DiscoverSettings> {
    return this.discoverSettings;
  }

  async updateDiscoverSettings(settings: Partial<DiscoverSettings>): Promise<DiscoverSettings> {
    this.discoverSettings = { ...this.discoverSettings, ...settings };
    return this.discoverSettings;
  }

  async getStockThemes(): Promise<StockTheme[]> {
    return this.stockThemes;
  }

  async getOfferBanners(): Promise<OfferBanner[]> {
    return this.offerBanners;
  }

  // Landing Pages
  async getLandingPages(): Promise<LandingPage[]> {
    return Array.from(this.landingPages.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getLandingPage(id: string): Promise<LandingPage | undefined> {
    return this.landingPages.get(id);
  }

  async getLandingPageBySlug(slug: string): Promise<LandingPage | undefined> {
    return Array.from(this.landingPages.values()).find(page => page.slug === slug);
  }

  async createLandingPage(page: InsertLandingPage): Promise<LandingPage> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newPage: LandingPage = {
      ...page,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.landingPages.set(id, newPage);
    return newPage;
  }

  async updateLandingPage(id: string, page: Partial<LandingPage>): Promise<LandingPage | undefined> {
    const existing = this.landingPages.get(id);
    if (!existing) return undefined;
    
    const updated: LandingPage = {
      ...existing,
      ...page,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.landingPages.set(id, updated);
    return updated;
  }

  async deleteLandingPage(id: string): Promise<boolean> {
    return this.landingPages.delete(id);
  }

  async publishLandingPage(id: string): Promise<LandingPage | undefined> {
    const page = this.landingPages.get(id);
    if (!page) return undefined;
    
    // Create a version snapshot before publishing
    await this.createLandingPageVersion(id);
    
    const published: LandingPage = {
      ...page,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.landingPages.set(id, published);
    return published;
  }

  // Landing Page Versions
  async getLandingPageVersions(landingPageId: string): Promise<LandingPageVersion[]> {
    return Array.from(this.landingPageVersions.values())
      .filter(v => v.landingPageId === landingPageId)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }

  async createLandingPageVersion(landingPageId: string, userId?: string): Promise<LandingPageVersion> {
    const page = this.landingPages.get(landingPageId);
    if (!page) throw new Error('Landing page not found');
    
    const existingVersions = await this.getLandingPageVersions(landingPageId);
    const versionNumber = existingVersions.length + 1;
    
    const id = randomUUID();
    const version: LandingPageVersion = {
      id,
      landingPageId,
      versionNumber,
      snapshotJson: { ...page },
      createdAt: new Date().toISOString(),
      createdByUserId: userId,
    };
    this.landingPageVersions.set(id, version);
    return version;
  }

  // Form Submissions
  async createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission> {
    const id = randomUUID();
    const newSubmission: FormSubmission = {
      ...submission,
      id,
      createdAt: new Date().toISOString(),
    };
    this.formSubmissions.set(id, newSubmission);
    return newSubmission;
  }

  async getFormSubmissions(landingPageId?: string): Promise<FormSubmission[]> {
    const submissions = Array.from(this.formSubmissions.values());
    if (landingPageId) {
      return submissions.filter(s => s.landingPageId === landingPageId);
    }
    return submissions;
  }

  // Analytics
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const id = randomUUID();
    const newEvent: AnalyticsEvent = {
      ...event,
      id,
      createdAt: new Date().toISOString(),
    };
    this.analyticsEvents.set(id, newEvent);
    return newEvent;
  }

  async getAnalyticsEvents(landingPageId?: string): Promise<AnalyticsEvent[]> {
    const events = Array.from(this.analyticsEvents.values());
    if (landingPageId) {
      return events.filter(e => e.landingPageId === landingPageId);
    }
    return events;
  }

  async getAnalyticsSummary(landingPageId: string): Promise<{ views: number; ctaClicks: number; formSubmits: number }> {
    const events = await this.getAnalyticsEvents(landingPageId);
    return {
      views: events.filter(e => e.eventType === 'page_view').length,
      ctaClicks: events.filter(e => e.eventType === 'cta_click').length,
      formSubmits: events.filter(e => e.eventType === 'form_submit').length,
    };
  }

  // CMS Web Events
  async createCmsWebEvent(event: InsertCmsWebEvent): Promise<CmsWebEvent> {
    const id = randomUUID();
    const newEvent: CmsWebEvent = {
      ...event,
      id,
      createdAt: new Date().toISOString(),
    };
    this.cmsWebEvents.set(id, newEvent);
    return newEvent;
  }

  async getCmsWebEvents(filters?: { eventType?: string; startDate?: string; endDate?: string }): Promise<CmsWebEvent[]> {
    let events = Array.from(this.cmsWebEvents.values());
    if (filters?.eventType) {
      events = events.filter(e => e.eventType === filters.eventType);
    }
    if (filters?.startDate) {
      events = events.filter(e => new Date(e.createdAt) >= new Date(filters.startDate!));
    }
    if (filters?.endDate) {
      events = events.filter(e => new Date(e.createdAt) <= new Date(filters.endDate!));
    }
    return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Banner Events
  async createBannerEvent(event: InsertBannerEvent): Promise<BannerEvent> {
    const id = randomUUID();
    const newEvent: BannerEvent = {
      ...event,
      id,
      createdAt: new Date().toISOString(),
    };
    this.bannerEvents.set(id, newEvent);
    return newEvent;
  }

  async getBannerEvents(filters?: { bannerId?: string; bannerType?: string }): Promise<BannerEvent[]> {
    let events = Array.from(this.bannerEvents.values());
    if (filters?.bannerId) {
      events = events.filter(e => e.bannerId === filters.bannerId);
    }
    if (filters?.bannerType) {
      events = events.filter(e => e.bannerType === filters.bannerType);
    }
    return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Mobile Install Banner
  async getMobileInstallBanners(): Promise<MobileInstallBanner[]> {
    return Array.from(this.mobileInstallBanners.values());
  }

  async getMobileInstallBanner(id: string): Promise<MobileInstallBanner | undefined> {
    return this.mobileInstallBanners.get(id);
  }

  async getActiveMobileInstallBanner(): Promise<MobileInstallBanner | undefined> {
    return Array.from(this.mobileInstallBanners.values()).find(b => b.enabled);
  }

  async createMobileInstallBanner(banner: InsertMobileInstallBanner): Promise<MobileInstallBanner> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newBanner: MobileInstallBanner = {
      ...banner,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.mobileInstallBanners.set(id, newBanner);
    return newBanner;
  }

  async updateMobileInstallBanner(id: string, banner: Partial<MobileInstallBanner>): Promise<MobileInstallBanner | undefined> {
    const existing = this.mobileInstallBanners.get(id);
    if (!existing) return undefined;
    
    const updated: MobileInstallBanner = {
      ...existing,
      ...banner,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.mobileInstallBanners.set(id, updated);
    return updated;
  }

  async deleteMobileInstallBanner(id: string): Promise<boolean> {
    return this.mobileInstallBanners.delete(id);
  }

  // Analytics Settings
  async getAnalyticsSettings(): Promise<AnalyticsSettings> {
    return this.analyticsSettings;
  }

  async updateAnalyticsSettings(settings: Partial<AnalyticsSettings>): Promise<AnalyticsSettings> {
    this.analyticsSettings = {
      ...this.analyticsSettings,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    return this.analyticsSettings;
  }

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;
    
    const updated: BlogPost = {
      ...existing,
      ...post,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Stock Pages
  async getStockPages(): Promise<StockPage[]> {
    return Array.from(this.stockPages.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getStockPage(id: string): Promise<StockPage | undefined> {
    return this.stockPages.get(id);
  }

  async getStockPageBySlug(slug: string): Promise<StockPage | undefined> {
    return Array.from(this.stockPages.values()).find(page => page.slug === slug);
  }

  async createStockPage(page: InsertStockPage): Promise<StockPage> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newPage: StockPage = {
      ...page,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.stockPages.set(id, newPage);
    return newPage;
  }

  async updateStockPage(id: string, page: Partial<StockPage>): Promise<StockPage | undefined> {
    const existing = this.stockPages.get(id);
    if (!existing) return undefined;
    
    const updated: StockPage = {
      ...existing,
      ...page,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.stockPages.set(id, updated);
    return updated;
  }

  async deleteStockPage(id: string): Promise<boolean> {
    return this.stockPages.delete(id);
  }

  // Dashboard Analytics
  async getDashboardSummary(dateRange: { start: string; end: string }): Promise<DashboardSummary> {
    const events = await this.getCmsWebEvents({
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
    
    const newsletterSignups = Array.from(this.newsletterSignups.values()).filter(s => {
      const date = new Date(s.createdAt);
      return date >= new Date(dateRange.start) && date <= new Date(dateRange.end);
    });
    
    const bannerEvts = await this.getBannerEvents();
    const stockPages = await this.getStockPages();
    const blogPosts = await this.getBlogPosts();

    // Calculate top stock pages
    const stockViews: Record<string, { views: number; clicks: number }> = {};
    events.filter(e => e.pagePath.startsWith('/stocks/')).forEach(e => {
      if (!stockViews[e.pagePath]) stockViews[e.pagePath] = { views: 0, clicks: 0 };
      if (e.eventType === 'page_view') stockViews[e.pagePath].views++;
      if (e.eventType === 'cta_click') stockViews[e.pagePath].clicks++;
    });

    // Calculate top blog posts
    const blogViews: Record<string, { views: number; newsletterClicks: number }> = {};
    events.filter(e => e.pagePath.startsWith('/blog/')).forEach(e => {
      if (!blogViews[e.pagePath]) blogViews[e.pagePath] = { views: 0, newsletterClicks: 0 };
      if (e.eventType === 'page_view') blogViews[e.pagePath].views++;
      if (e.eventType === 'newsletter_submit') blogViews[e.pagePath].newsletterClicks++;
    });

    // Banner performance
    const bannerPerf: Record<string, { views: number; clicks: number }> = {};
    bannerEvts.forEach(e => {
      if (!bannerPerf[e.bannerId]) bannerPerf[e.bannerId] = { views: 0, clicks: 0 };
      if (e.eventType === 'view') bannerPerf[e.bannerId].views++;
      if (e.eventType === 'click') bannerPerf[e.bannerId].clicks++;
    });

    // Content health
    const draftStocks = stockPages.filter(p => p.status === 'draft').length;
    const draftBlogs = blogPosts.filter(p => p.status === 'draft').length;
    const missingSeo = [...stockPages, ...blogPosts].filter(p => {
      const seo = 'seo' in p ? p.seo : {};
      return !seo.metaTitle_en && !seo.metaDescription_en;
    }).length;
    const recentlyPublished = [...stockPages, ...blogPosts].filter(p => {
      const published = p.publishedAt;
      if (!published) return false;
      const days = (Date.now() - new Date(published).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length;

    // Unique sessions
    const sessions = new Set(events.filter(e => e.metaJson.sessionId).map(e => e.metaJson.sessionId));

    return {
      kpis: {
        pageViews: events.filter(e => e.eventType === 'page_view').length,
        uniqueSessions: sessions.size,
        ctaClicks: events.filter(e => e.eventType === 'cta_click').length,
        newsletterSignups: newsletterSignups.length + events.filter(e => e.eventType === 'newsletter_submit').length,
        bannerClicks: events.filter(e => e.eventType === 'banner_click').length,
        adjustOutboundClicks: events.filter(e => e.eventType === 'adjust_outbound_click').length,
      },
      topStockPages: Object.entries(stockViews)
        .map(([path, data]) => ({ path, ...data }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
      topBlogPosts: Object.entries(blogViews)
        .map(([path, data]) => ({ path, ...data }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10),
      bannerPerformance: Object.entries(bannerPerf)
        .map(([bannerId, data]) => ({
          bannerId,
          ...data,
          ctr: data.views > 0 ? (data.clicks / data.views) * 100 : 0,
        }))
        .sort((a, b) => b.ctr - a.ctr),
      contentHealth: {
        draftStocks,
        draftBlogs,
        missingSeo,
        recentlyPublished,
      },
    };
  }

  // Marketing Pixels
  async getMarketingPixels(): Promise<MarketingPixel[]> {
    return Array.from(this.marketingPixels.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getMarketingPixel(id: string): Promise<MarketingPixel | undefined> {
    return this.marketingPixels.get(id);
  }

  async getEnabledMarketingPixels(): Promise<MarketingPixel[]> {
    return Array.from(this.marketingPixels.values()).filter(p => p.enabled);
  }

  async createMarketingPixel(pixel: InsertMarketingPixel): Promise<MarketingPixel> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newPixel: MarketingPixel = {
      ...pixel,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.marketingPixels.set(id, newPixel);
    return newPixel;
  }

  async updateMarketingPixel(id: string, pixel: Partial<MarketingPixel>): Promise<MarketingPixel | undefined> {
    const existing = this.marketingPixels.get(id);
    if (!existing) return undefined;
    
    const updated: MarketingPixel = {
      ...existing,
      ...pixel,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.marketingPixels.set(id, updated);
    return updated;
  }

  async deleteMarketingPixel(id: string): Promise<boolean> {
    // Also delete associated event mappings
    Array.from(this.pixelEventMaps.values())
      .filter(m => m.pixelId === id)
      .forEach(m => this.pixelEventMaps.delete(m.id));
    return this.marketingPixels.delete(id);
  }

  // Pixel Event Mappings
  async getPixelEventMaps(pixelId?: string): Promise<PixelEventMap[]> {
    const maps = Array.from(this.pixelEventMaps.values());
    if (pixelId) {
      return maps.filter(m => m.pixelId === pixelId);
    }
    return maps;
  }

  async getPixelEventMap(id: string): Promise<PixelEventMap | undefined> {
    return this.pixelEventMaps.get(id);
  }

  async createPixelEventMap(mapping: InsertPixelEventMap): Promise<PixelEventMap> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newMapping: PixelEventMap = {
      ...mapping,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.pixelEventMaps.set(id, newMapping);
    return newMapping;
  }

  async updatePixelEventMap(id: string, mapping: Partial<PixelEventMap>): Promise<PixelEventMap | undefined> {
    const existing = this.pixelEventMaps.get(id);
    if (!existing) return undefined;
    
    const updated: PixelEventMap = {
      ...existing,
      ...mapping,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.pixelEventMaps.set(id, updated);
    return updated;
  }

  async deletePixelEventMap(id: string): Promise<boolean> {
    return this.pixelEventMaps.delete(id);
  }
}

export const storage = new MemStorage();
