import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface MarketSentimentCardProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

type SentimentLevel = 'bullish' | 'neutral' | 'bearish' | 'mixed';

function getSentimentLevel(sentiment: { buy: number; hold: number; sell: number }): SentimentLevel {
  if (sentiment.buy >= 60) return 'bullish';
  if (sentiment.sell >= 40) return 'bearish';
  if (sentiment.hold >= 50) return 'neutral';
  return 'mixed';
}

function getSentimentColor(level: SentimentLevel): string {
  switch (level) {
    case 'bullish':
      return 'bg-green-500';
    case 'bearish':
      return 'bg-red-500';
    case 'neutral':
      return 'bg-yellow-500';
    case 'mixed':
      return 'bg-blue-500';
  }
}

function getSentimentIcon(level: SentimentLevel) {
  switch (level) {
    case 'bullish':
      return <TrendingUp className="h-4 w-4" />;
    case 'bearish':
      return <TrendingDown className="h-4 w-4" />;
    case 'neutral':
      return <Minus className="h-4 w-4" />;
    case 'mixed':
      return <AlertTriangle className="h-4 w-4" />;
  }
}

export function MarketSentimentCard({ stock, language }: MarketSentimentCardProps) {
  const isRTL = language === 'ar';
  const { sentiment } = stock.dynamicData;
  const sentimentLevel = getSentimentLevel(sentiment);
  
  const sentimentLabels = {
    en: {
      bullish: 'Bullish',
      bearish: 'Bearish',
      neutral: 'Neutral',
      mixed: 'Mixed',
      title: 'Market Sentiment',
      subtitle: 'Based on analyst ratings',
      buy: 'Buy',
      hold: 'Hold',
      sell: 'Sell',
      timeframe: 'Last 30 days',
      disclaimer: 'For informational purposes only. Not investment advice.',
    },
    ar: {
      bullish: 'صاعد',
      bearish: 'هابط',
      neutral: 'محايد',
      mixed: 'متباين',
      title: 'معنويات السوق',
      subtitle: 'بناءً على تقييمات المحللين',
      buy: 'شراء',
      hold: 'احتفاظ',
      sell: 'بيع',
      timeframe: 'آخر 30 يوماً',
      disclaimer: 'للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.',
    },
  };
  
  const labels = sentimentLabels[language];

  const segments = [
    { label: 'bearish', color: 'bg-red-500', width: 20 },
    { label: 'mixed', color: 'bg-orange-400', width: 20 },
    { label: 'neutral', color: 'bg-yellow-500', width: 20 },
    { label: 'bullish-light', color: 'bg-lime-400', width: 20 },
    { label: 'bullish', color: 'bg-green-500', width: 20 },
  ];

  const indicatorPosition = (() => {
    switch (sentimentLevel) {
      case 'bearish': return 10;
      case 'mixed': return 30;
      case 'neutral': return 50;
      case 'bullish': return 85;
      default: return 50;
    }
  })();

  return (
    <Card data-testid="market-sentiment-card">
      <CardHeader className="pb-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <CardTitle className="text-base">{labels.title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{labels.subtitle}</p>
          </div>
          <Badge variant="secondary" className="text-xs">{labels.timeframe}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`p-2 rounded-lg ${getSentimentColor(sentimentLevel)} bg-opacity-20`}>
            <span className={`${getSentimentColor(sentimentLevel).replace('bg-', 'text-')}`}>
              {getSentimentIcon(sentimentLevel)}
            </span>
          </div>
          <div>
            <span className="font-semibold text-lg" data-testid="sentiment-level">
              {labels[sentimentLevel]}
            </span>
          </div>
        </div>

        <div className="relative pt-2 pb-6">
          <div className="flex h-3 rounded-full overflow-hidden">
            {segments.map((seg, i) => (
              <div 
                key={i} 
                className={`${seg.color} transition-all`} 
                style={{ width: `${seg.width}%` }}
              />
            ))}
          </div>
          <div 
            className="absolute top-0 w-1 h-5 bg-foreground rounded-full transform -translate-x-1/2 transition-all duration-300"
            style={{ left: `${indicatorPosition}%` }}
          />
          <div className={`flex justify-between mt-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{language === 'en' ? 'Bearish' : 'هابط'}</span>
            <span>{language === 'en' ? 'Bullish' : 'صاعد'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-muted-foreground">{labels.buy}</span>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${sentiment.buy}%` }} />
              </div>
              <span className="font-medium w-10 text-right" data-testid="sentiment-buy">{sentiment.buy}%</span>
            </div>
          </div>
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-muted-foreground">{labels.hold}</span>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${sentiment.hold}%` }} />
              </div>
              <span className="font-medium w-10 text-right" data-testid="sentiment-hold">{sentiment.hold}%</span>
            </div>
          </div>
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-muted-foreground">{labels.sell}</span>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${sentiment.sell}%` }} />
              </div>
              <span className="font-medium w-10 text-right" data-testid="sentiment-sell">{sentiment.sell}%</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2 border-t">
          {labels.disclaimer}
        </p>
      </CardContent>
    </Card>
  );
}
