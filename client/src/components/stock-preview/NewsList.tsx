import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface NewsListProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
}

function generateMockNews(ticker: string, language: 'en' | 'ar'): NewsItem[] {
  const newsEn: NewsItem[] = [
    {
      id: '1',
      title: `${ticker} reports strong quarterly earnings, beats expectations`,
      source: 'Reuters',
      time: '2 hours ago',
      category: 'Earnings',
    },
    {
      id: '2',
      title: `Analysts upgrade ${ticker} amid positive market outlook`,
      source: 'Bloomberg',
      time: '4 hours ago',
      category: 'Analysis',
    },
    {
      id: '3',
      title: `${ticker} announces expansion plans for 2025`,
      source: 'CNBC',
      time: '6 hours ago',
      category: 'Corporate',
    },
    {
      id: '4',
      title: `Market wrap: ${ticker} leads tech rally`,
      source: 'MarketWatch',
      time: '1 day ago',
      category: 'Markets',
    },
    {
      id: '5',
      title: `${ticker} partners with major industry player`,
      source: 'WSJ',
      time: '2 days ago',
      category: 'Partnerships',
    },
  ];

  const newsAr: NewsItem[] = [
    {
      id: '1',
      title: `${ticker} تعلن عن أرباح فصلية قوية تفوق التوقعات`,
      source: 'رويترز',
      time: 'منذ ساعتين',
      category: 'الأرباح',
    },
    {
      id: '2',
      title: `المحللون يرفعون تصنيف ${ticker} وسط توقعات إيجابية للسوق`,
      source: 'بلومبرغ',
      time: 'منذ 4 ساعات',
      category: 'تحليل',
    },
    {
      id: '3',
      title: `${ticker} تعلن عن خطط توسعية لعام 2025`,
      source: 'CNBC',
      time: 'منذ 6 ساعات',
      category: 'الشركات',
    },
    {
      id: '4',
      title: `ملخص السوق: ${ticker} تقود ارتفاع التكنولوجيا`,
      source: 'ماركت ووتش',
      time: 'منذ يوم',
      category: 'الأسواق',
    },
    {
      id: '5',
      title: `${ticker} تتعاون مع لاعب رئيسي في الصناعة`,
      source: 'وول ستريت جورنال',
      time: 'منذ يومين',
      category: 'شراكات',
    },
  ];

  return language === 'en' ? newsEn : newsAr;
}

export function NewsList({ stock, language }: NewsListProps) {
  const isRTL = language === 'ar';
  const news = generateMockNews(stock.ticker, language);

  return (
    <div data-testid="news-list" id="news">
      <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>
        {language === 'en' ? 'Latest News' : 'آخر الأخبار'}
      </h2>
      <div className="space-y-3">
        {news.map((item) => (
          <Card key={item.id} className="hover-elevate cursor-pointer" data-testid={`news-item-${item.id}`}>
            <CardContent className="p-4">
              <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  </div>
                  <h3 className="font-medium text-sm leading-snug line-clamp-2" data-testid={`news-title-${item.id}`}>
                    {item.title}
                  </h3>
                  <div className={`flex items-center gap-2 mt-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-medium">{item.source}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        {language === 'en' 
          ? 'News provided for informational purposes only.' 
          : 'الأخبار مقدمة لأغراض إعلامية فقط.'}
      </p>
    </div>
  );
}
