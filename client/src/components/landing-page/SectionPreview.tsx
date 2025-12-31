import { useState } from 'react';
import type { LandingPageSection } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Heart, LineChart, Headphones, BookOpen, PieChart, Target, Check, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, any> = {
  Zap, Shield, Heart, LineChart, Headphones, BookOpen, PieChart, Target,
};

interface SectionPreviewProps {
  section: LandingPageSection;
  locale: 'en' | 'ar';
  isPublic?: boolean;
  pageId?: string;
  pageSlug?: string;
  onCtaClick?: (text: string, url: string) => void;
}

export function SectionPreview({ section, locale, isPublic = false, pageId, pageSlug, onCtaClick }: SectionPreviewProps) {
  const data = section.data as any;
  const { toast } = useToast();
  
  const getText = (localizedText: { en: string; ar: string } | undefined): string => {
    if (!localizedText) return '';
    return localizedText[locale] || localizedText.en || '';
  };
  
  const handleCta = (text: string, url: string) => {
    if (isPublic && onCtaClick) {
      onCtaClick(text, url);
    } else if (isPublic && url) {
      window.location.href = url;
    }
  };

  switch (section.type) {
    case 'hero':
      return (
        <div className="py-16 px-8 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            {data.eyebrowText && (
              <Badge variant="secondary" className="mb-4">
                {getText(data.eyebrowText)}
              </Badge>
            )}
            <h1 className="text-4xl font-bold mb-4">{getText(data.headline)}</h1>
            {data.subheadline && (
              <p className="text-xl text-muted-foreground mb-8">{getText(data.subheadline)}</p>
            )}
            <div className="flex items-center justify-center gap-4">
              {data.primaryCTA && (
                <Button 
                  size="lg" 
                  data-testid="button-hero-cta"
                  onClick={() => handleCta(getText(data.primaryCTA.text), data.primaryCTA.url)}
                >
                  {getText(data.primaryCTA.text)}
                </Button>
              )}
              {data.secondaryCTA && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => handleCta(getText(data.secondaryCTA.text), data.secondaryCTA.url)}
                >
                  {getText(data.secondaryCTA.text)}
                </Button>
              )}
            </div>
            {data.trustBadges && data.trustBadges.length > 0 && (
              <div className="flex items-center justify-center gap-6 mt-8">
                {data.trustBadges.map((badge: any, i: number) => (
                  <span key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {getText(badge.text)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'valueProps':
      return (
        <div className="py-16 px-8">
          <h2 className="text-2xl font-bold text-center mb-12">{getText(data.title)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(data.cards || []).map((card: any, i: number) => {
              const IconComponent = iconMap[card.icon] || Zap;
              return (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{getText(card.title)}</h3>
                    <p className="text-sm text-muted-foreground">{getText(card.description)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="py-16 px-8 bg-muted/30">
          <h2 className="text-2xl font-bold text-center mb-12">{getText(data.title)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(data.features || []).map((feature: any, i: number) => (
              <div key={i} className="p-4">
                <h3 className="font-semibold mb-2">{getText(feature.title)}</h3>
                <p className="text-sm text-muted-foreground">{getText(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'socialProof':
      return (
        <div className="py-12 px-8">
          <h2 className="text-xl font-medium text-center text-muted-foreground mb-8">{getText(data.title)}</h2>
          {data.logos && data.logos.length > 0 && (
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {data.logos.map((logo: any, i: number) => (
                <div key={i} className="h-8 w-24 bg-muted rounded flex items-center justify-center">
                  {logo.name}
                </div>
              ))}
            </div>
          )}
          {data.testimonials && data.testimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
              {data.testimonials.map((t: any, i: number) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <p className="italic mb-4">"{getText(t.quote)}"</p>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div>
                        <p className="font-medium text-sm">{t.author}</p>
                        {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );

    case 'pricing':
      return (
        <div className="py-16 px-8 bg-muted/30">
          <h2 className="text-2xl font-bold text-center mb-12">{getText(data.title)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {(data.plans || []).map((plan: any, i: number) => (
              <Card key={i} className={plan.highlightBadge ? 'border-primary' : ''}>
                <CardHeader>
                  {plan.highlightBadge && (
                    <Badge className="w-fit mb-2">{getText(plan.highlightBadge)}</Badge>
                  )}
                  <CardTitle>{getText(plan.planName)}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{getText(plan.priceText)}</span>
                    <span className="text-muted-foreground">{getText(plan.billingPeriod)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {(plan.features || []).map((f: any, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {getText(f)}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">{getText(plan.ctaText)}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.complianceNote && (
            <p className="text-center text-xs text-muted-foreground mt-6 max-w-xl mx-auto">
              {getText(data.complianceNote)}
            </p>
          )}
        </div>
      );

    case 'offerBannerRail':
      return (
        <OfferBannerRailSection 
          data={data}
          locale={locale}
          getText={getText}
        />
      );

    case 'content':
      return (
        <div className="py-12 px-8">
          <div className="max-w-3xl mx-auto prose dark:prose-invert">
            {data.title && <h2>{getText(data.title)}</h2>}
            <div dangerouslySetInnerHTML={{ __html: getText(data.richText) }} />
          </div>
        </div>
      );

    case 'faq':
      return (
        <div className="py-16 px-8">
          <h2 className="text-2xl font-bold text-center mb-12">{getText(data.title)}</h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {(data.items || []).map((item: any, i: number) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{getText(item.question)}</AccordionTrigger>
                  <AccordionContent>{getText(item.answer)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      );

    case 'leadForm':
      return (
        <LeadFormSection 
          data={data} 
          locale={locale} 
          isPublic={isPublic}
          pageId={pageId}
          pageSlug={pageSlug}
          getText={getText}
        />
      );

    case 'newsletter':
      return (
        <NewsletterSection 
          data={data} 
          locale={locale} 
          isPublic={isPublic}
          pageSlug={pageSlug}
          getText={getText}
        />
      );

    case 'footerCta':
      return (
        <div className="py-16 px-8 bg-primary text-primary-foreground">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{getText(data.headline)}</h2>
            {data.supportingText && (
              <p className="text-lg opacity-90 mb-8">{getText(data.supportingText)}</p>
            )}
            {data.cta && (
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => handleCta(getText(data.cta.text), data.cta.url)}
              >
                {getText(data.cta.text)}
              </Button>
            )}
            {data.disclaimers && (
              <p className="text-xs opacity-70 mt-8">{getText(data.disclaimers)}</p>
            )}
          </div>
        </div>
      );

    default: {
      const _exhaustiveCheck: never = section;
      return (
        <div className="py-8 px-8 text-center text-muted-foreground">
          Unknown section type
        </div>
      );
    }
  }
}

function LeadFormSection({ 
  data, 
  locale, 
  isPublic, 
  pageId, 
  pageSlug,
  getText 
}: { 
  data: any; 
  locale: 'en' | 'ar'; 
  isPublic: boolean;
  pageId?: string;
  pageSlug?: string;
  getText: (text: { en: string; ar: string } | undefined) => string;
}) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', country: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPublic) return;
    
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/forms/submit', {
        landingPageId: pageId,
        pageSlug,
        formKey: data.formKey || 'lead-form',
        payload: formData,
        locale,
      });
      setIsSubmitted(true);
      toast({ title: locale === 'ar' ? 'تم الإرسال' : 'Submitted', description: getText(data.successMessage) });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit form', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-16 px-8 bg-muted/30">
        <div className="max-w-md mx-auto text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{locale === 'ar' ? 'شكراً!' : 'Thank You!'}</h2>
          <p className="text-muted-foreground">{getText(data.successMessage)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-8 bg-muted/30">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">{getText(data.title)}</h2>
        {data.subtitle && (
          <p className="text-center text-muted-foreground mb-8">{getText(data.subtitle)}</p>
        )}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="_honey" value="" />
              {data.fields?.name && (
                <Input 
                  placeholder={locale === 'ar' ? 'الاسم' : 'Name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              )}
              {data.fields?.email && (
                <Input 
                  type="email" 
                  placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              )}
              {data.fields?.phone && (
                <Input 
                  type="tel" 
                  placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              )}
              {data.fields?.country && (
                <Input 
                  placeholder={locale === 'ar' ? 'الدولة' : 'Country'}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {getText(data.submitText)}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NewsletterSection({ 
  data, 
  locale, 
  isPublic,
  pageSlug,
  getText 
}: { 
  data: any; 
  locale: 'en' | 'ar'; 
  isPublic: boolean;
  pageSlug?: string;
  getText: (text: { en: string; ar: string } | undefined) => string;
}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPublic || !email) return;
    
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/newsletter/signup', {
        email,
        locale,
        source: pageSlug || 'landing-page',
      });
      setIsSubmitted(true);
      toast({ title: locale === 'ar' ? 'تم الاشتراك' : 'Subscribed!', description: locale === 'ar' ? 'شكراً للاشتراك' : 'Thanks for subscribing!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to subscribe', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-12 px-8">
        <div className="max-w-md mx-auto text-center">
          <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-muted-foreground">{locale === 'ar' ? 'شكراً للاشتراك!' : 'Thanks for subscribing!'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">{getText(data.title)}</h2>
        {data.subtitle && (
          <p className="text-muted-foreground mb-6">{getText(data.subtitle)}</p>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            type="email" 
            placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email address'} 
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getText(data.buttonText)}
          </Button>
        </form>
        {data.privacyNote && (
          <p className="text-xs text-muted-foreground mt-4">{getText(data.privacyNote)}</p>
        )}
      </div>
    </div>
  );
}

function OfferBannerRailSection({
  data,
  locale,
  getText
}: {
  data: any;
  locale: 'en' | 'ar';
  getText: (text: { en: string; ar: string } | undefined) => string;
}) {
  const banners = data.banners || [];
  
  if (banners.length === 0) {
    return (
      <div className="py-8 px-8 bg-muted/30">
        {data.title && <h2 className="text-xl font-bold mb-4">{getText(data.title)}</h2>}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 h-32 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-muted-foreground">{locale === 'ar' ? `عرض ${i}` : `Offer ${i}`}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-8 bg-muted/30">
      {data.title && <h2 className="text-xl font-bold mb-4">{getText(data.title)}</h2>}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {banners.map((banner: any, i: number) => (
          <a
            key={i}
            href={banner.ctaUrl}
            className="flex-shrink-0 w-72 rounded-lg overflow-hidden hover-elevate"
          >
            {banner.imageUrl ? (
              <img 
                src={banner.imageUrl} 
                alt={getText(banner.title)} 
                className="w-full h-32 object-cover"
              />
            ) : (
              <div 
                className="w-full h-32 flex flex-col items-center justify-center p-4"
                style={{ 
                  backgroundColor: banner.backgroundColor || 'hsl(var(--primary) / 0.1)'
                }}
              >
                <span className="font-semibold text-center">{getText(banner.title)}</span>
                {banner.subtitle && (
                  <span className="text-sm text-muted-foreground text-center mt-1">
                    {getText(banner.subtitle)}
                  </span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}