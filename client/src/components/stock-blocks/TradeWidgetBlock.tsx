import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, TrendingUp } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';
import SignUpCTA from '@/components/SignUpCTA';

interface TradeWidgetBlockProps {
  stock: StockPage;
  language: 'en' | 'ar';
  onWatchClick?: () => void;
}

export function TradeWidgetBlock({ stock, language, onWatchClick }: TradeWidgetBlockProps) {
  const [investType, setInvestType] = useState<'shares' | 'amount'>('shares');
  const [shares, setShares] = useState('1');
  const [amount, setAmount] = useState('100');
  const [orderType, setOrderType] = useState('shares');
  
  const isRTL = language === 'ar';
  const price = stock.dynamicData.price;
  
  const estimatedCost = investType === 'shares' 
    ? (parseFloat(shares || '0') * price).toFixed(2)
    : amount;
  
  const estimatedShares = investType === 'amount'
    ? (parseFloat(amount || '0') / price).toFixed(4)
    : shares;

  const labels = {
    en: {
      investIn: 'Invest in',
      shares: 'Shares',
      amount: 'Amount',
      orderType: 'Order type',
      market: 'Market order',
      limit: 'Limit order',
      sharesLabel: 'Number of shares',
      amountLabel: 'Amount in USD',
      estimatedCost: 'Estimated cost',
      estimatedShares: 'Est. shares',
      trade: `Trade ${stock.ticker}`,
      signUp: 'Sign up to Trade',
      watch: `Watch ${stock.ticker}`,
      options: 'Trade Options',
      disclaimer: 'Capital at risk. The value of investments can go down as well as up. You may get back less than you invest. This is not investment advice, capital at risk.',
    },
    ar: {
      investIn: 'استثمر في',
      shares: 'أسهم',
      amount: 'مبلغ',
      orderType: 'نوع الأمر',
      market: 'أمر سوق',
      limit: 'أمر محدد',
      sharesLabel: 'عدد الأسهم',
      amountLabel: 'المبلغ بالدولار',
      estimatedCost: 'التكلفة التقديرية',
      estimatedShares: 'الأسهم التقديرية',
      trade: `تداول ${stock.ticker}`,
      signUp: 'سجل للتداول',
      watch: `راقب ${stock.ticker}`,
      options: 'خيارات التداول',
      disclaimer: 'رأس المال في خطر. يمكن أن تنخفض قيمة الاستثمارات وكذلك ترتفع. قد تحصل على أقل مما تستثمر. هذه ليست نصيحة استثمارية، رأس المال في خطر.',
    },
  };
  
  const t = labels[language];

  return (
    <Card data-testid="trade-widget-block">
      <CardHeader className="pb-4">
        <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TrendingUp className="h-5 w-5 text-primary" />
          {t.investIn}: {stock.ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">{t.orderType}</Label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger data-testid="select-order-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shares">{t.shares}</SelectItem>
              <SelectItem value="market">{t.market}</SelectItem>
              <SelectItem value="limit">{t.limit}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={investType} onValueChange={(v) => setInvestType(v as 'shares' | 'amount')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shares" data-testid="tab-shares">{t.shares}</TabsTrigger>
            <TabsTrigger value="amount" data-testid="tab-amount">{t.amount}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div>
          <Label className="text-sm text-muted-foreground mb-2 block">
            {investType === 'shares' ? t.sharesLabel : t.amountLabel}
          </Label>
          <div className="relative">
            {investType === 'amount' && (
              <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-muted-foreground`}>$</span>
            )}
            <Input
              type="number"
              value={investType === 'shares' ? shares : amount}
              onChange={(e) => investType === 'shares' ? setShares(e.target.value) : setAmount(e.target.value)}
              className={investType === 'amount' ? (isRTL ? 'pr-8' : 'pl-8') : ''}
              data-testid="input-trade-value"
            />
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-muted-foreground">{t.estimatedCost}</span>
            <span className="font-semibold" data-testid="text-estimated-cost">${estimatedCost}</span>
          </div>
          {investType === 'amount' && (
            <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-muted-foreground">{t.estimatedShares}</span>
              <span className="font-medium" data-testid="text-estimated-shares">{estimatedShares}</span>
            </div>
          )}
        </div>

        <SignUpCTA 
          language={language} 
          size="lg" 
          className="w-full" 
          customText={t.signUp}
        />

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onWatchClick}
            data-testid="button-watch"
          >
            <Star className="h-4 w-4 mr-1" />
            {t.watch}
          </Button>
          <Button variant="ghost" className="w-full" data-testid="button-options">
            {t.options}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
