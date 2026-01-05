import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Smartphone, Apple, Loader2 } from 'lucide-react';
import { SiGoogleplay } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { AppDownloadConfig, InsertCTAEvent, CTAEventType } from '@shared/schema';
import { BARAKA_STORE_URLS } from '@shared/schema';

interface SignUpCTAProps {
  language?: 'en' | 'ar';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  customText?: string;
  ticker?: string;
  showDisclaimer?: boolean;
}

const DEFAULT_CONFIG: AppDownloadConfig = {
  id: 'default',
  iosAppStoreUrl: BARAKA_STORE_URLS.ios,
  androidPlayStoreUrl: BARAKA_STORE_URLS.android,
  iosDeepLink: BARAKA_STORE_URLS.ios,
  androidDeepLink: BARAKA_STORE_URLS.android,
  qrCodeUrl: BARAKA_STORE_URLS.ios,
  ctaText_en: 'Sign Up to Trade',
  ctaText_ar: 'سجّل للتداول',
  popupTitle_en: 'Get the Baraka App',
  popupTitle_ar: 'حمّل تطبيق بركة',
  popupSubtitle_en: 'Scan the QR code with your phone to download the app and start investing.',
  popupSubtitle_ar: 'امسح رمز QR بهاتفك لتحميل التطبيق وابدأ الاستثمار.',
  updatedAt: new Date().toISOString(),
};

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iphone|ipad|ipod/i.test(userAgent.toLowerCase());
}

function getDeviceCategory(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const userAgent = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function getOS(): 'ios' | 'android' | 'other' {
  if (typeof window === 'undefined') return 'other';
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
  if (/android/i.test(userAgent)) return 'android';
  return 'other';
}

export default function SignUpCTA({
  language = 'en',
  variant = 'default',
  size = 'default',
  className = '',
  customText,
  ticker,
  showDisclaimer = false,
}: SignUpCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const { data: configData, isLoading } = useQuery<AppDownloadConfig>({
    queryKey: ['/api/app-download-config'],
  });

  const config = configData || DEFAULT_CONFIG;

  const trackEvent = useMutation({
    mutationFn: async (event: InsertCTAEvent) => {
      return apiRequest('POST', '/api/cta-events', event);
    },
  });

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const fireEvent = useCallback((eventType: CTAEventType, extraMeta?: Record<string, unknown>) => {
    trackEvent.mutate({
      ctaKey: ticker ? 'stock.trade_ticker' : 'main.signup_to_trade',
      eventType,
      pagePath: window.location.pathname,
      locale: language,
      device: getDeviceCategory(),
      os: getOS(),
      ticker,
      metaJson: extraMeta,
    });
  }, [ticker, language, trackEvent]);

  const handleClick = () => {
    fireEvent('cta_click');

    if (isMobile) {
      const isIOS = isIOSDevice();
      const storeUrl = isIOS ? BARAKA_STORE_URLS.ios : BARAKA_STORE_URLS.android;
      
      fireEvent('store_redirect', { os: getOS(), destination: storeUrl });
      
      if (storeUrl) {
        window.location.href = storeUrl;
      } else {
        toast({
          title: language === 'en' ? 'Unable to redirect' : 'تعذر التوجيه',
          description: language === 'en' 
            ? 'Please search for Baraka in your app store.' 
            : 'يرجى البحث عن بركة في متجر التطبيقات.',
          variant: 'destructive',
        });
      }
    } else {
      setIsOpen(true);
      fireEvent('qr_modal_view');
    }
  };

  const handleContinueOnWeb = () => {
    fireEvent('continue_on_web_click');
    window.location.href = '/signup';
  };

  const ctaText = customText || (language === 'en' ? config.ctaText_en : config.ctaText_ar) || DEFAULT_CONFIG.ctaText_en;
  const popupTitle = (language === 'en' ? config.popupTitle_en : config.popupTitle_ar) || DEFAULT_CONFIG.popupTitle_en;
  
  const popupSubtitle = ticker
    ? (language === 'en' 
        ? `Scan to install and trade ${ticker} in the app`
        : `امسح الرمز لتثبيت التطبيق وتداول ${ticker}`)
    : (language === 'en' ? config.popupSubtitle_en : config.popupSubtitle_ar) || DEFAULT_CONFIG.popupSubtitle_en;

  const qrUrl = buildQRUrl(ticker);

  return (
    <>
      <div className={showDisclaimer ? 'flex flex-col gap-2' : ''}>
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleClick}
          disabled={isLoading}
          data-testid="button-signup-cta"
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {ctaText}
        </Button>
        {showDisclaimer && (
          <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'en' 
              ? 'Capital at risk. Not investment advice.' 
              : 'رأس المال معرض للخطر. ليست نصيحة استثمارية.'}
          </p>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Smartphone className="h-5 w-5 text-primary" />
              {popupTitle}
            </DialogTitle>
            <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
              {popupSubtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? 'Or download directly:' 
                  : 'أو حمّل مباشرة:'}
              </p>
              <div className="flex gap-3">
                <a
                  href={BARAKA_STORE_URLS.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => fireEvent('store_redirect', { os: 'ios', destination: BARAKA_STORE_URLS.ios })}
                  data-testid="link-app-store"
                >
                  <Apple className="h-4 w-4" />
                  App Store
                </a>
                <a
                  href={BARAKA_STORE_URLS.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => fireEvent('store_redirect', { os: 'android', destination: BARAKA_STORE_URLS.android })}
                  data-testid="link-play-store"
                >
                  <SiGoogleplay className="h-4 w-4" />
                  Play Store
                </a>
              </div>
            </div>

            <button
              onClick={handleContinueOnWeb}
              className="text-sm text-muted-foreground hover:text-foreground underline"
              data-testid="button-continue-web"
            >
              {language === 'en' ? 'Continue on web' : 'تابع على الويب'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function buildQRUrl(ticker?: string): string {
  const baseUrl = BARAKA_STORE_URLS.ios;
  const params = new URLSearchParams({
    utm_source: 'web',
    utm_medium: 'qr',
    utm_campaign: ticker ? 'stock_trade' : 'signup_to_trade',
  });
  
  if (ticker) {
    params.set('ticker', ticker);
  }
  params.set('page', typeof window !== 'undefined' ? window.location.pathname : '/');
  
  return `${baseUrl}?${params.toString()}`;
}
