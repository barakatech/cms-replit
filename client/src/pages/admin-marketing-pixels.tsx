import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Activity,
  Zap
} from 'lucide-react';
import { SiMeta, SiTiktok, SiSnapchat, SiGoogleads } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { MarketingPixel, PixelEventMap, PixelPlatform, CmsEventName } from '@shared/schema';
import { DEFAULT_PIXEL_EVENT_MAPPINGS } from '@shared/schema';

interface PixelFormData {
  name: string;
  platform: PixelPlatform;
  pixelId: string;
  enabled: boolean;
  testMode: boolean;
  locales: string;
  devices: string;
  pages: string;
}

interface EventMapFormData {
  cmsEvent: CmsEventName;
  pixelEventName: string;
  enabled: boolean;
  customParams: string;
}

const CMS_EVENTS: { value: CmsEventName; label: string }[] = [
  { value: 'page_view', label: 'Page View' },
  { value: 'banner_impression', label: 'Banner Impression' },
  { value: 'banner_click', label: 'Banner Click' },
  { value: 'newsletter_submit', label: 'Newsletter Submit' },
  { value: 'lead_submit', label: 'Lead Submit' },
  { value: 'app_install_click', label: 'App Install Click' },
];

const PLATFORM_ICONS: Record<PixelPlatform, JSX.Element> = {
  meta: <SiMeta className="h-4 w-4" />,
  tiktok: <SiTiktok className="h-4 w-4" />,
  snapchat: <SiSnapchat className="h-4 w-4" />,
  google_ads: <SiGoogleads className="h-4 w-4" />,
};

const PLATFORM_LABELS: Record<PixelPlatform, string> = {
  meta: 'Meta (Facebook)',
  tiktok: 'TikTok',
  snapchat: 'Snapchat',
  google_ads: 'Google Ads',
};

export default function AdminMarketingPixels() {
  const { toast } = useToast();
  const [editingPixel, setEditingPixel] = useState<MarketingPixel | null>(null);
  const [isPixelDialogOpen, setIsPixelDialogOpen] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<MarketingPixel | null>(null);
  const [isEventMapDialogOpen, setIsEventMapDialogOpen] = useState(false);
  const [editingEventMap, setEditingEventMap] = useState<PixelEventMap | null>(null);

  const pixelForm = useForm<PixelFormData>({
    defaultValues: {
      name: '',
      platform: 'meta',
      pixelId: '',
      enabled: true,
      testMode: false,
      locales: 'en, ar',
      devices: 'mobile, desktop, tablet',
      pages: '*',
    },
  });

  const eventMapForm = useForm<EventMapFormData>({
    defaultValues: {
      cmsEvent: 'page_view',
      pixelEventName: '',
      enabled: true,
      customParams: '',
    },
  });

  const { data: pixels, isLoading } = useQuery<MarketingPixel[]>({
    queryKey: ['/api/admin/marketing-pixels'],
  });

  const { data: eventMaps } = useQuery<PixelEventMap[]>({
    queryKey: ['/api/admin/pixel-event-maps'],
  });

  const createPixelMutation = useMutation({
    mutationFn: async (pixel: Partial<MarketingPixel>) => {
      return apiRequest('POST', '/api/admin/marketing-pixels', pixel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-pixels'] });
      setIsPixelDialogOpen(false);
      setEditingPixel(null);
      pixelForm.reset();
      toast({ title: 'Pixel created', description: 'Marketing pixel has been created.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create pixel.', variant: 'destructive' });
    },
  });

  const updatePixelMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketingPixel> & { id: string }) => {
      return apiRequest('PUT', `/api/admin/marketing-pixels/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-pixels'] });
      setIsPixelDialogOpen(false);
      setEditingPixel(null);
      pixelForm.reset();
      toast({ title: 'Pixel updated', description: 'Marketing pixel has been updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update pixel.', variant: 'destructive' });
    },
  });

  const deletePixelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/marketing-pixels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/marketing-pixels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pixel-event-maps'] });
      toast({ title: 'Pixel deleted', description: 'Marketing pixel has been deleted.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete pixel.', variant: 'destructive' });
    },
  });

  const createEventMapMutation = useMutation({
    mutationFn: async (mapping: Partial<PixelEventMap>) => {
      return apiRequest('POST', '/api/admin/pixel-event-maps', mapping);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pixel-event-maps'] });
      setIsEventMapDialogOpen(false);
      setEditingEventMap(null);
      eventMapForm.reset();
      toast({ title: 'Event mapping created', description: 'Pixel event mapping has been created.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create event mapping.', variant: 'destructive' });
    },
  });

  const updateEventMapMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PixelEventMap> & { id: string }) => {
      return apiRequest('PUT', `/api/admin/pixel-event-maps/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pixel-event-maps'] });
      setIsEventMapDialogOpen(false);
      setEditingEventMap(null);
      eventMapForm.reset();
      toast({ title: 'Event mapping updated', description: 'Pixel event mapping has been updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update event mapping.', variant: 'destructive' });
    },
  });

  const deleteEventMapMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/pixel-event-maps/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pixel-event-maps'] });
      toast({ title: 'Event mapping deleted', description: 'Pixel event mapping has been deleted.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete event mapping.', variant: 'destructive' });
    },
  });

  const togglePixelEnabled = async (pixel: MarketingPixel) => {
    updatePixelMutation.mutate({ id: pixel.id, enabled: !pixel.enabled });
  };

  const handlePixelSubmit = (data: PixelFormData) => {
    const pixelData = {
      name: data.name,
      platform: data.platform,
      pixelId: data.pixelId,
      enabled: data.enabled,
      testMode: data.testMode,
      locales: data.locales.split(',').map(l => l.trim()) as ('en' | 'ar')[],
      devices: data.devices.split(',').map(d => d.trim()) as ('mobile' | 'desktop' | 'tablet')[],
      pages: data.pages.split(',').map(p => p.trim()),
    };

    if (editingPixel) {
      updatePixelMutation.mutate({ id: editingPixel.id, ...pixelData });
    } else {
      createPixelMutation.mutate(pixelData);
    }
  };

  const handleEventMapSubmit = (data: EventMapFormData) => {
    if (!selectedPixel) return;

    let customParams: Record<string, string> | undefined;
    if (data.customParams.trim()) {
      try {
        customParams = JSON.parse(data.customParams);
      } catch {
        toast({ title: 'Error', description: 'Invalid JSON for custom parameters.', variant: 'destructive' });
        return;
      }
    }

    const mappingData = {
      pixelId: selectedPixel.id,
      cmsEvent: data.cmsEvent,
      pixelEventName: data.pixelEventName,
      enabled: data.enabled,
      customParams,
    };

    if (editingEventMap) {
      updateEventMapMutation.mutate({ id: editingEventMap.id, ...mappingData });
    } else {
      createEventMapMutation.mutate(mappingData);
    }
  };

  const openCreatePixelDialog = () => {
    setEditingPixel(null);
    pixelForm.reset({
      name: '',
      platform: 'meta',
      pixelId: '',
      enabled: true,
      testMode: false,
      locales: 'en, ar',
      devices: 'mobile, desktop, tablet',
      pages: '*',
    });
    setIsPixelDialogOpen(true);
  };

  const openEditPixelDialog = (pixel: MarketingPixel) => {
    setEditingPixel(pixel);
    pixelForm.reset({
      name: pixel.name,
      platform: pixel.platform,
      pixelId: pixel.pixelId,
      enabled: pixel.enabled,
      testMode: pixel.testMode,
      locales: pixel.locales.join(', '),
      devices: pixel.devices.join(', '),
      pages: pixel.pages.join(', '),
    });
    setIsPixelDialogOpen(true);
  };

  const openCreateEventMapDialog = () => {
    if (!selectedPixel) return;
    setEditingEventMap(null);
    const defaultEvent = DEFAULT_PIXEL_EVENT_MAPPINGS[selectedPixel.platform]?.page_view ?? '';
    eventMapForm.reset({
      cmsEvent: 'page_view',
      pixelEventName: defaultEvent,
      enabled: true,
      customParams: '',
    });
    setIsEventMapDialogOpen(true);
  };

  const openEditEventMapDialog = (mapping: PixelEventMap) => {
    setEditingEventMap(mapping);
    eventMapForm.reset({
      cmsEvent: mapping.cmsEvent,
      pixelEventName: mapping.pixelEventName,
      enabled: mapping.enabled,
      customParams: mapping.customParams ? JSON.stringify(mapping.customParams, null, 2) : '',
    });
    setIsEventMapDialogOpen(true);
  };

  const getPixelEventMaps = (pixelId: string) => {
    return eventMaps?.filter(m => m.pixelId === pixelId) ?? [];
  };

  const watchedPlatform = pixelForm.watch('platform');
  const watchedCmsEvent = eventMapForm.watch('cmsEvent');

  const handlePlatformChange = (value: PixelPlatform) => {
    pixelForm.setValue('platform', value);
  };

  const handleCmsEventChange = (value: CmsEventName) => {
    eventMapForm.setValue('cmsEvent', value);
    if (selectedPixel) {
      const defaultEvent = DEFAULT_PIXEL_EVENT_MAPPINGS[selectedPixel.platform]?.[value] ?? '';
      eventMapForm.setValue('pixelEventName', defaultEvent);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Marketing Pixels</h1>
          <p className="text-muted-foreground mt-1">Configure tracking pixels for Meta, TikTok, Snapchat, and Google Ads</p>
        </div>
        <Dialog open={isPixelDialogOpen} onOpenChange={setIsPixelDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreatePixelDialog} data-testid="button-create-pixel">
              <Plus className="h-4 w-4 mr-2" />
              Add Pixel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPixel ? 'Edit Pixel' : 'Add Pixel'}</DialogTitle>
            </DialogHeader>
            <Form {...pixelForm}>
              <form onSubmit={pixelForm.handleSubmit(handlePixelSubmit)} className="space-y-4">
                <FormField
                  control={pixelForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pixel Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Meta - Production" data-testid="input-pixel-name" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={pixelForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={(v) => handlePlatformChange(v as PixelPlatform)} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-platform">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="meta">
                            <div className="flex items-center gap-2">
                              <SiMeta className="h-4 w-4" />
                              Meta (Facebook)
                            </div>
                          </SelectItem>
                          <SelectItem value="tiktok">
                            <div className="flex items-center gap-2">
                              <SiTiktok className="h-4 w-4" />
                              TikTok
                            </div>
                          </SelectItem>
                          <SelectItem value="snapchat">
                            <div className="flex items-center gap-2">
                              <SiSnapchat className="h-4 w-4" />
                              Snapchat
                            </div>
                          </SelectItem>
                          <SelectItem value="google_ads">
                            <div className="flex items-center gap-2">
                              <SiGoogleads className="h-4 w-4" />
                              Google Ads
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={pixelForm.control}
                  name="pixelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pixel ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your pixel/tag ID" data-testid="input-pixel-id" />
                      </FormControl>
                      <FormDescription>
                        {watchedPlatform === 'meta' && 'Facebook Pixel ID (e.g., 123456789012345)'}
                        {watchedPlatform === 'tiktok' && 'TikTok Pixel ID (e.g., C12345ABCDEF)'}
                        {watchedPlatform === 'snapchat' && 'Snapchat Pixel ID'}
                        {watchedPlatform === 'google_ads' && 'Google Ads Conversion ID (e.g., AW-123456789)'}
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={pixelForm.control}
                    name="locales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Locales</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="en, ar" data-testid="input-locales" />
                        </FormControl>
                        <FormDescription>Comma-separated</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pixelForm.control}
                    name="devices"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Devices</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="mobile, desktop, tablet" data-testid="input-devices" />
                        </FormControl>
                        <FormDescription>Comma-separated</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={pixelForm.control}
                  name="pages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Patterns</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="*, /stocks/*, /blog/*" data-testid="input-pages" />
                      </FormControl>
                      <FormDescription>Use * for all pages, or specify patterns like /stocks/*</FormDescription>
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-6">
                  <FormField
                    control={pixelForm.control}
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
                  <FormField
                    control={pixelForm.control}
                    name="testMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Test Mode</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsPixelDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-submit-pixel">
                    {editingPixel ? 'Update Pixel' : 'Add Pixel'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Pixels</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-pixels">
              {pixels?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-active-pixels">
              {pixels?.filter(p => p.enabled).length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">Test Mode</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-test-mode-pixels">
              {pixels?.filter(p => p.testMode).length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Event Mappings</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-event-mappings">
              {eventMaps?.length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pixels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pixels">Pixels</TabsTrigger>
          <TabsTrigger value="event-mappings" disabled={!selectedPixel}>
            Event Mappings {selectedPixel && `(${selectedPixel.name})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pixels">
          <Card>
            <CardHeader>
              <CardTitle>Configured Pixels</CardTitle>
              <CardDescription>Click on a pixel to configure its event mappings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : pixels?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Pixel ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mappings</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pixels.map((pixel) => (
                      <TableRow 
                        key={pixel.id} 
                        data-testid={`row-pixel-${pixel.id}`}
                        className={`cursor-pointer ${selectedPixel?.id === pixel.id ? 'bg-muted/50' : ''}`}
                        onClick={() => setSelectedPixel(pixel)}
                      >
                        <TableCell className="font-medium">{pixel.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {PLATFORM_ICONS[pixel.platform]}
                            <span>{PLATFORM_LABELS[pixel.platform]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{pixel.pixelId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={pixel.enabled ? 'default' : 'secondary'}
                              className={`no-default-hover-elevate ${pixel.enabled ? 'bg-brand' : ''}`}
                            >
                              {pixel.enabled ? 'Active' : 'Inactive'}
                            </Badge>
                            {pixel.testMode && (
                              <Badge variant="outline" className="no-default-hover-elevate">
                                Test
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getPixelEventMaps(pixel.id).length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); togglePixelEnabled(pixel); }}
                              data-testid={`button-toggle-pixel-${pixel.id}`}
                            >
                              <Activity className={`h-4 w-4 ${pixel.enabled ? 'text-brand' : 'text-muted-foreground'}`} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); openEditPixelDialog(pixel); }}
                              data-testid={`button-edit-pixel-${pixel.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this pixel? This will also remove all event mappings.')) {
                                  deletePixelMutation.mutate(pixel.id);
                                }
                              }}
                              data-testid={`button-delete-pixel-${pixel.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No marketing pixels configured yet.</p>
                  <Button className="mt-4" onClick={openCreatePixelDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Pixel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="event-mappings">
          {selectedPixel && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {PLATFORM_ICONS[selectedPixel.platform]}
                    Event Mappings for {selectedPixel.name}
                  </CardTitle>
                  <CardDescription>Map CMS events to pixel events</CardDescription>
                </div>
                <Dialog open={isEventMapDialogOpen} onOpenChange={setIsEventMapDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateEventMapDialog} data-testid="button-add-event-map">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Mapping
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingEventMap ? 'Edit Event Mapping' : 'Add Event Mapping'}</DialogTitle>
                    </DialogHeader>
                    <Form {...eventMapForm}>
                      <form onSubmit={eventMapForm.handleSubmit(handleEventMapSubmit)} className="space-y-4">
                        <FormField
                          control={eventMapForm.control}
                          name="cmsEvent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CMS Event</FormLabel>
                              <Select onValueChange={(v) => handleCmsEventChange(v as CmsEventName)} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-cms-event">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CMS_EVENTS.map(event => (
                                    <SelectItem key={event.value} value={event.value}>
                                      {event.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={eventMapForm.control}
                          name="pixelEventName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pixel Event Name</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-pixel-event-name" />
                              </FormControl>
                              <FormDescription>
                                Default: {DEFAULT_PIXEL_EVENT_MAPPINGS[selectedPixel.platform]?.[watchedCmsEvent] ?? 'N/A'}
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={eventMapForm.control}
                          name="customParams"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Parameters (JSON)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder='{"currency": "USD"}' data-testid="input-custom-params" />
                              </FormControl>
                              <FormDescription>Optional additional parameters to send with the event</FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={eventMapForm.control}
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
                          <Button type="button" variant="outline" onClick={() => setIsEventMapDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" data-testid="button-submit-event-map">
                            {editingEventMap ? 'Update Mapping' : 'Add Mapping'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {getPixelEventMaps(selectedPixel.id).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CMS Event</TableHead>
                        <TableHead>Pixel Event</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Custom Params</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPixelEventMaps(selectedPixel.id).map((mapping) => (
                        <TableRow key={mapping.id} data-testid={`row-event-map-${mapping.id}`}>
                          <TableCell className="font-medium">
                            {CMS_EVENTS.find(e => e.value === mapping.cmsEvent)?.label ?? mapping.cmsEvent}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{mapping.pixelEventName}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={mapping.enabled ? 'default' : 'secondary'}
                              className={`no-default-hover-elevate ${mapping.enabled ? 'bg-brand' : ''}`}
                            >
                              {mapping.enabled ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {mapping.customParams ? JSON.stringify(mapping.customParams) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditEventMapDialog(mapping)}
                                data-testid={`button-edit-event-map-${mapping.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm('Delete this event mapping?')) {
                                    deleteEventMapMutation.mutate(mapping.id);
                                  }
                                }}
                                data-testid={`button-delete-event-map-${mapping.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No event mappings configured for this pixel.</p>
                    <Button className="mt-4" onClick={openCreateEventMapDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event Mapping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
