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
  Library,
  FileText,
  Star,
  DollarSign,
  Users,
  Lightbulb,
  Newspaper,
  Search
} from 'lucide-react';
import type { 
  Newsletter, 
  NewsletterBlockInstance, 
  NewsletterBlockType, 
  NewsletterBlockData,
  BlockLibraryTemplate,
  StockPage,
  SchemaBlockDefinition
} from '@shared/schema';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BLOCK_TYPES: { type: NewsletterBlockType; label: string; icon: typeof TrendingUp; category: string }[] = [
  { type: 'introduction', label: 'Introduction', icon: FileText, category: 'Content' },
  { type: 'featured_content', label: 'Featured Content', icon: Star, category: 'Content' },
  { type: 'articles_list', label: 'Articles List', icon: Newspaper, category: 'Content' },
  { type: 'stock_collection', label: 'Stock Collection', icon: TrendingUp, category: 'Stocks' },
  { type: 'assets_under_500', label: 'Assets Under $500', icon: DollarSign, category: 'Stocks' },
  { type: 'what_users_picked', label: 'What Users Picked', icon: Users, category: 'Stocks' },
  { type: 'asset_highlight', label: 'Asset Highlight', icon: Star, category: 'Stocks' },
  { type: 'term_of_the_day', label: 'Term Of The Day', icon: Lightbulb, category: 'Education' },
  { type: 'in_other_news', label: 'In Other News', icon: Newspaper, category: 'Content' },
  { type: 'call_to_action', label: 'Call To Action', icon: Send, category: 'Layout' },
];

const getBlockTypeLabel = (type: NewsletterBlockType): string => {
  const found = BLOCK_TYPES.find(b => b.type === type);
  return found?.label || type;
};

const getDefaultBlockData = (blockType: NewsletterBlockType): NewsletterBlockData => {
  switch (blockType) {
    case 'introduction':
      return { title: '', subtitle: '', body: '' };
    case 'featured_content':
      return { title: '', articles: [] };
    case 'articles_list':
      return { title: '', articles: [], showExcerpts: true };
    case 'stock_collection':
      return { title: '', description: '', stocks: [] };
    case 'assets_under_500':
      return { title: '', description: '', stocks: [] };
    case 'what_users_picked':
      return { title: '', description: '', stocks: [] };
    case 'asset_highlight':
      return { title: '', stockId: '', ticker: '', companyName: '', description: '', whyItMatters: '' };
    case 'term_of_the_day':
      return { term: '', definition: '', example: '', relatedTerms: [] };
    case 'in_other_news':
      return { title: '', newsItems: [] };
    case 'call_to_action':
      return { title: '', subtitle: '', buttonText: '', buttonUrl: '' };
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
  const [selectedBlockType, setSelectedBlockType] = useState<NewsletterBlockType>('introduction');
  const [overrideSettingsString, setOverrideSettingsString] = useState<string>('{}');
  const [showOverrideSettings, setShowOverrideSettings] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [addBlockMode, setAddBlockMode] = useState<'schema' | 'custom'>('schema');
  const [selectedSchemaDefinition, setSelectedSchemaDefinition] = useState<string>('');

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

  const { data: stockPages } = useQuery<StockPage[]>({
    queryKey: ['/api/stock-pages'],
  });

  const { data: blogPosts } = useQuery<Array<{ id: string; title_en: string; excerpt_en?: string; featuredImageUrl?: string; slug: string }>>({
    queryKey: ['/api/blog-posts'],
  });

  const { data: schemaDefinitions } = useQuery<SchemaBlockDefinition[]>({
    queryKey: ['/api/schema-block-definitions'],
  });

  const filteredStocks = stockSearchQuery.length >= 2 && stockPages 
    ? stockPages.filter(stock => 
        (stock.ticker?.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
         stock.companyName_en?.toLowerCase().includes(stockSearchQuery.toLowerCase()))
      )
    : [];

  const filteredArticles = articleSearchQuery.length >= 2 && blogPosts
    ? blogPosts.filter(article =>
        article.title_en?.toLowerCase().includes(articleSearchQuery.toLowerCase())
      )
    : [];

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
    if (addBlockMode === 'schema' && selectedSchemaDefinition) {
      const schemaDef = schemaDefinitions?.find(s => s.id === selectedSchemaDefinition);
      if (schemaDef) {
        const defaultData = (schemaDef.defaultSchemaJson || {}) as NewsletterBlockData;
        addBlockMutation.mutate({
          blockType: schemaDef.blockType,
          blockDataJson: { ...defaultData, ...blockEditorData },
        });
      }
    } else {
      addBlockMutation.mutate({
        blockType: selectedBlockType,
        blockDataJson: blockEditorData,
      });
    }
  };

  const handleSchemaDefinitionSelect = (definitionId: string) => {
    setSelectedSchemaDefinition(definitionId);
    const schemaDef = schemaDefinitions?.find(s => s.id === definitionId);
    if (schemaDef) {
      setSelectedBlockType(schemaDef.blockType);
      const defaultData = (schemaDef.defaultSchemaJson || {}) as NewsletterBlockData;
      setBlockEditorData(defaultData);
    }
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

    const d = data as Record<string, unknown>;

    switch (blockType) {
      case 'introduction':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Welcome to this week's newsletter"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={d.subtitle as string || ''}
                onChange={(e) => updateData('subtitle', e.target.value)}
                placeholder="Your weekly market update"
              />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea
                value={d.body as string || ''}
                onChange={(e) => updateData('body', e.target.value)}
                placeholder="Introduction text..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'featured_content':
      case 'articles_list':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder={blockType === 'featured_content' ? 'Featured This Week' : 'Latest Articles'}
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Articles</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search articles by title..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  data-testid="input-article-search"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (filteredArticles && filteredArticles.length > 0) {
                      const article = filteredArticles[0];
                      const articles = (d.articles as Array<Record<string, unknown>>) || [];
                      updateData('articles', [...articles, {
                        articleId: article.id,
                        articleTitle: article.title_en,
                        articleExcerpt: article.excerpt_en || '',
                        articleImageUrl: article.featuredImageUrl || '',
                        articleUrl: `/blog/${article.slug}`,
                      }]);
                      setArticleSearchQuery('');
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {articleSearchQuery && filteredArticles && filteredArticles.length > 0 && (
                <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                  {filteredArticles.slice(0, 5).map(article => (
                    <div
                      key={article.id}
                      className="p-2 hover-elevate cursor-pointer text-sm"
                      onClick={() => {
                        const articles = (d.articles as Array<Record<string, unknown>>) || [];
                        updateData('articles', [...articles, {
                          articleId: article.id,
                          articleTitle: article.title_en,
                          articleExcerpt: article.excerpt_en || '',
                          articleImageUrl: article.featuredImageUrl || '',
                          articleUrl: `/blog/${article.slug}`,
                        }]);
                        setArticleSearchQuery('');
                      }}
                    >
                      {article.title_en}
                    </div>
                  ))}
                </div>
              )}
              {((d.articles as Array<Record<string, unknown>>) || []).map((article, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                  <span className="flex-1 text-sm truncate">{article.articleTitle as string}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const articles = [...((d.articles as Array<Record<string, unknown>>) || [])];
                      articles.splice(idx, 1);
                      updateData('articles', articles);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stock_collection':
      case 'assets_under_500':
      case 'what_users_picked':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder={blockType === 'stock_collection' ? 'Stock Collection' : blockType === 'assets_under_500' ? 'Assets Under $500' : 'What Users Picked'}
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={d.description as string || ''}
                onChange={(e) => updateData('description', e.target.value)}
                placeholder="Brief description..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Stocks</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search stocks by ticker or name..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  data-testid="input-stock-search"
                />
              </div>
              {stockSearchQuery && filteredStocks && filteredStocks.length > 0 && (
                <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                  {filteredStocks.slice(0, 5).map(stock => (
                    <div
                      key={stock.id}
                      className="p-2 hover-elevate cursor-pointer text-sm flex justify-between"
                      onClick={() => {
                        const stocks = (d.stocks as Array<Record<string, unknown>>) || [];
                        updateData('stocks', [...stocks, {
                          stockId: stock.id,
                          ticker: stock.ticker,
                          companyName: stock.companyName_en,
                          note: '',
                        }]);
                        setStockSearchQuery('');
                      }}
                    >
                      <span className="font-medium">{stock.ticker}</span>
                      <span className="text-muted-foreground">{stock.companyName_en}</span>
                    </div>
                  ))}
                </div>
              )}
              {((d.stocks as Array<Record<string, unknown>>) || []).map((stock, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                  <span className="font-medium">{stock.ticker as string}</span>
                  <span className="flex-1 text-sm text-muted-foreground truncate">{stock.companyName as string}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const stocks = [...((d.stocks as Array<Record<string, unknown>>) || [])];
                      stocks.splice(idx, 1);
                      updateData('stocks', stocks);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'asset_highlight':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Asset Highlight"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Stock</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search stocks..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  data-testid="input-stock-search"
                />
              </div>
              {stockSearchQuery && filteredStocks && filteredStocks.length > 0 && (
                <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                  {filteredStocks.slice(0, 5).map(stock => (
                    <div
                      key={stock.id}
                      className="p-2 hover-elevate cursor-pointer text-sm flex justify-between"
                      onClick={() => {
                        updateData('stockId', stock.id);
                        updateData('ticker', stock.ticker);
                        updateData('companyName', stock.companyName_en);
                        setStockSearchQuery('');
                      }}
                    >
                      <span className="font-medium">{stock.ticker}</span>
                      <span className="text-muted-foreground">{stock.companyName_en}</span>
                    </div>
                  ))}
                </div>
              )}
              {d.ticker && (
                <div className="p-2 border rounded-lg flex items-center gap-2">
                  <span className="font-medium">{String(d.ticker || '')}</span>
                  <span className="text-muted-foreground">{String(d.companyName || '')}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={d.description as string || ''}
                onChange={(e) => updateData('description', e.target.value)}
                placeholder="Why this stock matters..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Why It Matters</Label>
              <Textarea
                value={d.whyItMatters as string || ''}
                onChange={(e) => updateData('whyItMatters', e.target.value)}
                placeholder="Key reasons to watch..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'term_of_the_day':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Term *</Label>
              <Input
                value={d.term as string || ''}
                onChange={(e) => updateData('term', e.target.value)}
                placeholder="e.g., Dividend Yield"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Definition *</Label>
              <Textarea
                value={d.definition as string || ''}
                onChange={(e) => updateData('definition', e.target.value)}
                placeholder="Clear definition..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Example</Label>
              <Textarea
                value={d.example as string || ''}
                onChange={(e) => updateData('example', e.target.value)}
                placeholder="Real-world example..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'in_other_news':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="In Other News"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>News Items</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newsItems = (d.newsItems as Array<Record<string, unknown>>) || [];
                  updateData('newsItems', [...newsItems, { headline: '', source: '', url: '', summary: '' }]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add News Item
              </Button>
              {((d.newsItems as Array<Record<string, unknown>>) || []).map((item, idx) => (
                <div key={idx} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Item {idx + 1}</Label>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const newsItems = [...((d.newsItems as Array<Record<string, unknown>>) || [])];
                        newsItems.splice(idx, 1);
                        updateData('newsItems', newsItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.headline as string || ''}
                    onChange={(e) => {
                      const newsItems = [...((d.newsItems as Array<Record<string, unknown>>) || [])];
                      newsItems[idx] = { ...newsItems[idx], headline: e.target.value };
                      updateData('newsItems', newsItems);
                    }}
                    placeholder="Headline"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={item.source as string || ''}
                      onChange={(e) => {
                        const newsItems = [...((d.newsItems as Array<Record<string, unknown>>) || [])];
                        newsItems[idx] = { ...newsItems[idx], source: e.target.value };
                        updateData('newsItems', newsItems);
                      }}
                      placeholder="Source"
                    />
                    <Input
                      value={item.url as string || ''}
                      onChange={(e) => {
                        const newsItems = [...((d.newsItems as Array<Record<string, unknown>>) || [])];
                        newsItems[idx] = { ...newsItems[idx], url: e.target.value };
                        updateData('newsItems', newsItems);
                      }}
                      placeholder="URL"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'call_to_action':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Ready to start investing?"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={d.subtitle as string || ''}
                onChange={(e) => updateData('subtitle', e.target.value)}
                placeholder="Join thousands of investors..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text *</Label>
                <Input
                  value={d.buttonText as string || ''}
                  onChange={(e) => updateData('buttonText', e.target.value)}
                  placeholder="Get Started"
                />
              </div>
              <div className="space-y-2">
                <Label>Button URL *</Label>
                <Input
                  value={d.buttonUrl as string || ''}
                  onChange={(e) => updateData('buttonUrl', e.target.value)}
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
                      <div className="flex-1" onClick={() => handleEditBlock(block)} data-testid={`button-edit-block-${block.id}`}>
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

      <Dialog open={addBlockDialogOpen} onOpenChange={(open) => {
        setAddBlockDialogOpen(open);
        if (!open) {
          setBlockEditorData({});
          setSelectedSchemaDefinition('');
          setAddBlockMode('schema');
        }
      }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
            <DialogDescription>
              Select a schema block definition or create a custom block
            </DialogDescription>
          </DialogHeader>
          <Tabs value={addBlockMode} onValueChange={(v) => {
            setAddBlockMode(v as 'schema' | 'custom');
            setBlockEditorData({});
            setSelectedSchemaDefinition('');
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schema" data-testid="tab-schema-block">From Schema</TabsTrigger>
              <TabsTrigger value="custom" data-testid="tab-custom-block">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="schema" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Select Schema Block</Label>
                <Select
                  value={selectedSchemaDefinition}
                  onValueChange={handleSchemaDefinitionSelect}
                >
                  <SelectTrigger data-testid="select-schema-definition">
                    <SelectValue placeholder="Choose a schema block..." />
                  </SelectTrigger>
                  <SelectContent>
                    {schemaDefinitions?.map((def) => (
                      <SelectItem key={def.id} value={def.id}>
                        <div className="flex flex-col">
                          <span>{def.name}</span>
                          <span className="text-xs text-muted-foreground">{getBlockTypeLabel(def.blockType)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSchemaDefinition && (
                  <p className="text-xs text-muted-foreground">
                    {schemaDefinitions?.find(d => d.id === selectedSchemaDefinition)?.description}
                  </p>
                )}
              </div>
              {selectedSchemaDefinition && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Edit Content (optional)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Modify the default values below, or add the block as-is
                    </p>
                    {renderBlockEditor(selectedBlockType, blockEditorData, true)}
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="custom" className="space-y-4 pt-4">
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
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddBlock}
              disabled={addBlockMutation.isPending || (addBlockMode === 'schema' && !selectedSchemaDefinition)}
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
