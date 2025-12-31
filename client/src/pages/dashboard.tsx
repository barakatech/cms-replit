import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Mail, 
  Smartphone, 
  BarChart3,
  FileText,
  AlertCircle,
  Plus,
  Settings,
  ExternalLink,
  Activity
} from 'lucide-react';
import type { DashboardSummary } from '../../../server/storage';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState('7d');

  const { data: summary, isLoading } = useQuery<DashboardSummary>({
    queryKey: ['/api/admin/analytics/summary', dateRange],
  });

  const kpiCards = [
    { label: 'Page Views', value: summary?.kpis.pageViews ?? 0, icon: Eye, color: 'text-brand' },
    { label: 'Unique Sessions', value: summary?.kpis.uniqueSessions ?? 0, icon: Users, color: 'text-primary' },
    { label: 'CTA Clicks', value: summary?.kpis.ctaClicks ?? 0, icon: MousePointer, color: 'text-success' },
    { label: 'Newsletter Signups', value: summary?.kpis.newsletterSignups ?? 0, icon: Mail, color: 'text-warning' },
    { label: 'Banner Clicks', value: summary?.kpis.bannerClicks ?? 0, icon: BarChart3, color: 'text-primary' },
    { label: 'App Installs', value: summary?.kpis.adjustOutboundClicks ?? 0, icon: Smartphone, color: 'text-brand' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">CMS Dashboard</h1>
          <p className="text-muted-foreground mt-1">Content performance and growth KPIs</p>
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
          <Button variant="outline" size="sm" onClick={() => setLocation('/admin/analytics')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="hover-elevate">
            <CardContent className="pt-4">
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                    <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  </div>
                  <p className="text-2xl font-bold" data-testid={`kpi-${kpi.label.toLowerCase().replace(' ', '-')}`}>
                    {kpi.value.toLocaleString()}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle className="text-lg">Top Stock Pages</CardTitle>
              <CardDescription>Performance by page views</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/stocks')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : summary?.topStockPages?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.topStockPages.slice(0, 5).map((page) => (
                    <TableRow key={page.path} data-testid={`row-stock-${page.path}`}>
                      <TableCell className="font-medium">
                        <span className="truncate max-w-[200px] inline-block">{page.path}</span>
                      </TableCell>
                      <TableCell className="text-right">{page.views}</TableCell>
                      <TableCell className="text-right">{page.clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No stock page data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div>
              <CardTitle className="text-lg">Top Blog Posts</CardTitle>
              <CardDescription>Learn section performance</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/blog')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : summary?.topBlogPosts?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Newsletter</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.topBlogPosts.slice(0, 5).map((post) => (
                    <TableRow key={post.path} data-testid={`row-blog-${post.path}`}>
                      <TableCell className="font-medium">
                        <span className="truncate max-w-[200px] inline-block">{post.path}</span>
                      </TableCell>
                      <TableCell className="text-right">{post.views}</TableCell>
                      <TableCell className="text-right">{post.newsletterClicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No blog post data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Banner Performance</CardTitle>
            <CardDescription>CTR by banner</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : summary?.bannerPerformance?.length ? (
              <div className="space-y-3">
                {summary.bannerPerformance.slice(0, 5).map((banner) => (
                  <div key={banner.bannerId} className="flex items-center justify-between">
                    <span className="text-sm font-medium">Banner #{banner.bannerId}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {banner.views} views / {banner.clicks} clicks
                      </span>
                      <Badge variant={banner.ctr > 5 ? 'default' : 'secondary'} className="no-default-hover-elevate">
                        {banner.ctr.toFixed(1)}% CTR
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No banner data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Content Health</CardTitle>
            <CardDescription>Editorial queue status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Draft Stocks</span>
                  <Badge variant={summary?.contentHealth.draftStocks ? 'destructive' : 'secondary'} className="no-default-hover-elevate">
                    {summary?.contentHealth.draftStocks ?? 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Draft Blog Posts</span>
                  <Badge variant={summary?.contentHealth.draftBlogs ? 'destructive' : 'secondary'} className="no-default-hover-elevate">
                    {summary?.contentHealth.draftBlogs ?? 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Missing SEO</span>
                  <Badge variant={summary?.contentHealth.missingSeo ? 'destructive' : 'secondary'} className="no-default-hover-elevate">
                    {summary?.contentHealth.missingSeo ?? 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recently Published</span>
                  <Badge variant="default" className="no-default-hover-elevate bg-brand">
                    {summary?.contentHealth.recentlyPublished ?? 0}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/stocks')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Stock Page
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/blog')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Blog Post
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/pages')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Landing Page
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/banners')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Banner
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/mobile-install')}>
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Install Banner
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setLocation('/admin/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
