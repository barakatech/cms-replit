import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type StockPage } from '@/lib/mockData';

interface EarningsBlockProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

interface EarningsQuarter {
  label: string;
  estimated: number;
  actual: number;
  beat: boolean;
}

const generateMockEarnings = (ticker: string): EarningsQuarter[] => {
  const baseEPS = ticker === 'TSLA' ? 0.85 : ticker === 'AAPL' ? 1.52 : 1.20;
  return [
    { label: 'Q1 FY24', estimated: baseEPS * 0.9, actual: baseEPS * 0.95, beat: true },
    { label: 'Q2 FY24', estimated: baseEPS * 0.95, actual: baseEPS * 0.92, beat: false },
    { label: 'Q3 FY24', estimated: baseEPS, actual: baseEPS * 1.05, beat: true },
    { label: 'Q4 FY24', estimated: baseEPS * 1.05, actual: baseEPS * 1.12, beat: true },
  ];
};

export function EarningsBlock({ stock, language }: EarningsBlockProps) {
  const isRTL = language === 'ar';
  const earnings = generateMockEarnings(stock.ticker);
  
  const maxValue = Math.max(...earnings.flatMap(e => [e.estimated, e.actual]));

  const labels = {
    en: {
      title: `${stock.ticker} Earnings`,
      estimated: 'Estimated',
      actual: 'Actual',
      beat: 'Beat',
      miss: 'Miss',
      nextEarnings: 'Next earnings expected: Feb 15, 2025',
      disclaimer: 'Earnings data shown may be delayed and is for information only.',
    },
    ar: {
      title: `أرباح ${stock.ticker}`,
      estimated: 'المتوقع',
      actual: 'الفعلي',
      beat: 'تجاوز',
      miss: 'أقل',
      nextEarnings: 'الأرباح القادمة المتوقعة: 15 فبراير 2025',
      disclaimer: 'بيانات الأرباح المعروضة قد تكون متأخرة وهي للمعلومات فقط.',
    },
  };
  
  const t = labels[language];

  return (
    <Card data-testid="earnings-block" id="earnings">
      <CardHeader className="pb-2">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className="text-lg">{t.title}</CardTitle>
          <div className={`flex items-center gap-4 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">{t.estimated}</span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">{t.actual}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4 h-32">
            {earnings.map((quarter, index) => {
              const estimatedHeight = (quarter.estimated / maxValue) * 100;
              const actualHeight = (quarter.actual / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1 h-24 w-full justify-center">
                    <div 
                      className="w-4 bg-muted-foreground/30 rounded-t transition-all"
                      style={{ height: `${estimatedHeight}%` }}
                      title={`${t.estimated}: $${quarter.estimated.toFixed(2)}`}
                    />
                    <div 
                      className={`w-4 rounded-t transition-all ${quarter.beat ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ height: `${actualHeight}%` }}
                      title={`${t.actual}: $${quarter.actual.toFixed(2)}`}
                    />
                  </div>
                  <div className="text-center">
                    <Badge 
                      variant={quarter.beat ? 'default' : 'destructive'} 
                      className="text-[10px] px-1 py-0"
                    >
                      {quarter.beat ? t.beat : t.miss}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{quarter.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
            {t.nextEarnings}
          </p>
        </div>

        <p className={`text-xs text-muted-foreground mt-4 pt-3 border-t ${isRTL ? 'text-right' : ''}`}>
          {t.disclaimer}
        </p>
      </CardContent>
    </Card>
  );
}
