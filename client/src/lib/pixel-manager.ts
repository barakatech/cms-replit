import type { MarketingPixel, PixelEventMap, CmsEventName, PixelPlatform, PixelDispatchPayload } from '@shared/schema';

interface PixelWithMaps extends MarketingPixel {
  eventMaps: PixelEventMap[];
}

let cachedPixels: PixelWithMaps[] | null = null;
let fetchPromise: Promise<PixelWithMaps[]> | null = null;

function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern === '*') return true;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(path);
  });
}

async function fetchEnabledPixels(): Promise<PixelWithMaps[]> {
  if (cachedPixels) return cachedPixels;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/api/marketing-pixels/enabled')
    .then(res => res.json())
    .then(pixels => {
      cachedPixels = pixels;
      return pixels;
    })
    .catch(err => {
      console.error('[PixelManager] Failed to fetch pixels:', err);
      return [];
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

function fireMetaPixelEvent(pixelId: string, eventName: string, params?: Record<string, unknown>, testMode?: boolean) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (testMode) {
      console.log('[PixelManager:Meta] TEST MODE - Would fire:', { pixelId, eventName, params });
      return;
    }
    (window as any).fbq('trackSingle', pixelId, eventName, params);
  } else {
    console.warn('[PixelManager:Meta] Facebook Pixel not loaded');
  }
}

function fireTikTokPixelEvent(pixelId: string, eventName: string, params?: Record<string, unknown>, testMode?: boolean) {
  if (typeof window !== 'undefined' && (window as any).ttq) {
    if (testMode) {
      console.log('[PixelManager:TikTok] TEST MODE - Would fire:', { pixelId, eventName, params });
      return;
    }
    (window as any).ttq.instance(pixelId).track(eventName, params);
  } else {
    console.warn('[PixelManager:TikTok] TikTok Pixel not loaded');
  }
}

function fireSnapchatPixelEvent(pixelId: string, eventName: string, params?: Record<string, unknown>, testMode?: boolean) {
  if (typeof window !== 'undefined' && (window as any).snaptr) {
    if (testMode) {
      console.log('[PixelManager:Snapchat] TEST MODE - Would fire:', { pixelId, eventName, params });
      return;
    }
    (window as any).snaptr('track', eventName, { pixel_id: pixelId, ...params });
  } else {
    console.warn('[PixelManager:Snapchat] Snapchat Pixel not loaded');
  }
}

function fireGoogleAdsEvent(pixelId: string, eventName: string, params?: Record<string, unknown>, testMode?: boolean) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    if (testMode) {
      console.log('[PixelManager:GoogleAds] TEST MODE - Would fire:', { pixelId, eventName, params });
      return;
    }
    (window as any).gtag('event', eventName, { send_to: pixelId, ...params });
  } else {
    console.warn('[PixelManager:GoogleAds] Google Ads gtag not loaded');
  }
}

function firePixelEvent(
  platform: PixelPlatform,
  pixelId: string,
  eventName: string,
  params?: Record<string, unknown>,
  testMode?: boolean
) {
  switch (platform) {
    case 'meta':
      fireMetaPixelEvent(pixelId, eventName, params, testMode);
      break;
    case 'tiktok':
      fireTikTokPixelEvent(pixelId, eventName, params, testMode);
      break;
    case 'snapchat':
      fireSnapchatPixelEvent(pixelId, eventName, params, testMode);
      break;
    case 'google_ads':
      fireGoogleAdsEvent(pixelId, eventName, params, testMode);
      break;
  }
}

export async function dispatchMarketingEvent(payload: PixelDispatchPayload): Promise<void> {
  const pixels = await fetchEnabledPixels();
  const device = payload.device ?? detectDevice();

  for (const pixel of pixels) {
    if (!pixel.enabled) continue;
    if (!pixel.locales.includes(payload.locale)) continue;
    if (!pixel.devices.includes(device)) continue;
    if (!matchesPattern(payload.pagePath, pixel.pages)) continue;

    const eventMap = pixel.eventMaps.find(
      m => m.cmsEvent === payload.eventName && m.enabled
    );

    if (!eventMap) continue;

    const params = {
      ...eventMap.customParams,
      ...payload.metadata,
      page_path: payload.pagePath,
      locale: payload.locale,
      device,
    };

    firePixelEvent(pixel.platform, pixel.pixelId, eventMap.pixelEventName, params, pixel.testMode);
  }
}

export function clearPixelCache(): void {
  cachedPixels = null;
}

export function usePixelDispatch() {
  return {
    dispatch: dispatchMarketingEvent,
    clearCache: clearPixelCache,
  };
}
