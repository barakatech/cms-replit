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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  FileText,
  Globe,
  Layers,
  Code,
  Eye
} from 'lucide-react';
import type { NewsletterTemplate, InsertNewsletterTemplate, StockPage } from '@shared/schema';

type ViewMode = 'list' | 'editor';

type BlockType = 'hero' | 'intro' | 'featured' | 'articles' | 'cta' | 'footer' | 'stockCollection';

interface SchemaBlock {
  type: BlockType;
  label: string;
  required: boolean;
  tickers?: string[];
}

interface EditingTemplate {
  name: string;
  description: string;
  locale: 'en' | 'ar' | 'global';
  schemaJson: {
    blocks: SchemaBlock[];
  };
  htmlWrapper: string;
  defaultValuesJson: Record<string, unknown>;
}

const BLOCK_TYPES: BlockType[] = ['hero', 'intro', 'featured', 'articles', 'stockCollection', 'cta', 'footer'];

const DEFAULT_BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero Section',
  intro: 'Introduction',
  featured: 'Featured Content',
  articles: 'Articles List',
  stockCollection: 'Stock Collection',
  cta: 'Call to Action',
  footer: 'Footer',
};

const DUMMY_PREVIEW_DATA = {
  hero: { title: 'Newsletter Title', subtitle: 'Your weekly update', imageUrl: 'https://placehold.co/600x200' },
  intro: { content: 'Welcome to this week\'s newsletter. Here are the highlights...' },
  featured: { title: 'Featured Story', content: 'This is the main story of the week.', imageUrl: 'https://placehold.co/400x200' },
  articles: { articles: [{ title: 'Article 1', excerpt: 'Short description...', url: '#' }, { title: 'Article 2', excerpt: 'Another piece...', url: '#' }] },
  stockCollection: { tickers: ['AAPL', 'GOOGL', 'MSFT'] },
  cta: { text: 'Get Started', url: '#', description: 'Take action now!' },
  footer: { content: '© 2024 Baraka. All rights reserved.' },
};

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
      schemaJson: {
        blocks: [
          { type: 'hero', label: 'Hero Section', required: true },
          { type: 'intro', label: 'Introduction', required: false },
          { type: 'cta', label: 'Call to Action', required: true },
          { type: 'footer', label: 'Footer', required: true },
        ],
      },
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
      schemaJson: template.schemaJson,
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
      schemaJson: { blocks: [...template.schemaJson.blocks] },
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
      schemaJson: editingTemplate.schemaJson,
      htmlWrapper: editingTemplate.htmlWrapper,
      defaultValuesJson: parsedDefaults,
    };

    if (selectedTemplate) {
      updateMutation.mutate({ id: selectedTemplate.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const addBlock = () => {
    if (!editingTemplate) return;
    const newBlock: SchemaBlock = {
      type: 'intro',
      label: 'New Block',
      required: false,
    };
    setEditingTemplate({
      ...editingTemplate,
      schemaJson: {
        blocks: [...editingTemplate.schemaJson.blocks, newBlock],
      },
    });
  };

  const removeBlock = (index: number) => {
    if (!editingTemplate) return;
    const blocks = [...editingTemplate.schemaJson.blocks];
    blocks.splice(index, 1);
    setEditingTemplate({
      ...editingTemplate,
      schemaJson: { blocks },
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingTemplate) return;
    const blocks = [...editingTemplate.schemaJson.blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setEditingTemplate({
      ...editingTemplate,
      schemaJson: { blocks },
    });
  };

  const updateBlock = (index: number, field: keyof SchemaBlock, value: string | boolean | string[]) => {
    if (!editingTemplate) return;
    const blocks = [...editingTemplate.schemaJson.blocks];
    blocks[index] = { ...blocks[index], [field]: value };
    setEditingTemplate({
      ...editingTemplate,
      schemaJson: { blocks },
    });
  };

  const updateBlockTickers = (index: number, ticker: string, action: 'add' | 'remove') => {
    if (!editingTemplate) return;
    const blocks = [...editingTemplate.schemaJson.blocks];
    const currentTickers = blocks[index].tickers || [];
    
    if (action === 'add' && currentTickers.length < 5 && !currentTickers.includes(ticker)) {
      blocks[index] = { ...blocks[index], tickers: [...currentTickers, ticker] };
    } else if (action === 'remove') {
      blocks[index] = { ...blocks[index], tickers: currentTickers.filter(t => t !== ticker) };
    }
    
    setEditingTemplate({
      ...editingTemplate,
      schemaJson: { blocks },
    });
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
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Schema Blocks</CardTitle>
                  <CardDescription>Define the content sections of your template</CardDescription>
                </div>
                <Button size="sm" onClick={addBlock} data-testid="button-add-block">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Block
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {editingTemplate.schemaJson.blocks.map((block, index) => (
                  <Card key={index} className="bg-surface2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="capitalize">{block.type}</Badge>
                          {block.required && <Badge className="bg-brand text-xs">Required</Badge>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveBlock(index, 'up')}
                            disabled={index === 0}
                            data-testid={`button-block-up-${index}`}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveBlock(index, 'down')}
                            disabled={index === editingTemplate.schemaJson.blocks.length - 1}
                            data-testid={`button-block-down-${index}`}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeBlock(index)}
                            data-testid={`button-block-delete-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={block.type}
                            onValueChange={(value: BlockType) => {
                              updateBlock(index, 'type', value);
                              updateBlock(index, 'label', DEFAULT_BLOCK_LABELS[value]);
                            }}
                          >
                            <SelectTrigger data-testid={`select-block-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {BLOCK_TYPES.map((t) => (
                                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={block.label}
                            onChange={(e) => updateBlock(index, 'label', e.target.value)}
                            placeholder="Block label..."
                            data-testid={`input-block-label-${index}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Checkbox
                          id={`required-${index}`}
                          checked={block.required}
                          onCheckedChange={(checked) => updateBlock(index, 'required', Boolean(checked))}
                          data-testid={`checkbox-block-required-${index}`}
                        />
                        <Label htmlFor={`required-${index}`} className="text-sm text-muted-foreground">
                          Required block
                        </Label>
                      </div>
                      
                      {block.type === 'stockCollection' && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Stock Tickers (3-5 required)</Label>
                            <span className="text-xs text-muted-foreground">
                              {(block.tickers || []).length}/5 selected
                            </span>
                          </div>
                          
                          {(block.tickers || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {(block.tickers || []).map((ticker) => {
                                const stock = stockPages.find(s => s.ticker === ticker);
                                return (
                                  <Badge 
                                    key={ticker} 
                                    variant="secondary" 
                                    className="flex items-center gap-1"
                                  >
                                    <span className="font-mono">{ticker}</span>
                                    {stock && (
                                      <span className="text-xs opacity-70 max-w-[100px] truncate">
                                        {stock.companyName_en}
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => updateBlockTickers(index, ticker, 'remove')}
                                      className="ml-1 hover:text-destructive"
                                      data-testid={`button-remove-ticker-${index}-${ticker}`}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                          
                          {(block.tickers || []).length < 5 && (
                            <Select
                              value=""
                              onValueChange={(ticker) => updateBlockTickers(index, ticker, 'add')}
                            >
                              <SelectTrigger data-testid={`select-add-ticker-${index}`}>
                                <SelectValue placeholder="Add a stock..." />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-[200px]">
                                  {stockPages
                                    .filter(s => !(block.tickers || []).includes(s.ticker))
                                    .slice(0, 50)
                                    .map((stock) => (
                                      <SelectItem key={stock.id} value={stock.ticker}>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono font-medium">{stock.ticker}</span>
                                          <span className="text-muted-foreground text-xs truncate max-w-[150px]">
                                            {stock.companyName_en}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          )}
                          
                          {(block.tickers || []).length < 3 && (
                            <p className="text-xs text-amber-600">
                              Please select at least 3 stocks for this collection
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {editingTemplate.schemaJson.blocks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No blocks defined. Click "Add Block" to get started.</p>
                  </div>
                )}
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
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <CardTitle>Preview</CardTitle>
                </div>
                <CardDescription>Template structure preview with dummy data</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[700px] border rounded-md bg-white p-4">
                  <div className="space-y-4" data-testid="preview-container">
                    {editingTemplate.schemaJson.blocks.map((block, index) => {
                      const dummyData = DUMMY_PREVIEW_DATA[block.type];
                      return (
                        <div 
                          key={index} 
                          className="border border-dashed border-gray-300 rounded-lg p-4"
                          data-testid={`preview-block-${index}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 uppercase">{block.label}</span>
                            {block.required && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          {block.type === 'hero' && (
                            <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-6 rounded">
                              <h2 className="text-xl font-bold">{(dummyData as typeof DUMMY_PREVIEW_DATA.hero).title}</h2>
                              <p className="text-sm opacity-80">{(dummyData as typeof DUMMY_PREVIEW_DATA.hero).subtitle}</p>
                            </div>
                          )}
                          {block.type === 'intro' && (
                            <p className="text-gray-600 text-sm">{(dummyData as typeof DUMMY_PREVIEW_DATA.intro).content}</p>
                          )}
                          {block.type === 'featured' && (
                            <div className="flex gap-4">
                              <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Image</div>
                              <div>
                                <h3 className="font-medium text-gray-800">{(dummyData as typeof DUMMY_PREVIEW_DATA.featured).title}</h3>
                                <p className="text-sm text-gray-600">{(dummyData as typeof DUMMY_PREVIEW_DATA.featured).content}</p>
                              </div>
                            </div>
                          )}
                          {block.type === 'articles' && (
                            <ul className="space-y-2">
                              {(dummyData as typeof DUMMY_PREVIEW_DATA.articles).articles.map((article, i) => (
                                <li key={i} className="border-l-2 border-gray-300 pl-3">
                                  <span className="font-medium text-sm text-gray-800">{article.title}</span>
                                  <p className="text-xs text-gray-500">{article.excerpt}</p>
                                </li>
                              ))}
                            </ul>
                          )}
                          {block.type === 'cta' && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-2">{(dummyData as typeof DUMMY_PREVIEW_DATA.cta).description}</p>
                              <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium">
                                {(dummyData as typeof DUMMY_PREVIEW_DATA.cta).text}
                              </button>
                            </div>
                          )}
                          {block.type === 'footer' && (
                            <div className="text-center text-xs text-gray-400 border-t pt-3">
                              {(dummyData as typeof DUMMY_PREVIEW_DATA.footer).content}
                            </div>
                          )}
                          {block.type === 'stockCollection' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-2">
                                {(block.tickers || (dummyData as typeof DUMMY_PREVIEW_DATA.stockCollection).tickers).map((ticker, i) => {
                                  const stock = stockPages.find(s => s.ticker === ticker);
                                  return (
                                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                      <div className="font-mono font-bold text-gray-800">{ticker}</div>
                                      <div className="text-xs text-gray-500 truncate">
                                        {stock?.companyName_en || 'Company Name'}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              {(block.tickers || []).length === 0 && (
                                <p className="text-xs text-gray-400 text-center">
                                  Select 3-5 stocks to display in this collection
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {editingTemplate.schemaJson.blocks.length === 0 && (
                      <div className="flex items-center justify-center h-[200px] text-gray-400">
                        <div className="text-center">
                          <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Add blocks to see preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
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
              <span className="text-xs text-muted-foreground">Avg Blocks</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-avg-blocks">
              {templates?.length 
                ? Math.round(templates.reduce((sum, t) => sum + t.schemaJson.blocks.length, 0) / templates.length)
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
                  <TableHead>Blocks</TableHead>
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
                    <TableCell data-testid={`text-blocks-${template.id}`}>
                      {template.schemaJson.blocks.length}
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
