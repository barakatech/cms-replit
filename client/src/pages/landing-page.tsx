import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import type { LandingPage } from '@shared/schema';
import { SectionPreview } from '@/components/landing-page/SectionPreview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function LandingPagePublic() {
  const [, params] = useRoute('/p/:slug');
  const [isPreview] = useRoute('/p/:slug/preview');
  const { toast } = useToast();
  const slug = params?.slug;
  
  const searchParams = new URLSearchParams(window.location.search);
  const localeParam = searchParams.get('locale');
  const locale: 'en' | 'ar' = localeParam === 'ar' ? 'ar' : 'en';

  const { data: page, isLoading, error } = useQuery<LandingPage>({
    queryKey: ['/api/landing-pages/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/landing-pages/slug/${slug}`);
      if (!response.ok) throw new Error('Page not found');
      return response.json();
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (page && !isPreview) {
      apiRequest('POST', '/api/analytics/track', {
        landingPageId: page.id,
        pageSlug: page.slug,
        eventType: 'page_view',
        metadata: { locale },
      }).catch(() => {});
    }
  }, [page, isPreview, locale]);

  useEffect(() => {
    if (page) {
      const seo = page.localeContent[locale]?.seo;
      if (seo?.metaTitle) {
        document.title = seo.metaTitle;
      }
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      if (seo?.metaDescription) {
        metaDesc.setAttribute('content', seo.metaDescription);
      }
    }
  }, [page, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-4">The page you're looking for doesn't exist.</p>
        <Button onClick={() => window.location.href = '/'}>Go Home</Button>
      </div>
    );
  }

  if (!isPreview && page.status !== 'published') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Page Not Available</h1>
        <p className="text-muted-foreground mb-4">This page is not yet published.</p>
        <Button onClick={() => window.location.href = '/'}>Go Home</Button>
      </div>
    );
  }

  const content = page.localeContent[locale] || page.localeContent.en;
  const sections = content.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
  const showHeader = page.settings.headerVariant !== 'hidden';
  const showFooter = page.settings.footerVariant !== 'hidden';

  const handleCtaClick = (ctaText: string, url: string) => {
    apiRequest('POST', '/api/analytics/track', {
      landingPageId: page.id,
      pageSlug: page.slug,
      eventType: 'cta_click',
      metadata: { ctaText, url, locale },
    }).catch(() => {});
    
    if (!url) return;
    
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      window.location.href = url;
    } else if (url.startsWith('/') || url.startsWith('http')) {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {isPreview && (
        <div className="bg-yellow-500 text-yellow-950 text-center py-2 text-sm font-medium">
          Preview Mode - This page is not published
        </div>
      )}
      
      {showHeader && (
        <header className={`border-b ${page.settings.headerVariant === 'minimal' ? 'py-2' : 'py-4'}`}>
          <div className="container mx-auto px-4 flex items-center justify-between">
            <a href="/" className="font-bold text-xl">baraka</a>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const newLocale = locale === 'en' ? 'ar' : 'en';
                  const url = new URL(window.location.href);
                  url.searchParams.set('locale', newLocale);
                  window.location.href = url.toString();
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-locale-switch"
              >
                {locale === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>
        </header>
      )}

      <main>
        {sections.map((section) => (
          <div key={section.id} id={section.type}>
            <SectionPreview 
              section={section} 
              locale={locale}
              isPublic
              pageId={page.id}
              pageSlug={page.slug}
              onCtaClick={handleCtaClick}
            />
          </div>
        ))}
      </main>

      {showFooter && (
        <footer className={`border-t ${page.settings.footerVariant === 'minimal' ? 'py-4' : 'py-8'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {locale === 'ar' ? '© 2024 بركة. جميع الحقوق محفوظة.' : '© 2024 baraka. All rights reserved.'}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="/privacy" className="hover:text-foreground">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy'}</a>
                <a href="/terms" className="hover:text-foreground">{locale === 'ar' ? 'الشروط والأحكام' : 'Terms'}</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}