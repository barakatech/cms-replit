import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  Globe,
  Moon,
  Sun,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockStocks, mockBlogs } from '@/lib/mockData';
import { marketDataProvider, type MarketData } from '@/lib/marketDataProvider';
import { mockDiscoverStocksSettings, mockBlogHomeSettings } from '@/lib/discoverData';
import { useTheme } from '@/hooks/use-theme';

export default function Discover() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const { resolvedTheme, toggleTheme } = useTheme();
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  
  const isRTL = language === 'ar';
  const settings = mockDiscoverStocksSettings;
  const blogSettings = mockBlogHomeSettings;

  useEffect(() => {
    marketDataProvider.getMarketDataBatch(settings.trendingTickers.slice(0, 4)).then(setMarketData);
  }, []);

  const featuredPost = mockBlogs.find(p => p.id === blogSettings.featuredPostId);

  const labels = {
    en: {
      heroTitle: 'Discover',
      heroSubtitle: 'Explore stocks, learn about investing, and stay informed',
      stocks: 'Stocks',
      stocksDesc: 'Explore popular companies and market themes',
      blog: 'Learn',
      blogDesc: 'Educational guides and market insights',
      trendingNow: 'Trending now',
      featuredArticle: 'Featured article',
      exploreStocks: 'Explore Stocks',
      readArticles: 'Read Articles',
      disclaimer: 'Capital at risk. For informational purposes only. Not investment advice.',
    },
    ar: {
      heroTitle: 'اكتشف',
      heroSubtitle: 'استكشف الأسهم، تعلم عن الاستثمار، وابق على اطلاع',
      stocks: 'الأسهم',
      stocksDesc: 'استكشف الشركات الشائعة وموضوعات السوق',
      blog: 'تعلم',
      blogDesc: 'أدلة تعليمية ورؤى السوق',
      trendingNow: 'الرائج الآن',
      featuredArticle: 'المقال المميز',
      exploreStocks: 'استكشف الأسهم',
      readArticles: 'اقرأ المقالات',
      disclaimer: 'رأس المال في خطر. للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.',
    },
  };
  
  const t = labels[language];

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
                    {language === 'en' ? 'Stocks' : 'الأسهم'}
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="ghost" size="sm" data-testid="nav-blog">
                    {language === 'en' ? 'Learn' : 'تعلم'}
                  </Button>
                </Link>
              </nav>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex" data-testid="link-admin">
                  {language === 'en' ? 'Admin' : 'الإدارة'}
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

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="hero-title">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto" data-testid="hero-subtitle">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover-elevate overflow-hidden" data-testid="discover-stocks-card">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h2 className="text-2xl font-bold">{t.stocks}</h2>
                  <p className="text-sm text-muted-foreground">{t.stocksDesc}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'text-right' : ''}`}>
                {t.trendingNow}
              </p>
              <div className="space-y-2 mb-4">
                {settings.trendingTickers.slice(0, 4).map(ticker => {
                  const data = marketData[ticker];
                  const stock = mockStocks.find(s => s.ticker === ticker);
                  if (!data) return null;
                  const isPositive = data.changePercent >= 0;
                  
                  return (
                    <Link key={ticker} href={`/stocks/${ticker.toLowerCase()}`}>
                      <div className={`flex items-center justify-between py-2 hover-elevate rounded-lg cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="font-mono font-semibold text-sm">{ticker}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {stock?.companyName}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="font-medium text-sm">${data.price.toFixed(2)}</span>
                          <span className={`text-xs flex items-center ${isPositive ? 'text-positive' : 'text-negative'}`}>
                            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link href="/stocks">
                <Button className="w-full" data-testid="button-explore-stocks">
                  {t.exploreStocks}
                  <ChevronRight className={`h-4 w-4 ml-1 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate overflow-hidden" data-testid="discover-blog-card">
            <div className="bg-gradient-to-br from-accent/30 to-accent/10 p-6">
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h2 className="text-2xl font-bold">{t.blog}</h2>
                  <p className="text-sm text-muted-foreground">{t.blogDesc}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'text-right' : ''}`}>
                {t.featuredArticle}
              </p>
              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`}>
                  <div className="mb-4 hover-elevate rounded-lg cursor-pointer">
                    <Badge variant="secondary" className="mb-2">{featuredPost.category}</Badge>
                    <h3 className={`font-semibold line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                      {featuredPost.title[language]}
                    </h3>
                    <p className={`text-sm text-muted-foreground mt-1 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                      {featuredPost.excerpt[language]}
                    </p>
                  </div>
                </Link>
              )}
              <Link href="/blog">
                <Button variant="outline" className="w-full" data-testid="button-read-articles">
                  {t.readArticles}
                  <ChevronRight className={`h-4 w-4 ml-1 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground" data-testid="disclaimer">
            {t.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
