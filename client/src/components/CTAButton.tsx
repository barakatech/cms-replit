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
import { Smartphone, Apple, Loader2, X } from 'lucide-react';
import { SiGoogleplay } from 'react-icons/si';
import { apiRequest } from '@/lib/queryClient';
import type { CallToAction, CTAEventType, InsertCTAEvent } from '@shared/schema';
import { BARAKA_STORE_URLS } from '@shared/schema';

interface CTAButtonProps {
  ctaKey: string;
  language?: 'en' | 'ar';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  context?: {
    ticker?: string;
    pagePath?: string;
  };
  customText?: string;
  showDisclaimer?: boolean;
}

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

export default function CTAButton({
  ctaKey,
  language = 'en',
  variant = 'default',
  size = 'default',
  className = '',
  context,
  customText,
  showDisclaimer = false,
}: CTAButtonProps) {
  const [isQROpen, setIsQROpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isRTL = language === 'ar';

  const { data: cta, isLoading: ctaLoading } = useQuery<CallToAction>({
    queryKey: ['/api/ctas/key', ctaKey],
    queryFn: async () => {
      const res = await fetch(`/api/ctas/key/${encodeURIComponent(ctaKey)}`);
      if (!res.ok) throw new Error('CTA not found');
      return res.json();
    },
  });

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
      ctaKey,
      eventType,
      pagePath: context?.pagePath || window.location.pathname,
      locale: language,
      device: getDeviceCategory(),
      os: getOS(),
      ticker: context?.ticker,
      metaJson: extraMeta,
    });
  }, [ctaKey, context, language, trackEvent]);

  const handleClick = useCallback(() => {
    if (!cta) return;

    fireEvent('cta_click');

    switch (cta.actionType) {
      case 'link':
        window.location.href = cta.url;
        break;

      case 'scroll_anchor':
        const anchorId = cta.metaJson?.anchorId || cta.url.replace('#', '');
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'qr_modal':
        if (isMobile) {
          const storeUrl = isIOSDevice() ? BARAKA_STORE_URLS.ios : BARAKA_STORE_URLS.android;
          fireEvent('store_redirect', { os: getOS(), destination: storeUrl });
          window.location.href = storeUrl;
        } else {
          setIsQROpen(true);
          fireEvent('qr_modal_view');
        }
        break;

      case 'os_store_redirect':
        const redirectUrl = isIOSDevice() ? BARAKA_STORE_URLS.ios : BARAKA_STORE_URLS.android;
        fireEvent('store_redirect', { os: getOS(), destination: redirectUrl });
        window.location.href = redirectUrl;
        break;
    }
  }, [cta, isMobile, fireEvent]);

  const handleQRClose = useCallback(() => {
    setIsQROpen(false);
    fireEvent('qr_modal_close');
  }, [fireEvent]);

  const handleContinueOnWeb = useCallback(() => {
    fireEvent('continue_on_web_click');
    window.location.href = '/signup';
  }, [fireEvent]);

  if (ctaLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!cta || !cta.enabled) {
    return null;
  }

  const buttonText = customText || (language === 'en' ? cta.text_en : cta.text_ar);
  const displayText = cta.metaJson?.tickerAware && context?.ticker 
    ? `${buttonText} ${context.ticker}` 
    : buttonText;

  const qrUrl = buildQRUrl(cta, context);

  return (
    <>
      <div className={showDisclaimer ? 'flex flex-col gap-2' : ''}>
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleClick}
          data-testid={`button-cta-${ctaKey.replace(/\./g, '-')}`}
        >
          {displayText}
        </Button>
        {showDisclaimer && (
          <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'en' 
              ? 'Capital at risk. Not investment advice.' 
              : 'رأس المال معرض للخطر. ليست نصيحة استثمارية.'}
          </p>
        )}
      </div>

      <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
              {language === 'en' ? 'Get Baraka on your phone' : 'حمّل تطبيق بركة على هاتفك'}
            </DialogTitle>
            <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
              {context?.ticker 
                ? (language === 'en' 
                    ? `Scan to install and trade ${context.ticker} in the app`
                    : `امسح الرمز لتثبيت التطبيق وتداول ${context.ticker}`)
                : (language === 'en'
                    ? 'Scan the QR code with your phone to download the app'
                    : 'امسح رمز QR بهاتفك لتحميل التطبيق')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={qrUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>

            <div className="flex gap-3">
              <a
                href={BARAKA_STORE_URLS.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => fireEvent('store_redirect', { os: 'ios', destination: BARAKA_STORE_URLS.ios })}
                data-testid="link-appstore"
              >
                <Apple className="h-5 w-5" />
                <span className="text-sm">App Store</span>
              </a>
              <a
                href={BARAKA_STORE_URLS.android}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => fireEvent('store_redirect', { os: 'android', destination: BARAKA_STORE_URLS.android })}
                data-testid="link-playstore"
              >
                <SiGoogleplay className="h-4 w-4" />
                <span className="text-sm">Play Store</span>
              </a>
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

function buildQRUrl(cta: CallToAction, context?: CTAButtonProps['context']): string {
  const baseUrl = BARAKA_STORE_URLS.ios;
  const params = new URLSearchParams({
    utm_source: 'web',
    utm_medium: 'qr',
    utm_campaign: cta.key.replace(/\./g, '_'),
  });
  
  if (context?.ticker) {
    params.set('ticker', context.ticker);
  }
  if (context?.pagePath) {
    params.set('page', context.pagePath);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

export { CTAButton };
