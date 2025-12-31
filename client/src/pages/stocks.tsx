import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Search, Star, ArrowRight } from 'lucide-react';
import { mockStocks } from '@/lib/mockData';

export default function StocksDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  const isRTL = language === 'ar';
  
  const publishedStocks = mockStocks.filter(s => s.status === 'published');
  
  const filteredStocks = publishedStocks.filter(stock => 
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredStocks = publishedStocks.slice(0, 3);

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/">
              <span className="text-xl font-bold text-primary cursor-pointer" data-testid="logo">baraka</span>
            </Link>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                data-testid="button-toggle-language"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="button-admin">
                  {language === 'en' ? 'Admin' : 'لوحة التحكم'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className={`max-w-4xl mx-auto space-y-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight" data-testid="page-title">
              {language === 'en' ? 'Explore Stocks' : 'استكشف الأسهم'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Browse our collection of stocks and discover investment opportunities.' 
                : 'تصفح مجموعتنا من الأسهم واكتشف فرص الاستثمار.'}
            </p>
          </div>

          <div className="relative max-w-lg mx-auto">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
            <Input
              placeholder={language === 'en' ? 'Search by ticker or company name...' : 'ابحث برمز السهم أو اسم الشركة...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12 text-lg`}
              data-testid="input-search-stocks"
            />
          </div>

          {searchQuery === '' && (
            <section className="space-y-4">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="h-5 w-5 text-amber-500" />
                {language === 'en' ? 'Featured Stocks' : 'الأسهم المميزة'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredStocks.map((stock) => {
                  const isPositive = stock.dynamicData.change >= 0;
                  return (
                    <Link key={stock.id} href={`/stocks/${stock.ticker.toLowerCase()}`}>
                      <Card className="hover-elevate cursor-pointer h-full" data-testid={`featured-stock-${stock.ticker}`}>
                        <CardContent className="p-5">
                          <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div>
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                                <span className="font-bold text-primary text-sm">{stock.ticker.slice(0, 2)}</span>
                              </div>
                              <p className="font-mono font-semibold text-lg">{stock.ticker}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{stock.companyName}</p>
                            </div>
                            <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                              <p className="font-semibold">${stock.dynamicData.price.toFixed(2)}</p>
                              <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {isPositive ? '+' : ''}{stock.dynamicData.changePercent.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-xl font-semibold">
                {language === 'en' ? 'All Stocks' : 'جميع الأسهم'}
              </h2>
              <Badge variant="secondary">{filteredStocks.length} {language === 'en' ? 'stocks' : 'سهم'}</Badge>
            </div>
            
            <div className="space-y-2">
              {filteredStocks.map((stock) => {
                const isPositive = stock.dynamicData.change >= 0;
                return (
                  <Link key={stock.id} href={`/stocks/${stock.ticker.toLowerCase()}`}>
                    <Card className="hover-elevate cursor-pointer" data-testid={`stock-row-${stock.ticker}`}>
                      <CardContent className="p-4">
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-sm">{stock.ticker.slice(0, 2)}</span>
                            </div>
                            <div className={isRTL ? 'text-right' : ''}>
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="font-mono font-semibold">{stock.ticker}</span>
                                <Badge variant="outline" className="text-xs">NASDAQ</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`hidden md:block ${isRTL ? 'text-left' : 'text-right'}`}>
                              <p className="text-xs text-muted-foreground mb-1">{language === 'en' ? 'Market Cap' : 'القيمة السوقية'}</p>
                              <p className="font-medium">{stock.dynamicData.marketCap}</p>
                            </div>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <p className="font-semibold">${stock.dynamicData.price.toFixed(2)}</p>
                              <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {isPositive ? '+' : ''}{stock.dynamicData.changePercent.toFixed(2)}%
                              </p>
                            </div>
                            <ArrowRight className={`h-5 w-5 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            
            {filteredStocks.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {language === 'en' ? 'No stocks found matching your search.' : 'لم يتم العثور على أسهم تطابق بحثك.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>
              {language === 'en' 
                ? 'For informational purposes only. Not investment advice. Capital at risk.' 
                : 'للأغراض المعلوماتية فقط. ليست نصيحة استثمارية. رأس المال في خطر.'}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
