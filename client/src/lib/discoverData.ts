export interface StockCollection {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  tickers: string[];
  heroImage?: string;
  order: number;
  status: 'active' | 'inactive';
  icon: string;
}

export interface DiscoverStocksSettings {
  heroTitle: { en: string; ar: string };
  heroSubtitle: { en: string; ar: string };
  trendingTickers: string[];
  gainersTickers: string[];
  losersTickers: string[];
  featuredTickers: string[];
  showSparkline: boolean;
}

export interface BlogHomeSettings {
  featuredPostId: string;
  categoryOrder: string[];
  mostReadPostIds: string[];
}

export const mockStockCollections: StockCollection[] = [
  {
    id: '1',
    slug: 'ai-semiconductors',
    title: { en: 'AI & Semiconductors', ar: 'الذكاء الاصطناعي وأشباه الموصلات' },
    description: { en: 'Companies leading the AI and chip revolution', ar: 'الشركات الرائدة في ثورة الذكاء الاصطناعي والرقائق' },
    tickers: ['NVDA', 'AMD', 'TSM', 'ASML', 'AVGO', 'INTC'],
    order: 1,
    status: 'active',
    icon: '🤖',
  },
  {
    id: '2',
    slug: 'ev-mobility',
    title: { en: 'EV & Mobility', ar: 'السيارات الكهربائية والتنقل' },
    description: { en: 'Electric vehicle and future mobility leaders', ar: 'رواد السيارات الكهربائية والتنقل المستقبلي' },
    tickers: ['TSLA', 'NIO', 'RIVN', 'LCID', 'GM', 'F'],
    order: 2,
    status: 'active',
    icon: '🚗',
  },
  {
    id: '3',
    slug: 'tech-giants',
    title: { en: 'Tech Giants', ar: 'عمالقة التكنولوجيا' },
    description: { en: 'The largest technology companies by market cap', ar: 'أكبر شركات التكنولوجيا من حيث القيمة السوقية' },
    tickers: ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NFLX'],
    order: 3,
    status: 'active',
    icon: '💻',
  },
  {
    id: '4',
    slug: 'fintech',
    title: { en: 'Fintech & Payments', ar: 'التكنولوجيا المالية والمدفوعات' },
    description: { en: 'Companies transforming financial services', ar: 'الشركات التي تحول الخدمات المالية' },
    tickers: ['V', 'MA', 'PYPL', 'SQ', 'JPM', 'BAC'],
    order: 4,
    status: 'active',
    icon: '💳',
  },
  {
    id: '5',
    slug: 'dividend-stocks',
    title: { en: 'Dividend Champions', ar: 'أبطال توزيعات الأرباح' },
    description: { en: 'Reliable dividend-paying stocks', ar: 'أسهم توزيعات الأرباح الموثوقة' },
    tickers: ['KO', 'PEP', 'JNJ', 'PG', 'XOM', 'CVX'],
    order: 5,
    status: 'active',
    icon: '💰',
  },
  {
    id: '6',
    slug: 'healthcare',
    title: { en: 'Healthcare & Pharma', ar: 'الرعاية الصحية والأدوية' },
    description: { en: 'Leading healthcare and pharmaceutical companies', ar: 'شركات الرعاية الصحية والأدوية الرائدة' },
    tickers: ['UNH', 'JNJ', 'PG', 'COST', 'WMT', 'HD'],
    order: 6,
    status: 'active',
    icon: '🏥',
  },
  {
    id: '7',
    slug: 'retail-consumer',
    title: { en: 'Retail & Consumer', ar: 'التجزئة والمستهلك' },
    description: { en: 'Top retail and consumer goods companies', ar: 'أفضل شركات التجزئة والسلع الاستهلاكية' },
    tickers: ['WMT', 'COST', 'HD', 'AMZN', 'DIS', 'NFLX'],
    order: 7,
    status: 'active',
    icon: '🛒',
  },
  {
    id: '8',
    slug: 'energy',
    title: { en: 'Energy & Oil', ar: 'الطاقة والنفط' },
    description: { en: 'Major energy and oil companies', ar: 'شركات الطاقة والنفط الكبرى' },
    tickers: ['XOM', 'CVX', 'TSLA', 'GM', 'F', 'RIVN'],
    order: 8,
    status: 'active',
    icon: '⛽',
  },
];

export const mockDiscoverStocksSettings: DiscoverStocksSettings = {
  heroTitle: {
    en: 'Discover stocks',
    ar: 'اكتشف الأسهم',
  },
  heroSubtitle: {
    en: 'Explore popular companies and market themes',
    ar: 'استكشف الشركات الشائعة وموضوعات السوق',
  },
  trendingTickers: ['TSLA', 'NVDA', 'AAPL', 'AMZN', 'MSFT', 'GOOGL', 'META', 'AMD'],
  gainersTickers: ['NVDA', 'RIVN', 'AMD', 'META', 'XOM', 'CVX', 'JPM', 'BAC'],
  losersTickers: ['NIO', 'LCID', 'PYPL', 'INTC', 'NFLX', 'PEP', 'AVGO', 'TSLA'],
  featuredTickers: ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD', 'NFLX', 'DIS', 'V', 'JPM'],
  showSparkline: true,
};

export const mockBlogHomeSettings: BlogHomeSettings = {
  featuredPostId: '2',
  categoryOrder: ['Education', 'Analysis', 'Strategy', 'News'],
  mostReadPostIds: ['1', '2', '3'],
};

export const blogCategories = [
  { id: 'education', name: { en: 'Education', ar: 'التعليم' }, slug: 'education' },
  { id: 'analysis', name: { en: 'Analysis', ar: 'التحليل' }, slug: 'analysis' },
  { id: 'strategy', name: { en: 'Strategy', ar: 'الاستراتيجية' }, slug: 'strategy' },
  { id: 'news', name: { en: 'News', ar: 'الأخبار' }, slug: 'news' },
  { id: 'beginners', name: { en: 'Beginner Guides', ar: 'أدلة المبتدئين' }, slug: 'beginners' },
  { id: 'etfs', name: { en: 'ETFs', ar: 'الصناديق المتداولة' }, slug: 'etfs' },
];
