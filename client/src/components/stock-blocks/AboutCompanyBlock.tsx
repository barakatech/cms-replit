import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Building2, Users, MapPin, Calendar } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface AboutCompanyBlockProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

interface CompanyMeta {
  ceo: string;
  employees: string;
  headquarters: string;
  founded: string;
}

const mockCompanyMeta: Record<string, CompanyMeta> = {
  AAPL: { ceo: 'Tim Cook', employees: '164,000', headquarters: 'Cupertino, CA', founded: '1976' },
  TSLA: { ceo: 'Elon Musk', employees: '140,000', headquarters: 'Austin, TX', founded: '2003' },
  MSFT: { ceo: 'Satya Nadella', employees: '221,000', headquarters: 'Redmond, WA', founded: '1975' },
  GOOGL: { ceo: 'Sundar Pichai', employees: '190,000', headquarters: 'Mountain View, CA', founded: '1998' },
  NVDA: { ceo: 'Jensen Huang', employees: '29,600', headquarters: 'Santa Clara, CA', founded: '1993' },
};

export function AboutCompanyBlock({ stock, language }: AboutCompanyBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRTL = language === 'ar';
  const content = stock.content[language];
  
  const meta = mockCompanyMeta[stock.ticker] || {
    ceo: 'N/A',
    employees: 'N/A',
    headquarters: 'N/A',
    founded: 'N/A',
  };

  const labels = {
    en: {
      about: `About ${stock.companyName}`,
      showMore: 'Show more',
      showLess: 'Show less',
      ceo: 'CEO',
      employees: 'Employees',
      headquarters: 'Headquarters',
      founded: 'Founded',
    },
    ar: {
      about: `حول ${stock.companyName}`,
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
      ceo: 'الرئيس التنفيذي',
      employees: 'الموظفين',
      headquarters: 'المقر الرئيسي',
      founded: 'تأسست',
    },
  };
  
  const t = labels[language];
  
  const hasThesis = content.thesis && content.thesis.length > 0;

  return (
    <Card data-testid="about-company-block" id="about">
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>{t.about}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : ''}`}>
          <div 
            className={`prose prose-sm dark:prose-invert max-w-none overflow-hidden transition-all duration-300 ${!isExpanded ? 'max-h-24' : 'max-h-[1000px]'}`}
            data-testid="about-text"
          >
            <div dangerouslySetInnerHTML={{ __html: content.overview }} />
            {hasThesis && (
              <div className="mt-4" dangerouslySetInnerHTML={{ __html: content.thesis }} />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto mt-2 text-primary"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="button-show-more"
          >
            {isExpanded ? (
              <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t.showLess} <ChevronUp className="h-4 w-4" />
              </span>
            ) : (
              <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t.showMore} <ChevronDown className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`space-y-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Users className="h-3 w-3" />
              {t.ceo}
            </div>
            <p className="font-medium text-sm" data-testid="meta-ceo">{meta.ceo}</p>
          </div>
          <div className={`space-y-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Building2 className="h-3 w-3" />
              {t.employees}
            </div>
            <p className="font-medium text-sm" data-testid="meta-employees">{meta.employees}</p>
          </div>
          <div className={`space-y-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <MapPin className="h-3 w-3" />
              {t.headquarters}
            </div>
            <p className="font-medium text-sm" data-testid="meta-hq">{meta.headquarters}</p>
          </div>
          <div className={`space-y-1 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <Calendar className="h-3 w-3" />
              {t.founded}
            </div>
            <p className="font-medium text-sm" data-testid="meta-founded">{meta.founded}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
