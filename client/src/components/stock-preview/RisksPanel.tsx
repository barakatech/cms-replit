import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface RisksPanelProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

export function RisksPanel({ stock, language }: RisksPanelProps) {
  const isRTL = language === 'ar';
  const risks = stock.content[language].risks;

  const riskBullets = risks.split(/[,.]/).filter(r => r.trim().length > 10).slice(0, 5);

  return (
    <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20" data-testid="risks-panel" id="risks">
      <CardHeader className="pb-3">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-base text-amber-800 dark:text-amber-200">
            {language === 'en' ? 'Risk Disclosure' : 'إفصاح المخاطر'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
          {riskBullets.map((risk, index) => (
            <li 
              key={index} 
              className={`flex items-start gap-2 text-sm text-amber-900 dark:text-amber-100 ${isRTL ? 'flex-row-reverse' : ''}`}
              data-testid={`risk-item-${index}`}
            >
              <span className="text-amber-500 mt-1">•</span>
              <span>{risk.trim()}</span>
            </li>
          ))}
        </ul>

        <div className={`flex items-start gap-3 p-3 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className={`text-xs text-amber-800 dark:text-amber-200 ${isRTL ? 'text-right' : ''}`}>
            <p className="font-semibold mb-1">
              {language === 'en' ? 'Important Disclaimer' : 'إخلاء مسؤولية مهم'}
            </p>
            <p>
              {language === 'en' 
                ? 'Capital at risk. The value of investments can go down as well as up. You may get back less than you invest. This is not investment advice.'
                : 'رأس المال في خطر. يمكن أن تنخفض قيمة الاستثمارات وكذلك ترتفع. قد تحصل على أقل مما تستثمر. هذه ليست نصيحة استثمارية.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
