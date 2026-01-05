import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Bell, Check, Loader2 } from 'lucide-react';

interface WatchStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string;
  stockName: string;
  language: 'en' | 'ar';
}

export default function WatchStockModal({ 
  open, 
  onOpenChange, 
  ticker, 
  stockName,
  language 
}: WatchStockModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [submitted, setSubmitted] = useState(false);

  const isRTL = language === 'ar';

  const mutation = useMutation({
    mutationFn: async (data: { email: string; mobile: string; ticker: string; stockName: string; frequency: string; locale: string }) => {
      const response = await apiRequest('POST', '/api/stock-watch/subscribe', data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: language === 'en' ? 'Subscription Created' : 'تم إنشاء الاشتراك',
        description: language === 'en' 
          ? `You'll receive ${frequency} notifications for ${ticker}` 
          : `ستتلقى إشعارات ${frequency === 'daily' ? 'يومية' : frequency === 'weekly' ? 'أسبوعية' : 'شهرية'} لـ ${ticker}`,
      });
    },
    onError: () => {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to subscribe. Please try again.' : 'فشل الاشتراك. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !mobile) return;
    
    mutation.mutate({
      email,
      mobile,
      ticker,
      stockName,
      frequency,
      locale: language,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setMobile('');
        setFrequency('daily');
      }, 300);
    }
  };

  const frequencyOptions = [
    { value: 'daily', labelEn: 'Daily', labelAr: 'يوميًا' },
    { value: 'weekly', labelEn: 'Weekly', labelAr: 'أسبوعيًا' },
    { value: 'monthly', labelEn: 'Monthly', labelAr: 'شهريًا' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <Bell className="h-5 w-5 text-primary" />
            {language === 'en' ? `Watch ${ticker}` : `متابعة ${ticker}`}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : ''}>
            {language === 'en' 
              ? `Get notified about ${stockName} price updates and news.` 
              : `احصل على إشعارات حول تحديثات أسعار ${stockName} والأخبار.`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className={`text-center text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {language === 'en' 
                ? `You're now watching ${ticker}. We'll send you ${frequency} updates.` 
                : `أنت الآن تتابع ${ticker}. سنرسل لك تحديثات ${frequency === 'daily' ? 'يومية' : frequency === 'weekly' ? 'أسبوعية' : 'شهرية'}.`}
            </p>
            <Button onClick={handleClose} data-testid="button-close-watch-modal">
              {language === 'en' ? 'Done' : 'تم'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
                {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'en' ? 'you@example.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-watch-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className={isRTL ? 'text-right block' : ''}>
                {language === 'en' ? 'Mobile Number' : 'رقم الجوال'}
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder={language === 'en' ? '+1 234 567 8900' : '+971 50 123 4567'}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                data-testid="input-watch-mobile"
              />
            </div>

            <div className="space-y-3">
              <Label className={isRTL ? 'text-right block' : ''}>
                {language === 'en' ? 'Notification Frequency' : 'تكرار الإشعارات'}
              </Label>
              <RadioGroup 
                value={frequency} 
                onValueChange={(v) => setFrequency(v as 'daily' | 'weekly' | 'monthly')}
                className={`flex flex-col gap-2 ${isRTL ? 'items-end' : 'items-start'}`}
              >
                {frequencyOptions.map((option) => (
                  <div key={option.value} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <RadioGroupItem 
                      value={option.value} 
                      id={`freq-${option.value}`}
                      data-testid={`radio-frequency-${option.value}`}
                    />
                    <Label htmlFor={`freq-${option.value}`} className="font-normal cursor-pointer">
                      {language === 'en' ? option.labelEn : option.labelAr}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={mutation.isPending || !email || !mobile}
              data-testid="button-submit-watch"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {language === 'en' ? 'Subscribing...' : 'جاري الاشتراك...'}
                </>
              ) : (
                language === 'en' ? 'Subscribe' : 'اشترك'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
