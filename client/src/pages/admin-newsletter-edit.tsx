import { useState, useEffect, useRef, useCallback } from 'react';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
  Search,
  MoreVertical,
  Pencil,
  ChevronDown,
  Layers,
  Settings
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

const BLOCK_TYPES: { type: NewsletterBlockType; label: string; description: string; icon: typeof TrendingUp; category: string }[] = [
  { type: 'hero', label: 'Hero', description: 'Main hero banner', icon: Image, category: 'Layout' },
  { type: 'introduction', label: 'Introduction', description: 'Introduction paragraph', icon: FileText, category: 'Content' },
  { type: 'featured_content', label: 'Featured', description: 'Featured content section', icon: Star, category: 'Content' },
  { type: 'articles_list', label: 'Articles', description: 'List of articles', icon: Newspaper, category: 'Content' },
  { type: 'stock_collection', label: 'Stocks', description: 'Stock collection grid', icon: TrendingUp, category: 'Stocks' },
  { type: 'assets_under_500', label: 'Under $500', description: 'Affordable assets list', icon: DollarSign, category: 'Stocks' },
  { type: 'what_users_picked', label: 'User Picks', description: 'Popular user picks', icon: Users, category: 'Stocks' },
  { type: 'asset_highlight', label: 'Highlight', description: 'Single asset spotlight', icon: Star, category: 'Stocks' },
  { type: 'term_of_the_day', label: 'Term', description: 'Financial term education', icon: Lightbulb, category: 'Education' },
  { type: 'in_other_news', label: 'News', description: 'External news links', icon: Newspaper, category: 'Content' },
  { type: 'call_to_action', label: 'CTA', description: 'Call to action button', icon: Send, category: 'Layout' },
  { type: 'footer', label: 'Footer', description: 'Newsletter footer', icon: Library, category: 'Layout' },
];

interface BlockData {
  title?: string;
  subtitle?: string;
  body?: string;
  articles?: Array<{ articleId?: string; title?: string; excerpt?: string }>;
  externalItems?: Array<{ title?: string; source?: string; url?: string; imageUrl?: string }>;
  stocks?: Array<{ ticker?: string; companyName?: string }>;
  term?: string;
  definition?: string;
  example?: string;
  buttonText?: string;
  buttonUrl?: string;
  newsItems?: Array<{ headline?: string; source?: string; url?: string }>;
  stockId?: string;
  ticker?: string;
  companyName?: string;
  description?: string;
  imageUrl?: string;
  sourceType?: string;
  mode?: string;
  dynamicType?: string;
  timeWindow?: string;
  limit?: number;
  maxPrice?: number;
  sortBy?: string;
}

function renderBlockPreview(block: NewsletterBlockInstance) {
  const data = (block.blockDataJson as BlockData) || {};
  const blockType = block.blockType;

  switch (blockType) {
    case 'hero':
      return (
        <div style={{ marginBottom: '24px', position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #00d4aa 0%, #0a5a4a 100%)' }} />
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
            {data.title && <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>{data.title}</h1>}
            {data.subtitle && <p style={{ fontSize: '14px', color: '#ccc', margin: '4px 0 0 0' }}>{data.subtitle}</p>}
          </div>
        </div>
      );

    case 'introduction':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#00d4aa' }}>{data.title}</h2>}
          {data.subtitle && <p style={{ fontSize: '16px', color: '#999', marginBottom: '12px' }}>{data.subtitle}</p>}
          {data.body && <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>{data.body}</p>}
        </div>
      );

    case 'featured_content':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '12px', color: '#00d4aa', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured</h3>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>{data.title}</h2>}
          {data.imageUrl && <img src={data.imageUrl} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />}
          {data.articles && data.articles.length > 0 && (
            <div>
              {data.articles.map((article, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: idx < data.articles!.length - 1 ? '1px solid #333' : 'none' }}>
                  <p style={{ fontWeight: '600', color: 'white' }}>{article.title || 'Untitled Article'}</p>
                  {article.excerpt && <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>{article.excerpt}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'articles_list':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>{data.title}</h3>}
          {data.sourceType === 'external' && data.externalItems && data.externalItems.length > 0 ? (
            <div>
              {data.externalItems.map((item, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #333' }}>
                  <p style={{ fontWeight: '600', color: 'white' }}>{item.title || 'Untitled'}</p>
                  {item.source && <p style={{ fontSize: '12px', color: '#666' }}>Source: {item.source}</p>}
                </div>
              ))}
            </div>
          ) : data.articles && data.articles.length > 0 ? (
            <div>
              {data.articles.map((article, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #333' }}>
                  <p style={{ fontWeight: '600', color: 'white' }}>{article.title || 'Untitled Article'}</p>
                  {article.excerpt && <p style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>{article.excerpt}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No articles selected</p>
          )}
        </div>
      );

    case 'stock_collection':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>{data.title}</h3>}
          {data.mode === 'dynamic' ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>Dynamic: {data.dynamicType?.replace('_', ' ').toUpperCase() || 'Top Traded'}</p>
          ) : data.stocks && data.stocks.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
              {data.stocks.map((stock, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 'bold', color: '#00d4aa', fontSize: '14px' }}>{stock.ticker}</p>
                  <p style={{ fontSize: '10px', color: '#999' }}>{stock.companyName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No stocks selected</p>
          )}
        </div>
      );

    case 'assets_under_500':
    case 'what_users_picked':
      return (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>{data.title}</h3>}
          <p style={{ color: '#999', fontSize: '12px' }}>
            {blockType === 'assets_under_500' ? `Max: $${data.maxPrice || 500}` : `Window: ${data.timeWindow || '24h'}`} | Limit: {data.limit || 5}
          </p>
          {data.stocks && data.stocks.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.stocks.map((stock, idx) => (
                <span key={idx} style={{ padding: '4px 10px', backgroundColor: '#00d4aa', color: 'white', borderRadius: '12px', fontSize: '11px' }}>
                  {stock.ticker}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case 'asset_highlight':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '2px solid #00d4aa' }}>
          <h3 style={{ fontSize: '12px', color: '#00d4aa', marginBottom: '8px', textTransform: 'uppercase' }}>Asset Highlight</h3>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{data.title}</h2>}
          {data.ticker && <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d4aa', margin: '8px 0' }}>{data.ticker}</p>}
          {data.companyName && <p style={{ color: '#999' }}>{data.companyName}</p>}
          {data.description && <p style={{ marginTop: '12px', color: '#ccc', lineHeight: '1.6' }}>{data.description}</p>}
        </div>
      );

    case 'term_of_the_day':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #00d4aa' }}>
          <h3 style={{ fontSize: '12px', color: '#00d4aa', marginBottom: '8px', textTransform: 'uppercase' }}>Term of the Day</h3>
          {data.term && <p style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>{data.term}</p>}
          {data.definition && <p style={{ marginTop: '8px', color: '#ccc', lineHeight: '1.6' }}>{data.definition}</p>}
          {data.example && (
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Example:</p>
              <p style={{ color: '#999', fontStyle: 'italic', fontSize: '13px' }}>{data.example}</p>
            </div>
          )}
        </div>
      );

    case 'in_other_news':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>{data.title}</h3>}
          {data.newsItems && data.newsItems.length > 0 ? (
            <div>
              {data.newsItems.map((item, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
                  <p style={{ color: 'white' }}>{item.headline || 'Untitled'}</p>
                  {item.source && <p style={{ fontSize: '12px', color: '#666' }}>{item.source}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No news items</p>
          )}
        </div>
      );

    case 'call_to_action':
      return (
        <div style={{ marginBottom: '24px', textAlign: 'center', padding: '24px', backgroundColor: '#0a0a0a', borderRadius: '8px' }}>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{data.title}</h2>}
          {data.body && <p style={{ color: '#999', marginBottom: '16px' }}>{data.body}</p>}
          {data.buttonText && (
            <span style={{ display: 'inline-block', padding: '12px 32px', backgroundColor: '#00d4aa', color: 'white', fontWeight: 'bold', borderRadius: '4px' }}>
              {data.buttonText}
            </span>
          )}
        </div>
      );

    case 'footer':
      return (
        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#0a0a0a', borderTop: '1px solid #222', textAlign: 'center' }}>
          {data.body && <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>{data.body}</p>}
          <div style={{ marginTop: '12px' }}>
            <a href="#" style={{ color: '#00d4aa', fontSize: '11px', marginRight: '16px' }}>Unsubscribe</a>
            <a href="#" style={{ color: '#00d4aa', fontSize: '11px' }}>Preferences</a>
          </div>
        </div>
      );

    default:
      return (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <p style={{ color: '#999' }}>Block: {getBlockTypeLabel(blockType)}</p>
        </div>
      );
  }
}

function LivePreviewPanel({ newsletter, blocks }: { newsletter: Newsletter; blocks: NewsletterBlockInstance[] }) {
  const sortedBlocks = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);
  
  return (
    <div className="bg-background rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Live Preview</h3>
        <p className="text-xs text-muted-foreground">HTML output preview</p>
      </div>
      <ScrollArea className="flex-1">
        <div style={{ backgroundColor: '#0a0a0a', minHeight: '100%', padding: '20px' }}>
          <div style={{ maxWidth: '100%', backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#00d4aa' }}>baraka</span>
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
                {newsletter.subject}
              </h1>
              {newsletter.preheader && (
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{newsletter.preheader}</p>
              )}
            </div>

            <div style={{ padding: '20px' }}>
              {sortedBlocks.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No content blocks yet</p>
              ) : (
                sortedBlocks.map((block) => (
                  <div key={block.id}>
                    {renderBlockPreview(block)}
                  </div>
                ))
              )}
            </div>

            <div style={{ backgroundColor: '#0a0a0a', padding: '16px', textAlign: 'center', borderTop: '1px solid #222' }}>
              <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>
                <a href="#" style={{ color: '#00d4aa' }}>Unsubscribe</a> | <a href="#" style={{ color: '#00d4aa' }}>Preferences</a>
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

const getBlockTypeLabel = (type: NewsletterBlockType): string => {
  const found = BLOCK_TYPES.find(b => b.type === type);
  return found?.label || type;
};

interface InlineBlockEditorProps {
  block: NewsletterBlockInstance;
  onUpdate: (data: NewsletterBlockData) => void;
  stockPages?: StockPage[];
  blogPosts?: Array<{ id: string; title_en: string; excerpt_en?: string; featuredImageUrl?: string; slug: string }>;
}

function InlineBlockEditor({ block, onUpdate, stockPages, blogPosts }: InlineBlockEditorProps) {
  const [data, setData] = useState<Record<string, unknown>>(block.blockDataJson as Record<string, unknown> || {});
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  const updateField = useCallback((field: string, value: unknown) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newData as NewsletterBlockData);
    }, 800);
  }, [data, onUpdate]);
  
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const filteredStocks = stockSearchQuery.length >= 2 && stockPages 
    ? stockPages.filter(stock => 
        (stock.ticker?.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
         stock.companyName_en?.toLowerCase().includes(stockSearchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const filteredArticles = articleSearchQuery.length >= 2 && blogPosts
    ? blogPosts.filter(article =>
        article.title_en?.toLowerCase().includes(articleSearchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  switch (block.blockType) {
    case 'introduction':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Newsletter title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Subtitle</Label>
            <Input
              value={data.subtitle as string || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="Brief subtitle"
              data-testid="inline-input-subtitle"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Content</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Introduction content..."
              rows={3}
              data-testid="inline-input-body"
            />
          </div>
        </div>
      );

    case 'featured_content':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Featured section title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Image URL</Label>
            <Input
              value={data.imageUrl as string || ''}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="/attached_assets/..."
              data-testid="inline-input-imageUrl"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={data.description as string || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Description..."
              rows={2}
              data-testid="inline-input-description"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Articles (search to add)</Label>
            <Input
              value={articleSearchQuery}
              onChange={(e) => setArticleSearchQuery(e.target.value)}
              placeholder="Search articles..."
            />
            {filteredArticles.length > 0 && (
              <div className="border rounded max-h-32 overflow-y-auto">
                {filteredArticles.map(article => (
                  <div
                    key={article.id}
                    className="p-2 hover-elevate cursor-pointer text-sm"
                    onClick={() => {
                      const articles = (data.articles as Array<Record<string, unknown>>) || [];
                      updateField('articles', [...articles, { articleId: article.id, title: article.title_en }]);
                      setArticleSearchQuery('');
                    }}
                  >
                    {article.title_en}
                  </div>
                ))}
              </div>
            )}
            {((data.articles as Array<Record<string, unknown>>) || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {((data.articles as Array<Record<string, unknown>>) || []).map((a, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {a.title as string}
                    <button onClick={() => {
                      const articles = [...((data.articles as Array<Record<string, unknown>>) || [])];
                      articles.splice(i, 1);
                      updateField('articles', articles);
                    }} className="ml-1">&times;</button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'articles_list':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Articles section title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Articles (search to add)</Label>
            <Input
              value={articleSearchQuery}
              onChange={(e) => setArticleSearchQuery(e.target.value)}
              placeholder="Search articles..."
            />
            {filteredArticles.length > 0 && (
              <div className="border rounded max-h-32 overflow-y-auto">
                {filteredArticles.map(article => (
                  <div
                    key={article.id}
                    className="p-2 hover-elevate cursor-pointer text-sm"
                    onClick={() => {
                      const articles = (data.articles as Array<Record<string, unknown>>) || [];
                      updateField('articles', [...articles, { articleId: article.id, title: article.title_en }]);
                      setArticleSearchQuery('');
                    }}
                  >
                    {article.title_en}
                  </div>
                ))}
              </div>
            )}
            {((data.articles as Array<Record<string, unknown>>) || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {((data.articles as Array<Record<string, unknown>>) || []).map((a, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {a.title as string}
                    <button onClick={() => {
                      const articles = [...((data.articles as Array<Record<string, unknown>>) || [])];
                      articles.splice(i, 1);
                      updateField('articles', articles);
                    }} className="ml-1">&times;</button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'stock_collection':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Stock collection title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={data.description as string || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Description..."
              rows={2}
              data-testid="inline-input-description"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Stocks (search to add)</Label>
            <Input
              value={stockSearchQuery}
              onChange={(e) => setStockSearchQuery(e.target.value)}
              placeholder="Search stocks..."
            />
            {filteredStocks.length > 0 && (
              <div className="border rounded max-h-32 overflow-y-auto">
                {filteredStocks.map(stock => (
                  <div
                    key={stock.id}
                    className="p-2 hover-elevate cursor-pointer text-sm"
                    onClick={() => {
                      const stocks = (data.stocks as Array<Record<string, unknown>>) || [];
                      updateField('stocks', [...stocks, { stockId: stock.id, ticker: stock.ticker, companyName: stock.companyName_en }]);
                      setStockSearchQuery('');
                    }}
                  >
                    <span className="font-medium text-primary">{stock.ticker}</span> - {stock.companyName_en}
                  </div>
                ))}
              </div>
            )}
            {((data.stocks as Array<Record<string, unknown>>) || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {((data.stocks as Array<Record<string, unknown>>) || []).map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {s.ticker as string}
                    <button onClick={() => {
                      const stocks = [...((data.stocks as Array<Record<string, unknown>>) || [])];
                      stocks.splice(i, 1);
                      updateField('stocks', stocks);
                    }} className="ml-1">&times;</button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case 'asset_highlight':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Highlight title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Stock (search)</Label>
            <Input
              value={stockSearchQuery || data.ticker as string || ''}
              onChange={(e) => setStockSearchQuery(e.target.value)}
              placeholder="Search for a stock..."
            />
            {filteredStocks.length > 0 && (
              <div className="border rounded max-h-32 overflow-y-auto">
                {filteredStocks.map(stock => (
                  <div
                    key={stock.id}
                    className="p-2 hover-elevate cursor-pointer text-sm"
                    onClick={() => {
                      updateField('stockId', stock.id);
                      updateField('ticker', stock.ticker);
                      updateField('companyName', stock.companyName_en);
                      setStockSearchQuery('');
                    }}
                  >
                    <span className="font-medium text-primary">{stock.ticker}</span> - {stock.companyName_en}
                  </div>
                ))}
              </div>
            )}
            {typeof data.ticker === 'string' && data.ticker && (
              <div className="text-sm text-muted-foreground">
                Selected: <span className="font-medium text-primary">{data.ticker}</span> - {typeof data.companyName === 'string' ? data.companyName : ''}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={data.description as string || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Why this asset is highlighted..."
              rows={3}
              data-testid="inline-input-description"
            />
          </div>
        </div>
      );

    case 'term_of_the_day':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Term of the Day"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Term</Label>
            <Input
              value={data.term as string || ''}
              onChange={(e) => updateField('term', e.target.value)}
              placeholder="Financial term"
              data-testid="inline-input-term"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Definition</Label>
            <Textarea
              value={data.definition as string || ''}
              onChange={(e) => updateField('definition', e.target.value)}
              placeholder="Term definition..."
              rows={2}
              data-testid="inline-input-definition"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Example</Label>
            <Textarea
              value={data.example as string || ''}
              onChange={(e) => updateField('example', e.target.value)}
              placeholder="Example usage..."
              rows={2}
              data-testid="inline-input-example"
            />
          </div>
        </div>
      );

    case 'in_other_news':
      const newsItems = (data.newsItems as Array<Record<string, unknown>>) || [];
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="In Other News"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">News Items</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateField('newsItems', [...newsItems, { headline: '', source: '', url: '' }])}
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            {newsItems.map((item, idx) => (
              <div key={idx} className="p-2 border rounded space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Item {idx + 1}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
                    const items = [...newsItems];
                    items.splice(idx, 1);
                    updateField('newsItems', items);
                  }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input
                  value={item.headline as string || ''}
                  onChange={(e) => {
                    const items = [...newsItems];
                    items[idx] = { ...items[idx], headline: e.target.value };
                    updateField('newsItems', items);
                  }}
                  placeholder="Headline"
                  className="text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={item.source as string || ''}
                    onChange={(e) => {
                      const items = [...newsItems];
                      items[idx] = { ...items[idx], source: e.target.value };
                      updateField('newsItems', items);
                    }}
                    placeholder="Source"
                    className="text-sm"
                  />
                  <Input
                    value={item.url as string || ''}
                    onChange={(e) => {
                      const items = [...newsItems];
                      items[idx] = { ...items[idx], url: e.target.value };
                      updateField('newsItems', items);
                    }}
                    placeholder="URL"
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'call_to_action':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="CTA heading"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Content</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="CTA description..."
              rows={2}
              data-testid="inline-input-body"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA Text</Label>
              <Input
                value={data.buttonText as string || ''}
                onChange={(e) => updateField('buttonText', e.target.value)}
                placeholder="Button text"
                data-testid="inline-input-buttonText"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA URL</Label>
              <Input
                value={data.buttonUrl as string || ''}
                onChange={(e) => updateField('buttonUrl', e.target.value)}
                placeholder="https://..."
                data-testid="inline-input-buttonUrl"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Image URL</Label>
            <Input
              value={data.imageUrl as string || ''}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="/attached_assets/..."
              data-testid="inline-input-imageUrl"
            />
          </div>
        </div>
      );

    case 'assets_under_500':
    case 'what_users_picked':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Section title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={data.description as string || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Description..."
              rows={2}
              data-testid="inline-input-description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Limit</Label>
              <Input
                type="number"
                value={data.limit as number || 5}
                onChange={(e) => updateField('limit', parseInt(e.target.value) || 5)}
                min={1}
                max={20}
              />
            </div>
            {block.blockType === 'assets_under_500' && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Max Price ($)</Label>
                <Input
                  type="number"
                  value={data.maxPrice as number || 500}
                  onChange={(e) => updateField('maxPrice', parseInt(e.target.value) || 500)}
                  min={1}
                />
              </div>
            )}
            {block.blockType === 'what_users_picked' && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Time Window</Label>
                <Select
                  value={data.timeWindow as string || '7d'}
                  onValueChange={(v) => updateField('timeWindow', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Block title"
              data-testid="inline-input-title"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Block type: {block.blockType}
          </div>
        </div>
      );
  }
}

const getDefaultBlockData = (blockType: NewsletterBlockType): NewsletterBlockData => {
  switch (blockType) {
    case 'hero':
      return { title: '', subtitle: '', imageUrl: '', ctaText: '', ctaUrl: '' };
    case 'introduction':
      return { title: '', subtitle: '', body: '' };
    case 'featured_content':
      return { title: '', sourceType: 'internal', selectionMode: 'manual', numberOfArticles: 3, articles: [] };
    case 'articles_list':
      return { title: '', sourceType: 'internal', selectionMode: 'manual', numberOfArticles: 5, articles: [], showExcerpts: true };
    case 'stock_collection':
      return { title: '', description: '', mode: 'manual', limit: 5, stocks: [], dynamicType: 'top_traded' };
    case 'assets_under_500':
      return { title: '', description: '', maxPrice: 500, limit: 5, sortBy: 'volume', stocks: [] };
    case 'what_users_picked':
      return { title: '', description: '', timeWindow: '7d', limit: 5, stocks: [] };
    case 'asset_highlight':
      return { title: '', stockId: '', ticker: '', companyName: '', description: '', whyItMatters: '' };
    case 'term_of_the_day':
      return { term: '', definition: '', example: '', relatedTerms: [] };
    case 'in_other_news':
      return { title: '', sourceType: 'external', newsItems: [] };
    case 'call_to_action':
      return { title: '', subtitle: '', buttonText: '', buttonUrl: '' };
    case 'footer':
      return { body: '', legalText: '', unsubscribeText: 'Unsubscribe' };
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
  const [editingSchemaDefinition, setEditingSchemaDefinition] = useState<SchemaBlockDefinition | null>(null);
  const [schemaDefEditDialogOpen, setSchemaDefEditDialogOpen] = useState(false);
  const [schemaDefFormData, setSchemaDefFormData] = useState({
    name: '',
    description: '',
    defaultSchemaJson: '{}',
    defaultSettingsJson: '{}',
  });

  const newsletterId = params.id;

  const { data: newsletter, isLoading: newsletterLoading } = useQuery<Newsletter>({
    queryKey: ['/api/newsletters', newsletterId],
    enabled: !!newsletterId,
  });

  // Fetch the newsletter template if available
  const { data: newsletterTemplate } = useQuery<{
    id: string;
    name: string;
    description?: string;
    zones: Record<string, { enabled: boolean; blockTypes: Record<string, { enabled: boolean; defaults?: Record<string, unknown> }> }>;
  }>({
    queryKey: ['/api/newsletter-templates', newsletter?.templateId],
    enabled: !!newsletter?.templateId,
  });

  // Determine which block types are available based on template (if any)
  const getAvailableBlockTypes = () => {
    if (!newsletterTemplate?.zones) {
      // No template or zones - return all block types
      return BLOCK_TYPES;
    }
    
    const enabledBlockTypes = new Set<NewsletterBlockType>();
    Object.values(newsletterTemplate.zones).forEach(zone => {
      if (zone.enabled && zone.blockTypes) {
        Object.entries(zone.blockTypes).forEach(([blockType, config]) => {
          if (config.enabled) {
            enabledBlockTypes.add(blockType as NewsletterBlockType);
          }
        });
      }
    });
    
    // If no blocks enabled, return all (fallback)
    if (enabledBlockTypes.size === 0) {
      return BLOCK_TYPES;
    }
    
    return BLOCK_TYPES.filter(bt => enabledBlockTypes.has(bt.type));
  };

  const availableBlockTypes = getAvailableBlockTypes();

  // Get template defaults for a block type (merges base defaults with template defaults)
  const getBlockDataWithTemplateDefaults = (blockType: NewsletterBlockType): NewsletterBlockData => {
    const baseDefaults = getDefaultBlockData(blockType);
    
    if (!newsletterTemplate?.zones) {
      return baseDefaults;
    }
    
    // Find template defaults for this block type across all zones
    for (const zone of Object.values(newsletterTemplate.zones)) {
      if (zone.enabled && zone.blockTypes?.[blockType]?.enabled && zone.blockTypes[blockType].defaults) {
        return { ...baseDefaults, ...zone.blockTypes[blockType].defaults };
      }
    }
    
    return baseDefaults;
  };

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

  const updateSchemaDefMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string; defaultSchemaJson: Record<string, unknown>; defaultSettingsJson: Record<string, unknown> } }) =>
      apiRequest('PUT', `/api/schema-block-definitions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-block-definitions'] });
      toast({ title: 'Schema definition updated' });
      setSchemaDefEditDialogOpen(false);
      setEditingSchemaDefinition(null);
    },
    onError: () => toast({ title: 'Failed to update schema definition', variant: 'destructive' }),
  });

  const handleEditSchemaDefinition = (def: SchemaBlockDefinition) => {
    setEditingSchemaDefinition(def);
    setSchemaDefFormData({
      name: def.name,
      description: def.description || '',
      defaultSchemaJson: JSON.stringify(def.defaultSchemaJson || {}, null, 2),
      defaultSettingsJson: JSON.stringify(def.defaultSettingsJson || {}, null, 2),
    });
    setSchemaDefEditDialogOpen(true);
  };

  const handleSaveSchemaDefinition = () => {
    if (!editingSchemaDefinition) return;
    try {
      const schemaJson = JSON.parse(schemaDefFormData.defaultSchemaJson);
      const settingsJson = JSON.parse(schemaDefFormData.defaultSettingsJson);
      updateSchemaDefMutation.mutate({
        id: editingSchemaDefinition.id,
        data: {
          name: schemaDefFormData.name,
          description: schemaDefFormData.description,
          defaultSchemaJson: schemaJson,
          defaultSettingsJson: settingsJson,
        },
      });
    } catch {
      toast({ title: 'Invalid JSON format', variant: 'destructive' });
    }
  };

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

  const handleQuickAddSchemaBlock = (schemaDef: SchemaBlockDefinition) => {
    const defaultData = (schemaDef.defaultSchemaJson || {}) as NewsletterBlockData;
    addBlockMutation.mutate({
      blockType: schemaDef.blockType,
      blockDataJson: defaultData,
    });
  };

  const handleQuickAddCustomBlock = (blockType: NewsletterBlockType) => {
    const defaultData = getBlockDataWithTemplateDefaults(blockType);
    addBlockMutation.mutate({
      blockType,
      blockDataJson: defaultData,
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
        const sourceType = (d.sourceType as string) || 'internal';
        const selectionMode = (d.selectionMode as string) || 'manual';
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

            {/* Source Type Toggle */}
            <div className="space-y-2">
              <Label>Source Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={sourceType === 'internal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateData('sourceType', 'internal')}
                  data-testid="button-source-internal"
                >
                  Internal Articles
                </Button>
                <Button
                  variant={sourceType === 'external' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateData('sourceType', 'external')}
                  data-testid="button-source-external"
                >
                  External Links
                </Button>
              </div>
            </div>

            {/* Number of Articles */}
            <div className="space-y-2">
              <Label>Number of Articles</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={d.numberOfArticles as number || 5}
                onChange={(e) => updateData('numberOfArticles', parseInt(e.target.value) || 5)}
                data-testid="input-number-articles"
              />
            </div>

            {/* Internal Source UI */}
            {sourceType === 'internal' && (
              <>
                <div className="space-y-2">
                  <Label>Selection Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectionMode === 'manual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateData('selectionMode', 'manual')}
                      data-testid="button-selection-manual"
                    >
                      Manual Selection
                    </Button>
                    <Button
                      variant={selectionMode === 'latest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateData('selectionMode', 'latest')}
                      data-testid="button-selection-latest"
                    >
                      Latest Articles
                    </Button>
                  </div>
                </div>

                {selectionMode === 'manual' && (
                  <div className="space-y-2">
                    <Label>Select Articles</Label>
                    <Input
                      placeholder="Search articles by title..."
                      value={articleSearchQuery}
                      onChange={(e) => setArticleSearchQuery(e.target.value)}
                      data-testid="input-article-search"
                    />
                    {articleSearchQuery && filteredArticles && filteredArticles.length > 0 && (
                      <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                        {filteredArticles.slice(0, 5).map(article => (
                          <div
                            key={article.id}
                            className="p-2 hover-elevate cursor-pointer text-sm"
                            onClick={() => {
                              const articles = (d.articles as Array<Record<string, unknown>>) || [];
                              const numLimit = (d.numberOfArticles as number) || 5;
                              if (articles.length >= numLimit) {
                                return; // Already at limit
                              }
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
                    {/* Selected articles as chips */}
                    <div className="flex flex-wrap gap-2">
                      {((d.articles as Array<Record<string, unknown>>) || []).map((article, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                          <span className="text-xs truncate max-w-[150px]">{article.articleTitle as string}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 p-0"
                            onClick={() => {
                              const articles = [...((d.articles as Array<Record<string, unknown>>) || [])];
                              articles.splice(idx, 1);
                              updateData('articles', articles);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    {((d.articles as Array<Record<string, unknown>>) || []).length >= ((d.numberOfArticles as number) || 5) && (
                      <p className="text-sm text-amber-600">Maximum articles selected</p>
                    )}
                  </div>
                )}

                {selectionMode === 'latest' && (
                  <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                    <Label className="text-sm font-medium">Latest Filters</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={(d.latestFilters as Record<string, unknown>)?.category as string || 'all'}
                          onValueChange={(value) => updateData('latestFilters', { ...(d.latestFilters as Record<string, unknown> || {}), category: value === 'all' ? undefined : value })}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Any category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="markets">Markets</SelectItem>
                            <SelectItem value="investing">Investing</SelectItem>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Locale</Label>
                        <Select
                          value={(d.latestFilters as Record<string, unknown>)?.locale as string || 'all'}
                          onValueChange={(value) => updateData('latestFilters', { ...(d.latestFilters as Record<string, unknown> || {}), locale: value === 'all' ? undefined : value })}
                        >
                          <SelectTrigger data-testid="select-locale">
                            <SelectValue placeholder="Any locale" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* External Source UI */}
            {sourceType === 'external' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>External Articles</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const items = (d.externalItems as Array<Record<string, unknown>>) || [];
                      updateData('externalItems', [...items, { title: '', source: '', url: '', imageUrl: '' }]);
                    }}
                    data-testid="button-add-external"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Link
                  </Button>
                </div>
                {((d.externalItems as Array<Record<string, unknown>>) || []).map((item, idx) => (
                  <div key={idx} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Article {idx + 1}</Label>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => {
                          const items = [...((d.externalItems as Array<Record<string, unknown>>) || [])];
                          items.splice(idx, 1);
                          updateData('externalItems', items);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <Input
                      value={item.title as string || ''}
                      onChange={(e) => {
                        const items = [...((d.externalItems as Array<Record<string, unknown>>) || [])];
                        items[idx] = { ...items[idx], title: e.target.value };
                        updateData('externalItems', items);
                      }}
                      placeholder="Article title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={item.source as string || ''}
                        onChange={(e) => {
                          const items = [...((d.externalItems as Array<Record<string, unknown>>) || [])];
                          items[idx] = { ...items[idx], source: e.target.value };
                          updateData('externalItems', items);
                        }}
                        placeholder="Source (e.g., Bloomberg)"
                      />
                      <Input
                        value={item.url as string || ''}
                        onChange={(e) => {
                          const items = [...((d.externalItems as Array<Record<string, unknown>>) || [])];
                          items[idx] = { ...items[idx], url: e.target.value };
                          updateData('externalItems', items);
                        }}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'stock_collection':
        const stockMode = (d.mode as string) || 'manual';
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Stock Collection"
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

            {/* Mode Toggle */}
            <div className="space-y-2">
              <Label>Mode</Label>
              <div className="flex gap-2">
                <Button
                  variant={stockMode === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateData('mode', 'manual')}
                  data-testid="button-mode-manual"
                >
                  Manual Selection
                </Button>
                <Button
                  variant={stockMode === 'dynamic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateData('mode', 'dynamic')}
                  data-testid="button-mode-dynamic"
                >
                  Dynamic
                </Button>
              </div>
            </div>

            {/* Limit */}
            <div className="space-y-2">
              <Label>Limit</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={d.limit as number || 5}
                onChange={(e) => updateData('limit', parseInt(e.target.value) || 5)}
                data-testid="input-limit"
              />
            </div>

            {/* Manual Mode - Stock Search */}
            {stockMode === 'manual' && (
              <div className="space-y-2">
                <Label>Select Stocks</Label>
                <Input
                  placeholder="Search stocks by ticker or name..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  data-testid="input-stock-search"
                />
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
                {/* Selected stocks as chips */}
                <div className="flex flex-wrap gap-2">
                  {((d.stocks as Array<Record<string, unknown>>) || []).map((stock, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                      <span className="font-medium text-xs">{stock.ticker as string}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          const stocks = [...((d.stocks as Array<Record<string, unknown>>) || [])];
                          stocks.splice(idx, 1);
                          updateData('stocks', stocks);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Mode - Type and Filters */}
            {stockMode === 'dynamic' && (
              <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label>Dynamic Type</Label>
                  <Select
                    value={d.dynamicType as string || 'top_traded'}
                    onValueChange={(value) => updateData('dynamicType', value)}
                  >
                    <SelectTrigger data-testid="select-dynamic-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top_traded">Top Traded</SelectItem>
                      <SelectItem value="top_gainers">Top Gainers</SelectItem>
                      <SelectItem value="top_losers">Top Losers</SelectItem>
                      <SelectItem value="most_viewed">Most Viewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Market</Label>
                    <Select
                      value={(d.filters as Record<string, unknown>)?.market as string || 'all'}
                      onValueChange={(value) => updateData('filters', { ...(d.filters as Record<string, unknown> || {}), market: value === 'all' ? undefined : value })}
                    >
                      <SelectTrigger data-testid="select-market">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="UAE">UAE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Asset Type</Label>
                    <Select
                      value={(d.filters as Record<string, unknown>)?.assetType as string || 'all'}
                      onValueChange={(value) => updateData('filters', { ...(d.filters as Record<string, unknown> || {}), assetType: value === 'all' ? undefined : value })}
                    >
                      <SelectTrigger data-testid="select-asset-type">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="stock">Stocks</SelectItem>
                        <SelectItem value="etf">ETFs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'assets_under_500':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Assets Under $500"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Price ($)</Label>
                <Input
                  type="number"
                  min={1}
                  value={d.maxPrice as number || 500}
                  onChange={(e) => updateData('maxPrice', parseInt(e.target.value) || 500)}
                  data-testid="input-max-price"
                />
              </div>
              <div className="space-y-2">
                <Label>Limit</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={d.limit as number || 5}
                  onChange={(e) => updateData('limit', parseInt(e.target.value) || 5)}
                  data-testid="input-limit"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={d.sortBy as string || 'volume'}
                onValueChange={(value) => updateData('sortBy', value)}
              >
                <SelectTrigger data-testid="select-sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Market</Label>
                <Select
                  value={(d.filters as Record<string, unknown>)?.market as string || 'all'}
                  onValueChange={(value) => updateData('filters', { ...(d.filters as Record<string, unknown> || {}), market: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger data-testid="select-market">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UAE">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Asset Type</Label>
                <Select
                  value={(d.filters as Record<string, unknown>)?.assetType as string || 'all'}
                  onValueChange={(value) => updateData('filters', { ...(d.filters as Record<string, unknown> || {}), assetType: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger data-testid="select-asset-type">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="stock">Stocks</SelectItem>
                    <SelectItem value="etf">ETFs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Manual stock selection for overrides */}
            <div className="space-y-2">
              <Label>Manual Stock Overrides (optional)</Label>
              <Input
                placeholder="Search stocks..."
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                data-testid="input-stock-search"
              />
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
              <div className="flex flex-wrap gap-2">
                {((d.stocks as Array<Record<string, unknown>>) || []).map((stock, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                    <span className="font-medium text-xs">{stock.ticker as string}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        const stocks = [...((d.stocks as Array<Record<string, unknown>>) || [])];
                        stocks.splice(idx, 1);
                        updateData('stocks', stocks);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'what_users_picked':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="What Users Picked"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time Window</Label>
                <Select
                  value={d.timeWindow as string || '7d'}
                  onValueChange={(value) => updateData('timeWindow', value)}
                >
                  <SelectTrigger data-testid="select-time-window">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Limit</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={d.limit as number || 5}
                  onChange={(e) => updateData('limit', parseInt(e.target.value) || 5)}
                  data-testid="input-limit"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Market Filter</Label>
              <Select
                value={(d.filters as Record<string, unknown>)?.market as string || 'all'}
                onValueChange={(value) => updateData('filters', { market: value === 'all' ? undefined : value })}
              >
                <SelectTrigger data-testid="select-market">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Manual stock selection for overrides */}
            <div className="space-y-2">
              <Label>Manual Stock Overrides (optional)</Label>
              <Input
                placeholder="Search stocks..."
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
                data-testid="input-stock-search"
              />
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
              <div className="flex flex-wrap gap-2">
                {((d.stocks as Array<Record<string, unknown>>) || []).map((stock, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                    <span className="font-medium text-xs">{stock.ticker as string}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        const stocks = [...((d.stocks as Array<Record<string, unknown>>) || [])];
                        stocks.splice(idx, 1);
                        updateData('stocks', stocks);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
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
              {typeof d.ticker === 'string' && d.ticker && (
                <div className="p-2 border rounded-lg flex items-center gap-2">
                  <span className="font-medium">{d.ticker}</span>
                  <span className="text-muted-foreground">{typeof d.companyName === 'string' ? d.companyName : ''}</span>
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

      case 'hero':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={d.title as string || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="Weekly Market Update"
                data-testid="input-block-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={d.subtitle as string || ''}
                onChange={(e) => updateData('subtitle', e.target.value)}
                placeholder="Your essential market insights"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={d.imageUrl as string || ''}
                onChange={(e) => updateData('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={d.ctaText as string || ''}
                  onChange={(e) => updateData('ctaText', e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA URL</Label>
                <Input
                  value={d.ctaUrl as string || ''}
                  onChange={(e) => updateData('ctaUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Legal Text</Label>
              <Textarea
                value={d.legalText as string || ''}
                onChange={(e) => updateData('legalText', e.target.value)}
                placeholder="Securities trading involves risk..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Company Info</Label>
              <Textarea
                value={d.body as string || ''}
                onChange={(e) => updateData('body', e.target.value)}
                placeholder="You're receiving this email because you subscribed..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Unsubscribe Text</Label>
              <Input
                value={d.unsubscribeText as string || 'Unsubscribe'}
                onChange={(e) => updateData('unsubscribeText', e.target.value)}
                placeholder="Unsubscribe"
              />
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
          <Button 
            variant="outline" 
            data-testid="button-preview"
            onClick={() => {
              window.open(`/newsletter-preview/${newsletterId}`, '_blank', 'width=700,height=900');
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" data-testid="button-send-test">
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        <div className="space-y-4 overflow-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Content Blocks</CardTitle>
                <CardDescription>Drag to reorder, click to edit</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button data-testid="button-add-block">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Block
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Content Block Types {newsletterTemplate ? `(${newsletterTemplate.name})` : ''}</DropdownMenuLabel>
                  {availableBlockTypes.map((blockType) => (
                    <DropdownMenuItem
                      key={blockType.type}
                      onClick={() => handleQuickAddCustomBlock(blockType.type)}
                      className="flex items-start gap-3 py-2"
                      data-testid={`dropdown-custom-${blockType.type}`}
                    >
                      <blockType.icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">{blockType.label}</span>
                        <span className="text-xs text-muted-foreground">{blockType.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {blocksLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : sortedBlocks.length > 0 ? (
                <div className="space-y-4">
                  {sortedBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="p-4 border rounded-lg bg-card"
                      data-testid={`block-instance-${block.id}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <Badge variant="secondary" className="text-xs">
                          {getBlockTypeLabel(block.blockType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          #{block.sortOrder + 1}
                        </span>
                        <div className="flex-1" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              data-testid={`button-block-menu-${block.id}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditBlock(block)}
                              data-testid={`menu-edit-${block.id}`}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit in Dialog
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={index === 0}
                              onClick={() => handleMoveBlock(index, 'up')}
                              data-testid={`menu-move-up-${block.id}`}
                            >
                              <ArrowUp className="h-4 w-4 mr-2" />
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={index === sortedBlocks.length - 1}
                              onClick={() => handleMoveBlock(index, 'down')}
                              data-testid={`menu-move-down-${block.id}`}
                            >
                              <ArrowDown className="h-4 w-4 mr-2" />
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteBlockMutation.mutate(block.id)}
                              className="text-destructive"
                              data-testid={`menu-delete-${block.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Block
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <InlineBlockEditor
                        block={block}
                        stockPages={stockPages}
                        blogPosts={blogPosts}
                        onUpdate={(newData) => {
                          updateBlockMutation.mutate({
                            blockId: block.id,
                            data: { blockDataJson: newData }
                          });
                        }}
                      />
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

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Library className="h-4 w-4" />
                  Library Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-[120px]">
                  {libraryTemplates && libraryTemplates.length > 0 ? (
                    <div className="space-y-1">
                      {libraryTemplates.map((template) => (
                        <Button
                          key={template.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-1"
                          onClick={() => handleInsertFromLibrary(template)}
                          data-testid={`button-insert-${template.id}`}
                        >
                          <div>
                            <p className="font-medium text-xs">{template.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {getBlockTypeLabel(template.blockType)}
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No templates
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Schema Definitions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-[120px]">
                  {schemaDefinitions && schemaDefinitions.length > 0 ? (
                    <div className="space-y-1">
                      {schemaDefinitions.map((def) => {
                        const blockType = BLOCK_TYPES.find(b => b.type === def.blockType);
                        const Icon = blockType?.icon || FileText;
                        return (
                          <div
                            key={def.id}
                            className="flex items-center gap-2 p-1 rounded hover-elevate cursor-pointer"
                            onClick={() => handleEditSchemaDefinition(def)}
                            data-testid={`schema-def-${def.id}`}
                          >
                            <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs truncate flex-1">{def.name}</span>
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No definitions
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="h-full border rounded-lg overflow-hidden" data-testid="live-preview-panel">
          <LivePreviewPanel newsletter={newsletter} blocks={sortedBlocks} />
        </div>
      </div>

      <Dialog open={schemaDefEditDialogOpen} onOpenChange={(open) => {
        setSchemaDefEditDialogOpen(open);
        if (!open) {
          setEditingSchemaDefinition(null);
        }
      }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Schema Block Definition</DialogTitle>
            <DialogDescription>
              Modify the default settings for {editingSchemaDefinition?.blockType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schema-name">Name</Label>
              <Input
                id="schema-name"
                value={schemaDefFormData.name}
                onChange={(e) => setSchemaDefFormData(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-schema-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schema-description">Description</Label>
              <Textarea
                id="schema-description"
                value={schemaDefFormData.description}
                onChange={(e) => setSchemaDefFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                data-testid="input-schema-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schema-defaults">Default Schema JSON</Label>
              <Textarea
                id="schema-defaults"
                value={schemaDefFormData.defaultSchemaJson}
                onChange={(e) => setSchemaDefFormData(prev => ({ ...prev, defaultSchemaJson: e.target.value }))}
                className="font-mono text-xs"
                rows={6}
                data-testid="input-schema-defaults"
              />
              <p className="text-xs text-muted-foreground">Default content/data for this block type</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schema-settings">Default Settings JSON</Label>
              <Textarea
                id="schema-settings"
                value={schemaDefFormData.defaultSettingsJson}
                onChange={(e) => setSchemaDefFormData(prev => ({ ...prev, defaultSettingsJson: e.target.value }))}
                className="font-mono text-xs"
                rows={6}
                data-testid="input-schema-settings"
              />
              <p className="text-xs text-muted-foreground">Display/behavior settings for this block type</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSchemaDefEditDialogOpen(false)}
              data-testid="button-cancel-schema"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSchemaDefinition}
              disabled={updateSchemaDefMutation.isPending}
              data-testid="button-save-schema"
            >
              {updateSchemaDefMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    setBlockEditorData(getBlockDataWithTemplateDefaults(value));
                  }}
                >
                  <SelectTrigger data-testid="select-block-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBlockTypes.map((bt) => (
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
