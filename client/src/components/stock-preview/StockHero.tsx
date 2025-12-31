import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Share2, Bell, Star } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface StockHeroProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

export function StockHero({ stock, language }: StockHeroProps) {
  const isRTL = language === 'ar';
  const isPositive = stock.dynamicData.change >= 0;

  return (
    <div className="space-y-6" data-testid="stock-hero">
      <div className={`flex items-start justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border">
              <span className="font-bold text-primary">{stock.ticker.slice(0, 2)}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" data-testid="hero-company-name">
                {stock.companyName}
              </h1>
              <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-mono text-muted-foreground">{stock.ticker}</span>
                <Badge variant="outline" className="text-xs">NASDAQ</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button variant="ghost" size="icon" data-testid="button-star">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-alert">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-share">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button data-testid="button-trade">
            {language === 'en' ? `Trade ${stock.ticker}` : `تداول ${stock.ticker}`}
          </Button>
        </div>
      </div>

      <div className={`${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-baseline gap-4 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
          <span className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="hero-price">
            ${stock.dynamicData.price.toFixed(2)}
          </span>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span 
              className={`flex items-center gap-1 text-lg font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              data-testid="hero-change"
            >
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {isPositive ? '+' : ''}{stock.dynamicData.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.dynamicData.changePercent.toFixed(2)}%)
            </span>
            <Badge variant="secondary" className="text-xs">1D</Badge>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 mt-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
          <span>{language === 'en' ? 'Delayed prices' : 'أسعار مؤجلة'}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>USD</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{language === 'en' ? 'Last updated: Today' : 'آخر تحديث: اليوم'}</span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted/30 rounded-md inline-block">
          {language === 'en' ? 'For informational purposes only. Not investment advice.' : 'للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.'}
        </p>
      </div>
    </div>
  );
}
