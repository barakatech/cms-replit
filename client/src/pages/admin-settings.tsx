import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Settings, Mail, Bell, Globe, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { NewsletterSettings, NewsletterTemplate, SpotlightPlacement } from '@shared/schema';

const SPOTLIGHT_PLACEMENTS: { value: SpotlightPlacement; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'discover', label: 'Discover' },
  { value: 'blog', label: 'Blog' },
  { value: 'stock', label: 'Stock' },
  { value: 'custom', label: 'Custom' },
];

interface SettingsFormData {
  defaultTemplateId_en: string;
  defaultTemplateId_ar: string;
  websiteBaseUrl: string;
  appDeepLinkBase: string;
  autoActivateSpotlightOnPublish: boolean;
  defaultSpotlightPlacements: SpotlightPlacement[];
  defaultCtaText_en: string;
  defaultCtaText_ar: string;
  brandLogoUrl: string;
  emailSenderName: string;
  emailSenderEmail: string;
}

export default function AdminSettings() {
  const { toast } = useToast();

  const form = useForm<SettingsFormData>({
    defaultValues: {
      defaultTemplateId_en: '',
      defaultTemplateId_ar: '',
      websiteBaseUrl: '',
      appDeepLinkBase: '',
      autoActivateSpotlightOnPublish: false,
      defaultSpotlightPlacements: [],
      defaultCtaText_en: 'Read more',
      defaultCtaText_ar: 'اقرأ المزيد',
      brandLogoUrl: '',
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
      toast({ title: 'Settings saved', description: 'Newsletter settings have been updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    },
  });

  const handleSubmit = (data: SettingsFormData) => {
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
        brandLogoUrl: settings.brandLogoUrl || '',
        emailSenderName: settings.emailSenderName || '',
        emailSenderEmail: settings.emailSenderEmail || '',
      });
    }
  }

  const watchedPlacements = form.watch('defaultSpotlightPlacements');
  const watchedLogoUrl = form.watch('brandLogoUrl');

  const englishTemplates = templates?.filter(t => t.locale === 'en' || t.locale === 'global') || [];
  const arabicTemplates = templates?.filter(t => t.locale === 'ar' || t.locale === 'global') || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">Configure application settings and defaults</p>
        </div>
      </div>

      <Tabs defaultValue="newsletter" className="w-full" data-testid="tabs-settings">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex gap-1">
          <TabsTrigger value="newsletter" className="flex items-center gap-2" data-testid="tab-newsletter">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Newsletter</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2" data-testid="tab-notifications" disabled>
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2" data-testid="tab-localization" disabled>
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Localization</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2" data-testid="tab-branding" disabled>
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="newsletter" className="mt-6">
          {isLoading ? (
            <div className="space-y-6">
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
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Newsletter Settings
                    </CardTitle>
                    <CardDescription>
                      Configure default settings for newsletter creation and delivery
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
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-template-en">
                                  <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {englishTemplates.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Default template for English newsletters
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="defaultTemplateId_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Template (Arabic)</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-template-ar">
                                  <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {arabicTemplates.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Default template for Arabic newsletters
                            </FormDescription>
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
                              <Input 
                                placeholder="https://baraka.com" 
                                {...field} 
                                data-testid="input-website-url"
                              />
                            </FormControl>
                            <FormDescription>
                              Base URL for website links in newsletters
                            </FormDescription>
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
                              <Input 
                                placeholder="baraka://app" 
                                {...field} 
                                data-testid="input-deeplink"
                              />
                            </FormControl>
                            <FormDescription>
                              Base URL for app deep links
                            </FormDescription>
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
                            <FormLabel className="text-base">
                              Auto-activate Spotlight on Publish
                            </FormLabel>
                            <FormDescription>
                              Automatically create and activate spotlight banners when newsletters are published
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-auto-spotlight"
                            />
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
                            <Label 
                              htmlFor={`placement-${placement.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {placement.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Default placements for auto-generated spotlight banners
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="defaultCtaText_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default CTA Text (English)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Read more" 
                                {...field} 
                                data-testid="input-cta-en"
                              />
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
                              <Input 
                                placeholder="اقرأ المزيد" 
                                dir="rtl"
                                {...field} 
                                data-testid="input-cta-ar"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="brandLogoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Logo URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/logo.png" 
                              {...field} 
                              data-testid="input-logo-url"
                            />
                          </FormControl>
                          <FormDescription>
                            Logo URL to include in newsletters
                          </FormDescription>
                          {watchedLogoUrl && (
                            <div className="mt-2 p-4 border rounded-md bg-surface2">
                              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                              <img 
                                src={watchedLogoUrl} 
                                alt="Brand logo preview" 
                                className="max-h-16 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                                data-testid="img-logo-preview"
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="emailSenderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Sender Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Baraka" 
                                {...field} 
                                data-testid="input-sender-name"
                              />
                            </FormControl>
                            <FormDescription>
                              Display name for sent newsletters
                            </FormDescription>
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
                              <Input 
                                type="email"
                                placeholder="newsletter@baraka.com" 
                                {...field} 
                                data-testid="input-sender-email"
                              />
                            </FormControl>
                            <FormDescription>
                              From email address for newsletters
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button 
                        type="submit" 
                        disabled={updateMutation.isPending || !form.formState.isDirty}
                        data-testid="button-save-settings"
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization Settings
              </CardTitle>
              <CardDescription>
                Configure language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding Settings
              </CardTitle>
              <CardDescription>
                Configure branding and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
