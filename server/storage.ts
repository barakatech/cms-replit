import { 
  type User, 
  type InsertUser, 
  type InsertPriceAlertSubscription, 
  type PriceAlertSubscription,
  type InsertStockWatchSubscription,
  type StockWatchSubscription,
  type InsertNewsletterSignup,
  type NewsletterSignup,
  type DiscoverSettings,
  type StockTheme,
  type InsertStockTheme,
  type StockCollection,
  type InsertStockCollection,
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
  type StockPageBlock,
  type StockThemeMember,
  type InsertStockThemeMember,
  type MarketingPixel,
  type InsertMarketingPixel,
  type PixelEventMap,
  type InsertPixelEventMap,
  type AppDownloadConfig,
  type CallToAction,
  type InsertCallToAction,
  type CTAEvent,
  type InsertCTAEvent,
  type Newsletter,
  type InsertNewsletter,
  type NewsletterTemplate,
  type InsertNewsletterTemplate,
  type SchemaBlock,
  type InsertSchemaBlock,
  type SpotlightBanner,
  type InsertSpotlightBanner,
  type Subscriber,
  type InsertSubscriber,
  type AuditLog,
  type InsertAuditLog,
  type NewsletterSettings,
  type CmsTeamMember,
  type InsertCmsTeamMember,
  type CmsSettings,
  type StockSeoTemplates,
  type AssetLink,
  type InsertAssetLink,
  type Story,
  type InsertStory,
  type ComplianceScanRun,
  type InsertComplianceScanRun,
  type ComplianceRule,
  type InsertComplianceRule,
  type ComplianceCheckerSettings,
  type WritingAssistantIntegration,
  type InsertWritingAssistantIntegration,
  type ComplianceFinding,
  type BlockLibraryTemplate,
  type InsertBlockLibraryTemplate,
  type TickerCatalogEntry,
  type InsertTickerCatalogEntry,
  type NewsletterBlockInstance,
  type InsertNewsletterBlockInstance,
  type SchemaBlockDefinition,
  type InsertSchemaBlockDefinition,
  type NewsletterTemplateBlockOverride,
  type InsertNewsletterTemplateBlockOverride,
  BARAKA_STORE_URLS,
  type BondPage,
  type InsertBondPage,
  DEFAULT_BOND_PAGE_BLOCKS
} from "@shared/schema";
import { randomUUID } from "crypto";
import { 
  seedBlogPosts as seedArticles, 
  generateSpotlightsFromBlogPosts, 
  generateNewslettersFromBlogPosts 
} from "./seedData/articles";

// Helper function to generate default page builder blocks for stock pages
function generateDefaultPageBlocks(): StockPageBlock[] {
  return [
    { id: randomUUID(), type: 'stockHeader', enabled: true, order: 1 },
    { id: randomUUID(), type: 'priceSnapshot', enabled: true, order: 2 },
    { id: randomUUID(), type: 'priceChart', enabled: true, order: 3, config: { defaultTimeframe: '1M' } },
    { id: randomUUID(), type: 'keyStatistics', enabled: true, order: 4 },
    { id: randomUUID(), type: 'aboutCompany', enabled: true, order: 5 },
    { id: randomUUID(), type: 'analystRatings', enabled: true, order: 6 },
    { id: randomUUID(), type: 'earnings', enabled: true, order: 7 },
    { id: randomUUID(), type: 'newsList', enabled: true, order: 8, config: { maxItems: 5 } },
    { id: randomUUID(), type: 'trendingStocks', enabled: true, order: 9 },
    { id: randomUUID(), type: 'risksDisclosure', enabled: true, order: 10 },
  ];
}

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
  learnFeaturedPostId: '101',
  learnSecondaryPostIds: ['102', '103'],
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

const now = new Date().toISOString();

const seedStockThemes: StockTheme[] = [
  {
    id: '1',
    slug: 'halal-stocks',
    title_en: 'Halal Stocks',
    title_ar: 'الأسهم الحلال',
    description_en: 'Explore shares that may align with Shariah screening approaches',
    description_ar: 'استكشف الأسهم التي قد تتوافق مع معايير الفحص الشرعي',
    longDescription_en: 'Explore shares that may align with Shariah screening approaches. Use this theme to discover companies often discussed in halal investing frameworks, then review details before investing. These stocks are screened based on business activity, debt levels, and income sources.',
    longDescription_ar: 'استكشف الأسهم التي قد تتوافق مع معايير الفحص الشرعي. استخدم هذا الموضوع لاكتشاف الشركات التي يتم مناقشتها غالبًا في أطر الاستثمار الحلال، ثم راجع التفاصيل قبل الاستثمار.',
    tickers: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN', 'META', 'AVGO', 'LLY', 'UNH', 'MA', 'JNJ', 'COST'],
    heroImage: '',
    icon: 'Moon',
    badges: ['Shariah-screened', 'Popular'],
    highlights: [
      { icon: 'Shield', title_en: 'Shariah Screening', title_ar: 'الفحص الشرعي', description_en: 'Stocks vetted against Islamic finance principles', description_ar: 'أسهم تم فحصها وفقًا لمبادئ التمويل الإسلامي' },
      { icon: 'TrendingUp', title_en: 'Growth Potential', title_ar: 'إمكانية النمو', description_en: 'Quality companies with strong fundamentals', description_ar: 'شركات ذات جودة عالية وأساسيات قوية' },
      { icon: 'Globe', title_en: 'Diversified', title_ar: 'متنوع', description_en: 'Across multiple sectors and industries', description_ar: 'عبر قطاعات وصناعات متعددة' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['halal', 'shariah', 'islamic-finance'],
    seo: { metaTitle_en: 'Halal Stocks - Shariah-Compliant Investing | Baraka', metaTitle_ar: 'الأسهم الحلال - الاستثمار المتوافق مع الشريعة | بركة' },
    order: 1,
    status: 'published',
    isNew: false,
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    slug: 'ai-leaders',
    title_en: 'AI Leaders',
    title_ar: 'رواد الذكاء الاصطناعي',
    description_en: 'Companies at the forefront of artificial intelligence innovation',
    description_ar: 'الشركات في طليعة ابتكارات الذكاء الاصطناعي',
    longDescription_en: 'Discover companies leading the artificial intelligence revolution. From chip makers powering AI training to software companies deploying AI solutions, these stocks represent the cutting edge of technology.',
    longDescription_ar: 'اكتشف الشركات التي تقود ثورة الذكاء الاصطناعي. من صانعي الرقائق التي تشغل تدريب الذكاء الاصطناعي إلى شركات البرمجيات التي تنشر حلول الذكاء الاصطناعي.',
    tickers: ['NVDA', 'MSFT', 'GOOGL', 'META', 'AMD', 'AVGO', 'PLTR', 'MRVL', 'ORCL', 'CRM', 'IBM', 'ADBE'],
    heroImage: '',
    icon: 'Brain',
    badges: ['High Growth', 'Tech'],
    highlights: [
      { icon: 'Cpu', title_en: 'AI Infrastructure', title_ar: 'البنية التحتية للذكاء الاصطناعي', description_en: 'Companies building AI chips and infrastructure', description_ar: 'شركات تبني رقائق وبنية تحتية للذكاء الاصطناعي' },
      { icon: 'Sparkles', title_en: 'AI Applications', title_ar: 'تطبيقات الذكاء الاصطناعي', description_en: 'Software leaders deploying AI solutions', description_ar: 'رواد البرمجيات الذين ينشرون حلول الذكاء الاصطناعي' },
      { icon: 'TrendingUp', title_en: 'Growth Market', title_ar: 'سوق النمو', description_en: 'Positioned in a rapidly expanding market', description_ar: 'موقعها في سوق سريع التوسع' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['ai', 'technology', 'semiconductors'],
    seo: { metaTitle_en: 'AI Leader Stocks - Artificial Intelligence Companies | Baraka', metaTitle_ar: 'أسهم رواد الذكاء الاصطناعي | بركة' },
    order: 2,
    status: 'published',
    isNew: true,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    slug: 'dividend-staples',
    title_en: 'Dividend Staples',
    title_ar: 'أساسيات توزيعات الأرباح',
    description_en: 'Reliable dividend-paying stocks with consistent track records',
    description_ar: 'أسهم موثوقة لتوزيع الأرباح مع سجلات ثابتة',
    longDescription_en: 'Build a portfolio focused on income with these established dividend payers. These companies have track records of paying and growing dividends, offering potential income and stability.',
    longDescription_ar: 'قم ببناء محفظة تركز على الدخل مع هؤلاء الموزعين للأرباح. هذه الشركات لديها سجلات في دفع وزيادة توزيعات الأرباح.',
    tickers: ['JNJ', 'JPM', 'UNH', 'MA', 'V', 'COST', 'WMT', 'CVX', 'MRK', 'IBM', 'CSCO', 'TMO'],
    heroImage: '',
    icon: 'Coins',
    badges: ['Income', 'Stable'],
    highlights: [
      { icon: 'DollarSign', title_en: 'Regular Income', title_ar: 'دخل منتظم', description_en: 'Consistent dividend payments', description_ar: 'مدفوعات أرباح منتظمة' },
      { icon: 'Shield', title_en: 'Established Companies', title_ar: 'شركات راسخة', description_en: 'Blue-chip stocks with proven track records', description_ar: 'أسهم ممتازة مع سجلات مثبتة' },
      { icon: 'TrendingUp', title_en: 'Dividend Growth', title_ar: 'نمو الأرباح', description_en: 'History of increasing dividends', description_ar: 'تاريخ من زيادة توزيعات الأرباح' },
    ],
    sortMode: 'manual',
    relatedPostTags: ['dividends', 'income', 'investing'],
    seo: { metaTitle_en: 'Dividend Stocks - Income Investing | Baraka', metaTitle_ar: 'أسهم توزيعات الأرباح | بركة' },
    order: 3,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    slug: 'clean-energy',
    title_en: 'Clean Energy',
    title_ar: 'الطاقة النظيفة',
    description_en: 'Companies driving the transition to sustainable energy',
    description_ar: 'الشركات التي تقود التحول إلى الطاقة المستدامة',
    longDescription_en: 'Invest in the future of energy with companies focused on renewable power, electric vehicles, and sustainable solutions. These stocks represent the growing clean energy sector.',
    longDescription_ar: 'استثمر في مستقبل الطاقة مع الشركات التي تركز على الطاقة المتجددة والسيارات الكهربائية والحلول المستدامة.',
    tickers: ['TSLA', 'NVDA', 'GEV', 'BE', 'CVX', 'ASTS'],
    heroImage: '',
    icon: 'Leaf',
    badges: ['ESG', 'Growth'],
    highlights: [
      { icon: 'Zap', title_en: 'Renewable Energy', title_ar: 'الطاقة المتجددة', description_en: 'Solar, wind, and clean power generation', description_ar: 'توليد الطاقة الشمسية والرياح والنظيفة' },
      { icon: 'Car', title_en: 'Electric Vehicles', title_ar: 'السيارات الكهربائية', description_en: 'EV manufacturers and suppliers', description_ar: 'مصنعو وموردو السيارات الكهربائية' },
      { icon: 'Globe', title_en: 'Sustainability', title_ar: 'الاستدامة', description_en: 'Companies with strong ESG focus', description_ar: 'شركات ذات تركيز قوي على ESG' },
    ],
    sortMode: 'manual',
    relatedPostTags: ['clean-energy', 'esg', 'sustainability'],
    seo: { metaTitle_en: 'Clean Energy Stocks - Sustainable Investing | Baraka', metaTitle_ar: 'أسهم الطاقة النظيفة | بركة' },
    order: 4,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '5',
    slug: 'us-mega-caps',
    title_en: 'US Mega Caps',
    title_ar: 'الشركات الأمريكية العملاقة',
    description_en: 'The largest US companies by market capitalization',
    description_ar: 'أكبر الشركات الأمريكية من حيث القيمة السوقية',
    longDescription_en: 'Access the biggest names in American business. These mega-cap stocks represent the most valuable companies in the US market, offering liquidity and established business models.',
    longDescription_ar: 'الوصول إلى أكبر الأسماء في الأعمال الأمريكية. تمثل هذه الأسهم العملاقة أكثر الشركات قيمة في السوق الأمريكي.',
    tickers: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'AVGO', 'LLY', 'JPM', 'UNH', 'V', 'MA', 'COST', 'WMT', 'JNJ'],
    heroImage: '',
    icon: 'Building2',
    badges: ['Blue Chip', 'Liquid'],
    highlights: [
      { icon: 'TrendingUp', title_en: 'Market Leaders', title_ar: 'رواد السوق', description_en: 'Dominant positions in their industries', description_ar: 'مواقع مهيمنة في صناعاتهم' },
      { icon: 'Shield', title_en: 'Stability', title_ar: 'الاستقرار', description_en: 'Established companies with proven track records', description_ar: 'شركات راسخة مع سجلات مثبتة' },
      { icon: 'BarChart2', title_en: 'High Liquidity', title_ar: 'سيولة عالية', description_en: 'Easy to buy and sell with tight spreads', description_ar: 'سهل الشراء والبيع مع فروق ضيقة' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['mega-cap', 'blue-chip', 'investing'],
    seo: { metaTitle_en: 'US Mega Cap Stocks - Blue Chip Investing | Baraka', metaTitle_ar: 'أسهم الشركات العملاقة الأمريكية | بركة' },
    order: 5,
    status: 'published',
    isNew: false,
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '6',
    slug: 'fintech',
    title_en: 'Fintech & Payments',
    title_ar: 'التكنولوجيا المالية والمدفوعات',
    description_en: 'Companies transforming financial services',
    description_ar: 'الشركات التي تحول الخدمات المالية',
    tickers: ['V', 'MA', 'JPM', 'GS', 'COIN', 'HOOD', 'SOFI'],
    heroImage: '',
    icon: 'CreditCard',
    badges: ['Innovation', 'Growth'],
    highlights: [
      { icon: 'Smartphone', title_en: 'Digital Payments', title_ar: 'المدفوعات الرقمية', description_en: 'Leaders in digital payment solutions', description_ar: 'رواد في حلول الدفع الرقمي' },
      { icon: 'TrendingUp', title_en: 'Disruption', title_ar: 'التغيير الجذري', description_en: 'Disrupting traditional banking', description_ar: 'تغيير الخدمات المصرفية التقليدية' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['fintech', 'payments', 'banking'],
    seo: { metaTitle_en: 'Fintech Stocks - Digital Finance | Baraka' },
    order: 6,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '7',
    slug: 'healthcare-pharma',
    title_en: 'Healthcare & Pharma',
    title_ar: 'الرعاية الصحية والأدوية',
    description_en: 'Leading healthcare and pharmaceutical companies',
    description_ar: 'شركات الرعاية الصحية والأدوية الرائدة',
    tickers: ['UNH', 'LLY', 'JNJ', 'MRK', 'TMO', 'PANW'],
    heroImage: '',
    icon: 'Heart',
    badges: ['Defensive', 'Innovation'],
    highlights: [
      { icon: 'Pill', title_en: 'Pharma Giants', title_ar: 'عمالقة الأدوية', description_en: 'Major pharmaceutical companies', description_ar: 'شركات الأدوية الكبرى' },
      { icon: 'Activity', title_en: 'Healthcare Services', title_ar: 'خدمات الرعاية الصحية', description_en: 'Insurance and healthcare providers', description_ar: 'مزودو التأمين والرعاية الصحية' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['healthcare', 'pharma', 'biotech'],
    seo: { metaTitle_en: 'Healthcare Stocks - Medical & Pharma | Baraka' },
    order: 7,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '8',
    slug: 'most-active',
    title_en: 'Most Active',
    title_ar: 'الأكثر نشاطاً',
    description_en: 'Top US stocks by trading volume — the most actively traded names on the market',
    description_ar: 'أكثر الأسهم الأمريكية تداولاً من حيث حجم التداول',
    longDescription_en: 'Track the pulse of the market with these high-volume stocks. Most Active stocks see significant daily trading activity, making them popular choices for traders seeking liquidity and momentum.',
    longDescription_ar: 'تتبع نبض السوق مع هذه الأسهم ذات الحجم العالي. تشهد الأسهم الأكثر نشاطاً نشاط تداول يومي كبير.',
    tickers: ['TSLA', 'NVDA', 'MU', 'MSFT', 'AMZN', 'AAPL', 'PLTR', 'META', 'AVGO', 'AMD', 'GOOGL', 'INTC', 'NFLX', 'APP', 'MSTR', 'HOOD', 'ORCL', 'LLY', 'JPM', 'GS'],
    heroImage: '',
    icon: 'Activity',
    badges: ['High Volume', 'Popular'],
    highlights: [
      { icon: 'BarChart2', title_en: 'High Liquidity', title_ar: 'سيولة عالية', description_en: 'Easy to buy and sell with tight spreads', description_ar: 'سهل الشراء والبيع مع فروق ضيقة' },
      { icon: 'TrendingUp', title_en: 'Market Movers', title_ar: 'محركات السوق', description_en: 'Stocks driving daily market action', description_ar: 'الأسهم التي تحرك السوق يومياً' },
      { icon: 'Zap', title_en: 'Active Trading', title_ar: 'تداول نشط', description_en: 'Ideal for momentum strategies', description_ar: 'مثالي لاستراتيجيات الزخم' },
    ],
    sortMode: 'volume',
    relatedPostTags: ['trading', 'volume', 'momentum'],
    seo: { metaTitle_en: 'Most Active Stocks - High Volume Trading | Baraka', metaTitle_ar: 'الأسهم الأكثر نشاطاً | بركة' },
    order: 8,
    status: 'published',
    isNew: true,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '9',
    slug: '52-week-highs',
    title_en: '52-Week Highs',
    title_ar: 'أعلى مستوى في 52 أسبوع',
    description_en: 'Stocks trading at or near their 52-week highs — demonstrating strong momentum',
    description_ar: 'الأسهم التي تتداول عند أو بالقرب من أعلى مستوياتها في 52 أسبوعاً',
    longDescription_en: 'Discover stocks breaking out to new highs. These companies have shown strong price performance over the past year, reaching their highest trading levels in 52 weeks.',
    longDescription_ar: 'اكتشف الأسهم التي تحقق ارتفاعات جديدة. أظهرت هذه الشركات أداءً سعرياً قوياً خلال العام الماضي.',
    tickers: ['NVDA', 'META', 'AVGO', 'LLY', 'COST', 'ORCL', 'ADBE', 'CRM', 'PANW', 'CRWD', 'MRVL', 'AMD', 'MSFT', 'GOOGL', 'MA'],
    heroImage: '',
    icon: 'TrendingUp',
    badges: ['Momentum', 'Breakout'],
    highlights: [
      { icon: 'ArrowUp', title_en: 'Strong Performance', title_ar: 'أداء قوي', description_en: 'Stocks at yearly highs', description_ar: 'أسهم عند أعلى مستوياتها السنوية' },
      { icon: 'Target', title_en: 'Momentum Leaders', title_ar: 'قادة الزخم', description_en: 'Companies with sustained uptrends', description_ar: 'شركات ذات اتجاهات صعودية مستدامة' },
      { icon: 'Star', title_en: 'Market Favorites', title_ar: 'مفضلات السوق', description_en: 'Stocks attracting investor attention', description_ar: 'أسهم تجذب انتباه المستثمرين' },
    ],
    sortMode: 'manual',
    relatedPostTags: ['momentum', 'breakout', 'highs'],
    seo: { metaTitle_en: '52-Week High Stocks - Market Momentum | Baraka', metaTitle_ar: 'أسهم أعلى مستوى في 52 أسبوع | بركة' },
    order: 9,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '10',
    slug: '52-week-lows',
    title_en: '52-Week Lows',
    title_ar: 'أدنى مستوى في 52 أسبوع',
    description_en: 'Stocks trading at or near their 52-week lows — potential value opportunities',
    description_ar: 'الأسهم التي تتداول عند أو بالقرب من أدنى مستوياتها في 52 أسبوعاً',
    longDescription_en: 'Explore stocks that have pulled back significantly. While past performance does not guarantee future results, some investors look for value in stocks trading near yearly lows.',
    longDescription_ar: 'استكشف الأسهم التي تراجعت بشكل كبير. بينما لا يضمن الأداء السابق النتائج المستقبلية، يبحث بعض المستثمرين عن القيمة في الأسهم.',
    tickers: ['INTC', 'BA', 'MU', 'SOFI', 'HOOD', 'CVX', 'JNJ', 'MRK', 'CSCO', 'IBM', 'WMT', 'TMO'],
    heroImage: '',
    icon: 'TrendingDown',
    badges: ['Value', 'Contrarian'],
    highlights: [
      { icon: 'Search', title_en: 'Value Hunting', title_ar: 'البحث عن القيمة', description_en: 'Potentially undervalued opportunities', description_ar: 'فرص محتملة بأسعار منخفضة' },
      { icon: 'AlertTriangle', title_en: 'Higher Risk', title_ar: 'مخاطر أعلى', description_en: 'Research thoroughly before investing', description_ar: 'ابحث جيداً قبل الاستثمار' },
      { icon: 'RefreshCw', title_en: 'Turnaround Plays', title_ar: 'فرص التعافي', description_en: 'Companies that may recover', description_ar: 'شركات قد تتعافى' },
    ],
    sortMode: 'manual',
    relatedPostTags: ['value', 'contrarian', 'lows'],
    seo: { metaTitle_en: '52-Week Low Stocks - Value Opportunities | Baraka', metaTitle_ar: 'أسهم أدنى مستوى في 52 أسبوع | بركة' },
    order: 10,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '11',
    slug: 'crypto-exposure',
    title_en: 'Bitcoin & Crypto Exposure',
    title_ar: 'تعرض البيتكوين والعملات الرقمية',
    description_en: 'Equity-linked exposure to cryptocurrency markets through publicly traded companies',
    description_ar: 'تعرض مرتبط بالأسهم لأسواق العملات الرقمية من خلال الشركات المتداولة علناً',
    longDescription_en: 'Gain exposure to the crypto economy through traditional equities. These stocks represent companies with significant Bitcoin holdings, crypto exchange operations, or blockchain-related business models.',
    longDescription_ar: 'احصل على تعرض لاقتصاد العملات الرقمية من خلال الأسهم التقليدية. تمثل هذه الأسهم شركات لديها حيازات كبيرة من البيتكوين.',
    tickers: ['COIN', 'MSTR', 'HOOD', 'GS', 'JPM'],
    heroImage: '',
    icon: 'Bitcoin',
    badges: ['Crypto', 'High Volatility'],
    highlights: [
      { icon: 'Coins', title_en: 'Bitcoin Exposure', title_ar: 'تعرض البيتكوين', description_en: 'Companies holding Bitcoin on balance sheet', description_ar: 'شركات تحتفظ بالبيتكوين في ميزانياتها' },
      { icon: 'Building2', title_en: 'Crypto Exchanges', title_ar: 'بورصات العملات الرقمية', description_en: 'Platforms for trading digital assets', description_ar: 'منصات لتداول الأصول الرقمية' },
      { icon: 'AlertTriangle', title_en: 'Volatility Warning', title_ar: 'تحذير التقلبات', description_en: 'High correlation with crypto markets', description_ar: 'ارتباط عالي بأسواق العملات الرقمية' },
    ],
    sortMode: 'manual',
    relatedPostTags: ['crypto', 'bitcoin', 'blockchain'],
    seo: { metaTitle_en: 'Bitcoin & Crypto Stocks - Digital Asset Exposure | Baraka', metaTitle_ar: 'أسهم البيتكوين والعملات الرقمية | بركة' },
    order: 11,
    status: 'published',
    isNew: true,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '12',
    slug: 'etfs',
    title_en: 'ETFs',
    title_ar: 'الصناديق المتداولة',
    description_en: 'Exchange-traded funds for diversified investing',
    description_ar: 'صناديق الاستثمار المتداولة للاستثمار المتنوع',
    longDescription_en: 'ETFs offer a simple way to invest in a basket of securities. Gain exposure to various markets, sectors, and asset classes through these diversified investment vehicles.',
    longDescription_ar: 'توفر صناديق الاستثمار المتداولة طريقة بسيطة للاستثمار في سلة من الأوراق المالية. احصل على تعرض لأسواق وقطاعات وفئات أصول مختلفة.',
    tickers: ['VOO', 'SPUS', 'SPY', 'QQQ', 'IVV', 'VTI', 'HLAL', 'SPSK', 'UMMA', 'APTS'],
    heroImage: '',
    icon: 'BarChart3',
    badges: ['Diversified', 'Passive'],
    highlights: [
      { icon: 'PieChart', title_en: 'Diversification', title_ar: 'التنويع', description_en: 'Spread risk across multiple holdings', description_ar: 'توزيع المخاطر عبر عدة ممتلكات' },
      { icon: 'DollarSign', title_en: 'Low Cost', title_ar: 'تكلفة منخفضة', description_en: 'Typically lower fees than mutual funds', description_ar: 'رسوم أقل عادة من الصناديق المشتركة' },
      { icon: 'TrendingUp', title_en: 'Market Access', title_ar: 'وصول للسوق', description_en: 'Easy access to various markets', description_ar: 'وصول سهل لأسواق متنوعة' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['etfs', 'passive-investing', 'diversification'],
    seo: { metaTitle_en: 'ETFs - Exchange Traded Funds | Baraka', metaTitle_ar: 'صناديق الاستثمار المتداولة | بركة' },
    order: 12,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '13',
    slug: 'retail-consumer',
    title_en: 'Retail & Consumer',
    title_ar: 'التجزئة والمستهلك',
    description_en: 'Top retail and consumer goods companies',
    description_ar: 'أفضل شركات التجزئة والسلع الاستهلاكية',
    longDescription_en: 'Invest in the companies that power everyday consumer spending. From e-commerce giants to traditional retailers, these stocks represent the consumer economy.',
    longDescription_ar: 'استثمر في الشركات التي تغذي إنفاق المستهلك اليومي. من عمالقة التجارة الإلكترونية إلى تجار التجزئة التقليديين.',
    tickers: ['WMT', 'COST', 'AMZN', 'DIS', 'NFLX', 'MCD'],
    heroImage: '',
    icon: 'ShoppingCart',
    badges: ['Consumer', 'Defensive'],
    highlights: [
      { icon: 'ShoppingBag', title_en: 'Consumer Staples', title_ar: 'السلع الاستهلاكية', description_en: 'Essential consumer goods companies', description_ar: 'شركات السلع الاستهلاكية الأساسية' },
      { icon: 'Store', title_en: 'Retail Giants', title_ar: 'عمالقة التجزئة', description_en: 'Leading retail chains', description_ar: 'سلاسل التجزئة الرائدة' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['retail', 'consumer', 'spending'],
    seo: { metaTitle_en: 'Retail & Consumer Stocks | Baraka', metaTitle_ar: 'أسهم التجزئة والمستهلك | بركة' },
    order: 13,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '14',
    slug: 'energy',
    title_en: 'Energy & Oil',
    title_ar: 'الطاقة والنفط',
    description_en: 'Major energy and oil companies',
    description_ar: 'شركات الطاقة والنفط الكبرى',
    longDescription_en: 'Invest in the energy sector with these major oil, gas, and energy companies. From traditional oil majors to companies transitioning to clean energy.',
    longDescription_ar: 'استثمر في قطاع الطاقة مع شركات النفط والغاز والطاقة الكبرى. من شركات النفط التقليدية الكبرى إلى الشركات التي تنتقل للطاقة النظيفة.',
    tickers: ['XOM', 'CVX', 'TSLA', 'GM', 'F', 'RIVN'],
    heroImage: '',
    icon: 'Fuel',
    badges: ['Energy', 'Dividends'],
    highlights: [
      { icon: 'Flame', title_en: 'Oil & Gas', title_ar: 'النفط والغاز', description_en: 'Traditional energy companies', description_ar: 'شركات الطاقة التقليدية' },
      { icon: 'Zap', title_en: 'Clean Transition', title_ar: 'التحول النظيف', description_en: 'Companies investing in clean energy', description_ar: 'شركات تستثمر في الطاقة النظيفة' },
    ],
    sortMode: 'marketCap',
    relatedPostTags: ['energy', 'oil', 'gas'],
    seo: { metaTitle_en: 'Energy & Oil Stocks | Baraka', metaTitle_ar: 'أسهم الطاقة والنفط | بركة' },
    order: 14,
    status: 'published',
    isNew: false,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
];

// Seed Stock Collections
const seedStockCollections: StockCollection[] = [
  {
    id: '1',
    slug: 'top-by-volume',
    title_en: 'Top by Volume',
    title_ar: 'الأعلى حجماً',
    description_en: 'Most actively traded US stocks by volume',
    description_ar: 'أكثر الأسهم الأمريكية تداولاً من حيث الحجم',
    sortRule: 'volume',
    tickers: ['TSLA', 'NVDA', 'MU', 'MSFT', 'AMZN', 'AAPL', 'PLTR', 'META', 'AVGO', 'AMD', 'GOOGL', 'INTC', 'NFLX', 'APP', 'MSTR', 'HOOD', 'ORCL', 'LLY', 'JPM', 'GS', 'BA', 'CRM', 'RKLB', 'CRWV', 'UNH', 'LRCX', 'MA', 'COIN', 'AMAT', 'COST', 'ADBE', 'CVNA', 'V', 'GEV', 'WMT', 'ASTS', 'SOFI', 'CRWD', 'IBM', 'MRVL', 'JNJ', 'WDAY', 'PANW', 'TMO', 'CSCO', 'BE', 'CVX', 'MRK'],
    limit: 50,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    slug: 'trending',
    title_en: 'Trending',
    title_ar: 'الرائجة',
    description_en: 'Stocks trending on Baraka',
    description_ar: 'الأسهم الرائجة على بركة',
    sortRule: 'mostWatched',
    tickers: ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'META', 'AMD', 'PLTR', 'GOOGL'],
    limit: 10,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    slug: 'biggest-movers',
    title_en: 'Biggest Movers',
    title_ar: 'أكبر التحركات',
    description_en: 'Stocks with significant price movements today',
    description_ar: 'الأسهم ذات التحركات السعرية الكبيرة اليوم',
    sortRule: 'gainers',
    tickers: ['NVDA', 'AMD', 'TSLA', 'META', 'PLTR', 'COIN'],
    limit: 10,
    status: 'active',
    createdAt: now,
    updatedAt: now,
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
    title_en: 'Refer & Earn $30',
    title_ar: 'احل واكسب 30$',
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
    ctaUrl: 'https://getbaraka.com/subscription',
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

// Note: Blog posts now seeded from server/seedData/articles.ts (30 articles with auto-generated spotlights/newsletters)

// Helper to create stock page with defaults
function createStockPage(data: {
  id: string;
  ticker: string;
  companyName_en: string;
  companyName_ar: string;
  description_en: string;
  description_ar: string;
  sector: string;
  exchange: string;
  tags?: string[];
  relatedTickers?: string[];
}): StockPage {
  const slug = data.ticker.toLowerCase();
  return {
    id: data.id,
    ticker: data.ticker,
    slug,
    companyName_en: data.companyName_en,
    companyName_ar: data.companyName_ar,
    description_en: data.description_en,
    description_ar: data.description_ar,
    content_en: `<p>${data.description_en}</p>`,
    content_ar: `<p>${data.description_ar}</p>`,
    sector: data.sector,
    exchange: data.exchange,
    currency: 'USD',
    tags: data.tags || [],
    status: 'published',
    seo_en: {
      metaTitle: `${data.companyName_en} (${data.ticker}) Stock | Baraka`,
      metaDescription: `Trade ${data.companyName_en} (${data.ticker}) stock on Baraka. ${data.description_en}`,
      robotsIndex: true,
      robotsFollow: true,
    },
    seo_ar: {
      metaTitle: `سهم ${data.companyName_ar} (${data.ticker}) | بركة`,
      metaDescription: `تداول سهم ${data.companyName_ar} (${data.ticker}) على بركة. ${data.description_ar}`,
      robotsIndex: true,
      robotsFollow: true,
    },
    pageBuilderJson: generateDefaultPageBlocks(),
    relatedTickers: data.relatedTickers || [],
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

// Seed Stock Pages
const seedStockPages: StockPage[] = [
  createStockPage({ id: '1', ticker: 'AAPL', companyName_en: 'Apple Inc.', companyName_ar: 'شركة أبل', description_en: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.', description_ar: 'تصمم أبل وتصنع وتسوق الهواتف الذكية وأجهزة الكمبيوتر الشخصية والأجهزة اللوحية.', sector: 'Technology', exchange: 'NASDAQ', tags: ['mega-cap', 'tech', 'halal'], relatedTickers: ['MSFT', 'GOOGL', 'AMZN'] }),
  createStockPage({ id: '2', ticker: 'TSLA', companyName_en: 'Tesla, Inc.', companyName_ar: 'شركة تسلا', description_en: 'Tesla designs, develops, manufactures, and sells electric vehicles and energy storage products.', description_ar: 'تصمم تسلا وتطور وتصنع وتبيع السيارات الكهربائية ومنتجات تخزين الطاقة.', sector: 'Automotive', exchange: 'NASDAQ', tags: ['mega-cap', 'ev', 'most-active'], relatedTickers: ['RIVN', 'LCID', 'NIO'] }),
  createStockPage({ id: '3', ticker: 'NVDA', companyName_en: 'NVIDIA Corporation', companyName_ar: 'شركة إنفيديا', description_en: 'NVIDIA designs graphics processing units and system on chip units for AI and gaming.', description_ar: 'تصمم إنفيديا وحدات معالجة الرسومات للذكاء الاصطناعي والألعاب.', sector: 'Technology', exchange: 'NASDAQ', tags: ['mega-cap', 'ai', 'halal', 'most-active'], relatedTickers: ['AMD', 'AVGO', 'INTC'] }),
  createStockPage({ id: '4', ticker: 'MSFT', companyName_en: 'Microsoft Corporation', companyName_ar: 'شركة مايكروسوفت', description_en: 'Microsoft develops software, services, devices, and cloud computing solutions worldwide.', description_ar: 'تطور مايكروسوفت البرمجيات والخدمات والحوسبة السحابية في جميع أنحاء العالم.', sector: 'Technology', exchange: 'NASDAQ', tags: ['mega-cap', 'ai', 'halal'], relatedTickers: ['AAPL', 'GOOGL', 'AMZN'] }),
  createStockPage({ id: '5', ticker: 'GOOGL', companyName_en: 'Alphabet Inc.', companyName_ar: 'شركة ألفابت', description_en: 'Alphabet is the parent company of Google, specializing in search, advertising, and cloud computing.', description_ar: 'ألفابت هي الشركة الأم لجوجل، متخصصة في البحث والإعلانات والحوسبة السحابية.', sector: 'Technology', exchange: 'NASDAQ', tags: ['mega-cap', 'ai', 'halal'], relatedTickers: ['MSFT', 'META', 'AMZN'] }),
  createStockPage({ id: '6', ticker: 'AMZN', companyName_en: 'Amazon.com, Inc.', companyName_ar: 'شركة أمازون', description_en: 'Amazon is a global e-commerce and cloud computing giant.', description_ar: 'أمازون هي عملاق التجارة الإلكترونية والحوسبة السحابية العالمي.', sector: 'Technology', exchange: 'NASDAQ', tags: ['mega-cap', 'halal'], relatedTickers: ['MSFT', 'GOOGL', 'AAPL'] }),
  createStockPage({ id: '7', ticker: 'META', companyName_en: 'Meta Platforms, Inc.', companyName_ar: 'شركة ميتا بلاتفورمز', description_en: 'Meta operates social networking services including Facebook, Instagram, and WhatsApp.', description_ar: 'تدير ميتا خدمات التواصل الاجتماعي بما في ذلك فيسبوك وإنستغرام وواتساب.', sector: 'Technology', exchange: 'NASDAQ', tags: ['mega-cap'], relatedTickers: ['GOOGL', 'SNAP', 'PINS'] }),
  createStockPage({ id: '8', ticker: 'AMD', companyName_en: 'Advanced Micro Devices, Inc.', companyName_ar: 'أدفانسد مايكرو ديفايسز', description_en: 'AMD designs microprocessors and GPUs for computing and graphics markets.', description_ar: 'AMD تصمم المعالجات الدقيقة ووحدات معالجة الرسومات.', sector: 'Technology', exchange: 'NASDAQ', tags: ['ai', 'halal'], relatedTickers: ['NVDA', 'INTC'] }),
  createStockPage({ id: '9', ticker: 'AVGO', companyName_en: 'Broadcom Inc.', companyName_ar: 'شركة برودكوم', description_en: 'Broadcom designs semiconductors and infrastructure software.', description_ar: 'برودكوم تصمم أشباه الموصلات وبرمجيات البنية التحتية.', sector: 'Technology', exchange: 'NASDAQ', tags: ['ai'], relatedTickers: ['NVDA', 'QCOM'] }),
  createStockPage({ id: '10', ticker: 'LLY', companyName_en: 'Eli Lilly and Company', companyName_ar: 'شركة إيلي ليلي', description_en: 'Eli Lilly develops pharmaceuticals for diabetes, oncology, and neuroscience.', description_ar: 'إيلي ليلي تطور الأدوية لمرض السكري والأورام.', sector: 'Healthcare', exchange: 'NYSE', tags: ['halal'], relatedTickers: ['JNJ', 'MRK'] }),
  createStockPage({ id: '11', ticker: 'JPM', companyName_en: 'JPMorgan Chase & Co.', companyName_ar: 'جي بي مورغان تشيس', description_en: 'JPMorgan is a leading global financial services firm.', description_ar: 'جي بي مورغان هي شركة خدمات مالية عالمية رائدة.', sector: 'Financial Services', exchange: 'NYSE', relatedTickers: ['BAC', 'GS'] }),
  createStockPage({ id: '12', ticker: 'UNH', companyName_en: 'UnitedHealth Group Inc.', companyName_ar: 'مجموعة يونايتد هيلث', description_en: 'UnitedHealth is a healthcare and insurance company.', description_ar: 'يونايتد هيلث هي شركة رعاية صحية وتأمين.', sector: 'Healthcare', exchange: 'NYSE', relatedTickers: ['CVS', 'CI'] }),
  createStockPage({ id: '13', ticker: 'V', companyName_en: 'Visa Inc.', companyName_ar: 'شركة فيزا', description_en: 'Visa is a global payments technology company.', description_ar: 'فيزا هي شركة تكنولوجيا مدفوعات عالمية.', sector: 'Financial Services', exchange: 'NYSE', relatedTickers: ['MA', 'PYPL'] }),
  createStockPage({ id: '14', ticker: 'MA', companyName_en: 'Mastercard Incorporated', companyName_ar: 'ماستركارد', description_en: 'Mastercard is a global payment technology company.', description_ar: 'ماستركارد هي شركة تكنولوجيا دفع عالمية.', sector: 'Financial Services', exchange: 'NYSE', relatedTickers: ['V', 'PYPL'] }),
  createStockPage({ id: '15', ticker: 'JNJ', companyName_en: 'Johnson & Johnson', companyName_ar: 'جونسون آند جونسون', description_en: 'Johnson & Johnson develops pharmaceuticals and medical devices.', description_ar: 'جونسون آند جونسون تطور الأدوية والأجهزة الطبية.', sector: 'Healthcare', exchange: 'NYSE', tags: ['halal'], relatedTickers: ['PFE', 'MRK'] }),
  createStockPage({ id: '16', ticker: 'COST', companyName_en: 'Costco Wholesale Corporation', companyName_ar: 'كوستكو', description_en: 'Costco operates membership warehouse clubs.', description_ar: 'كوستكو تدير نوادي المستودعات للأعضاء.', sector: 'Consumer Goods', exchange: 'NASDAQ', relatedTickers: ['WMT', 'TGT'] }),
  createStockPage({ id: '17', ticker: 'WMT', companyName_en: 'Walmart Inc.', companyName_ar: 'وولمارت', description_en: 'Walmart is the world\'s largest retailer.', description_ar: 'وولمارت هي أكبر شركة تجزئة في العالم.', sector: 'Consumer Goods', exchange: 'NYSE', relatedTickers: ['COST', 'TGT'] }),
  createStockPage({ id: '18', ticker: 'PLTR', companyName_en: 'Palantir Technologies Inc.', companyName_ar: 'بالانتير تكنولوجيز', description_en: 'Palantir builds software platforms for data integration and analytics.', description_ar: 'بالانتير تبني منصات برمجية لتحليل البيانات.', sector: 'Technology', exchange: 'NYSE', tags: ['ai'], relatedTickers: ['SNOW', 'CRM'] }),
  createStockPage({ id: '19', ticker: 'MU', companyName_en: 'Micron Technology, Inc.', companyName_ar: 'ميكرون تكنولوجي', description_en: 'Micron produces memory and storage solutions.', description_ar: 'ميكرون تنتج حلول الذاكرة والتخزين.', sector: 'Technology', exchange: 'NASDAQ', tags: ['ai'], relatedTickers: ['AMD', 'NVDA'] }),
  createStockPage({ id: '20', ticker: 'INTC', companyName_en: 'Intel Corporation', companyName_ar: 'شركة إنتل', description_en: 'Intel designs and manufactures semiconductor chips.', description_ar: 'إنتل تصمم وتصنع رقائق أشباه الموصلات.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['AMD', 'NVDA'] }),
  createStockPage({ id: '21', ticker: 'NFLX', companyName_en: 'Netflix, Inc.', companyName_ar: 'نتفليكس', description_en: 'Netflix is a global streaming entertainment service.', description_ar: 'نتفليكس هي خدمة بث ترفيهي عالمية.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['DIS', 'WBD'] }),
  createStockPage({ id: '22', ticker: 'ORCL', companyName_en: 'Oracle Corporation', companyName_ar: 'أوراكل', description_en: 'Oracle provides enterprise software and cloud computing.', description_ar: 'أوراكل توفر برمجيات المؤسسات والحوسبة السحابية.', sector: 'Technology', exchange: 'NYSE', tags: ['ai'], relatedTickers: ['MSFT', 'CRM'] }),
  createStockPage({ id: '23', ticker: 'CRM', companyName_en: 'Salesforce, Inc.', companyName_ar: 'سيلزفورس', description_en: 'Salesforce provides cloud-based CRM software.', description_ar: 'سيلزفورس توفر برمجيات إدارة علاقات العملاء السحابية.', sector: 'Technology', exchange: 'NYSE', relatedTickers: ['ORCL', 'WDAY'] }),
  createStockPage({ id: '24', ticker: 'ADBE', companyName_en: 'Adobe Inc.', companyName_ar: 'أدوبي', description_en: 'Adobe provides creative and digital marketing software.', description_ar: 'أدوبي توفر البرمجيات الإبداعية والتسويق الرقمي.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['CRM', 'INTU'] }),
  createStockPage({ id: '25', ticker: 'GS', companyName_en: 'The Goldman Sachs Group, Inc.', companyName_ar: 'جولدمان ساكس', description_en: 'Goldman Sachs is a global investment banking and financial services company.', description_ar: 'جولدمان ساكس هي شركة خدمات مالية وبنكية استثمارية عالمية.', sector: 'Financial Services', exchange: 'NYSE', relatedTickers: ['JPM', 'MS'] }),
  createStockPage({ id: '26', ticker: 'COIN', companyName_en: 'Coinbase Global, Inc.', companyName_ar: 'كوينباس', description_en: 'Coinbase is a cryptocurrency exchange platform.', description_ar: 'كوينباس هي منصة تداول العملات المشفرة.', sector: 'Financial Services', exchange: 'NASDAQ', relatedTickers: ['HOOD', 'SQ'] }),
  createStockPage({ id: '27', ticker: 'HOOD', companyName_en: 'Robinhood Markets, Inc.', companyName_ar: 'روبنهود', description_en: 'Robinhood is a commission-free trading platform.', description_ar: 'روبنهود هي منصة تداول بدون عمولة.', sector: 'Financial Services', exchange: 'NASDAQ', relatedTickers: ['COIN', 'SCHW'] }),
  createStockPage({ id: '28', ticker: 'SOFI', companyName_en: 'SoFi Technologies, Inc.', companyName_ar: 'سوفي', description_en: 'SoFi provides digital financial services.', description_ar: 'سوفي توفر خدمات مالية رقمية.', sector: 'Financial Services', exchange: 'NASDAQ', relatedTickers: ['HOOD', 'COIN'] }),
  createStockPage({ id: '29', ticker: 'BA', companyName_en: 'The Boeing Company', companyName_ar: 'بوينغ', description_en: 'Boeing designs and manufactures commercial airplanes.', description_ar: 'بوينغ تصمم وتصنع الطائرات التجارية.', sector: 'Industrials', exchange: 'NYSE', relatedTickers: ['LMT', 'RTX'] }),
  createStockPage({ id: '30', ticker: 'MSTR', companyName_en: 'MicroStrategy Incorporated', companyName_ar: 'مايكروستراتيجي', description_en: 'MicroStrategy provides business intelligence software and holds Bitcoin.', description_ar: 'مايكروستراتيجي توفر برمجيات ذكاء الأعمال وتحتفظ بالبيتكوين.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['COIN', 'SQ'] }),
  createStockPage({ id: '31', ticker: 'RKLB', companyName_en: 'Rocket Lab USA, Inc.', companyName_ar: 'روكيت لاب', description_en: 'Rocket Lab provides launch and space systems.', description_ar: 'روكيت لاب توفر خدمات الإطلاق وأنظمة الفضاء.', sector: 'Industrials', exchange: 'NASDAQ', relatedTickers: ['SPCE', 'ASTR'] }),
  createStockPage({ id: '32', ticker: 'LRCX', companyName_en: 'Lam Research Corporation', companyName_ar: 'لام ريسيرتش', description_en: 'Lam Research provides semiconductor manufacturing equipment.', description_ar: 'لام ريسيرتش توفر معدات تصنيع أشباه الموصلات.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['AMAT', 'KLAC'] }),
  createStockPage({ id: '33', ticker: 'AMAT', companyName_en: 'Applied Materials, Inc.', companyName_ar: 'أبلايد ماتيريالز', description_en: 'Applied Materials provides equipment for semiconductor manufacturing.', description_ar: 'أبلايد ماتيريالز توفر معدات لتصنيع أشباه الموصلات.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['LRCX', 'KLAC'] }),
  createStockPage({ id: '34', ticker: 'CVNA', companyName_en: 'Carvana Co.', companyName_ar: 'كارفانا', description_en: 'Carvana is an e-commerce platform for used cars.', description_ar: 'كارفانا هي منصة تجارة إلكترونية للسيارات المستعملة.', sector: 'Consumer Goods', exchange: 'NYSE', relatedTickers: ['TSLA', 'F'] }),
  createStockPage({ id: '35', ticker: 'GEV', companyName_en: 'GE Vernova Inc.', companyName_ar: 'جي إي فيرنوفا', description_en: 'GE Vernova provides energy transition and power solutions.', description_ar: 'جي إي فيرنوفا توفر حلول انتقال الطاقة والكهرباء.', sector: 'Energy', exchange: 'NYSE', relatedTickers: ['NEE', 'ENPH'] }),
  createStockPage({ id: '36', ticker: 'ASTS', companyName_en: 'AST SpaceMobile, Inc.', companyName_ar: 'إيه إس تي سبيس موبايل', description_en: 'AST SpaceMobile builds a space-based cellular network.', description_ar: 'إيه إس تي سبيس موبايل تبني شبكة خلوية فضائية.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['RKLB', 'SPCE'] }),
  createStockPage({ id: '37', ticker: 'CRWD', companyName_en: 'CrowdStrike Holdings, Inc.', companyName_ar: 'كراود سترايك', description_en: 'CrowdStrike provides cloud-delivered cybersecurity.', description_ar: 'كراود سترايك توفر الأمن السيبراني السحابي.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['PANW', 'ZS'] }),
  createStockPage({ id: '38', ticker: 'IBM', companyName_en: 'International Business Machines Corporation', companyName_ar: 'آي بي إم', description_en: 'IBM provides hybrid cloud and AI solutions.', description_ar: 'آي بي إم توفر حلول السحابة الهجينة والذكاء الاصطناعي.', sector: 'Technology', exchange: 'NYSE', tags: ['ai'], relatedTickers: ['MSFT', 'ORCL'] }),
  createStockPage({ id: '39', ticker: 'MRVL', companyName_en: 'Marvell Technology, Inc.', companyName_ar: 'مارفل تكنولوجي', description_en: 'Marvell designs semiconductor solutions for data infrastructure.', description_ar: 'مارفل تصمم حلول أشباه الموصلات للبنية التحتية للبيانات.', sector: 'Technology', exchange: 'NASDAQ', tags: ['ai'], relatedTickers: ['AVGO', 'NVDA'] }),
  createStockPage({ id: '40', ticker: 'WDAY', companyName_en: 'Workday, Inc.', companyName_ar: 'ووركداي', description_en: 'Workday provides enterprise cloud applications for finance and HR.', description_ar: 'ووركداي توفر تطبيقات سحابية للمؤسسات للمالية والموارد البشرية.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['CRM', 'NOW'] }),
  createStockPage({ id: '41', ticker: 'PANW', companyName_en: 'Palo Alto Networks, Inc.', companyName_ar: 'بالو ألتو نتوركس', description_en: 'Palo Alto Networks provides cybersecurity solutions.', description_ar: 'بالو ألتو نتوركس توفر حلول الأمن السيبراني.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['CRWD', 'ZS'] }),
  createStockPage({ id: '42', ticker: 'TMO', companyName_en: 'Thermo Fisher Scientific Inc.', companyName_ar: 'ثيرمو فيشر ساينتيفيك', description_en: 'Thermo Fisher provides scientific instruments and laboratory equipment.', description_ar: 'ثيرمو فيشر توفر الأدوات العلمية ومعدات المختبرات.', sector: 'Healthcare', exchange: 'NYSE', relatedTickers: ['DHR', 'A'] }),
  createStockPage({ id: '43', ticker: 'CSCO', companyName_en: 'Cisco Systems, Inc.', companyName_ar: 'سيسكو', description_en: 'Cisco provides networking and IT infrastructure solutions.', description_ar: 'سيسكو توفر حلول الشبكات والبنية التحتية لتكنولوجيا المعلومات.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['JNPR', 'ANET'] }),
  createStockPage({ id: '44', ticker: 'BE', companyName_en: 'Bloom Energy Corporation', companyName_ar: 'بلوم إنرجي', description_en: 'Bloom Energy provides solid oxide fuel cell power solutions.', description_ar: 'بلوم إنرجي توفر حلول طاقة خلايا الوقود الصلب.', sector: 'Energy', exchange: 'NYSE', relatedTickers: ['PLUG', 'FCEL'] }),
  createStockPage({ id: '45', ticker: 'CVX', companyName_en: 'Chevron Corporation', companyName_ar: 'شيفرون', description_en: 'Chevron is an integrated energy company.', description_ar: 'شيفرون هي شركة طاقة متكاملة.', sector: 'Energy', exchange: 'NYSE', relatedTickers: ['XOM', 'COP'] }),
  createStockPage({ id: '46', ticker: 'MRK', companyName_en: 'Merck & Co., Inc.', companyName_ar: 'ميرك', description_en: 'Merck is a global pharmaceutical company.', description_ar: 'ميرك هي شركة أدوية عالمية.', sector: 'Healthcare', exchange: 'NYSE', tags: ['halal'], relatedTickers: ['JNJ', 'PFE'] }),
  createStockPage({ id: '47', ticker: 'CRWV', companyName_en: 'Cerebras Systems', companyName_ar: 'سيريبراس', description_en: 'Cerebras builds AI computing systems.', description_ar: 'سيريبراس تبني أنظمة حوسبة الذكاء الاصطناعي.', sector: 'Technology', exchange: 'NASDAQ', tags: ['ai'], relatedTickers: ['NVDA', 'AMD'] }),
  createStockPage({ id: '48', ticker: 'APP', companyName_en: 'AppLovin Corporation', companyName_ar: 'آبلوفين', description_en: 'AppLovin provides software solutions for mobile app developers.', description_ar: 'آبلوفين توفر حلول برمجية لمطوري تطبيقات الجوال.', sector: 'Technology', exchange: 'NASDAQ', relatedTickers: ['U', 'TTD'] }),
  createStockPage({ id: '49', ticker: 'SNAP', companyName_en: 'Snap Inc.', companyName_ar: 'سناب', description_en: 'Snap is a camera and social media company.', description_ar: 'سناب هي شركة كاميرا ووسائل التواصل الاجتماعي.', sector: 'Technology', exchange: 'NYSE', relatedTickers: ['META', 'PINS'] }),
  createStockPage({ id: '50', ticker: 'PINS', companyName_en: 'Pinterest, Inc.', companyName_ar: 'بينتريست', description_en: 'Pinterest is a visual discovery and bookmarking platform.', description_ar: 'بينتريست هي منصة اكتشاف بصري وحفظ الإشارات المرجعية.', sector: 'Technology', exchange: 'NYSE', relatedTickers: ['META', 'SNAP'] }),
  // ETFs
  createStockPage({ id: '51', ticker: 'VOO', companyName_en: 'Vanguard S&P 500 ETF', companyName_ar: 'صندوق فانجارد إس آند بي 500', description_en: 'VOO tracks the S&P 500 index, providing exposure to 500 of the largest U.S. companies across all sectors.', description_ar: 'يتتبع VOO مؤشر S&P 500، مما يوفر تعرضًا لـ 500 من أكبر الشركات الأمريكية عبر جميع القطاعات.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'index'], relatedTickers: ['SPY', 'IVV', 'VTI'] }),
  createStockPage({ id: '52', ticker: 'SPUS', companyName_en: 'SP Funds S&P 500 Sharia ETF', companyName_ar: 'صندوق SP S&P 500 الشرعي', description_en: 'SPUS tracks a Shariah-compliant version of the S&P 500, excluding companies involved in prohibited activities under Islamic law.', description_ar: 'يتتبع SPUS نسخة متوافقة مع الشريعة الإسلامية من S&P 500، باستثناء الشركات المشاركة في أنشطة محظورة بموجب الشريعة الإسلامية.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'halal', 'shariah'], relatedTickers: ['HLAL', 'UMMA', 'VOO'] }),
  createStockPage({ id: '53', ticker: 'SPY', companyName_en: 'SPDR S&P 500 ETF Trust', companyName_ar: 'صندوق SPDR S&P 500', description_en: 'SPY is the world\'s largest ETF, tracking the S&P 500 index with high liquidity and tight spreads.', description_ar: 'SPY هو أكبر صندوق ETF في العالم، يتتبع مؤشر S&P 500 بسيولة عالية وفروق أسعار ضيقة.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'index'], relatedTickers: ['VOO', 'IVV', 'QQQ'] }),
  createStockPage({ id: '54', ticker: 'QQQ', companyName_en: 'Invesco QQQ Trust', companyName_ar: 'صندوق إنفيسكو QQQ', description_en: 'QQQ tracks the Nasdaq-100 index, providing exposure to 100 of the largest non-financial companies listed on Nasdaq.', description_ar: 'يتتبع QQQ مؤشر ناسداك 100، مما يوفر تعرضًا لـ 100 من أكبر الشركات غير المالية المدرجة في ناسداك.', sector: 'ETFs', exchange: 'NASDAQ', tags: ['etf', 'tech'], relatedTickers: ['SPY', 'VOO', 'VTI'] }),
  createStockPage({ id: '55', ticker: 'IVV', companyName_en: 'iShares Core S&P 500 ETF', companyName_ar: 'صندوق آيشيرز S&P 500', description_en: 'IVV offers low-cost exposure to the S&P 500 index, representing large-cap U.S. equities.', description_ar: 'يوفر IVV تعرضًا منخفض التكلفة لمؤشر S&P 500، الذي يمثل أسهم الشركات الأمريكية الكبيرة.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'index'], relatedTickers: ['VOO', 'SPY', 'VTI'] }),
  createStockPage({ id: '56', ticker: 'VTI', companyName_en: 'Vanguard Total Stock Market ETF', companyName_ar: 'صندوق فانجارد لإجمالي سوق الأسهم', description_en: 'VTI provides broad exposure to the entire U.S. stock market, including small, mid, and large-cap stocks.', description_ar: 'يوفر VTI تعرضًا واسعًا لسوق الأسهم الأمريكي بالكامل، بما في ذلك الأسهم الصغيرة والمتوسطة والكبيرة.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'index'], relatedTickers: ['VOO', 'SPY', 'IVV'] }),
  createStockPage({ id: '57', ticker: 'HLAL', companyName_en: 'Wahed FTSE USA Shariah ETF', companyName_ar: 'صندوق واحد FTSE USA الشرعي', description_en: 'HLAL tracks U.S. equities screened for Shariah compliance, focusing on companies that meet Islamic investment principles.', description_ar: 'يتتبع HLAL الأسهم الأمريكية المفحوصة للتوافق مع الشريعة، مع التركيز على الشركات التي تلبي مبادئ الاستثمار الإسلامي.', sector: 'ETFs', exchange: 'NASDAQ', tags: ['etf', 'halal', 'shariah'], relatedTickers: ['SPUS', 'UMMA', 'SPSK'] }),
  createStockPage({ id: '58', ticker: 'SPSK', companyName_en: 'SP Funds Dow Jones Global Sukuk ETF', companyName_ar: 'صندوق SP داو جونز للصكوك العالمية', description_en: 'SPSK provides exposure to global investment-grade sukuk (Islamic bonds), offering Shariah-compliant fixed income.', description_ar: 'يوفر SPSK تعرضًا للصكوك العالمية ذات الدرجة الاستثمارية، مما يوفر دخلًا ثابتًا متوافقًا مع الشريعة.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'halal', 'shariah', 'sukuk'], relatedTickers: ['HLAL', 'SPUS', 'UMMA'] }),
  createStockPage({ id: '59', ticker: 'UMMA', companyName_en: 'Wahed Dow Jones Islamic World ETF', companyName_ar: 'صندوق واحد داو جونز الإسلامي العالمي', description_en: 'UMMA tracks global developed market equities screened for Shariah compliance, excluding the United States.', description_ar: 'يتتبع UMMA أسهم الأسواق المتقدمة العالمية المفحوصة للتوافق مع الشريعة، باستثناء الولايات المتحدة.', sector: 'ETFs', exchange: 'NASDAQ', tags: ['etf', 'halal', 'shariah', 'international'], relatedTickers: ['HLAL', 'SPUS', 'SPSK'] }),
  createStockPage({ id: '60', ticker: 'APTS', companyName_en: 'Alpha Architect 1-3 Month Box ETF', companyName_ar: 'صندوق ألفا أركيتكت 1-3 أشهر', description_en: 'APTS seeks to provide exposure to short-term U.S. Treasury securities through a box spread strategy.', description_ar: 'يسعى APTS إلى توفير تعرض لسندات الخزانة الأمريكية قصيرة الأجل من خلال استراتيجية انتشار الصندوق.', sector: 'ETFs', exchange: 'NYSE', tags: ['etf', 'treasury', 'fixed-income'], relatedTickers: ['VOO', 'VTI', 'SPY'] }),
];

// Seed Bond Pages
const seedBondPages: BondPage[] = [
  {
    id: 'bond-1',
    title_en: 'US Treasury Note 4.50% (May 2031)',
    title_ar: 'سندات الخزانة الأمريكية 4.50% (مايو 2031)',
    slug: 'us-treasury-note-4-50-may-2031',
    status: 'published',
    tags: ['government', 'usd', 'treasury'],
    featured: true,
    instrumentType: 'treasury',
    issuerType: 'sovereign',
    couponType: 'fixed',
    seniority: 'senior_unsecured',
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: true,
    isin: 'US000000SEED1',
    cusip: '000000AA1',
    countryOfRisk: 'United States',
    issuerCountry: 'United States',
    currency: 'USD',
    issueDate: '2021-05-15',
    maturityDate: '2031-05-15',
    couponRate: 4.5,
    couponFrequency: 'semi_annual',
    ytm: 4.62,
    currentYield: 4.56,
    cleanPrice: 98.75,
    dirtyPrice: 99.10,
    riskLevel: 'low',
    issuerName_en: 'United States Treasury',
    issuerName_ar: 'وزارة الخزانة الأمريكية',
    liquidityScore: 10,
    tradableOnPlatform: true,
    complianceStatus: 'pass',
    createdAt: now,
    updatedAt: now,
  } as BondPage,
  {
    id: 'bond-2',
    title_en: 'UAE Government Bond 3.90% (Oct 2030)',
    title_ar: 'سندات الحكومة الإماراتية 3.90% (أكتوبر 2030)',
    slug: 'uae-government-bond-3-90-oct-2030',
    status: 'published',
    tags: ['government', 'aed', 'mena'],
    featured: true,
    instrumentType: 'government',
    issuerType: 'sovereign',
    couponType: 'fixed',
    seniority: 'senior_unsecured',
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: true,
    isin: 'AE000000SEED2',
    countryOfRisk: 'United Arab Emirates',
    issuerCountry: 'United Arab Emirates',
    currency: 'AED',
    issueDate: '2020-10-20',
    maturityDate: '2030-10-20',
    couponRate: 3.9,
    couponFrequency: 'semi_annual',
    ytm: 3.84,
    currentYield: 3.78,
    cleanPrice: 101.25,
    riskLevel: 'low',
    issuerName_en: 'UAE Government',
    issuerName_ar: 'حكومة الإمارات',
    liquidityScore: 9,
    tradableOnPlatform: true,
    complianceStatus: 'pass',
    createdAt: now,
    updatedAt: now,
  } as BondPage,
  {
    id: 'bond-3',
    title_en: 'Saudi Corporate Bond 5.75% (Mar 2029)',
    title_ar: 'سندات شركة سعودية 5.75% (مارس 2029)',
    slug: 'saudi-corporate-bond-5-75-mar-2029',
    status: 'published',
    tags: ['corporate', 'usd', 'mena'],
    featured: false,
    instrumentType: 'corporate',
    issuerType: 'corporate',
    couponType: 'fixed',
    seniority: 'senior_unsecured',
    callable: true,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: 'SA000000SEED3',
    countryOfRisk: 'Saudi Arabia',
    issuerCountry: 'Saudi Arabia',
    currency: 'USD',
    issueDate: '2022-03-01',
    maturityDate: '2029-03-01',
    couponRate: 5.75,
    couponFrequency: 'semi_annual',
    ytm: 6.15,
    currentYield: 5.92,
    cleanPrice: 97.10,
    riskLevel: 'medium',
    issuerName_en: 'Saudi Corporate Demo',
    issuerName_ar: 'شركة سعودية تجريبية',
    liquidityScore: 6,
    tradableOnPlatform: true,
    complianceStatus: 'pass',
    createdAt: now,
    updatedAt: now,
  } as BondPage,
  {
    id: 'bond-4',
    title_en: 'Investment Grade Corporate 4.20% (Jun 2028)',
    title_ar: 'سندات شركة درجة استثمارية 4.20% (يونيو 2028)',
    slug: 'investment-grade-corp-4-20-jun-2028',
    status: 'published',
    tags: ['corporate', 'usd', 'investment-grade'],
    featured: false,
    instrumentType: 'corporate',
    issuerType: 'corporate',
    couponType: 'fixed',
    seniority: 'senior_unsecured',
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: 'US000000SEED4',
    countryOfRisk: 'United States',
    issuerCountry: 'United States',
    currency: 'USD',
    issueDate: '2023-06-15',
    maturityDate: '2028-06-15',
    couponRate: 4.20,
    couponFrequency: 'semi_annual',
    ytm: 4.38,
    currentYield: 4.28,
    cleanPrice: 99.25,
    riskLevel: 'low',
    issuerName_en: 'Investment Grade Corp',
    issuerName_ar: 'شركة درجة استثمارية',
    liquidityScore: 7,
    tradableOnPlatform: true,
    complianceStatus: 'pass',
    createdAt: now,
    updatedAt: now,
  } as BondPage,
  {
    id: 'bond-5',
    title_en: 'High Yield Corporate 7.25% (Dec 2027)',
    title_ar: 'سندات عالية العائد 7.25% (ديسمبر 2027)',
    slug: 'high-yield-corp-7-25-dec-2027',
    status: 'published',
    tags: ['corporate', 'usd', 'high-yield'],
    featured: true,
    instrumentType: 'corporate',
    issuerType: 'corporate',
    couponType: 'fixed',
    seniority: 'senior_unsecured',
    callable: true,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: 'US000000SEED5',
    countryOfRisk: 'United States',
    issuerCountry: 'United States',
    currency: 'USD',
    issueDate: '2022-12-15',
    maturityDate: '2027-12-15',
    couponRate: 7.25,
    couponFrequency: 'semi_annual',
    ytm: 8.45,
    currentYield: 7.84,
    cleanPrice: 92.30,
    riskLevel: 'high',
    issuerName_en: 'High Yield Corp Demo',
    issuerName_ar: 'شركة عالية العائد تجريبية',
    liquidityScore: 5,
    tradableOnPlatform: true,
    complianceStatus: 'pass',
    createdAt: now,
    updatedAt: now,
  } as BondPage,
  {
    id: 'bond-6',
    title_en: 'Sukuk Al-Ijara 4.80% (Sep 2032)',
    title_ar: 'صكوك الإجارة 4.80% (سبتمبر 2032)',
    slug: 'sukuk-al-ijara-4-80-sep-2032',
    status: 'published',
    tags: ['sukuk', 'usd', 'islamic'],
    featured: false,
    instrumentType: 'sukuk',
    issuerType: 'financial',
    couponType: 'fixed',
    seniority: 'senior_unsecured',
    callable: false,
    putable: false,
    convertible: false,
    guaranteed: false,
    isin: 'AE000000SEED6',
    countryOfRisk: 'United Arab Emirates',
    issuerCountry: 'United Arab Emirates',
    currency: 'USD',
    issueDate: '2022-09-01',
    maturityDate: '2032-09-01',
    couponRate: 4.80,
    couponFrequency: 'semi_annual',
    ytm: 4.65,
    currentYield: 4.55,
    cleanPrice: 101.50,
    riskLevel: 'medium',
    issuerName_en: 'Sukuk Issuer Demo',
    issuerName_ar: 'مُصدر صكوك تجريبي',
    liquidityScore: 7,
    tradableOnPlatform: true,
    complianceStatus: 'pass',
    createdAt: now,
    updatedAt: now,
  } as BondPage,
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
  imageUrl: '',
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

// Seed CTA Registry (18 CTAs)
const seedCallToActions: CallToAction[] = [
  // Discover Page Offer Banners
  {
    id: '1',
    key: 'discover.start_trading',
    text_en: 'Start Trading',
    text_ar: 'ابدأ التداول',
    url: '/signup',
    actionType: 'link',
    allowedPages: ['/discover'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    key: 'discover.invite_now',
    text_en: 'Invite Now',
    text_ar: 'ادعُ الآن',
    url: '/referral',
    actionType: 'link',
    allowedPages: ['/discover'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    key: 'discover.upgrade_now',
    text_en: 'Upgrade Now',
    text_ar: 'ترقية الآن',
    url: '/premium',
    actionType: 'link',
    allowedPages: ['/discover'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    key: 'discover.start_learning',
    text_en: 'Start Learning',
    text_ar: 'ابدأ التعلم',
    url: '/blog',
    actionType: 'link',
    allowedPages: ['/discover'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Mobile Install Banner
  {
    id: '5',
    key: 'mobile_install.download_now',
    text_en: 'Download Now',
    text_ar: 'حمّل الآن',
    url: BARAKA_STORE_URLS.ios,
    actionType: 'os_store_redirect',
    allowedPages: ['/stocks/*', '/blog/*', '/discover'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Main Sign Up CTAs
  {
    id: '6',
    key: 'main.signup_to_trade',
    text_en: 'Sign Up to Trade',
    text_ar: 'سجّل للتداول',
    url: BARAKA_STORE_URLS.ios,
    actionType: 'qr_modal',
    allowedPages: ['/stocks/*', '/stocks/themes/*', '/refer-earn', '/p/*'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '7',
    key: 'stock.trade_ticker',
    text_en: 'Trade',
    text_ar: 'تداول',
    url: BARAKA_STORE_URLS.ios,
    actionType: 'qr_modal',
    allowedPages: ['/stocks/*'],
    metaJson: { tickerAware: true },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Subscription Page CTAs
  {
    id: '8',
    key: 'landing.subscription.start_free_trial',
    text_en: 'Start Free Trial',
    text_ar: 'ابدأ التجربة المجانية',
    url: '/signup?plan=premium',
    actionType: 'link',
    allowedPages: ['/p/subscription'],
    metaJson: { plan: 'premium' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '9',
    key: 'landing.subscription.compare_plans',
    text_en: 'Compare Plans',
    text_ar: 'قارن الخطط',
    url: '#pricing',
    actionType: 'scroll_anchor',
    allowedPages: ['/p/subscription'],
    metaJson: { anchorId: 'pricing' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '10',
    key: 'landing.subscription.get_started',
    text_en: 'Get Started',
    text_ar: 'ابدأ الآن',
    url: '/signup',
    actionType: 'link',
    allowedPages: ['/p/subscription'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Zero Commission Promo
  {
    id: '11',
    key: 'landing.zero_commission.claim_offer',
    text_en: 'Claim Offer',
    text_ar: 'احصل على العرض',
    url: '/signup?promo=zero-commission',
    actionType: 'link',
    allowedPages: ['/p/zero-commission'],
    metaJson: { promo: 'zero-commission' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Education Hub
  {
    id: '12',
    key: 'landing.education_hub.browse_courses',
    text_en: 'Browse Courses',
    text_ar: 'تصفح الدورات',
    url: '/blog?category=education',
    actionType: 'link',
    allowedPages: ['/p/education-hub'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Partners Page
  {
    id: '13',
    key: 'landing.partners.become_partner',
    text_en: 'Become a Partner',
    text_ar: 'انضم كـ شريك',
    url: '#signup',
    actionType: 'scroll_anchor',
    allowedPages: ['/p/baraka-partners'],
    metaJson: { anchorId: 'signup' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '14',
    key: 'landing.partners.learn_more',
    text_en: 'Learn More',
    text_ar: 'المزيد',
    url: '#why-baraka',
    actionType: 'scroll_anchor',
    allowedPages: ['/p/baraka-partners'],
    metaJson: { anchorId: 'why-baraka' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // App Download
  {
    id: '15',
    key: 'landing.app_download.ios',
    text_en: 'Download for iOS',
    text_ar: 'حمّل لـ iOS',
    url: BARAKA_STORE_URLS.ios,
    actionType: 'link',
    allowedPages: ['/p/app-download', '/p/*'],
    metaJson: { os: 'ios' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '16',
    key: 'landing.app_download.android',
    text_en: 'Download for Android',
    text_ar: 'حمّل لـ Android',
    url: BARAKA_STORE_URLS.android,
    actionType: 'link',
    allowedPages: ['/p/app-download', '/p/*'],
    metaJson: { os: 'android' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  // Refer & Earn
  {
    id: '17',
    key: 'landing.refer_earn.get_my_link',
    text_en: 'Get My Link',
    text_ar: 'احصل على رابطي',
    url: '/app/referral',
    actionType: 'link',
    allowedPages: ['/p/refer-earn', '/refer-earn'],
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '18',
    key: 'landing.refer_earn.learn_how',
    text_en: 'Learn How It Works',
    text_ar: 'تعرف على طريقة العمل',
    url: '#how-it-works',
    actionType: 'scroll_anchor',
    allowedPages: ['/p/refer-earn', '/refer-earn'],
    metaJson: { anchorId: 'how-it-works' },
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
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
                { quote: { en: 'Integrating Baraka\'s referral tools boosted our engagement by 3×.', ar: 'أدوات الإحالة في Baraka زادت التفاعل بمقدار ثلاث مرات.' }, author: 'سارة الفارسي – Finance Insight' },
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
  {
    id: '5',
    slug: 'app-download',
    status: 'published',
    templateKey: 'appDownload',
    localeContent: {
      en: {
        title: 'Download the Baraka App',
        description: 'Trade US stocks from anywhere with the Baraka mobile app',
        sections: [
          {
            id: 'hero-app',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Mobile Trading', ar: 'التداول عبر الهاتف' },
              headline: { en: 'Trade Smarter, Anywhere', ar: 'تداول بذكاء من أي مكان' },
              subheadline: { en: 'Download the Baraka app and start investing in US stocks with zero commission.', ar: 'حمّل تطبيق بركة وابدأ الاستثمار في الأسهم الأمريكية بدون عمولة.' },
              primaryCTA: { text: { en: 'Download for iOS', ar: 'حمّل لـ iOS' }, url: 'https://apps.apple.com/baraka', variant: 'primary' },
              secondaryCTA: { text: { en: 'Download for Android', ar: 'حمّل لـ Android' }, url: 'https://play.google.com/store/apps/details?id=com.baraka', variant: 'outline' },
            },
          },
          {
            id: 'value-props-app',
            type: 'valueProps',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Use the Baraka App?', ar: 'لماذا تستخدم تطبيق بركة؟' },
              cards: [
                { icon: 'Smartphone', title: { en: 'Trade On-the-Go', ar: 'تداول أثناء التنقل' }, description: { en: 'Buy and sell stocks from your phone, anytime.', ar: 'اشترِ وبِع الأسهم من هاتفك في أي وقت.' } },
                { icon: 'Bell', title: { en: 'Real-Time Alerts', ar: 'تنبيهات فورية' }, description: { en: 'Get notified about price movements instantly.', ar: 'احصل على إشعارات فورية عن تحركات الأسعار.' } },
                { icon: 'Shield', title: { en: 'Secure & Regulated', ar: 'آمن ومنظم' }, description: { en: 'Bank-level security and regulatory compliance.', ar: 'أمان على مستوى البنوك وامتثال تنظيمي.' } },
              ],
            },
          },
          {
            id: 'features-app',
            type: 'features',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'App Features', ar: 'مميزات التطبيق' },
              features: [
                { title: { en: 'Fractional Shares', ar: 'الأسهم الجزئية' }, description: { en: 'Start investing with as little as $1.', ar: 'ابدأ الاستثمار بمبلغ دولار واحد فقط.' } },
                { title: { en: 'Halal Screening', ar: 'فحص الحلال' }, description: { en: 'Invest in Shariah-compliant stocks.', ar: 'استثمر في الأسهم المتوافقة مع الشريعة.' } },
                { title: { en: 'Advanced Charts', ar: 'رسوم بيانية متقدمة' }, description: { en: 'Technical analysis tools at your fingertips.', ar: 'أدوات التحليل الفني في متناول يدك.' } },
                { title: { en: 'Instant Deposits', ar: 'إيداعات فورية' }, description: { en: 'Fund your account and start trading immediately.', ar: 'موّل حسابك وابدأ التداول فورًا.' } },
              ],
            },
          },
          {
            id: 'footer-cta-app',
            type: 'footerCta',
            enabled: true,
            order: 3,
            data: {
              headline: { en: 'Start Trading Today', ar: 'ابدأ التداول اليوم' },
              supportingText: { en: 'Download the app and open your account in minutes.', ar: 'حمّل التطبيق وافتح حسابك في دقائق.' },
              cta: { text: { en: 'Get the App', ar: 'احصل على التطبيق' }, url: '#download', variant: 'primary' },
            },
          },
        ],
        seo: {
          metaTitle: 'Download Baraka App | Trade US Stocks',
          metaDescription: 'Download the Baraka mobile app for iOS and Android. Trade US stocks commission-free from anywhere.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
      ar: {
        title: 'حمّل تطبيق بركة',
        description: 'تداول الأسهم الأمريكية من أي مكان مع تطبيق بركة',
        sections: [
          {
            id: 'hero-app',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Mobile Trading', ar: 'التداول عبر الهاتف' },
              headline: { en: 'Trade Smarter, Anywhere', ar: 'تداول بذكاء من أي مكان' },
              subheadline: { en: 'Download the Baraka app and start investing in US stocks with zero commission.', ar: 'حمّل تطبيق بركة وابدأ الاستثمار في الأسهم الأمريكية بدون عمولة.' },
              primaryCTA: { text: { en: 'Download for iOS', ar: 'حمّل لـ iOS' }, url: 'https://apps.apple.com/baraka', variant: 'primary' },
              secondaryCTA: { text: { en: 'Download for Android', ar: 'حمّل لـ Android' }, url: 'https://play.google.com/store/apps/details?id=com.baraka', variant: 'outline' },
            },
          },
          {
            id: 'value-props-app',
            type: 'valueProps',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Use the Baraka App?', ar: 'لماذا تستخدم تطبيق بركة؟' },
              cards: [
                { icon: 'Smartphone', title: { en: 'Trade On-the-Go', ar: 'تداول أثناء التنقل' }, description: { en: 'Buy and sell stocks from your phone, anytime.', ar: 'اشترِ وبِع الأسهم من هاتفك في أي وقت.' } },
                { icon: 'Bell', title: { en: 'Real-Time Alerts', ar: 'تنبيهات فورية' }, description: { en: 'Get notified about price movements instantly.', ar: 'احصل على إشعارات فورية عن تحركات الأسعار.' } },
                { icon: 'Shield', title: { en: 'Secure & Regulated', ar: 'آمن ومنظم' }, description: { en: 'Bank-level security and regulatory compliance.', ar: 'أمان على مستوى البنوك وامتثال تنظيمي.' } },
              ],
            },
          },
          {
            id: 'features-app',
            type: 'features',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'App Features', ar: 'مميزات التطبيق' },
              features: [
                { title: { en: 'Fractional Shares', ar: 'الأسهم الجزئية' }, description: { en: 'Start investing with as little as $1.', ar: 'ابدأ الاستثمار بمبلغ دولار واحد فقط.' } },
                { title: { en: 'Halal Screening', ar: 'فحص الحلال' }, description: { en: 'Invest in Shariah-compliant stocks.', ar: 'استثمر في الأسهم المتوافقة مع الشريعة.' } },
                { title: { en: 'Advanced Charts', ar: 'رسوم بيانية متقدمة' }, description: { en: 'Technical analysis tools at your fingertips.', ar: 'أدوات التحليل الفني في متناول يدك.' } },
                { title: { en: 'Instant Deposits', ar: 'إيداعات فورية' }, description: { en: 'Fund your account and start trading immediately.', ar: 'موّل حسابك وابدأ التداول فورًا.' } },
              ],
            },
          },
          {
            id: 'footer-cta-app',
            type: 'footerCta',
            enabled: true,
            order: 3,
            data: {
              headline: { en: 'Start Trading Today', ar: 'ابدأ التداول اليوم' },
              supportingText: { en: 'Download the app and open your account in minutes.', ar: 'حمّل التطبيق وافتح حسابك في دقائق.' },
              cta: { text: { en: 'Get the App', ar: 'احصل على التطبيق' }, url: '#download', variant: 'primary' },
            },
          },
        ],
        seo: {
          metaTitle: 'حمّل تطبيق بركة | تداول الأسهم الأمريكية',
          metaDescription: 'حمّل تطبيق بركة للهاتف على iOS وAndroid. تداول الأسهم الأمريكية بدون عمولة من أي مكان.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
    },
    settings: {
      headerVariant: 'minimal',
      footerVariant: 'minimal',
    },
    publishedAt: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '6',
    slug: 'referral-program',
    status: 'published',
    templateKey: 'promoOffer',
    localeContent: {
      en: {
        title: 'Refer Friends & Earn Rewards',
        description: 'Invite friends to Baraka and earn cash rewards for every successful referral',
        sections: [
          {
            id: 'hero-referral',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Referral Program', ar: 'برنامج الإحالة' },
              headline: { en: 'Invite Friends. Earn Up to $30 Each.', ar: 'ادعُ أصدقاءك. اكسب حتى 30$ لكل منهم.' },
              subheadline: { en: 'Share your referral link and earn cash rewards when your friends sign up and fund their account.', ar: 'شارك رابط الإحالة الخاص بك واكسب مكافآت نقدية عندما يسجل أصدقاؤك ويموّلون حساباتهم.' },
              primaryCTA: { text: { en: 'Get My Link', ar: 'احصل على رابطي' }, url: '/app/referral', variant: 'primary' },
              secondaryCTA: { text: { en: 'Learn How It Works', ar: 'تعرف على طريقة العمل' }, url: '#how-it-works', variant: 'outline' },
            },
          },
          {
            id: 'value-props-referral',
            type: 'valueProps',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Refer Friends?', ar: 'لماذا تحيل أصدقاءك؟' },
              cards: [
                { icon: 'Gift', title: { en: 'Earn Cash Rewards', ar: 'اكسب مكافآت نقدية' }, description: { en: 'Get up to $30 for each friend who joins.', ar: 'احصل على ما يصل إلى 30$ لكل صديق ينضم.' } },
                { icon: 'Users', title: { en: 'Unlimited Referrals', ar: 'إحالات غير محدودة' }, description: { en: 'No limit on how many friends you can invite.', ar: 'لا حدود لعدد الأصدقاء الذين يمكنك دعوتهم.' } },
                { icon: 'Zap', title: { en: 'Fast Payouts', ar: 'دفعات سريعة' }, description: { en: 'Rewards credited within 48 hours of qualification.', ar: 'تُضاف المكافآت خلال 48 ساعة من التأهل.' } },
              ],
            },
          },
          {
            id: 'content-how-it-works',
            type: 'content',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'How It Works', ar: 'كيف يعمل البرنامج' },
              richText: {
                en: '<ol><li><strong>Share your link</strong> - Get your unique referral link from the Baraka app.</li><li><strong>Friend signs up</strong> - Your friend creates an account using your link.</li><li><strong>Friend funds account</strong> - They deposit a minimum of $100.</li><li><strong>Both earn rewards</strong> - You both receive cash rewards!</li></ol>',
                ar: '<ol><li><strong>شارك رابطك</strong> - احصل على رابط الإحالة الفريد من تطبيق بركة.</li><li><strong>صديقك يسجل</strong> - ينشئ صديقك حسابًا باستخدام رابطك.</li><li><strong>صديقك يموّل الحساب</strong> - يودع حدًا أدنى 100$.</li><li><strong>كلاكما يكسب</strong> - تحصلان معًا على مكافآت نقدية!</li></ol>',
              },
            },
          },
          {
            id: 'faq-referral',
            type: 'faq',
            enabled: true,
            order: 3,
            data: {
              title: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
              items: [
                { question: { en: 'How much can I earn per referral?', ar: 'كم يمكنني أن أكسب لكل إحالة؟' }, answer: { en: 'You can earn up to $30 per successful referral, depending on your friend\'s account activity.', ar: 'يمكنك كسب ما يصل إلى 30$ لكل إحالة ناجحة، حسب نشاط حساب صديقك.' } },
                { question: { en: 'Is there a limit to referrals?', ar: 'هل هناك حد للإحالات؟' }, answer: { en: 'No! You can refer as many friends as you want.', ar: 'لا! يمكنك إحالة عدد غير محدود من الأصدقاء.' } },
                { question: { en: 'When do I receive my reward?', ar: 'متى أتلقى مكافأتي؟' }, answer: { en: 'Rewards are credited within 48 hours after your friend qualifies.', ar: 'تُضاف المكافآت خلال 48 ساعة بعد تأهل صديقك.' } },
              ],
            },
          },
          {
            id: 'footer-cta-referral',
            type: 'footerCta',
            enabled: true,
            order: 4,
            data: {
              headline: { en: 'Start Earning Today', ar: 'ابدأ الكسب اليوم' },
              supportingText: { en: 'Share your link and watch your rewards grow.', ar: 'شارك رابطك وشاهد مكافآتك تنمو.' },
              cta: { text: { en: 'Get My Referral Link', ar: 'احصل على رابط الإحالة' }, url: '/app/referral', variant: 'primary' },
            },
          },
        ],
        seo: {
          metaTitle: 'Refer Friends & Earn $30 | Baraka',
          metaDescription: 'Invite friends to Baraka and earn up to $30 for each successful referral. Unlimited referrals, fast payouts.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
      ar: {
        title: 'احل أصدقاءك واكسب المكافآت',
        description: 'ادعُ أصدقاءك إلى بركة واكسب مكافآت نقدية لكل إحالة ناجحة',
        sections: [
          {
            id: 'hero-referral',
            type: 'hero',
            enabled: true,
            order: 0,
            data: {
              eyebrowText: { en: 'Referral Program', ar: 'برنامج الإحالة' },
              headline: { en: 'Invite Friends. Earn Up to $30 Each.', ar: 'ادعُ أصدقاءك. اكسب حتى 30$ لكل منهم.' },
              subheadline: { en: 'Share your referral link and earn cash rewards when your friends sign up and fund their account.', ar: 'شارك رابط الإحالة الخاص بك واكسب مكافآت نقدية عندما يسجل أصدقاؤك ويموّلون حساباتهم.' },
              primaryCTA: { text: { en: 'Get My Link', ar: 'احصل على رابطي' }, url: '/app/referral', variant: 'primary' },
              secondaryCTA: { text: { en: 'Learn How It Works', ar: 'تعرف على طريقة العمل' }, url: '#how-it-works', variant: 'outline' },
            },
          },
          {
            id: 'value-props-referral',
            type: 'valueProps',
            enabled: true,
            order: 1,
            data: {
              title: { en: 'Why Refer Friends?', ar: 'لماذا تحيل أصدقاءك؟' },
              cards: [
                { icon: 'Gift', title: { en: 'Earn Cash Rewards', ar: 'اكسب مكافآت نقدية' }, description: { en: 'Get up to $30 for each friend who joins.', ar: 'احصل على ما يصل إلى 30$ لكل صديق ينضم.' } },
                { icon: 'Users', title: { en: 'Unlimited Referrals', ar: 'إحالات غير محدودة' }, description: { en: 'No limit on how many friends you can invite.', ar: 'لا حدود لعدد الأصدقاء الذين يمكنك دعوتهم.' } },
                { icon: 'Zap', title: { en: 'Fast Payouts', ar: 'دفعات سريعة' }, description: { en: 'Rewards credited within 48 hours of qualification.', ar: 'تُضاف المكافآت خلال 48 ساعة من التأهل.' } },
              ],
            },
          },
          {
            id: 'content-how-it-works',
            type: 'content',
            enabled: true,
            order: 2,
            data: {
              title: { en: 'How It Works', ar: 'كيف يعمل البرنامج' },
              richText: {
                en: '<ol><li><strong>Share your link</strong> - Get your unique referral link from the Baraka app.</li><li><strong>Friend signs up</strong> - Your friend creates an account using your link.</li><li><strong>Friend funds account</strong> - They deposit a minimum of $100.</li><li><strong>Both earn rewards</strong> - You both receive cash rewards!</li></ol>',
                ar: '<ol><li><strong>شارك رابطك</strong> - احصل على رابط الإحالة الفريد من تطبيق بركة.</li><li><strong>صديقك يسجل</strong> - ينشئ صديقك حسابًا باستخدام رابطك.</li><li><strong>صديقك يموّل الحساب</strong> - يودع حدًا أدنى 100$.</li><li><strong>كلاكما يكسب</strong> - تحصلان معًا على مكافآت نقدية!</li></ol>',
              },
            },
          },
          {
            id: 'faq-referral',
            type: 'faq',
            enabled: true,
            order: 3,
            data: {
              title: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
              items: [
                { question: { en: 'How much can I earn per referral?', ar: 'كم يمكنني أن أكسب لكل إحالة؟' }, answer: { en: 'You can earn up to $30 per successful referral, depending on your friend\'s account activity.', ar: 'يمكنك كسب ما يصل إلى 30$ لكل إحالة ناجحة، حسب نشاط حساب صديقك.' } },
                { question: { en: 'Is there a limit to referrals?', ar: 'هل هناك حد للإحالات؟' }, answer: { en: 'No! You can refer as many friends as you want.', ar: 'لا! يمكنك إحالة عدد غير محدود من الأصدقاء.' } },
                { question: { en: 'When do I receive my reward?', ar: 'متى أتلقى مكافأتي؟' }, answer: { en: 'Rewards are credited within 48 hours after your friend qualifies.', ar: 'تُضاف المكافآت خلال 48 ساعة بعد تأهل صديقك.' } },
              ],
            },
          },
          {
            id: 'footer-cta-referral',
            type: 'footerCta',
            enabled: true,
            order: 4,
            data: {
              headline: { en: 'Start Earning Today', ar: 'ابدأ الكسب اليوم' },
              supportingText: { en: 'Share your link and watch your rewards grow.', ar: 'شارك رابطك وشاهد مكافآتك تنمو.' },
              cta: { text: { en: 'Get My Referral Link', ar: 'احصل على رابط الإحالة' }, url: '/app/referral', variant: 'primary' },
            },
          },
        ],
        seo: {
          metaTitle: 'احل أصدقاءك واكسب 30$ | بركة',
          metaDescription: 'ادعُ أصدقاءك إلى بركة واكسب ما يصل إلى 30$ لكل إحالة ناجحة. إحالات غير محدودة ودفعات سريعة.',
          robotsIndex: true,
          robotsFollow: true,
        },
      },
    },
    settings: {
      headerVariant: 'minimal',
      footerVariant: 'minimal',
    },
    publishedAt: '2024-01-20T00:00:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
];

// ============================================
// NEWSLETTER + SPOTLIGHT + BLOG SYNC SEED DATA
// ============================================

// Seed Schema Blocks (reusable content modules)
const seedSchemaBlocks: SchemaBlock[] = [
  {
    id: '1',
    name: 'Hero Banner',
    description: 'Main hero section with title and image',
    type: 'hero',
    locale: 'global',
    defaultConfig: { label: 'Hero Banner', required: true },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    name: 'Introduction',
    description: 'Text introduction section',
    type: 'introduction',
    locale: 'global',
    defaultConfig: { label: 'Introduction', required: true },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    name: 'Featured Content',
    description: 'Highlighted content section',
    type: 'featured_content',
    locale: 'global',
    defaultConfig: { label: 'Featured Content', required: false },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    name: 'Article List',
    description: 'List of articles with excerpts',
    type: 'articles_list',
    locale: 'global',
    defaultConfig: { label: 'Article List', required: false },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '5',
    name: 'Call to Action',
    description: 'CTA button section',
    type: 'call_to_action',
    locale: 'global',
    defaultConfig: { label: 'Call to Action', required: true },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '6',
    name: 'Footer',
    description: 'Newsletter footer with legal text',
    type: 'footer',
    locale: 'global',
    defaultConfig: { label: 'Footer', required: true },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '7',
    name: 'Stock Collection',
    description: 'Display a collection of stocks',
    type: 'stock_collection',
    locale: 'global',
    defaultConfig: { label: 'Stock Collection', required: false, tickers: [] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '8',
    name: 'Assets Under $500',
    description: 'Stocks priced under $500',
    type: 'assets_under_500',
    locale: 'global',
    defaultConfig: { label: 'Assets Under $500', required: false },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '9',
    name: 'User Picks',
    description: 'Popular user stock picks',
    type: 'what_users_picked',
    locale: 'global',
    defaultConfig: { label: 'User Picks', required: false },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '10',
    name: 'Asset Highlight',
    description: 'Spotlight on a specific asset',
    type: 'asset_highlight',
    locale: 'global',
    defaultConfig: { label: 'Asset Highlight', required: false, tickers: [] },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '11',
    name: 'Term of the Day',
    description: 'Educational term with definition',
    type: 'term_of_the_day',
    locale: 'global',
    defaultConfig: { label: 'Term of the Day', required: false, term: '', termDefinition: '' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '12',
    name: 'In Other News',
    description: 'Additional news items',
    type: 'in_other_news',
    locale: 'global',
    defaultConfig: { label: 'In Other News', required: false, newsItems: [] },
    createdAt: now,
    updatedAt: now,
  },
];

// Seed data for Ticker Catalog
const seedTickerCatalog: TickerCatalogEntry[] = [
  { id: 't1', ticker: 'AAPL', displayName: 'Apple Inc.', category: 'Technology', createdAt: now, updatedAt: now },
  { id: 't2', ticker: 'TSLA', displayName: 'Tesla Inc.', category: 'Automotive', createdAt: now, updatedAt: now },
  { id: 't3', ticker: 'NVDA', displayName: 'NVIDIA Corporation', category: 'Technology', createdAt: now, updatedAt: now },
  { id: 't4', ticker: 'MSFT', displayName: 'Microsoft Corporation', category: 'Technology', createdAt: now, updatedAt: now },
  { id: 't5', ticker: 'AMZN', displayName: 'Amazon.com Inc.', category: 'E-Commerce', createdAt: now, updatedAt: now },
];

// Seed data for Block Library Templates
const seedBlockLibraryTemplates: BlockLibraryTemplate[] = [
  {
    id: 'bl1',
    name: 'Top Traded Stocks',
    blockType: 'stock_collection',
    blockDataJson: {
      title: 'Top Traded Stocks',
      description: 'The most actively traded stocks this week',
      stocks: [
        { ticker: 'AAPL', companyName: 'Apple Inc.' },
        { ticker: 'TSLA', companyName: 'Tesla Inc.' },
        { ticker: 'NVDA', companyName: 'NVIDIA Corporation' },
      ],
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'bl2',
    name: 'Call to Action Banner',
    blockType: 'call_to_action',
    blockDataJson: {
      title: 'Start Investing Today',
      body: 'Open your account and get started with as little as $5',
      buttonText: 'Get Started',
      buttonUrl: 'https://baraka.com/signup',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'bl3',
    name: 'Market Introduction',
    blockType: 'introduction',
    blockDataJson: {
      title: 'Weekly Market Update',
      subtitle: 'Your guide to this week\'s market movements',
      body: 'Welcome to this week\'s market update. Here\'s what you need to know about the latest trends in US stocks.',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'bl4',
    name: 'Featured Article',
    blockType: 'featured_content',
    blockDataJson: {
      title: 'Featured Story',
      imageUrl: 'https://example.com/featured.jpg',
      articles: [
        { title: 'AI Stocks Surge Amid Earnings Season', excerpt: 'Tech giants report strong AI revenue growth...' },
      ],
    },
    createdAt: now,
    updatedAt: now,
  },
];

const seedNewsletterTemplates: NewsletterTemplate[] = [
  {
    id: '1',
    name: 'Default English Newsletter',
    description: 'Standard newsletter template for English audience',
    locale: 'en',
    zones: [
      { zone: 'header', allowedBlockTypes: ['hero'], maxBlocks: 1 },
      { zone: 'body', allowedBlockTypes: ['introduction', 'featured_content', 'articles_list', 'stock_collection', 'assets_under_500', 'what_users_picked', 'asset_highlight', 'term_of_the_day', 'in_other_news'], maxBlocks: 10 },
      { zone: 'footer', allowedBlockTypes: ['call_to_action', 'footer'], maxBlocks: 2 },
    ],
    htmlWrapper: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family: Arial, sans-serif;">{{content}}</body></html>`,
    defaultValuesJson: {
      heroTitle: 'Weekly Market Update',
      ctaText: 'Start Investing',
      ctaUrl: 'https://baraka.com/signup',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    name: 'Default Arabic Newsletter',
    description: 'Standard newsletter template for Arabic audience',
    locale: 'ar',
    zones: [
      { zone: 'header', allowedBlockTypes: ['hero'], maxBlocks: 1 },
      { zone: 'body', allowedBlockTypes: ['introduction', 'featured_content', 'articles_list', 'stock_collection', 'assets_under_500', 'what_users_picked', 'asset_highlight', 'term_of_the_day', 'in_other_news'], maxBlocks: 10 },
      { zone: 'footer', allowedBlockTypes: ['call_to_action', 'footer'], maxBlocks: 2 },
    ],
    htmlWrapper: `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"></head><body style="font-family: 'Segoe UI', Tahoma, sans-serif;">{{content}}</body></html>`,
    defaultValuesJson: {
      heroTitle: 'تحديث السوق الأسبوعي',
      ctaText: 'ابدأ الاستثمار',
      ctaUrl: 'https://baraka.com/signup',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    name: 'Global Promotional Template',
    description: 'Promotional template for special offers in both languages',
    locale: 'global',
    zones: [
      { zone: 'header', allowedBlockTypes: ['hero'], maxBlocks: 1 },
      { zone: 'body', allowedBlockTypes: ['featured_content', 'articles_list'], maxBlocks: 5 },
      { zone: 'footer', allowedBlockTypes: ['call_to_action', 'footer'], maxBlocks: 2 },
    ],
    htmlWrapper: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family: Arial, sans-serif; background: #f5f5f5;">{{content}}</body></html>`,
    defaultValuesJson: {
      heroTitle: 'Special Offer',
      ctaText: 'Claim Now',
    },
    createdAt: now,
    updatedAt: now,
  },
];

const seedNewsletters: Newsletter[] = [
  {
    id: '1',
    subject: 'Weekly Market Insights: Top Movers This Week',
    preheader: 'See which stocks are trending and learn from our experts',
    templateId: '1',
    contentBlocks: [
      { type: 'hero', title: 'Weekly Market Insights', imageUrl: '/images/newsletter-hero.jpg' },
      { type: 'introduction', content: 'Welcome to this week\'s market update. Here\'s what you need to know about the latest trends in US stocks.' },
      { type: 'articles_list', articles: [
        { title: 'AI Stocks Surge Amid Earnings Season', excerpt: 'Tech giants report strong AI revenue growth...', url: '/blog/ai-stocks-surge' },
        { title: 'What the Fed Decision Means for Investors', excerpt: 'Rate pause signals continued growth...', url: '/blog/fed-decision' },
      ]},
      { type: 'call_to_action', ctaText: 'Start Investing Today', ctaUrl: 'https://baraka.com/signup' },
      { type: 'footer', content: 'You received this email because you subscribed to Baraka newsletters.' },
    ],
    htmlOutput: '<html><!-- Generated HTML --></html>',
    status: 'sent',
    sentAt: '2024-01-15T10:00:00Z',
    locale: 'en',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    subject: 'تحديث السوق الأسبوعي: أبرز التحركات',
    preheader: 'اكتشف الأسهم الرائجة وتعلم من خبرائنا',
    templateId: '2',
    contentBlocks: [
      { type: 'hero', title: 'تحديث السوق الأسبوعي', imageUrl: '/images/newsletter-hero-ar.jpg' },
      { type: 'introduction', content: 'مرحباً بك في تحديث السوق لهذا الأسبوع. إليك ما تحتاج معرفته عن أحدث الاتجاهات في الأسهم الأمريكية.' },
      { type: 'call_to_action', ctaText: 'ابدأ الاستثمار اليوم', ctaUrl: 'https://baraka.com/signup' },
    ],
    htmlOutput: '<html dir="rtl"><!-- Generated HTML --></html>',
    status: 'sent',
    sentAt: '2024-01-15T10:30:00Z',
    locale: 'ar',
    createdAt: '2024-01-14T08:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '3',
    subject: 'New Blog Post: Understanding Halal Investing',
    preheader: 'Learn the fundamentals of Shariah-compliant investing',
    templateId: '1',
    contentBlocks: [
      { type: 'hero', title: 'New on the Blog', imageUrl: '/images/halal-investing.jpg' },
      { type: 'featured_content', title: 'Understanding Halal Investing', content: 'A comprehensive guide to Shariah-compliant stock selection...', imageUrl: '/images/halal-guide.jpg' },
      { type: 'call_to_action', ctaText: 'Read Full Article', ctaUrl: '/blog/understanding-halal-investing' },
    ],
    htmlOutput: '',
    status: 'draft',
    sourceBlogPostId: '1',
    locale: 'en',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  },
];

const seedSpotlightBanners: SpotlightBanner[] = [
  {
    id: '1',
    title: 'New: AI Stocks Theme',
    subtitle: 'Discover top AI companies trending on the market',
    imageUrl: '/attached_assets/generated_images/tech_sector_market_analysis.png',
    ctaText: 'Explore Theme',
    ctaUrl: '/stocks/themes/ai-leaders',
    appDeepLink: 'baraka://stocks/themes/ai-leaders',
    placements: ['home', 'discover'],
    status: 'active',
    sourceType: 'manual',
    locale: 'en',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '2',
    title: 'جديد: موضوع الذكاء الاصطناعي',
    subtitle: 'اكتشف أفضل شركات الذكاء الاصطناعي الرائجة',
    imageUrl: '/attached_assets/generated_images/tech_sector_market_analysis.png',
    ctaText: 'استكشف الموضوع',
    ctaUrl: '/stocks/themes/ai-leaders',
    appDeepLink: 'baraka://stocks/themes/ai-leaders',
    placements: ['home', 'discover'],
    status: 'active',
    sourceType: 'manual',
    locale: 'ar',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '3',
    title: 'Weekly Market Update',
    subtitle: 'Check out our latest analysis and insights',
    imageUrl: '/attached_assets/generated_images/beginner_stock_investing_guide.png',
    ctaText: 'Read Now',
    ctaUrl: '/blog/weekly-market-update',
    appDeepLink: 'baraka://blog/weekly-market-update',
    placements: ['blog', 'discover'],
    startAt: '2024-01-01T00:00:00Z',
    endAt: '2024-12-31T23:59:59Z',
    status: 'active',
    sourceType: 'from_blog',
    blogPostId: '1',
    locale: 'en',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '4',
    title: 'Zero Commission Offer',
    subtitle: 'Trade commission-free for 30 days',
    imageUrl: '/images/promo-spotlight.jpg',
    ctaText: 'Claim Offer',
    ctaUrl: '/p/stocks-offer',
    placements: ['home', 'stock'],
    status: 'active',
    sourceType: 'manual',
    locale: 'en',
    createdAt: now,
    updatedAt: now,
  },
];

const seedNewsletterSettings: NewsletterSettings = {
  id: '1',
  defaultTemplateId_en: '1',
  defaultTemplateId_ar: '2',
  websiteBaseUrl: 'https://baraka.com',
  appDeepLinkBase: 'baraka://app',
  autoActivateSpotlightOnPublish: true,
  defaultSpotlightPlacements: ['home', 'discover'],
  defaultCtaText_en: 'Read More',
  defaultCtaText_ar: 'اقرأ المزيد',
  brandLogoUrl: '/images/baraka-logo.png',
  emailSenderName: 'Baraka',
  emailSenderEmail: 'newsletter@baraka.com',
  updatedAt: now,
};

const seedSubscribers: Subscriber[] = [
  { id: '1', email: 'john.doe@example.com', locale: 'en', status: 'active', tags: ['early-adopter', 'premium'], createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: '2', email: 'jane.smith@example.com', locale: 'en', status: 'active', tags: ['investor', 'halal'], createdAt: '2024-01-02T11:00:00Z', updatedAt: '2024-01-02T11:00:00Z' },
  { id: '3', email: 'ahmed.ali@example.com', locale: 'ar', status: 'active', tags: ['mena', 'tech-stocks'], createdAt: '2024-01-03T12:00:00Z', updatedAt: '2024-01-03T12:00:00Z' },
  { id: '4', email: 'fatima.hassan@example.com', locale: 'ar', status: 'active', tags: ['halal', 'beginner'], createdAt: '2024-01-04T09:00:00Z', updatedAt: '2024-01-04T09:00:00Z' },
  { id: '5', email: 'michael.brown@example.com', locale: 'en', status: 'active', tags: ['dividend-investor'], createdAt: '2024-01-05T08:00:00Z', updatedAt: '2024-01-05T08:00:00Z' },
  { id: '6', email: 'sarah.wilson@example.com', locale: 'en', status: 'unsubscribed', tags: ['trial-user'], createdAt: '2024-01-06T14:00:00Z', updatedAt: '2024-01-10T14:00:00Z', unsubscribedAt: '2024-01-10T14:00:00Z' },
  { id: '7', email: 'omar.khalil@example.com', locale: 'ar', status: 'active', tags: ['premium', 'active-trader'], createdAt: '2024-01-07T15:00:00Z', updatedAt: '2024-01-07T15:00:00Z' },
  { id: '8', email: 'lisa.chen@example.com', locale: 'en', status: 'active', tags: ['tech-stocks', 'ai-investor'], createdAt: '2024-01-08T16:00:00Z', updatedAt: '2024-01-08T16:00:00Z' },
  { id: '9', email: 'khalid.rahman@example.com', locale: 'ar', status: 'active', tags: ['halal', 'long-term'], createdAt: '2024-01-09T10:30:00Z', updatedAt: '2024-01-09T10:30:00Z' },
  { id: '10', email: 'emma.johnson@example.com', locale: 'en', status: 'active', tags: ['beginner', 'etf-investor'], createdAt: '2024-01-10T11:30:00Z', updatedAt: '2024-01-10T11:30:00Z' },
  { id: '11', email: 'yusuf.mohammed@example.com', locale: 'ar', status: 'active', tags: ['premium', 'halal'], createdAt: '2024-01-11T09:45:00Z', updatedAt: '2024-01-11T09:45:00Z' },
  { id: '12', email: 'david.miller@example.com', locale: 'en', status: 'active', tags: ['dividend-investor', 'value'], createdAt: '2024-01-12T13:00:00Z', updatedAt: '2024-01-12T13:00:00Z' },
  { id: '13', email: 'aisha.mahmoud@example.com', locale: 'ar', status: 'active', tags: ['mena', 'growth'], createdAt: '2024-01-13T14:30:00Z', updatedAt: '2024-01-13T14:30:00Z' },
  { id: '14', email: 'robert.taylor@example.com', locale: 'en', status: 'unsubscribed', tags: ['inactive'], createdAt: '2024-01-14T08:15:00Z', updatedAt: '2024-01-18T08:15:00Z', unsubscribedAt: '2024-01-18T08:15:00Z' },
  { id: '15', email: 'noor.abdullah@example.com', locale: 'ar', status: 'active', tags: ['halal', 'premium', 'active-trader'], createdAt: '2024-01-15T17:00:00Z', updatedAt: '2024-01-15T17:00:00Z' },
];

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createPriceAlertSubscription(subscription: InsertPriceAlertSubscription): Promise<PriceAlertSubscription>;
  getPriceAlertSubscriptions(): Promise<PriceAlertSubscription[]>;
  
  createStockWatchSubscription(subscription: InsertStockWatchSubscription): Promise<StockWatchSubscription>;
  getStockWatchSubscriptions(): Promise<StockWatchSubscription[]>;
  
  createNewsletterSignup(signup: InsertNewsletterSignup): Promise<NewsletterSignup>;
  getNewsletterSignups(): Promise<NewsletterSignup[]>;
  
  getDiscoverSettings(): Promise<DiscoverSettings>;
  updateDiscoverSettings(settings: Partial<DiscoverSettings>): Promise<DiscoverSettings>;
  
  getStockThemes(): Promise<StockTheme[]>;
  getStockTheme(id: string): Promise<StockTheme | undefined>;
  getStockThemeBySlug(slug: string): Promise<StockTheme | undefined>;
  createStockTheme(theme: InsertStockTheme): Promise<StockTheme>;
  updateStockTheme(id: string, theme: Partial<StockTheme>): Promise<StockTheme | undefined>;
  deleteStockTheme(id: string): Promise<boolean>;
  
  getStockCollections(): Promise<StockCollection[]>;
  getStockCollection(id: string): Promise<StockCollection | undefined>;
  getStockCollectionBySlug(slug: string): Promise<StockCollection | undefined>;
  
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
  
  // Asset Links (curated stock collections)
  getAssetLinks(collectionKey: string): Promise<AssetLink[]>;
  getAssetLink(id: string): Promise<AssetLink | undefined>;
  createAssetLink(link: InsertAssetLink): Promise<AssetLink>;
  updateAssetLink(id: string, link: Partial<AssetLink>): Promise<AssetLink | undefined>;
  deleteAssetLink(id: string): Promise<boolean>;
  
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
  getTrafficTimeSeries(dateRange: { start: string; end: string }, filter: 'all' | 'stocks' | 'blogs'): Promise<TrafficTimeSeries>;
  
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
  
  // App Download Config
  getAppDownloadConfig(): Promise<AppDownloadConfig>;
  updateAppDownloadConfig(config: Partial<AppDownloadConfig>): Promise<AppDownloadConfig>;
  
  // CTA Registry
  getCallToActions(): Promise<CallToAction[]>;
  getCallToAction(id: string): Promise<CallToAction | undefined>;
  getCallToActionByKey(key: string): Promise<CallToAction | undefined>;
  createCallToAction(cta: InsertCallToAction): Promise<CallToAction>;
  updateCallToAction(id: string, cta: Partial<CallToAction>): Promise<CallToAction | undefined>;
  deleteCallToAction(id: string): Promise<boolean>;
  
  // CTA Events
  createCTAEvent(event: InsertCTAEvent): Promise<CTAEvent>;
  getCTAEvents(filters?: { ctaKey?: string; eventType?: string; startDate?: string; endDate?: string }): Promise<CTAEvent[]>;
  getCTAPerformance(): Promise<{ ctaKey: string; clicks: number; qrViews: number; storeRedirects: number }[]>;
  
  // Newsletter + Spotlight + Blog Sync Module
  // Newsletters
  getNewsletters(): Promise<Newsletter[]>;
  getNewsletter(id: string): Promise<Newsletter | undefined>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  updateNewsletter(id: string, newsletter: Partial<Newsletter>): Promise<Newsletter | undefined>;
  deleteNewsletter(id: string): Promise<boolean>;
  getNewsletterByBlogPostId(blogPostId: string): Promise<Newsletter | undefined>;
  
  // Newsletter Templates
  getNewsletterTemplates(): Promise<NewsletterTemplate[]>;
  getNewsletterTemplate(id: string): Promise<NewsletterTemplate | undefined>;
  createNewsletterTemplate(template: InsertNewsletterTemplate): Promise<NewsletterTemplate>;
  updateNewsletterTemplate(id: string, template: Partial<NewsletterTemplate>): Promise<NewsletterTemplate | undefined>;
  deleteNewsletterTemplate(id: string): Promise<boolean>;
  
  // Schema Blocks (reusable newsletter modules)
  getSchemaBlocks(): Promise<SchemaBlock[]>;
  getSchemaBlock(id: string): Promise<SchemaBlock | undefined>;
  createSchemaBlock(block: InsertSchemaBlock): Promise<SchemaBlock>;
  updateSchemaBlock(id: string, block: Partial<SchemaBlock>): Promise<SchemaBlock | undefined>;
  deleteSchemaBlock(id: string): Promise<boolean>;
  
  // Schema Block Definitions (canonical structure + defaults)
  getSchemaBlockDefinitions(): Promise<SchemaBlockDefinition[]>;
  getSchemaBlockDefinition(id: string): Promise<SchemaBlockDefinition | undefined>;
  getSchemaBlockDefinitionByType(blockType: string): Promise<SchemaBlockDefinition | undefined>;
  createSchemaBlockDefinition(def: InsertSchemaBlockDefinition): Promise<SchemaBlockDefinition>;
  updateSchemaBlockDefinition(id: string, def: Partial<SchemaBlockDefinition>): Promise<SchemaBlockDefinition | undefined>;
  deleteSchemaBlockDefinition(id: string): Promise<boolean>;
  
  // Newsletter Template Block Overrides (template-level settings)
  getTemplateBlockOverrides(templateId: string): Promise<NewsletterTemplateBlockOverride[]>;
  getTemplateBlockOverride(templateId: string, blockType: string): Promise<NewsletterTemplateBlockOverride | undefined>;
  createTemplateBlockOverride(override: InsertNewsletterTemplateBlockOverride): Promise<NewsletterTemplateBlockOverride>;
  updateTemplateBlockOverride(id: string, override: Partial<NewsletterTemplateBlockOverride>): Promise<NewsletterTemplateBlockOverride | undefined>;
  deleteTemplateBlockOverride(id: string): Promise<boolean>;
  
  // Spotlight Banners
  getSpotlightBanners(): Promise<SpotlightBanner[]>;
  getSpotlightBanner(id: string): Promise<SpotlightBanner | undefined>;
  createSpotlightBanner(banner: InsertSpotlightBanner): Promise<SpotlightBanner>;
  updateSpotlightBanner(id: string, banner: Partial<SpotlightBanner>): Promise<SpotlightBanner | undefined>;
  deleteSpotlightBanner(id: string): Promise<boolean>;
  getSpotlightByBlogPostId(blogPostId: string): Promise<SpotlightBanner | undefined>;
  getActiveSpotlights(placement?: string): Promise<SpotlightBanner[]>;
  
  // Subscribers
  getSubscribers(): Promise<Subscriber[]>;
  getSubscriber(id: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: string, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined>;
  deleteSubscriber(id: string): Promise<boolean>;
  
  // Audit Logs
  getAuditLogs(filters?: { entityType?: string; entityId?: string; actionType?: string }): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // Newsletter Settings
  getNewsletterSettings(): Promise<NewsletterSettings>;
  updateNewsletterSettings(settings: Partial<NewsletterSettings>): Promise<NewsletterSettings>;

  // CMS Team Members
  getTeamMembers(): Promise<CmsTeamMember[]>;
  getTeamMember(id: string): Promise<CmsTeamMember | undefined>;
  getTeamMemberByEmail(email: string): Promise<CmsTeamMember | undefined>;
  createTeamMember(member: InsertCmsTeamMember): Promise<CmsTeamMember>;
  updateTeamMember(id: string, member: Partial<CmsTeamMember>): Promise<CmsTeamMember | undefined>;
  deleteTeamMember(id: string): Promise<boolean>;
  
  // CMS Settings
  getCmsSettings(): Promise<CmsSettings>;
  updateCmsSettings(settings: Partial<CmsSettings>): Promise<CmsSettings>;
  
  // Stock SEO Templates
  getStockSeoTemplates(): Promise<StockSeoTemplates>;
  updateStockSeoTemplates(templates: Partial<StockSeoTemplates>): Promise<StockSeoTemplates>;
  
  // Stories
  getStories(): Promise<Story[]>;
  getStory(id: string): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: string, story: Partial<Story>): Promise<Story | undefined>;
  deleteStory(id: string): Promise<boolean>;
  getStoriesByNewsletterId(newsletterId: string): Promise<Story[]>;
  linkStoryToSpotlight(storyId: string, spotlightId: string): Promise<Story | undefined>;
  linkStoryToNewsletter(storyId: string, newsletterId: string): Promise<Story | undefined>;
  
  // Compliance Checker
  getComplianceScanRuns(filters?: { contentType?: string; approvalStatus?: string }): Promise<ComplianceScanRun[]>;
  getComplianceScanRun(id: string): Promise<ComplianceScanRun | undefined>;
  createComplianceScanRun(run: InsertComplianceScanRun): Promise<ComplianceScanRun>;
  updateComplianceScanRun(id: string, updates: Partial<ComplianceScanRun>): Promise<ComplianceScanRun | undefined>;
  deleteComplianceScanRun(id: string): Promise<boolean>;
  getComplianceScanRunsByContentId(contentId: string): Promise<ComplianceScanRun[]>;
  
  // Compliance Rules
  getComplianceRules(): Promise<ComplianceRule[]>;
  getComplianceRule(id: string): Promise<ComplianceRule | undefined>;
  createComplianceRule(rule: InsertComplianceRule): Promise<ComplianceRule>;
  updateComplianceRule(id: string, updates: Partial<ComplianceRule>): Promise<ComplianceRule | undefined>;
  deleteComplianceRule(id: string): Promise<boolean>;
  
  // Compliance Checker Settings
  getComplianceCheckerSettings(): Promise<ComplianceCheckerSettings>;
  updateComplianceCheckerSettings(settings: Partial<ComplianceCheckerSettings>): Promise<ComplianceCheckerSettings>;
  
  // Writing Assistant Integrations
  getWritingAssistantIntegrations(): Promise<WritingAssistantIntegration[]>;
  getWritingAssistantIntegration(id: string): Promise<WritingAssistantIntegration | undefined>;
  getActiveWritingAssistantIntegration(): Promise<WritingAssistantIntegration | undefined>;
  createWritingAssistantIntegration(integration: InsertWritingAssistantIntegration): Promise<WritingAssistantIntegration>;
  updateWritingAssistantIntegration(id: string, updates: Partial<WritingAssistantIntegration>): Promise<WritingAssistantIntegration | undefined>;
  deleteWritingAssistantIntegration(id: string): Promise<boolean>;
  
  // Block Library Templates (reusable block templates)
  getBlockLibraryTemplates(): Promise<BlockLibraryTemplate[]>;
  getBlockLibraryTemplate(id: string): Promise<BlockLibraryTemplate | undefined>;
  createBlockLibraryTemplate(template: InsertBlockLibraryTemplate): Promise<BlockLibraryTemplate>;
  updateBlockLibraryTemplate(id: string, template: Partial<BlockLibraryTemplate>): Promise<BlockLibraryTemplate | undefined>;
  deleteBlockLibraryTemplate(id: string): Promise<boolean>;
  
  // Ticker Catalog (manual ticker entries)
  getTickerCatalog(): Promise<TickerCatalogEntry[]>;
  getTickerCatalogEntry(id: string): Promise<TickerCatalogEntry | undefined>;
  getTickerCatalogByTicker(ticker: string): Promise<TickerCatalogEntry | undefined>;
  createTickerCatalogEntry(entry: InsertTickerCatalogEntry): Promise<TickerCatalogEntry>;
  updateTickerCatalogEntry(id: string, entry: Partial<TickerCatalogEntry>): Promise<TickerCatalogEntry | undefined>;
  deleteTickerCatalogEntry(id: string): Promise<boolean>;
  
  // Newsletter Block Instances (per-newsletter blocks)
  getNewsletterBlockInstances(newsletterId: string): Promise<NewsletterBlockInstance[]>;
  getNewsletterBlockInstance(id: string): Promise<NewsletterBlockInstance | undefined>;
  createNewsletterBlockInstance(instance: InsertNewsletterBlockInstance): Promise<NewsletterBlockInstance>;
  updateNewsletterBlockInstance(id: string, instance: Partial<NewsletterBlockInstance>): Promise<NewsletterBlockInstance | undefined>;
  deleteNewsletterBlockInstance(id: string): Promise<boolean>;
  reorderNewsletterBlockInstances(newsletterId: string, orderedIds: string[]): Promise<boolean>;
  
  // Bond Pages
  getBondPages(): Promise<BondPage[]>;
  getBondPage(id: string): Promise<BondPage | undefined>;
  getBondPageBySlug(slug: string): Promise<BondPage | undefined>;
  createBondPage(page: InsertBondPage): Promise<BondPage>;
  updateBondPage(id: string, page: Partial<BondPage>): Promise<BondPage | undefined>;
  deleteBondPage(id: string): Promise<boolean>;
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

export interface TrafficTimeSeriesPoint {
  date: string;
  views: number;
}

export interface TrafficTimeSeries {
  data: TrafficTimeSeriesPoint[];
  totalViews: number;
  changePercent: number;
}

const seedTeamMembers: CmsTeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@getbaraka.com',
    role: 'admin',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    joinedAt: '2024-01-15T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Alex Morgan',
    email: 'alex@getbaraka.com',
    role: 'editor',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    joinedAt: '2024-02-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Jordan Lee',
    email: 'jordan@getbaraka.com',
    role: 'viewer',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    joinedAt: '2024-03-10T00:00:00Z',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
];

const seedCmsSettings: CmsSettings = {
  id: '1',
  general: {
    siteName_en: 'Baraka CMS',
    siteName_ar: 'بركة CMS',
    defaultLanguage: 'en',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    contactEmail: 'support@getbaraka.com',
  },
  branding: {
    logoUrl: '/images/baraka-logo.png',
    primaryColor: '#8B5CF6',
    secondaryColor: '#6366F1',
    accentColor: '#22C55E',
  },
  seoDefaults: {
    defaultMetaTitle_en: 'Baraka - Invest in US Stocks & ETFs',
    defaultMetaTitle_ar: 'بركة - استثمر في الأسهم وصناديق المؤشرات الأمريكية',
    defaultMetaDescription_en: 'Commission-free investing in US stocks and ETFs for GCC residents.',
    defaultMetaDescription_ar: 'استثمار بدون عمولة في الأسهم وصناديق المؤشرات الأمريكية لسكان دول الخليج.',
    robotsIndex: true,
    robotsFollow: true,
  },
  content: {
    defaultAuthor: 'Baraka Editorial',
    requireFeaturedImage: true,
    enableContentApproval: false,
    autoSaveInterval: 30,
    maxUploadSizeMb: 10,
  },
  security: {
    sessionTimeoutMinutes: 60,
    requireTwoFactor: false,
    allowedIpRanges: [],
    passwordMinLength: 8,
  },
  updatedAt: new Date().toISOString(),
};

const seedStockSeoTemplates: StockSeoTemplates = {
  stockMetaTitleTemplate_en: 'Buy {ticker} Stock | {companyName} | Baraka',
  stockMetaTitleTemplate_ar: 'شراء سهم {ticker} | {companyName} | بركة',
  stockMetaDescriptionTemplate_en: 'Invest in {companyName} ({ticker}) stock on {exchange}. Trade commission-free with Baraka. Get real-time prices, analysis, and more.',
  stockMetaDescriptionTemplate_ar: 'استثمر في سهم {companyName} ({ticker}) على {exchange}. تداول بدون عمولة مع بركة. احصل على الأسعار الحية والتحليلات والمزيد.',
  stockOgTitleTemplate_en: 'Invest in {companyName} Stock | Baraka',
  stockOgTitleTemplate_ar: 'استثمر في سهم {companyName} | بركة',
  stockOgDescriptionTemplate_en: 'Trade {ticker} on {exchange} commission-free with Baraka. Join thousands of investors in the MENA region.',
  stockOgDescriptionTemplate_ar: 'تداول {ticker} على {exchange} بدون عمولة مع بركة. انضم إلى آلاف المستثمرين في منطقة الشرق الأوسط.',
  updatedAt: new Date().toISOString(),
};

const seedAppDownloadConfig: AppDownloadConfig = {
  id: '1',
  iosAppStoreUrl: 'https://apps.apple.com/app/baraka/id1234567890',
  androidPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.baraka.app',
  iosDeepLink: 'https://baraka.adj.st/app?adj_t=abc123',
  androidDeepLink: 'https://baraka.adj.st/app?adj_t=abc123',
  qrCodeUrl: 'https://baraka.onelink.me/download',
  ctaText_en: 'Sign Up to Trade',
  ctaText_ar: 'سجّل للتداول',
  popupTitle_en: 'Get the Baraka App',
  popupTitle_ar: 'حمّل تطبيق بركة',
  popupSubtitle_en: 'Scan the QR code with your phone to download the app and start investing.',
  popupSubtitle_ar: 'امسح رمز QR بهاتفك لتحميل التطبيق وابدأ الاستثمار.',
  updatedAt: new Date().toISOString(),
};

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private priceAlertSubscriptions: Map<string, PriceAlertSubscription>;
  private stockWatchSubscriptions: Map<string, StockWatchSubscription>;
  private newsletterSignups: Map<string, NewsletterSignup>;
  private discoverSettings: DiscoverSettings;
  private stockThemes: Map<string, StockTheme>;
  private stockCollections: Map<string, StockCollection>;
  private offerBanners: OfferBanner[];
  private landingPages: Map<string, LandingPage>;
  private landingPageVersions: Map<string, LandingPageVersion>;
  private formSubmissions: Map<string, FormSubmission>;
  private analyticsEvents: Map<string, AnalyticsEvent>;
  private cmsWebEvents: Map<string, CmsWebEvent>;
  private bannerEvents: Map<string, BannerEvent>;
  private mobileInstallBanners: Map<string, MobileInstallBanner>;
  private newsletters: Map<string, Newsletter>;
  private newsletterTemplates: Map<string, NewsletterTemplate>;
  private schemaBlocks: Map<string, SchemaBlock>;
  private spotlightBanners: Map<string, SpotlightBanner>;
  private subscribers: Map<string, Subscriber>;
  private auditLogs: Map<string, AuditLog>;
  private newsletterSettings: NewsletterSettings;
  private analyticsSettings: AnalyticsSettings;
  private blogPosts: Map<string, BlogPost>;
  private stockPages: Map<string, StockPage>;
  private marketingPixels: Map<string, MarketingPixel>;
  private pixelEventMaps: Map<string, PixelEventMap>;
  private appDownloadConfig: AppDownloadConfig;
  private callToActions: Map<string, CallToAction>;
  private ctaEvents: Map<string, CTAEvent>;
  private teamMembers: Map<string, CmsTeamMember>;
  private cmsSettings: CmsSettings;
  private stockSeoTemplates: StockSeoTemplates;
  private assetLinks: Map<string, AssetLink>;
  private stories: Map<string, Story>;
  private complianceScanRuns: Map<string, ComplianceScanRun>;
  private complianceRules: Map<string, ComplianceRule>;
  private complianceCheckerSettings: ComplianceCheckerSettings;
  private writingAssistantIntegrations: Map<string, WritingAssistantIntegration>;
  private blockLibraryTemplates: Map<string, BlockLibraryTemplate>;
  private tickerCatalog: Map<string, TickerCatalogEntry>;
  private newsletterBlockInstances: Map<string, NewsletterBlockInstance>;
  private schemaBlockDefinitions: Map<string, SchemaBlockDefinition>;
  private templateBlockOverrides: Map<string, NewsletterTemplateBlockOverride>;
  private bondPages: Map<string, BondPage>;

  constructor() {
    this.users = new Map();
    this.priceAlertSubscriptions = new Map();
    this.stockWatchSubscriptions = new Map();
    this.newsletterSignups = new Map();
    this.discoverSettings = { ...seedDiscoverSettings };
    this.stockThemes = new Map();
    seedStockThemes.forEach(theme => this.stockThemes.set(theme.id, theme));
    this.stockCollections = new Map();
    seedStockCollections.forEach(collection => this.stockCollections.set(collection.id, collection));
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
    this.appDownloadConfig = { ...seedAppDownloadConfig };
    this.callToActions = new Map();
    this.ctaEvents = new Map();
    this.teamMembers = new Map();
    seedTeamMembers.forEach(m => this.teamMembers.set(m.id, m));
    this.cmsSettings = { ...seedCmsSettings };
    this.stockSeoTemplates = { ...seedStockSeoTemplates };
    this.newsletters = new Map();
    this.newsletterTemplates = new Map();
    this.schemaBlocks = new Map();
    this.spotlightBanners = new Map();
    this.subscribers = new Map();
    this.auditLogs = new Map();
    this.newsletterSettings = { ...seedNewsletterSettings };
    this.assetLinks = new Map();
    this.stories = new Map();
    this.complianceScanRuns = new Map();
    this.complianceRules = new Map();
    this.complianceCheckerSettings = {
      enableEnglishQualityScoring: false,
      englishScoringProvider: 'openai',
      openaiModel: 'gpt-4o',
      autoScanOnSave: true,
      blockPublishOnHighSeverity: true,
      scanOnPublishAlways: true,
      complianceThresholds: { compliant: 85, needsReview: 60 },
      englishThresholds: { excellent: 90, good: 70 },
    };
    this.writingAssistantIntegrations = new Map();
    this.blockLibraryTemplates = new Map();
    this.tickerCatalog = new Map();
    this.newsletterBlockInstances = new Map();
    this.schemaBlockDefinitions = new Map();
    this.templateBlockOverrides = new Map();
    this.bondPages = new Map(seedBondPages.map(b => [b.id, b]));
    
    // Seed schema block definitions with default settings
    const defaultSchemaBlockDefinitions: SchemaBlockDefinition[] = [
      {
        id: 'sbd-1',
        blockType: 'introduction',
        name: 'Introduction',
        description: 'Opening section with title, subtitle, and body text',
        defaultSchemaJson: { title: 'Welcome to This Week\'s Newsletter', subtitle: '', body: '' },
        defaultSettingsJson: { showSubtitle: true, showBody: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-2',
        blockType: 'featured_content',
        name: 'Featured Content',
        description: 'Highlight featured articles with images and excerpts',
        defaultSchemaJson: { title: 'Featured This Week', articles: [] },
        defaultSettingsJson: { maxArticles: 3, showImages: true, showExcerpts: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-3',
        blockType: 'articles_list',
        name: 'Articles List',
        description: 'List of articles in list or grid layout',
        defaultSchemaJson: { title: 'More to Read', articles: [], showExcerpts: true },
        defaultSettingsJson: { maxArticles: 6, showImages: true, showExcerpts: true, layout: 'list' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-4',
        blockType: 'stock_collection',
        name: 'Stock Collection',
        description: 'Curated collection of stocks with notes',
        defaultSchemaJson: { title: 'Top Stocks This Week', description: '', stocks: [] },
        defaultSettingsJson: { maxStocks: 10, showNotes: true, cardStyle: 'compact' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-5',
        blockType: 'assets_under_500',
        name: 'Assets Under $500',
        description: 'Stocks priced under $500 for accessibility',
        defaultSchemaJson: { title: 'Affordable Picks', description: 'Stocks under $500', stocks: [] },
        defaultSettingsJson: { maxStocks: 8, showPrice: true, showNotes: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-6',
        blockType: 'what_users_picked',
        name: 'What Users Picked',
        description: 'Popular stocks selected by users',
        defaultSchemaJson: { title: 'What Users Are Buying', description: 'Popular picks this week', stocks: [] },
        defaultSettingsJson: { maxStocks: 6, showPickCount: true, showNotes: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-7',
        blockType: 'asset_highlight',
        name: 'Asset Highlight',
        description: 'Feature a single stock with detailed information',
        defaultSchemaJson: { title: 'Stock Spotlight', stockId: '', ticker: '', companyName: '', description: '', whyItMatters: '' },
        defaultSettingsJson: { showDescription: true, showWhyItMatters: true, showImage: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-8',
        blockType: 'term_of_the_day',
        name: 'Term Of The Day',
        description: 'Educational term with definition and example',
        defaultSchemaJson: { term: '', definition: '', example: '', relatedTerms: [] },
        defaultSettingsJson: { showExample: true, showRelatedTerms: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-9',
        blockType: 'in_other_news',
        name: 'In Other News',
        description: 'Additional news items with headlines and sources',
        defaultSchemaJson: { title: 'In Other News', newsItems: [] },
        defaultSettingsJson: { maxItems: 5, showSource: true, showSummary: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sbd-10',
        blockType: 'call_to_action',
        name: 'Call To Action',
        description: 'Action button with title and optional secondary button',
        defaultSchemaJson: { title: 'Ready to Start?', subtitle: '', buttonText: 'Get Started', buttonUrl: '' },
        defaultSettingsJson: { showSecondaryButton: false, showImage: false, buttonStyle: 'primary' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    defaultSchemaBlockDefinitions.forEach(def => this.schemaBlockDefinitions.set(def.id, def));
    
    // Seed sample template block overrides (Weekly Roundup template)
    const sampleTemplateOverrides: NewsletterTemplateBlockOverride[] = [
      {
        id: 'tbo-1',
        templateId: 'template-1',
        blockType: 'stock_collection',
        overrideSettingsJson: { maxStocks: 20, cardStyle: 'detailed' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    sampleTemplateOverrides.forEach(override => this.templateBlockOverrides.set(override.id, override));
    
    // Seed ticker catalog
    seedTickerCatalog.forEach(entry => this.tickerCatalog.set(entry.id, entry));
    
    // Seed block library templates
    seedBlockLibraryTemplates.forEach(template => this.blockLibraryTemplates.set(template.id, template));
    
    // Seed default DFSA compliance rules (50+ rules for Baraka fintech context)
    const now = new Date().toISOString();
    const defaultComplianceRules: ComplianceRule[] = [
      // Guaranteed / Risk-free category (High severity)
      { id: randomUUID(), name: 'Guaranteed Returns', phrase: 'guaranteed returns', description: 'Claims of guaranteed investment returns', category: 'guaranteed_returns', matchType: 'contains', pattern: 'guaranteed returns', severity: 'high', message: 'No guaranteed outcomes; markets involve risk.', suggestedFix: 'Use "potential returns" or "historical returns"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Guaranteed Profit', phrase: 'guaranteed profit', description: 'Claims of guaranteed profit', category: 'guaranteed_returns', matchType: 'contains', pattern: 'guaranteed profit', severity: 'high', message: 'No guaranteed outcomes; markets involve risk.', suggestedFix: 'Use "potential profit" instead', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Risk-free', phrase: 'risk-free', description: 'Claims of risk-free investments', category: 'guaranteed_returns', matchType: 'contains', pattern: 'risk-free', severity: 'high', message: 'All investments carry some level of risk.', suggestedFix: 'Use "lower risk" or describe specific risk factors', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Zero Risk', phrase: 'zero risk', description: 'Claims of zero risk', category: 'guaranteed_returns', matchType: 'contains', pattern: 'zero risk', severity: 'high', message: 'All investments carry some level of risk.', suggestedFix: 'Remove or qualify with actual risk disclosure', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'No Risk', phrase: 'no risk', description: 'Claims of no risk', category: 'guaranteed_returns', matchType: 'regex', pattern: '\\bno\\s+risk\\b', severity: 'high', message: 'All investments carry some level of risk.', suggestedFix: 'Include appropriate risk disclosure', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: "Can't Lose", phrase: "can't lose", description: 'Claims that you cannot lose', category: 'guaranteed_returns', matchType: 'contains', pattern: "can't lose", severity: 'high', message: 'Investment losses are always possible.', suggestedFix: 'Remove this claim entirely', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Cannot Lose', phrase: 'cannot lose', description: 'Claims that you cannot lose', category: 'guaranteed_returns', matchType: 'contains', pattern: 'cannot lose', severity: 'high', message: 'Investment losses are always possible.', suggestedFix: 'Remove this claim entirely', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Sure-shot', phrase: 'sure-shot', description: 'Claims of sure-shot returns', category: 'guaranteed_returns', matchType: 'contains', pattern: 'sure-shot', severity: 'high', message: 'No investment outcome is guaranteed.', suggestedFix: 'Remove guarantee language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Sureshot', phrase: 'sureshot', description: 'Claims of sureshot returns', category: 'guaranteed_returns', matchType: 'contains', pattern: 'sureshot', severity: 'high', message: 'No investment outcome is guaranteed.', suggestedFix: 'Remove guarantee language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Fail-proof', phrase: 'fail-proof', description: 'Claims of fail-proof investments', category: 'guaranteed_returns', matchType: 'contains', pattern: 'fail-proof', severity: 'high', message: 'All investments carry risk of loss.', suggestedFix: 'Remove or add risk disclosure', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: '100% Safe', phrase: '100% safe', description: 'Claims of 100% safety', category: 'guaranteed_returns', matchType: 'contains', pattern: '100% safe', severity: 'high', message: 'No investment is 100% safe.', suggestedFix: 'Use "relatively stable" with context', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Locked-in Returns', phrase: 'locked-in returns', description: 'Claims of locked-in returns', category: 'guaranteed_returns', matchType: 'contains', pattern: 'locked-in returns', severity: 'high', message: 'Returns cannot be locked in for most investments.', suggestedFix: 'Use "target returns" or "historical returns"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Assured Returns', phrase: 'assured returns', description: 'Claims of assured returns', category: 'guaranteed_returns', matchType: 'contains', pattern: 'assured returns', severity: 'high', message: 'Returns are not assured in investing.', suggestedFix: 'Use "expected returns" with disclaimers', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Guaranteed Income', phrase: 'guaranteed income', description: 'Claims of guaranteed income', category: 'guaranteed_returns', matchType: 'contains', pattern: 'guaranteed income', severity: 'high', message: 'Investment income is not guaranteed.', suggestedFix: 'Use "potential income" or "dividend history"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Guaranteed Yield', phrase: 'guaranteed yield', description: 'Claims of guaranteed yield', category: 'guaranteed_returns', matchType: 'contains', pattern: 'guaranteed yield', severity: 'high', message: 'Yields are not guaranteed.', suggestedFix: 'Use "current yield" or "historical yield"', enabled: true, createdAt: now, updatedAt: now },
      
      // Unrealistic performance claims (High severity)
      { id: randomUUID(), name: 'Double Your Money', phrase: 'double your money', description: 'Unrealistic doubling claims', category: 'performance_claims', matchType: 'contains', pattern: 'double your money', severity: 'high', message: 'Unrealistic performance promises are misleading.', suggestedFix: 'Focus on historical data with proper context', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Triple Your Money', phrase: 'triple your money', description: 'Unrealistic tripling claims', category: 'performance_claims', matchType: 'contains', pattern: 'triple your money', severity: 'high', message: 'Unrealistic performance promises are misleading.', suggestedFix: 'Focus on historical data with proper context', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Get Rich Quick', phrase: 'get rich quick', description: 'Get rich quick schemes', category: 'performance_claims', matchType: 'contains', pattern: 'get rich quick', severity: 'high', message: 'Wealth building takes time; avoid quick-rich language.', suggestedFix: 'Focus on long-term investing benefits', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Instant Profit', phrase: 'instant profit', description: 'Claims of instant profit', category: 'performance_claims', matchType: 'contains', pattern: 'instant profit', severity: 'high', message: 'Profits are never instant or guaranteed.', suggestedFix: 'Use "potential returns over time"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Instant Returns', phrase: 'instant returns', description: 'Claims of instant returns', category: 'performance_claims', matchType: 'contains', pattern: 'instant returns', severity: 'high', message: 'Returns take time to materialize.', suggestedFix: 'Focus on investment timeline expectations', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Consistent Profits', phrase: 'consistent profits', description: 'Claims of consistent profits', category: 'performance_claims', matchType: 'contains', pattern: 'consistent profits', severity: 'high', message: 'Market returns vary; consistency is not guaranteed.', suggestedFix: 'Use "historically stable" with context', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Predictable Profits', phrase: 'predictable profits', description: 'Claims of predictable profits', category: 'performance_claims', matchType: 'contains', pattern: 'predictable profits', severity: 'high', message: 'Market outcomes are inherently unpredictable.', suggestedFix: 'Remove or add uncertainty disclosure', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Beat the Market', phrase: 'beat the market', description: 'Promises to beat the market', category: 'performance_claims', matchType: 'contains', pattern: 'beat the market', severity: 'medium', message: 'Outperforming the market is not guaranteed.', suggestedFix: 'Use "aim to match market performance"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Guaranteed to Outperform', phrase: 'guaranteed to outperform', description: 'Guarantees of outperformance', category: 'performance_claims', matchType: 'contains', pattern: 'guaranteed to outperform', severity: 'high', message: 'No investment is guaranteed to outperform.', suggestedFix: 'Remove guarantee language entirely', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Highest Returns', phrase: 'highest returns', description: 'Claims of highest returns', category: 'performance_claims', matchType: 'contains', pattern: 'highest returns', severity: 'high', message: 'Comparative return claims require substantiation.', suggestedFix: 'Use "competitive returns" or cite sources', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Best Returns', phrase: 'best returns', description: 'Claims of best returns', category: 'performance_claims', matchType: 'contains', pattern: 'best returns', severity: 'high', message: 'Comparative return claims require substantiation.', suggestedFix: 'Use "strong historical returns" with data', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Unbeatable Returns', phrase: 'unbeatable returns', description: 'Claims of unbeatable returns', category: 'performance_claims', matchType: 'contains', pattern: 'unbeatable returns', severity: 'high', message: 'Such claims are misleading and unsubstantiated.', suggestedFix: 'Focus on factual performance data', enabled: true, createdAt: now, updatedAt: now },
      
      // Advice / directive language (Medium/High severity)
      { id: randomUUID(), name: 'Buy Now', phrase: 'buy now', description: 'Pressure to buy immediately', category: 'advice_language', matchType: 'exact', pattern: '\\bbuy now\\b', severity: 'high', message: 'Avoid telling users what to buy; use neutral phrasing.', suggestedFix: 'Use "learn more" or "explore options"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Sell Now', phrase: 'sell now', description: 'Pressure to sell immediately', category: 'advice_language', matchType: 'exact', pattern: '\\bsell now\\b', severity: 'high', message: 'Avoid telling users what to sell; use neutral phrasing.', suggestedFix: 'Use "review your portfolio" instead', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'You Should Buy', phrase: 'you should buy', description: 'Direct advice to buy', category: 'advice_language', matchType: 'contains', pattern: 'you should buy', severity: 'medium', message: 'Avoid direct investment advice.', suggestedFix: 'Use "you may consider" or "research shows"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'You Should Sell', phrase: 'you should sell', description: 'Direct advice to sell', category: 'advice_language', matchType: 'contains', pattern: 'you should sell', severity: 'medium', message: 'Avoid direct investment advice.', suggestedFix: 'Use "you may consider reviewing" instead', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Must Buy', phrase: 'must buy', description: 'Imperative to buy', category: 'advice_language', matchType: 'contains', pattern: 'must buy', severity: 'high', message: 'Avoid imperative investment language.', suggestedFix: 'Remove or use informational language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Must Invest', phrase: 'must invest', description: 'Imperative to invest', category: 'advice_language', matchType: 'contains', pattern: 'must invest', severity: 'high', message: 'Avoid imperative investment language.', suggestedFix: 'Use "may want to consider investing"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Do This Trade', phrase: 'do this trade', description: 'Direct trade instruction', category: 'advice_language', matchType: 'contains', pattern: 'do this trade', severity: 'high', message: 'Direct trade instructions are not appropriate.', suggestedFix: 'Use educational/informational language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Copy This Trade', phrase: 'copy this trade', description: 'Copy trade instruction', category: 'advice_language', matchType: 'contains', pattern: 'copy this trade', severity: 'high', message: 'Copy trading suggestions require proper disclosure.', suggestedFix: 'Include risk warnings and disclaimers', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Follow This Strategy', phrase: 'follow this strategy for profit', description: 'Strategy promises profit', category: 'advice_language', matchType: 'contains', pattern: 'follow this strategy for profit', severity: 'high', message: 'Strategy outcomes are not guaranteed.', suggestedFix: 'Use "this strategy may help" with disclaimers', enabled: true, createdAt: now, updatedAt: now },
      
      // FOMO / urgency / pressure (High severity)
      { id: randomUUID(), name: 'Last Chance', phrase: 'last chance', description: 'Creates urgency', category: 'fomo_urgency', matchType: 'contains', pattern: 'last chance', severity: 'high', message: 'Avoid pressure tactics; keep language informational.', suggestedFix: 'Remove urgency language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Final Hours', phrase: 'final hours', description: 'Creates urgency', category: 'fomo_urgency', matchType: 'contains', pattern: 'final hours', severity: 'high', message: 'Avoid pressure tactics; keep language informational.', suggestedFix: 'Remove time pressure language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Limited Time Only', phrase: 'limited time only', description: 'Creates urgency', category: 'fomo_urgency', matchType: 'contains', pattern: 'limited time only', severity: 'high', message: 'Avoid artificial scarcity tactics.', suggestedFix: 'Remove or specify actual limitations', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: "Don't Miss Out", phrase: "don't miss out", description: 'FOMO language', category: 'fomo_urgency', matchType: 'contains', pattern: "don't miss out", severity: 'high', message: 'FOMO tactics are inappropriate for financial content.', suggestedFix: 'Use "learn more about this opportunity"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Act Now', phrase: 'act now', description: 'Pressure to act immediately', category: 'fomo_urgency', matchType: 'exact', pattern: '\\bact now\\b', severity: 'high', message: 'Avoid pressure tactics; keep language informational.', suggestedFix: 'Use "get started when ready"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Hurry', phrase: 'hurry', description: 'Creates urgency', category: 'fomo_urgency', matchType: 'exact', pattern: '\\bhurry\\b', severity: 'high', message: 'Avoid pressure tactics in financial content.', suggestedFix: 'Remove urgency language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: "Before It's Too Late", phrase: "before it's too late", description: 'Creates fear', category: 'fomo_urgency', matchType: 'contains', pattern: "before it's too late", severity: 'high', message: 'Fear-based language is inappropriate.', suggestedFix: 'Focus on benefits rather than missed opportunities', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Seats Limited', phrase: 'seats limited', description: 'Artificial scarcity', category: 'fomo_urgency', matchType: 'contains', pattern: 'seats limited', severity: 'high', message: 'Artificial scarcity is misleading.', suggestedFix: 'Remove or specify actual capacity', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Ending Soon', phrase: 'ending soon', description: 'Creates urgency', category: 'fomo_urgency', matchType: 'contains', pattern: 'ending soon', severity: 'medium', message: 'Urgency language should be factual.', suggestedFix: 'Specify actual end date if applicable', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Only Today', phrase: 'only today', description: 'Time pressure', category: 'fomo_urgency', matchType: 'contains', pattern: 'only today', severity: 'high', message: 'Artificial time pressure is inappropriate.', suggestedFix: 'Remove or be specific about timing', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Offer Expires', phrase: 'offer expires', description: 'Creates urgency', category: 'fomo_urgency', matchType: 'contains', pattern: 'offer expires', severity: 'medium', message: 'Include specific expiration date if true.', suggestedFix: 'Specify actual expiration date', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Once in a Lifetime', phrase: 'once in a lifetime', description: 'Exaggerated urgency', category: 'fomo_urgency', matchType: 'contains', pattern: 'once in a lifetime', severity: 'high', message: 'Hyperbolic claims are misleading.', suggestedFix: 'Use factual descriptions of opportunities', enabled: true, createdAt: now, updatedAt: now },
      
      // Misleading certainty (High severity)
      { id: randomUUID(), name: 'Guaranteed Winner', phrase: 'guaranteed winner', description: 'Guarantees winning', category: 'misleading_claims', matchType: 'contains', pattern: 'guaranteed winner', severity: 'high', message: 'No investment is a guaranteed winner.', suggestedFix: 'Use "historically strong performer"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Winning Stock', phrase: 'winning stock', description: 'Claims stock will win', category: 'misleading_claims', matchType: 'contains', pattern: 'winning stock', severity: 'medium', message: 'Future performance is uncertain.', suggestedFix: 'Use "stock with strong fundamentals"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: "Can't Go Wrong", phrase: "can't go wrong", description: 'Claims infallibility', category: 'misleading_claims', matchType: 'contains', pattern: "can't go wrong", severity: 'high', message: 'All investments carry risk.', suggestedFix: 'Add appropriate risk disclosure', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Sure Profit', phrase: 'sure profit', description: 'Promises sure profit', category: 'misleading_claims', matchType: 'contains', pattern: 'sure profit', severity: 'high', message: 'Profits are never certain.', suggestedFix: 'Use "potential profit" with disclaimers', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Profit Guaranteed', phrase: 'profit guaranteed', description: 'Guarantees profit', category: 'misleading_claims', matchType: 'contains', pattern: 'profit guaranteed', severity: 'high', message: 'Profits cannot be guaranteed.', suggestedFix: 'Remove guarantee language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Safe Bet', phrase: 'safe bet', description: 'Claims safety', category: 'misleading_claims', matchType: 'contains', pattern: 'safe bet', severity: 'high', message: 'No investment is completely safe.', suggestedFix: 'Use "relatively stable investment"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Foolproof Strategy', phrase: 'foolproof strategy', description: 'Claims infallible strategy', category: 'misleading_claims', matchType: 'contains', pattern: 'foolproof strategy', severity: 'high', message: 'No strategy is foolproof.', suggestedFix: 'Use "tested strategy" with disclaimers', enabled: true, createdAt: now, updatedAt: now },
      
      // Regulatory / authority claims (High severity)
      { id: randomUUID(), name: 'DFSA Approved', phrase: 'DFSA approved', description: 'May be misleading regulatory claim', category: 'regulatory_claims', matchType: 'contains', pattern: 'DFSA approved', severity: 'high', message: 'Verify accuracy of regulatory claims.', suggestedFix: 'Use "DFSA regulated" with proper context', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Government Backed', phrase: 'government backed', description: 'May be misleading', category: 'regulatory_claims', matchType: 'contains', pattern: 'government backed', severity: 'high', message: 'Government backing claims require verification.', suggestedFix: 'Specify which government program if accurate', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Officially Endorsed', phrase: 'officially endorsed', description: 'Endorsement claim', category: 'regulatory_claims', matchType: 'contains', pattern: 'officially endorsed', severity: 'high', message: 'Endorsement claims require substantiation.', suggestedFix: 'Cite specific endorsement source', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Regulator Guaranteed', phrase: 'regulator guaranteed', description: 'False regulatory claim', category: 'regulatory_claims', matchType: 'contains', pattern: 'regulator guaranteed', severity: 'high', message: 'Regulators do not guarantee investments.', suggestedFix: 'Remove this claim entirely', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Regulator Approved', phrase: 'regulator approved', description: 'May be misleading', category: 'regulatory_claims', matchType: 'contains', pattern: 'regulator approved', severity: 'high', message: 'Clarify what regulation means.', suggestedFix: 'Use "regulated by" with specific regulator', enabled: true, createdAt: now, updatedAt: now },
      
      // Over-personalized claims (Medium severity)
      { id: randomUUID(), name: 'Perfect For You', phrase: 'perfect for you', description: 'Over-personalized', category: 'personalized_claims', matchType: 'contains', pattern: 'perfect for you', severity: 'medium', message: 'Personalized claims should be substantiated.', suggestedFix: 'Use "may be suitable based on your profile"', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Tailored For You', phrase: 'tailored for you', description: 'May be misleading', category: 'personalized_claims', matchType: 'contains', pattern: 'tailored for you', severity: 'medium', message: 'Only use if actually personalized.', suggestedFix: 'Explain personalization methodology', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'We Guarantee You Will', phrase: 'we guarantee you will', description: 'Personal guarantee', category: 'personalized_claims', matchType: 'contains', pattern: 'we guarantee you will', severity: 'high', message: 'Personal guarantees are inappropriate.', suggestedFix: 'Remove guarantee language', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'You Will Definitely', phrase: 'you will definitely', description: 'Certainty claim', category: 'personalized_claims', matchType: 'contains', pattern: 'you will definitely', severity: 'high', message: 'Certainty claims are misleading.', suggestedFix: 'Use "you may" or "there is potential to"', enabled: true, createdAt: now, updatedAt: now },
      
      // Pattern-based rules (Regex)
      { id: randomUUID(), name: 'Percentage Guarantee', phrase: '\\b\\d{2,3}%\\s*(guaranteed|sure)\\b', description: 'Percentage with guarantee', category: 'guaranteed_returns', matchType: 'regex', pattern: '\\b\\d{2,3}%\\s*(guaranteed|sure)\\b', severity: 'high', message: 'Percentage guarantees are prohibited.', suggestedFix: 'Remove percentage guarantee claims', enabled: true, createdAt: now, updatedAt: now },
      { id: randomUUID(), name: 'Guarantee Word', phrase: '\\b(guarantee|guaranteed)\\b', description: 'General guarantee language', category: 'guaranteed_returns', matchType: 'regex', pattern: '\\b(guarantee|guaranteed)\\b', severity: 'medium', message: 'Review context of guarantee language.', suggestedFix: 'Consider if guarantee claim is appropriate', enabled: true, createdAt: now, updatedAt: now },
    ];
    defaultComplianceRules.forEach(rule => this.complianceRules.set(rule.id, rule));
    
    // Seed landing pages
    seedLandingPages.forEach(page => this.landingPages.set(page.id, page));
    
    // Seed blog posts (30 articles)
    seedArticles.forEach(post => this.blogPosts.set(post.id, post));
    
    // Auto-generate spotlights from published blog posts
    const autoSpotlights = generateSpotlightsFromBlogPosts(seedArticles);
    autoSpotlights.forEach(spotlight => this.spotlightBanners.set(spotlight.id, spotlight));
    
    // Auto-generate newsletter drafts from published blog posts
    const autoNewsletters = generateNewslettersFromBlogPosts(seedArticles);
    autoNewsletters.forEach(newsletter => this.newsletters.set(newsletter.id, newsletter));
    
    // Seed stock pages
    seedStockPages.forEach(page => this.stockPages.set(page.id, page));
    
    // Seed mobile install banner
    this.mobileInstallBanners.set(seedMobileInstallBanner.id, seedMobileInstallBanner);
    
    // Seed CMS web events
    seedCmsWebEvents.forEach(event => this.cmsWebEvents.set(event.id, event));
    
    // Seed banner events
    seedBannerEvents.forEach(event => this.bannerEvents.set(event.id, event));
    
    // Seed CTAs
    seedCallToActions.forEach(cta => this.callToActions.set(cta.id, cta));
    
    // Seed Newsletter + Spotlight + Blog Sync module data
    seedSchemaBlocks.forEach(block => this.schemaBlocks.set(block.id, block));
    seedNewsletterTemplates.forEach(template => this.newsletterTemplates.set(template.id, template));
    seedNewsletters.forEach(newsletter => this.newsletters.set(newsletter.id, newsletter));
    seedSpotlightBanners.forEach(banner => this.spotlightBanners.set(banner.id, banner));
    seedSubscribers.forEach(subscriber => this.subscribers.set(subscriber.id, subscriber));
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

  async createStockWatchSubscription(subscription: InsertStockWatchSubscription): Promise<StockWatchSubscription> {
    const id = randomUUID();
    const newSubscription: StockWatchSubscription = { 
      email: subscription.email,
      mobile: subscription.mobile,
      ticker: subscription.ticker,
      stockName: subscription.stockName,
      frequency: subscription.frequency,
      locale: subscription.locale ?? 'en',
      id, 
      createdAt: new Date() 
    };
    this.stockWatchSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getStockWatchSubscriptions(): Promise<StockWatchSubscription[]> {
    return Array.from(this.stockWatchSubscriptions.values());
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
    return Array.from(this.stockThemes.values());
  }

  async getStockTheme(id: string): Promise<StockTheme | undefined> {
    return this.stockThemes.get(id);
  }

  async getStockThemeBySlug(slug: string): Promise<StockTheme | undefined> {
    return Array.from(this.stockThemes.values()).find(t => t.slug === slug);
  }

  async createStockTheme(theme: InsertStockTheme): Promise<StockTheme> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newTheme: StockTheme = { ...theme, id, createdAt: now, updatedAt: now };
    this.stockThemes.set(id, newTheme);
    return newTheme;
  }

  async updateStockTheme(id: string, theme: Partial<StockTheme>): Promise<StockTheme | undefined> {
    const existing = this.stockThemes.get(id);
    if (!existing) return undefined;
    const updated: StockTheme = { ...existing, ...theme, id, updatedAt: new Date().toISOString() };
    this.stockThemes.set(id, updated);
    return updated;
  }

  async deleteStockTheme(id: string): Promise<boolean> {
    return this.stockThemes.delete(id);
  }

  async getStockCollections(): Promise<StockCollection[]> {
    return Array.from(this.stockCollections.values());
  }

  async getStockCollection(id: string): Promise<StockCollection | undefined> {
    return this.stockCollections.get(id);
  }

  async getStockCollectionBySlug(slug: string): Promise<StockCollection | undefined> {
    return Array.from(this.stockCollections.values()).find(c => c.slug === slug);
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

  // Asset Links (curated stock collections)
  async getAssetLinks(collectionKey: string): Promise<AssetLink[]> {
    return Array.from(this.assetLinks.values())
      .filter(link => link.collectionKey === collectionKey)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getAssetLink(id: string): Promise<AssetLink | undefined> {
    return this.assetLinks.get(id);
  }

  async createAssetLink(link: InsertAssetLink): Promise<AssetLink> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newLink: AssetLink = {
      ...link,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.assetLinks.set(id, newLink);
    return newLink;
  }

  async updateAssetLink(id: string, link: Partial<AssetLink>): Promise<AssetLink | undefined> {
    const existing = this.assetLinks.get(id);
    if (!existing) return undefined;
    
    const updated: AssetLink = {
      ...existing,
      ...link,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.assetLinks.set(id, updated);
    return updated;
  }

  async deleteAssetLink(id: string): Promise<boolean> {
    return this.assetLinks.delete(id);
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

  async getTrafficTimeSeries(dateRange: { start: string; end: string }, filter: 'all' | 'stocks' | 'blogs'): Promise<TrafficTimeSeries> {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const seededRandom = (seed: string): number => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs((Math.sin(hash) * 10000) % 1);
    };
    
    const data: TrafficTimeSeriesPoint[] = [];
    let totalViews = 0;
    
    for (let i = 0; i < dayCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const seed = `${dateStr}-${filter}`;
      const randomFactor = seededRandom(seed);
      
      let baseViews: number;
      switch (filter) {
        case 'stocks':
          baseViews = 800 + Math.floor(randomFactor * 400);
          break;
        case 'blogs':
          baseViews = 300 + Math.floor(randomFactor * 200);
          break;
        default:
          baseViews = 1200 + Math.floor(randomFactor * 600);
      }
      
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        baseViews = Math.floor(baseViews * 0.7);
      }
      
      const trendFactor = 1 + (i / dayCount) * 0.15;
      const views = Math.floor(baseViews * trendFactor);
      
      data.push({ date: dateStr, views });
      totalViews += views;
    }
    
    const midpoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midpoint).reduce((sum, p) => sum + p.views, 0);
    const secondHalf = data.slice(midpoint).reduce((sum, p) => sum + p.views, 0);
    const changePercent = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
    
    return { data, totalViews, changePercent };
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

  // App Download Config
  async getAppDownloadConfig(): Promise<AppDownloadConfig> {
    return this.appDownloadConfig;
  }

  async updateAppDownloadConfig(config: Partial<AppDownloadConfig>): Promise<AppDownloadConfig> {
    this.appDownloadConfig = {
      ...this.appDownloadConfig,
      ...config,
      id: this.appDownloadConfig.id,
      updatedAt: new Date().toISOString(),
    };
    return this.appDownloadConfig;
  }

  // CTA Registry Methods
  async getCallToActions(): Promise<CallToAction[]> {
    return Array.from(this.callToActions.values());
  }

  async getCallToAction(id: string): Promise<CallToAction | undefined> {
    return this.callToActions.get(id);
  }

  async getCallToActionByKey(key: string): Promise<CallToAction | undefined> {
    return Array.from(this.callToActions.values()).find(cta => cta.key === key);
  }

  async createCallToAction(cta: InsertCallToAction): Promise<CallToAction> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newCTA: CallToAction = {
      ...cta,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.callToActions.set(id, newCTA);
    return newCTA;
  }

  async updateCallToAction(id: string, cta: Partial<CallToAction>): Promise<CallToAction | undefined> {
    const existing = this.callToActions.get(id);
    if (!existing) return undefined;
    
    const updated: CallToAction = {
      ...existing,
      ...cta,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.callToActions.set(id, updated);
    return updated;
  }

  async deleteCallToAction(id: string): Promise<boolean> {
    return this.callToActions.delete(id);
  }

  // CTA Events Methods
  async createCTAEvent(event: InsertCTAEvent): Promise<CTAEvent> {
    const id = randomUUID();
    const newEvent: CTAEvent = {
      ...event,
      id,
      createdAt: new Date().toISOString(),
    };
    this.ctaEvents.set(id, newEvent);
    return newEvent;
  }

  async getCTAEvents(filters?: { ctaKey?: string; eventType?: string; startDate?: string; endDate?: string }): Promise<CTAEvent[]> {
    let events = Array.from(this.ctaEvents.values());
    
    if (filters?.ctaKey) {
      events = events.filter(e => e.ctaKey === filters.ctaKey);
    }
    if (filters?.eventType) {
      events = events.filter(e => e.eventType === filters.eventType);
    }
    if (filters?.startDate) {
      events = events.filter(e => e.createdAt >= filters.startDate!);
    }
    if (filters?.endDate) {
      events = events.filter(e => e.createdAt <= filters.endDate!);
    }
    
    return events.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getCTAPerformance(): Promise<{ ctaKey: string; clicks: number; qrViews: number; storeRedirects: number }[]> {
    const events = Array.from(this.ctaEvents.values());
    const performance = new Map<string, { clicks: number; qrViews: number; storeRedirects: number }>();
    
    events.forEach(event => {
      if (!performance.has(event.ctaKey)) {
        performance.set(event.ctaKey, { clicks: 0, qrViews: 0, storeRedirects: 0 });
      }
      const stats = performance.get(event.ctaKey)!;
      
      switch (event.eventType) {
        case 'cta_click':
          stats.clicks++;
          break;
        case 'qr_modal_view':
          stats.qrViews++;
          break;
        case 'store_redirect':
          stats.storeRedirects++;
          break;
      }
    });
    
    return Array.from(performance.entries()).map(([ctaKey, stats]) => ({
      ctaKey,
      ...stats,
    }));
  }

  // ============================================
  // NEWSLETTER + SPOTLIGHT + BLOG SYNC MODULE METHODS
  // ============================================

  // Newsletter Methods
  async getNewsletters(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNewsletter(id: string): Promise<Newsletter | undefined> {
    return this.newsletters.get(id);
  }

  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newNewsletter: Newsletter = {
      ...newsletter,
      id,
      htmlOutput: '',
      createdAt: now,
      updatedAt: now,
    };
    this.newsletters.set(id, newNewsletter);
    return newNewsletter;
  }

  async updateNewsletter(id: string, newsletter: Partial<Newsletter>): Promise<Newsletter | undefined> {
    const existing = this.newsletters.get(id);
    if (!existing) return undefined;
    
    const updated: Newsletter = {
      ...existing,
      ...newsletter,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.newsletters.set(id, updated);
    return updated;
  }

  async deleteNewsletter(id: string): Promise<boolean> {
    return this.newsletters.delete(id);
  }

  async getNewsletterByBlogPostId(blogPostId: string): Promise<Newsletter | undefined> {
    return Array.from(this.newsletters.values()).find(n => n.sourceBlogPostId === blogPostId);
  }

  // Newsletter Template Methods
  async getNewsletterTemplates(): Promise<NewsletterTemplate[]> {
    return Array.from(this.newsletterTemplates.values());
  }

  async getNewsletterTemplate(id: string): Promise<NewsletterTemplate | undefined> {
    return this.newsletterTemplates.get(id);
  }

  async createNewsletterTemplate(template: InsertNewsletterTemplate): Promise<NewsletterTemplate> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newTemplate: NewsletterTemplate = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.newsletterTemplates.set(id, newTemplate);
    return newTemplate;
  }

  async updateNewsletterTemplate(id: string, template: Partial<NewsletterTemplate>): Promise<NewsletterTemplate | undefined> {
    const existing = this.newsletterTemplates.get(id);
    if (!existing) return undefined;
    
    const updated: NewsletterTemplate = {
      ...existing,
      ...template,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.newsletterTemplates.set(id, updated);
    return updated;
  }

  async deleteNewsletterTemplate(id: string): Promise<boolean> {
    return this.newsletterTemplates.delete(id);
  }

  // Schema Block Methods
  async getSchemaBlocks(): Promise<SchemaBlock[]> {
    return Array.from(this.schemaBlocks.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getSchemaBlock(id: string): Promise<SchemaBlock | undefined> {
    return this.schemaBlocks.get(id);
  }

  async createSchemaBlock(block: InsertSchemaBlock): Promise<SchemaBlock> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newBlock: SchemaBlock = {
      ...block,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.schemaBlocks.set(id, newBlock);
    return newBlock;
  }

  async updateSchemaBlock(id: string, block: Partial<SchemaBlock>): Promise<SchemaBlock | undefined> {
    const existing = this.schemaBlocks.get(id);
    if (!existing) return undefined;
    const updated: SchemaBlock = {
      ...existing,
      ...block,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.schemaBlocks.set(id, updated);
    return updated;
  }

  async deleteSchemaBlock(id: string): Promise<boolean> {
    return this.schemaBlocks.delete(id);
  }

  // Schema Block Definition Methods
  async getSchemaBlockDefinitions(): Promise<SchemaBlockDefinition[]> {
    return Array.from(this.schemaBlockDefinitions.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getSchemaBlockDefinition(id: string): Promise<SchemaBlockDefinition | undefined> {
    return this.schemaBlockDefinitions.get(id);
  }

  async getSchemaBlockDefinitionByType(blockType: string): Promise<SchemaBlockDefinition | undefined> {
    return Array.from(this.schemaBlockDefinitions.values()).find(def => def.blockType === blockType);
  }

  async createSchemaBlockDefinition(def: InsertSchemaBlockDefinition): Promise<SchemaBlockDefinition> {
    const id = `sbd-${randomUUID()}`;
    const now = new Date().toISOString();
    const newDef: SchemaBlockDefinition = { 
      ...def, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.schemaBlockDefinitions.set(id, newDef);
    return newDef;
  }

  async updateSchemaBlockDefinition(id: string, def: Partial<SchemaBlockDefinition>): Promise<SchemaBlockDefinition | undefined> {
    const existing = this.schemaBlockDefinitions.get(id);
    if (!existing) return undefined;
    const updated: SchemaBlockDefinition = { 
      ...existing, 
      ...def, 
      id, 
      updatedAt: new Date().toISOString() 
    };
    this.schemaBlockDefinitions.set(id, updated);
    return updated;
  }

  async deleteSchemaBlockDefinition(id: string): Promise<boolean> {
    return this.schemaBlockDefinitions.delete(id);
  }

  // Template Block Override Methods
  async getTemplateBlockOverrides(templateId: string): Promise<NewsletterTemplateBlockOverride[]> {
    return Array.from(this.templateBlockOverrides.values())
      .filter(override => override.templateId === templateId)
      .sort((a, b) => a.blockType.localeCompare(b.blockType));
  }

  async getTemplateBlockOverride(templateId: string, blockType: string): Promise<NewsletterTemplateBlockOverride | undefined> {
    return Array.from(this.templateBlockOverrides.values())
      .find(override => override.templateId === templateId && override.blockType === blockType);
  }

  async createTemplateBlockOverride(override: InsertNewsletterTemplateBlockOverride): Promise<NewsletterTemplateBlockOverride> {
    const id = `tbo-${randomUUID()}`;
    const now = new Date().toISOString();
    const newOverride: NewsletterTemplateBlockOverride = { 
      ...override, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.templateBlockOverrides.set(id, newOverride);
    return newOverride;
  }

  async updateTemplateBlockOverride(id: string, override: Partial<NewsletterTemplateBlockOverride>): Promise<NewsletterTemplateBlockOverride | undefined> {
    const existing = this.templateBlockOverrides.get(id);
    if (!existing) return undefined;
    const updated: NewsletterTemplateBlockOverride = { 
      ...existing, 
      ...override, 
      id, 
      updatedAt: new Date().toISOString() 
    };
    this.templateBlockOverrides.set(id, updated);
    return updated;
  }

  async deleteTemplateBlockOverride(id: string): Promise<boolean> {
    return this.templateBlockOverrides.delete(id);
  }

  // Spotlight Banner Methods
  async getSpotlightBanners(): Promise<SpotlightBanner[]> {
    return Array.from(this.spotlightBanners.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getSpotlightBanner(id: string): Promise<SpotlightBanner | undefined> {
    return this.spotlightBanners.get(id);
  }

  async createSpotlightBanner(banner: InsertSpotlightBanner): Promise<SpotlightBanner> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newBanner: SpotlightBanner = {
      ...banner,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.spotlightBanners.set(id, newBanner);
    return newBanner;
  }

  async updateSpotlightBanner(id: string, banner: Partial<SpotlightBanner>): Promise<SpotlightBanner | undefined> {
    const existing = this.spotlightBanners.get(id);
    if (!existing) return undefined;
    
    const updated: SpotlightBanner = {
      ...existing,
      ...banner,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.spotlightBanners.set(id, updated);
    return updated;
  }

  async deleteSpotlightBanner(id: string): Promise<boolean> {
    return this.spotlightBanners.delete(id);
  }

  async getSpotlightByBlogPostId(blogPostId: string): Promise<SpotlightBanner | undefined> {
    return Array.from(this.spotlightBanners.values()).find(b => b.blogPostId === blogPostId);
  }

  async getActiveSpotlights(placement?: string): Promise<SpotlightBanner[]> {
    const now = new Date().toISOString();
    let banners = Array.from(this.spotlightBanners.values())
      .filter(b => b.status === 'active')
      .filter(b => !b.startAt || b.startAt <= now)
      .filter(b => !b.endAt || b.endAt >= now);
    
    if (placement) {
      banners = banners.filter(b => b.placements.includes(placement as any));
    }
    
    return banners;
  }

  // Subscriber Methods
  async getSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getSubscriber(id: string): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newSubscriber: Subscriber = {
      ...subscriber,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async updateSubscriber(id: string, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined> {
    const existing = this.subscribers.get(id);
    if (!existing) return undefined;
    
    const updated: Subscriber = {
      ...existing,
      ...subscriber,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.subscribers.set(id, updated);
    return updated;
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    return this.subscribers.delete(id);
  }

  // Audit Log Methods
  async getAuditLogs(filters?: { entityType?: string; entityId?: string; actionType?: string }): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    
    if (filters?.entityType) {
      logs = logs.filter(l => l.entityType === filters.entityType);
    }
    if (filters?.entityId) {
      logs = logs.filter(l => l.entityId === filters.entityId);
    }
    if (filters?.actionType) {
      logs = logs.filter(l => l.actionType === filters.actionType);
    }
    
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const newLog: AuditLog = {
      ...log,
      id,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.set(id, newLog);
    return newLog;
  }

  // Newsletter Settings Methods
  async getNewsletterSettings(): Promise<NewsletterSettings> {
    return this.newsletterSettings;
  }

  async updateNewsletterSettings(settings: Partial<NewsletterSettings>): Promise<NewsletterSettings> {
    this.newsletterSettings = {
      ...this.newsletterSettings,
      ...settings,
      id: this.newsletterSettings.id,
      updatedAt: new Date().toISOString(),
    };
    return this.newsletterSettings;
  }

  // CMS Team Members
  async getTeamMembers(): Promise<CmsTeamMember[]> {
    return Array.from(this.teamMembers.values());
  }

  async getTeamMember(id: string): Promise<CmsTeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async getTeamMemberByEmail(email: string): Promise<CmsTeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(m => m.email === email);
  }

  async createTeamMember(insertMember: InsertCmsTeamMember): Promise<CmsTeamMember> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const member: CmsTeamMember = {
      ...insertMember,
      id,
      status: 'invited',
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async updateTeamMember(id: string, updates: Partial<CmsTeamMember>): Promise<CmsTeamMember | undefined> {
    const member = this.teamMembers.get(id);
    if (!member) return undefined;
    const updated = { ...member, ...updates, updatedAt: new Date().toISOString() };
    this.teamMembers.set(id, updated);
    return updated;
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  // CMS Settings
  async getCmsSettings(): Promise<CmsSettings> {
    return this.cmsSettings;
  }

  async updateCmsSettings(updates: Partial<CmsSettings>): Promise<CmsSettings> {
    this.cmsSettings = {
      ...this.cmsSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.cmsSettings;
  }

  // Stock SEO Templates
  async getStockSeoTemplates(): Promise<StockSeoTemplates> {
    return this.stockSeoTemplates;
  }

  async updateStockSeoTemplates(updates: Partial<StockSeoTemplates>): Promise<StockSeoTemplates> {
    this.stockSeoTemplates = {
      ...this.stockSeoTemplates,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.stockSeoTemplates;
  }

  // Stories
  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getStory(id: string): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const story: Story = {
      ...insertStory,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStory(id: string, updates: Partial<Story>): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;
    const updated = { ...story, ...updates, updatedAt: new Date().toISOString() };
    this.stories.set(id, updated);
    return updated;
  }

  async deleteStory(id: string): Promise<boolean> {
    return this.stories.delete(id);
  }

  async getStoriesByNewsletterId(newsletterId: string): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(s => s.linkedNewsletterId === newsletterId);
  }

  async linkStoryToSpotlight(storyId: string, spotlightId: string): Promise<Story | undefined> {
    const story = this.stories.get(storyId);
    if (!story) return undefined;
    const updated = { ...story, linkedSpotlightId: spotlightId, updatedAt: new Date().toISOString() };
    this.stories.set(storyId, updated);
    return updated;
  }

  async linkStoryToNewsletter(storyId: string, newsletterId: string): Promise<Story | undefined> {
    const story = this.stories.get(storyId);
    if (!story) return undefined;
    const updated = { ...story, linkedNewsletterId: newsletterId, updatedAt: new Date().toISOString() };
    this.stories.set(storyId, updated);
    return updated;
  }

  // Compliance Checker
  async getComplianceScanRuns(filters?: { contentType?: string; approvalStatus?: string }): Promise<ComplianceScanRun[]> {
    let runs = Array.from(this.complianceScanRuns.values());
    if (filters?.contentType) {
      runs = runs.filter(r => r.contentType === filters.contentType);
    }
    if (filters?.approvalStatus) {
      runs = runs.filter(r => r.approvalStatus === filters.approvalStatus);
    }
    return runs.sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  }

  async getComplianceScanRun(id: string): Promise<ComplianceScanRun | undefined> {
    return this.complianceScanRuns.get(id);
  }

  async createComplianceScanRun(run: InsertComplianceScanRun): Promise<ComplianceScanRun> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    // Run compliance rules to compute findings and score
    const findings = this.runComplianceRules(run.originalText);
    const riskScore = this.calculateRiskScore(findings);
    const complianceScore = Math.max(0, 100 - riskScore);
    const complianceLabel = this.getComplianceLabel(complianceScore);
    
    const scanRun: ComplianceScanRun = {
      ...run,
      id,
      scannedAt: now,
      riskScore,
      complianceScore,
      complianceLabel,
      complianceFindings: findings,
      englishScore: null,
      englishLabel: 'not_configured',
      englishFindings: [],
      englishSuggestedEdits: [],
      approvalStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    this.complianceScanRuns.set(id, scanRun);
    return scanRun;
  }

  private runComplianceRules(text: string): ComplianceFinding[] {
    const findings: ComplianceFinding[] = [];
    const rules = Array.from(this.complianceRules.values()).filter(r => r.enabled && (r.pattern || r.phrase));
    
    for (const rule of rules) {
      try {
        let pattern: string;
        
        // Build regex pattern based on matchType
        if (rule.matchType === 'regex' && rule.pattern) {
          // Use pattern as-is for regex rules
          pattern = rule.pattern;
        } else if (rule.phrase) {
          // Escape special regex chars for phrase-based matching
          const escapedPhrase = rule.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          
          switch (rule.matchType) {
            case 'exact':
              // Word boundary matching for exact phrase
              pattern = `\\b${escapedPhrase}\\b`;
              break;
            case 'contains':
            default:
              // Simple contains matching (case-insensitive)
              pattern = escapedPhrase;
              break;
          }
        } else if (rule.pattern) {
          pattern = rule.pattern;
        } else {
          continue; // No pattern or phrase, skip
        }
        
        const regex = new RegExp(pattern, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          findings.push({
            id: randomUUID(),
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            message: rule.message,
            dfsaRef: rule.dfsaRef,
            startOffset: match.index,
            endOffset: match.index + match[0].length,
            suggestedFix: rule.suggestedFix,
          });
        }
      } catch (e) {
        // Invalid regex, skip
      }
    }
    
    return findings;
  }

  private calculateRiskScore(findings: ComplianceFinding[]): number {
    let score = 0;
    for (const finding of findings) {
      switch (finding.severity) {
        case 'critical': score += 40; break;
        case 'high': score += 25; break;
        case 'medium': score += 15; break;
        case 'low': score += 5; break;
      }
    }
    return Math.min(100, score);
  }

  private getComplianceLabel(score: number): 'compliant' | 'needs_review' | 'high_risk' {
    const thresholds = this.complianceCheckerSettings.complianceThresholds;
    if (score >= thresholds.compliant) return 'compliant';
    if (score >= thresholds.needsReview) return 'needs_review';
    return 'high_risk';
  }

  async updateComplianceScanRun(id: string, updates: Partial<ComplianceScanRun>): Promise<ComplianceScanRun | undefined> {
    const run = this.complianceScanRuns.get(id);
    if (!run) return undefined;
    const updated = { ...run, ...updates, updatedAt: new Date().toISOString() };
    this.complianceScanRuns.set(id, updated);
    return updated;
  }

  async deleteComplianceScanRun(id: string): Promise<boolean> {
    return this.complianceScanRuns.delete(id);
  }

  async getComplianceScanRunsByContentId(contentId: string): Promise<ComplianceScanRun[]> {
    return Array.from(this.complianceScanRuns.values())
      .filter(r => r.contentId === contentId)
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  }

  // Compliance Rules
  async getComplianceRules(): Promise<ComplianceRule[]> {
    return Array.from(this.complianceRules.values());
  }

  async getComplianceRule(id: string): Promise<ComplianceRule | undefined> {
    return this.complianceRules.get(id);
  }

  async createComplianceRule(rule: InsertComplianceRule): Promise<ComplianceRule> {
    const id = randomUUID();
    const now = new Date().toISOString();
    // Auto-generate pattern from phrase and matchType if not provided
    let pattern = rule.pattern || '';
    if (!pattern && rule.phrase) {
      const escapedPhrase = rule.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      switch (rule.matchType) {
        case 'exact':
          pattern = `\\b${escapedPhrase}\\b`;
          break;
        case 'contains':
          pattern = escapedPhrase;
          break;
        case 'regex':
          pattern = rule.phrase; // Use phrase as-is for regex
          break;
      }
    }
    const newRule: ComplianceRule = {
      ...rule,
      id,
      pattern,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };
    this.complianceRules.set(id, newRule);
    return newRule;
  }

  async updateComplianceRule(id: string, updates: Partial<ComplianceRule>): Promise<ComplianceRule | undefined> {
    const rule = this.complianceRules.get(id);
    if (!rule) return undefined;
    const updated = { ...rule, ...updates, updatedAt: new Date().toISOString() };
    this.complianceRules.set(id, updated);
    return updated;
  }

  async deleteComplianceRule(id: string): Promise<boolean> {
    return this.complianceRules.delete(id);
  }

  // Compliance Checker Settings
  async getComplianceCheckerSettings(): Promise<ComplianceCheckerSettings> {
    return this.complianceCheckerSettings;
  }

  async updateComplianceCheckerSettings(settings: Partial<ComplianceCheckerSettings>): Promise<ComplianceCheckerSettings> {
    this.complianceCheckerSettings = { ...this.complianceCheckerSettings, ...settings };
    return this.complianceCheckerSettings;
  }

  // Writing Assistant Integrations
  async getWritingAssistantIntegrations(): Promise<WritingAssistantIntegration[]> {
    return Array.from(this.writingAssistantIntegrations.values());
  }

  async getWritingAssistantIntegration(id: string): Promise<WritingAssistantIntegration | undefined> {
    return this.writingAssistantIntegrations.get(id);
  }

  async getActiveWritingAssistantIntegration(): Promise<WritingAssistantIntegration | undefined> {
    return Array.from(this.writingAssistantIntegrations.values()).find(i => i.isActive);
  }

  async createWritingAssistantIntegration(integration: InsertWritingAssistantIntegration): Promise<WritingAssistantIntegration> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const newIntegration: WritingAssistantIntegration = {
      ...integration,
      id,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    };
    this.writingAssistantIntegrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateWritingAssistantIntegration(id: string, updates: Partial<WritingAssistantIntegration>): Promise<WritingAssistantIntegration | undefined> {
    const integration = this.writingAssistantIntegrations.get(id);
    if (!integration) return undefined;
    const updated = { ...integration, ...updates, updatedAt: new Date().toISOString() };
    this.writingAssistantIntegrations.set(id, updated);
    return updated;
  }

  async deleteWritingAssistantIntegration(id: string): Promise<boolean> {
    return this.writingAssistantIntegrations.delete(id);
  }

  // Block Library Templates
  async getBlockLibraryTemplates(): Promise<BlockLibraryTemplate[]> {
    return Array.from(this.blockLibraryTemplates.values());
  }

  async getBlockLibraryTemplate(id: string): Promise<BlockLibraryTemplate | undefined> {
    return this.blockLibraryTemplates.get(id);
  }

  async createBlockLibraryTemplate(template: InsertBlockLibraryTemplate): Promise<BlockLibraryTemplate> {
    const now = new Date().toISOString();
    const newTemplate: BlockLibraryTemplate = {
      ...template,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.blockLibraryTemplates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async updateBlockLibraryTemplate(id: string, updates: Partial<BlockLibraryTemplate>): Promise<BlockLibraryTemplate | undefined> {
    const template = this.blockLibraryTemplates.get(id);
    if (!template) return undefined;
    const updated: BlockLibraryTemplate = { ...template, ...updates, updatedAt: new Date().toISOString() };
    this.blockLibraryTemplates.set(id, updated);
    return updated;
  }

  async deleteBlockLibraryTemplate(id: string): Promise<boolean> {
    return this.blockLibraryTemplates.delete(id);
  }

  // Ticker Catalog
  async getTickerCatalog(): Promise<TickerCatalogEntry[]> {
    return Array.from(this.tickerCatalog.values());
  }

  async getTickerCatalogEntry(id: string): Promise<TickerCatalogEntry | undefined> {
    return this.tickerCatalog.get(id);
  }

  async getTickerCatalogByTicker(ticker: string): Promise<TickerCatalogEntry | undefined> {
    return Array.from(this.tickerCatalog.values()).find(e => e.ticker.toUpperCase() === ticker.toUpperCase());
  }

  async createTickerCatalogEntry(entry: InsertTickerCatalogEntry): Promise<TickerCatalogEntry> {
    const now = new Date().toISOString();
    const newEntry: TickerCatalogEntry = {
      ...entry,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.tickerCatalog.set(newEntry.id, newEntry);
    return newEntry;
  }

  async updateTickerCatalogEntry(id: string, updates: Partial<TickerCatalogEntry>): Promise<TickerCatalogEntry | undefined> {
    const entry = this.tickerCatalog.get(id);
    if (!entry) return undefined;
    const updated: TickerCatalogEntry = { ...entry, ...updates, updatedAt: new Date().toISOString() };
    this.tickerCatalog.set(id, updated);
    return updated;
  }

  async deleteTickerCatalogEntry(id: string): Promise<boolean> {
    return this.tickerCatalog.delete(id);
  }

  // Newsletter Block Instances
  async getNewsletterBlockInstances(newsletterId: string): Promise<NewsletterBlockInstance[]> {
    return Array.from(this.newsletterBlockInstances.values())
      .filter(instance => instance.newsletterId === newsletterId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getNewsletterBlockInstance(id: string): Promise<NewsletterBlockInstance | undefined> {
    return this.newsletterBlockInstances.get(id);
  }

  async createNewsletterBlockInstance(instance: InsertNewsletterBlockInstance): Promise<NewsletterBlockInstance> {
    const now = new Date().toISOString();
    const newInstance: NewsletterBlockInstance = {
      ...instance,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.newsletterBlockInstances.set(newInstance.id, newInstance);
    return newInstance;
  }

  async updateNewsletterBlockInstance(id: string, updates: Partial<NewsletterBlockInstance>): Promise<NewsletterBlockInstance | undefined> {
    const instance = this.newsletterBlockInstances.get(id);
    if (!instance) return undefined;
    const updated: NewsletterBlockInstance = { ...instance, ...updates, updatedAt: new Date().toISOString() };
    this.newsletterBlockInstances.set(id, updated);
    return updated;
  }

  async deleteNewsletterBlockInstance(id: string): Promise<boolean> {
    return this.newsletterBlockInstances.delete(id);
  }

  async reorderNewsletterBlockInstances(newsletterId: string, orderedIds: string[]): Promise<boolean> {
    const instances = await this.getNewsletterBlockInstances(newsletterId);
    if (instances.length !== orderedIds.length) return false;
    
    for (let i = 0; i < orderedIds.length; i++) {
      const instance = this.newsletterBlockInstances.get(orderedIds[i]);
      if (instance && instance.newsletterId === newsletterId) {
        instance.sortOrder = i;
        instance.updatedAt = new Date().toISOString();
        this.newsletterBlockInstances.set(orderedIds[i], instance);
      }
    }
    return true;
  }

  // Bond Pages
  async getBondPages(): Promise<BondPage[]> {
    return Array.from(this.bondPages.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getBondPage(id: string): Promise<BondPage | undefined> {
    return this.bondPages.get(id);
  }

  async getBondPageBySlug(slug: string): Promise<BondPage | undefined> {
    return Array.from(this.bondPages.values()).find(p => p.slug === slug);
  }

  async createBondPage(page: InsertBondPage): Promise<BondPage> {
    const now = new Date().toISOString();
    const newPage: BondPage = {
      ...page,
      id: randomUUID(),
      pageBuilderJson: page.pageBuilderJson || [...DEFAULT_BOND_PAGE_BLOCKS],
      createdAt: now,
      updatedAt: now,
    };
    this.bondPages.set(newPage.id, newPage);
    return newPage;
  }

  async updateBondPage(id: string, updates: Partial<BondPage>): Promise<BondPage | undefined> {
    const page = this.bondPages.get(id);
    if (!page) return undefined;
    const updated: BondPage = { ...page, ...updates, updatedAt: new Date().toISOString() };
    this.bondPages.set(id, updated);
    return updated;
  }

  async deleteBondPage(id: string): Promise<boolean> {
    return this.bondPages.delete(id);
  }
}

export const storage = new MemStorage();
