import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  Globe,
  Moon,
  Sun,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Mail,
  Sparkles,
  Star,
  ChevronLeft,
  Shield,
  Clock,
  Check,
  AlertTriangle,
  Zap,
  Loader2
} from 'lucide-react';
import { mockStocks, mockBlogs } from '@/lib/mockData';
import { marketDataProvider, type MarketData } from '@/lib/marketDataProvider';
import { mockBlogHomeSettings, blogCategories } from '@/lib/discoverData';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { DiscoverSettings, StockTheme, OfferBanner } from '@shared/schema';

export default function Discover() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { resolvedTheme, toggleTheme } = useTheme();
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState<'stocks' | 'learn'>('stocks');
  const [trendingTab, setTrendingTab] = useState('gainers');
  const [offersScrollIndex, setOffersScrollIndex] = useState(0);
  
  const [alertEmail, setAlertEmail] = useState('');
  const [alertTickers, setAlertTickers] = useState<string[]>([]);
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [alertSuccess, setAlertSuccess] = useState(false);
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  const { toast } = useToast();
  
  const isRTL = language === 'ar';
  
  const { data: settings, isLoading: settingsLoading } = useQuery<DiscoverSettings>({
    queryKey: ['/api/discover/settings'],
  });
  
  const { data: stockThemes = [] } = useQuery<StockTheme[]>({
    queryKey: ['/api/discover/themes'],
  });
  
  const { data: offerBanners = [] } = useQuery<OfferBanner[]>({
    queryKey: ['/api/discover/offers'],
  });

  useEffect(() => {
    if (!settings) return;
    const allTickers = new Set<string>();
    settings.trendingTabs.forEach(tab => tab.tickers.forEach(t => allTickers.add(t)));
    settings.featuredTickers.forEach(t => allTickers.add(t));
    marketDataProvider.getMarketDataBatch(Array.from(allTickers)).then(setMarketData);
  }, [settings]);

  const featuredPost = mockBlogs.find(p => p.id === mockBlogHomeSettings.featuredPostId);
  const secondaryPosts = mockBlogHomeSettings.mostReadPostIds
    .filter(id => id !== mockBlogHomeSettings.featuredPostId)
    .map(id => mockBlogs.find(p => p.id === id))
    .filter(Boolean);

  const newTheme = stockThemes.find(t => t.slug === settings?.featuredThemeNewSlug);
  const monthTheme = stockThemes.find(t => t.slug === settings?.featuredThemeMonthSlug);
  const otherThemes = stockThemes.filter(t => 
    settings?.otherThemeSlugs.includes(t.slug)
  );

  const currentTrendingTab = settings?.trendingTabs.find(t => t.key === trendingTab);
  
  if (settingsLoading || !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handlePriceAlertSubscribe = async () => {
    if (!alertEmail || alertTickers.length === 0) {
      toast({ title: language === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول', variant: 'destructive' });
      return;
    }
    try {
      await apiRequest('POST', '/api/price-alerts/subscribe', {
        email: alertEmail,
        tickers: alertTickers,
        frequency: alertFrequency,
        locale: language,
      });
      setAlertSuccess(true);
      toast({ title: language === 'en' ? 'Subscribed successfully!' : 'تم الاشتراك بنجاح!' });
    } catch {
      toast({ title: language === 'en' ? 'Failed to subscribe' : 'فشل الاشتراك', variant: 'destructive' });
    }
  };

  const handleNewsletterSignup = async () => {
    if (!newsletterEmail) {
      toast({ title: language === 'en' ? 'Please enter your email' : 'يرجى إدخال بريدك الإلكتروني', variant: 'destructive' });
      return;
    }
    try {
      await apiRequest('POST', '/api/newsletter/signup', {
        email: newsletterEmail,
        locale: language,
        source: 'discover',
      });
      setNewsletterSuccess(true);
      toast({ title: language === 'en' ? 'Signed up successfully!' : 'تم التسجيل بنجاح!' });
    } catch {
      toast({ title: language === 'en' ? 'Failed to sign up' : 'فشل التسجيل', variant: 'destructive' });
    }
  };

  const labels = {
    en: {
      heroTitle: settings.heroTitle_en,
      heroSubtitle: settings.heroSubtitle_en,
      searchPlaceholder: 'Search stocks or articles...',
      stocks: 'Stocks',
      learn: 'Learn',
      offers: 'Offers & Promotions',
      themes: 'Stock Themes & Trackers',
      newlyAdded: 'Newly Added',
      themeOfMonth: 'Theme of the Month',
      otherThemes: 'Other Themes & Trackers',
      viewTheme: 'View Theme',
      trending: 'Trending Stocks',
      trendingSubtitle: 'Real-time market movers',
      viewAllStocks: 'View all stocks',
      featuredStocks: 'Featured Stocks',
      exploreStocks: 'Explore Stocks',
      priceAlerts: 'Get Price Updates',
      priceAlertsDesc: 'Subscribe to price alerts for stocks you follow.',
      emailPlaceholder: 'Enter your email',
      tickerPlaceholder: 'Add ticker (e.g. AAPL)',
      frequency: 'Frequency',
      instant: 'Instant',
      daily: 'Daily',
      weekly: 'Weekly',
      subscribe: 'Subscribe',
      subscribed: 'Subscribed!',
      learnSection: 'Learn & Insights',
      featuredArticle: 'Featured',
      browseByTopic: 'Browse by topic',
      goToLearn: 'Go to Learn',
      newsletter: 'Weekly Newsletter',
      newsletterDesc: 'Market explainers, product updates, and new themes.',
      signUp: 'Sign Up',
      signedUp: 'You\'re subscribed!',
      privacyNote: 'We respect your privacy. Unsubscribe anytime.',
      disclosures: 'Capital at risk. Information may be delayed. Not investment advice.',
      admin: 'Admin',
    },
    ar: {
      heroTitle: settings.heroTitle_ar,
      heroSubtitle: settings.heroSubtitle_ar,
      searchPlaceholder: 'ابحث عن الأسهم أو المقالات...',
      stocks: 'الأسهم',
      learn: 'تعلم',
      offers: 'العروض والترويجات',
      themes: 'موضوعات الأسهم والمتتبعات',
      newlyAdded: 'المضاف حديثاً',
      themeOfMonth: 'موضوع الشهر',
      otherThemes: 'موضوعات ومتتبعات أخرى',
      viewTheme: 'عرض الموضوع',
      trending: 'الأسهم الرائجة',
      trendingSubtitle: 'تحركات السوق الفورية',
      viewAllStocks: 'عرض جميع الأسهم',
      featuredStocks: 'الأسهم المميزة',
      exploreStocks: 'استكشف الأسهم',
      priceAlerts: 'احصل على تحديثات الأسعار',
      priceAlertsDesc: 'اشترك في تنبيهات الأسعار للأسهم التي تتابعها.',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      tickerPlaceholder: 'أضف رمز السهم (مثل AAPL)',
      frequency: 'التكرار',
      instant: 'فوري',
      daily: 'يومي',
      weekly: 'أسبوعي',
      subscribe: 'اشترك',
      subscribed: 'تم الاشتراك!',
      learnSection: 'تعلم ورؤى',
      featuredArticle: 'مميز',
      browseByTopic: 'تصفح حسب الموضوع',
      goToLearn: 'اذهب للتعلم',
      newsletter: 'النشرة الأسبوعية',
      newsletterDesc: 'شروحات السوق وتحديثات المنتج والموضوعات الجديدة.',
      signUp: 'سجل',
      signedUp: 'أنت مشترك!',
      privacyNote: 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.',
      disclosures: 'رأس المال في خطر. قد تتأخر المعلومات. ليست نصيحة استثمارية.',
      admin: 'الإدارة',
    },
  };
  
  const t = labels[language];

  const getCardStyle = (ticker: string, index: number) => {
    const colorOptions = [
      { bg: '#f8fafc', textColor: '#0f172a', sparkColor: '#94a3b8' },
      { bg: '#ef4444', textColor: '#ffffff', sparkColor: '#fca5a5' },
      { bg: '#64748b', textColor: '#ffffff', sparkColor: '#cbd5e1' },
      { bg: '#0ea5e9', textColor: '#ffffff', sparkColor: '#7dd3fc' },
      { bg: '#f97316', textColor: '#ffffff', sparkColor: '#fdba74' },
      { bg: '#22c55e', textColor: '#ffffff', sparkColor: '#86efac' },
      { bg: '#8b5cf6', textColor: '#ffffff', sparkColor: '#c4b5fd' },
      { bg: '#eab308', textColor: '#1f2937', sparkColor: '#fde047' },
    ];
    return colorOptions[index % colorOptions.length];
  };

  const renderTrendingCard = (ticker: string, index: number) => {
    const data = marketData[ticker];
    if (!data) return null;
    const isPositive = data.changePercent >= 0;
    const stock = mockStocks.find(s => s.ticker === ticker);
    const cardStyle = getCardStyle(ticker, index);
    
    return (
      <Link key={ticker} href={`/stocks/${ticker}`}>
        <div 
          className="relative rounded-xl min-w-[240px] h-[130px] cursor-pointer hover-elevate transition-all shadow-sm"
          style={{ backgroundColor: cardStyle.bg }}
          data-testid={`trending-card-${ticker}`}
        >
          {data.sparkline && (
            <svg 
              viewBox="0 0 100 50" 
              className="absolute bottom-0 left-0 right-0 h-12 opacity-30 pointer-events-none"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke={cardStyle.sparkColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.sparkline.map((v, i) => {
                  const min = Math.min(...data.sparkline!);
                  const max = Math.max(...data.sparkline!);
                  const x = (i / (data.sparkline!.length - 1)) * 100;
                  const y = 48 - ((v - min) / (max - min)) * 40;
                  return `${x},${y}`;
                }).join(' ')}
              />
            </svg>
          )}
          
          <div className="absolute top-4 left-5 right-5">
            <div 
              className="text-5xl font-bold opacity-80"
              style={{ color: cardStyle.textColor }}
            >
              {ticker.charAt(0)}
            </div>
          </div>
          
          <div className={`absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <div className="font-bold text-sm" style={{ color: cardStyle.textColor }}>{ticker}</div>
              {stock && (
                <div 
                  className="text-xs opacity-80 truncate max-w-[90px]"
                  style={{ color: cardStyle.textColor }}
                >
                  {stock.companyName}
                </div>
              )}
            </div>
            <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
              <div className="font-bold text-lg" style={{ color: cardStyle.textColor }}>
                {data.price.toFixed(2)}
              </div>
              <div className="text-xs opacity-80" style={{ color: cardStyle.textColor }}>
                {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderStockRow = (ticker: string, showChange = true) => {
    const data = marketData[ticker];
    if (!data) return null;
    const isPositive = data.changePercent >= 0;
    const stock = mockStocks.find(s => s.ticker === ticker);
    
    return (
      <Link key={ticker} href={`/stocks/${ticker}`}>
        <div 
          className={`flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border border-border/50 bg-card ${isRTL ? 'flex-row-reverse' : ''}`}
          data-testid={`stock-row-${ticker}`}
        >
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {ticker.slice(0, 2)}
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <span className="font-semibold text-sm">{ticker}</span>
              {stock && <p className="text-xs text-muted-foreground">{stock.companyName}</p>}
            </div>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium">${data.price.toFixed(2)}</span>
            {showChange && (
              <span className={`text-sm flex items-center ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const renderStockCard = (ticker: string) => {
    const data = marketData[ticker];
    if (!data) return null;
    const isPositive = data.changePercent >= 0;
    const stock = mockStocks.find(s => s.ticker === ticker);
    
    return (
      <Link key={ticker} href={`/stocks/${ticker}`}>
        <Card className="hover-elevate cursor-pointer h-full" data-testid={`stock-card-${ticker}`}>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {ticker.slice(0, 2)}
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <span className="font-semibold text-sm">{ticker}</span>
                {stock && <p className="text-xs text-muted-foreground truncate">{stock.companyName}</p>}
              </div>
            </div>
            <div className={`flex items-center justify-between mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="font-bold">${data.price.toFixed(2)}</span>
              <span className={`text-sm flex items-center ${isPositive ? 'text-positive' : 'text-negative'}`}>
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
              </span>
            </div>
            {data.sparkline && (
              <div className="mt-3 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke={isPositive ? 'hsl(var(--positive))' : 'hsl(var(--negative))'}
                    strokeWidth="2"
                    points={data.sparkline.map((v, i) => {
                      const min = Math.min(...data.sparkline!);
                      const max = Math.max(...data.sparkline!);
                      const x = (i / (data.sparkline!.length - 1)) * 100;
                      const y = 30 - ((v - min) / (max - min)) * 28;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                </svg>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/discover">
                <span className="text-xl font-bold text-primary cursor-pointer" data-testid="logo">baraka</span>
              </Link>
              <nav className={`hidden md:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link href="/stocks">
                  <Button variant="ghost" size="sm" data-testid="nav-stocks">
                    <TrendingUp className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {t.stocks}
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="ghost" size="sm" data-testid="nav-blog">
                    <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {t.learn}
                  </Button>
                </Link>
              </nav>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-admin">
                  {t.admin}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                data-testid="button-language-toggle"
              >
                <Globe className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {language === 'en' ? 'AR' : 'EN'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        
        {/* SECTION 1: Hero with Unified Search */}
        <section className="py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="hero-title">
              {t.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="hero-subtitle">
              {t.heroSubtitle}
            </p>
            
            <div className="bg-card rounded-xl border p-2 max-w-2xl mx-auto">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  variant={searchTab === 'stocks' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSearchTab('stocks')}
                  className="flex-1"
                  data-testid="search-tab-stocks"
                >
                  <TrendingUp className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t.stocks}
                </Button>
                <Button
                  variant={searchTab === 'learn' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSearchTab('learn')}
                  className="flex-1"
                  data-testid="search-tab-learn"
                >
                  <BookOpen className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t.learn}
                </Button>
              </div>
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className={`flex flex-wrap justify-center gap-2 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {settings.heroChips.map((chip, i) => (
                <Link key={i} href={chip.href}>
                  <Badge variant="secondary" className="cursor-pointer hover-elevate px-4 py-2" data-testid={`chip-${i}`}>
                    {language === 'en' ? chip.label_en : chip.label_ar}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Offers & Banners Rail */}
        {settings.sectionVisibility.offers && (
          <section className="py-8" id="offers">
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {t.offers}
              </h2>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOffersScrollIndex(Math.max(0, offersScrollIndex - 1))}
                  disabled={offersScrollIndex === 0}
                  data-testid="offers-prev"
                >
                  {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOffersScrollIndex(Math.min(offerBanners.length - 2, offersScrollIndex + 1))}
                  disabled={offersScrollIndex >= offerBanners.length - 2}
                  data-testid="offers-next"
                >
                  {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {offerBanners.filter((b: OfferBanner) => b.status === 'active').slice(offersScrollIndex, offersScrollIndex + 3).map((banner: OfferBanner) => (
                <Link key={banner.id} href={banner.ctaUrl} className="flex-1 min-w-[280px]">
                  <Card 
                    className="overflow-hidden hover-elevate cursor-pointer h-full"
                    style={{ 
                      background: `linear-gradient(135deg, ${banner.backgroundColor}dd, ${banner.backgroundColor}99)`,
                    }}
                    data-testid={`offer-${banner.id}`}
                  >
                    <CardContent className="p-6 text-white">
                      <h3 className={`text-xl font-bold mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {language === 'en' ? banner.title_en : banner.title_ar}
                      </h3>
                      <p className={`text-sm opacity-90 mb-4 ${isRTL ? 'text-right' : ''}`}>
                        {language === 'en' ? banner.subtitle_en : banner.subtitle_ar}
                      </p>
                      <Button variant="secondary" size="sm" data-testid={`offer-cta-${banner.id}`}>
                        {language === 'en' ? banner.ctaText_en : banner.ctaText_ar}
                        <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: Stock Themes & Trackers */}
        {settings.sectionVisibility.themes && (
          <section className="py-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Star className="h-6 w-6 text-primary" />
              {t.themes}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {newTheme && (
                <Link href={`/stocks/themes/${newTheme.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer border-primary/30 bg-gradient-to-br from-primary/10 to-transparent" data-testid="theme-new">
                    <CardContent className="p-6">
                      <Badge className="mb-3 bg-primary">{t.newlyAdded}</Badge>
                      <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-3xl">{newTheme.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{language === 'en' ? newTheme.title_en : newTheme.title_ar}</h3>
                          <p className="text-sm text-muted-foreground">{language === 'en' ? newTheme.description_en : newTheme.description_ar}</p>
                        </div>
                      </div>
                      <div className={`flex flex-wrap gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {newTheme.tickers.slice(0, 4).map(ticker => (
                          <Badge key={ticker} variant="outline" className="text-xs">{ticker}</Badge>
                        ))}
                        {newTheme.tickers.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{newTheme.tickers.length - 4}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
              {monthTheme && (
                <Link href={`/stocks/themes/${monthTheme.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer border-primary/30" data-testid="theme-month">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">{t.themeOfMonth}</Badge>
                      <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-3xl">{monthTheme.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{language === 'en' ? monthTheme.title_en : monthTheme.title_ar}</h3>
                          <p className="text-sm text-muted-foreground">{language === 'en' ? monthTheme.description_en : monthTheme.description_ar}</p>
                        </div>
                      </div>
                      <div className={`flex flex-wrap gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {monthTheme.tickers.slice(0, 4).map(ticker => (
                          <Badge key={ticker} variant="outline" className="text-xs">{ticker}</Badge>
                        ))}
                        {monthTheme.tickers.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{monthTheme.tickers.length - 4}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </div>

            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t.otherThemes}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherThemes.map(theme => (
                <Link key={theme.id} href={`/stocks/themes/${theme.slug}`}>
                  <Card className="hover-elevate cursor-pointer" data-testid={`theme-${theme.slug}`}>
                    <CardContent className={`p-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-2xl">{theme.icon}</span>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h4 className="font-semibold">{language === 'en' ? theme.title_en : theme.title_ar}</h4>
                        <p className="text-xs text-muted-foreground">{theme.tickers.length} stocks</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground ${isRTL ? 'rotate-180 mr-auto' : 'ml-auto'}`} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: Trending Stocks */}
        {settings.sectionVisibility.trending && (
          <section className="py-8" id="trending">
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="h-6 w-6 text-primary" />
                  {t.trending}
                </h2>
                <p className="text-sm text-muted-foreground">{t.trendingSubtitle}</p>
              </div>
              <Link href="/stocks">
                <Button variant="outline" size="sm" data-testid="view-all-stocks">
                  {t.viewAllStocks}
                  <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                </Button>
              </Link>
            </div>

            <Tabs value={trendingTab} onValueChange={setTrendingTab} className="mb-4">
              <TabsList>
                {settings.trendingTabs.map(tab => (
                  <TabsTrigger key={tab.key} value={tab.key} data-testid={`trending-tab-${tab.key}`}>
                    {language === 'en' ? tab.label_en : tab.label_ar}
                  </TabsTrigger>
                ))}
              </TabsList>
              {settings.trendingTabs.map(tab => (
                <TabsContent key={tab.key} value={tab.key}>
                  <div className={`flex gap-4 overflow-x-auto pb-2 scrollbar-hide ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {tab.tickers.slice(0, 8).map((ticker, index) => renderTrendingCard(ticker, index))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>
        )}

        {/* SECTION 5: Featured Stocks */}
        {settings.sectionVisibility.featured && (
          <section className="py-8">
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="h-6 w-6 text-primary" />
                {t.featuredStocks}
              </h2>
              <Link href="/stocks">
                <Button variant="outline" size="sm" data-testid="explore-stocks">
                  {t.exploreStocks}
                  <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {settings.featuredTickers.slice(0, 8).map(ticker => renderStockCard(ticker))}
            </div>
          </section>
        )}

        {/* SECTION 6: Stock Price Subscription */}
        {settings.sectionVisibility.priceAlerts && (
          <section className="py-8">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h2 className="text-xl font-bold">{t.priceAlerts}</h2>
                    <p className="text-sm text-muted-foreground">{t.priceAlertsDesc}</p>
                  </div>
                </div>

                {alertSuccess ? (
                  <div className={`flex items-center gap-3 p-4 bg-positive/10 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Check className="h-6 w-6 text-positive" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-semibold text-positive">{t.subscribed}</p>
                      <p className="text-sm text-muted-foreground">
                        {alertTickers.join(', ')} - {alertFrequency}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      data-testid="input-alert-email"
                    />
                    <div className={`flex gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        placeholder={t.tickerPlaceholder}
                        className="flex-1 min-w-[150px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.toUpperCase();
                            if (val && !alertTickers.includes(val)) {
                              setAlertTickers([...alertTickers, val]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        data-testid="input-alert-ticker"
                      />
                      <div className={`flex gap-1 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {alertTickers.map(ticker => (
                          <Badge 
                            key={ticker} 
                            variant="secondary" 
                            className="cursor-pointer"
                            onClick={() => setAlertTickers(alertTickers.filter(t => t !== ticker))}
                          >
                            {ticker} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-medium">{t.frequency}:</span>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {(['instant', 'daily', 'weekly'] as const).map(freq => (
                          <Button
                            key={freq}
                            variant={alertFrequency === freq ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setAlertFrequency(freq)}
                            data-testid={`freq-${freq}`}
                          >
                            {t[freq]}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className={`flex gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                      <span className="opacity-50">|</span>
                      <span className="opacity-50">Push (coming soon)</span>
                      <span className="opacity-50">|</span>
                      <span className="opacity-50">WhatsApp (coming soon)</span>
                    </div>
                    <Button onClick={handlePriceAlertSubscribe} className="w-full" data-testid="btn-subscribe-alert">
                      {t.subscribe}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* SECTION 7: Learn Section */}
        {settings.sectionVisibility.learn && (
          <section className="py-8">
            <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <BookOpen className="h-6 w-6 text-primary" />
                {t.learnSection}
              </h2>
              <Link href="/blog">
                <Button variant="outline" size="sm" data-testid="go-to-learn">
                  {t.goToLearn}
                  <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer overflow-hidden" data-testid="featured-post">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/50" />
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-3">{t.featuredArticle}</Badge>
                      <h3 className={`text-xl font-bold mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {language === 'en' ? featuredPost.title.en : featuredPost.title.ar}
                      </h3>
                      <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'text-right' : ''}`}>
                        {language === 'en' ? featuredPost.excerpt.en : featuredPost.excerpt.ar}
                      </p>
                      <div className={`flex items-center gap-3 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Clock className="h-3 w-3" />
                          {featuredPost.readTime} min read
                        </span>
                        <Badge variant="outline">{featuredPost.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}

              <div className="space-y-4">
                {secondaryPosts.map(post => post && (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="hover-elevate cursor-pointer" data-testid={`post-${post.id}`}>
                      <CardContent className={`p-4 flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                          <BookOpen className="h-8 w-8 text-primary/50" />
                        </div>
                        <div className={isRTL ? 'text-right' : ''}>
                          <h4 className="font-semibold mb-1 line-clamp-2">
                            {language === 'en' ? post.title.en : post.title.ar}
                          </h4>
                          <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} min</span>
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${isRTL ? 'text-right' : ''}`}>{t.browseByTopic}</h3>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {blogCategories.map(cat => (
                  <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                    <Badge variant="secondary" className="cursor-pointer hover-elevate px-4 py-2" data-testid={`category-${cat.slug}`}>
                      {language === 'en' ? cat.name.en : cat.name.ar}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: Newsletter Signup */}
        {settings.sectionVisibility.newsletter && (
          <section className="py-8">
            <Card className="bg-surface2 border-border/50">
              <CardContent className="p-6 md:p-8">
                <div className={`flex flex-col md:flex-row items-center gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <div className={`flex-1 text-center md:text-left ${isRTL ? 'md:text-right' : ''}`}>
                    <h2 className="text-xl font-bold mb-1">{t.newsletter}</h2>
                    <p className="text-sm text-muted-foreground">{t.newsletterDesc}</p>
                  </div>
                  {newsletterSuccess ? (
                    <div className={`flex items-center gap-2 text-positive ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Check className="h-5 w-5" />
                      <span className="font-semibold">{t.signedUp}</span>
                    </div>
                  ) : (
                    <div className={`flex gap-2 w-full md:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 md:w-64"
                        data-testid="input-newsletter-email"
                      />
                      <Button onClick={handleNewsletterSignup} data-testid="btn-newsletter-signup">
                        {t.signUp}
                      </Button>
                    </div>
                  )}
                </div>
                <p className={`text-xs text-muted-foreground mt-4 text-center md:text-left ${isRTL ? 'md:text-right' : ''}`}>
                  <Shield className="h-3 w-3 inline mr-1" />
                  {t.privacyNote}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* SECTION 9: Footer Disclosures */}
        {settings.sectionVisibility.disclosures && (
          <section className="py-8 border-t">
            <div className={`flex items-start gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className={isRTL ? 'text-right' : ''}>
                {t.disclosures}
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 baraka. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
