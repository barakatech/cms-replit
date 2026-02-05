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
  Settings2
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { BondPage, InsertBondPage, DEFAULT_BOND_PAGE_BLOCKS } from '@shared/schema';

const bondFormSchema = z.object({
  title_en: z.string().min(1, 'English title is required'),
  title_ar: z.string().min(1, 'Arabic title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  instrumentType: z.enum(['government', 'corporate', 'municipal', 'sukuk', 'treasury', 'agency', 'supranational']),
  issuerType: z.enum(['sovereign', 'corporate', 'financial', 'government_agency', 'supranational', 'municipal']),
  couponType: z.enum(['fixed', 'floating', 'zero', 'step_up', 'payment_in_kind']),
  seniority: z.enum(['senior_secured', 'senior_unsecured', 'subordinated', 'junior_subordinated']),
  principalRepaymentType: z.enum(['bullet', 'amortizing', 'sinking_fund', 'callable', 'perpetual']),
  riskLevel: z.enum(['low', 'medium', 'high', 'very_high']),
  currency: z.string().min(1, 'Currency is required'),
  issuerName_en: z.string().min(1, 'Issuer name (English) is required'),
  issuerName_ar: z.string().min(1, 'Issuer name (Arabic) is required'),
  isin: z.string().optional(),
  cusip: z.string().optional(),
  ticker: z.string().optional(),
  exchange: z.string().optional(),
  issuerCountry: z.string().optional(),
  countryOfRisk: z.string().optional(),
  issueDate: z.string().optional(),
  maturityDate: z.string().optional(),
  isPerpetual: z.boolean().default(false),
  settlementDays: z.number().optional(),
  denomination: z.number().optional(),
  minInvestment: z.number().optional(),
  incrementSize: z.number().optional(),
  dayCountConvention: z.enum(['30/360', 'actual/360', 'actual/365', 'actual/actual']).optional(),
  cleanPrice: z.number().optional(),
  dirtyPrice: z.number().optional(),
  accruedInterest: z.number().optional(),
  ytm: z.number().optional(),
  currentYield: z.number().optional(),
  yieldToCall: z.number().optional(),
  yieldToWorst: z.number().optional(),
  spreadValue: z.number().optional(),
  spreadType: z.enum(['g_spread', 'i_spread', 'z_spread', 'oas']).optional(),
  benchmark: z.string().optional(),
  spreadToBenchmark: z.number().optional(),
  bidPrice: z.number().optional(),
  bidYield: z.number().optional(),
  askPrice: z.number().optional(),
  askYield: z.number().optional(),
  priceSource: z.string().optional(),
  couponRate: z.number().optional(),
  couponFrequency: z.enum(['annual', 'semi_annual', 'quarterly', 'monthly', 'at_maturity']).optional(),
  nextCouponDate: z.string().optional(),
  lastCouponDate: z.string().optional(),
  creditRatingDisplay: z.string().optional(),
  duration: z.number().optional(),
  macaulayDuration: z.number().optional(),
  convexity: z.number().optional(),
  interestRateSensitivityNotes_en: z.string().optional(),
  interestRateSensitivityNotes_ar: z.string().optional(),
  defaultRiskNotes_en: z.string().optional(),
  defaultRiskNotes_ar: z.string().optional(),
  countryRiskNotes_en: z.string().optional(),
  countryRiskNotes_ar: z.string().optional(),
  issuerShortDescription_en: z.string().optional(),
  issuerShortDescription_ar: z.string().optional(),
  issuerSector: z.string().optional(),
  issuerWebsite: z.string().optional(),
  issuerLogo: z.string().optional(),
  issuerFinancialHighlights_en: z.string().optional(),
  issuerFinancialHighlights_ar: z.string().optional(),
  liquidityScore: z.number().min(1).max(10).optional(),
  avgDailyVolume: z.number().optional(),
  typicalBidAskBps: z.number().optional(),
  tradableOnPlatform: z.boolean().default(true),
  tradingHoursNotes_en: z.string().optional(),
  tradingHoursNotes_ar: z.string().optional(),
  earlyExitNotes_en: z.string().optional(),
  earlyExitNotes_ar: z.string().optional(),
  heroSummary_en: z.string().optional(),
  heroSummary_ar: z.string().optional(),
  howItWorks_en: z.string().optional(),
  howItWorks_ar: z.string().optional(),
  riskDisclosure_en: z.string().optional(),
  riskDisclosure_ar: z.string().optional(),
  showCharts: z.boolean().default(false),
  callable: z.boolean().default(false),
  putable: z.boolean().default(false),
  convertible: z.boolean().default(false),
  guaranteed: z.boolean().default(false),
  seo_en: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    ogImage: z.string().optional(),
    canonicalUrl: z.string().optional(),
    indexable: z.boolean(),
  }),
  seo_ar: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string(),
    ogImage: z.string().optional(),
    canonicalUrl: z.string().optional(),
    indexable: z.boolean(),
  }),
});

type BondFormData = z.infer<typeof bondFormSchema>;

const defaultSeo = {
  metaTitle: '',
  metaDescription: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  canonicalUrl: '',
  indexable: true,
};

const defaultFormValues: Partial<BondFormData> = {
  title_en: '',
  title_ar: '',
  slug: '',
  status: 'draft',
  tags: [],
  featured: false,
  instrumentType: 'corporate',
  issuerType: 'corporate',
  couponType: 'fixed',
  seniority: 'senior_unsecured',
  principalRepaymentType: 'bullet',
  riskLevel: 'medium',
  currency: 'USD',
  issuerName_en: '',
  issuerName_ar: '',
  isPerpetual: false,
  tradableOnPlatform: true,
  showCharts: false,
  callable: false,
  putable: false,
  convertible: false,
  guaranteed: false,
  seo_en: defaultSeo,
  seo_ar: defaultSeo,
};

export default function AdminBondEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProMode, setIsProMode] = useState(false);
  const isNew = id === 'new';

  const { data: bondPage, isLoading } = useQuery<BondPage>({
    queryKey: ['/api/bond-pages', id],
    enabled: !isNew,
  });

  const form = useForm<BondFormData>({
    resolver: zodResolver(bondFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (bondPage) {
      form.reset({
        ...bondPage,
        tags: bondPage.tags || [],
        seo_en: bondPage.seo_en || defaultSeo,
        seo_ar: bondPage.seo_ar || defaultSeo,
      } as BondFormData);
    }
  }, [bondPage, form]);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<InsertBondPage>) => {
      const response = await apiRequest('POST', '/api/bond-pages', data);
      return response.json();
    },
    onSuccess: (newBond: BondPage) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bond-pages'] });
      toast({ title: 'Bond page created successfully' });
      navigate(`/admin/bonds/${newBond.id}/edit`);
    },
    onError: () => {
      toast({ title: 'Failed to create bond page', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<BondPage>) => {
      const response = await apiRequest('PUT', `/api/bond-pages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bond-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bond-pages', id] });
      toast({ title: 'Bond page updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update bond page', variant: 'destructive' });
    },
  });

  const complianceScanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/bond-pages/${id}/compliance-scan`, {});
      return response.json();
    },
    onSuccess: (result: { complianceStatus: string; violations: Array<{ keyword: string }>; requiredDisclosuresPresent: boolean }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bond-pages', id] });
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

  const onSubmit = (data: BondFormData) => {
    const payload: Partial<InsertBondPage> = {
      ...data,
      complianceStatus: 'pending',
      requiredDisclosuresPresent: false,
      pageBuilderJson: bondPage?.pageBuilderJson || [],
    };

    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const generateSlug = () => {
    const title = form.getValues('title_en');
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setValue('slug', slug);
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/bonds')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold" data-testid="text-editor-title">
                {isNew ? 'Create New Bond' : `Edit: ${bondPage?.title_en || 'Bond'}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isNew ? 'Add a new fixed income investment page' : 'Modify bond page details'}
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
            {!isNew && bondPage?.status === 'published' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`/bonds/${bondPage.slug}`, '_blank')}
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
                {isProMode && <TabsTrigger value="pricing">Pricing & Yield</TabsTrigger>}
                {isProMode && <TabsTrigger value="cashflow">Cashflow</TabsTrigger>}
                {isProMode && <TabsTrigger value="risk">Risk & Credit</TabsTrigger>}
                {isProMode && <TabsTrigger value="liquidity">Liquidity</TabsTrigger>}
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identity</CardTitle>
                    <CardDescription>Basic bond identification and classification</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (English)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Saudi Government Bond 2030" data-testid="input-title-en" />
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
                                <Input {...field} placeholder="saudi-gov-bond-2030" data-testid="input-slug" />
                              </FormControl>
                              <Button type="button" variant="outline" onClick={generateSlug}>
                                Generate
                              </Button>
                            </div>
                            <FormDescription>Used in the URL: /bonds/{field.value || 'slug'}</FormDescription>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="issuerName_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuer Name (English)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Kingdom of Saudi Arabia" data-testid="input-issuer-en" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="issuerName_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuer Name (Arabic)</FormLabel>
                            <FormControl>
                              <Input {...field} dir="rtl" placeholder="اسم المصدر" data-testid="input-issuer-ar" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-currency">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="SAR">SAR</SelectItem>
                                <SelectItem value="AED">AED</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="instrumentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instrument Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-instrument-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="corporate">Corporate</SelectItem>
                                <SelectItem value="municipal">Municipal</SelectItem>
                                <SelectItem value="sukuk">Sukuk</SelectItem>
                                <SelectItem value="treasury">Treasury</SelectItem>
                                <SelectItem value="agency">Agency</SelectItem>
                                <SelectItem value="supranational">Supranational</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="riskLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Level</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-risk-level">
                                  <SelectValue placeholder="Select risk" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="very_high">Very High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {isProMode && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="isin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ISIN</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., SA0007879105" data-testid="input-isin" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cusip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CUSIP</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 80283LAA1" data-testid="input-cusip" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ticker"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ticker</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., KSA30" data-testid="input-ticker" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="issuerType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Issuer Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select issuer type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sovereign">Sovereign</SelectItem>
                                    <SelectItem value="corporate">Corporate</SelectItem>
                                    <SelectItem value="financial">Financial</SelectItem>
                                    <SelectItem value="government_agency">Government Agency</SelectItem>
                                    <SelectItem value="supranational">Supranational</SelectItem>
                                    <SelectItem value="municipal">Municipal</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="couponType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Coupon Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select coupon type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="floating">Floating</SelectItem>
                                    <SelectItem value="zero">Zero Coupon</SelectItem>
                                    <SelectItem value="step_up">Step Up</SelectItem>
                                    <SelectItem value="payment_in_kind">Payment in Kind</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="seniority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Seniority</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select seniority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="senior_secured">Senior Secured</SelectItem>
                                    <SelectItem value="senior_unsecured">Senior Unsecured</SelectItem>
                                    <SelectItem value="subordinated">Subordinated</SelectItem>
                                    <SelectItem value="junior_subordinated">Junior Subordinated</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name="callable"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Callable</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="putable"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Putable</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="convertible"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Convertible</FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="guaranteed"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Guaranteed</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                    <CardDescription>Essential pricing and maturity information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="ytm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yield to Maturity (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                value={field.value ?? ''}
                                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                placeholder="e.g., 5.25" 
                                data-testid="input-ytm" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="couponRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coupon Rate (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                value={field.value ?? ''}
                                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                placeholder="e.g., 4.50" 
                                data-testid="input-coupon-rate" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cleanPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clean Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                value={field.value ?? ''}
                                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                placeholder="e.g., 98.50" 
                                data-testid="input-clean-price" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="maturityDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maturity Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-maturity-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isPerpetual"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 pt-8">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="!mt-0">Perpetual (No Maturity)</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="creditRatingDisplay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Rating</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., A1 / A+" data-testid="input-rating" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {isProMode && (
                <TabsContent value="pricing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing Details</CardTitle>
                      <CardDescription>Detailed pricing and yield information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="dirtyPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirty Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  placeholder="e.g., 99.25"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accruedInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accrued Interest</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  placeholder="e.g., 0.75"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="currentYield"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Yield (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  placeholder="e.g., 4.75"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name="bidPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bid Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bidYield"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bid Yield (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="askPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ask Price</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="askYield"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ask Yield (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {isProMode && (
                <TabsContent value="cashflow" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Coupon & Cashflow</CardTitle>
                      <CardDescription>Payment schedule and frequency</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="couponFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coupon Frequency</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="annual">Annual</SelectItem>
                                  <SelectItem value="semi_annual">Semi-Annual</SelectItem>
                                  <SelectItem value="quarterly">Quarterly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="at_maturity">At Maturity</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nextCouponDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Next Coupon Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="principalRepaymentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Principal Repayment</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bullet">Bullet</SelectItem>
                                  <SelectItem value="amortizing">Amortizing</SelectItem>
                                  <SelectItem value="sinking_fund">Sinking Fund</SelectItem>
                                  <SelectItem value="callable">Callable</SelectItem>
                                  <SelectItem value="perpetual">Perpetual</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {isProMode && (
                <TabsContent value="risk" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk & Credit Analysis</CardTitle>
                      <CardDescription>Duration, convexity, and risk notes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modified Duration</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="macaulayDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Macaulay Duration</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="convexity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Convexity</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="interestRateSensitivityNotes_en"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interest Rate Sensitivity Notes (EN)</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={3} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="interestRateSensitivityNotes_ar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interest Rate Sensitivity Notes (AR)</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={3} dir="rtl" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {isProMode && (
                <TabsContent value="liquidity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Liquidity & Trading</CardTitle>
                      <CardDescription>Trading information and exit conditions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="liquidityScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Liquidity Score (1-10)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1}
                                  max={10}
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="avgDailyVolume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Avg Daily Volume</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="tradableOnPlatform"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2 pt-8">
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="!mt-0">Tradable on Platform</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Modules</CardTitle>
                    <CardDescription>Editorial content for the bond page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="heroSummary_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hero Summary (English)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} placeholder="Brief summary for the hero section..." data-testid="input-hero-en" />
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
                              <Textarea {...field} rows={4} dir="rtl" placeholder="ملخص قصير..." data-testid="input-hero-ar" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="howItWorks_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How It Works (English)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Explain how the bond works..." />
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
                              <Textarea {...field} rows={6} dir="rtl" placeholder="شرح كيفية عمل السند..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="riskDisclosure_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Disclosure (English)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} placeholder="Risk disclosure text..." data-testid="input-risk-disclosure-en" />
                            </FormControl>
                            <FormDescription>Required for compliance</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="riskDisclosure_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Disclosure (Arabic)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} dir="rtl" placeholder="إفصاح المخاطر..." data-testid="input-risk-disclosure-ar" />
                            </FormControl>
                            <FormDescription>مطلوب للامتثال</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings (English)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seo_en.metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SEO title for search engines" data-testid="input-seo-title-en" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seo_en.metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="SEO description for search engines" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seo_en.indexable"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="!mt-0">Allow search engine indexing</FormLabel>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings (Arabic)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seo_ar.metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input {...field} dir="rtl" placeholder="عنوان SEO" data-testid="input-seo-title-ar" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seo_ar.metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} dir="rtl" placeholder="وصف SEO" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seo_ar.indexable"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="!mt-0">السماح بالفهرسة</FormLabel>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Compliance Status
                    </CardTitle>
                    <CardDescription>Content compliance check for regulatory requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bondPage && (
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        {bondPage.complianceStatus === 'pass' && (
                          <>
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                            <div>
                              <p className="font-medium text-green-700">Compliance Passed</p>
                              <p className="text-sm text-muted-foreground">
                                Last scanned: {bondPage.lastComplianceScanAt ? new Date(bondPage.lastComplianceScanAt).toLocaleString() : 'Never'}
                              </p>
                            </div>
                          </>
                        )}
                        {bondPage.complianceStatus === 'fail' && (
                          <>
                            <XCircle className="h-8 w-8 text-red-500" />
                            <div>
                              <p className="font-medium text-red-700">Compliance Issues Found</p>
                              <p className="text-sm text-muted-foreground">
                                {bondPage.blockedKeywordsHit?.length || 0} violations detected
                              </p>
                            </div>
                          </>
                        )}
                        {bondPage.complianceStatus === 'pending' && (
                          <>
                            <AlertTriangle className="h-8 w-8 text-yellow-500" />
                            <div>
                              <p className="font-medium text-yellow-700">Pending Review</p>
                              <p className="text-sm text-muted-foreground">
                                Run a compliance scan to check content
                              </p>
                            </div>
                          </>
                        )}
                        {bondPage.complianceStatus === 'override' && (
                          <>
                            <Settings2 className="h-8 w-8 text-blue-500" />
                            <div>
                              <p className="font-medium text-blue-700">Override Applied</p>
                              <p className="text-sm text-muted-foreground">
                                Reason: {bondPage.complianceOverrideReason || 'Not specified'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {!bondPage && (
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium text-yellow-700">Save First</p>
                          <p className="text-sm text-muted-foreground">
                            Save the bond page to enable compliance scanning
                          </p>
                        </div>
                      </div>
                    )}

                    {bondPage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => complianceScanMutation.mutate()}
                        disabled={complianceScanMutation.isPending}
                        data-testid="button-run-compliance-scan"
                      >
                        {complianceScanMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4 mr-2" />
                        )}
                        Run Compliance Scan
                      </Button>
                    )}

                    <div className="text-sm text-muted-foreground">
                      <p>Publishing is blocked unless:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Compliance status is "Pass" or has an approved override</li>
                        <li>Required fields are complete (title, slug, currency, issuer name)</li>
                        <li>Risk disclosure is present</li>
                      </ul>
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
