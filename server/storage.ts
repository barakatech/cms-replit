import { 
  type User, 
  type InsertUser, 
  type InsertPriceAlertSubscription, 
  type PriceAlertSubscription,
  type InsertNewsletterSignup,
  type NewsletterSignup,
  type DiscoverSettings,
  type StockTheme,
  type OfferBanner
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private priceAlertSubscriptions: Map<string, PriceAlertSubscription>;
  private newsletterSignups: Map<string, NewsletterSignup>;
  private discoverSettings: DiscoverSettings;
  private stockThemes: StockTheme[];
  private offerBanners: OfferBanner[];

  constructor() {
    this.users = new Map();
    this.priceAlertSubscriptions = new Map();
    this.newsletterSignups = new Map();
    this.discoverSettings = { ...seedDiscoverSettings };
    this.stockThemes = [...seedStockThemes];
    this.offerBanners = [...seedOfferBanners];
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
}

export const storage = new MemStorage();
