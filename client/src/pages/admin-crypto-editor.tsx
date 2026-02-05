import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  ArrowLeft, 
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Settings2,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/RichTextEditor';
import type { CryptoPage, InsertCryptoPage, CryptoPageModule } from '@shared/schema';
import { DEFAULT_CRYPTO_PAGE_MODULES } from '@shared/schema';

const cryptoFormSchema = z.object({
  title_en: z.string().min(1, 'English title is required'),
  title_ar: z.string().min(1, 'Arabic title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Name is required'),
  coingeckoId: z.string().optional(),
  coincapId: z.string().optional(),
  marketCapRank: z.number().int().optional(),
  isStablecoin: z.boolean().default(false),
  assetType: z.enum(['coin', 'token', 'stablecoin', 'wrapped', 'defi', 'nft', 'meme']).default('coin'),
  
  editorialLocked: z.boolean().default(false),
  
  heroSummary_en: z.string().optional(),
  heroSummary_ar: z.string().optional(),
  
  whatIsIt_en: z.string().optional(),
  whatIsIt_ar: z.string().optional(),
  howItWorks_en: z.string().optional(),
  howItWorks_ar: z.string().optional(),
  risks_en: z.string().optional(),
  risks_ar: z.string().optional(),
  
  disclaimers_en: z.array(z.string()).default([]),
  disclaimers_ar: z.array(z.string()).default([]),
  
  metaTitle_en: z.string().optional(),
  metaTitle_ar: z.string().optional(),
  metaDescription_en: z.string().optional(),
  metaDescription_ar: z.string().optional(),
  ogTitle_en: z.string().optional(),
  ogTitle_ar: z.string().optional(),
  ogDescription_en: z.string().optional(),
  ogDescription_ar: z.string().optional(),
  ogImage: z.string().optional(),
  indexable: z.boolean().default(false),
});

type CryptoFormData = z.infer<typeof cryptoFormSchema>;

const pageModulesSchema = z.array(z.object({
  id: z.string(),
  type: z.string(),
  enabled: z.boolean(),
  order: z.number(),
  config: z.record(z.any()).optional(),
}));

const defaultFormValues: Partial<CryptoFormData> = {
  title_en: '',
  title_ar: '',
  slug: '',
  status: 'draft',
  featured: false,
  tags: [],
  symbol: '',
  name: '',
  isStablecoin: false,
  assetType: 'coin',
  editorialLocked: false,
  disclaimers_en: [],
  disclaimers_ar: [],
  indexable: false,
};

const assetTypeLabels: Record<string, string> = {
  coin: 'Coin',
  token: 'Token',
  stablecoin: 'Stablecoin',
  wrapped: 'Wrapped',
  defi: 'DeFi',
  nft: 'NFT',
  meme: 'Meme',
};

export default function AdminCryptoEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProMode, setIsProMode] = useState(false);
  const [disclaimerEn, setDisclaimerEn] = useState('');
  const [disclaimerAr, setDisclaimerAr] = useState('');
  const [pageModules, setPageModules] = useState<CryptoPageModule[]>(() => 
    DEFAULT_CRYPTO_PAGE_MODULES.map(m => ({ ...m, config: m.config ? { ...m.config } : undefined }))
  );
  const isNew = id === 'new';

  const { data: cryptoPage, isLoading } = useQuery<CryptoPage>({
    queryKey: ['/api/crypto/pages', id],
    enabled: !isNew,
  });

  const form = useForm<CryptoFormData>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (cryptoPage) {
      form.reset({
        ...cryptoPage,
        tags: cryptoPage.tags || [],
        disclaimers_en: cryptoPage.disclaimers_en || [],
        disclaimers_ar: cryptoPage.disclaimers_ar || [],
      } as CryptoFormData);
      if (cryptoPage.pageModules && cryptoPage.pageModules.length > 0) {
        setPageModules(cryptoPage.pageModules);
      }
    }
  }, [cryptoPage, form]);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<InsertCryptoPage>) => {
      const response = await apiRequest('POST', '/api/crypto/pages', data);
      return response.json();
    },
    onSuccess: (newCrypto: CryptoPage) => {
      queryClient.invalidateQueries({ queryKey: ['/api/crypto/pages'] });
      toast({ title: 'Crypto page created successfully' });
      navigate(`/admin/crypto/${newCrypto.id}/edit`);
    },
    onError: () => {
      toast({ title: 'Failed to create crypto page', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<CryptoPage>) => {
      const response = await apiRequest('PUT', `/api/crypto/pages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crypto/pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/crypto/pages', id] });
      toast({ title: 'Crypto page updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update crypto page', variant: 'destructive' });
    },
  });

  const complianceScanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/crypto/pages/${id}/scan`, {});
      return response.json();
    },
    onSuccess: (result: { complianceStatus: string; violations: Array<{ keyword: string }>; requiredDisclosuresPresent: boolean }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/crypto/pages', id] });
      if (result.complianceStatus === 'pass') {
        toast({ title: 'Compliance scan passed', description: 'No violations found' });
      } else {
        toast({ 
          title: 'Compliance issues found', 
          description: `${result.violations.length} violations detected`,
          variant: 'destructive' 
        });
      }
    },
    onError: () => {
      toast({ title: 'Failed to run compliance scan', variant: 'destructive' });
    },
  });

  const onSubmit = (data: CryptoFormData) => {
    const payload: Partial<InsertCryptoPage> = {
      ...data,
      pageModules,
      complianceStatus: 'pending',
      requiredDisclosuresPresent: (data.disclaimers_en?.length ?? 0) > 0,
    };

    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const generateSlug = () => {
    const name = form.getValues('name') || form.getValues('title_en');
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setValue('slug', slug);
  };

  const addDisclaimer = (lang: 'en' | 'ar') => {
    const value = lang === 'en' ? disclaimerEn : disclaimerAr;
    if (!value.trim()) return;
    
    const field = lang === 'en' ? 'disclaimers_en' : 'disclaimers_ar';
    const current = form.getValues(field) || [];
    form.setValue(field, [...current, value.trim()]);
    
    if (lang === 'en') setDisclaimerEn('');
    else setDisclaimerAr('');
  };

  const removeDisclaimer = (lang: 'en' | 'ar', index: number) => {
    const field = lang === 'en' ? 'disclaimers_en' : 'disclaimers_ar';
    const current = form.getValues(field) || [];
    form.setValue(field, current.filter((_, i) => i !== index));
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/crypto')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold" data-testid="text-editor-title">
                {isNew ? 'Create New Crypto Page' : `Edit: ${cryptoPage?.title_en || cryptoPage?.name || 'Crypto'}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isNew ? 'Add a new cryptocurrency landing page' : 'Modify crypto page details'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="pro-mode" className="text-sm text-muted-foreground">Pro Mode</Label>
              <Switch
                id="pro-mode"
                checked={isProMode}
                onCheckedChange={setIsProMode}
                data-testid="switch-pro-mode"
              />
            </div>
            {!isNew && cryptoPage?.status === 'published' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`/crypto/${cryptoPage.slug}`, '_blank')}
                data-testid="button-preview"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={isSaving}
              data-testid="button-save"
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="mb-4" data-testid="tabs-editor">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                {isProMode && <TabsTrigger value="modules">Modules</TabsTrigger>}
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                {isProMode && <TabsTrigger value="livedata">Live Data</TabsTrigger>}
              </TabsList>

              <TabsContent value="basics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identity</CardTitle>
                    <CardDescription>Basic crypto identification and classification</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Bitcoin" data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Symbol</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., BTC" className="uppercase" data-testid="input-symbol" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (English)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Bitcoin (BTC)" data-testid="input-title-en" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="title_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (Arabic)</FormLabel>
                            <FormControl>
                              <Input {...field} dir="rtl" placeholder="العنوان بالعربية" data-testid="input-title-ar" />
                            </FormControl>
                            <FormMessage />
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
                            <div className="flex gap-2">
                              <FormControl>
                                <Input {...field} placeholder="bitcoin" data-testid="input-slug" />
                              </FormControl>
                              <Button type="button" variant="outline" onClick={generateSlug}>
                                Generate
                              </Button>
                            </div>
                            <FormDescription>Used in the URL: /crypto/{field.value || 'slug'}</FormDescription>
                            <FormMessage />
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
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="coingeckoId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CoinGecko ID</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., bitcoin" data-testid="input-coingecko-id" />
                            </FormControl>
                            <FormDescription>Used to fetch live market data</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="assetType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-asset-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(assetTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="marketCapRank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Market Cap Rank</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                value={field.value || ''}
                                placeholder="e.g., 1" 
                                data-testid="input-rank" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-featured" />
                            </FormControl>
                            <FormLabel className="!mt-0">Featured</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isStablecoin"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-stablecoin" />
                            </FormControl>
                            <FormLabel className="!mt-0">Stablecoin</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="editorialLocked"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-locked" />
                            </FormControl>
                            <FormLabel className="!mt-0">Editorial Locked</FormLabel>
                            <FormDescription className="!mt-0 ml-2">(Prevents auto-regeneration)</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Summary</CardTitle>
                    <CardDescription>Brief summary shown in the hero section</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="heroSummary_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Summary (English)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Brief description for the hero section..." rows={3} data-testid="textarea-hero-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heroSummary_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Summary (Arabic)</FormLabel>
                          <FormControl>
                            <Textarea {...field} dir="rtl" placeholder="وصف موجز للقسم الرئيسي..." rows={3} data-testid="textarea-hero-ar" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What Is It?</CardTitle>
                    <CardDescription>Explain what this cryptocurrency is (WYSIWYG)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="whatIsIt_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What Is It? (English)</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Describe what this cryptocurrency is..."
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatIsIt_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What Is It? (Arabic)</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="صف ما هي هذه العملة الرقمية..."
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>Explain how this cryptocurrency works (WYSIWYG)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="howItWorks_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How It Works (English)</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Explain how this cryptocurrency works..."
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="howItWorks_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How It Works (Arabic)</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="اشرح كيف تعمل هذه العملة الرقمية..."
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risks</CardTitle>
                    <CardDescription>Risk disclosures (WYSIWYG) - Required for publishing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="risks_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risks (English)</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Describe the risks associated with this cryptocurrency..."
                              dir="ltr"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="risks_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risks (Arabic)</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="صف المخاطر المرتبطة بهذه العملة الرقمية..."
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disclaimers</CardTitle>
                    <CardDescription>Legal disclaimers - Required for publishing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Disclaimers (English)</Label>
                      <div className="mt-2 space-y-2">
                        {form.watch('disclaimers_en')?.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-muted rounded">
                            <p className="flex-1 text-sm">{d}</p>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeDisclaimer('en', i)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input 
                            value={disclaimerEn} 
                            onChange={e => setDisclaimerEn(e.target.value)} 
                            placeholder="Add disclaimer..."
                            data-testid="input-disclaimer-en"
                          />
                          <Button type="button" variant="outline" onClick={() => addDisclaimer('en')}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Disclaimers (Arabic)</Label>
                      <div className="mt-2 space-y-2">
                        {form.watch('disclaimers_ar')?.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-muted rounded" dir="rtl">
                            <p className="flex-1 text-sm">{d}</p>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeDisclaimer('ar', i)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2" dir="rtl">
                          <Input 
                            value={disclaimerAr} 
                            onChange={e => setDisclaimerAr(e.target.value)} 
                            placeholder="أضف إخلاء مسؤولية..."
                            dir="rtl"
                            data-testid="input-disclaimer-ar"
                          />
                          <Button type="button" variant="outline" onClick={() => addDisclaimer('ar')}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {isProMode && (
                <TabsContent value="modules" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Modules</CardTitle>
                      <CardDescription>Configure which sections appear on the public page and their order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {[...pageModules].sort((a, b) => a.order - b.order).map((mod, idx) => (
                          <div 
                            key={mod.id} 
                            className="flex items-center gap-4 p-3 bg-muted rounded border"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <div className="flex-1">
                              <p className="font-medium capitalize">{mod.type.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-muted-foreground">Order: {mod.order}</p>
                            </div>
                            <Switch
                              checked={mod.enabled}
                              onCheckedChange={(enabled) => {
                                const updated = pageModules.map(m => 
                                  m.id === mod.id ? { ...m, enabled } : m
                                );
                                setPageModules(updated);
                              }}
                              data-testid={`switch-module-${mod.id}`}
                            />
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={idx === 0}
                                onClick={() => {
                                  const sorted = [...pageModules].sort((a, b) => a.order - b.order);
                                  if (idx > 0) {
                                    const prev = sorted[idx - 1];
                                    const curr = sorted[idx];
                                    const updated = pageModules.map(m => {
                                      if (m.id === curr.id) return { ...m, order: prev.order };
                                      if (m.id === prev.id) return { ...m, order: curr.order };
                                      return m;
                                    });
                                    setPageModules(updated);
                                  }
                                }}
                                data-testid={`button-module-up-${mod.id}`}
                              >
                                <ArrowLeft className="h-4 w-4 rotate-90" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={idx === pageModules.length - 1}
                                onClick={() => {
                                  const sorted = [...pageModules].sort((a, b) => a.order - b.order);
                                  if (idx < sorted.length - 1) {
                                    const next = sorted[idx + 1];
                                    const curr = sorted[idx];
                                    const updated = pageModules.map(m => {
                                      if (m.id === curr.id) return { ...m, order: next.order };
                                      if (m.id === next.id) return { ...m, order: curr.order };
                                      return m;
                                    });
                                    setPageModules(updated);
                                  }
                                }}
                                data-testid={`button-module-down-${mod.id}`}
                              >
                                <ArrowLeft className="h-4 w-4 -rotate-90" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setPageModules(DEFAULT_CRYPTO_PAGE_MODULES.map(m => ({ ...m, config: m.config ? { ...m.config } : undefined })))}
                          data-testid="button-reset-modules"
                        >
                          Reset to Defaults
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings (English)</CardTitle>
                    <CardDescription>Search engine optimization for English version</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="metaTitle_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Page title for search engines" data-testid="input-meta-title-en" />
                          </FormControl>
                          <FormDescription>Recommended: 50-60 characters</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metaDescription_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Page description for search engines" rows={3} data-testid="textarea-meta-desc-en" />
                          </FormControl>
                          <FormDescription>Recommended: 150-160 characters</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ogTitle_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Graph Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Title for social sharing" data-testid="input-og-title-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ogDescription_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Graph Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Description for social sharing" rows={2} data-testid="textarea-og-desc-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings (Arabic)</CardTitle>
                    <CardDescription>Search engine optimization for Arabic version</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="metaTitle_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input {...field} dir="rtl" placeholder="عنوان الصفحة لمحركات البحث" data-testid="input-meta-title-ar" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="metaDescription_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} dir="rtl" placeholder="وصف الصفحة لمحركات البحث" rows={3} data-testid="textarea-meta-desc-ar" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ogTitle_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Graph Title</FormLabel>
                          <FormControl>
                            <Input {...field} dir="rtl" placeholder="عنوان للمشاركة الاجتماعية" data-testid="input-og-title-ar" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ogDescription_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Graph Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} dir="rtl" placeholder="وصف للمشاركة الاجتماعية" rows={2} data-testid="textarea-og-desc-ar" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Indexing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="indexable"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-indexable" />
                          </FormControl>
                          <FormLabel className="!mt-0">Allow search engines to index this page</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ogImage"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Open Graph Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-og-image" />
                          </FormControl>
                          <FormDescription>Image for social media sharing</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Status</CardTitle>
                    <CardDescription>Review and manage compliance for this crypto page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isNew && cryptoPage && (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {cryptoPage.complianceStatus === 'pass' && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {cryptoPage.complianceStatus === 'pending' && (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                            {cryptoPage.complianceStatus === 'fail' && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            {cryptoPage.complianceStatus === 'override' && (
                              <Shield className="h-5 w-5 text-blue-500" />
                            )}
                            <span className="font-medium capitalize">{cryptoPage.complianceStatus}</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => complianceScanMutation.mutate()}
                            disabled={complianceScanMutation.isPending}
                            data-testid="button-run-scan"
                          >
                            {complianceScanMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Shield className="h-4 w-4 mr-2" />
                            )}
                            Run Compliance Scan
                          </Button>
                        </div>

                        {cryptoPage.lastComplianceScanAt && (
                          <p className="text-sm text-muted-foreground">
                            Last scanned: {new Date(cryptoPage.lastComplianceScanAt).toLocaleString()}
                          </p>
                        )}

                        {cryptoPage.complianceScanResults && cryptoPage.complianceScanResults.length > 0 && (
                          <div className="mt-4">
                            <Label>Violations Found</Label>
                            <div className="mt-2 space-y-2">
                              {cryptoPage.complianceScanResults.map((result, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                                  <XCircle className="h-4 w-4 text-red-500" />
                                  <span className="font-medium">{result.keyword}</span>
                                  <span className="text-muted-foreground">in {result.field}</span>
                                  <Badge variant="outline" className="ml-auto">{result.severity}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="flex items-center gap-2">
                          {cryptoPage.requiredDisclosuresPresent ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span>Required disclosures present</span>
                        </div>
                      </>
                    )}

                    {isNew && (
                      <p className="text-muted-foreground">
                        Save the page first to run compliance scans.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {isProMode && (
                <TabsContent value="livedata" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Market Data (Read-Only)</CardTitle>
                      <CardDescription>Current market data from external providers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!isNew && cryptoPage?.marketData ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Price (USD)</Label>
                            <p className="font-semibold">${cryptoPage.marketData.priceUsd?.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">24h Change</Label>
                            <p className={`font-semibold ${(cryptoPage.marketData.priceChange24hPct ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {cryptoPage.marketData.priceChange24hPct?.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Market Cap</Label>
                            <p className="font-semibold">${cryptoPage.marketData.marketCapUsd?.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">24h Volume</Label>
                            <p className="font-semibold">${cryptoPage.marketData.volume24hUsd?.toLocaleString()}</p>
                          </div>
                          {cryptoPage.marketData.athUsd && (
                            <div>
                              <Label className="text-muted-foreground">All-Time High</Label>
                              <p className="font-semibold">${cryptoPage.marketData.athUsd.toLocaleString()}</p>
                            </div>
                          )}
                          {cryptoPage.marketData.lastUpdatedAt && (
                            <div>
                              <Label className="text-muted-foreground">Last Updated</Label>
                              <p className="text-sm">{new Date(cryptoPage.marketData.lastUpdatedAt).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {isNew ? 'Save the page first to see market data.' : 'No market data available. Ensure a valid CoinGecko ID is set.'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
