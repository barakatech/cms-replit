import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Percent, Activity, Building2 } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface MetricsGridProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

interface MetricItem {
  labelEn: string;
  labelAr: string;
  value: string;
  icon: typeof DollarSign;
  change?: number;
}

export function MetricsGrid({ stock, language }: MetricsGridProps) {
  const isRTL = language === 'ar';
  const { dynamicData } = stock;
  
  const metrics: MetricItem[] = [
    {
      labelEn: 'Market Cap',
      labelAr: 'القيمة السوقية',
      value: dynamicData.marketCap,
      icon: Building2,
    },
    {
      labelEn: 'Volume',
      labelAr: 'حجم التداول',
      value: dynamicData.volume,
      icon: BarChart3,
    },
    {
      labelEn: 'P/E Ratio',
      labelAr: 'نسبة السعر/الأرباح',
      value: dynamicData.pe,
      icon: PieChart,
    },
    {
      labelEn: 'EPS',
      labelAr: 'ربح السهم',
      value: dynamicData.eps,
      icon: DollarSign,
    },
    {
      labelEn: 'Dividend Yield',
      labelAr: 'عائد الأرباح',
      value: dynamicData.dividend,
      icon: Percent,
    },
    {
      labelEn: '52W High',
      labelAr: 'أعلى 52 أسبوع',
      value: `$${(dynamicData.price * 1.25).toFixed(2)}`,
      icon: TrendingUp,
    },
    {
      labelEn: '52W Low',
      labelAr: 'أدنى 52 أسبوع',
      value: `$${(dynamicData.price * 0.65).toFixed(2)}`,
      icon: TrendingDown,
    },
    {
      labelEn: 'Avg Volume',
      labelAr: 'متوسط الحجم',
      value: `${(parseFloat(dynamicData.volume.replace('M', '')) * 0.85).toFixed(1)}M`,
      icon: Activity,
    },
  ];

  return (
    <div data-testid="metrics-grid">
      <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>
        {language === 'en' ? 'Key Metrics' : 'المؤشرات الرئيسية'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover-elevate" data-testid={`metric-card-${index}`}>
              <CardContent className="p-4">
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === 'en' ? metric.labelEn : metric.labelAr}
                    </p>
                    <p className="font-semibold mt-0.5" data-testid={`metric-value-${index}`}>
                      {metric.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
