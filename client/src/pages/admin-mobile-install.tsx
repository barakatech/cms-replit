import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { 
  Smartphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { MobileInstallBanner, BannerEvent } from '@shared/schema';

interface BannerFormData {
  name: string;
  enabled: boolean;
  locales: string;
  pages: string;
  styleVariant: 'top' | 'bottom';
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  ctaText_en: string;
  ctaText_ar: string;
  iconUrl: string;
  backgroundStyle: 'surface' | 'tertiary' | 'brand';
  adjustLinkIos: string;
  adjustLinkAndroid: string;
  frequencyCapDays: number;
  showAfterSeconds: number;
}

export default function AdminMobileInstall() {
  const { toast } = useToast();
  const [editingBanner, setEditingBanner] = useState<MobileInstallBanner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<BannerFormData>({
    defaultValues: {
      name: '',
      enabled: true,
      locales: 'en, ar',
      pages: '/stocks/*, /blog/*',
      styleVariant: 'bottom',
      title_en: '',
      title_ar: '',
      subtitle_en: '',
      subtitle_ar: '',
      ctaText_en: 'Download Now',
      ctaText_ar: 'حمّل الآن',
      iconUrl: '',
      backgroundStyle: 'brand',
      adjustLinkIos: '',
      adjustLinkAndroid: '',
      frequencyCapDays: 7,
      showAfterSeconds: 3,
    },
  });

  const { data: banners, isLoading } = useQuery<MobileInstallBanner[]>({
    queryKey: ['/api/admin/mobile-install-banners'],
  });

  const { data: bannerEvents } = useQuery<BannerEvent[]>({
    queryKey: ['/api/admin/events/banners'],
  });

  const createMutation = useMutation({
    mutationFn: async (banner: Partial<MobileInstallBanner>) => {
      return apiRequest('POST', '/api/admin/mobile-install-banners', banner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/mobile-install-banners'] });
      setIsDialogOpen(false);
      setEditingBanner(null);
      form.reset();
      toast({ title: 'Banner created', description: 'Mobile install banner has been created.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create banner.', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MobileInstallBanner> & { id: string }) => {
      return apiRequest('PUT', `/api/admin/mobile-install-banners/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/mobile-install-banners'] });
      setIsDialogOpen(false);
      setEditingBanner(null);
      form.reset();
      toast({ title: 'Banner updated', description: 'Mobile install banner has been updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update banner.', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/mobile-install-banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/mobile-install-banners'] });
      toast({ title: 'Banner deleted', description: 'Mobile install banner has been deleted.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete banner.', variant: 'destructive' });
    },
  });

  const toggleEnabled = async (banner: MobileInstallBanner) => {
    updateMutation.mutate({ id: banner.id, enabled: !banner.enabled });
  };

  const getBannerStats = (bannerId: string) => {
    const events = bannerEvents?.filter(e => e.bannerId === bannerId && e.bannerType === 'mobile_install') ?? [];
    const views = events.filter(e => e.eventType === 'view').length;
    const clicks = events.filter(e => e.eventType === 'click').length;
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';
    return { views, clicks, ctr };
  };

  const handleSubmit = (data: BannerFormData) => {
    const bannerData = {
      name: data.name,
      enabled: data.enabled,
      locales: data.locales.split(',').map(l => l.trim()) as ('en' | 'ar')[],
      pages: data.pages.split(',').map(p => p.trim()),
      styleVariant: data.styleVariant,
      title_en: data.title_en,
      title_ar: data.title_ar,
      subtitle_en: data.subtitle_en,
      subtitle_ar: data.subtitle_ar,
      ctaText_en: data.ctaText_en,
      ctaText_ar: data.ctaText_ar,
      iconUrl: data.iconUrl,
      backgroundStyle: data.backgroundStyle,
      adjustLinkIos: data.adjustLinkIos,
      adjustLinkAndroid: data.adjustLinkAndroid,
      frequencyCapDays: data.frequencyCapDays,
      showAfterSeconds: data.showAfterSeconds,
    };

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, ...bannerData });
    } else {
      createMutation.mutate(bannerData);
    }
  };

  const openCreateDialog = () => {
    setEditingBanner(null);
    form.reset({
      name: '',
      enabled: true,
      locales: 'en, ar',
      pages: '/stocks/*, /blog/*',
      styleVariant: 'bottom',
      title_en: '',
      title_ar: '',
      subtitle_en: '',
      subtitle_ar: '',
      ctaText_en: 'Download Now',
      ctaText_ar: 'حمّل الآن',
      iconUrl: '',
      backgroundStyle: 'brand',
      adjustLinkIos: '',
      adjustLinkAndroid: '',
      frequencyCapDays: 7,
      showAfterSeconds: 3,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: MobileInstallBanner) => {
    setEditingBanner(banner);
    form.reset({
      name: banner.name,
      enabled: banner.enabled,
      locales: banner.locales?.join(', ') ?? 'en, ar',
      pages: banner.pages?.join(', ') ?? '/stocks/*, /blog/*',
      styleVariant: banner.styleVariant,
      title_en: banner.title_en,
      title_ar: banner.title_ar,
      subtitle_en: banner.subtitle_en ?? '',
      subtitle_ar: banner.subtitle_ar ?? '',
      ctaText_en: banner.ctaText_en,
      ctaText_ar: banner.ctaText_ar,
      iconUrl: banner.iconUrl ?? '',
      backgroundStyle: banner.backgroundStyle,
      adjustLinkIos: banner.adjustLinkIos,
      adjustLinkAndroid: banner.adjustLinkAndroid,
      frequencyCapDays: banner.frequencyCapDays ?? 7,
      showAfterSeconds: banner.showAfterSeconds ?? 3,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Mobile Install Banners</h1>
          <p className="text-muted-foreground mt-1">Manage app install banners for mobile users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-create-banner">
              <Plus className="h-4 w-4 mr-2" />
              Create Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-banner-name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="styleVariant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-style-variant">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-title-en" />
                        </FormControl>
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
                          <Input {...field} dir="rtl" data-testid="input-title-ar" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subtitle_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle (English)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-subtitle-en" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle (Arabic)</FormLabel>
                        <FormControl>
                          <Input {...field} dir="rtl" data-testid="input-subtitle-ar" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ctaText_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text (English)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-cta-en" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ctaText_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text (Arabic)</FormLabel>
                        <FormControl>
                          <Input {...field} dir="rtl" data-testid="input-cta-ar" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="adjustLinkIos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjust Link (iOS)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://app.adjust.com/..." data-testid="input-adjust-ios" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adjustLinkAndroid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjust Link (Android)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://app.adjust.com/..." data-testid="input-adjust-android" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="locales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Locales (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-locales" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Pages (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-pages" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="backgroundStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Style</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-bg-style">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="brand">Brand (Green)</SelectItem>
                            <SelectItem value="surface">Surface</SelectItem>
                            <SelectItem value="tertiary">Tertiary</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequencyCapDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency Cap (days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 7)}
                            data-testid="input-frequency-cap" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showAfterSeconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Show After (seconds)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value) || 3)}
                            data-testid="input-show-after" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="iconUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." data-testid="input-icon-url" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Enabled</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-submit-banner">
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Views</span>
            </div>
            <p className="text-2xl font-bold">
              {bannerEvents?.filter(e => e.bannerType === 'mobile_install' && e.eventType === 'view').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Clicks</span>
            </div>
            <p className="text-2xl font-bold">
              {bannerEvents?.filter(e => e.bannerType === 'mobile_install' && e.eventType === 'click').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Active Banners</span>
            </div>
            <p className="text-2xl font-bold">
              {banners?.filter(b => b.enabled).length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
          <CardDescription>Manage mobile app install banners</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : banners?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => {
                  const stats = getBannerStats(banner.id);
                  return (
                    <TableRow key={banner.id} data-testid={`row-banner-${banner.id}`}>
                      <TableCell className="font-medium">{banner.name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={banner.enabled ? 'default' : 'secondary'}
                          className={`no-default-hover-elevate ${banner.enabled ? 'bg-brand' : ''}`}
                        >
                          {banner.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{banner.styleVariant}</TableCell>
                      <TableCell>{stats.views}</TableCell>
                      <TableCell>{stats.clicks}</TableCell>
                      <TableCell>{stats.ctr}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleEnabled(banner)}
                            data-testid={`button-toggle-${banner.id}`}
                          >
                            {banner.enabled ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(banner)}
                            data-testid={`button-edit-${banner.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(banner.id)}
                            data-testid={`button-delete-${banner.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mobile install banners yet</p>
              <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Banner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner Preview</CardTitle>
          <CardDescription>How the banner appears on mobile devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto">
            <div className="border rounded-lg overflow-hidden bg-muted">
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Mobile Screen Preview
              </div>
              {banners?.[0] && (
                <div className={`p-4 ${banners[0].backgroundStyle === 'brand' ? 'bg-brand text-white' : 'bg-card'} flex items-center gap-3`}>
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{banners[0].title_en}</p>
                    <p className="text-sm opacity-80 truncate">{banners[0].subtitle_en}</p>
                  </div>
                  <Button size="sm" variant={banners[0].backgroundStyle === 'brand' ? 'secondary' : 'default'}>
                    {banners[0].ctaText_en}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
