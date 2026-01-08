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
  type SpotlightBanner,
  type InsertSpotlightBanner,
  type Subscriber,
  type InsertSubscriber,
  type AuditLog,
  type InsertAuditLog,
  type NewsletterSettings,
  BARAKA_STORE_URLS
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

const seedNewsletterTemplates: NewsletterTemplate[] = [
  {
    id: '1',
    name: 'Default English Newsletter',
    description: 'Standard newsletter template for English audience',
    locale: 'en',
    schemaJson: {
      blocks: [
        { type: 'hero', label: 'Hero Banner', required: true },
        { type: 'intro', label: 'Introduction', required: true },
        { type: 'featured', label: 'Featured Content', required: false },
        { type: 'articles', label: 'Article List', required: true },
        { type: 'cta', label: 'Call to Action', required: true },
        { type: 'footer', label: 'Footer', required: true },
      ],
    },
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
    schemaJson: {
      blocks: [
        { type: 'hero', label: 'بانر رئيسي', required: true },
        { type: 'intro', label: 'المقدمة', required: true },
        { type: 'featured', label: 'المحتوى المميز', required: false },
        { type: 'articles', label: 'قائمة المقالات', required: true },
        { type: 'cta', label: 'دعوة للعمل', required: true },
        { type: 'footer', label: 'التذييل', required: true },
      ],
    },
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
    schemaJson: {
      blocks: [
        { type: 'hero', label: 'Promo Hero', required: true },
        { type: 'featured', label: 'Offer Details', required: true },
        { type: 'cta', label: 'Claim Offer CTA', required: true },
        { type: 'footer', label: 'Legal Footer', required: true },
      ],
    },
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
      { type: 'intro', content: 'Welcome to this week\'s market update. Here\'s what you need to know about the latest trends in US stocks.' },
      { type: 'articles', articles: [
        { title: 'AI Stocks Surge Amid Earnings Season', excerpt: 'Tech giants report strong AI revenue growth...', url: '/blog/ai-stocks-surge' },
        { title: 'What the Fed Decision Means for Investors', excerpt: 'Rate pause signals continued growth...', url: '/blog/fed-decision' },
      ]},
      { type: 'cta', ctaText: 'Start Investing Today', ctaUrl: 'https://baraka.com/signup' },
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
      { type: 'intro', content: 'مرحباً بك في تحديث السوق لهذا الأسبوع. إليك ما تحتاج معرفته عن أحدث الاتجاهات في الأسهم الأمريكية.' },
      { type: 'cta', ctaText: 'ابدأ الاستثمار اليوم', ctaUrl: 'https://baraka.com/signup' },
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
      { type: 'featured', title: 'Understanding Halal Investing', content: 'A comprehensive guide to Shariah-compliant stock selection...', imageUrl: '/images/halal-guide.jpg' },
      { type: 'cta', ctaText: 'Read Full Article', ctaUrl: '/blog/understanding-halal-investing' },
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
    this.newsletters = new Map();
    this.newsletterTemplates = new Map();
    this.spotlightBanners = new Map();
    this.subscribers = new Map();
    this.auditLogs = new Map();
    this.newsletterSettings = { ...seedNewsletterSettings };
    
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
}

export const storage = new MemStorage();
