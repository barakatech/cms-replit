export type StockStatus = 'draft' | 'in_review' | 'published';

export interface CompanyMeta {
  ceo: string;
  employees: string;
  headquarters: string;
  founded: string;
}

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
  companyMeta?: CompanyMeta;
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
    companyMeta: {
      ceo: 'Tim Cook',
      employees: '164,000',
      headquarters: 'Cupertino, CA',
      founded: '1976',
    },
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
  {
    id: '4',
    ticker: 'META',
    companyName: 'Meta Platforms, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Meta Platforms (META) Stock - Buy Meta Shares on baraka',
        description: 'Invest in Meta Platforms (META) on baraka. Get real-time prices, market data, and expert analysis for the world\'s leading social media and metaverse company.',
      },
      ar: {
        title: 'سهم ميتا بلاتفورمز (META) - اشترِ أسهم ميتا على بركة',
        description: 'استثمر في ميتا بلاتفورمز (META) على بركة. احصل على الأسعار الفورية وبيانات السوق والتحليلات المتخصصة لأكبر شركة وسائط اجتماعية وميتافيرس في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Meta Platforms, Inc. (formerly Facebook, Inc.) is an American multinational technology conglomerate headquartered in Menlo Park, California. The company owns and operates Facebook, Instagram, Threads, and WhatsApp, among other products and services. Meta is also investing heavily in virtual and augmented reality through its Reality Labs division.',
        thesis: 'Meta represents a compelling investment opportunity due to its dominant position in social media, massive user base of over 3 billion people, growing advertising business, and ambitious metaverse strategy. The company\'s AI investments and Reels product are driving engagement and revenue growth.',
        risks: 'Key risks include regulatory scrutiny around data privacy and antitrust concerns, competition from TikTok and other platforms, heavy spending on Reality Labs with uncertain returns, and dependence on advertising revenue.',
        faqs: [
          { question: 'What is Meta\'s main source of revenue?', answer: 'Advertising revenue from Facebook and Instagram accounts for the vast majority of Meta\'s revenue.' },
          { question: 'Does Meta pay dividends?', answer: 'Meta initiated its first-ever dividend in 2024, signaling confidence in its cash flow generation.' },
          { question: 'What is the metaverse?', answer: 'The metaverse is Meta\'s vision for immersive virtual experiences, powered by VR/AR technology through products like Meta Quest.' },
        ],
        highlights: 'Social media dominance, 3B+ monthly users, Growing AI capabilities, Metaverse pioneer, Strong cash flow',
      },
      ar: {
        overview: 'ميتا بلاتفورمز هي تكتل تقني أمريكي متعدد الجنسيات يقع مقرها في مينلو بارك، كاليفورنيا. تمتلك الشركة وتدير فيسبوك وإنستغرام وثريدز وواتساب، من بين منتجات وخدمات أخرى.',
        thesis: 'تمثل ميتا فرصة استثمارية مقنعة بفضل موقعها المهيمن في وسائل التواصل الاجتماعي وقاعدة المستخدمين الضخمة التي تتجاوز 3 مليارات شخص.',
        risks: 'تشمل المخاطر الرئيسية التدقيق التنظيمي حول خصوصية البيانات ومخاوف مكافحة الاحتكار، والمنافسة من تيك توك ومنصات أخرى.',
        faqs: [
          { question: 'ما هو المصدر الرئيسي لإيرادات ميتا؟', answer: 'تمثل إيرادات الإعلانات من فيسبوك وإنستغرام الغالبية العظمى من إيرادات ميتا.' },
          { question: 'هل تدفع ميتا أرباحاً؟', answer: 'بدأت ميتا في دفع أرباح لأول مرة في 2024.' },
        ],
        highlights: 'هيمنة وسائل التواصل الاجتماعي، أكثر من 3 مليار مستخدم شهري، قدرات ذكاء اصطناعي متنامية',
      },
    },
    dynamicData: {
      price: 524.36,
      change: 8.72,
      changePercent: 1.69,
      marketCap: '$1.35T',
      volume: '18.2M',
      pe: '27.4',
      eps: '$19.14',
      dividend: '0.42%',
      sentiment: { buy: 78, hold: 18, sell: 4 },
      performance: { '1D': 1.69, '1W': 4.2, '1M': 12.3, '1Y': 185.6 },
    },
    internalLinks: {
      autoSuggestions: [
        { ticker: 'GOOGL', reason: 'Advertising competitors' },
        { ticker: 'SNAP', reason: 'Social media sector' },
        { ticker: 'PINS', reason: 'Digital advertising' },
      ],
      manual: ['AAPL', 'MSFT', 'AMZN'],
    },
  },
  {
    id: '5',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Alphabet Inc. (GOOGL) Stock - Buy Google Shares on baraka',
        description: 'Invest in Alphabet Inc. (GOOGL) on baraka. Get real-time prices and analysis for the parent company of Google.',
      },
      ar: {
        title: 'سهم ألفابت (GOOGL) - اشترِ أسهم جوجل على بركة',
        description: 'استثمر في ألفابت (GOOGL) على بركة. احصل على الأسعار الفورية والتحليلات للشركة الأم لجوجل.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Alphabet Inc. is a multinational technology conglomerate and the parent company of Google. It operates through segments including Google Search, YouTube, Cloud, and Other Bets which includes Waymo and Verily.',
        thesis: 'Alphabet dominates digital advertising through Google Search and YouTube, while Google Cloud is rapidly growing. The company\'s AI investments position it well for the future.',
        risks: 'Key risks include regulatory antitrust scrutiny, dependence on advertising revenue, and competition in AI from Microsoft and others.',
        faqs: [
          { question: 'What is Alphabet\'s main revenue source?', answer: 'Google advertising, including Search and YouTube ads, generates the majority of revenue.' },
          { question: 'Does Alphabet pay dividends?', answer: 'Alphabet initiated its first-ever dividend in 2024.' },
        ],
        highlights: 'Search dominance, YouTube leader, Growing cloud business, AI innovation',
      },
      ar: {
        overview: 'ألفابت هي تكتل تقني متعدد الجنسيات والشركة الأم لجوجل.',
        thesis: 'تهيمن ألفابت على الإعلانات الرقمية من خلال بحث جوجل ويوتيوب.',
        risks: 'تشمل المخاطر التدقيق التنظيمي لمكافحة الاحتكار والاعتماد على إيرادات الإعلانات.',
        faqs: [{ question: 'ما هو المصدر الرئيسي لإيرادات ألفابت؟', answer: 'إعلانات جوجل بما في ذلك البحث ويوتيوب.' }],
        highlights: 'هيمنة البحث، رائدة يوتيوب، أعمال سحابية متنامية',
      },
    },
    dynamicData: {
      price: 175.82,
      change: 2.15,
      changePercent: 1.24,
      marketCap: '$2.18T',
      volume: '24.5M',
      pe: '25.2',
      eps: '$6.98',
      dividend: '0.48%',
      sentiment: { buy: 75, hold: 20, sell: 5 },
      performance: { '1D': 1.24, '1W': 3.2, '1M': 8.5, '1Y': 58.3 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'META', reason: 'Advertising competitors' }], manual: ['MSFT', 'AMZN'] },
  },
  {
    id: '6',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'NVIDIA (NVDA) Stock - Buy NVIDIA Shares on baraka',
        description: 'Invest in NVIDIA (NVDA) on baraka. The leader in AI chips and graphics processing.',
      },
      ar: {
        title: 'سهم إنفيديا (NVDA) - اشترِ أسهم إنفيديا على بركة',
        description: 'استثمر في إنفيديا (NVDA) على بركة. الرائدة في رقائق الذكاء الاصطناعي ومعالجة الرسومات.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'NVIDIA Corporation designs and manufactures graphics processing units (GPUs) and system-on-chip units. The company is the dominant force in AI accelerators powering data centers worldwide.',
        thesis: 'NVIDIA is the undisputed leader in AI computing with its GPUs being essential for training and running AI models. Data center revenue is exploding.',
        risks: 'High valuation, customer concentration, potential competition from custom AI chips by major tech companies.',
        faqs: [
          { question: 'Why is NVIDIA important for AI?', answer: 'NVIDIA GPUs are the primary hardware used to train and run AI models.' },
          { question: 'What is NVIDIA\'s main product?', answer: 'Data center GPUs for AI and gaming graphics cards.' },
        ],
        highlights: 'AI chip leader, Data center dominance, Gaming GPUs, Software ecosystem',
      },
      ar: {
        overview: 'إنفيديا تصمم وتصنع وحدات معالجة الرسومات ووحدات النظام على الرقاقة.',
        thesis: 'إنفيديا هي الرائدة في حوسبة الذكاء الاصطناعي.',
        risks: 'التقييم المرتفع وتركز العملاء والمنافسة المحتملة.',
        faqs: [{ question: 'لماذا إنفيديا مهمة للذكاء الاصطناعي؟', answer: 'معالجات إنفيديا هي الأجهزة الأساسية لتدريب وتشغيل نماذج الذكاء الاصطناعي.' }],
        highlights: 'رائدة رقائق الذكاء الاصطناعي، هيمنة مراكز البيانات',
      },
    },
    dynamicData: {
      price: 875.42,
      change: 15.23,
      changePercent: 1.77,
      marketCap: '$2.15T',
      volume: '45.2M',
      pe: '65.4',
      eps: '$13.38',
      dividend: '0.03%',
      sentiment: { buy: 85, hold: 12, sell: 3 },
      performance: { '1D': 1.77, '1W': 5.8, '1M': 18.2, '1Y': 245.6 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'AMD', reason: 'Chip competitors' }], manual: ['TSM', 'AVGO'] },
  },
  {
    id: '7',
    ticker: 'AMD',
    companyName: 'Advanced Micro Devices, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'AMD (AMD) Stock - Buy AMD Shares on baraka',
        description: 'Invest in AMD on baraka. A leader in CPUs and GPUs for computing and gaming.',
      },
      ar: {
        title: 'سهم AMD - اشترِ أسهم AMD على بركة',
        description: 'استثمر في AMD على بركة. رائدة في معالجات الحوسبة والألعاب.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'AMD designs and manufactures high-performance computing and graphics products including CPUs, GPUs, and data center chips.',
        thesis: 'AMD is gaining market share from Intel in CPUs and competing with NVIDIA in AI accelerators.',
        risks: 'Competition from Intel and NVIDIA, cyclical semiconductor industry.',
        faqs: [{ question: 'What does AMD make?', answer: 'CPUs for computers and servers, GPUs for gaming and AI.' }],
        highlights: 'CPU market share gains, AI accelerator growth, Strong data center presence',
      },
      ar: {
        overview: 'AMD تصمم وتصنع منتجات الحوسبة عالية الأداء والرسومات.',
        thesis: 'AMD تكتسب حصة سوقية من إنتل في المعالجات.',
        risks: 'المنافسة من إنتل وإنفيديا.',
        faqs: [{ question: 'ماذا تصنع AMD؟', answer: 'معالجات للحواسيب والخوادم ومعالجات رسومات للألعاب والذكاء الاصطناعي.' }],
        highlights: 'مكاسب حصة سوق المعالجات، نمو مسرعات الذكاء الاصطناعي',
      },
    },
    dynamicData: {
      price: 162.35,
      change: 3.42,
      changePercent: 2.15,
      marketCap: '$262B',
      volume: '52.3M',
      pe: '45.2',
      eps: '$3.59',
      dividend: 'N/A',
      sentiment: { buy: 70, hold: 25, sell: 5 },
      performance: { '1D': 2.15, '1W': 4.5, '1M': 12.3, '1Y': 85.2 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'NVDA', reason: 'Chip competitors' }], manual: ['INTC'] },
  },
  {
    id: '8',
    ticker: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Amazon (AMZN) Stock - Buy Amazon Shares on baraka',
        description: 'Invest in Amazon (AMZN) on baraka. The e-commerce and cloud computing giant.',
      },
      ar: {
        title: 'سهم أمازون (AMZN) - اشترِ أسهم أمازون على بركة',
        description: 'استثمر في أمازون على بركة. عملاق التجارة الإلكترونية والحوسبة السحابية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Amazon.com is the world\'s largest online retailer and a leading cloud computing provider through Amazon Web Services (AWS).',
        thesis: 'Amazon dominates e-commerce and cloud computing. AWS is highly profitable and growing.',
        risks: 'Regulatory scrutiny, competition in retail and cloud, margin pressure.',
        faqs: [{ question: 'What is AWS?', answer: 'Amazon Web Services is Amazon\'s cloud computing platform, the largest in the world.' }],
        highlights: 'E-commerce leader, AWS cloud dominance, Prime ecosystem, Advertising growth',
      },
      ar: {
        overview: 'أمازون هي أكبر تاجر تجزئة عبر الإنترنت في العالم ومزود رائد للحوسبة السحابية.',
        thesis: 'تهيمن أمازون على التجارة الإلكترونية والحوسبة السحابية.',
        risks: 'التدقيق التنظيمي والمنافسة في التجزئة والسحابة.',
        faqs: [{ question: 'ما هو AWS؟', answer: 'خدمات أمازون ويب هي منصة الحوسبة السحابية لأمازون.' }],
        highlights: 'رائدة التجارة الإلكترونية، هيمنة AWS السحابية',
      },
    },
    dynamicData: {
      price: 185.42,
      change: 2.85,
      changePercent: 1.56,
      marketCap: '$1.92T',
      volume: '38.5M',
      pe: '42.5',
      eps: '$4.36',
      dividend: 'N/A',
      sentiment: { buy: 78, hold: 18, sell: 4 },
      performance: { '1D': 1.56, '1W': 3.8, '1M': 9.2, '1Y': 62.4 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'MSFT', reason: 'Cloud competitors' }], manual: ['GOOGL', 'WMT'] },
  },
  {
    id: '9',
    ticker: 'NFLX',
    companyName: 'Netflix, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Netflix (NFLX) Stock - Buy Netflix Shares on baraka',
        description: 'Invest in Netflix (NFLX) on baraka. The streaming entertainment leader.',
      },
      ar: {
        title: 'سهم نتفليكس (NFLX) - اشترِ أسهم نتفليكس على بركة',
        description: 'استثمر في نتفليكس على بركة. رائدة البث الترفيهي.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Netflix is the world\'s leading streaming entertainment service with over 260 million paid memberships.',
        thesis: 'Netflix leads streaming with strong content and growing ad-supported tier.',
        risks: 'Intense competition from Disney+, content costs, market saturation.',
        faqs: [{ question: 'How does Netflix make money?', answer: 'Primarily through monthly subscription fees and advertising on its ad-supported tier.' }],
        highlights: 'Streaming leader, Original content, Global reach, Ad-tier growth',
      },
      ar: {
        overview: 'نتفليكس هي خدمة البث الترفيهي الرائدة في العالم.',
        thesis: 'تقود نتفليكس البث بمحتوى قوي.',
        risks: 'منافسة شديدة من ديزني+ وتكاليف المحتوى.',
        faqs: [{ question: 'كيف تجني نتفليكس المال؟', answer: 'بشكل رئيسي من رسوم الاشتراك الشهرية والإعلانات.' }],
        highlights: 'رائدة البث، محتوى أصلي، انتشار عالمي',
      },
    },
    dynamicData: {
      price: 628.45,
      change: -8.32,
      changePercent: -1.31,
      marketCap: '$272B',
      volume: '4.2M',
      pe: '38.5',
      eps: '$16.32',
      dividend: 'N/A',
      sentiment: { buy: 62, hold: 30, sell: 8 },
      performance: { '1D': -1.31, '1W': 2.1, '1M': 8.5, '1Y': 72.3 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'DIS', reason: 'Streaming competitors' }], manual: ['GOOGL'] },
  },
  {
    id: '10',
    ticker: 'INTC',
    companyName: 'Intel Corporation',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Intel (INTC) Stock - Buy Intel Shares on baraka',
        description: 'Invest in Intel (INTC) on baraka. A semiconductor and chip manufacturing company.',
      },
      ar: {
        title: 'سهم إنتل (INTC) - اشترِ أسهم إنتل على بركة',
        description: 'استثمر في إنتل على بركة. شركة أشباه الموصلات وتصنيع الرقائق.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Intel Corporation designs and manufactures computing and related products including CPUs and foundry services.',
        thesis: 'Intel is rebuilding its manufacturing capabilities and competing in AI chips.',
        risks: 'Lost market share to AMD, behind in AI, heavy capex for foundry.',
        faqs: [{ question: 'What is Intel known for?', answer: 'Intel is historically the largest maker of PC and server CPUs.' }],
        highlights: 'CPU heritage, Foundry ambitions, US manufacturing',
      },
      ar: {
        overview: 'إنتل تصمم وتصنع منتجات الحوسبة بما في ذلك المعالجات.',
        thesis: 'إنتل تعيد بناء قدراتها التصنيعية.',
        risks: 'فقدان حصة السوق لصالح AMD والتأخر في الذكاء الاصطناعي.',
        faqs: [{ question: 'بماذا تشتهر إنتل؟', answer: 'إنتل تاريخياً أكبر صانع لمعالجات الحواسيب والخوادم.' }],
        highlights: 'تراث المعالجات، طموحات المسبك',
      },
    },
    dynamicData: {
      price: 42.85,
      change: -0.92,
      changePercent: -2.1,
      marketCap: '$181B',
      volume: '32.5M',
      pe: '25.8',
      eps: '$1.66',
      dividend: '1.42%',
      sentiment: { buy: 35, hold: 45, sell: 20 },
      performance: { '1D': -2.1, '1W': -4.5, '1M': -8.2, '1Y': -15.3 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'AMD', reason: 'Chip competitors' }], manual: ['NVDA'] },
  },
  {
    id: '11',
    ticker: 'AVGO',
    companyName: 'Broadcom Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Broadcom (AVGO) Stock - Buy Broadcom Shares on baraka',
        description: 'Invest in Broadcom (AVGO) on baraka. A semiconductor and infrastructure software leader.',
      },
      ar: {
        title: 'سهم برودكوم (AVGO) - اشترِ أسهم برودكوم على بركة',
        description: 'استثمر في برودكوم على بركة. رائدة أشباه الموصلات وبرامج البنية التحتية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Broadcom designs and supplies semiconductor and infrastructure software products serving the data center, networking, and broadband markets.',
        thesis: 'Broadcom benefits from AI infrastructure buildout and VMware acquisition.',
        risks: 'Customer concentration, integration of VMware, cyclical chip demand.',
        faqs: [{ question: 'What does Broadcom make?', answer: 'Networking chips, custom AI accelerators, and enterprise software.' }],
        highlights: 'Networking leadership, Custom AI chips, VMware acquisition',
      },
      ar: {
        overview: 'برودكوم تصمم وتورد منتجات أشباه الموصلات وبرامج البنية التحتية.',
        thesis: 'برودكوم تستفيد من بناء البنية التحتية للذكاء الاصطناعي.',
        risks: 'تركز العملاء ودمج VMware.',
        faqs: [{ question: 'ماذا تصنع برودكوم؟', answer: 'رقائق الشبكات ومسرعات الذكاء الاصطناعي المخصصة.' }],
        highlights: 'ريادة الشبكات، رقائق الذكاء الاصطناعي المخصصة',
      },
    },
    dynamicData: {
      price: 1285.42,
      change: 18.35,
      changePercent: 1.45,
      marketCap: '$595B',
      volume: '2.8M',
      pe: '32.5',
      eps: '$39.55',
      dividend: '1.52%',
      sentiment: { buy: 72, hold: 23, sell: 5 },
      performance: { '1D': 1.45, '1W': 4.2, '1M': 12.8, '1Y': 95.6 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'NVDA', reason: 'AI chip makers' }], manual: ['AMD'] },
  },
  {
    id: '12',
    ticker: 'ASML',
    companyName: 'ASML Holding N.V.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'ASML (ASML) Stock - Buy ASML Shares on baraka',
        description: 'Invest in ASML (ASML) on baraka. The sole maker of advanced chip manufacturing equipment.',
      },
      ar: {
        title: 'سهم ASML - اشترِ أسهم ASML على بركة',
        description: 'استثمر في ASML على بركة. الصانع الوحيد لمعدات تصنيع الرقائق المتقدمة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'ASML is the only company in the world that makes extreme ultraviolet (EUV) lithography machines needed to make advanced chips.',
        thesis: 'ASML has a monopoly on EUV machines essential for cutting-edge chips.',
        risks: 'Geopolitical tensions, export restrictions to China, cyclical demand.',
        faqs: [{ question: 'Why is ASML unique?', answer: 'ASML is the sole maker of EUV machines needed for advanced chip manufacturing.' }],
        highlights: 'EUV monopoly, Critical to chip industry, Strong backlog',
      },
      ar: {
        overview: 'ASML هي الشركة الوحيدة في العالم التي تصنع آلات الطباعة الحجرية بالأشعة فوق البنفسجية الشديدة.',
        thesis: 'ASML لديها احتكار لآلات EUV الضرورية للرقائق المتطورة.',
        risks: 'التوترات الجيوسياسية وقيود التصدير للصين.',
        faqs: [{ question: 'لماذا ASML فريدة؟', answer: 'ASML هي الصانع الوحيد لآلات EUV اللازمة لتصنيع الرقائق المتقدمة.' }],
        highlights: 'احتكار EUV، حاسمة لصناعة الرقائق',
      },
    },
    dynamicData: {
      price: 892.35,
      change: 12.45,
      changePercent: 1.42,
      marketCap: '$358B',
      volume: '1.2M',
      pe: '42.8',
      eps: '$20.85',
      dividend: '0.85%',
      sentiment: { buy: 78, hold: 18, sell: 4 },
      performance: { '1D': 1.42, '1W': 3.5, '1M': 8.2, '1Y': 45.8 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'TSM', reason: 'Chip manufacturing' }], manual: ['NVDA'] },
  },
  {
    id: '13',
    ticker: 'TSM',
    companyName: 'Taiwan Semiconductor Manufacturing',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'TSMC (TSM) Stock - Buy TSMC Shares on baraka',
        description: 'Invest in TSMC (TSM) on baraka. The world\'s largest chip manufacturer.',
      },
      ar: {
        title: 'سهم TSMC - اشترِ أسهم TSMC على بركة',
        description: 'استثمر في TSMC على بركة. أكبر مصنع للرقائق في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'TSMC is the world\'s largest semiconductor foundry, manufacturing chips for Apple, NVIDIA, AMD, and many others.',
        thesis: 'TSMC dominates advanced chip manufacturing and benefits from AI chip demand.',
        risks: 'Geopolitical risk with Taiwan, customer concentration, heavy capex.',
        faqs: [{ question: 'Who does TSMC make chips for?', answer: 'Apple, NVIDIA, AMD, Qualcomm, and most major chip designers.' }],
        highlights: 'Foundry leader, Advanced node expertise, AI chip manufacturer',
      },
      ar: {
        overview: 'TSMC هي أكبر مصنع أشباه موصلات في العالم.',
        thesis: 'تهيمن TSMC على تصنيع الرقائق المتقدمة.',
        risks: 'المخاطر الجيوسياسية مع تايوان وتركز العملاء.',
        faqs: [{ question: 'لمن تصنع TSMC الرقائق؟', answer: 'آبل وإنفيديا وAMD وكوالكوم ومعظم مصممي الرقائق الرئيسيين.' }],
        highlights: 'رائدة المسابك، خبرة العقد المتقدمة',
      },
    },
    dynamicData: {
      price: 172.85,
      change: 3.25,
      changePercent: 1.92,
      marketCap: '$896B',
      volume: '12.5M',
      pe: '28.5',
      eps: '$6.07',
      dividend: '1.25%',
      sentiment: { buy: 82, hold: 15, sell: 3 },
      performance: { '1D': 1.92, '1W': 4.8, '1M': 15.2, '1Y': 78.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'ASML', reason: 'Chip equipment' }], manual: ['NVDA', 'AMD'] },
  },
  {
    id: '14',
    ticker: 'NIO',
    companyName: 'NIO Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'NIO (NIO) Stock - Buy NIO Shares on baraka',
        description: 'Invest in NIO (NIO) on baraka. A leading Chinese electric vehicle manufacturer.',
      },
      ar: {
        title: 'سهم NIO - اشترِ أسهم NIO على بركة',
        description: 'استثمر في NIO على بركة. شركة سيارات كهربائية صينية رائدة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'NIO is a Chinese electric vehicle manufacturer known for premium EVs and innovative battery swap technology.',
        thesis: 'NIO is a leader in China\'s growing EV market with unique battery swap stations.',
        risks: 'Intense competition, Chinese market challenges, cash burn.',
        faqs: [{ question: 'What is NIO\'s battery swap?', answer: 'NIO offers battery swap stations where drivers can exchange depleted batteries in minutes.' }],
        highlights: 'Premium EV brand, Battery swap technology, Growing deliveries',
      },
      ar: {
        overview: 'NIO هي شركة صينية لتصنيع السيارات الكهربائية.',
        thesis: 'NIO رائدة في سوق السيارات الكهربائية المتنامي في الصين.',
        risks: 'منافسة شديدة وتحديات السوق الصينية.',
        faqs: [{ question: 'ما هو تبديل البطارية من NIO؟', answer: 'تقدم NIO محطات تبديل البطاريات حيث يمكن للسائقين تبديل البطاريات في دقائق.' }],
        highlights: 'علامة تجارية فاخرة للسيارات الكهربائية، تقنية تبديل البطاريات',
      },
    },
    dynamicData: {
      price: 5.82,
      change: -0.18,
      changePercent: -3.0,
      marketCap: '$11.2B',
      volume: '48.5M',
      pe: 'N/A',
      eps: '-$1.42',
      dividend: 'N/A',
      sentiment: { buy: 42, hold: 38, sell: 20 },
      performance: { '1D': -3.0, '1W': -8.2, '1M': -15.5, '1Y': -42.3 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'TSLA', reason: 'EV competitors' }], manual: ['RIVN', 'LCID'] },
  },
  {
    id: '15',
    ticker: 'RIVN',
    companyName: 'Rivian Automotive, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Rivian (RIVN) Stock - Buy Rivian Shares on baraka',
        description: 'Invest in Rivian (RIVN) on baraka. An American electric vehicle and adventure brand.',
      },
      ar: {
        title: 'سهم ريفيان (RIVN) - اشترِ أسهم ريفيان على بركة',
        description: 'استثمر في ريفيان على بركة. علامة أمريكية للسيارات الكهربائية والمغامرة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Rivian is an American electric vehicle manufacturer focused on adventure vehicles including the R1T pickup and R1S SUV.',
        thesis: 'Rivian targets the premium adventure EV market with differentiated products.',
        risks: 'Production challenges, cash burn, competition from legacy automakers.',
        faqs: [{ question: 'What vehicles does Rivian make?', answer: 'R1T electric pickup truck and R1S electric SUV.' }],
        highlights: 'Adventure EV focus, Amazon partnership, Strong brand',
      },
      ar: {
        overview: 'ريفيان هي شركة أمريكية لتصنيع السيارات الكهربائية.',
        thesis: 'تستهدف ريفيان سوق سيارات المغامرة الكهربائية الفاخرة.',
        risks: 'تحديات الإنتاج واستهلاك النقد.',
        faqs: [{ question: 'ما هي السيارات التي تصنعها ريفيان؟', answer: 'شاحنة R1T الكهربائية وسيارة R1S الرياضية.' }],
        highlights: 'تركيز على سيارات المغامرة، شراكة أمازون',
      },
    },
    dynamicData: {
      price: 18.45,
      change: 0.85,
      changePercent: 4.83,
      marketCap: '$18.5B',
      volume: '28.5M',
      pe: 'N/A',
      eps: '-$5.82',
      dividend: 'N/A',
      sentiment: { buy: 48, hold: 35, sell: 17 },
      performance: { '1D': 4.83, '1W': 8.5, '1M': -5.2, '1Y': -28.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'TSLA', reason: 'EV competitors' }], manual: ['NIO', 'LCID'] },
  },
  {
    id: '16',
    ticker: 'LCID',
    companyName: 'Lucid Group, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Lucid (LCID) Stock - Buy Lucid Shares on baraka',
        description: 'Invest in Lucid (LCID) on baraka. A luxury electric vehicle manufacturer.',
      },
      ar: {
        title: 'سهم لوسيد (LCID) - اشترِ أسهم لوسيد على بركة',
        description: 'استثمر في لوسيد على بركة. شركة سيارات كهربائية فاخرة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Lucid is a luxury EV manufacturer known for the Lucid Air sedan with industry-leading range.',
        thesis: 'Lucid targets the luxury EV segment with superior technology and range.',
        risks: 'Production scaling challenges, high cash burn, competition.',
        faqs: [{ question: 'What is Lucid known for?', answer: 'The Lucid Air has the longest range of any EV and luxury features.' }],
        highlights: 'Industry-leading range, Luxury focus, Saudi backing',
      },
      ar: {
        overview: 'لوسيد هي شركة سيارات كهربائية فاخرة.',
        thesis: 'تستهدف لوسيد قطاع السيارات الكهربائية الفاخرة.',
        risks: 'تحديات توسيع الإنتاج واستهلاك النقد العالي.',
        faqs: [{ question: 'بماذا تشتهر لوسيد؟', answer: 'سيارة Lucid Air لديها أطول مدى لأي سيارة كهربائية.' }],
        highlights: 'أطول مدى في الصناعة، تركيز على الفخامة',
      },
    },
    dynamicData: {
      price: 3.25,
      change: -0.12,
      changePercent: -3.56,
      marketCap: '$7.2B',
      volume: '35.2M',
      pe: 'N/A',
      eps: '-$2.15',
      dividend: 'N/A',
      sentiment: { buy: 32, hold: 42, sell: 26 },
      performance: { '1D': -3.56, '1W': -8.5, '1M': -18.2, '1Y': -55.3 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'TSLA', reason: 'EV competitors' }], manual: ['RIVN'] },
  },
  {
    id: '17',
    ticker: 'GM',
    companyName: 'General Motors Company',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'GM (GM) Stock - Buy General Motors Shares on baraka',
        description: 'Invest in General Motors (GM) on baraka. An American automotive manufacturer.',
      },
      ar: {
        title: 'سهم جنرال موتورز (GM) - اشترِ أسهم جنرال موتورز على بركة',
        description: 'استثمر في جنرال موتورز على بركة. شركة سيارات أمريكية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'General Motors is one of the largest automakers globally, transitioning to electric vehicles with its Ultium platform.',
        thesis: 'GM is aggressively transitioning to EVs with strong brands like Chevrolet and Cadillac.',
        risks: 'EV transition execution, legacy costs, competition from Tesla.',
        faqs: [{ question: 'What EV brands does GM have?', answer: 'Chevrolet, GMC, Cadillac, and BrightDrop commercial vehicles.' }],
        highlights: 'Strong brands, EV transition, Profitable ICE business',
      },
      ar: {
        overview: 'جنرال موتورز هي واحدة من أكبر شركات السيارات في العالم.',
        thesis: 'تتحول جنرال موتورز بقوة إلى السيارات الكهربائية.',
        risks: 'تنفيذ التحول للكهرباء والتكاليف القديمة.',
        faqs: [{ question: 'ما هي علامات جنرال موتورز الكهربائية؟', answer: 'شيفروليه وجي إم سي وكاديلاك.' }],
        highlights: 'علامات قوية، تحول للكهرباء',
      },
    },
    dynamicData: {
      price: 42.85,
      change: 0.92,
      changePercent: 2.19,
      marketCap: '$48.5B',
      volume: '12.5M',
      pe: '5.8',
      eps: '$7.39',
      dividend: '1.05%',
      sentiment: { buy: 58, hold: 32, sell: 10 },
      performance: { '1D': 2.19, '1W': 4.5, '1M': 8.2, '1Y': 25.6 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'F', reason: 'Auto competitors' }], manual: ['TSLA'] },
  },
  {
    id: '18',
    ticker: 'F',
    companyName: 'Ford Motor Company',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Ford (F) Stock - Buy Ford Shares on baraka',
        description: 'Invest in Ford (F) on baraka. An iconic American automotive manufacturer.',
      },
      ar: {
        title: 'سهم فورد (F) - اشترِ أسهم فورد على بركة',
        description: 'استثمر في فورد على بركة. شركة سيارات أمريكية أسطورية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Ford is one of America\'s largest automakers, known for F-Series trucks and transitioning to EVs with the Mustang Mach-E and F-150 Lightning.',
        thesis: 'Ford has strong truck franchise and is investing heavily in EVs.',
        risks: 'EV losses, competition, UAW labor costs.',
        faqs: [{ question: 'What is Ford\'s best-selling vehicle?', answer: 'The F-150 is the best-selling vehicle in America for decades.' }],
        highlights: 'F-Series dominance, EV investments, Strong dividend',
      },
      ar: {
        overview: 'فورد هي واحدة من أكبر شركات السيارات الأمريكية.',
        thesis: 'فورد لديها امتياز شاحنات قوي وتستثمر بكثافة في السيارات الكهربائية.',
        risks: 'خسائر الكهرباء والمنافسة وتكاليف العمالة.',
        faqs: [{ question: 'ما هي السيارة الأكثر مبيعاً لفورد؟', answer: 'F-150 هي السيارة الأكثر مبيعاً في أمريكا لعقود.' }],
        highlights: 'هيمنة F-Series، استثمارات الكهرباء',
      },
    },
    dynamicData: {
      price: 12.45,
      change: 0.28,
      changePercent: 2.3,
      marketCap: '$49.8B',
      volume: '42.5M',
      pe: '6.2',
      eps: '$2.01',
      dividend: '4.82%',
      sentiment: { buy: 52, hold: 38, sell: 10 },
      performance: { '1D': 2.3, '1W': 3.8, '1M': 5.2, '1Y': 12.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'GM', reason: 'Auto competitors' }], manual: ['TSLA'] },
  },
  {
    id: '19',
    ticker: 'V',
    companyName: 'Visa Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Visa (V) Stock - Buy Visa Shares on baraka',
        description: 'Invest in Visa (V) on baraka. The world\'s largest payment network.',
      },
      ar: {
        title: 'سهم فيزا (V) - اشترِ أسهم فيزا على بركة',
        description: 'استثمر في فيزا على بركة. أكبر شبكة مدفوعات في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Visa operates the world\'s largest retail electronic payments network, facilitating money movement globally.',
        thesis: 'Visa benefits from global shift to digital payments and cross-border transactions.',
        risks: 'Regulatory scrutiny, competition from fintech, economic sensitivity.',
        faqs: [{ question: 'How does Visa make money?', answer: 'Visa charges fees on transactions processed through its network.' }],
        highlights: 'Payment network leader, Global reach, High margins',
      },
      ar: {
        overview: 'تدير فيزا أكبر شبكة مدفوعات إلكترونية في العالم.',
        thesis: 'تستفيد فيزا من التحول العالمي للمدفوعات الرقمية.',
        risks: 'التدقيق التنظيمي والمنافسة من التكنولوجيا المالية.',
        faqs: [{ question: 'كيف تجني فيزا المال؟', answer: 'تفرض فيزا رسوماً على المعاملات المعالجة عبر شبكتها.' }],
        highlights: 'رائدة شبكات الدفع، انتشار عالمي',
      },
    },
    dynamicData: {
      price: 285.42,
      change: 3.85,
      changePercent: 1.37,
      marketCap: '$578B',
      volume: '6.5M',
      pe: '28.5',
      eps: '$10.02',
      dividend: '0.78%',
      sentiment: { buy: 75, hold: 22, sell: 3 },
      performance: { '1D': 1.37, '1W': 2.8, '1M': 6.5, '1Y': 22.3 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'MA', reason: 'Payment networks' }], manual: ['PYPL'] },
  },
  {
    id: '20',
    ticker: 'MA',
    companyName: 'Mastercard Incorporated',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Mastercard (MA) Stock - Buy Mastercard Shares on baraka',
        description: 'Invest in Mastercard (MA) on baraka. A global payment technology company.',
      },
      ar: {
        title: 'سهم ماستركارد (MA) - اشترِ أسهم ماستركارد على بركة',
        description: 'استثمر في ماستركارد على بركة. شركة تكنولوجيا مدفوعات عالمية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Mastercard operates a global payments network connecting consumers, financial institutions, and merchants.',
        thesis: 'Mastercard benefits from secular shift to digital payments worldwide.',
        risks: 'Regulatory pressure, fintech competition, economic downturns.',
        faqs: [{ question: 'Is Mastercard a bank?', answer: 'No, Mastercard operates the payment network but doesn\'t issue cards or extend credit.' }],
        highlights: 'Global payment network, High margins, Duopoly position',
      },
      ar: {
        overview: 'تدير ماستركارد شبكة مدفوعات عالمية.',
        thesis: 'تستفيد ماستركارد من التحول للمدفوعات الرقمية.',
        risks: 'الضغط التنظيمي ومنافسة التكنولوجيا المالية.',
        faqs: [{ question: 'هل ماستركارد بنك؟', answer: 'لا، ماستركارد تدير شبكة الدفع لكنها لا تصدر بطاقات.' }],
        highlights: 'شبكة دفع عالمية، هوامش عالية',
      },
    },
    dynamicData: {
      price: 478.25,
      change: 5.42,
      changePercent: 1.15,
      marketCap: '$445B',
      volume: '2.8M',
      pe: '32.5',
      eps: '$14.71',
      dividend: '0.58%',
      sentiment: { buy: 72, hold: 25, sell: 3 },
      performance: { '1D': 1.15, '1W': 2.5, '1M': 5.8, '1Y': 18.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'V', reason: 'Payment networks' }], manual: ['PYPL'] },
  },
  {
    id: '21',
    ticker: 'PYPL',
    companyName: 'PayPal Holdings, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'PayPal (PYPL) Stock - Buy PayPal Shares on baraka',
        description: 'Invest in PayPal (PYPL) on baraka. A digital payments platform.',
      },
      ar: {
        title: 'سهم باي بال (PYPL) - اشترِ أسهم باي بال على بركة',
        description: 'استثمر في باي بال على بركة. منصة مدفوعات رقمية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'PayPal operates a digital payments platform including PayPal, Venmo, and Braintree services.',
        thesis: 'PayPal is repositioning for growth with new leadership and Venmo monetization.',
        risks: 'Competition from Apple Pay, declining margins, user growth slowdown.',
        faqs: [{ question: 'What is Venmo?', answer: 'Venmo is PayPal\'s popular peer-to-peer payment app.' }],
        highlights: 'Digital payments pioneer, Venmo growth, Checkout presence',
      },
      ar: {
        overview: 'تدير باي بال منصة مدفوعات رقمية.',
        thesis: 'باي بال تعيد وضع نفسها للنمو مع قيادة جديدة.',
        risks: 'المنافسة من Apple Pay وانخفاض الهوامش.',
        faqs: [{ question: 'ما هو Venmo؟', answer: 'Venmo هو تطبيق الدفع الشهير من نظير إلى نظير من باي بال.' }],
        highlights: 'رائدة المدفوعات الرقمية، نمو Venmo',
      },
    },
    dynamicData: {
      price: 68.42,
      change: -1.85,
      changePercent: -2.63,
      marketCap: '$72.5B',
      volume: '12.5M',
      pe: '18.5',
      eps: '$3.70',
      dividend: 'N/A',
      sentiment: { buy: 45, hold: 42, sell: 13 },
      performance: { '1D': -2.63, '1W': -5.2, '1M': 2.5, '1Y': -8.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'SQ', reason: 'Digital payments' }], manual: ['V', 'MA'] },
  },
  {
    id: '22',
    ticker: 'SQ',
    companyName: 'Block, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Block (SQ) Stock - Buy Block Shares on baraka',
        description: 'Invest in Block (SQ) on baraka. A fintech company formerly known as Square.',
      },
      ar: {
        title: 'سهم بلوك (SQ) - اشترِ أسهم بلوك على بركة',
        description: 'استثمر في بلوك على بركة. شركة تكنولوجيا مالية كانت تعرف سابقاً باسم سكوير.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Block (formerly Square) provides payment processing, Cash App consumer services, and Bitcoin services.',
        thesis: 'Block is growing Cash App and exploring Bitcoin/blockchain opportunities.',
        risks: 'Competition, Bitcoin volatility exposure, regulatory scrutiny.',
        faqs: [{ question: 'What is Cash App?', answer: 'Cash App is Block\'s consumer payment app for sending money and investing.' }],
        highlights: 'Cash App growth, Merchant services, Bitcoin integration',
      },
      ar: {
        overview: 'بلوك (سكوير سابقاً) توفر معالجة المدفوعات وخدمات Cash App.',
        thesis: 'بلوك تنمي Cash App وتستكشف فرص البيتكوين.',
        risks: 'المنافسة والتعرض لتقلبات البيتكوين.',
        faqs: [{ question: 'ما هو Cash App؟', answer: 'Cash App هو تطبيق الدفع الاستهلاكي من بلوك لإرسال الأموال والاستثمار.' }],
        highlights: 'نمو Cash App، خدمات التجار',
      },
    },
    dynamicData: {
      price: 72.85,
      change: 1.42,
      changePercent: 1.99,
      marketCap: '$42.5B',
      volume: '8.5M',
      pe: '45.2',
      eps: '$1.61',
      dividend: 'N/A',
      sentiment: { buy: 55, hold: 35, sell: 10 },
      performance: { '1D': 1.99, '1W': 5.2, '1M': 12.5, '1Y': 25.8 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'PYPL', reason: 'Digital payments' }], manual: ['V'] },
  },
  {
    id: '23',
    ticker: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'JPMorgan (JPM) Stock - Buy JPMorgan Shares on baraka',
        description: 'Invest in JPMorgan Chase (JPM) on baraka. The largest US bank.',
      },
      ar: {
        title: 'سهم جي بي مورغان (JPM) - اشترِ أسهم جي بي مورغان على بركة',
        description: 'استثمر في جي بي مورغان على بركة. أكبر بنك أمريكي.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'JPMorgan Chase is the largest US bank by assets, offering investment banking, consumer banking, and asset management.',
        thesis: 'JPMorgan is the best-managed major bank with diverse revenue streams.',
        risks: 'Interest rate sensitivity, regulatory environment, economic cycles.',
        faqs: [{ question: 'What services does JPMorgan offer?', answer: 'Investment banking, consumer banking, commercial banking, and asset management.' }],
        highlights: 'Largest US bank, Strong management, Diverse businesses',
      },
      ar: {
        overview: 'جي بي مورغان هو أكبر بنك أمريكي من حيث الأصول.',
        thesis: 'جي بي مورغان هو أفضل بنك كبير مدار مع تدفقات إيرادات متنوعة.',
        risks: 'حساسية أسعار الفائدة والبيئة التنظيمية.',
        faqs: [{ question: 'ما هي الخدمات التي يقدمها جي بي مورغان؟', answer: 'الخدمات المصرفية الاستثمارية والاستهلاكية والتجارية وإدارة الأصول.' }],
        highlights: 'أكبر بنك أمريكي، إدارة قوية',
      },
    },
    dynamicData: {
      price: 198.45,
      change: 3.25,
      changePercent: 1.67,
      marketCap: '$572B',
      volume: '8.2M',
      pe: '11.5',
      eps: '$17.26',
      dividend: '2.42%',
      sentiment: { buy: 68, hold: 28, sell: 4 },
      performance: { '1D': 1.67, '1W': 3.2, '1M': 8.5, '1Y': 32.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'BAC', reason: 'Banking competitors' }], manual: ['V', 'MA'] },
  },
  {
    id: '24',
    ticker: 'BAC',
    companyName: 'Bank of America Corporation',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Bank of America (BAC) Stock - Buy BAC Shares on baraka',
        description: 'Invest in Bank of America (BAC) on baraka. One of the largest US banks.',
      },
      ar: {
        title: 'سهم بنك أوف أمريكا (BAC) - اشترِ أسهم BAC على بركة',
        description: 'استثمر في بنك أوف أمريكا على بركة. أحد أكبر البنوك الأمريكية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Bank of America is one of the largest financial institutions in the US, serving consumers and businesses.',
        thesis: 'BofA benefits from higher interest rates and has strong consumer banking franchise.',
        risks: 'Interest rate sensitivity, unrealized bond losses, economic slowdown.',
        faqs: [{ question: 'Is Bank of America safe?', answer: 'BofA is one of the systemically important banks with strong capital ratios.' }],
        highlights: 'Scale advantages, Consumer banking strength, Dividend growth',
      },
      ar: {
        overview: 'بنك أوف أمريكا هو أحد أكبر المؤسسات المالية في الولايات المتحدة.',
        thesis: 'يستفيد بنك أوف أمريكا من ارتفاع أسعار الفائدة.',
        risks: 'حساسية أسعار الفائدة وخسائر السندات غير المحققة.',
        faqs: [{ question: 'هل بنك أوف أمريكا آمن؟', answer: 'بنك أوف أمريكا هو أحد البنوك ذات الأهمية النظامية.' }],
        highlights: 'مزايا الحجم، قوة الخدمات المصرفية للمستهلكين',
      },
    },
    dynamicData: {
      price: 38.25,
      change: 0.72,
      changePercent: 1.92,
      marketCap: '$302B',
      volume: '32.5M',
      pe: '12.2',
      eps: '$3.13',
      dividend: '2.62%',
      sentiment: { buy: 55, hold: 38, sell: 7 },
      performance: { '1D': 1.92, '1W': 4.5, '1M': 10.2, '1Y': 28.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'JPM', reason: 'Banking competitors' }], manual: ['V'] },
  },
  {
    id: '25',
    ticker: 'KO',
    companyName: 'The Coca-Cola Company',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Coca-Cola (KO) Stock - Buy Coca-Cola Shares on baraka',
        description: 'Invest in Coca-Cola (KO) on baraka. The world\'s largest beverage company.',
      },
      ar: {
        title: 'سهم كوكا كولا (KO) - اشترِ أسهم كوكا كولا على بركة',
        description: 'استثمر في كوكا كولا على بركة. أكبر شركة مشروبات في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Coca-Cola is the world\'s largest beverage company, selling over 500 brands in more than 200 countries.',
        thesis: 'Coca-Cola is a dividend aristocrat with strong global brand and distribution.',
        risks: 'Sugar consumption trends, currency headwinds, competition.',
        faqs: [{ question: 'How long has Coca-Cola paid dividends?', answer: 'Coca-Cola has paid dividends for over 100 years and increased them for 60+ consecutive years.' }],
        highlights: 'Dividend aristocrat, Global brand, Pricing power',
      },
      ar: {
        overview: 'كوكا كولا هي أكبر شركة مشروبات في العالم.',
        thesis: 'كوكا كولا هي أرستقراطي توزيعات الأرباح مع علامة تجارية عالمية قوية.',
        risks: 'اتجاهات استهلاك السكر وعوائق العملة.',
        faqs: [{ question: 'منذ متى تدفع كوكا كولا توزيعات أرباح؟', answer: 'دفعت كوكا كولا توزيعات أرباح لأكثر من 100 عام.' }],
        highlights: 'أرستقراطي توزيعات الأرباح، علامة تجارية عالمية',
      },
    },
    dynamicData: {
      price: 62.45,
      change: 0.42,
      changePercent: 0.68,
      marketCap: '$270B',
      volume: '12.5M',
      pe: '24.5',
      eps: '$2.55',
      dividend: '3.05%',
      sentiment: { buy: 58, hold: 38, sell: 4 },
      performance: { '1D': 0.68, '1W': 1.2, '1M': 2.5, '1Y': 8.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'PEP', reason: 'Beverage competitors' }], manual: ['JNJ', 'PG'] },
  },
  {
    id: '26',
    ticker: 'PEP',
    companyName: 'PepsiCo, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'PepsiCo (PEP) Stock - Buy PepsiCo Shares on baraka',
        description: 'Invest in PepsiCo (PEP) on baraka. A global food and beverage leader.',
      },
      ar: {
        title: 'سهم بيبسيكو (PEP) - اشترِ أسهم بيبسيكو على بركة',
        description: 'استثمر في بيبسيكو على بركة. رائدة عالمية في الأغذية والمشروبات.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'PepsiCo is a global food and beverage company with brands including Pepsi, Lay\'s, Gatorade, and Quaker.',
        thesis: 'PepsiCo offers diversification between beverages and snacks with strong brands.',
        risks: 'Health trends affecting snacks and sugary drinks, input cost inflation.',
        faqs: [{ question: 'What brands does PepsiCo own?', answer: 'Pepsi, Mountain Dew, Lay\'s, Doritos, Cheetos, Gatorade, Quaker, and many more.' }],
        highlights: 'Diversified portfolio, Strong snacks business, Dividend growth',
      },
      ar: {
        overview: 'بيبسيكو هي شركة أغذية ومشروبات عالمية.',
        thesis: 'تقدم بيبسيكو تنويعاً بين المشروبات والوجبات الخفيفة.',
        risks: 'الاتجاهات الصحية المؤثرة على الوجبات الخفيفة والمشروبات السكرية.',
        faqs: [{ question: 'ما هي العلامات التجارية التي تملكها بيبسيكو؟', answer: 'بيبسي وماونتن ديو وليز ودوريتوس وشيتوز وغاتوريد وكويكر.' }],
        highlights: 'محفظة متنوعة، أعمال وجبات خفيفة قوية',
      },
    },
    dynamicData: {
      price: 172.85,
      change: -0.92,
      changePercent: -0.53,
      marketCap: '$238B',
      volume: '4.5M',
      pe: '22.8',
      eps: '$7.58',
      dividend: '2.95%',
      sentiment: { buy: 55, hold: 40, sell: 5 },
      performance: { '1D': -0.53, '1W': 0.8, '1M': -2.5, '1Y': 5.2 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'KO', reason: 'Beverage competitors' }], manual: ['JNJ'] },
  },
  {
    id: '27',
    ticker: 'JNJ',
    companyName: 'Johnson & Johnson',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Johnson & Johnson (JNJ) Stock - Buy JNJ Shares on baraka',
        description: 'Invest in Johnson & Johnson (JNJ) on baraka. A healthcare conglomerate.',
      },
      ar: {
        title: 'سهم جونسون آند جونسون (JNJ) - اشترِ أسهم JNJ على بركة',
        description: 'استثمر في جونسون آند جونسون على بركة. تكتل رعاية صحية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Johnson & Johnson is a diversified healthcare company with pharmaceutical, medical devices, and consumer health segments.',
        thesis: 'J&J offers defensive healthcare exposure with strong pharmaceutical pipeline.',
        risks: 'Talc litigation, patent cliffs on key drugs, Kenvue separation impacts.',
        faqs: [{ question: 'What does J&J sell?', answer: 'Pharmaceuticals, medical devices, and after Kenvue spinoff, focused on prescription drugs and med tech.' }],
        highlights: 'Defensive healthcare, Dividend king, Strong pipeline',
      },
      ar: {
        overview: 'جونسون آند جونسون هي شركة رعاية صحية متنوعة.',
        thesis: 'تقدم J&J تعرضاً دفاعياً للرعاية الصحية مع خط أنابيب دوائي قوي.',
        risks: 'دعاوى التلك وهاوية براءات الاختراع.',
        faqs: [{ question: 'ماذا تبيع J&J؟', answer: 'الأدوية والأجهزة الطبية.' }],
        highlights: 'رعاية صحية دفاعية، ملك توزيعات الأرباح',
      },
    },
    dynamicData: {
      price: 158.25,
      change: 1.15,
      changePercent: 0.73,
      marketCap: '$381B',
      volume: '6.5M',
      pe: '15.2',
      eps: '$10.41',
      dividend: '2.98%',
      sentiment: { buy: 52, hold: 42, sell: 6 },
      performance: { '1D': 0.73, '1W': 1.5, '1M': 3.2, '1Y': 5.8 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'PG', reason: 'Consumer staples' }], manual: ['UNH'] },
  },
  {
    id: '28',
    ticker: 'PG',
    companyName: 'The Procter & Gamble Company',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'P&G (PG) Stock - Buy Procter & Gamble Shares on baraka',
        description: 'Invest in Procter & Gamble (PG) on baraka. A consumer goods giant.',
      },
      ar: {
        title: 'سهم بروكتر آند غامبل (PG) - اشترِ أسهم P&G على بركة',
        description: 'استثمر في بروكتر آند غامبل على بركة. عملاق السلع الاستهلاكية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'P&G is one of the world\'s largest consumer goods companies with brands like Tide, Pampers, Gillette, and Oral-B.',
        thesis: 'P&G has strong brands with pricing power and consistent dividend growth.',
        risks: 'Private label competition, input cost inflation, market saturation.',
        faqs: [{ question: 'What brands does P&G own?', answer: 'Tide, Pampers, Gillette, Oral-B, Head & Shoulders, and many more household brands.' }],
        highlights: 'Strong brands, Pricing power, Dividend aristocrat',
      },
      ar: {
        overview: 'P&G هي واحدة من أكبر شركات السلع الاستهلاكية في العالم.',
        thesis: 'لدى P&G علامات تجارية قوية مع قوة التسعير.',
        risks: 'منافسة العلامات الخاصة وتضخم تكاليف المدخلات.',
        faqs: [{ question: 'ما هي العلامات التجارية التي تملكها P&G؟', answer: 'تايد وبامبرز وجيليت وأورال بي وهيد آند شولدرز.' }],
        highlights: 'علامات تجارية قوية، قوة التسعير',
      },
    },
    dynamicData: {
      price: 165.42,
      change: 0.85,
      changePercent: 0.52,
      marketCap: '$390B',
      volume: '5.2M',
      pe: '26.5',
      eps: '$6.24',
      dividend: '2.42%',
      sentiment: { buy: 55, hold: 40, sell: 5 },
      performance: { '1D': 0.52, '1W': 1.2, '1M': 2.8, '1Y': 12.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'JNJ', reason: 'Consumer staples' }], manual: ['KO', 'PEP'] },
  },
  {
    id: '29',
    ticker: 'XOM',
    companyName: 'Exxon Mobil Corporation',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'ExxonMobil (XOM) Stock - Buy Exxon Shares on baraka',
        description: 'Invest in ExxonMobil (XOM) on baraka. One of the world\'s largest oil and gas companies.',
      },
      ar: {
        title: 'سهم إكسون موبيل (XOM) - اشترِ أسهم إكسون على بركة',
        description: 'استثمر في إكسون موبيل على بركة. واحدة من أكبر شركات النفط والغاز في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'ExxonMobil is one of the world\'s largest integrated oil and gas companies, engaged in exploration, production, and refining.',
        thesis: 'Exxon benefits from energy security focus and strong shareholder returns.',
        risks: 'Oil price volatility, energy transition risks, environmental regulations.',
        faqs: [{ question: 'Is Exxon a good dividend stock?', answer: 'Exxon has paid dividends for over 100 years and is a dividend aristocrat.' }],
        highlights: 'Integrated oil major, Strong dividend, Energy security',
      },
      ar: {
        overview: 'إكسون موبيل هي واحدة من أكبر شركات النفط والغاز المتكاملة في العالم.',
        thesis: 'تستفيد إكسون من التركيز على أمن الطاقة.',
        risks: 'تقلب أسعار النفط ومخاطر التحول الطاقوي.',
        faqs: [{ question: 'هل إكسون سهم توزيعات أرباح جيد؟', answer: 'دفعت إكسون توزيعات أرباح لأكثر من 100 عام.' }],
        highlights: 'شركة نفط متكاملة كبرى، توزيعات أرباح قوية',
      },
    },
    dynamicData: {
      price: 108.45,
      change: 2.15,
      changePercent: 2.02,
      marketCap: '$432B',
      volume: '15.5M',
      pe: '12.5',
      eps: '$8.68',
      dividend: '3.42%',
      sentiment: { buy: 62, hold: 32, sell: 6 },
      performance: { '1D': 2.02, '1W': 4.5, '1M': 8.2, '1Y': 18.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'CVX', reason: 'Oil majors' }], manual: [] },
  },
  {
    id: '30',
    ticker: 'CVX',
    companyName: 'Chevron Corporation',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Chevron (CVX) Stock - Buy Chevron Shares on baraka',
        description: 'Invest in Chevron (CVX) on baraka. A leading integrated energy company.',
      },
      ar: {
        title: 'سهم شيفرون (CVX) - اشترِ أسهم شيفرون على بركة',
        description: 'استثمر في شيفرون على بركة. شركة طاقة متكاملة رائدة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Chevron is one of the world\'s largest integrated oil and gas companies with operations globally.',
        thesis: 'Chevron has strong balance sheet and returning capital to shareholders.',
        risks: 'Oil price dependency, energy transition, regulatory environment.',
        faqs: [{ question: 'What does Chevron do?', answer: 'Chevron explores, produces, and refines oil and natural gas worldwide.' }],
        highlights: 'Strong balance sheet, Shareholder returns, Global operations',
      },
      ar: {
        overview: 'شيفرون هي واحدة من أكبر شركات النفط والغاز المتكاملة في العالم.',
        thesis: 'شيفرون لديها ميزانية قوية وتعيد رأس المال للمساهمين.',
        risks: 'الاعتماد على أسعار النفط والتحول الطاقوي.',
        faqs: [{ question: 'ماذا تفعل شيفرون؟', answer: 'تستكشف شيفرون وتنتج وتكرر النفط والغاز الطبيعي في جميع أنحاء العالم.' }],
        highlights: 'ميزانية قوية، عوائد المساهمين',
      },
    },
    dynamicData: {
      price: 152.85,
      change: 2.85,
      changePercent: 1.9,
      marketCap: '$282B',
      volume: '8.5M',
      pe: '11.8',
      eps: '$12.95',
      dividend: '4.15%',
      sentiment: { buy: 58, hold: 35, sell: 7 },
      performance: { '1D': 1.9, '1W': 4.2, '1M': 7.5, '1Y': 15.2 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'XOM', reason: 'Oil majors' }], manual: [] },
  },
  {
    id: '31',
    ticker: 'UNH',
    companyName: 'UnitedHealth Group Incorporated',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'UnitedHealth (UNH) Stock - Buy UnitedHealth Shares on baraka',
        description: 'Invest in UnitedHealth (UNH) on baraka. The largest health insurer in the US.',
      },
      ar: {
        title: 'سهم يونايتد هيلث (UNH) - اشترِ أسهم يونايتد هيلث على بركة',
        description: 'استثمر في يونايتد هيلث على بركة. أكبر شركة تأمين صحي في الولايات المتحدة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'UnitedHealth is the largest US health insurer with Optum healthcare services and pharmacy benefits.',
        thesis: 'UNH benefits from aging population and healthcare cost management capabilities.',
        risks: 'Healthcare policy changes, regulatory scrutiny, Medicare rate adjustments.',
        faqs: [{ question: 'What is Optum?', answer: 'Optum is UnitedHealth\'s healthcare services business including pharmacy and care delivery.' }],
        highlights: 'Largest health insurer, Optum growth, Aging population tailwind',
      },
      ar: {
        overview: 'يونايتد هيلث هي أكبر شركة تأمين صحي في الولايات المتحدة.',
        thesis: 'تستفيد UNH من شيخوخة السكان وقدرات إدارة تكاليف الرعاية الصحية.',
        risks: 'تغييرات سياسة الرعاية الصحية والتدقيق التنظيمي.',
        faqs: [{ question: 'ما هو Optum؟', answer: 'Optum هي أعمال خدمات الرعاية الصحية لـ UnitedHealth.' }],
        highlights: 'أكبر شركة تأمين صحي، نمو Optum',
      },
    },
    dynamicData: {
      price: 528.45,
      change: 5.85,
      changePercent: 1.12,
      marketCap: '$488B',
      volume: '3.2M',
      pe: '21.5',
      eps: '$24.58',
      dividend: '1.42%',
      sentiment: { buy: 68, hold: 28, sell: 4 },
      performance: { '1D': 1.12, '1W': 2.5, '1M': 5.8, '1Y': 18.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'JNJ', reason: 'Healthcare sector' }], manual: [] },
  },
  {
    id: '32',
    ticker: 'COST',
    companyName: 'Costco Wholesale Corporation',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Costco (COST) Stock - Buy Costco Shares on baraka',
        description: 'Invest in Costco (COST) on baraka. A membership-based warehouse retailer.',
      },
      ar: {
        title: 'سهم كوستكو (COST) - اشترِ أسهم كوستكو على بركة',
        description: 'استثمر في كوستكو على بركة. متجر تجزئة مستودعات قائم على العضوية.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Costco operates membership-based warehouse clubs selling bulk goods at low prices.',
        thesis: 'Costco has loyal member base and consistent growth through value proposition.',
        risks: 'E-commerce competition, labor costs, market saturation.',
        faqs: [{ question: 'How does Costco make money?', answer: 'Through membership fees and low-margin product sales at high volume.' }],
        highlights: 'Loyal members, Value proposition, Strong execution',
      },
      ar: {
        overview: 'تدير كوستكو نوادي مستودعات قائمة على العضوية.',
        thesis: 'لدى كوستكو قاعدة أعضاء مخلصة ونمو مستمر.',
        risks: 'منافسة التجارة الإلكترونية وتكاليف العمالة.',
        faqs: [{ question: 'كيف تجني كوستكو المال؟', answer: 'من خلال رسوم العضوية ومبيعات المنتجات ذات الهامش المنخفض بحجم كبير.' }],
        highlights: 'أعضاء مخلصون، عرض قيمة قوي',
      },
    },
    dynamicData: {
      price: 892.45,
      change: 8.25,
      changePercent: 0.93,
      marketCap: '$396B',
      volume: '1.8M',
      pe: '52.5',
      eps: '$17.00',
      dividend: '0.52%',
      sentiment: { buy: 65, hold: 30, sell: 5 },
      performance: { '1D': 0.93, '1W': 2.1, '1M': 5.5, '1Y': 42.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'WMT', reason: 'Retail competitors' }], manual: ['HD'] },
  },
  {
    id: '33',
    ticker: 'WMT',
    companyName: 'Walmart Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Walmart (WMT) Stock - Buy Walmart Shares on baraka',
        description: 'Invest in Walmart (WMT) on baraka. The world\'s largest retailer.',
      },
      ar: {
        title: 'سهم وول مارت (WMT) - اشترِ أسهم وول مارت على بركة',
        description: 'استثمر في وول مارت على بركة. أكبر تاجر تجزئة في العالم.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Walmart is the world\'s largest retailer by revenue, operating hypermarkets and e-commerce.',
        thesis: 'Walmart is successfully competing with Amazon through omnichannel and delivery investments.',
        risks: 'Thin margins, labor costs, Amazon competition.',
        faqs: [{ question: 'Is Walmart bigger than Amazon?', answer: 'Walmart has higher total revenue but Amazon is larger in e-commerce.' }],
        highlights: 'Largest retailer, Omnichannel growth, Walmart+ membership',
      },
      ar: {
        overview: 'وول مارت هي أكبر تاجر تجزئة في العالم من حيث الإيرادات.',
        thesis: 'وول مارت تنافس بنجاح أمازون من خلال استثمارات متعددة القنوات.',
        risks: 'هوامش رقيقة وتكاليف العمالة.',
        faqs: [{ question: 'هل وول مارت أكبر من أمازون؟', answer: 'وول مارت لديها إيرادات إجمالية أعلى لكن أمازون أكبر في التجارة الإلكترونية.' }],
        highlights: 'أكبر تاجر تجزئة، نمو متعدد القنوات',
      },
    },
    dynamicData: {
      price: 168.25,
      change: 1.45,
      changePercent: 0.87,
      marketCap: '$452B',
      volume: '6.5M',
      pe: '28.5',
      eps: '$5.90',
      dividend: '1.32%',
      sentiment: { buy: 62, hold: 33, sell: 5 },
      performance: { '1D': 0.87, '1W': 1.8, '1M': 4.2, '1Y': 32.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'COST', reason: 'Retail competitors' }], manual: ['AMZN'] },
  },
  {
    id: '34',
    ticker: 'HD',
    companyName: 'The Home Depot, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Home Depot (HD) Stock - Buy Home Depot Shares on baraka',
        description: 'Invest in Home Depot (HD) on baraka. The largest home improvement retailer.',
      },
      ar: {
        title: 'سهم هوم ديبوت (HD) - اشترِ أسهم هوم ديبوت على بركة',
        description: 'استثمر في هوم ديبوت على بركة. أكبر متجر تحسين المنازل.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Home Depot is the largest home improvement retailer in the US, serving DIY and professional customers.',
        thesis: 'Home Depot benefits from aging housing stock and home improvement trends.',
        risks: 'Housing market sensitivity, interest rate impacts, cyclical demand.',
        faqs: [{ question: 'What does Home Depot sell?', answer: 'Building materials, home improvement products, tools, and appliances.' }],
        highlights: 'Home improvement leader, Pro customer growth, Strong execution',
      },
      ar: {
        overview: 'هوم ديبوت هي أكبر متجر تحسين المنازل في الولايات المتحدة.',
        thesis: 'تستفيد هوم ديبوت من شيخوخة المخزون السكني.',
        risks: 'حساسية سوق الإسكان وتأثيرات أسعار الفائدة.',
        faqs: [{ question: 'ماذا تبيع هوم ديبوت؟', answer: 'مواد البناء ومنتجات تحسين المنزل والأدوات والأجهزة.' }],
        highlights: 'رائدة تحسين المنازل، نمو عملاء المحترفين',
      },
    },
    dynamicData: {
      price: 378.45,
      change: 4.25,
      changePercent: 1.14,
      marketCap: '$376B',
      volume: '3.5M',
      pe: '24.5',
      eps: '$15.45',
      dividend: '2.35%',
      sentiment: { buy: 62, hold: 32, sell: 6 },
      performance: { '1D': 1.14, '1W': 2.5, '1M': 5.8, '1Y': 22.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'WMT', reason: 'Retail sector' }], manual: ['COST'] },
  },
  {
    id: '35',
    ticker: 'DIS',
    companyName: 'The Walt Disney Company',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Disney (DIS) Stock - Buy Disney Shares on baraka',
        description: 'Invest in Disney (DIS) on baraka. A global entertainment conglomerate.',
      },
      ar: {
        title: 'سهم ديزني (DIS) - اشترِ أسهم ديزني على بركة',
        description: 'استثمر في ديزني على بركة. تكتل ترفيه عالمي.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Disney is a global entertainment company with theme parks, streaming (Disney+), and movie studios.',
        thesis: 'Disney has iconic brands and is improving streaming profitability.',
        risks: 'Streaming losses, cord-cutting, theme park economic sensitivity.',
        faqs: [{ question: 'What does Disney own?', answer: 'Disney, Pixar, Marvel, Star Wars, ESPN, theme parks, and Disney+ streaming.' }],
        highlights: 'Iconic brands, Theme parks recovery, Disney+ growth',
      },
      ar: {
        overview: 'ديزني هي شركة ترفيه عالمية مع منتزهات ترفيهية وبث مباشر واستوديوهات أفلام.',
        thesis: 'لدى ديزني علامات تجارية أيقونية وتحسن ربحية البث.',
        risks: 'خسائر البث وقطع الكابل.',
        faqs: [{ question: 'ماذا تملك ديزني؟', answer: 'ديزني وبيكسار ومارفل وستار وورز وESPN والمنتزهات وديزني+.' }],
        highlights: 'علامات تجارية أيقونية، تعافي المنتزهات',
      },
    },
    dynamicData: {
      price: 112.85,
      change: 1.42,
      changePercent: 1.28,
      marketCap: '$205B',
      volume: '8.5M',
      pe: '68.5',
      eps: '$1.65',
      dividend: '0.78%',
      sentiment: { buy: 55, hold: 38, sell: 7 },
      performance: { '1D': 1.28, '1W': 3.2, '1M': 8.5, '1Y': 15.2 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'NFLX', reason: 'Streaming competitors' }], manual: [] },
  },
  {
    id: '36',
    ticker: 'BABA',
    companyName: 'Alibaba Group Holding Limited',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'Alibaba (BABA) Stock - Buy Alibaba Shares on baraka',
        description: 'Invest in Alibaba (BABA) on baraka. China\'s largest e-commerce company.',
      },
      ar: {
        title: 'سهم علي بابا (BABA) - اشترِ أسهم علي بابا على بركة',
        description: 'استثمر في علي بابا على بركة. أكبر شركة تجارة إلكترونية في الصين.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'Alibaba is China\'s largest e-commerce platform and cloud computing provider.',
        thesis: 'Alibaba is undervalued with restructuring underway and cloud AI potential.',
        risks: 'China regulatory environment, US-China tensions, ADR delisting risk.',
        faqs: [{ question: 'Is Alibaba safe to invest in?', answer: 'Alibaba carries geopolitical and regulatory risks as a Chinese ADR.' }],
        highlights: 'China e-commerce leader, Cloud growth, Deep discount',
      },
      ar: {
        overview: 'علي بابا هي أكبر منصة تجارة إلكترونية في الصين ومزود الحوسبة السحابية.',
        thesis: 'علي بابا مقومة بأقل من قيمتها مع إعادة الهيكلة.',
        risks: 'البيئة التنظيمية الصينية والتوترات الأمريكية الصينية.',
        faqs: [{ question: 'هل الاستثمار في علي بابا آمن؟', answer: 'تحمل علي بابا مخاطر جيوسياسية وتنظيمية.' }],
        highlights: 'رائدة التجارة الإلكترونية الصينية، نمو السحابة',
      },
    },
    dynamicData: {
      price: 78.45,
      change: -1.85,
      changePercent: -2.3,
      marketCap: '$192B',
      volume: '18.5M',
      pe: '12.5',
      eps: '$6.28',
      dividend: 'N/A',
      sentiment: { buy: 58, hold: 32, sell: 10 },
      performance: { '1D': -2.3, '1W': -5.2, '1M': 8.5, '1Y': -15.2 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'JD', reason: 'China e-commerce' }], manual: ['PDD'] },
  },
  {
    id: '37',
    ticker: 'JD',
    companyName: 'JD.com, Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'JD.com (JD) Stock - Buy JD Shares on baraka',
        description: 'Invest in JD.com (JD) on baraka. A leading Chinese e-commerce company.',
      },
      ar: {
        title: 'سهم JD.com - اشترِ أسهم JD على بركة',
        description: 'استثمر في JD.com على بركة. شركة تجارة إلكترونية صينية رائدة.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'JD.com is one of China\'s largest e-commerce platforms with its own logistics network.',
        thesis: 'JD differentiates with first-party logistics and focus on authentic products.',
        risks: 'China macro environment, competition, US-China tensions.',
        faqs: [{ question: 'How is JD different from Alibaba?', answer: 'JD owns its logistics and inventory, while Alibaba is primarily a marketplace.' }],
        highlights: 'Own logistics, Authentic products focus, Growing market share',
      },
      ar: {
        overview: 'JD.com هي واحدة من أكبر منصات التجارة الإلكترونية في الصين.',
        thesis: 'تتميز JD بالخدمات اللوجستية الخاصة والتركيز على المنتجات الأصلية.',
        risks: 'البيئة الاقتصادية الصينية والمنافسة.',
        faqs: [{ question: 'كيف تختلف JD عن علي بابا؟', answer: 'JD تملك لوجستياتها ومخزونها بينما علي بابا سوق رئيسي.' }],
        highlights: 'لوجستيات خاصة، تركيز على المنتجات الأصلية',
      },
    },
    dynamicData: {
      price: 28.45,
      change: -0.72,
      changePercent: -2.47,
      marketCap: '$44.5B',
      volume: '12.5M',
      pe: '10.2',
      eps: '$2.79',
      dividend: '2.85%',
      sentiment: { buy: 52, hold: 38, sell: 10 },
      performance: { '1D': -2.47, '1W': -6.5, '1M': 5.2, '1Y': -22.5 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'BABA', reason: 'China e-commerce' }], manual: ['PDD'] },
  },
  {
    id: '38',
    ticker: 'PDD',
    companyName: 'PDD Holdings Inc.',
    languages: ['en', 'ar'],
    status: 'published',
    lastUpdated: '2026-01-05',
    metadata: {
      en: {
        title: 'PDD (PDD) Stock - Buy Pinduoduo Shares on baraka',
        description: 'Invest in PDD Holdings (PDD) on baraka. Owner of Pinduoduo and Temu.',
      },
      ar: {
        title: 'سهم PDD - اشترِ أسهم PDD على بركة',
        description: 'استثمر في PDD Holdings على بركة. مالكة Pinduoduo وTemu.',
      },
    },
    indexed: true,
    content: {
      en: {
        overview: 'PDD Holdings operates Pinduoduo (China\'s largest e-commerce by users) and Temu (fast-growing US platform).',
        thesis: 'PDD is growing rapidly through Temu international expansion.',
        risks: 'Temu profitability concerns, competition, regulatory risks.',
        faqs: [{ question: 'What is Temu?', answer: 'Temu is PDD\'s fast-growing international e-commerce platform offering low-priced products.' }],
        highlights: 'Temu growth, China e-commerce scale, Low-cost model',
      },
      ar: {
        overview: 'تدير PDD Holdings منصة Pinduoduo وTemu.',
        thesis: 'PDD تنمو بسرعة من خلال التوسع الدولي لـ Temu.',
        risks: 'مخاوف ربحية Temu والمنافسة.',
        faqs: [{ question: 'ما هو Temu؟', answer: 'Temu هي منصة التجارة الإلكترونية الدولية سريعة النمو من PDD.' }],
        highlights: 'نمو Temu، حجم التجارة الإلكترونية الصينية',
      },
    },
    dynamicData: {
      price: 142.85,
      change: -4.25,
      changePercent: -2.89,
      marketCap: '$198B',
      volume: '8.5M',
      pe: '15.2',
      eps: '$9.40',
      dividend: 'N/A',
      sentiment: { buy: 62, hold: 28, sell: 10 },
      performance: { '1D': -2.89, '1W': -8.5, '1M': 12.5, '1Y': 45.2 },
    },
    internalLinks: { autoSuggestions: [{ ticker: 'BABA', reason: 'China e-commerce' }], manual: ['JD'] },
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
    featuredImage: '/attached_assets/generated_images/beginner_stock_investing_guide.png',
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
    featuredImage: '/attached_assets/generated_images/tech_sector_market_analysis.png',
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
    featuredImage: '/attached_assets/generated_images/dividend_investing_passive_income.png',
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
      en: 'Earn up to $30 for each friend who joins baraka',
      ar: 'اربح حتى 30 دولار عن كل صديق ينضم إلى بركة',
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
