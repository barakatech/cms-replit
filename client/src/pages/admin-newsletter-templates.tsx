import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  ArrowLeft,
  Edit,
  Trash2,
  ChevronDown,
  FileText,
  Star,
  Newspaper,
  TrendingUp,
  DollarSign,
  Users,
  Lightbulb,
  Send,
  Layout,
  Globe,
  Save
} from 'lucide-react';
import type { NewsletterTemplate } from '@shared/schema';

type ZoneType = 'header' | 'body' | 'footer';

interface TemplateBlockType {
  id: string;
  templateId: string;
  zone: ZoneType;
  typeKey: string;
  displayName: string;
  description: string;
  schema: Record<string, unknown>;
  defaultValues: Record<string, unknown>;
  isRequired: boolean;
  isEnabled: boolean;
}

interface TemplateZone {
  id: string;
  templateId: string;
  zone: ZoneType;
  maxBlocks: number;
}

const BLOCK_TYPE_DEFINITIONS = [
  { 
    typeKey: 'hero', 
    displayName: 'Hero Banner', 
    description: 'Main hero section with title and image',
    icon: Layout,
    defaultSchema: {
      title: { type: 'text', label: 'Title' },
      content: { type: 'textarea', label: 'Content' },
      imageUrl: { type: 'text', label: 'Image URL' },
      ctaText: { type: 'text', label: 'CTA Text' },
      ctaUrl: { type: 'text', label: 'CTA URL' }
    },
    defaultValues: { title: '', content: '', imageUrl: '', ctaText: '', ctaUrl: '' }
  },
  { 
    typeKey: 'introduction', 
    displayName: 'Introduction', 
    description: 'Text introduction section',
    icon: FileText,
    defaultSchema: {
      text: { type: 'textarea', label: 'Text' }
    },
    defaultValues: { text: '' }
  },
  { 
    typeKey: 'featured_content', 
    displayName: 'Featured Content', 
    description: 'Highlighted content section',
    icon: Star,
    defaultSchema: {
      headline: { type: 'text', label: 'Headline' },
      body: { type: 'textarea', label: 'Body' },
      imageUrl: { type: 'text', label: 'Image URL' },
      linkUrl: { type: 'text', label: 'Link URL' }
    },
    defaultValues: { headline: '', body: '', imageUrl: '', linkUrl: '' }
  },
  { 
    typeKey: 'articles_list', 
    displayName: 'Articles List', 
    description: 'List of articles with excerpts',
    icon: Newspaper,
    defaultSchema: {
      sourceType: { type: 'select', label: 'Source Type', options: ['internal', 'external'] },
      numberOfArticles: { type: 'number', label: 'Number of Articles', min: 1, max: 20 },
      internalMode: { type: 'select', label: 'Internal Mode', options: ['manual', 'latest'] }
    },
    defaultValues: { sourceType: 'internal', numberOfArticles: 5, internalMode: 'latest' }
  },
  { 
    typeKey: 'stock_collection', 
    displayName: 'Stock Collection', 
    description: 'Display a collection of stocks',
    icon: TrendingUp,
    defaultSchema: {
      mode: { type: 'select', label: 'Mode', options: ['manual', 'dynamic'] },
      limit: { type: 'number', label: 'Limit', min: 1, max: 20 },
      dynamicType: { type: 'select', label: 'Dynamic Type', options: ['top_traded', 'gainers', 'losers', 'most_viewed'] }
    },
    defaultValues: { mode: 'dynamic', limit: 5, dynamicType: 'top_traded' }
  },
  { 
    typeKey: 'assets_under_500', 
    displayName: 'Assets Under $500', 
    description: 'Stocks priced under $500',
    icon: DollarSign,
    defaultSchema: {
      maxPrice: { type: 'number', label: 'Max Price', min: 1, max: 1000 },
      limit: { type: 'number', label: 'Limit', min: 1, max: 20 },
      sortBy: { type: 'select', label: 'Sort By', options: ['price_asc', 'price_desc', 'volume'] }
    },
    defaultValues: { maxPrice: 500, limit: 5, sortBy: 'price_asc' }
  },
  { 
    typeKey: 'what_users_picked', 
    displayName: 'What Users Picked', 
    description: 'Popular user stock picks',
    icon: Users,
    defaultSchema: {
      timeWindow: { type: 'select', label: 'Time Window', options: ['24h', '7d', '30d'] },
      limit: { type: 'number', label: 'Limit', min: 1, max: 20 }
    },
    defaultValues: { timeWindow: '24h', limit: 5 }
  },
  { 
    typeKey: 'asset_highlight', 
    displayName: 'Asset Highlight', 
    description: 'Spotlight on a specific asset',
    icon: Star,
    defaultSchema: {
      ticker: { type: 'stock_search', label: 'Stock' },
      headline: { type: 'text', label: 'Headline' },
      body: { type: 'textarea', label: 'Body' },
      ctaText: { type: 'text', label: 'CTA Text' },
      ctaUrl: { type: 'text', label: 'CTA URL' }
    },
    defaultValues: { ticker: '', headline: '', body: '', ctaText: '', ctaUrl: '' }
  },
  { 
    typeKey: 'term_of_the_day', 
    displayName: 'Term of the Day', 
    description: 'Educational term with definition',
    icon: Lightbulb,
    defaultSchema: {
      term: { type: 'text', label: 'Term' },
      definition: { type: 'textarea', label: 'Definition' },
      example: { type: 'textarea', label: 'Example' },
      learnMoreUrl: { type: 'text', label: 'Learn More URL' }
    },
    defaultValues: { term: '', definition: '', example: '', learnMoreUrl: '' }
  },
  { 
    typeKey: 'in_other_news', 
    displayName: 'In Other News', 
    description: 'Additional news items',
    icon: Newspaper,
    defaultSchema: {
      sourceType: { type: 'select', label: 'Source Type', options: ['internal', 'external'] },
      limit: { type: 'number', label: 'Limit', min: 1, max: 10 }
    },
    defaultValues: { sourceType: 'external', limit: 3 }
  },
  { 
    typeKey: 'call_to_action', 
    displayName: 'Call to Action', 
    description: 'CTA button section',
    icon: Send,
    defaultSchema: {
      title: { type: 'text', label: 'Title' },
      body: { type: 'textarea', label: 'Body' },
      buttonText: { type: 'text', label: 'Button Text' },
      buttonUrl: { type: 'text', label: 'Button URL' }
    },
    defaultValues: { title: '', body: '', buttonText: '', buttonUrl: '' }
  },
  { 
    typeKey: 'footer', 
    displayName: 'Footer', 
    description: 'Newsletter footer with legal text',
    icon: Layout,
    defaultSchema: {
      legalText: { type: 'textarea', label: 'Legal Text' },
      unsubscribeText: { type: 'text', label: 'Unsubscribe Text' }
    },
    defaultValues: { legalText: '', unsubscribeText: 'Unsubscribe' }
  }
];

function TemplateList({ onEdit, onCreate }: { onEdit: (id: string) => void; onCreate: () => void }) {
  const { data: templates, isLoading } = useQuery<NewsletterTemplate[]>({
    queryKey: ['/api/newsletter-templates'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/newsletter-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Templates</h1>
          <p className="text-muted-foreground">Configure templates with zones and block type defaults</p>
        </div>
        <Button onClick={onCreate} data-testid="button-create-template">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {templates && templates.length > 0 ? (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover-elevate" data-testid={`template-card-${template.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      {template.locale?.toUpperCase() || 'EN'}
                    </Badge>
                    <span className="text-xs">Created {new Date(template.createdAt).toLocaleDateString()}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(template.id)}
                    data-testid={`button-edit-${template.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteMutation.mutate(template.id)}
                    data-testid={`button-delete-${template.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layout className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create a template to define which blocks can be used in newsletters
            </p>
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TemplateEditor({ templateId, onBack }: { templateId: string; onBack: () => void }) {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState('');
  const [templateLocale, setTemplateLocale] = useState('en');
  const [activeZone, setActiveZone] = useState<ZoneType>('header');
  const [enabledBlocks, setEnabledBlocks] = useState<Record<string, Record<string, boolean>>>({
    header: {},
    body: {},
    footer: {}
  });
  const [blockDefaults, setBlockDefaults] = useState<Record<string, Record<string, Record<string, unknown>>>>({
    header: {},
    body: {},
    footer: {}
  });
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const isNew = templateId === 'new';

  const { data: template, isLoading } = useQuery<NewsletterTemplate>({
    queryKey: ['/api/newsletter-templates', templateId],
    enabled: !isNew && !!templateId,
  });

  const { data: blockTypes } = useQuery<TemplateBlockType[]>({
    queryKey: ['/api/newsletter-templates', templateId, 'block-types'],
    enabled: !isNew && !!templateId,
  });

  useState(() => {
    if (template) {
      setTemplateName(template.name);
      setTemplateLocale(template.locale || 'en');
    }
    if (blockTypes) {
      const enabled: Record<string, Record<string, boolean>> = { header: {}, body: {}, footer: {} };
      const defaults: Record<string, Record<string, Record<string, unknown>>> = { header: {}, body: {}, footer: {} };
      blockTypes.forEach(bt => {
        enabled[bt.zone][bt.typeKey] = bt.isEnabled;
        defaults[bt.zone][bt.typeKey] = bt.defaultValues;
      });
      setEnabledBlocks(enabled);
      setBlockDefaults(defaults);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { name: string; locale: string; blockTypes: Array<{ zone: ZoneType; typeKey: string; isEnabled: boolean; defaultValues: Record<string, unknown> }> }) => {
      if (isNew) {
        return apiRequest('POST', '/api/newsletter-templates', data);
      } else {
        return apiRequest('PUT', `/api/newsletter-templates/${templateId}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter-templates'] });
      toast({ title: isNew ? 'Template created' : 'Template saved' });
      if (isNew) onBack();
    },
    onError: () => toast({ title: 'Failed to save template', variant: 'destructive' }),
  });

  const handleSave = () => {
    const blockTypesData: Array<{ zone: ZoneType; typeKey: string; isEnabled: boolean; defaultValues: Record<string, unknown> }> = [];
    (['header', 'body', 'footer'] as ZoneType[]).forEach(zone => {
      BLOCK_TYPE_DEFINITIONS.forEach(def => {
        blockTypesData.push({
          zone,
          typeKey: def.typeKey,
          isEnabled: enabledBlocks[zone]?.[def.typeKey] || false,
          defaultValues: blockDefaults[zone]?.[def.typeKey] || def.defaultValues
        });
      });
    });
    saveMutation.mutate({ name: templateName, locale: templateLocale, blockTypes: blockTypesData });
  };

  const toggleBlock = (zone: ZoneType, typeKey: string) => {
    setEnabledBlocks(prev => ({
      ...prev,
      [zone]: {
        ...prev[zone],
        [typeKey]: !prev[zone]?.[typeKey]
      }
    }));
  };

  const updateBlockDefault = (zone: ZoneType, typeKey: string, field: string, value: unknown) => {
    setBlockDefaults(prev => ({
      ...prev,
      [zone]: {
        ...prev[zone],
        [typeKey]: {
          ...(prev[zone]?.[typeKey] || {}),
          [field]: value
        }
      }
    }));
  };

  if (isLoading && !isNew) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? 'Create Template' : 'Edit Template'}</h1>
            <p className="text-muted-foreground">Configure zones and block type defaults</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save">
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : 'Save Template'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Weekly Newsletter"
              data-testid="input-template-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-locale">Locale</Label>
            <Input
              id="template-locale"
              value={templateLocale}
              onChange={(e) => setTemplateLocale(e.target.value)}
              placeholder="en"
              data-testid="input-template-locale"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Zone Configuration</CardTitle>
          <CardDescription>Select which block types are allowed in each zone and configure defaults</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeZone} onValueChange={(v) => setActiveZone(v as ZoneType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="header" data-testid="tab-header">Header</TabsTrigger>
              <TabsTrigger value="body" data-testid="tab-body">Body</TabsTrigger>
              <TabsTrigger value="footer" data-testid="tab-footer">Footer</TabsTrigger>
            </TabsList>

            {(['header', 'body', 'footer'] as ZoneType[]).map((zone) => (
              <TabsContent key={zone} value={zone} className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {BLOCK_TYPE_DEFINITIONS.map((def) => {
                      const Icon = def.icon;
                      const isEnabled = enabledBlocks[zone]?.[def.typeKey] || false;
                      const isExpanded = expandedBlocks[`${zone}-${def.typeKey}`];
                      
                      return (
                        <Collapsible
                          key={def.typeKey}
                          open={isExpanded}
                          onOpenChange={(open) => setExpandedBlocks(prev => ({
                            ...prev,
                            [`${zone}-${def.typeKey}`]: open
                          }))}
                        >
                          <div className="border rounded-lg">
                            <div className="flex items-center gap-3 p-3">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={() => toggleBlock(zone, def.typeKey)}
                                data-testid={`switch-${zone}-${def.typeKey}`}
                              />
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{def.displayName}</p>
                                <p className="text-xs text-muted-foreground">{def.description}</p>
                              </div>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" disabled={!isEnabled}>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                              <Separator />
                              <div className="p-4 bg-muted/50 space-y-3">
                                <p className="text-xs font-medium text-muted-foreground">Default Values</p>
                                {Object.entries(def.defaultSchema).map(([fieldKey, fieldDef]) => {
                                  const fieldConfig = fieldDef as { type: string; label: string };
                                  const currentValue = blockDefaults[zone]?.[def.typeKey]?.[fieldKey] ?? def.defaultValues[fieldKey];
                                  
                                  return (
                                    <div key={fieldKey} className="space-y-1">
                                      <Label className="text-xs">{fieldConfig.label}</Label>
                                      {fieldConfig.type === 'textarea' ? (
                                        <Textarea
                                          value={String(currentValue || '')}
                                          onChange={(e) => updateBlockDefault(zone, def.typeKey, fieldKey, e.target.value)}
                                          rows={2}
                                          className="text-sm"
                                        />
                                      ) : fieldConfig.type === 'number' ? (
                                        <Input
                                          type="number"
                                          value={String(currentValue || '')}
                                          onChange={(e) => updateBlockDefault(zone, def.typeKey, fieldKey, parseInt(e.target.value))}
                                          className="text-sm"
                                        />
                                      ) : (
                                        <Input
                                          value={String(currentValue || '')}
                                          onChange={(e) => updateBlockDefault(zone, def.typeKey, fieldKey, e.target.value)}
                                          className="text-sm"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminNewsletterTemplates() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  const templateId = params.id;

  if (templateId) {
    return (
      <div className="p-6">
        <TemplateEditor
          templateId={templateId}
          onBack={() => setLocation('/admin/newsletter-templates')}
        />
      </div>
    );
  }

  if (editingTemplateId) {
    return (
      <div className="p-6">
        <TemplateEditor
          templateId={editingTemplateId}
          onBack={() => setEditingTemplateId(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <TemplateList
        onEdit={(id) => setLocation(`/admin/newsletter-templates/${id}/edit`)}
        onCreate={() => setEditingTemplateId('new')}
      />
    </div>
  );
}
