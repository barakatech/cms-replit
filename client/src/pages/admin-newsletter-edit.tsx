import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Save,
  Eye,
  Send,
  TrendingUp,
  Calendar,
  Briefcase,
  BarChart3,
  BookOpen,
  Image,
  Library
} from 'lucide-react';
import type { 
  Newsletter, 
  NewsletterBlockInstance, 
  NewsletterBlockType, 
  NewsletterBlockData,
  BlockLibraryTemplate
} from '@shared/schema';

const BLOCK_TYPES: { type: NewsletterBlockType; label: string; icon: typeof TrendingUp; category: string }[] = [
  { type: 'stock_list_manual', label: 'Stock List (Manual)', icon: TrendingUp, category: 'Manual' },
  { type: 'options_ideas_manual', label: 'Options Ideas', icon: Briefcase, category: 'Manual' },
  { type: 'market_snapshot_manual', label: 'Market Snapshot', icon: BarChart3, category: 'Manual' },
  { type: 'top_themes_manual', label: 'Top Themes', icon: TrendingUp, category: 'Manual' },
  { type: 'econ_calendar_manual', label: 'Economic Calendar', icon: Calendar, category: 'Manual' },
  { type: 'earnings_watch_manual', label: 'Earnings Watch', icon: BarChart3, category: 'Manual' },
  { type: 'education_card', label: 'Education Card', icon: BookOpen, category: 'Content' },
  { type: 'promo_banner', label: 'Promo Banner', icon: Image, category: 'Content' },
  { type: 'hero', label: 'Hero', icon: Image, category: 'Layout' },
  { type: 'intro', label: 'Intro', icon: BookOpen, category: 'Layout' },
  { type: 'cta', label: 'CTA', icon: Send, category: 'Layout' },
  { type: 'footer', label: 'Footer', icon: BookOpen, category: 'Layout' },
];

const getBlockTypeLabel = (type: NewsletterBlockType): string => {
  const found = BLOCK_TYPES.find(b => b.type === type);
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

export default function AdminNewsletterEdit() {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [editingBlock, setEditingBlock] = useState<NewsletterBlockInstance | null>(null);
  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState(false);
  const [editBlockDialogOpen, setEditBlockDialogOpen] = useState(false);
  const [blockEditorData, setBlockEditorData] = useState<NewsletterBlockData>({});
  const [selectedBlockType, setSelectedBlockType] = useState<NewsletterBlockType>('stock_list_manual');
  const [overrideSettingsString, setOverrideSettingsString] = useState<string>('{}');
  const [showOverrideSettings, setShowOverrideSettings] = useState(false);

  const newsletterId = params.id;

  const { data: newsletter, isLoading: newsletterLoading } = useQuery<Newsletter>({
    queryKey: ['/api/newsletters', newsletterId],
    enabled: !!newsletterId,
  });

  const { data: blockInstances, isLoading: blocksLoading, refetch: refetchBlocks } = useQuery<NewsletterBlockInstance[]>({
    queryKey: ['/api/newsletters', newsletterId, 'blocks'],
    queryFn: async () => {
      const res = await fetch(`/api/newsletters/${newsletterId}/blocks`);
      if (!res.ok) throw new Error('Failed to fetch blocks');
      return res.json();
    },
    enabled: !!newsletterId,
  });

  const { data: libraryTemplates } = useQuery<BlockLibraryTemplate[]>({
    queryKey: ['/api/block-library-templates'],
  });

  const addBlockMutation = useMutation({
    mutationFn: (data: { blockType: NewsletterBlockType; blockDataJson: NewsletterBlockData }) => 
      apiRequest('POST', `/api/newsletters/${newsletterId}/blocks/add`, data),
    onSuccess: () => {
      refetchBlocks();
      toast({ title: 'Block added' });
      setAddBlockDialogOpen(false);
      setBlockEditorData({});
    },
    onError: () => toast({ title: 'Failed to add block', variant: 'destructive' }),
  });

  const updateBlockMutation = useMutation({
    mutationFn: ({ blockId, data }: { blockId: string; data: Partial<NewsletterBlockInstance> }) => 
      apiRequest('POST', `/api/newsletters/${newsletterId}/blocks/${blockId}/update`, data),
    onSuccess: () => {
      refetchBlocks();
      toast({ title: 'Block updated' });
      setEditBlockDialogOpen(false);
      setEditingBlock(null);
      setBlockEditorData({});
    },
    onError: () => toast({ title: 'Failed to update block', variant: 'destructive' }),
  });

  const deleteBlockMutation = useMutation({
    mutationFn: (blockId: string) => 
      apiRequest('POST', `/api/newsletters/${newsletterId}/blocks/${blockId}/delete`),
    onSuccess: () => {
      refetchBlocks();
      toast({ title: 'Block deleted' });
    },
    onError: () => toast({ title: 'Failed to delete block', variant: 'destructive' }),
  });

  const reorderBlocksMutation = useMutation({
    mutationFn: (orderedIds: string[]) => 
      apiRequest('POST', `/api/newsletters/${newsletterId}/blocks/reorder`, { orderedIds }),
    onSuccess: () => {
      refetchBlocks();
      toast({ title: 'Blocks reordered' });
    },
    onError: () => toast({ title: 'Failed to reorder blocks', variant: 'destructive' }),
  });

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!blockInstances) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blockInstances.length) return;

    const sortedBlocks = [...blockInstances].sort((a, b) => a.sortOrder - b.sortOrder);
    const [movedBlock] = sortedBlocks.splice(index, 1);
    sortedBlocks.splice(newIndex, 0, movedBlock);
    
    reorderBlocksMutation.mutate(sortedBlocks.map(b => b.id));
  };

  const handleEditBlock = (block: NewsletterBlockInstance) => {
    setEditingBlock(block);
    setBlockEditorData(block.blockDataJson);
    setOverrideSettingsString(JSON.stringify(block.overrideSettingsJson || {}, null, 2));
    setShowOverrideSettings(Object.keys(block.overrideSettingsJson || {}).length > 0);
    setEditBlockDialogOpen(true);
  };

  const handleAddBlock = () => {
    addBlockMutation.mutate({
      blockType: selectedBlockType,
      blockDataJson: blockEditorData,
    });
  };

  const handleSaveBlock = () => {
    if (!editingBlock) return;
    
    let parsedOverrides: Record<string, unknown> = {};
    if (showOverrideSettings && overrideSettingsString.trim()) {
      try {
        parsedOverrides = JSON.parse(overrideSettingsString);
      } catch {
        toast({ title: 'Invalid JSON in override settings', variant: 'destructive' });
        return;
      }
    }
    
    updateBlockMutation.mutate({
      blockId: editingBlock.id,
      data: { 
        blockDataJson: blockEditorData,
        overrideSettingsJson: parsedOverrides,
      },
    });
  };

  const handleInsertFromLibrary = (template: BlockLibraryTemplate) => {
    addBlockMutation.mutate({
      blockType: template.blockType,
      blockDataJson: template.blockDataJson,
    });
  };

  const renderBlockEditor = (blockType: NewsletterBlockType, data: NewsletterBlockData, isNew: boolean) => {
    const updateData = (key: string, value: unknown) => {
      setBlockEditorData({ ...data, [key]: value });
    };

    switch (blockType) {
      case 'stock_list_manual':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={(data as Record<string, unknown>).title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Top Traded Stocks"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={(data as Record<string, unknown>).description as string || ''}
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
                value={(data as Record<string, unknown>).title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Market Snapshot"
              />
            </div>
            <div className="space-y-2">
              <Label>Bullets</Label>
              {(((data as Record<string, unknown>).bullets as string[]) || ['', '', '']).map((bullet: string, idx: number) => (
                <Input
                  key={idx}
                  value={bullet}
                  onChange={(e) => {
                    const bullets = [...(((data as Record<string, unknown>).bullets as string[]) || ['', '', ''])];
                    bullets[idx] = e.target.value;
                    updateData('bullets', bullets);
                  }}
                  placeholder={`Bullet ${idx + 1}`}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label>What to Watch</Label>
              <Input
                value={(data as Record<string, unknown>).what_to_watch as string || ''}
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
                value={(data as Record<string, unknown>).image_url as string || ''}
                onChange={(e) => updateData('image_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Link URL *</Label>
              <Input
                value={(data as Record<string, unknown>).link_url as string || ''}
                onChange={(e) => updateData('link_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Banner Title</Label>
              <Input
                value={(data as Record<string, unknown>).banner_title as string || ''}
                onChange={(e) => updateData('banner_title', e.target.value)}
                placeholder="Optional title..."
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
                value={(data as Record<string, unknown>).title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Did You Know?"
              />
            </div>
            <div className="space-y-2">
              <Label>Bullets</Label>
              {(((data as Record<string, unknown>).bullets as string[]) || ['', '']).map((bullet: string, idx: number) => (
                <Input
                  key={idx}
                  value={bullet}
                  onChange={(e) => {
                    const bullets = [...(((data as Record<string, unknown>).bullets as string[]) || ['', ''])];
                    bullets[idx] = e.target.value;
                    updateData('bullets', bullets);
                  }}
                  placeholder={`Bullet ${idx + 1}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={(data as Record<string, unknown>).cta_text as string || ''}
                  onChange={(e) => updateData('cta_text', e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Link</Label>
                <Input
                  value={(data as Record<string, unknown>).cta_link as string || ''}
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
            Block content editor. Configure the block data below.
            <Textarea
              className="mt-2 font-mono text-xs"
              value={JSON.stringify(data, null, 2)}
              onChange={(e) => {
                try {
                  setBlockEditorData(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={8}
            />
          </div>
        );
    }
  };

  if (newsletterLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Newsletter not found.
        <Button variant="ghost" onClick={() => setLocation('/admin/newsletters')}>
          Back to Newsletters
        </Button>
      </div>
    );
  }

  const sortedBlocks = blockInstances ? [...blockInstances].sort((a, b) => a.sortOrder - b.sortOrder) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/admin/newsletters')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-newsletter-subject">
              {newsletter.subject}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={newsletter.status === 'sent' ? 'default' : 'outline'}>
                {newsletter.status}
              </Badge>
              <Badge variant="outline">{newsletter.locale.toUpperCase()}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" data-testid="button-send-test">
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Content Blocks</CardTitle>
                <CardDescription>Drag to reorder, click to edit</CardDescription>
              </div>
              <Button onClick={() => setAddBlockDialogOpen(true)} data-testid="button-add-block">
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </CardHeader>
            <CardContent>
              {blocksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : sortedBlocks.length > 0 ? (
                <div className="space-y-2">
                  {sortedBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="flex items-center gap-2 p-3 border rounded-lg bg-card hover-elevate cursor-pointer"
                      data-testid={`block-instance-${block.id}`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="flex-1" onClick={() => handleEditBlock(block)}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getBlockTypeLabel(block.blockType)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            #{block.sortOrder + 1}
                          </span>
                        </div>
                        <p className="text-sm truncate mt-1">
                          {(block.blockDataJson as Record<string, unknown>).title as string || 'No title'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={index === 0}
                          onClick={() => handleMoveBlock(index, 'up')}
                          data-testid={`button-move-up-${block.id}`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={index === sortedBlocks.length - 1}
                          onClick={() => handleMoveBlock(index, 'down')}
                          data-testid={`button-move-down-${block.id}`}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteBlockMutation.mutate(block.id)}
                          data-testid={`button-delete-${block.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Plus className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No blocks yet</p>
                  <p className="text-sm">Add content blocks to build your newsletter</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setAddBlockDialogOpen(true)}
                    data-testid="button-add-first-block"
                  >
                    Add First Block
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Newsletter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Subject:</span>
                <p className="font-medium">{newsletter.subject}</p>
              </div>
              <Separator />
              <div>
                <span className="text-muted-foreground">Preheader:</span>
                <p>{newsletter.preheader || '-'}</p>
              </div>
              <Separator />
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{new Date(newsletter.createdAt).toLocaleDateString()}</p>
              </div>
              {newsletter.scheduledAt && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground">Scheduled:</span>
                    <p>{new Date(newsletter.scheduledAt).toLocaleString()}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Library className="h-4 w-4" />
                Library Templates
              </CardTitle>
              <CardDescription className="text-xs">
                Quick insert from saved templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {libraryTemplates && libraryTemplates.length > 0 ? (
                  <div className="space-y-2">
                    {libraryTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleInsertFromLibrary(template)}
                        data-testid={`button-insert-${template.id}`}
                      >
                        <div>
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {getBlockTypeLabel(template.blockType)}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No templates available
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={addBlockDialogOpen} onOpenChange={setAddBlockDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
            <DialogDescription>
              Choose a block type and configure its content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Block Type</Label>
              <Select
                value={selectedBlockType}
                onValueChange={(value: NewsletterBlockType) => {
                  setSelectedBlockType(value);
                  setBlockEditorData(getDefaultBlockData(value));
                }}
              >
                <SelectTrigger data-testid="select-block-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOCK_TYPES.map((bt) => (
                    <SelectItem key={bt.type} value={bt.type}>
                      {bt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            {renderBlockEditor(selectedBlockType, blockEditorData, true)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddBlock}
              disabled={addBlockMutation.isPending}
              data-testid="button-confirm-add"
            >
              {addBlockMutation.isPending ? 'Adding...' : 'Add Block'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editBlockDialogOpen} onOpenChange={setEditBlockDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Block</DialogTitle>
            <DialogDescription>
              {editingBlock && getBlockTypeLabel(editingBlock.blockType)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {editingBlock && renderBlockEditor(editingBlock.blockType, blockEditorData, false)}
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Issue-Level Settings Override</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOverrideSettings(!showOverrideSettings)}
                  data-testid="button-toggle-overrides"
                >
                  {showOverrideSettings ? 'Hide' : 'Show'}
                </Button>
              </div>
              {showOverrideSettings && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Override default/template settings for this specific newsletter issue
                  </p>
                  <Textarea
                    value={overrideSettingsString}
                    onChange={(e) => setOverrideSettingsString(e.target.value)}
                    placeholder='{"max_items": 15}'
                    rows={4}
                    className="font-mono text-sm"
                    data-testid="textarea-override-settings"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveBlock}
              disabled={updateBlockMutation.isPending}
              data-testid="button-save-block"
            >
              {updateBlockMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
