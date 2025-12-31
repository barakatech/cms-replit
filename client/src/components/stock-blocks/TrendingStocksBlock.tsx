import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';

interface TrendingStocksBlockProps {
  language: 'en' | 'ar';
  currentTicker?: string;
}

interface TrendingStock {
  ticker: string;
  name: string;
  price: string;
  changePct: number;
}

const trendingStocks: TrendingStock[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', price: '$875.42', changePct: 3.45 },
  { ticker: 'AAPL', name: 'Apple Inc', price: '$185.64', changePct: 1.28 },
  { ticker: 'TSLA', name: 'Tesla Inc', price: '$242.84', changePct: -2.10 },
  { ticker: 'MSFT', name: 'Microsoft Corp', price: '$378.91', changePct: 0.85 },
  { ticker: 'GOOGL', name: 'Alphabet Inc', price: '$141.25', changePct: 1.92 },
  { ticker: 'AMZN', name: 'Amazon.com Inc', price: '$178.75', changePct: -0.45 },
  { ticker: 'META', name: 'Meta Platforms', price: '$505.95', changePct: 2.15 },
  { ticker: 'AMD', name: 'AMD Inc', price: '$162.30', changePct: 4.20 },
];

export function TrendingStocksBlock({ language, currentTicker }: TrendingStocksBlockProps) {
  const isRTL = language === 'ar';
  
  const filteredStocks = trendingStocks.filter(s => s.ticker !== currentTicker).slice(0, 6);

  const labels = {
    en: { title: 'Trending Stocks', viewAll: 'View all' },
    ar: { title: 'الأسهم الرائجة', viewAll: 'عرض الكل' },
  };
  
  const t = labels[language];

  return (
    <Card data-testid="trending-stocks-block">
      <CardHeader className="pb-2">
        <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Flame className="h-4 w-4 text-orange-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {filteredStocks.map((stock) => {
            const isPositive = stock.changePct >= 0;
            return (
              <Link key={stock.ticker} href={`/stocks/${stock.ticker.toLowerCase()}`}>
                <div 
                  className={`flex items-center justify-between px-4 py-3 hover-elevate cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                  data-testid={`trending-${stock.ticker}`}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">{stock.ticker.slice(0, 2)}</span>
                    </div>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-mono font-semibold text-sm">{stock.ticker}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[100px]">{stock.name}</p>
                    </div>
                  </div>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <p className="font-medium text-sm">{stock.price}</p>
                    <p className={`text-xs flex items-center gap-0.5 ${isPositive ? 'text-green-600' : 'text-red-600'} ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isPositive ? '+' : ''}{stock.changePct.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
