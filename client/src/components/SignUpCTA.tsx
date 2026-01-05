import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Smartphone, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { AppDownloadConfig } from '@shared/schema';

interface SignUpCTAProps {
  language?: 'en' | 'ar';
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  customText?: string;
}

const DEFAULT_CONFIG: AppDownloadConfig = {
  id: 'default',
  iosAppStoreUrl: 'https://apps.apple.com/app/baraka',
  androidPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.baraka.app',
  iosDeepLink: 'https://apps.apple.com/app/baraka',
  androidDeepLink: 'https://play.google.com/store/apps/details?id=com.baraka.app',
  qrCodeUrl: 'https://baraka.com/download',
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

export default function SignUpCTA({
  language = 'en',
  variant = 'default',
  size = 'default',
  className = '',
  customText,
}: SignUpCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  const { data: configData, isLoading } = useQuery<AppDownloadConfig>({
    queryKey: ['/api/app-download-config'],
  });

  const config = configData || DEFAULT_CONFIG;

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleClick = () => {
    if (isMobile) {
      const isIOS = isIOSDevice();
      const deepLink = isIOS 
        ? (config.iosDeepLink || config.iosAppStoreUrl || DEFAULT_CONFIG.iosDeepLink)
        : (config.androidDeepLink || config.androidPlayStoreUrl || DEFAULT_CONFIG.androidDeepLink);
      
      if (deepLink) {
        window.location.href = deepLink;
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
    }
  };

  const ctaText = customText || (language === 'en' ? config.ctaText_en : config.ctaText_ar) || DEFAULT_CONFIG.ctaText_en;
  const popupTitle = (language === 'en' ? config.popupTitle_en : config.popupTitle_ar) || DEFAULT_CONFIG.popupTitle_en;
  const popupSubtitle = (language === 'en' ? config.popupSubtitle_en : config.popupSubtitle_ar) || DEFAULT_CONFIG.popupSubtitle_en;
  const qrCodeUrl = config.qrCodeUrl || DEFAULT_CONFIG.qrCodeUrl;
  const iosUrl = config.iosAppStoreUrl || DEFAULT_CONFIG.iosAppStoreUrl;
  const androidUrl = config.androidPlayStoreUrl || DEFAULT_CONFIG.androidPlayStoreUrl;

  return (
    <>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              {popupTitle}
            </DialogTitle>
            <DialogDescription>
              {popupSubtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <QRCodeSVG
                value={qrCodeUrl}
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
                  href={iosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover-elevate"
                  data-testid="link-app-store"
                >
                  <Download className="h-4 w-4" />
                  App Store
                </a>
                <a
                  href={androidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover-elevate"
                  data-testid="link-play-store"
                >
                  <Download className="h-4 w-4" />
                  Play Store
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
