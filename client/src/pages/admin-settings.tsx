import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Settings, Mail, Shield, Search, Palette, FileText, Globe, Lock, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useState } from 'react';
import type { NewsletterSettings, NewsletterTemplate, SpotlightPlacement, CmsSettings } from '@shared/schema';

const SPOTLIGHT_PLACEMENTS: { value: SpotlightPlacement; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'discover', label: 'Discover' },
  { value: 'blog', label: 'Blog' },
  { value: 'stock', label: 'Stock' },
  { value: 'custom', label: 'Custom' },
];

interface GeneralSettingsForm {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;
  defaultLanguage: string;
}

interface BrandingSettingsForm {
  brandLogoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  footerText: string;
}

interface SeoSettingsForm {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  enableSitemap: boolean;
}

interface ContentSettingsForm {
  defaultTemplateId_en: string;
  defaultTemplateId_ar: string;
  websiteBaseUrl: string;
  appDeepLinkBase: string;
  autoActivateSpotlightOnPublish: boolean;
  defaultSpotlightPlacements: SpotlightPlacement[];
  defaultCtaText_en: string;
  defaultCtaText_ar: string;
  emailSenderName: string;
  emailSenderEmail: string;
}

interface SecuritySettingsForm {
  sessionTimeout: number;
  maxLoginAttempts: number;
  enforcePasswordPolicy: boolean;
  enableTwoFactor: boolean;
  allowedIpRanges: string;
}

function GeneralSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<GeneralSettingsForm>({
    defaultValues: {
      siteName: 'baraka CMS',
      siteDescription: 'Stock landing page management system',
      supportEmail: 'support@baraka.com',
      timezone: 'Asia/Dubai',
      dateFormat: 'DD/MM/YYYY',
      defaultLanguage: 'en',
    },
  });

  const handleSubmit = async (data: GeneralSettingsForm) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Settings saved', description: 'General settings have been updated.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Configure basic site information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="baraka CMS" {...field} data-testid="input-site-name" />
                    </FormControl>
                    <FormDescription>The name displayed in the browser tab and header</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="support@example.com" {...field} data-testid="input-support-email" />
                    </FormControl>
                    <FormDescription>Contact email for support inquiries</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of your site..." {...field} data-testid="input-site-description" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        <SelectItem value="Asia/Riyadh">Asia/Riyadh (AST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Format</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-date-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Language</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-default-language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSaving} data-testid="button-save-general">
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function BrandingSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<BrandingSettingsForm>({
    defaultValues: {
      brandLogoUrl: '',
      faviconUrl: '',
      primaryColor: '#6366f1',
      accentColor: '#22c55e',
      footerText: '© 2024 baraka. All rights reserved.',
    },
  });

  const watchedLogoUrl = form.watch('brandLogoUrl');
  const watchedFaviconUrl = form.watch('faviconUrl');

  const handleSubmit = async (data: BrandingSettingsForm) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Settings saved', description: 'Branding settings have been updated.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding Settings
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your CMS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brandLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} data-testid="input-logo-url" />
                    </FormControl>
                    <FormDescription>Main logo for the CMS header</FormDescription>
                    {watchedLogoUrl && (
                      <div className="mt-2 p-4 border rounded-md bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                        <img 
                          src={watchedLogoUrl} 
                          alt="Logo preview" 
                          className="max-h-12 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/favicon.ico" {...field} data-testid="input-favicon-url" />
                    </FormControl>
                    <FormDescription>Browser tab icon (32x32 recommended)</FormDescription>
                    {watchedFaviconUrl && (
                      <div className="mt-2 p-4 border rounded-md bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                        <img 
                          src={watchedFaviconUrl} 
                          alt="Favicon preview" 
                          className="w-8 h-8 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="color" className="w-14 h-10 p-1" {...field} data-testid="input-primary-color" />
                      </FormControl>
                      <Input value={field.value} onChange={field.onChange} className="flex-1" placeholder="#6366f1" />
                    </div>
                    <FormDescription>Main brand color for buttons and links</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accentColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="color" className="w-14 h-10 p-1" {...field} data-testid="input-accent-color" />
                      </FormControl>
                      <Input value={field.value} onChange={field.onChange} className="flex-1" placeholder="#22c55e" />
                    </div>
                    <FormDescription>Secondary color for highlights</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="footerText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Footer Text</FormLabel>
                  <FormControl>
                    <Input placeholder="© 2024 Company. All rights reserved." {...field} data-testid="input-footer-text" />
                  </FormControl>
                  <FormDescription>Copyright text displayed in the footer</FormDescription>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSaving} data-testid="button-save-branding">
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function SeoSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SeoSettingsForm>({
    defaultValues: {
      metaTitle: 'baraka - Invest in Global Stocks',
      metaDescription: 'Trade global stocks commission-free with baraka. Access US, UAE, and international markets from your mobile app.',
      ogImage: '',
      twitterHandle: '@barakaapp',
      googleAnalyticsId: '',
      enableSitemap: true,
    },
  });

  const handleSubmit = async (data: SeoSettingsForm) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Settings saved', description: 'SEO settings have been updated.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Settings
            </CardTitle>
            <CardDescription>
              Optimize your site for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Site Title - Tagline" {...field} data-testid="input-meta-title" />
                  </FormControl>
                  <FormDescription>
                    Default title for pages without a custom title (50-60 characters recommended)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Meta Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of your site..." {...field} data-testid="input-meta-description" />
                  </FormControl>
                  <FormDescription>
                    Default description for search results (150-160 characters recommended)
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ogImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default OG Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/og-image.png" {...field} data-testid="input-og-image" />
                    </FormControl>
                    <FormDescription>Default image for social sharing (1200x630 recommended)</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitterHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourhandle" {...field} data-testid="input-twitter-handle" />
                    </FormControl>
                    <FormDescription>Used for Twitter card attribution</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX" {...field} data-testid="input-ga-id" />
                  </FormControl>
                  <FormDescription>Your Google Analytics measurement ID</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableSitemap"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-generate Sitemap</FormLabel>
                    <FormDescription>
                      Automatically generate and update sitemap.xml for SEO
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-sitemap" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSaving} data-testid="button-save-seo">
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function ContentSettings() {
  const { toast } = useToast();

  const form = useForm<ContentSettingsForm>({
    defaultValues: {
      defaultTemplateId_en: '',
      defaultTemplateId_ar: '',
      websiteBaseUrl: '',
      appDeepLinkBase: '',
      autoActivateSpotlightOnPublish: false,
      defaultSpotlightPlacements: [],
      defaultCtaText_en: 'Read more',
      defaultCtaText_ar: 'اقرأ المزيد',
      emailSenderName: '',
      emailSenderEmail: '',
    },
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<NewsletterSettings>({
    queryKey: ['/api/newsletter-settings'],
  });

  const { data: templates, isLoading: templatesLoading } = useQuery<NewsletterTemplate[]>({
    queryKey: ['/api/newsletter-templates'],
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<NewsletterSettings>) => 
      apiRequest('PUT', '/api/newsletter-settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-settings'] });
      toast({ title: 'Settings saved', description: 'Content settings have been updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    },
  });

  const handleSubmit = (data: ContentSettingsForm) => {
    updateMutation.mutate(data);
  };

  const isLoading = settingsLoading || templatesLoading;

  if (settings && !form.formState.isDirty) {
    const currentValues = form.getValues();
    if (currentValues.defaultTemplateId_en !== settings.defaultTemplateId_en) {
      form.reset({
        defaultTemplateId_en: settings.defaultTemplateId_en || '',
        defaultTemplateId_ar: settings.defaultTemplateId_ar || '',
        websiteBaseUrl: settings.websiteBaseUrl || '',
        appDeepLinkBase: settings.appDeepLinkBase || '',
        autoActivateSpotlightOnPublish: settings.autoActivateSpotlightOnPublish || false,
        defaultSpotlightPlacements: settings.defaultSpotlightPlacements || [],
        defaultCtaText_en: settings.defaultCtaText_en || 'Read more',
        defaultCtaText_ar: settings.defaultCtaText_ar || 'اقرأ المزيد',
        emailSenderName: settings.emailSenderName || '',
        emailSenderEmail: settings.emailSenderEmail || '',
      });
    }
  }

  const watchedPlacements = form.watch('defaultSpotlightPlacements');
  const englishTemplates = templates?.filter(t => t.locale === 'en' || t.locale === 'global') || [];
  const arabicTemplates = templates?.filter(t => t.locale === 'ar' || t.locale === 'global') || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content & Newsletter Settings
            </CardTitle>
            <CardDescription>
              Configure default settings for content creation and delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="defaultTemplateId_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Template (English)</FormLabel>
                    <Select value={field.value || 'none'} onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}>
                      <FormControl>
                        <SelectTrigger data-testid="select-template-en">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {englishTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Default template for English newsletters</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultTemplateId_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Template (Arabic)</FormLabel>
                    <Select value={field.value || 'none'} onValueChange={(v) => field.onChange(v === 'none' ? '' : v)}>
                      <FormControl>
                        <SelectTrigger data-testid="select-template-ar">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {arabicTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Default template for Arabic newsletters</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="websiteBaseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website Base URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://baraka.com" {...field} data-testid="input-website-url" />
                    </FormControl>
                    <FormDescription>Base URL for website links in newsletters</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appDeepLinkBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Deep Link Base</FormLabel>
                    <FormControl>
                      <Input placeholder="baraka://app" {...field} data-testid="input-deeplink" />
                    </FormControl>
                    <FormDescription>Base URL for app deep links</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="autoActivateSpotlightOnPublish"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-activate Spotlight on Publish</FormLabel>
                    <FormDescription>
                      Automatically create and activate spotlight banners when newsletters are published
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-auto-spotlight" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label>Default Spotlight Placements</Label>
              <div className="flex flex-wrap gap-4">
                {SPOTLIGHT_PLACEMENTS.map((placement) => (
                  <div key={placement.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`placement-${placement.value}`}
                      checked={watchedPlacements.includes(placement.value)}
                      onCheckedChange={(checked) => {
                        const current = form.getValues('defaultSpotlightPlacements');
                        if (checked) {
                          form.setValue('defaultSpotlightPlacements', [...current, placement.value], { shouldDirty: true });
                        } else {
                          form.setValue('defaultSpotlightPlacements', current.filter(p => p !== placement.value), { shouldDirty: true });
                        }
                      }}
                      data-testid={`checkbox-placement-${placement.value}`}
                    />
                    <Label htmlFor={`placement-${placement.value}`} className="text-sm font-normal cursor-pointer">
                      {placement.label}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Default placements for auto-generated spotlight banners</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="defaultCtaText_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default CTA Text (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Read more" {...field} data-testid="input-cta-en" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultCtaText_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default CTA Text (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="اقرأ المزيد" dir="rtl" {...field} data-testid="input-cta-ar" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="emailSenderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Sender Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Baraka" {...field} data-testid="input-sender-name" />
                    </FormControl>
                    <FormDescription>Display name for sent newsletters</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailSenderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Sender Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="newsletter@baraka.com" {...field} data-testid="input-sender-email" />
                    </FormControl>
                    <FormDescription>From email address for newsletters</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty} data-testid="button-save-content">
                {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

function SecuritySettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const form = useForm<SecuritySettingsForm>({
    defaultValues: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enforcePasswordPolicy: true,
      enableTwoFactor: false,
      allowedIpRanges: '',
    },
  });

  const handleSubmit = async (data: SecuritySettingsForm) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Settings saved', description: 'Security settings have been updated.' });
    } finally {
      setIsSaving(false);
    }
  };

  const mockApiKey = 'bk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security policies and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sessionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="5" 
                        max="480" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                        data-testid="input-session-timeout" 
                      />
                    </FormControl>
                    <FormDescription>Auto logout after inactivity (5-480 minutes)</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxLoginAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Login Attempts</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="3" 
                        max="10" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                        data-testid="input-max-attempts" 
                      />
                    </FormControl>
                    <FormDescription>Lock account after failed attempts</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="enforcePasswordPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enforce Password Policy</FormLabel>
                    <FormDescription>
                      Require strong passwords (min 8 chars, uppercase, lowercase, number, special char)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-password-policy" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableTwoFactor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Two-Factor Authentication</FormLabel>
                    <FormDescription>
                      Require 2FA for all admin users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-2fa" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowedIpRanges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed IP Ranges (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="192.168.1.0/24&#10;10.0.0.0/8" 
                      {...field} 
                      data-testid="input-ip-ranges" 
                    />
                  </FormControl>
                  <FormDescription>
                    Restrict CMS access to specific IP ranges (one per line, CIDR notation). Leave empty to allow all.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    type={showApiKey ? 'text' : 'password'} 
                    value={mockApiKey} 
                    readOnly 
                    className="pr-10"
                    data-testid="input-api-key"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(mockApiKey);
                    toast({ title: 'Copied', description: 'API key copied to clipboard' });
                  }}
                >
                  Copy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Use this key for API integrations. Keep it secret!
              </p>
            </div>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Regenerating the API key will invalidate the current key and break any existing integrations.
                    </p>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => toast({ title: 'API Key Regenerated', description: 'A new API key has been generated.' })}
                      data-testid="button-regenerate-key"
                    >
                      Regenerate API Key
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSaving} data-testid="button-save-security">
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default function AdminSettings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your CMS settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full" data-testid="tabs-settings">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex gap-1">
          <TabsTrigger value="general" className="flex items-center gap-2" data-testid="tab-general">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2" data-testid="tab-branding">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2" data-testid="tab-seo">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2" data-testid="tab-content">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2" data-testid="tab-security">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <BrandingSettings />
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <SeoSettings />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentSettings />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
