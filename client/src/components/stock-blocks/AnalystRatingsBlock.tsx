import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type StockPage } from '@/lib/mockData';

interface AnalystRatingsBlockProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

export function AnalystRatingsBlock({ stock, language }: AnalystRatingsBlockProps) {
  const isRTL = language === 'ar';
  const { sentiment } = stock.dynamicData;
  const totalRatings = 49;
  
  const majorityPct = Math.max(sentiment.buy, sentiment.hold, sentiment.sell);
  const majorityLabel = sentiment.buy >= sentiment.hold && sentiment.buy >= sentiment.sell
    ? (language === 'en' ? 'Buy' : 'شراء')
    : sentiment.hold >= sentiment.sell
    ? (language === 'en' ? 'Hold' : 'احتفاظ')
    : (language === 'en' ? 'Sell' : 'بيع');

  const labels = {
    en: {
      title: `${stock.ticker} Analyst Ratings`,
      ofRatings: `of ${totalRatings} ratings`,
      buy: 'Buy',
      hold: 'Hold',
      sell: 'Sell',
      disclaimer: 'Analyst ratings are informational and may be delayed. Not investment advice.',
    },
    ar: {
      title: `تقييمات محللي ${stock.ticker}`,
      ofRatings: `من ${totalRatings} تقييم`,
      buy: 'شراء',
      hold: 'احتفاظ',
      sell: 'بيع',
      disclaimer: 'تقييمات المحللين إعلامية وقد تكون متأخرة. ليست نصيحة استثمارية.',
    },
  };
  
  const t = labels[language];

  return (
    <Card data-testid="analyst-ratings-block" id="ratings">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted/20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${majorityPct * 2.51} 251`}
                className="text-primary"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" data-testid="rating-pct">{majorityPct}%</span>
              <span className="text-xs text-muted-foreground">{majorityLabel}</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t.buy}</span>
                <span className="font-medium" data-testid="rating-buy">{sentiment.buy}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${sentiment.buy}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t.hold}</span>
                <span className="font-medium" data-testid="rating-hold">{sentiment.hold}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: `${sentiment.hold}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t.sell}</span>
                <span className="font-medium" data-testid="rating-sell">{sentiment.sell}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${sentiment.sell}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <p className={`text-xs text-muted-foreground mt-4 pt-3 border-t ${isRTL ? 'text-right' : ''}`}>
          {t.disclaimer}
        </p>
      </CardContent>
    </Card>
  );
}
