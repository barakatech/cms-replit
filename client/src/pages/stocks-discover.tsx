import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  Flame, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Moon,
  Sun,
  Eye,
  Cpu,
  Car,
  Monitor,
  CreditCard,
  Coins,
  Heart,
  ShoppingCart,
  Fuel,
  type LucideIcon
} from 'lucide-react';
import { mockStocks } from '@/lib/mockData';
import { marketDataProvider, type MarketData } from '@/lib/marketDataProvider';
import { 
  mockStockCollections, 
  mockDiscoverStocksSettings,
  type StockCollection 
} from '@/lib/discoverData';
import { useTheme } from '@/hooks/use-theme';
import BarakaHeader from '@/components/BarakaHeader';

export default function StocksDiscover() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { resolvedTheme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [searchResults, setSearchResults] = useState<typeof mockStocks>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const isRTL = language === 'ar';
  const settings = mockDiscoverStocksSettings;

  useEffect(() => {
    const allTickers = [
      ...settings.trendingTickers,
      ...settings.gainersTickers,
      ...settings.losersTickers,
      ...settings.featuredTickers,
      ...mockStockCollections.flatMap(c => c.tickers),
    ];
    const uniqueTickers = Array.from(new Set(allTickers));
    
    marketDataProvider.getMarketDataBatch(uniqueTickers).then(setMarketData);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = mockStocks.filter(
        s => s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
             s.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const labels = {
    en: {
      heroTitle: settings.heroTitle.en,
      heroSubtitle: settings.heroSubtitle.en,
      searchPlaceholder: 'Search by ticker or company name...',
      trending: 'Trending',
      mostViewed: 'Most Viewed',
      topGainers: 'Top Gainers',
      topLosers: 'Top Losers',
      newlyAdded: 'Newly Added',
      trendingStocks: 'Trending Stocks',
      viewAll: 'View all',
      biggestMovers: 'Biggest Movers',
      gainers: 'Gainers',
      losers: 'Losers',
      exploreByTheme: 'Explore by Theme',
      featuredStocks: 'Featured Stock Pages',
      stocks: 'stocks',
      disclaimer: 'Capital at risk. For informational purposes only. Not investment advice.',
      noResults: 'No stocks found',
    },
    ar: {
      heroTitle: settings.heroTitle.ar,
      heroSubtitle: settings.heroSubtitle.ar,
      searchPlaceholder: 'البحث بالرمز أو اسم الشركة...',
      trending: 'الرائجة',
      mostViewed: 'الأكثر مشاهدة',
      topGainers: 'الأعلى ربحاً',
      topLosers: 'الأعلى خسارة',
      newlyAdded: 'المضافة حديثاً',
      trendingStocks: 'الأسهم الرائجة',
      viewAll: 'عرض الكل',
      biggestMovers: 'أكبر التحركات',
      gainers: 'الرابحون',
      losers: 'الخاسرون',
      exploreByTheme: 'استكشف حسب الموضوع',
      featuredStocks: 'صفحات الأسهم المميزة',
      stocks: 'أسهم',
      disclaimer: 'رأس المال في خطر. للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.',
      noResults: 'لم يتم العثور على أسهم',
    },
  };
  
  const t = labels[language];

  const filters = [
    { id: 'trending', label: t.trending, icon: Flame },
    { id: 'most-viewed', label: t.mostViewed, icon: Eye },
    { id: 'gainers', label: t.topGainers, icon: TrendingUp },
    { id: 'losers', label: t.topLosers, icon: TrendingDown },
    { id: 'new', label: t.newlyAdded, icon: Star },
  ];

  const StockCard = ({ ticker, showSparkline = false }: { ticker: string; showSparkline?: boolean }) => {
    const data = marketData[ticker];
    const stock = mockStocks.find(s => s.ticker === ticker);
    if (!data) return null;
    
    const isPositive = data.changePercent >= 0;
    
    return (
      <Link href={`/stocks/${ticker.toLowerCase()}`}>
        <Card className="hover-elevate cursor-pointer min-w-[180px]" data-testid={`stock-card-${ticker}`}>
          <CardContent className="p-4">
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2">
                  <span className="text-sm font-bold">{ticker.slice(0, 2)}</span>
                </div>
                <p className="font-mono font-bold text-sm">{ticker}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {stock?.companyName || ticker}
                </p>
              </div>
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <p className="font-semibold">${data.price.toFixed(2)}</p>
                <p className={`text-sm flex items-center gap-0.5 ${isPositive ? 'text-positive' : 'text-negative'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
            {showSparkline && data.sparkline && (
              <div className="mt-3 h-8">
                <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={isPositive ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)'}
                    strokeWidth="2"
                    points={data.sparkline.map((v, i) => {
                      const min = Math.min(...data.sparkline!);
                      const max = Math.max(...data.sparkline!);
                      const range = max - min || 1;
                      const x = (i / (data.sparkline!.length - 1)) * 100;
                      const y = 30 - ((v - min) / range) * 28;
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

  const MoverRow = ({ ticker, rank }: { ticker: string; rank: number }) => {
    const data = marketData[ticker];
    const stock = mockStocks.find(s => s.ticker === ticker);
    if (!data) return null;
    
    const isPositive = data.changePercent >= 0;
    
    return (
      <Link href={`/stocks/${ticker.toLowerCase()}`}>
        <div 
          className={`flex items-center justify-between py-3 px-2 hover-elevate rounded-lg cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
          data-testid={`mover-row-${ticker}`}
        >
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-muted-foreground text-sm w-4">{rank}</span>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-xs font-bold">{ticker.slice(0, 2)}</span>
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="font-mono font-semibold text-sm">{ticker}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                {stock?.companyName || ticker}
              </p>
            </div>
          </div>
          <div className={isRTL ? 'text-left' : 'text-right'}>
            <p className="font-medium text-sm">${data.price.toFixed(2)}</p>
            <p className={`text-xs ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </Link>
    );
  };

  const iconMap: Record<string, LucideIcon> = {
    Moon,
    Cpu,
    Car,
    Monitor,
    CreditCard,
    Coins,
    Heart,
    ShoppingCart,
    Fuel,
  };

  const getIcon = (iconName?: string): LucideIcon => {
    if (!iconName) return Star;
    return iconMap[iconName] || Star;
  };

  const FeaturedThemeCard = ({ collection }: { collection: StockCollection }) => {
    const IconComponent = getIcon(collection.iconName);
    return (
      <Link href={`/stocks/themes/${collection.slug}`}>
        <Card className="hover-elevate cursor-pointer" data-testid={`featured-theme-${collection.slug}`}>
          <CardContent className="p-5">
            <Badge variant="outline" className="mb-4 text-xs">
              {language === 'en' ? 'Theme of the Month' : 'موضوع الشهر'}
            </Badge>
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0">
                <IconComponent className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold mb-1">{collection.title[language]}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {collection.description[language]}
                </p>
                <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-end' : ''}`}>
                  {collection.tickers.slice(0, 4).map(ticker => (
                    <Badge key={ticker} variant="outline" className="text-xs font-mono">
                      {ticker}
                    </Badge>
                  ))}
                  {collection.tickers.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{collection.tickers.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const ThemeRow = ({ collection }: { collection: StockCollection }) => {
    const IconComponent = getIcon(collection.iconName);
    return (
      <Link href={`/stocks/themes/${collection.slug}`}>
        <Card className="hover-elevate cursor-pointer" data-testid={`theme-row-${collection.slug}`}>
          <CardContent className="p-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <IconComponent className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="font-medium">{collection.title[language]}</h3>
                  <p className="text-xs text-muted-foreground">
                    {collection.tickers.length} {t.stocks}
                  </p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 text-muted-foreground flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            </div>
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
      <BarakaHeader />

      <main>
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className={`max-w-2xl mx-auto text-center ${isRTL ? 'text-center' : ''}`}>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="hero-title">
                {t.heroTitle}
              </h1>
              <p className="text-muted-foreground mb-6" data-testid="hero-subtitle">
                {t.heroSubtitle}
              </p>
              
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 text-base`}
                  data-testid="input-search"
                />
                
                {showSearchResults && (
                  <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-auto">
                    <CardContent className="p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map(stock => (
                          <Link key={stock.id} href={`/stocks/${stock.ticker.toLowerCase()}`}>
                            <div 
                              className={`flex items-center gap-3 p-3 hover-elevate rounded-lg cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                              onClick={() => setShowSearchResults(false)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <span className="text-sm font-bold">{stock.ticker.slice(0, 2)}</span>
                              </div>
                              <div className={isRTL ? 'text-right' : ''}>
                                <p className="font-mono font-semibold">{stock.ticker}</p>
                                <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">{t.noResults}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className={`flex flex-wrap items-center justify-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {filters.map(filter => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter.id)}
                    data-testid={`filter-${filter.id}`}
                  >
                    <filter.icon className="h-4 w-4 mr-1" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 container mx-auto px-4">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Flame className="h-5 w-5 text-orange-500" />
              {t.trendingStocks}
            </h2>
            <Link href="/stocks?section=trending">
              <Button variant="ghost" size="sm" data-testid="link-view-all-trending">
                {t.viewAll}
                <ChevronRight className={`h-4 w-4 ml-1 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {settings.trendingTickers.map(ticker => (
                <StockCard key={ticker} ticker={ticker} showSparkline={settings.showSparkline} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <Separator />

        <section className="py-8 container mx-auto px-4">
          <h2 className={`text-xl font-semibold mb-6 ${isRTL ? 'text-right' : ''}`}>
            {t.biggestMovers}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base flex items-center gap-2 text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="h-5 w-5" />
                  {t.gainers}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {settings.gainersTickers.slice(0, 5).map((ticker, idx) => (
                  <MoverRow key={ticker} ticker={ticker} rank={idx + 1} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-base flex items-center gap-2 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingDown className="h-5 w-5" />
                  {t.losers}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {settings.losersTickers.slice(0, 5).map((ticker, idx) => (
                  <MoverRow key={ticker} ticker={ticker} rank={idx + 1} />
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="py-8 container mx-auto px-4">
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Star className="h-5 w-5 text-primary" />
            <h2 className={`text-xl font-semibold ${isRTL ? 'text-right' : ''}`}>
              {language === 'en' ? 'Stock Themes & Trackers' : 'موضوعات ومتتبعات الأسهم'}
            </h2>
          </div>
          
          {(() => {
            const activeCollections = mockStockCollections.filter(c => c.status === 'active');
            const featuredTheme = activeCollections.find(c => c.isFeatured);
            const otherThemes = activeCollections.filter(c => !c.isFeatured);
            
            return (
              <div className="space-y-6">
                {featuredTheme && (
                  <FeaturedThemeCard collection={featuredTheme} />
                )}
                
                {otherThemes.length > 0 && (
                  <div>
                    <h3 className={`text-sm font-medium text-muted-foreground mb-3 ${isRTL ? 'text-right' : ''}`}>
                      {language === 'en' ? 'Other Themes & Trackers' : 'موضوعات ومتتبعات أخرى'}
                    </h3>
                    <div className="space-y-2">
                      {otherThemes.map(collection => (
                        <ThemeRow key={collection.id} collection={collection} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </section>

        <Separator />

        <section className="py-8 container mx-auto px-4">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-xl font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Star className="h-5 w-5 text-yellow-500" />
              {t.featuredStocks}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {settings.featuredTickers.map(ticker => (
              <StockCard key={ticker} ticker={ticker} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground" data-testid="disclaimer">
            {t.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
