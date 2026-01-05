import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Plus, FileText, Eye, Edit, Trash2, ExternalLink, BarChart3 } from 'lucide-react';
import type { LandingPage, LandingPageTemplateKey } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const templates: { key: LandingPageTemplateKey; name: string; description: string }[] = [
  { key: 'subscription', name: 'Subscription Landing', description: 'Pricing plans + FAQs + Lead form' },
  { key: 'promoOffer', name: 'Promo Offer Landing', description: 'Hero + Offer rail + CTA + Form' },
  { key: 'learnGuide', name: 'Learn/Guide Landing', description: 'Content heavy + Newsletter' },
  { key: 'appDownload', name: 'App Download Landing', description: 'Hero + Value props + Store badges' },
  { key: 'webinarEvent', name: 'Webinar/Event Landing', description: 'Agenda + Speaker cards + Signup' },
  { key: 'blank', name: 'Blank Page', description: 'Start from scratch' },
];

export default function AdminPages() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageTemplate, setNewPageTemplate] = useState<LandingPageTemplateKey>('blank');

  const { data: pages = [], isLoading } = useQuery<LandingPage[]>({
    queryKey: ['/api/landing-pages'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { slug: string; title: string; templateKey: LandingPageTemplateKey }) => {
      const newPage = {
        slug: data.slug,
        status: 'draft' as const,
        templateKey: data.templateKey,
        localeContent: {
          en: {
            title: data.title,
            description: '',
            sections: [],
            seo: {
              metaTitle: data.title,
              metaDescription: '',
              robotsIndex: true,
              robotsFollow: true,
            },
          },
          ar: {
            title: '',
            description: '',
            sections: [],
            seo: {
              metaTitle: '',
              metaDescription: '',
              robotsIndex: true,
              robotsFollow: true,
            },
          },
        },
        settings: {
          headerVariant: 'default' as const,
          footerVariant: 'default' as const,
        },
      };
      const res = await apiRequest('POST', '/api/landing-pages', newPage);
      return res.json() as Promise<LandingPage>;
    },
    onSuccess: (page: LandingPage) => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      setIsCreateOpen(false);
      setNewPageSlug('');
      setNewPageTitle('');
      toast({ title: 'Page created', description: 'Your new landing page has been created.' });
      navigate(`/admin/pages/${page.id}/edit`);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create page', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/landing-pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      toast({ title: 'Page deleted', description: 'The landing page has been deleted.' });
    },
  });

  const handleCreate = () => {
    if (!newPageSlug || !newPageTitle) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    createMutation.mutate({ slug: newPageSlug, title: newPageTitle, templateKey: newPageTemplate });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-600">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Landing Pages</h1>
          <p className="text-muted-foreground">Create and manage marketing landing pages</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-page">
              <Plus className="mr-2 h-4 w-4" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Landing Page</DialogTitle>
              <DialogDescription>
                Choose a template and enter basic details to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Promo 2024"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  data-testid="input-page-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/p/</span>
                  <Input
                    id="slug"
                    placeholder="summer-promo"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    data-testid="input-page-slug"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={newPageTemplate} onValueChange={(v) => setNewPageTemplate(v as LandingPageTemplateKey)}>
                  <SelectTrigger data-testid="select-template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.key} value={t.key}>
                        <div className="flex flex-col">
                          <span>{t.name}</span>
                          <span className="text-xs text-muted-foreground">{t.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending} data-testid="button-confirm-create">
                {createMutation.isPending ? 'Creating...' : 'Create Page'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Landing Pages
          </CardTitle>
          <CardDescription>
            {pages.length} {pages.length === 1 ? 'page' : 'pages'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Loading pages...</div>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No landing pages yet</h3>
              <p className="text-muted-foreground">Create your first landing page to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                    <TableCell className="font-medium">{page.localeContent.en.title || 'Untitled'}</TableCell>
                    <TableCell className="text-muted-foreground">/p/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{page.templateKey}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                          data-testid={`button-edit-${page.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {page.status === 'published' && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                            data-testid={`button-view-${page.id}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                          data-testid={`button-preview-${page.id}`}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/admin/pages/${page.id}/analytics`)}
                          data-testid={`button-analytics-${page.id}`}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this page?')) {
                              deleteMutation.mutate(page.id);
                            }
                          }}
                          data-testid={`button-delete-${page.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}