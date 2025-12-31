import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Settings, 
  TrendingUp, 
  FileText, 
  Globe, 
  Smartphone, 
  ExternalLink,
  Activity,
  Eye,
  MousePointer,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { AnalyticsSettings, CmsWebEvent } from '@shared/schema';

export default function AdminAnalytics() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');

  const { data: settings, isLoading: settingsLoading } = useQuery<AnalyticsSettings>({
    queryKey: ['/api/admin/analytics/settings'],
  });

  const { data: events, isLoading: eventsLoading } = useQuery<CmsWebEvent[]>({
    queryKey: ['/api/admin/events'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<AnalyticsSettings>) => {
      return apiRequest('PUT', '/api/admin/analytics/settings', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics/settings'] });
      toast({ title: 'Settings updated', description: 'Analytics settings have been saved.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update settings.', variant: 'destructive' });
    },
  });

  const stockEvents = events?.filter(e => e.pagePath.startsWith('/stocks/')) ?? [];
  const blogEvents = events?.filter(e => e.pagePath.startsWith('/blog/')) ?? [];
  const bannerEvents = events?.filter(e => e.eventType === 'banner_view' || e.eventType === 'banner_click') ?? [];
  const installEvents = events?.filter(e => e.eventType === 'install_banner_view' || e.eventType === 'install_banner_click' || e.eventType === 'adjust_outbound_click') ?? [];

  const eventsByType = events?.reduce((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Analytics</h1>
          <p className="text-muted-foreground mt-1">Content and conversion analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32" data-testid="select-date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="28d">Last 28 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stocks" data-testid="tab-stocks">
            <TrendingUp className="h-4 w-4 mr-2" />
            Stocks
          </TabsTrigger>
          <TabsTrigger value="learn" data-testid="tab-learn">
            <FileText className="h-4 w-4 mr-2" />
            Learn
          </TabsTrigger>
          <TabsTrigger value="acquisition" data-testid="tab-acquisition">
            <Globe className="h-4 w-4 mr-2" />
            Acquisition
          </TabsTrigger>
          <TabsTrigger value="banners" data-testid="tab-banners">
            <BarChart3 className="h-4 w-4 mr-2" />
            Banners
          </TabsTrigger>
          <TabsTrigger value="app-install" data-testid="tab-app-install">
            <Smartphone className="h-4 w-4 mr-2" />
            App Install
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-brand" />
                  <span className="text-xs text-muted-foreground">Page Views</span>
                </div>
                <p className="text-2xl font-bold">{eventsByType['page_view'] ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointer className="h-4 w-4 text-success" />
                  <span className="text-xs text-muted-foreground">CTA Clicks</span>
                </div>
                <p className="text-2xl font-bold">{eventsByType['cta_click'] ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Banner Clicks</span>
                </div>
                <p className="text-2xl font-bold">{eventsByType['banner_click'] ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Download className="h-4 w-4 text-brand" />
                  <span className="text-xs text-muted-foreground">App Clicks</span>
                </div>
                <p className="text-2xl font-bold">{eventsByType['adjust_outbound_click'] ?? 0}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest tracked events across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Page Path</TableHead>
                      <TableHead>Locale</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.slice(0, 10).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant="outline" className="no-default-hover-elevate">{event.eventType}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{event.pagePath}</TableCell>
                        <TableCell>{event.locale.toUpperCase()}</TableCell>
                        <TableCell>{event.deviceCategory}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(event.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Pages Performance</CardTitle>
              <CardDescription>Events on /stocks/* pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stockEvents.filter(e => e.eventType === 'page_view').length}</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stockEvents.filter(e => e.eventType === 'cta_click').length}</p>
                  <p className="text-sm text-muted-foreground">CTA Clicks</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{stockEvents.filter(e => e.eventType === 'adjust_outbound_click').length}</p>
                  <p className="text-sm text-muted-foreground">Adjust Clicks</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockEvents.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-sm">{event.pagePath}</TableCell>
                      <TableCell><Badge variant="outline" className="no-default-hover-elevate">{event.eventType}</Badge></TableCell>
                      <TableCell>{event.deviceCategory}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learn" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog/Learn Performance</CardTitle>
              <CardDescription>Events on /blog/* pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{blogEvents.filter(e => e.eventType === 'page_view').length}</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{blogEvents.filter(e => e.eventType === 'newsletter_submit').length}</p>
                  <p className="text-sm text-muted-foreground">Newsletter Signups</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{blogEvents.filter(e => e.eventType === 'cta_click').length}</p>
                  <p className="text-sm text-muted-foreground">CTA Clicks</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Locale</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogEvents.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-sm">{event.pagePath}</TableCell>
                      <TableCell><Badge variant="outline" className="no-default-hover-elevate">{event.eventType}</Badge></TableCell>
                      <TableCell>{event.locale.toUpperCase()}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquisition" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Acquisition</CardTitle>
              <CardDescription>Device and locale breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">By Device</h4>
                  <div className="space-y-2">
                    {['mobile', 'desktop', 'tablet'].map(device => {
                      const count = events?.filter(e => e.deviceCategory === device).length ?? 0;
                      const total = events?.length ?? 1;
                      const pct = ((count / total) * 100).toFixed(1);
                      return (
                        <div key={device} className="flex items-center justify-between">
                          <span className="capitalize">{device}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">By Locale</h4>
                  <div className="space-y-2">
                    {['en', 'ar'].map(locale => {
                      const count = events?.filter(e => e.locale === locale).length ?? 0;
                      const total = events?.length ?? 1;
                      const pct = ((count / total) * 100).toFixed(1);
                      return (
                        <div key={locale} className="flex items-center justify-between">
                          <span className="uppercase">{locale}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Banner Events</CardTitle>
              <CardDescription>Views and clicks on promotional banners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{bannerEvents.filter(e => e.eventType === 'banner_view').length}</p>
                  <p className="text-sm text-muted-foreground">Banner Views</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{bannerEvents.filter(e => e.eventType === 'banner_click').length}</p>
                  <p className="text-sm text-muted-foreground">Banner Clicks</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner ID</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Page</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannerEvents.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.metaJson?.bannerId ?? '-'}</TableCell>
                      <TableCell><Badge variant="outline" className="no-default-hover-elevate">{event.eventType}</Badge></TableCell>
                      <TableCell>{event.metaJson?.bannerPlacement ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{event.pagePath}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app-install" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>App Install Funnel</CardTitle>
              <CardDescription>Mobile install banner and Adjust outbound clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{installEvents.filter(e => e.eventType === 'install_banner_view').length}</p>
                  <p className="text-sm text-muted-foreground">Banner Views</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{installEvents.filter(e => e.eventType === 'install_banner_click').length}</p>
                  <p className="text-sm text-muted-foreground">Banner Clicks</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{installEvents.filter(e => e.eventType === 'adjust_outbound_click').length}</p>
                  <p className="text-sm text-muted-foreground">Adjust Outbound</p>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">By OS</h4>
                <div className="flex gap-4">
                  <Badge variant="outline" className="no-default-hover-elevate">
                    iOS: {installEvents.filter(e => e.metaJson?.os === 'ios').length}
                  </Badge>
                  <Badge variant="outline" className="no-default-hover-elevate">
                    Android: {installEvents.filter(e => e.metaJson?.os === 'android').length}
                  </Badge>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Source Page</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installEvents.slice(0, 10).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell><Badge variant="outline" className="no-default-hover-elevate">{event.eventType}</Badge></TableCell>
                      <TableCell>{event.metaJson?.os ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{event.pagePath}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>GA4 Integration Settings</CardTitle>
              <CardDescription>Connect Google Analytics 4 for enhanced reporting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settingsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ga4-enabled">Enable GA4 Integration</Label>
                      <p className="text-sm text-muted-foreground">Connect to Google Analytics for enhanced analytics</p>
                    </div>
                    <Switch
                      id="ga4-enabled"
                      checked={settings?.enabled ?? false}
                      onCheckedChange={(checked) => updateSettingsMutation.mutate({ enabled: checked })}
                      data-testid="switch-ga4-enabled"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ga4-property">GA4 Property ID</Label>
                    <Input
                      id="ga4-property"
                      placeholder="e.g., 123456789"
                      defaultValue={settings?.ga4PropertyId ?? ''}
                      onBlur={(e) => updateSettingsMutation.mutate({ ga4PropertyId: e.target.value })}
                      data-testid="input-ga4-property"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your GA4 property ID to connect. You can find this in your GA4 admin settings.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Authentication Method</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Current: {settings?.authType === 'service_account' ? 'Service Account' : settings?.authType === 'oauth' ? 'OAuth' : 'Not configured'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To enable GA4 data fetching, you need to either:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
                      <li>Upload a service account JSON key (set as GA4_SERVICE_ACCOUNT_KEY environment variable)</li>
                      <li>Configure OAuth with Google Sign-In (coming soon)</li>
                    </ul>
                  </div>

                  {settings?.lastSyncAt && (
                    <p className="text-sm text-muted-foreground">
                      Last synced: {new Date(settings.lastSyncAt).toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
