import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dispatchMarketingEvent } from '@/lib/pixel-manager';
import { apiRequest } from '@/lib/queryClient';
import type { MobileInstallBanner as MobileInstallBannerType, InsertBannerEvent } from '@shared/schema';

interface MobileInstallBannerProps {
  locale: 'en' | 'ar';
  currentPath: string;
}

function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua);
}

function detectPlatform(): 'ios' | 'android' | 'other' {
  if (typeof window === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'other';
}

function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern === '*') return true;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(path);
  });
}

function getLastDismissedTime(bannerId: string): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`baraka_mib_dismissed_${bannerId}`);
  return stored ? parseInt(stored, 10) : null;
}

function setDismissedTime(bannerId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`baraka_mib_dismissed_${bannerId}`, Date.now().toString());
}

function canShowBanner(banner: MobileInstallBannerType): boolean {
  const lastDismissed = getLastDismissedTime(banner.id);
  if (!lastDismissed) return true;
  const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
  return daysSinceDismissed >= (banner.frequencyCapDays ?? 7);
}

export default function MobileInstallBanner({ locale, currentPath }: MobileInstallBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const isMobile = detectMobile();
  const platform = detectPlatform();

  const { data: banner } = useQuery<MobileInstallBannerType>({
    queryKey: ['/api/mobile-install-banners/active'],
    enabled: isMobile,
  });

  useEffect(() => {
    if (!banner || !isMobile) return;

    if (!banner.enabled) return;
    if (!banner.locales?.includes(locale)) return;
    if (!matchesPattern(currentPath, banner.pages ?? [])) return;
    if (!canShowBanner(banner)) return;

    const delay = (banner.showAfterSeconds ?? 3) * 1000;
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [banner, isMobile, locale, currentPath]);

  useEffect(() => {
    if (isVisible && banner && !hasTrackedImpression) {
      setHasTrackedImpression(true);
      
      dispatchMarketingEvent({
        eventName: 'banner_impression',
        pagePath: currentPath,
        locale,
        device: 'mobile',
        metadata: {
          banner_id: banner.id,
          banner_name: banner.name,
          banner_type: 'mobile_install',
        },
      });

      apiRequest('POST', '/api/admin/events/banners', {
        bannerId: banner.id,
        bannerType: 'mobile_install',
        eventType: 'view',
        placement: banner.styleVariant,
        pagePath: currentPath,
        locale,
        deviceCategory: 'mobile',
      } as InsertBannerEvent).catch(console.error);
    }
  }, [isVisible, banner, hasTrackedImpression, currentPath, locale, platform]);

  const handleDismiss = () => {
    if (banner) {
      setDismissedTime(banner.id);
    }
    setIsVisible(false);
  };

  const handleCtaClick = () => {
    if (!banner) return;

    dispatchMarketingEvent({
      eventName: 'app_install_click',
      pagePath: currentPath,
      locale,
      device: 'mobile',
      metadata: {
        banner_id: banner.id,
        banner_name: banner.name,
        banner_type: 'mobile_install',
        platform,
      },
    });

    apiRequest('POST', '/api/admin/events/banners', {
      bannerId: banner.id,
      bannerType: 'mobile_install',
      eventType: 'click',
      placement: banner.styleVariant,
      pagePath: currentPath,
      locale,
      deviceCategory: 'mobile',
    } as InsertBannerEvent).catch(console.error);

    const adjustLink = platform === 'ios' ? banner.adjustLinkIos : banner.adjustLinkAndroid;
    if (adjustLink) {
      window.location.href = adjustLink;
    }
  };

  if (!isVisible || !banner || !isMobile) return null;

  const isRTL = locale === 'ar';
  const title = isRTL ? banner.title_ar : banner.title_en;
  const subtitle = isRTL ? (banner.subtitle_ar ?? '') : (banner.subtitle_en ?? '');
  const ctaText = isRTL ? banner.ctaText_ar : banner.ctaText_en;

  const bgClasses = {
    brand: 'bg-brand text-brand-foreground',
    surface: 'bg-surface text-foreground',
    tertiary: 'bg-muted text-foreground',
  };

  const positionClasses = banner.styleVariant === 'top' 
    ? 'top-0 border-b' 
    : 'bottom-0 border-t';

  return (
    <div 
      className={`fixed left-0 right-0 z-50 ${positionClasses} ${bgClasses[banner.backgroundStyle]} p-3 shadow-lg animate-in slide-in-from-bottom duration-300`}
      dir={isRTL ? 'rtl' : 'ltr'}
      data-testid="mobile-install-banner"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {banner.iconUrl ? (
            <img 
              src={banner.iconUrl} 
              alt="App icon" 
              className="w-10 h-10 rounded-lg flex-shrink-0"
              data-testid="img-banner-icon"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-background/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" data-testid="text-banner-title">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs opacity-80 truncate" data-testid="text-banner-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            size="sm"
            variant={banner.backgroundStyle === 'brand' ? 'secondary' : 'default'}
            onClick={handleCtaClick}
            data-testid="button-banner-cta"
          >
            {ctaText}
          </Button>
          <Button 
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleDismiss}
            data-testid="button-banner-dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
