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
import { Smartphone, Download } from 'lucide-react';
import type { AppDownloadConfig } from '@shared/schema';

interface SignUpCTAProps {
  language?: 'en' | 'ar';
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  customText?: string;
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

export default function SignUpCTA({
  language = 'en',
  variant = 'default',
  size = 'default',
  className = '',
  customText,
}: SignUpCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: config } = useQuery<AppDownloadConfig>({
    queryKey: ['/api/app-download-config'],
  });

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleClick = () => {
    if (!config) return;

    if (isMobile) {
      const isIOS = isIOSDevice();
      const deepLink = isIOS ? config.iosDeepLink : config.androidDeepLink;
      window.location.href = deepLink;
    } else {
      setIsOpen(true);
    }
  };

  const ctaText = customText || (language === 'en' ? config?.ctaText_en : config?.ctaText_ar) || 'Sign Up to Trade';
  const popupTitle = language === 'en' ? config?.popupTitle_en : config?.popupTitle_ar;
  const popupSubtitle = language === 'en' ? config?.popupSubtitle_en : config?.popupSubtitle_ar;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        data-testid="button-signup-cta"
      >
        {ctaText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              {popupTitle || 'Get the Baraka App'}
            </DialogTitle>
            <DialogDescription>
              {popupSubtitle || 'Scan the QR code with your phone to download the app.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <QRCodeSVG
                value={config?.qrCodeUrl || 'https://baraka.com/download'}
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
                  href={config?.iosAppStoreUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover-elevate"
                  data-testid="link-app-store"
                >
                  <Download className="h-4 w-4" />
                  App Store
                </a>
                <a
                  href={config?.androidPlayStoreUrl || '#'}
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
