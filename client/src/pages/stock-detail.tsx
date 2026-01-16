import { useState, useEffect } from 'react';
import { Link, useParams, useSearch } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Globe, 
  Moon, 
  Sun, 
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { mockStocks, type StockPage } from '@/lib/mockData';
import { StockLogo } from '@/components/StockLogo';
import { 
  StockHero, 
  StockChartPanel, 
  FAQAccordion,
  NewsList 
} from '@/components/stock-preview';
import {
  TradeWidgetBlock,
  AboutCompanyBlock,
  KeyStatisticsBlock,
  AnalystRatingsBlock,
  EarningsBlock,
  TrendingStocksBlock,
  PreviewBanner,
} from '@/components/stock-blocks';
import { useTheme } from '@/hooks/use-theme';
import BarakaHeader from '@/components/BarakaHeader';
import SignUpCTA from '@/components/SignUpCTA';
import WatchStockModal from '@/components/WatchStockModal';

export default function StockDetail() {
  const params = useParams<{ slug: string }>();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const isPreview = searchParams.get('preview') === '1';
  const localeParam = searchParams.get('locale') as 'en' | 'ar' | null;
  
  const [language, setLanguage] = useState<'en' | 'ar'>(localeParam || 'en');
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  
  const isRTL = language === 'ar';
  
  const stock = mockStocks.find(s => s.ticker.toLowerCase() === params.slug?.toLowerCase());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!stock) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Stock not found</h1>
              <p className="text-muted-foreground mb-4">The stock you're looking for doesn't exist.</p>
              <Link href="/stocks">
                <Button>Browse all stocks</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isPositive = stock.dynamicData.change >= 0;

  const navItems = [
    { id: 'about', labelEn: 'About', labelAr: 'حول' },
    { id: 'statistics', labelEn: 'Statistics', labelAr: 'الإحصائيات' },
    { id: 'ratings', labelEn: 'Ratings', labelAr: 'التقييمات' },
    { id: 'earnings', labelEn: 'Earnings', labelAr: 'الأرباح' },
    { id: 'news', labelEn: 'News', labelAr: 'الأخبار' },
    { id: 'faq', labelEn: 'FAQ', labelAr: 'الأسئلة' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {isPreview && (
        <PreviewBanner ticker={stock.ticker} language={language} isPreview={isPreview} />
      )}

      <header 
        className={`sticky ${isPreview ? 'top-[40px]' : 'top-0'} z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all ${isScrolled ? 'py-2' : 'py-3'}`}
        data-testid="sticky-header"
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href="/stocks">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
              
              {isScrolled ? (
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-bold">{stock.ticker}</span>
                  <span className="text-lg font-semibold">${stock.dynamicData.price.toFixed(2)}</span>
                  <span className={`text-sm ${isPositive ? 'text-positive' : 'text-negative'}`}>
                    {isPositive ? '+' : ''}{stock.dynamicData.changePercent.toFixed(2)}%
                  </span>
                </div>
              ) : (
                <Link href="/">
                  <span className="text-xl font-bold text-primary cursor-pointer" data-testid="logo">baraka</span>
                </Link>
              )}
            </div>

            <nav className={`hidden lg:flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2"
                  onClick={() => scrollToSection(item.id)}
                  data-testid={`nav-${item.id}`}
                >
                  {language === 'en' ? item.labelEn : item.labelAr}
                </Button>
              ))}
            </nav>

            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'AR' : 'EN'}
              </Button>
              {isScrolled && (
                <SignUpCTA 
                  language={language}
                  className="hidden sm:flex"
                  customText={language === 'en' ? `Trade ${stock.ticker}` : `تداول ${stock.ticker}`}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="lg:hidden sticky top-[49px] z-40 border-b bg-background overflow-x-auto">
        <div className={`flex items-center gap-1 px-4 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navItems.slice(0, 5).map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => scrollToSection(item.id)}
            >
              {language === 'en' ? item.labelEn : item.labelAr}
            </Button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
            <div className={`lg:col-span-8 space-y-6 ${isRTL ? 'lg:col-start-5' : ''}`}>
              <StockHero stock={stock} language={language} />
              
              <StockChartPanel stock={stock} language={language} />

              <AboutCompanyBlock stock={stock} language={language} />
              
              <KeyStatisticsBlock stock={stock} language={language} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalystRatingsBlock stock={stock} language={language} />
                <EarningsBlock stock={stock} language={language} />
              </div>
              
              <NewsList stock={stock} language={language} />
              
              <FAQAccordion stock={stock} language={language} />

              {stock.internalLinks && (
                <section className="space-y-4">
                  <h2 className={`text-lg font-semibold ${isRTL ? 'text-right' : ''}`}>
                    {language === 'en' ? 'Similar Stocks' : 'أسهم مشابهة'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[...stock.internalLinks.autoSuggestions.map(s => s.ticker), ...stock.internalLinks.manual].slice(0, 4).map((ticker) => (
                      <Link key={ticker} href={`/stocks/${ticker.toLowerCase()}`}>
                        <Card className="hover-elevate cursor-pointer" data-testid={`related-stock-${ticker}`}>
                          <CardContent className="p-4">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <StockLogo ticker={ticker} size="sm" />
                                <span className="font-mono font-semibold">{ticker}</span>
                              </div>
                              <ChevronRight className={`h-4 w-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-md p-4 mt-4">
                    <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                      {language === 'en' 
                        ? 'Capital at risk. The value of investments can go down as well as up. You may get back less than you invest. This is not investment advice, capital at risk.' 
                        : 'رأس المال في خطر. يمكن أن تنخفض قيمة الاستثمارات وكذلك ترتفع. قد تحصل على أقل مما تستثمر. هذه ليست نصيحة استثمارية، رأس المال في خطر.'}
                    </p>
                  </div>
                </section>
              )}
            </div>

            <aside className={`lg:col-span-4 space-y-6 ${isRTL ? 'lg:col-start-1' : ''}`}>
              <div className="lg:sticky lg:top-24 space-y-6">
                <TradeWidgetBlock stock={stock} language={language} onWatchClick={() => setWatchModalOpen(true)} />
                
                <TrendingStocksBlock language={language} currentTicker={stock.ticker} />
              </div>
            </aside>

            <div className="lg:hidden mt-6 space-y-4">
              <TrendingStocksBlock language={language} currentTicker={stock.ticker} />
            </div>
          </div>
        </div>
      </main>


      <WatchStockModal
        open={watchModalOpen}
        onOpenChange={setWatchModalOpen}
        ticker={stock.ticker}
        stockName={stock.companyName}
        language={language}
      />
    </div>
  );
}
