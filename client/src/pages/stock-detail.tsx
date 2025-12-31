import { useState, useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Globe, 
  Moon, 
  Sun, 
  Share2, 
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { mockStocks, type StockPage } from '@/lib/mockData';
import { 
  StockHero, 
  StockChartPanel, 
  MarketSentimentCard, 
  MetricsGrid, 
  FAQAccordion, 
  RisksPanel,
  NewsList 
} from '@/components/stock-preview';

export default function StockDetail() {
  const params = useParams<{ slug: string }>();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isRTL = language === 'ar';
  
  const stock = mockStocks.find(s => s.ticker.toLowerCase() === params.slug?.toLowerCase());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!stock) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    );
  }

  const content = stock.content[language];
  const isPositive = stock.dynamicData.change >= 0;

  const navItems = [
    { id: 'overview', labelEn: 'Overview', labelAr: 'نظرة عامة' },
    { id: 'metrics', labelEn: 'Metrics', labelAr: 'المؤشرات' },
    { id: 'news', labelEn: 'News', labelAr: 'الأخبار' },
    { id: 'faq', labelEn: 'FAQ', labelAr: 'الأسئلة الشائعة' },
    { id: 'risks', labelEn: 'Risks', labelAr: 'المخاطر' },
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
      <header 
        className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all ${isScrolled ? 'py-2' : 'py-4'}`}
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
                  <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{stock.dynamicData.changePercent.toFixed(2)}%
                  </span>
                </div>
              ) : (
                <Link href="/">
                  <span className="text-xl font-bold text-primary cursor-pointer" data-testid="logo">baraka</span>
                </Link>
              )}
            </div>

            <nav className={`hidden md:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
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
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                data-testid="button-theme-toggle"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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
              <Button data-testid="button-trade-header">
                {language === 'en' ? `Trade ${stock.ticker}` : `تداول ${stock.ticker}`}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden sticky top-[57px] z-40 border-b bg-background overflow-x-auto">
        <div className={`flex items-center gap-1 px-4 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => scrollToSection(item.id)}
            >
              {language === 'en' ? item.labelEn : item.labelAr}
            </Button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <StockHero stock={stock} language={language} />
              
              <StockChartPanel stock={stock} language={language} />
              
              <section id="overview" className="scroll-mt-24">
                <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>
                  {language === 'en' ? 'About ' + stock.companyName : 'حول ' + stock.companyName}
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div 
                      className={`prose prose-sm dark:prose-invert max-w-none ${isRTL ? 'text-right' : ''}`}
                      dangerouslySetInnerHTML={{ __html: content.overview }}
                      data-testid="overview-content"
                    />
                    
                    {content.thesis && (
                      <>
                        <Separator className="my-6" />
                        <h3 className={`font-semibold mb-3 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'en' ? 'Investment Thesis' : 'أطروحة الاستثمار'}
                        </h3>
                        <div 
                          className={`prose prose-sm dark:prose-invert max-w-none text-muted-foreground ${isRTL ? 'text-right' : ''}`}
                          dangerouslySetInnerHTML={{ __html: content.thesis }}
                          data-testid="thesis-content"
                        />
                      </>
                    )}

                    {content.highlights && (
                      <>
                        <Separator className="my-6" />
                        <h3 className={`font-semibold mb-3 ${isRTL ? 'text-right' : ''}`}>
                          {language === 'en' ? 'Key Highlights' : 'أبرز النقاط'}
                        </h3>
                        <div 
                          className={`prose prose-sm dark:prose-invert max-w-none text-muted-foreground ${isRTL ? 'text-right' : ''}`}
                          dangerouslySetInnerHTML={{ __html: content.highlights }}
                          data-testid="highlights-content"
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </section>
              
              <section id="metrics" className="scroll-mt-24">
                <MetricsGrid stock={stock} language={language} />
              </section>
              
              <section id="news-section" className="scroll-mt-24">
                <NewsList stock={stock} language={language} />
              </section>
              
              <FAQAccordion stock={stock} language={language} />
              
              <RisksPanel stock={stock} language={language} />

              {stock.internalLinks && (
                <section className="space-y-4">
                  <h2 className={`text-xl font-semibold ${isRTL ? 'text-right' : ''}`}>
                    {language === 'en' ? 'Similar Stocks' : 'أسهم مشابهة'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[...stock.internalLinks.autoSuggestions.map(s => s.ticker), ...stock.internalLinks.manual].slice(0, 4).map((ticker) => (
                      <Link key={ticker} href={`/stocks/${ticker.toLowerCase()}`}>
                        <Card className="hover-elevate cursor-pointer" data-testid={`related-stock-${ticker}`}>
                          <CardContent className="p-4">
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="font-mono font-semibold">{ticker}</span>
                              <ChevronRight className={`h-4 w-4 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="hidden lg:block space-y-6">
              <div className="sticky top-24 space-y-6">
                <MarketSentimentCard stock={stock} language={language} />
                
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <Button className="w-full" size="lg" data-testid="button-trade-sidebar">
                      {language === 'en' ? `Trade ${stock.ticker}` : `تداول ${stock.ticker}`}
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-watchlist">
                      {language === 'en' ? 'Add to Watchlist' : 'أضف للمراقبة'}
                    </Button>
                    <Button variant="ghost" className="w-full" data-testid="button-alert">
                      {language === 'en' ? 'Set Price Alert' : 'تعيين تنبيه السعر'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {language === 'en' 
                        ? 'Prices are delayed and for informational purposes only. Not investment advice. Your capital is at risk.' 
                        : 'الأسعار مؤجلة ولأغراض إعلامية فقط. ليست نصيحة استثمارية. رأس مالك في خطر.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className={`max-w-5xl mx-auto text-center text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
            <p className="mb-2">
              {language === 'en' 
                ? 'For informational purposes only. Not investment advice.' 
                : 'للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.'}
            </p>
            <p>
              {language === 'en' 
                ? 'Capital at risk. The value of investments can go down as well as up.' 
                : 'رأس المال في خطر. يمكن أن تنخفض قيمة الاستثمارات وكذلك ترتفع.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
