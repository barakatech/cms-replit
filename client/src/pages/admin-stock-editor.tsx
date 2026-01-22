import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { 
  ArrowLeft, 
  Save, 
  Eye,
  Globe,
  FileText,
} from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { usePresence } from '@/hooks/use-presence';
import { useUser } from '@/lib/user-context';
import { 
  PresenceAvatars, 
  ActiveEditorsBar, 
  FieldPresenceIndicator,
  PresenceConnectionStatus 
} from '@/components/PresenceIndicators';
import type { StockPage } from '@shared/schema';

interface StockFormData {
  ticker: string;
  slug: string;
  companyName_en: string;
  companyName_ar: string;
  description_en: string;
  description_ar: string;
  content_en: string;
  content_ar: string;
  sector: string;
  exchange: string;
  status: 'draft' | 'published' | 'archived';
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDescription_en: string;
  metaDescription_ar: string;
  relatedTickers: string;
  ceo: string;
  employees: string;
  headquarters: string;
  founded: string;
  overview_en: string;
  overview_ar: string;
  thesis_en: string;
  thesis_ar: string;
}

export default function AdminStockEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useUser();
  const [activeField, setActiveField] = useState<string | undefined>();
  const isNew = id === 'new';

  const { othersOnSamePage, isConnected, updatePresence } = usePresence({
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    contentType: 'stock',
    contentId: id || 'new',
    avatarUrl: user.avatarUrl,
  });

  const form = useForm<StockFormData>({
    defaultValues: {
      ticker: '',
      slug: '',
      companyName_en: '',
      companyName_ar: '',
      description_en: '',
      description_ar: '',
      content_en: '',
      content_ar: '',
      sector: '',
      exchange: 'NASDAQ',
      status: 'draft',
      metaTitle_en: '',
      metaTitle_ar: '',
      metaDescription_en: '',
      metaDescription_ar: '',
      relatedTickers: '',
      ceo: '',
      employees: '',
      headquarters: '',
      founded: '',
      overview_en: '',
      overview_ar: '',
      thesis_en: '',
      thesis_ar: '',
    },
  });

  const { data: stockPage, isLoading } = useQuery<StockPage>({
    queryKey: ['/api/stock-pages', id],
    enabled: !isNew && !!id,
  });

  useEffect(() => {
    if (stockPage) {
      form.reset({
        ticker: stockPage.ticker,
        slug: stockPage.slug,
        companyName_en: stockPage.companyName_en,
        companyName_ar: stockPage.companyName_ar,
        description_en: stockPage.description_en,
        description_ar: stockPage.description_ar,
        content_en: stockPage.content_en,
        content_ar: stockPage.content_ar,
        sector: stockPage.sector,
        exchange: stockPage.exchange,
        status: stockPage.status,
        metaTitle_en: (stockPage as any).seo?.metaTitle_en || '',
        metaTitle_ar: (stockPage as any).seo?.metaTitle_ar || '',
        metaDescription_en: (stockPage as any).seo?.metaDescription_en || '',
        metaDescription_ar: (stockPage as any).seo?.metaDescription_ar || '',
        relatedTickers: stockPage.relatedTickers?.join(', ') || '',
        ceo: (stockPage as any).companyMeta?.ceo || '',
        employees: (stockPage as any).companyMeta?.employees || '',
        headquarters: (stockPage as any).companyMeta?.headquarters || '',
        founded: (stockPage as any).companyMeta?.founded || '',
        overview_en: (stockPage as any).overview_en || '',
        overview_ar: (stockPage as any).overview_ar || '',
        thesis_en: (stockPage as any).thesis_en || '',
        thesis_ar: (stockPage as any).thesis_ar || '',
      });
    }
  }, [stockPage, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: StockFormData) => {
      const payload = {
        ticker: data.ticker,
        slug: data.slug,
        companyName_en: data.companyName_en,
        companyName_ar: data.companyName_ar,
        description_en: data.description_en,
        description_ar: data.description_ar,
        content_en: data.content_en,
        content_ar: data.content_ar,
        sector: data.sector,
        exchange: data.exchange,
        status: data.status,
        seo: {
          metaTitle_en: data.metaTitle_en,
          metaTitle_ar: data.metaTitle_ar,
          metaDescription_en: data.metaDescription_en,
          metaDescription_ar: data.metaDescription_ar,
        },
        relatedTickers: data.relatedTickers.split(',').map(t => t.trim()).filter(Boolean),
        companyMeta: {
          ceo: data.ceo,
          employees: data.employees,
          headquarters: data.headquarters,
          founded: data.founded,
        },
        overview_en: data.overview_en,
        overview_ar: data.overview_ar,
        thesis_en: data.thesis_en,
        thesis_ar: data.thesis_ar,
      };

      if (isNew) {
        return apiRequest('POST', '/api/stock-pages', payload);
      } else {
        return apiRequest('PUT', `/api/stock-pages/${id}`, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stock-pages'] });
      toast({ title: 'Saved', description: 'Stock page saved successfully.' });
      if (isNew) {
        navigate('/admin/stocks');
      }
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save stock page.', variant: 'destructive' });
    },
  });

  const handleFieldFocus = (fieldName: string) => {
    setActiveField(fieldName);
    updatePresence({ field: fieldName });
  };

  const handleFieldBlur = () => {
    setActiveField(undefined);
    updatePresence({ field: undefined });
  };

  if (!isNew && isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {othersOnSamePage.length > 0 && (
        <ActiveEditorsBar presences={othersOnSamePage} contentType="stock" />
      )}

      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/admin/stocks')}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">
                {isNew ? 'New Stock Page' : `Edit: ${stockPage?.ticker}`}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <PresenceConnectionStatus isConnected={isConnected} />
                {othersOnSamePage.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {othersOnSamePage.length} other{othersOnSamePage.length > 1 ? 's' : ''} editing
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PresenceAvatars presences={othersOnSamePage} />
            <Button
              onClick={form.handleSubmit((data) => saveMutation.mutate(data))}
              disabled={saveMutation.isPending}
              data-testid="button-save"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2">
                  <Globe className="h-4 w-4" />
                  SEO
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="ticker"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Ticker Symbol</FormLabel>
                              <FieldPresenceIndicator presences={othersOnSamePage} field="ticker" />
                            </div>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="AAPL"
                                onFocus={() => handleFieldFocus('ticker')}
                                onBlur={handleFieldBlur}
                                className={activeField === 'ticker' ? 'ring-2 ring-primary' : ''}
                                data-testid="input-ticker"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="exchange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exchange</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-exchange">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="NASDAQ">NASDAQ</SelectItem>
                                <SelectItem value="NYSE">NYSE</SelectItem>
                                <SelectItem value="AMEX">AMEX</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sector</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Technology"
                                onFocus={() => handleFieldFocus('sector')}
                                onBlur={handleFieldBlur}
                                data-testid="input-sector"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="apple-inc"
                                onFocus={() => handleFieldFocus('slug')}
                                onBlur={handleFieldBlur}
                                data-testid="input-slug"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-status">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Name</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName_en"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>English</FormLabel>
                              <FieldPresenceIndicator presences={othersOnSamePage} field="companyName_en" />
                            </div>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Apple Inc."
                                onFocus={() => handleFieldFocus('companyName_en')}
                                onBlur={handleFieldBlur}
                                data-testid="input-company-name-en"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyName_ar"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Arabic</FormLabel>
                              <FieldPresenceIndicator presences={othersOnSamePage} field="companyName_ar" />
                            </div>
                            <FormControl>
                              <Input 
                                {...field} 
                                dir="rtl"
                                placeholder="شركة آبل"
                                onFocus={() => handleFieldFocus('companyName_ar')}
                                onBlur={handleFieldBlur}
                                data-testid="input-company-name-ar"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>English</FormLabel>
                              <FieldPresenceIndicator presences={othersOnSamePage} field="description_en" />
                            </div>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                                placeholder="Brief description..."
                                onFocus={() => handleFieldFocus('description_en')}
                                onBlur={handleFieldBlur}
                                data-testid="input-description-en"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description_ar"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Arabic</FormLabel>
                              <FieldPresenceIndicator presences={othersOnSamePage} field="description_ar" />
                            </div>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                                dir="rtl"
                                placeholder="وصف مختصر..."
                                onFocus={() => handleFieldFocus('description_ar')}
                                onBlur={handleFieldBlur}
                                data-testid="input-description-ar"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About Company</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="ceo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEO</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Tim Cook"
                                onFocus={() => handleFieldFocus('ceo')}
                                onBlur={handleFieldBlur}
                                data-testid="input-ceo"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employees</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="164,000"
                                onFocus={() => handleFieldFocus('employees')}
                                onBlur={handleFieldBlur}
                                data-testid="input-employees"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="headquarters"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Headquarters</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Cupertino, CA"
                                onFocus={() => handleFieldFocus('headquarters')}
                                onBlur={handleFieldBlur}
                                data-testid="input-headquarters"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="founded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Founded</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="1976"
                                onFocus={() => handleFieldFocus('founded')}
                                onBlur={handleFieldBlur}
                                data-testid="input-founded"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="overview_en"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Overview (English)</FormLabel>
                            <FieldPresenceIndicator presences={othersOnSamePage} field="overview_en" />
                          </div>
                          <FormControl>
                            <div
                              onFocus={() => handleFieldFocus('overview_en')}
                              onBlur={handleFieldBlur}
                              data-testid="input-overview-en"
                            >
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="Company overview..."
                                dir="ltr"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="overview_ar"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Overview (Arabic)</FormLabel>
                            <FieldPresenceIndicator presences={othersOnSamePage} field="overview_ar" />
                          </div>
                          <FormControl>
                            <div
                              onFocus={() => handleFieldFocus('overview_ar')}
                              onBlur={handleFieldBlur}
                              data-testid="input-overview-ar"
                            >
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="نظرة عامة على الشركة..."
                                dir="rtl"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="thesis_en"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Investment Thesis (English)</FormLabel>
                            <FieldPresenceIndicator presences={othersOnSamePage} field="thesis_en" />
                          </div>
                          <FormControl>
                            <div
                              onFocus={() => handleFieldFocus('thesis_en')}
                              onBlur={handleFieldBlur}
                              data-testid="input-thesis-en"
                            >
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="Investment thesis..."
                                dir="ltr"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="thesis_ar"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Investment Thesis (Arabic)</FormLabel>
                            <FieldPresenceIndicator presences={othersOnSamePage} field="thesis_ar" />
                          </div>
                          <FormControl>
                            <div
                              onFocus={() => handleFieldFocus('thesis_ar')}
                              onBlur={handleFieldBlur}
                              data-testid="input-thesis-ar"
                            >
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="أطروحة الاستثمار..."
                                dir="rtl"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content_en"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>English Content</FormLabel>
                            <FieldPresenceIndicator presences={othersOnSamePage} field="content_en" />
                          </div>
                          <FormControl>
                            <div
                              onFocus={() => handleFieldFocus('content_en')}
                              onBlur={handleFieldBlur}
                              data-testid="input-content-en"
                            >
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="Write stock page content..."
                                dir="ltr"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content_ar"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Arabic Content</FormLabel>
                            <FieldPresenceIndicator presences={othersOnSamePage} field="content_ar" />
                          </div>
                          <FormControl>
                            <div
                              onFocus={() => handleFieldFocus('content_ar')}
                              onBlur={handleFieldBlur}
                              data-testid="input-content-ar"
                            >
                              <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                                placeholder="اكتب محتوى صفحة السهم..."
                                dir="rtl"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Related Stocks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="relatedTickers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Related Tickers (comma-separated)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="MSFT, GOOGL, AMZN"
                              onFocus={() => handleFieldFocus('relatedTickers')}
                              onBlur={handleFieldBlur}
                              data-testid="input-related-tickers"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="metaTitle_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title (English)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Buy AAPL Stock | Baraka"
                                onFocus={() => handleFieldFocus('metaTitle_en')}
                                onBlur={handleFieldBlur}
                                data-testid="input-meta-title-en"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metaTitle_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title (Arabic)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                dir="rtl"
                                placeholder="شراء سهم آبل | بركة"
                                onFocus={() => handleFieldFocus('metaTitle_ar')}
                                onBlur={handleFieldBlur}
                                data-testid="input-meta-title-ar"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="metaDescription_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description (English)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                                placeholder="Invest in Apple stock..."
                                onFocus={() => handleFieldFocus('metaDescription_en')}
                                onBlur={handleFieldBlur}
                                data-testid="input-meta-desc-en"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metaDescription_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Description (Arabic)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                                dir="rtl"
                                placeholder="استثمر في سهم آبل..."
                                onFocus={() => handleFieldFocus('metaDescription_ar')}
                                onBlur={handleFieldBlur}
                                data-testid="input-meta-desc-ar"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
