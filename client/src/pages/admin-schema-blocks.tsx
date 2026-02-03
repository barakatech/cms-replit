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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  ArrowLeft,
  Layers,
  Globe
} from 'lucide-react';
import type { SchemaBlock, InsertSchemaBlock, NewsletterBlockType } from '@shared/schema';

type ViewMode = 'list' | 'editor';

const BLOCK_TYPES: NewsletterBlockType[] = [
  'hero', 'intro', 'featured', 'articles', 'stockCollection', 
  'assetsUnder500', 'userPicks', 'assetHighlight', 'termOfTheDay', 
  'inOtherNews', 'cta', 'footer'
];

const BLOCK_TYPE_LABELS: Record<NewsletterBlockType, string> = {
  hero: 'Hero Section',
  intro: 'Introduction',
  featured: 'Featured Content',
  articles: 'Articles List',
  stockCollection: 'Stock Collection',
  assetsUnder500: 'Assets Under $500',
  userPicks: 'What Users Picked',
  assetHighlight: 'Asset Highlight',
  termOfTheDay: 'Term of the Day',
  inOtherNews: 'In Other News',
  cta: 'Call to Action',
  footer: 'Footer',
};

interface EditingBlock {
  name: string;
  description: string;
  type: NewsletterBlockType;
  locale: 'en' | 'ar' | 'global';
  defaultConfig: {
    label: string;
    required: boolean;
    tickers?: string[];
    newsItems?: Array<{ title: string; url: string; source?: string }>;
    term?: string;
    termDefinition?: string;
  };
}

export default function AdminSchemaBlocks() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedBlock, setSelectedBlock] = useState<SchemaBlock | null>(null);
  const [editingBlock, setEditingBlock] = useState<EditingBlock | null>(null);

  const { data: blocks, isLoading } = useQuery<SchemaBlock[]>({
    queryKey: ['/api/schema-blocks'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertSchemaBlock) => apiRequest('POST', '/api/schema-blocks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-blocks'] });
      toast({ title: 'Block created' });
      setViewMode('list');
      setEditingBlock(null);
      setSelectedBlock(null);
    },
    onError: () => toast({ title: 'Failed to create block', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertSchemaBlock> }) => 
      apiRequest('PUT', `/api/schema-blocks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-blocks'] });
      toast({ title: 'Block updated' });
      setViewMode('list');
      setEditingBlock(null);
      setSelectedBlock(null);
    },
    onError: () => toast({ title: 'Failed to update block', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/schema-blocks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-blocks'] });
      toast({ title: 'Block deleted' });
    },
    onError: () => toast({ title: 'Failed to delete block', variant: 'destructive' }),
  });

  const getLocaleColor = (locale: string) => {
    switch (locale) {
      case 'en': return 'bg-blue-500';
      case 'ar': return 'bg-purple-500';
      case 'global': return 'bg-brand';
      default: return 'bg-muted';
    }
  };

  const handleCreateNew = () => {
    const newBlock: EditingBlock = {
      name: '',
      description: '',
      type: 'intro',
      locale: 'global',
      defaultConfig: {
        label: 'New Block',
        required: false,
      },
    };
    setEditingBlock(newBlock);
    setSelectedBlock(null);
    setViewMode('editor');
  };

  const handleEdit = (block: SchemaBlock) => {
    setSelectedBlock(block);
    setEditingBlock({
      name: block.name,
      description: block.description,
      type: block.type,
      locale: block.locale,
      defaultConfig: { ...block.defaultConfig },
    });
    setViewMode('editor');
  };

  const handleDuplicate = (block: SchemaBlock) => {
    const duplicated: EditingBlock = {
      name: `${block.name} (Copy)`,
      description: block.description,
      type: block.type,
      locale: block.locale,
      defaultConfig: JSON.parse(JSON.stringify(block.defaultConfig)),
    };
    setEditingBlock(duplicated);
    setSelectedBlock(null);
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!editingBlock) return;
    if (!editingBlock.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    const payload: InsertSchemaBlock = {
      name: editingBlock.name,
      description: editingBlock.description,
      type: editingBlock.type,
      locale: editingBlock.locale,
      defaultConfig: editingBlock.defaultConfig,
    };

    if (selectedBlock) {
      updateMutation.mutate({ id: selectedBlock.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (viewMode === 'editor' && editingBlock) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setViewMode('list'); setEditingBlock(null); setSelectedBlock(null); }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-editor-title">
                {selectedBlock ? 'Edit Block' : 'New Block'}
              </h1>
              <p className="text-muted-foreground">Configure reusable content block</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setViewMode('list'); setEditingBlock(null); setSelectedBlock(null); }}
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Block Settings</CardTitle>
                <CardDescription>Basic block information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={editingBlock.name}
                    onChange={(e) => setEditingBlock({ ...editingBlock, name: e.target.value })}
                    placeholder="e.g., Weekly Stock Collection"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingBlock.description}
                    onChange={(e) => setEditingBlock({ ...editingBlock, description: e.target.value })}
                    placeholder="Describe what this block is for..."
                    rows={2}
                    data-testid="input-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Block Type</Label>
                    <Select
                      value={editingBlock.type}
                      onValueChange={(value: NewsletterBlockType) => {
                        setEditingBlock({ 
                          ...editingBlock, 
                          type: value,
                          defaultConfig: {
                            ...editingBlock.defaultConfig,
                            label: BLOCK_TYPE_LABELS[value],
                          }
                        });
                      }}
                    >
                      <SelectTrigger data-testid="select-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOCK_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{BLOCK_TYPE_LABELS[t]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <Select
                      value={editingBlock.locale}
                      onValueChange={(value: 'en' | 'ar' | 'global') => setEditingBlock({ ...editingBlock, locale: value })}
                    >
                      <SelectTrigger data-testid="select-locale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global (All Locales)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Configuration</CardTitle>
                <CardDescription>Default values when this block is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Display Label</Label>
                  <Input
                    id="label"
                    value={editingBlock.defaultConfig.label}
                    onChange={(e) => setEditingBlock({ 
                      ...editingBlock, 
                      defaultConfig: { ...editingBlock.defaultConfig, label: e.target.value }
                    })}
                    placeholder="Block label..."
                    data-testid="input-label"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="required"
                    checked={editingBlock.defaultConfig.required}
                    onCheckedChange={(checked) => setEditingBlock({
                      ...editingBlock,
                      defaultConfig: { ...editingBlock.defaultConfig, required: Boolean(checked) }
                    })}
                    data-testid="checkbox-required"
                  />
                  <Label htmlFor="required" className="text-sm text-muted-foreground">
                    Required by default
                  </Label>
                </div>

                {editingBlock.type === 'termOfTheDay' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Default Term</Label>
                      <Input
                        value={editingBlock.defaultConfig.term || ''}
                        onChange={(e) => setEditingBlock({
                          ...editingBlock,
                          defaultConfig: { ...editingBlock.defaultConfig, term: e.target.value }
                        })}
                        placeholder="e.g., P/E Ratio"
                        data-testid="input-term"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Definition</Label>
                      <Textarea
                        value={editingBlock.defaultConfig.termDefinition || ''}
                        onChange={(e) => setEditingBlock({
                          ...editingBlock,
                          defaultConfig: { ...editingBlock.defaultConfig, termDefinition: e.target.value }
                        })}
                        placeholder="Explain the term..."
                        rows={3}
                        data-testid="textarea-term-definition"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How this block will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{editingBlock.defaultConfig.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{BLOCK_TYPE_LABELS[editingBlock.type]}</Badge>
                      {editingBlock.defaultConfig.required && (
                        <Badge className="bg-brand text-xs">Required</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {editingBlock.description || 'No description provided'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Schema Blocks</h1>
          <p className="text-muted-foreground mt-1">Reusable content blocks for newsletters</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-block">
          <Plus className="h-4 w-4 mr-2" />
          New Block
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Blocks</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-count">{blocks?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Global Blocks</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-global-count">
              {blocks?.filter(b => b.locale === 'global').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Block Types</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-types-count">
              {blocks ? new Set(blocks.map(b => b.type)).size : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blocks</CardTitle>
          <CardDescription>Manage your reusable content blocks</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : blocks && blocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.id} data-testid={`row-block-${block.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${block.id}`}>
                      <div>
                        <div>{block.name}</div>
                        <div className="text-xs text-muted-foreground">{block.description || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{BLOCK_TYPE_LABELS[block.type]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getLocaleColor(block.locale)} text-white`} data-testid={`badge-locale-${block.id}`}>
                        {block.locale === 'global' ? 'Global' : block.locale.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {block.defaultConfig.required ? (
                        <Badge className="bg-brand">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm" data-testid={`text-created-${block.id}`}>
                      {formatDate(block.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(block)}
                          data-testid={`button-edit-${block.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDuplicate(block)}
                          data-testid={`button-duplicate-${block.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this block?')) {
                              deleteMutation.mutate(block.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${block.id}`}
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
              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No blocks yet</p>
              <p className="text-sm">Create your first reusable content block</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
