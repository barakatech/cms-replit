import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type StockPage } from '@/lib/mockData';

interface KeyStatisticsBlockProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

interface StatItem {
  labelEn: string;
  labelAr: string;
  value: string;
}

export function KeyStatisticsBlock({ stock, language }: KeyStatisticsBlockProps) {
  const isRTL = language === 'ar';
  const { dynamicData, ticker } = stock;
  
  const highToday = (dynamicData.price * 1.02).toFixed(2);
  const lowToday = (dynamicData.price * 0.98).toFixed(2);
  const openPrice = (dynamicData.price * 0.995).toFixed(2);
  const high52w = (dynamicData.price * 1.35).toFixed(2);
  const low52w = (dynamicData.price * 0.55).toFixed(2);
  
  const stats: StatItem[] = [
    { labelEn: 'Market cap', labelAr: 'القيمة السوقية', value: dynamicData.marketCap },
    { labelEn: 'P/E ratio', labelAr: 'نسبة السعر/الأرباح', value: dynamicData.pe },
    { labelEn: 'Dividend yield', labelAr: 'عائد الأرباح', value: dynamicData.dividend },
    { labelEn: 'Average volume', labelAr: 'متوسط الحجم', value: dynamicData.volume },
    { labelEn: 'High today', labelAr: 'أعلى اليوم', value: `$${highToday}` },
    { labelEn: 'Low today', labelAr: 'أدنى اليوم', value: `$${lowToday}` },
    { labelEn: 'Open', labelAr: 'الافتتاح', value: `$${openPrice}` },
    { labelEn: 'Volume', labelAr: 'الحجم', value: dynamicData.volume },
    { labelEn: '52 week high', labelAr: 'أعلى 52 أسبوع', value: `$${high52w}` },
    { labelEn: '52 week low', labelAr: 'أدنى 52 أسبوع', value: `$${low52w}` },
    { labelEn: 'EPS (TTM)', labelAr: 'ربح السهم', value: dynamicData.eps },
    { labelEn: 'Beta', labelAr: 'بيتا', value: '1.45' },
  ];

  const labels = {
    en: { title: `${ticker} Key Statistics` },
    ar: { title: `إحصائيات ${ticker} الرئيسية` },
  };

  return (
    <Card data-testid="key-statistics-block" id="statistics">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>{labels[language].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1">
          {stats.map((stat, index) => (
            <div key={index} className="py-3 border-b last:border-b-0">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-muted-foreground">
                  {language === 'en' ? stat.labelEn : stat.labelAr}
                </span>
                <span className="font-medium text-sm" data-testid={`stat-value-${index}`}>
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
