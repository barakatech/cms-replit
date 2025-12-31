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
  type InsertAnalyticsEvent
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
    
    // Seed landing pages
    seedLandingPages.forEach(page => this.landingPages.set(page.id, page));
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
}

export const storage = new MemStorage();
