import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Library,
  TrendingUp,
  Calendar,
  Briefcase,
  Image,
  BookOpen,
  BarChart3
} from 'lucide-react';
import type { BlockLibraryTemplate, NewsletterBlockType, NewsletterBlockData } from '@shared/schema';

type ViewMode = 'list' | 'editor';

const NEW_BLOCK_TYPES: { type: NewsletterBlockType; label: string; icon: typeof TrendingUp }[] = [
  { type: 'stock_list_manual', label: 'Stock List (Manual)', icon: TrendingUp },
  { type: 'options_ideas_manual', label: 'Options Ideas', icon: Briefcase },
  { type: 'market_snapshot_manual', label: 'Market Snapshot', icon: BarChart3 },
  { type: 'top_themes_manual', label: 'Top Themes', icon: TrendingUp },
  { type: 'econ_calendar_manual', label: 'Economic Calendar', icon: Calendar },
  { type: 'earnings_watch_manual', label: 'Earnings Watch', icon: BarChart3 },
  { type: 'education_card', label: 'Education Card', icon: BookOpen },
  { type: 'promo_banner', label: 'Promo Banner', icon: Image },
];

const getBlockTypeLabel = (type: NewsletterBlockType): string => {
  const found = NEW_BLOCK_TYPES.find(b => b.type === type);
  return found?.label || type;
};

const getDefaultBlockData = (blockType: NewsletterBlockType): NewsletterBlockData => {
  switch (blockType) {
    case 'stock_list_manual':
      return { title: '', description: '', items: [] };
    case 'options_ideas_manual':
      return { title: '', intro: '', contracts: [] };
    case 'market_snapshot_manual':
      return { title: '', bullets: ['', '', ''], what_to_watch: '' };
    case 'top_themes_manual':
      return { title: '', themes: [] };
    case 'econ_calendar_manual':
      return { title: '', events: [] };
    case 'earnings_watch_manual':
      return { title: '', entries: [] };
    case 'education_card':
      return { title: '', bullets: ['', ''], cta_text: '', cta_link: '' };
    case 'promo_banner':
      return { image_url: '', link_url: '', banner_title: '' };
    default:
      return {};
  }
};

interface EditingTemplate {
  name: string;
  blockType: NewsletterBlockType;
  blockDataJson: NewsletterBlockData;
}

export default function AdminBlocksLibrary() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<BlockLibraryTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<BlockLibraryTemplate | null>(null);

  const { data: templates, isLoading } = useQuery<BlockLibraryTemplate[]>({
    queryKey: ['/api/block-library-templates'],
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; blockType: NewsletterBlockType; blockDataJson: NewsletterBlockData }) => 
      apiRequest('POST', '/api/block-library-templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/block-library-templates'] });
      toast({ title: 'Template created' });
      setViewMode('list');
      setEditingTemplate(null);
      setSelectedTemplate(null);
    },
    onError: () => toast({ title: 'Failed to create template', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlockLibraryTemplate> }) => 
      apiRequest('PUT', `/api/block-library-templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/block-library-templates'] });
      toast({ title: 'Template updated' });
      setViewMode('list');
      setEditingTemplate(null);
      setSelectedTemplate(null);
    },
    onError: () => toast({ title: 'Failed to update template', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/block-library-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/block-library-templates'] });
      toast({ title: 'Template deleted' });
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    },
    onError: () => toast({ title: 'Failed to delete template', variant: 'destructive' }),
  });

  const handleCreateNew = () => {
    const defaultType: NewsletterBlockType = 'stock_list_manual';
    setEditingTemplate({
      name: '',
      blockType: defaultType,
      blockDataJson: getDefaultBlockData(defaultType),
    });
    setSelectedTemplate(null);
    setViewMode('editor');
  };

  const handleEdit = (template: BlockLibraryTemplate) => {
    setSelectedTemplate(template);
    setEditingTemplate({
      name: template.name,
      blockType: template.blockType,
      blockDataJson: template.blockDataJson as NewsletterBlockData,
    });
    setViewMode('editor');
  };

  const handleDuplicate = (template: BlockLibraryTemplate) => {
    setEditingTemplate({
      name: `${template.name} (Copy)`,
      blockType: template.blockType,
      blockDataJson: JSON.parse(JSON.stringify(template.blockDataJson)),
    });
    setSelectedTemplate(null);
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    if (!editingTemplate.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, data: editingTemplate });
    } else {
      createMutation.mutate(editingTemplate);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderBlockDataEditor = () => {
    if (!editingTemplate) return null;
    const data = editingTemplate.blockDataJson as Record<string, unknown>;

    const updateData = (key: string, value: unknown) => {
      setEditingTemplate({
        ...editingTemplate,
        blockDataJson: { ...data, [key]: value } as NewsletterBlockData,
      });
    };

    switch (editingTemplate.blockType) {
      case 'stock_list_manual':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={(data.title as string) || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Top Traded Stocks"
                data-testid="input-stock-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={(data.description as string) || ''}
                onChange={(e) => updateData('description', e.target.value)}
                placeholder="Brief description..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'market_snapshot_manual':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={(data.title as string) || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Market Snapshot"
                data-testid="input-snapshot-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Bullets (3-6 required)</Label>
              {((data.bullets as string[]) || ['', '', '']).map((bullet: string, idx: number) => (
                <Input
                  key={idx}
                  value={bullet}
                  onChange={(e) => {
                    const bullets = [...((data.bullets as string[]) || ['', '', ''])];
                    bullets[idx] = e.target.value;
                    updateData('bullets', bullets);
                  }}
                  placeholder={`Bullet ${idx + 1}`}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const bullets = [...((data.bullets as string[]) || []), ''];
                  if (bullets.length <= 6) updateData('bullets', bullets);
                }}
                disabled={((data.bullets as string[]) || []).length >= 6}
              >
                Add Bullet
              </Button>
            </div>
            <div className="space-y-2">
              <Label>What to Watch</Label>
              <Input
                value={(data.what_to_watch as string) || ''}
                onChange={(e) => updateData('what_to_watch', e.target.value)}
                placeholder="Key event to watch..."
              />
            </div>
          </div>
        );

      case 'promo_banner':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL *</Label>
              <Input
                value={(data.image_url as string) || ''}
                onChange={(e) => updateData('image_url', e.target.value)}
                placeholder="https://..."
                data-testid="input-banner-image"
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL *</Label>
              <Input
                value={(data.link_url as string) || ''}
                onChange={(e) => updateData('link_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Banner Title (optional)</Label>
              <Input
                value={(data.banner_title as string) || ''}
                onChange={(e) => updateData('banner_title', e.target.value)}
                placeholder="Leave empty for image-only banner"
              />
            </div>
          </div>
        );

      case 'education_card':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={(data.title as string) || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Did You Know?"
              />
            </div>
            <div className="space-y-2">
              <Label>Bullets (2-4 required)</Label>
              {((data.bullets as string[]) || ['', '']).map((bullet: string, idx: number) => (
                <Input
                  key={idx}
                  value={bullet}
                  onChange={(e) => {
                    const bullets = [...((data.bullets as string[]) || ['', ''])];
                    bullets[idx] = e.target.value;
                    updateData('bullets', bullets);
                  }}
                  placeholder={`Bullet ${idx + 1}`}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const bullets = [...((data.bullets as string[]) || []), ''];
                  if (bullets.length <= 4) updateData('bullets', bullets);
                }}
                disabled={((data.bullets as string[]) || []).length >= 4}
              >
                Add Bullet
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={(data.cta_text as string) || ''}
                  onChange={(e) => updateData('cta_text', e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Link</Label>
                <Input
                  value={(data.cta_link as string) || ''}
                  onChange={(e) => updateData('cta_link', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground p-4 border rounded-lg">
            Basic editor for this block type. Full editing will be available when creating newsletter instances.
          </div>
        );
    }
  };

  if (viewMode === 'editor' && editingTemplate) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-editor-title">
              {selectedTemplate ? 'Edit Template' : 'New Template'}
            </h1>
            <p className="text-muted-foreground">Create reusable block templates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setViewMode('list'); setEditingTemplate(null); setSelectedTemplate(null); }}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
              <CardDescription>Basic template information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  placeholder="e.g., Weekly Market Snapshot"
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Block Type</Label>
                <Select
                  value={editingTemplate.blockType}
                  onValueChange={(value: NewsletterBlockType) => {
                    setEditingTemplate({ 
                      ...editingTemplate, 
                      blockType: value,
                      blockDataJson: getDefaultBlockData(value),
                    });
                  }}
                  disabled={!!selectedTemplate}
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NEW_BLOCK_TYPES.map((bt) => (
                      <SelectItem key={bt.type} value={bt.type}>{bt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Block Content</CardTitle>
              <CardDescription>Default content for this template</CardDescription>
            </CardHeader>
            <CardContent>
              {renderBlockDataEditor()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Blocks Library</h1>
          <p className="text-muted-foreground mt-1">Reusable block templates for newsletters</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-template">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Library className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Templates</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-count">{templates?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Stock Lists</span>
            </div>
            <p className="text-2xl font-bold">
              {templates?.filter(t => t.blockType === 'stock_list_manual').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Image className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Promo Banners</span>
            </div>
            <p className="text-2xl font-bold">
              {templates?.filter(t => t.blockType === 'promo_banner').length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>Manage your reusable block templates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : templates && templates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Block Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} data-testid={`row-template-${template.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${template.id}`}>
                      {template.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getBlockTypeLabel(template.blockType)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(template.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(template)}
                          data-testid={`button-edit-${template.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDuplicate(template)}
                          data-testid={`button-duplicate-${template.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setTemplateToDelete(template);
                            setDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-${template.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Library className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No templates yet</p>
              <p className="text-sm">Create your first reusable block template</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => templateToDelete && deleteMutation.mutate(templateToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
