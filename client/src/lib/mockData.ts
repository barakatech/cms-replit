export type StockStatus = 'draft' | 'in_review' | 'published';

export interface StockPage {
  id: string;
  ticker: string;
  companyName: string;
  languages: ('en' | 'ar')[];
  status: StockStatus;
  lastUpdated: string;
  metadata: {
    en: { title: string; description: string };
    ar: { title: string; description: string };
  };
  indexed: boolean;
  content: {
    en: {
      overview: string;
      thesis: string;
      risks: string;
      faqs: Array<{ question: string; answer: string }>;
      highlights: string;
    };
    ar: {
      overview: string;
      thesis: string;
      risks: string;
      faqs: Array<{ question: string; answer: string }>;
      highlights: string;
    };
  };
  dynamicData: {
    price: number;
    change: number;
    changePercent: number;
    marketCap: string;
    volume: string;
    pe: string;
    eps: string;
    dividend: string;
    sentiment: { buy: number; hold: number; sell: number };
    performance: { '1D': number; '1W': number; '1M': number; '1Y': number };
  };
  internalLinks: {
    autoSuggestions: Array<{ ticker: string; reason: string }>;
    manual: string[];
  };
}

export const mockStocks: StockPage[] = [
  {
    id: '1',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2024-01-15',
    metadata: {
      en: {
        title: 'Apple Inc. (AAPL) Stock - Buy Apple Shares on baraka',
        description: 'Invest in Apple Inc. (AAPL) on baraka. Get real-time prices, market data, and expert analysis for one of the world\'s leading technology companies.',
      },
      ar: {
        title: 'سهم شركة آبل (AAPL) - اشترِ أسهم آبل على بركة',
        description: 'استثمر في شركة آبل (AAPL) على بركة. احصل على الأسعار الفورية وبيانات السوق والتحليلات المتخصصة لواحدة من الشركات التقنية الرائدة في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Apple Inc. is a multinational technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company is known for its innovative products including iPhone, Mac, iPad, Apple Watch, and AirPods.',
        thesis: 'Apple represents a compelling investment opportunity due to its strong brand loyalty, ecosystem lock-in effect, growing services revenue, and consistent innovation. The company\'s massive cash reserves and capital return program provide additional shareholder value.',
        risks: 'Key risks include high dependency on iPhone sales, regulatory scrutiny in multiple jurisdictions, supply chain vulnerabilities, and intense competition in the smartphone and wearables markets.',
        faqs: [
          { question: 'What is Apple\'s main source of revenue?', answer: 'iPhone sales account for the majority of Apple\'s revenue, though services are growing rapidly.' },
          { question: 'Does Apple pay dividends?', answer: 'Yes, Apple pays a quarterly dividend to shareholders.' },
        ],
        highlights: 'Market leader in premium smartphones, Strong services growth, Robust ecosystem, Excellent brand value',
      },
      ar: {
        overview: 'شركة آبل هي شركة تقنية متعددة الجنسيات تصمم وتصنع وتسوق الهواتف الذكية وأجهزة الكمبيوتر الشخصية والأجهزة اللوحية والأجهزة القابلة للارتداء والإكسسوارات في جميع أنحاء العالم.',
        thesis: 'تمثل آبل فرصة استثمارية مقنعة بفضل ولاء علامتها التجارية القوي، وتأثير النظام البيئي المغلق، ونمو إيرادات الخدمات، والابتكار المستمر.',
        risks: 'تشمل المخاطر الرئيسية الاعتماد الكبير على مبيعات آيفون، والتدقيق التنظيمي في ولايات قضائية متعددة، ونقاط الضعف في سلسلة التوريد.',
        faqs: [
          { question: 'ما هو المصدر الرئيسي لإيرادات آبل؟', answer: 'تمثل مبيعات آيفون غالبية إيرادات آبل، على الرغم من أن الخدمات تنمو بسرعة.' },
          { question: 'هل تدفع آبل أرباحاً؟', answer: 'نعم، تدفع آبل أرباحاً ربع سنوية للمساهمين.' },
        ],
        highlights: 'رائدة السوق في الهواتف الذكية الفاخرة، نمو قوي في الخدمات، نظام بيئي قوي، قيمة علامة تجارية ممتازة',
      },
    },
    dynamicData: {
      price: 185.64,
      change: 2.34,
      changePercent: 1.28,
      marketCap: '$2.85T',
      volume: '52.3M',
      pe: '29.8',
      eps: '$6.23',
      dividend: '0.53%',
      sentiment: { buy: 65, hold: 28, sell: 7 },
      performance: { '1D': 1.28, '1W': 3.45, '1M': -2.1, '1Y': 28.5 },
    },
    internalLinks: {
      autoSuggestions: [
        { ticker: 'MSFT', reason: 'Same sector' },
        { ticker: 'GOOGL', reason: 'Users also traded' },
        { ticker: 'NVDA', reason: 'Similar market cap' },
      ],
      manual: ['TSLA', 'AMZN'],
    },
  },
  {
    id: '2',
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    languages: ['en'],
    status: 'in_review',
    lastUpdated: '2024-01-14',
    metadata: {
      en: {
        title: 'Tesla Inc. (TSLA) Stock - Invest in Tesla on baraka',
        description: 'Trade Tesla (TSLA) stock on baraka. Access real-time data, market insights, and analysis for the world\'s leading electric vehicle manufacturer.',
      },
      ar: {
        title: 'سهم تسلا (TSLA) - استثمر في تسلا على بركة',
        description: 'تداول سهم تسلا (TSLA) على بركة. احصل على البيانات الفورية ورؤى السوق والتحليلات لأكبر شركة مصنعة للسيارات الكهربائية في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Tesla, Inc. designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems. The company operates through two segments: Automotive and Energy Generation and Storage.',
        thesis: 'Tesla leads the EV revolution with superior technology, expanding production capacity, and growing energy storage business. The company\'s vertical integration and software capabilities provide competitive advantages.',
        risks: 'Risks include execution challenges in scaling production, increasing competition from traditional automakers, dependence on key personnel, and regulatory changes affecting EV incentives.',
        faqs: [
          { question: 'What vehicles does Tesla produce?', answer: 'Tesla produces Model S, Model 3, Model X, Model Y, and Cybertruck.' },
          { question: 'Is Tesla profitable?', answer: 'Yes, Tesla has been profitable on a GAAP basis since 2020.' },
        ],
        highlights: 'EV market leader, Innovative technology, Expanding Gigafactory network, Growing energy business',
      },
      ar: {
        overview: 'تصمم شركة تسلا وتطور وتصنع وتبيع السيارات الكهربائية وأنظمة توليد وتخزين الطاقة.',
        thesis: 'تقود تسلا ثورة السيارات الكهربائية بتقنية متفوقة وقدرة إنتاجية متوسعة وأعمال تخزين طاقة متنامية.',
        risks: 'تشمل المخاطر تحديات التنفيذ في توسيع نطاق الإنتاج، والمنافسة المتزايدة من صانعي السيارات التقليديين.',
        faqs: [
          { question: 'ما هي السيارات التي تنتجها تسلا؟', answer: 'تنتج تسلا موديل S وموديل 3 وموديل X وموديل Y وسايبرتراك.' },
        ],
        highlights: 'رائدة سوق السيارات الكهربائية، تقنية مبتكرة، شبكة جيجافاكتوري متوسعة',
      },
    },
    dynamicData: {
      price: 242.84,
      change: -5.21,
      changePercent: -2.1,
      marketCap: '$771B',
      volume: '98.7M',
      pe: '68.2',
      eps: '$3.56',
      dividend: 'N/A',
      sentiment: { buy: 48, hold: 35, sell: 17 },
      performance: { '1D': -2.1, '1W': -4.2, '1M': 8.3, '1Y': 102.4 },
    },
    internalLinks: {
      autoSuggestions: [
        { ticker: 'RIVN', reason: 'Same sector' },
        { ticker: 'F', reason: 'EV competitors' },
        { ticker: 'GM', reason: 'Auto industry' },
      ],
      manual: ['NIO', 'LCID'],
    },
  },
  {
    id: '3',
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    languages: ['en', 'ar'],
    status: 'draft',
    lastUpdated: '2024-01-13',
    metadata: {
      en: {
        title: 'Microsoft Corporation (MSFT) - Trade Microsoft Stock',
        description: 'Invest in Microsoft (MSFT) on baraka. Real-time prices and comprehensive analysis for the leading cloud computing and software company.',
      },
      ar: {
        title: 'شركة مايكروسوفت (MSFT) - تداول سهم مايكروسوفت',
        description: 'استثمر في مايكروسوفت (MSFT) على بركة. أسعار فورية وتحليل شامل لشركة الحوسبة السحابية والبرمجيات الرائدة.',
      },
    },
    indexed: false,
    content: {
      en: {
        overview: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. Key products include Windows, Office 365, Azure, LinkedIn, and Xbox.',
        thesis: 'Microsoft offers strong growth potential through its dominant Azure cloud platform, successful transition to subscription-based software, and AI integration across products.',
        risks: 'Competition in cloud services from AWS and Google Cloud, cybersecurity threats, regulatory scrutiny, and potential slowdown in PC market.',
        faqs: [
          { question: 'What is Microsoft\'s fastest growing business?', answer: 'Azure cloud services is Microsoft\'s fastest growing segment.' },
        ],
        highlights: 'Cloud computing leader, Strong enterprise relationships, Diversified revenue streams',
      },
      ar: {
        overview: 'تقوم شركة مايكروسوفت بتطوير وترخيص ودعم البرامج والخدمات والأجهزة والحلول في جميع أنحاء العالم.',
        thesis: 'تقدم مايكروسوفت إمكانات نمو قوية من خلال منصة Azure السحابية المهيمنة.',
        risks: 'المنافسة في الخدمات السحابية من AWS وGoogle Cloud، والتهديدات الأمنية السيبرانية.',
        faqs: [],
        highlights: 'رائدة الحوسبة السحابية، علاقات قوية مع الشركات',
      },
    },
    dynamicData: {
      price: 378.91,
      change: 4.52,
      changePercent: 1.21,
      marketCap: '$2.82T',
      volume: '21.5M',
      pe: '35.4',
      eps: '$10.71',
      dividend: '0.82%',
      sentiment: { buy: 72, hold: 23, sell: 5 },
      performance: { '1D': 1.21, '1W': 2.8, '1M': 5.6, '1Y': 52.3 },
    },
    internalLinks: {
      autoSuggestions: [
        { ticker: 'AAPL', reason: 'Same sector' },
        { ticker: 'GOOGL', reason: 'Cloud competitors' },
      ],
      manual: [],
    },
  },
];

export interface Asset {
  id: string;
  fileName: string;
  type: 'image' | 'video' | 'document';
  thumbnail: string;
  isPublic: boolean;
  altText: { en: string; ar: string };
  uploadDate: string;
}

// Blog types and mock data
export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: BlogStatus;
  publishDate: string;
  lastUpdated: string;
  readTime: number;
  seoTitle: { en: string; ar: string };
  seoDescription: { en: string; ar: string };
}

export const mockBlogs: BlogPost[] = [
  {
    id: '1',
    slug: 'understanding-stock-market-basics',
    title: {
      en: 'Understanding Stock Market Basics: A Beginner\'s Guide',
      ar: 'فهم أساسيات سوق الأسهم: دليل المبتدئين',
    },
    excerpt: {
      en: 'Learn the fundamental concepts of stock market investing, from understanding what stocks are to how markets operate.',
      ar: 'تعلم المفاهيم الأساسية للاستثمار في سوق الأسهم، من فهم ماهية الأسهم إلى كيفية عمل الأسواق.',
    },
    content: {
      en: 'The stock market is a complex but fascinating system that allows individuals and institutions to buy and sell shares of publicly traded companies...',
      ar: 'سوق الأسهم هو نظام معقد ولكنه رائع يسمح للأفراد والمؤسسات بشراء وبيع أسهم الشركات المتداولة علنًا...',
    },
    author: 'Sarah Ahmed',
    category: 'Education',
    tags: ['investing', 'stocks', 'beginners'],
    featuredImage: '/images/stock-basics.jpg',
    status: 'published',
    publishDate: '2024-01-10',
    lastUpdated: '2024-01-10',
    readTime: 8,
    seoTitle: {
      en: 'Stock Market Basics Guide | baraka',
      ar: 'دليل أساسيات سوق الأسهم | بركة',
    },
    seoDescription: {
      en: 'Master the basics of stock market investing with our comprehensive guide for beginners.',
      ar: 'أتقن أساسيات الاستثمار في سوق الأسهم مع دليلنا الشامل للمبتدئين.',
    },
  },
  {
    id: '2',
    slug: 'top-tech-stocks-2024',
    title: {
      en: 'Top Tech Stocks to Watch in 2024',
      ar: 'أفضل أسهم التكنولوجيا للمتابعة في 2024',
    },
    excerpt: {
      en: 'Discover the most promising technology stocks that could shape your investment portfolio this year.',
      ar: 'اكتشف أسهم التكنولوجيا الواعدة التي يمكن أن تشكل محفظتك الاستثمارية هذا العام.',
    },
    content: {
      en: 'As we enter 2024, the technology sector continues to be a driving force in the global economy. From AI advancements to cloud computing...',
      ar: 'مع دخولنا عام 2024، يستمر قطاع التكنولوجيا في كونه قوة دافعة في الاقتصاد العالمي. من التطورات في الذكاء الاصطناعي إلى الحوسبة السحابية...',
    },
    author: 'Mohammed Khan',
    category: 'Analysis',
    tags: ['technology', 'stocks', '2024', 'investing'],
    featuredImage: '/images/tech-stocks.jpg',
    status: 'published',
    publishDate: '2024-01-05',
    lastUpdated: '2024-01-08',
    readTime: 12,
    seoTitle: {
      en: 'Best Tech Stocks 2024 | baraka',
      ar: 'أفضل أسهم التكنولوجيا 2024 | بركة',
    },
    seoDescription: {
      en: 'Explore top technology stocks for 2024 with expert analysis and insights.',
      ar: 'استكشف أفضل أسهم التكنولوجيا لعام 2024 مع تحليلات ورؤى الخبراء.',
    },
  },
  {
    id: '3',
    slug: 'dividend-investing-strategy',
    title: {
      en: 'Building Wealth Through Dividend Investing',
      ar: 'بناء الثروة من خلال الاستثمار في توزيعات الأرباح',
    },
    excerpt: {
      en: 'Learn how dividend investing can provide steady income and long-term wealth building opportunities.',
      ar: 'تعلم كيف يمكن للاستثمار في توزيعات الأرباح أن يوفر دخلاً ثابتًا وفرصًا لبناء الثروة على المدى الطويل.',
    },
    content: {
      en: 'Dividend investing is a time-tested strategy that focuses on purchasing stocks that regularly distribute profits to shareholders...',
      ar: 'الاستثمار في توزيعات الأرباح هو استراتيجية مجربة تركز على شراء الأسهم التي توزع الأرباح بانتظام على المساهمين...',
    },
    author: 'Fatima Al-Hassan',
    category: 'Strategy',
    tags: ['dividends', 'passive income', 'investing'],
    featuredImage: '/images/dividends.jpg',
    status: 'draft',
    publishDate: '',
    lastUpdated: '2024-01-12',
    readTime: 10,
    seoTitle: {
      en: 'Dividend Investing Guide | baraka',
      ar: 'دليل الاستثمار في توزيعات الأرباح | بركة',
    },
    seoDescription: {
      en: 'Discover how to build wealth through strategic dividend investing.',
      ar: 'اكتشف كيفية بناء الثروة من خلال الاستثمار الاستراتيجي في توزيعات الأرباح.',
    },
  },
];

// Banner types and mock data
export type BannerType = 'hero' | 'promotional' | 'announcement' | 'feature';
export type BannerStatus = 'active' | 'scheduled' | 'inactive' | 'expired';

export interface Banner {
  id: string;
  name: string;
  type: BannerType;
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  ctaText: { en: string; ar: string };
  ctaUrl: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  status: BannerStatus;
  placement: string[];
  startDate: string;
  endDate: string;
  priority: number;
  targetAudience: string;
  clickCount: number;
  impressions: number;
}

export const mockBanners: Banner[] = [
  {
    id: '1',
    name: 'New Year Trading Promotion',
    type: 'hero',
    title: {
      en: 'Start 2024 with Zero Commission Trading',
      ar: 'ابدأ 2024 مع تداول بدون عمولة',
    },
    subtitle: {
      en: 'Trade US stocks with zero commission for the first 30 days',
      ar: 'تداول الأسهم الأمريكية بدون عمولة لأول 30 يومًا',
    },
    ctaText: {
      en: 'Start Trading',
      ar: 'ابدأ التداول',
    },
    ctaUrl: '/signup',
    backgroundImage: '/images/banner-newyear.jpg',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    status: 'active',
    placement: ['home-hero', 'dashboard'],
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    priority: 1,
    targetAudience: 'new-users',
    clickCount: 1250,
    impressions: 45000,
  },
  {
    id: '2',
    name: 'Apple Stock Feature',
    type: 'promotional',
    title: {
      en: 'Apple Q1 Earnings Alert',
      ar: 'تنبيه أرباح آبل للربع الأول',
    },
    subtitle: {
      en: 'Get ready for Apple\'s Q1 earnings report. Set up price alerts now.',
      ar: 'استعد لتقرير أرباح آبل للربع الأول. قم بإعداد تنبيهات الأسعار الآن.',
    },
    ctaText: {
      en: 'Set Alert',
      ar: 'إعداد التنبيه',
    },
    ctaUrl: '/stocks/AAPL',
    backgroundImage: '/images/banner-apple.jpg',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    status: 'active',
    placement: ['stock-pages', 'blog'],
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    priority: 2,
    targetAudience: 'all-users',
    clickCount: 890,
    impressions: 28000,
  },
  {
    id: '3',
    name: 'Referral Program',
    type: 'announcement',
    title: {
      en: 'Refer Friends & Earn Rewards',
      ar: 'أحل أصدقاءك واكسب مكافآت',
    },
    subtitle: {
      en: 'Earn up to $100 for each friend who joins baraka',
      ar: 'اربح حتى 100 دولار عن كل صديق ينضم إلى بركة',
    },
    ctaText: {
      en: 'Invite Now',
      ar: 'ادعُ الآن',
    },
    ctaUrl: '/referral',
    backgroundImage: '',
    backgroundColor: '#4f46e5',
    textColor: '#ffffff',
    status: 'scheduled',
    placement: ['dashboard', 'settings'],
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    priority: 3,
    targetAudience: 'existing-users',
    clickCount: 0,
    impressions: 0,
  },
  {
    id: '4',
    name: 'Market Hours Update',
    type: 'feature',
    title: {
      en: 'Extended Trading Hours Now Available',
      ar: 'ساعات التداول الممتدة متاحة الآن',
    },
    subtitle: {
      en: 'Trade before and after regular market hours',
      ar: 'تداول قبل وبعد ساعات السوق العادية',
    },
    ctaText: {
      en: 'Learn More',
      ar: 'اعرف المزيد',
    },
    ctaUrl: '/features/extended-hours',
    backgroundImage: '/images/banner-hours.jpg',
    backgroundColor: '#059669',
    textColor: '#ffffff',
    status: 'inactive',
    placement: ['home', 'dashboard'],
    startDate: '2024-01-10',
    endDate: '2024-12-31',
    priority: 4,
    targetAudience: 'all-users',
    clickCount: 520,
    impressions: 18000,
  },
];

export const mockAssets: Asset[] = [
  {
    id: '1',
    fileName: 'apple-headquarters.jpg',
    type: 'image',
    thumbnail: '🏢',
    isPublic: true,
    altText: { en: 'Apple headquarters building', ar: 'مبنى مقر شركة آبل' },
    uploadDate: '2024-01-10',
  },
  {
    id: '2',
    fileName: 'tesla-model-y.jpg',
    type: 'image',
    thumbnail: '🚗',
    isPublic: true,
    altText: { en: 'Tesla Model Y electric vehicle', ar: 'سيارة تسلا موديل Y الكهربائية' },
    uploadDate: '2024-01-09',
  },
  {
    id: '3',
    fileName: 'market-analysis-q4.pdf',
    type: 'document',
    thumbnail: '📄',
    isPublic: false,
    altText: { en: 'Q4 Market Analysis Report', ar: 'تقرير تحليل السوق للربع الرابع' },
    uploadDate: '2024-01-08',
  },
  {
    id: '4',
    fileName: 'product-demo.mp4',
    type: 'video',
    thumbnail: '🎥',
    isPublic: true,
    altText: { en: 'Product demonstration video', ar: 'فيديو توضيحي للمنتج' },
    uploadDate: '2024-01-07',
  },
];
