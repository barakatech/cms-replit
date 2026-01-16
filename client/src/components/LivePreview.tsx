import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';
import { StockLogo } from '@/components/StockLogo';

interface LivePreviewProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

export default function LivePreview({ stock, language }: LivePreviewProps) {
  const content = stock.content[language];
  const metadata = stock.metadata[language];
  const { dynamicData } = stock;
  const isRTL = language === 'ar';

  const allLinks = [
    ...stock.internalLinks.autoSuggestions.map((s) => s.ticker),
    ...stock.internalLinks.manual,
  ].slice(0, 4);

  return (
    <div className={`p-6 space-y-8 ${isRTL ? 'rtl' : 'ltr'} ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <StockLogo 
              ticker={stock.ticker} 
              companyName={stock.companyName} 
              size="xl"
            />
            <div>
              <h1 className="text-3xl font-bold mb-1" data-testid="preview-company-name">
                {stock.companyName}
              </h1>
              <div className="text-sm text-muted-foreground font-mono">{stock.ticker}</div>
            </div>
          </div>
          <Button size="sm" data-testid="preview-invest-button">
            {language === 'en' ? 'Invest' : 'استثمر'}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold" data-testid="preview-price">
              ${dynamicData.price.toFixed(2)}
            </span>
            <span className={`flex items-center gap-1 text-lg ${dynamicData.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dynamicData.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {dynamicData.change > 0 ? '+' : ''}
              {dynamicData.change.toFixed(2)} ({dynamicData.changePercent > 0 ? '+' : ''}
              {dynamicData.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {language === 'en' ? 'Market Cap' : 'القيمة السوقية'}
          </div>
          <div className="font-semibold">{dynamicData.marketCap}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {language === 'en' ? 'Volume' : 'الحجم'}
          </div>
          <div className="font-semibold">{dynamicData.volume}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {language === 'en' ? 'P/E' : 'السعر/الأرباح'}
          </div>
          <div className="font-semibold">{dynamicData.pe}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {language === 'en' ? 'Dividend' : 'الأرباح الموزعة'}
          </div>
          <div className="font-semibold">{dynamicData.dividend}</div>
        </div>
      </div>

      {/* Sentiment Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {language === 'en' ? 'Analyst Sentiment' : 'تقييمات المحللين'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-6 rounded-md overflow-hidden">
            <div
              className="bg-green-500"
              style={{ width: `${dynamicData.sentiment.buy}%` }}
              title={`Buy ${dynamicData.sentiment.buy}%`}
            ></div>
            <div
              className="bg-yellow-500"
              style={{ width: `${dynamicData.sentiment.hold}%` }}
              title={`Hold ${dynamicData.sentiment.hold}%`}
            ></div>
            <div
              className="bg-red-500"
              style={{ width: `${dynamicData.sentiment.sell}%` }}
              title={`Sell ${dynamicData.sentiment.sell}%`}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-2 text-muted-foreground">
            <span>
              {language === 'en' ? 'Buy' : 'شراء'} {dynamicData.sentiment.buy}%
            </span>
            <span>
              {language === 'en' ? 'Hold' : 'حيازة'} {dynamicData.sentiment.hold}%
            </span>
            <span>
              {language === 'en' ? 'Sell' : 'بيع'} {dynamicData.sentiment.sell}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">
            {language === 'en' ? 'Overview' : 'نظرة عامة'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{content.overview}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">
            {language === 'en' ? 'Investment Thesis' : 'أطروحة الاستثمار'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{content.thesis}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">
            {language === 'en' ? 'Risks' : 'المخاطر'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{content.risks}</p>
        </div>

        {content.faqs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">
              {language === 'en' ? 'FAQs' : 'الأسئلة الشائعة'}
            </h2>
            <div className="space-y-3">
              {content.faqs.map((faq, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <div className="font-semibold mb-1">{faq.question}</div>
                  <div className="text-muted-foreground text-sm">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-3">
            {language === 'en' ? 'Highlights' : 'أبرز النقاط'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{content.highlights}</p>
        </div>
      </div>

      {/* Related Stocks */}
      {allLinks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            {language === 'en' ? 'Similar Stocks' : 'أسهم مشابهة'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {allLinks.map((ticker) => (
              <Card key={ticker} className="hover-elevate cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <StockLogo ticker={ticker} size="sm" />
                    <div className="font-mono font-semibold">{ticker}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {language === 'en' ? 'View details' : 'عرض التفاصيل'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
