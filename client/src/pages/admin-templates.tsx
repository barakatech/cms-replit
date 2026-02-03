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
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  ArrowLeft,
  FileText,
  Globe,
  Layers,
  Code,
  Eye
} from 'lucide-react';
import type { NewsletterTemplate, InsertNewsletterTemplate, StockPage, NewsletterTemplateBlockOverride, SchemaBlockDefinition } from '@shared/schema';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings2 } from 'lucide-react';

type ViewMode = 'list' | 'editor';

type BlockType = 'hero' | 'intro' | 'featured' | 'articles' | 'cta' | 'footer' | 'stockCollection' | 'assetsUnder500' | 'userPicks' | 'assetHighlight' | 'termOfTheDay' | 'inOtherNews';

type ZoneName = 'header' | 'body' | 'footer';

interface TemplateZone {
  zone: ZoneName;
  allowedBlockTypes: BlockType[];
  maxBlocks?: number;
}

interface EditingTemplate {
  name: string;
  description: string;
  locale: 'en' | 'ar' | 'global';
  zones: TemplateZone[];
  htmlWrapper: string;
  defaultValuesJson: Record<string, unknown>;
}

const BLOCK_TYPES: BlockType[] = [
  'hero', 'intro', 'featured', 'articles', 'stockCollection', 
  'assetsUnder500', 'userPicks', 'assetHighlight', 'termOfTheDay', 
  'inOtherNews', 'cta', 'footer'
];

const DEFAULT_BLOCK_LABELS: Record<BlockType, string> = {
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

const ZONE_NAMES: ZoneName[] = ['header', 'body', 'footer'];

const ZONE_LABELS: Record<ZoneName, string> = {
  header: 'Header Zone',
  body: 'Body Zone',
  footer: 'Footer Zone',
};

const DEFAULT_ZONE_BLOCKS: Record<ZoneName, BlockType[]> = {
  header: ['hero'],
  body: ['intro', 'featured', 'articles', 'stockCollection', 'assetsUnder500', 'userPicks', 'assetHighlight', 'termOfTheDay', 'inOtherNews', 'cta'],
  footer: ['footer', 'cta'],
};

function TemplateBlockOverridesSection({ templateId }: { templateId: string }) {
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(null);
  const [editingSettings, setEditingSettings] = useState<string>('{}');

  const { data: overrides = [], isLoading: overridesLoading } = useQuery<NewsletterTemplateBlockOverride[]>({
    queryKey: ['/api/newsletter-templates', templateId, 'block-overrides'],
    queryFn: () => fetch(`/api/newsletter-templates/${templateId}/block-overrides`).then(res => res.json()),
  });

  const { data: definitions = [] } = useQuery<SchemaBlockDefinition[]>({
    queryKey: ['/api/schema-block-definitions'],
  });

  const createOverrideMutation = useMutation({
    mutationFn: (data: { blockType: string; overrideSettingsJson: Record<string, unknown> }) => 
      apiRequest('POST', `/api/newsletter-templates/${templateId}/block-overrides`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates', templateId, 'block-overrides'] });
      toast({ title: 'Override created' });
      setEditDialogOpen(false);
    },
    onError: () => toast({ title: 'Failed to create override', variant: 'destructive' }),
  });

  const updateOverrideMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { overrideSettingsJson: Record<string, unknown> } }) => 
      apiRequest('PUT', `/api/template-block-overrides/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates', templateId, 'block-overrides'] });
      toast({ title: 'Override updated' });
      setEditDialogOpen(false);
    },
    onError: () => toast({ title: 'Failed to update override', variant: 'destructive' }),
  });

  const deleteOverrideMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/template-block-overrides/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates', templateId, 'block-overrides'] });
      toast({ title: 'Override deleted' });
    },
    onError: () => toast({ title: 'Failed to delete override', variant: 'destructive' }),
  });

  const handleAddOverride = (blockType: string) => {
    const def = definitions.find(d => d.blockType === blockType);
    setSelectedBlockType(blockType);
    setEditingSettings(JSON.stringify(def?.defaultSettingsJson || {}, null, 2));
    setEditDialogOpen(true);
  };

  const handleEditOverride = (override: NewsletterTemplateBlockOverride) => {
    setSelectedBlockType(override.blockType);
    setEditingSettings(JSON.stringify(override.overrideSettingsJson || {}, null, 2));
    setEditDialogOpen(true);
  };

  const handleSaveOverride = () => {
    if (!selectedBlockType) return;
    
    let parsedSettings: Record<string, unknown>;
    try {
      parsedSettings = JSON.parse(editingSettings);
    } catch {
      toast({ title: 'Invalid JSON', variant: 'destructive' });
      return;
    }

    const existingOverride = overrides.find(o => o.blockType === selectedBlockType);
    if (existingOverride) {
      updateOverrideMutation.mutate({ id: existingOverride.id, data: { overrideSettingsJson: parsedSettings } });
    } else {
      createOverrideMutation.mutate({ blockType: selectedBlockType, overrideSettingsJson: parsedSettings });
    }
  };

  const getDefinitionForBlockType = (blockType: string) => definitions.find(d => d.blockType === blockType);

  const availableBlockTypes = definitions.filter(d => !overrides.find(o => o.blockType === d.blockType));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <CardTitle>Block Settings Overrides</CardTitle>
          </div>
          {availableBlockTypes.length > 0 && (
            <Select onValueChange={(value) => handleAddOverride(value)}>
              <SelectTrigger className="w-[200px]" data-testid="select-add-override">
                <SelectValue placeholder="Add override..." />
              </SelectTrigger>
              <SelectContent>
                {availableBlockTypes.map((def) => (
                  <SelectItem key={def.id} value={def.blockType}>
                    {def.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <CardDescription>
          Override default block settings for this template. These will apply to all newsletters using this template.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {overridesLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : overrides.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block Type</TableHead>
                <TableHead>Override Settings</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overrides.map((override) => {
                const def = getDefinitionForBlockType(override.blockType);
                return (
                  <TableRow key={override.id} data-testid={`row-override-${override.id}`}>
                    <TableCell>
                      <Badge variant="outline">{def?.name || override.blockType}</Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {Object.keys(override.overrideSettingsJson || {}).length} overrides
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditOverride(override)}
                          data-testid={`button-edit-override-${override.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteOverrideMutation.mutate(override.id)}
                          data-testid={`button-delete-override-${override.id}`}
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
          <div className="text-center py-8 text-muted-foreground">
            <Settings2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No block settings overrides configured</p>
            <p className="text-xs mt-1">Select a block type above to add template-level settings</p>
          </div>
        )}
      </CardContent>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {overrides.find(o => o.blockType === selectedBlockType) ? 'Edit' : 'Add'} Block Override
            </DialogTitle>
            <DialogDescription>
              Override settings for {selectedBlockType} blocks in newsletters using this template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Override Settings JSON</Label>
              <Textarea
                value={editingSettings}
                onChange={(e) => setEditingSettings(e.target.value)}
                placeholder='{"max_items": 20}'
                rows={8}
                className="font-mono text-sm mt-2"
                data-testid="textarea-override-settings"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only include settings you want to override from the defaults
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} data-testid="button-cancel-override">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveOverride}
              disabled={createOverrideMutation.isPending || updateOverrideMutation.isPending}
              data-testid="button-save-override"
            >
              {createOverrideMutation.isPending || updateOverrideMutation.isPending ? 'Saving...' : 'Save Override'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function AdminTemplates() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null);
  const [defaultValuesJsonString, setDefaultValuesJsonString] = useState('{}');

  const { data: templates, isLoading } = useQuery<NewsletterTemplate[]>({
    queryKey: ['/api/newsletter-templates'],
  });

  const { data: stockPages = [] } = useQuery<StockPage[]>({
    queryKey: ['/api/admin/stocks'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertNewsletterTemplate) => apiRequest('POST', '/api/newsletter-templates', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates'] });
      toast({ title: 'Template created' });
      setViewMode('list');
      setEditingTemplate(null);
      setSelectedTemplate(null);
    },
    onError: () => toast({ title: 'Failed to create template', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertNewsletterTemplate> }) => 
      apiRequest('PUT', `/api/newsletter-templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates'] });
      toast({ title: 'Template updated' });
      setViewMode('list');
      setEditingTemplate(null);
      setSelectedTemplate(null);
    },
    onError: () => toast({ title: 'Failed to update template', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/newsletter-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates'] });
      toast({ title: 'Template deleted' });
    },
    onError: () => toast({ title: 'Failed to delete template', variant: 'destructive' }),
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
    const newTemplate: EditingTemplate = {
      name: '',
      description: '',
      locale: 'global',
      zones: [
        { zone: 'header', allowedBlockTypes: ['hero'], maxBlocks: 1 },
        { zone: 'body', allowedBlockTypes: ['intro', 'featured', 'articles', 'cta'], maxBlocks: 10 },
        { zone: 'footer', allowedBlockTypes: ['footer', 'cta'], maxBlocks: 2 },
      ],
      htmlWrapper: `<!DOCTYPE html>
<html lang="{{locale}}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="20" cellspacing="0" style="background:#ffffff;">
          {{content}}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      defaultValuesJson: {},
    };
    setEditingTemplate(newTemplate);
    setDefaultValuesJsonString('{}');
    setSelectedTemplate(null);
    setViewMode('editor');
  };

  const handleEdit = (template: NewsletterTemplate) => {
    setSelectedTemplate(template);
    setEditingTemplate({
      name: template.name,
      description: template.description,
      locale: template.locale,
      zones: template.zones,
      htmlWrapper: template.htmlWrapper,
      defaultValuesJson: template.defaultValuesJson,
    });
    setDefaultValuesJsonString(JSON.stringify(template.defaultValuesJson, null, 2));
    setViewMode('editor');
  };

  const handleDuplicate = (template: NewsletterTemplate) => {
    const duplicated: EditingTemplate = {
      name: `${template.name} (Copy)`,
      description: template.description,
      locale: template.locale,
      zones: JSON.parse(JSON.stringify(template.zones)),
      htmlWrapper: template.htmlWrapper,
      defaultValuesJson: { ...template.defaultValuesJson },
    };
    setEditingTemplate(duplicated);
    setDefaultValuesJsonString(JSON.stringify(template.defaultValuesJson, null, 2));
    setSelectedTemplate(null);
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    if (!editingTemplate.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    let parsedDefaults: Record<string, unknown> = {};
    try {
      parsedDefaults = JSON.parse(defaultValuesJsonString);
    } catch {
      toast({ title: 'Invalid JSON in Default Values', variant: 'destructive' });
      return;
    }

    const payload: InsertNewsletterTemplate = {
      name: editingTemplate.name,
      description: editingTemplate.description,
      locale: editingTemplate.locale,
      zones: editingTemplate.zones,
      htmlWrapper: editingTemplate.htmlWrapper,
      defaultValuesJson: parsedDefaults,
    };

    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleBlockType = (zoneName: ZoneName, blockType: BlockType) => {
    if (!editingTemplate) return;
    const newZones = editingTemplate.zones.map(z => {
      if (z.zone !== zoneName) return z;
      const currentTypes = z.allowedBlockTypes;
      const newTypes = currentTypes.includes(blockType)
        ? currentTypes.filter(t => t !== blockType)
        : [...currentTypes, blockType];
      return { ...z, allowedBlockTypes: newTypes };
    });
    
    setEditingTemplate({ ...editingTemplate, zones: newZones });
  };

  const updateZoneLimits = (zoneName: ZoneName, value: number) => {
    if (!editingTemplate) return;
    const newZones = editingTemplate.zones.map(z => {
      if (z.zone !== zoneName) return z;
      return { ...z, maxBlocks: value };
    });
    setEditingTemplate({ ...editingTemplate, zones: newZones });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (viewMode === 'editor' && editingTemplate) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setViewMode('list'); setEditingTemplate(null); setSelectedTemplate(null); }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-editor-title">
                {selectedTemplate ? 'Edit Template' : 'New Template'}
              </h1>
              <p className="text-muted-foreground">Configure newsletter template structure</p>
            </div>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
                <CardDescription>Basic template information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="Weekly Newsletter Template"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    placeholder="Template for weekly newsletter..."
                    rows={2}
                    data-testid="input-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Locale</Label>
                  <Select
                    value={editingTemplate.locale}
                    onValueChange={(value: 'en' | 'ar' | 'global') => setEditingTemplate({ ...editingTemplate, locale: value })}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Layout Zones</CardTitle>
                  <CardDescription>Configure allowed block types for each zone</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingTemplate.zones.map((zoneConfig) => (
                  <Card key={zoneConfig.zone} className="bg-surface2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium capitalize">{ZONE_LABELS[zoneConfig.zone]}</span>
                          <Badge variant="outline">
                            {zoneConfig.allowedBlockTypes.length} types
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <Label className="text-xs">Max Blocks</Label>
                        <Select
                          value={String(zoneConfig.maxBlocks ?? 10)}
                          onValueChange={(value) => updateZoneLimits(zoneConfig.zone, parseInt(value))}
                        >
                          <SelectTrigger data-testid={`select-zone-max-${zoneConfig.zone}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 5, 10].map((n) => (
                              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Allowed Block Types</Label>
                        <div className="flex flex-wrap gap-2">
                          {DEFAULT_ZONE_BLOCKS[zoneConfig.zone].map((blockType) => {
                            const isSelected = zoneConfig.allowedBlockTypes.includes(blockType);
                            return (
                              <Badge
                                key={blockType}
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer capitalize ${isSelected ? 'bg-brand' : ''}`}
                                onClick={() => toggleBlockType(zoneConfig.zone, blockType)}
                                data-testid={`toggle-block-${zoneConfig.zone}-${blockType}`}
                              >
                                {DEFAULT_BLOCK_LABELS[blockType]}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <CardTitle>Zone Preview</CardTitle>
                </div>
                <CardDescription>Template zone configuration preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" data-testid="preview-container">
                  {editingTemplate.zones.map((zoneConfig) => (
                    <div 
                      key={zoneConfig.zone}
                      className="border border-dashed border-gray-300 rounded-lg p-4"
                      data-testid={`preview-zone-${zoneConfig.zone}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{ZONE_LABELS[zoneConfig.zone]}</span>
                        <Badge variant="outline">
                          max {zoneConfig.maxBlocks ?? 10} blocks
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {zoneConfig.allowedBlockTypes.map((blockType) => (
                          <Badge key={blockType} variant="secondary" className="text-xs capitalize">
                            {DEFAULT_BLOCK_LABELS[blockType]}
                          </Badge>
                        ))}
                        {zoneConfig.allowedBlockTypes.length === 0 && (
                          <span className="text-xs text-muted-foreground">No block types allowed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <CardTitle>HTML Wrapper</CardTitle>
                </div>
                <CardDescription>Email template wrapper HTML (use &#123;&#123;content&#125;&#125; for blocks)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editingTemplate.htmlWrapper}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, htmlWrapper: e.target.value })}
                  placeholder="<!DOCTYPE html>..."
                  rows={10}
                  className="font-mono text-sm"
                  data-testid="textarea-html-wrapper"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <CardTitle>Default Values JSON</CardTitle>
                </div>
                <CardDescription>Default content values for blocks (optional)</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={defaultValuesJsonString}
                  onChange={(e) => setDefaultValuesJsonString(e.target.value)}
                  placeholder="{}"
                  rows={6}
                  className="font-mono text-sm"
                  data-testid="textarea-default-values"
                />
              </CardContent>
            </Card>

            {selectedTemplate && (
              <TemplateBlockOverridesSection templateId={selectedTemplate.id} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Newsletter Templates</h1>
          <p className="text-muted-foreground mt-1">Define reusable newsletter structures</p>
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
              <FileText className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Templates</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-count">{templates?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Global Templates</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-global-count">
              {templates?.filter(t => t.locale === 'global').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Zones</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-avg-blocks">
              {templates?.length 
                ? Math.round(templates.reduce((sum, t) => sum + t.zones.length, 0) / templates.length)
                : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>Manage your newsletter template library</CardDescription>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Zones</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} data-testid={`row-template-${template.id}`}>
                    <TableCell className="font-medium" data-testid={`text-name-${template.id}`}>
                      {template.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate" data-testid={`text-description-${template.id}`}>
                      {template.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getLocaleColor(template.locale)} text-white`} data-testid={`badge-locale-${template.id}`}>
                        {template.locale === 'global' ? 'Global' : template.locale.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-zones-${template.id}`}>
                      {template.zones.length} zones
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm" data-testid={`text-created-${template.id}`}>
                      {formatDate(template.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm" data-testid={`text-updated-${template.id}`}>
                      {formatDate(template.updatedAt)}
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
                            if (confirm('Are you sure you want to delete this template?')) {
                              deleteMutation.mutate(template.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
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
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No templates yet</p>
              <p className="text-sm">Create your first newsletter template to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
