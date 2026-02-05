import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  ArrowLeft,
  Coins,
  AlertTriangle,
  ChartLine,
  Globe,
  ExternalLink,
  Star,
  Newspaper,
  Building2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import { RichText } from '@/components/RichText';
import { useLanguage } from '@/lib/language-context';
import type { CryptoPage, CryptoMarketSnapshot, CryptoFaqItem } from '@shared/schema';

type TabId = 'overview' | 'markets' | 'news' | 'about' | 'risks';

export default function CryptoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const { data: crypto, isLoading, error } = useQuery<CryptoPage>({
    queryKey: ['/api/crypto/pages/slug', slug],
  });

  const { data: snapshots = [] } = useQuery<CryptoMarketSnapshot[]>({
    queryKey: ['/api/crypto/snapshots'],
    enabled: !!crypto,
  });

  const snapshot = snapshots.find(s => s.providerCoinId === crypto?.coingeckoId);

  const labels = {
    en: {
      backToCrypto: 'Back to Crypto',
      notFound: 'Cryptocurrency Not Found',
      notFoundDesc: "The cryptocurrency you're looking for doesn't exist or has been removed.",
      currentPrice: 'Current Price',
      marketCap: 'Market Cap',
      fdv: 'Fully Diluted',
      volume24h: '24h Volume',
      high24h: '24h High',
      low24h: '24h Low',
      circulatingSupply: 'Circulating Supply',
      totalSupply: 'Total Supply',
      maxSupply: 'Max Supply',
      allTimeHigh: 'All-Time High',
      allTimeLow: 'All-Time Low',
      trade: 'Trade',
      buy: 'Buy',
      overview: 'Overview',
      markets: 'Markets',
      news: 'News',
      about: 'About',
      risks: 'Risks',
      keyStats: 'Key Statistics',
      priceChart: 'Price Chart',
      highlights: 'Highlights',
      relatedAssets: 'Related Assets',
      whatIs: 'What is',
      howItWorks: 'How It Works',
      useCases: 'Use Cases',
      riskFactors: 'Risk Factors',
      disclaimers: 'Important Disclosures',
      faq: 'Frequently Asked Questions',
      disclaimer: 'Capital at risk. Crypto assets are highly volatile. Not investment advice.',
      rank: 'Rank',
      change24h: '24h',
      change7d: '7d',
      seeAll: 'See All',
      exchange: 'Exchange',
      pair: 'Pair',
      price: 'Price',
      volume: 'Volume',
      trustScore: 'Trust',
      noMarketsData: 'Markets data not available',
      noNewsData: 'News not available',
      supplyInfo: 'Supply Information',
      priceChange: 'Price Change',
      fromAth: 'from ATH',
      fromAtl: 'from ATL',
      dataSource: 'Data from CoinGecko',
    },
    ar: {
      backToCrypto: 'العودة إلى العملات الرقمية',
      notFound: 'العملة الرقمية غير موجودة',
      notFoundDesc: 'العملة الرقمية التي تبحث عنها غير موجودة أو تمت إزالتها.',
      currentPrice: 'السعر الحالي',
      marketCap: 'القيمة السوقية',
      fdv: 'القيمة المخففة بالكامل',
      volume24h: 'حجم التداول ٢٤س',
      high24h: 'أعلى سعر ٢٤س',
      low24h: 'أدنى سعر ٢٤س',
      circulatingSupply: 'العرض المتداول',
      totalSupply: 'إجمالي العرض',
      maxSupply: 'أقصى عرض',
      allTimeHigh: 'أعلى سعر تاريخي',
      allTimeLow: 'أدنى سعر تاريخي',
      trade: 'تداول',
      buy: 'شراء',
      overview: 'نظرة عامة',
      markets: 'الأسواق',
      news: 'الأخبار',
      about: 'حول',
      risks: 'المخاطر',
      keyStats: 'الإحصائيات الرئيسية',
      priceChart: 'مخطط السعر',
      highlights: 'أبرز النقاط',
      relatedAssets: 'أصول ذات صلة',
      whatIs: 'ما هو',
      howItWorks: 'كيف يعمل',
      useCases: 'حالات الاستخدام',
      riskFactors: 'عوامل المخاطرة',
      disclaimers: 'إفصاحات مهمة',
      faq: 'الأسئلة الشائعة',
      disclaimer: 'رأس المال في خطر. الأصول الرقمية شديدة التقلب. ليست نصيحة استثمارية.',
      rank: 'الترتيب',
      change24h: '٢٤س',
      change7d: '٧أيام',
      seeAll: 'عرض الكل',
      exchange: 'البورصة',
      pair: 'الزوج',
      price: 'السعر',
      volume: 'الحجم',
      trustScore: 'الثقة',
      noMarketsData: 'بيانات الأسواق غير متوفرة',
      noNewsData: 'الأخبار غير متوفرة',
      supplyInfo: 'معلومات العرض',
      priceChange: 'تغير السعر',
      fromAth: 'من الأعلى',
      fromAtl: 'من الأدنى',
      dataSource: 'البيانات من كوين جيكو',
    },
  };

  const t = labels[language];

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'N/A';
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toFixed(8)}`;
  };

  const formatLargeNumber = (num?: number) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  const formatSupply = (supply?: number, symbol?: string) => {
    if (supply === undefined || supply === null) return 'N/A';
    const suffix = symbol ? ` ${symbol}` : '';
    if (supply >= 1e12) return `${(supply / 1e12).toFixed(2)}T${suffix}`;
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B${suffix}`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M${suffix}`;
    return `${supply.toLocaleString()}${suffix}`;
  };

  const formatPercent = (pct?: number) => {
    if (pct === undefined || pct === null) return null;
    const formatted = pct.toFixed(2);
    const isPositive = pct >= 0;
    return { value: `${isPositive ? '+' : ''}${formatted}%`, isPositive };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <Bitcoin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t.notFound}</h1>
          <p className="text-muted-foreground mb-6">{t.notFoundDesc}</p>
          <Link href="/crypto">
            <Button variant="outline" data-testid="button-back-not-found">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {t.backToCrypto}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceChange24h = formatPercent(snapshot?.priceChange24hPct);
  const title = language === 'en' ? crypto.title_en : crypto.title_ar;
  const heroKicker = language === 'en' ? crypto.heroKicker_en : crypto.heroKicker_ar;
  const heroSummary = language === 'en' ? crypto.heroSummary_en : crypto.heroSummary_ar;
  const highlights = language === 'en' ? crypto.highlights_en : crypto.highlights_ar;
  const aboutExcerpt = language === 'en' ? crypto.aboutExcerpt_en : crypto.aboutExcerpt_ar;
  const aboutFull = language === 'en' ? crypto.aboutFull_en : crypto.aboutFull_ar;
  const whatIsIt = language === 'en' ? crypto.whatIsIt_en : crypto.whatIsIt_ar;
  const howItWorks = language === 'en' ? crypto.howItWorks_en : crypto.howItWorks_ar;
  const useCases = language === 'en' ? crypto.useCases_en : crypto.useCases_ar;
  const risks = language === 'en' ? crypto.risks_en : crypto.risks_ar;
  const disclaimers = language === 'en' ? crypto.disclaimers_en : crypto.disclaimers_ar;
  const disclosuresFooterNote = language === 'en' ? crypto.disclosuresFooterNote_en : crypto.disclosuresFooterNote_ar;
  const primaryCtaText = language === 'en' ? crypto.primaryCtaText_en : crypto.primaryCtaText_ar;
  const secondaryCtaText = language === 'en' ? crypto.secondaryCtaText_en : crypto.secondaryCtaText_ar;
  const faq = crypto.faq || [];

  const displayAbout = aboutFull || aboutExcerpt || whatIsIt;

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <BarakaHeader />

      {/* Hero Section - Binance/Coinbase inspired */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-4">
            <Link href="/crypto">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {t.backToCrypto}
              </Button>
            </Link>
          </div>

          <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Left: Logo, Name, Price */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {crypto.logoUrl || snapshot?.image ? (
                  <img 
                    src={crypto.logoUrl || snapshot?.image} 
                    alt={crypto.name} 
                    className="w-12 h-12"
                    data-testid="img-crypto-logo"
                  />
                ) : (
                  <Bitcoin className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h1 className="text-2xl font-bold" data-testid="text-crypto-title">
                    {title || crypto.name}
                  </h1>
                  <Badge variant="secondary" className="uppercase font-mono">
                    {crypto.symbol}
                  </Badge>
                  {crypto.marketCapRank && (
                    <Badge variant="outline" className="text-xs">
                      #{crypto.marketCapRank}
                    </Badge>
                  )}
                </div>
                {heroKicker && (
                  <p className="text-sm text-muted-foreground mt-1">{heroKicker}</p>
                )}
              </div>
            </div>

            {/* Right: Price and Change */}
            <div className={`flex flex-col items-start md:items-end ${isRTL ? 'md:items-start' : 'md:items-end'}`}>
              <div className={`flex items-baseline gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-3xl font-bold" data-testid="text-price">
                  {formatPrice(snapshot?.priceUsd)}
                </span>
                {priceChange24h && (
                  <span 
                    className={`flex items-center gap-1 text-lg font-medium ${priceChange24h.isPositive ? 'text-green-600' : 'text-red-600'}`}
                    data-testid="text-price-change"
                  >
                    {priceChange24h.isPositive ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {priceChange24h.value}
                  </span>
                )}
              </div>
              <div className={`flex items-center gap-4 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button size="lg" data-testid="button-trade">
                  {primaryCtaText || `${t.buy} ${crypto.symbol}`}
                </Button>
                {secondaryCtaText && crypto.secondaryCtaUrl && (
                  <Button variant="outline" size="lg" asChild>
                    <a href={crypto.secondaryCtaUrl} target="_blank" rel="noopener noreferrer">
                      {secondaryCtaText}
                      <ExternalLink className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
            <TabsList className="h-12 bg-transparent border-0 p-0 gap-0">
              <TabsTrigger 
                value="overview" 
                className="h-12 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-overview"
              >
                <Globe className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.overview}
              </TabsTrigger>
              <TabsTrigger 
                value="markets" 
                className="h-12 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-markets"
              >
                <Building2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.markets}
              </TabsTrigger>
              <TabsTrigger 
                value="news" 
                className="h-12 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-news"
              >
                <Newspaper className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.news}
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="h-12 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-about"
              >
                <Info className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.about}
              </TabsTrigger>
              <TabsTrigger 
                value="risks" 
                className="h-12 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-risks"
              >
                <ShieldAlert className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.risks}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-8">
              {/* Key Stats Grid */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t.keyStats}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <StatCard 
                    icon={<BarChart3 className="h-4 w-4" />}
                    label={t.marketCap}
                    value={formatLargeNumber(snapshot?.marketCapUsd)}
                    isRTL={isRTL}
                  />
                  <StatCard 
                    icon={<ChartLine className="h-4 w-4" />}
                    label={t.volume24h}
                    value={formatLargeNumber(snapshot?.volume24hUsd)}
                    isRTL={isRTL}
                  />
                  <StatCard 
                    icon={<Coins className="h-4 w-4" />}
                    label={t.circulatingSupply}
                    value={formatSupply(snapshot?.circulatingSupply, crypto.symbol)}
                    isRTL={isRTL}
                  />
                  <StatCard 
                    icon={<TrendingUp className="h-4 w-4" />}
                    label={t.allTimeHigh}
                    value={formatPrice(snapshot?.athUsd)}
                    subValue={snapshot?.athDate ? new Date(snapshot.athDate).toLocaleDateString() : undefined}
                    isRTL={isRTL}
                  />
                  <StatCard 
                    icon={<TrendingDown className="h-4 w-4" />}
                    label={t.allTimeLow}
                    value={formatPrice(snapshot?.atlUsd)}
                    subValue={snapshot?.atlDate ? new Date(snapshot.atlDate).toLocaleDateString() : undefined}
                    isRTL={isRTL}
                  />
                  <StatCard 
                    icon={<Coins className="h-4 w-4" />}
                    label={t.maxSupply}
                    value={snapshot?.maxSupply ? formatSupply(snapshot.maxSupply, crypto.symbol) : '∞'}
                    isRTL={isRTL}
                  />
                </div>
              </section>

              {/* Highlights */}
              {highlights && highlights.length > 0 && (
                <section>
                  <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t.highlights}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {highlights.map((highlight, i) => (
                      <div 
                        key={i} 
                        className={`flex items-start gap-3 p-4 bg-muted/50 rounded-lg ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                      >
                        <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* About Excerpt */}
              {(aboutExcerpt || heroSummary) && (
                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Info className="h-5 w-5 text-primary" />
                        {t.whatIs} {crypto.name}?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RichText 
                        html={aboutExcerpt || heroSummary} 
                        className="text-muted-foreground" 
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      {displayAbout && displayAbout !== aboutExcerpt && (
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto mt-2 text-primary underline-offset-4 hover:underline"
                          onClick={() => setActiveTab('about')}
                        >
                          {t.seeAll}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Price Chart Placeholder */}
              <section>
                <h2 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>{t.priceChart}</h2>
                <Card>
                  <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ChartLine className="h-12 w-12 mb-4" />
                      <p className="text-sm">Chart integration coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </TabsContent>

          {/* Markets Tab */}
          <TabsContent value="markets" className="mt-0">
            <div className="space-y-6">
              <h2 className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>{crypto.name} {t.markets}</h2>
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-12 w-12 mb-4" />
                    <p className="text-sm">{t.noMarketsData}</p>
                    <p className="text-xs mt-2">{t.dataSource}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
            <div className="space-y-6">
              <h2 className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>{crypto.name} {t.news}</h2>
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Newspaper className="h-12 w-12 mb-4" />
                    <p className="text-sm">{t.noNewsData}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-0">
            <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
              {/* Full About Content */}
              {displayAbout && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.whatIs} {crypto.name}?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichText 
                      html={displayAbout} 
                      className="text-muted-foreground" 
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </CardContent>
                </Card>
              )}

              {/* How It Works */}
              {howItWorks && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.howItWorks}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichText 
                      html={howItWorks} 
                      className="text-muted-foreground" 
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Use Cases */}
              {useCases && useCases.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.useCases}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className={`space-y-3 ${isRTL ? 'list-inside' : 'list-inside'}`}>
                      {useCases.map((useCase, i) => (
                        <li key={i} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Supply Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.supplyInfo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t.circulatingSupply}</p>
                      <p className="font-medium">{formatSupply(snapshot?.circulatingSupply, crypto.symbol)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t.totalSupply}</p>
                      <p className="font-medium">{formatSupply(snapshot?.totalSupply, crypto.symbol)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t.maxSupply}</p>
                      <p className="font-medium">
                        {snapshot?.maxSupply ? formatSupply(snapshot.maxSupply, crypto.symbol) : '∞ (Unlimited)'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks" className="mt-0">
            <div className={`space-y-8 ${isRTL ? 'text-right' : ''}`}>
              {/* Risk Factors */}
              {risks && (
                <Card className="border-amber-500/30">
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-amber-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <AlertTriangle className="h-5 w-5" />
                      {t.riskFactors}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RichText 
                      html={risks} 
                      className="text-muted-foreground" 
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </CardContent>
                </Card>
              )}

              {/* FAQ Section */}
              {faq.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">{t.faq}</h2>
                  <div className="space-y-2">
                    {faq.map((item: CryptoFaqItem, i: number) => {
                      const question = language === 'en' ? item.question_en : item.question_ar;
                      const answer = language === 'en' ? item.answer_en : item.answer_ar;
                      const isExpanded = expandedFaq === i;
                      
                      return (
                        <Card key={i} className="overflow-hidden">
                          <button
                            className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                            onClick={() => setExpandedFaq(isExpanded ? null : i)}
                            data-testid={`faq-question-${i}`}
                          >
                            <span className="font-medium">{question}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-6 pb-4">
                              <Separator className="mb-4" />
                              <p className="text-muted-foreground">{answer}</p>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Disclaimers */}
              {disclaimers && disclaimers.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">{t.disclaimers}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {disclaimers.map((disclaimer, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {disclaimer}
                        </li>
                      ))}
                    </ul>
                    {disclosuresFooterNote && (
                      <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                        {disclosuresFooterNote}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">
            {t.disclaimer}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {t.dataSource}
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue,
  isRTL 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  subValue?: string;
  isRTL: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-primary">{icon}</span>
          <span className="text-xs text-muted-foreground truncate">{label}</span>
        </div>
        <p className={`text-lg font-semibold truncate ${isRTL ? 'text-right' : ''}`}>{value}</p>
        {subValue && (
          <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}
