import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MousePointer, 
  QrCode, 
  Smartphone, 
  TrendingUp, 
  RefreshCw,
  ExternalLink,
  BarChart3,
  Eye
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import type { CallToAction, CTAEvent } from '@shared/schema';

interface CTAPerformance {
  ctaKey: string;
  clicks: number;
  qrViews: number;
  storeRedirects: number;
}

export default function AdminCTAPerformance() {
  const { data: ctas = [], isLoading: ctasLoading } = useQuery<CallToAction[]>({
    queryKey: ['/api/ctas'],
  });

  const { data: performance = [], isLoading: perfLoading, refetch: refetchPerformance } = useQuery<CTAPerformance[]>({
    queryKey: ['/api/cta-performance'],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<CTAEvent[]>({
    queryKey: ['/api/cta-events'],
  });

  const isLoading = ctasLoading || perfLoading || eventsLoading;

  const getCTADetails = (key: string) => {
    return ctas.find(cta => cta.key === key);
  };

  const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
  const totalQRViews = performance.reduce((sum, p) => sum + p.qrViews, 0);
  const totalStoreRedirects = performance.reduce((sum, p) => sum + p.storeRedirects, 0);

  const topPerformers = [...performance]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const eventsByOS = events.reduce((acc, e) => {
    if (e.os) {
      acc[e.os] = (acc[e.os] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const eventsByDevice = events.reduce((acc, e) => {
    acc[e.device] = (acc[e.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/cta-performance'] });
    queryClient.invalidateQueries({ queryKey: ['/api/cta-events'] });
    refetchPerformance();
  };

  const getCTACategory = (key: string): string => {
    if (key.startsWith('discover.')) return 'Discover';
    if (key.startsWith('mobile_install.')) return 'Mobile Install';
    if (key.startsWith('main.')) return 'Main';
    if (key.startsWith('stock.')) return 'Stock';
    if (key.startsWith('landing.')) return 'Landing Page';
    return 'Other';
  };

  const getActionTypeBadge = (actionType?: string) => {
    switch (actionType) {
      case 'link':
        return <Badge variant="outline" className="text-blue-600 border-blue-300">Link</Badge>;
      case 'qr_modal':
        return <Badge variant="outline" className="text-purple-600 border-purple-300">QR Modal</Badge>;
      case 'os_store_redirect':
        return <Badge variant="outline" className="text-green-600 border-green-300">Store Redirect</Badge>;
      case 'scroll_anchor':
        return <Badge variant="outline" className="text-amber-600 border-amber-300">Scroll</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">CTA Performance</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CTA Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid="text-total-clicks">{totalClicks}</p>
              <p className="text-xs text-muted-foreground">All CTAs combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Modal Views</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid="text-qr-views">{totalQRViews}</p>
              <p className="text-xs text-muted-foreground">Desktop users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Redirects</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid="text-store-redirects">{totalStoreRedirects}</p>
              <p className="text-xs text-muted-foreground">Mobile app installs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active CTAs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid="text-active-ctas">
                {ctas.filter(c => c.enabled).length}
              </p>
              <p className="text-xs text-muted-foreground">
                {ctas.length} total registered
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Performers</CardTitle>
              <CardDescription>CTAs with most clicks</CardDescription>
            </CardHeader>
            <CardContent>
              {topPerformers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No data yet. CTAs will appear here once clicked.
                </p>
              ) : (
                <div className="space-y-3">
                  {topPerformers.map((p, idx) => {
                    const ctaDetails = getCTADetails(p.ctaKey);
                    return (
                      <div 
                        key={p.ctaKey} 
                        className="flex items-center justify-between"
                        data-testid={`row-top-cta-${idx}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-muted-foreground w-6">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[180px]">
                              {ctaDetails?.text_en || p.ctaKey}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getCTACategory(p.ctaKey)}
                            </p>
                          </div>
                        </div>
                        <Badge>{p.clicks}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">By Device</CardTitle>
              <CardDescription>Click distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(eventsByDevice).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{device}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
                {Object.keys(eventsByDevice).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No events recorded yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">By OS (Mobile)</CardTitle>
              <CardDescription>Store redirect distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(eventsByOS).map(([os, count]) => (
                  <div key={os} className="flex items-center justify-between">
                    <span className="text-sm uppercase">{os}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
                {Object.keys(eventsByOS).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No mobile events recorded yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all-ctas">All CTAs</TabsTrigger>
            <TabsTrigger value="discover" data-testid="tab-discover">Discover</TabsTrigger>
            <TabsTrigger value="stock" data-testid="tab-stock">Stock Pages</TabsTrigger>
            <TabsTrigger value="landing" data-testid="tab-landing">Landing Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CTA Key</TableHead>
                      <TableHead>Text (EN)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Clicks</TableHead>
                      <TableHead className="text-center">QR Views</TableHead>
                      <TableHead className="text-center">Store Redirects</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ctas.map(cta => {
                      const perf = performance.find(p => p.ctaKey === cta.key);
                      return (
                        <TableRow key={cta.id} data-testid={`row-cta-${cta.id}`}>
                          <TableCell className="font-mono text-xs">{cta.key}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{cta.text_en}</TableCell>
                          <TableCell>{getActionTypeBadge(cta.actionType)}</TableCell>
                          <TableCell className="text-center">{perf?.clicks || 0}</TableCell>
                          <TableCell className="text-center">{perf?.qrViews || 0}</TableCell>
                          <TableCell className="text-center">{perf?.storeRedirects || 0}</TableCell>
                          <TableCell>
                            <Badge variant={cta.enabled ? 'default' : 'secondary'}>
                              {cta.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {ctas.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No CTAs registered yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="mt-4">
            <CTATable 
              ctas={ctas.filter(c => c.key.startsWith('discover.'))} 
              performance={performance}
              getActionTypeBadge={getActionTypeBadge}
            />
          </TabsContent>

          <TabsContent value="stock" className="mt-4">
            <CTATable 
              ctas={ctas.filter(c => c.key.startsWith('stock.') || c.key.startsWith('main.'))} 
              performance={performance}
              getActionTypeBadge={getActionTypeBadge}
            />
          </TabsContent>

          <TabsContent value="landing" className="mt-4">
            <CTATable 
              ctas={ctas.filter(c => c.key.startsWith('landing.'))} 
              performance={performance}
              getActionTypeBadge={getActionTypeBadge}
            />
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Events</CardTitle>
            <CardDescription>Last 20 CTA events</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CTA Key</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.slice(0, 20).map((event, idx) => (
                  <TableRow key={event.id || idx} data-testid={`row-event-${idx}`}>
                    <TableCell className="font-mono text-xs">{event.ctaKey}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                      {event.pagePath}
                    </TableCell>
                    <TableCell className="capitalize">{event.device}</TableCell>
                    <TableCell className="uppercase">{event.os || '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No events recorded yet. Events will appear as users interact with CTAs.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function CTATable({ 
  ctas, 
  performance,
  getActionTypeBadge,
}: { 
  ctas: CallToAction[]; 
  performance: CTAPerformance[];
  getActionTypeBadge: (type?: string) => JSX.Element;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CTA Key</TableHead>
              <TableHead>Text (EN)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead className="text-center">QR Views</TableHead>
              <TableHead className="text-center">Store Redirects</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ctas.map(cta => {
              const perf = performance.find(p => p.ctaKey === cta.key);
              return (
                <TableRow key={cta.id}>
                  <TableCell className="font-mono text-xs">{cta.key}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{cta.text_en}</TableCell>
                  <TableCell>{getActionTypeBadge(cta.actionType)}</TableCell>
                  <TableCell className="text-center">{perf?.clicks || 0}</TableCell>
                  <TableCell className="text-center">{perf?.qrViews || 0}</TableCell>
                  <TableCell className="text-center">{perf?.storeRedirects || 0}</TableCell>
                  <TableCell>
                    <Badge variant={cta.enabled ? 'default' : 'secondary'}>
                      {cta.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {ctas.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No CTAs in this category.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
