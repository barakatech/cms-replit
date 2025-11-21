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
