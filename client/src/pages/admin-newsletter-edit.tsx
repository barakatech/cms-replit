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
  ChevronDown,
  Layers
} from 'lucide-react';
import type { 
  Newsletter, 
  NewsletterBlockInstance, 
  NewsletterBlockType, 
  NewsletterBlockData,
  StockPage,
  NewsletterTemplate,
  NewsletterStatus
} from '@shared/schema';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const BLOCK_TYPES: { type: NewsletterBlockType; label: string; description: string; icon: typeof TrendingUp; category: string }[] = [
  { type: 'newsletter_header', label: 'Header', description: 'Logo, issue number, date', icon: Layers, category: 'Layout' },
  { type: 'hero', label: 'Hero', description: 'Main hero banner', icon: Image, category: 'Layout' },
  { type: 'main_article', label: 'Main Article', description: 'Personalized greeting + body', icon: FileText, category: 'Content' },
  { type: 'introduction', label: 'Introduction', description: 'Introduction paragraph', icon: FileText, category: 'Content' },
  { type: 'featured_content', label: 'Featured', description: 'Featured content section', icon: Star, category: 'Content' },
  { type: 'featured_story', label: 'Featured Story', description: 'Story with image + excerpt', icon: BookOpen, category: 'Content' },
  { type: 'articles_list', label: 'Articles', description: 'List of articles', icon: Newspaper, category: 'Content' },
  { type: 'market_overview', label: 'Market Overview', description: 'Stock indices grid', icon: BarChart3, category: 'Markets' },
  { type: 'stock_collection', label: 'Stocks', description: 'Stock collection grid', icon: TrendingUp, category: 'Stocks' },
  { type: 'assets_under_500', label: 'Under $500', description: 'Affordable assets list', icon: DollarSign, category: 'Stocks' },
  { type: 'what_users_picked', label: 'User Picks', description: 'Popular user picks', icon: Users, category: 'Stocks' },
  { type: 'asset_highlight', label: 'Highlight', description: 'Single asset spotlight', icon: Star, category: 'Stocks' },
  { type: 'why_it_matters', label: 'Why It Matters', description: 'Key insight callout', icon: Star, category: 'Content' },
  { type: 'term_of_the_day', label: 'Term', description: 'Financial term education', icon: Lightbulb, category: 'Education' },
  { type: 'in_other_news', label: 'News', description: 'External news links', icon: Newspaper, category: 'Content' },
  { type: 'promo_banner', label: 'Promo Banner', description: 'Promotional banner with CTA', icon: Image, category: 'Marketing' },
  { type: 'premium_cta', label: 'Premium CTA', description: 'Premium membership promo', icon: Star, category: 'Marketing' },
  { type: 'feedback', label: 'Feedback', description: 'Emoji rating section', icon: Users, category: 'Engagement' },
  { type: 'referral', label: 'Referral', description: 'Refer a friend block', icon: Users, category: 'Engagement' },
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
  newsItems?: Array<{ headline?: string; source?: string; url?: string; icon?: string }>;
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
  // Newsletter header fields
  logoUrl?: string;
  issueNumber?: number;
  issueDate?: string;
  // Main article fields
  greeting?: string;
  // Market overview fields
  indices?: Array<{ name?: string; value?: number; change?: number; changePercent?: number }>;
  marketDate?: string;
  // Promo/Featured story fields
  categoryTags?: string[];
  ctaText?: string;
  ctaUrl?: string;
  termsText?: string;
  // Feedback fields
  feedbackQuestion?: string;
  feedbackSubtext?: string;
  // Referral fields
  referralTitle?: string;
  referralBody?: string;
  referralCtaText?: string;
  referralCtaUrl?: string;
  // Footer fields
  contactEmail?: string;
  unsubscribeUrl?: string;
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
        <div style={{ marginTop: '24px', padding: '40px 20px', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4C8 4 5 7 5 11v6c0 2 1 3 3 3h8c2 0 3-1 3-3v-6c0-4-3-7-7-7z" fill="#00d4aa"/>
              <circle cx="9" cy="12" r="1.5" fill="#0a0a0a"/>
              <circle cx="15" cy="12" r="1.5" fill="#0a0a0a"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
            {data.title || "Let's Stay in Touch"}
          </h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
            {data.body || 'Questions or suggestions? Reach us at'}
          </p>
          {data.contactEmail && (
            <p style={{ marginBottom: '20px' }}>
              <a href={`mailto:${data.contactEmail}`} style={{ color: 'white', fontSize: '14px', textDecoration: 'underline' }}>
                {data.contactEmail}
              </a>
            </p>
          )}
        </div>
      );

    case 'newsletter_header':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" style={{ height: '32px' }} />
            ) : (
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d4aa' }}>akhbaraka</span>
            )}
          </div>
          <p style={{ fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Issue #{data.issueNumber || '---'} · {data.issueDate || 'Date not set'}
          </p>
        </div>
      );

    case 'main_article':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          {data.greeting && (
            <p style={{ fontSize: '16px', color: 'white', marginBottom: '16px' }}>
              {data.greeting.replace(/\{\{first_name\}\}/g, 'Hala Omar')},
            </p>
          )}
          {data.body && (
            <div style={{ color: '#ccc', lineHeight: '1.7', fontSize: '14px' }}>
              {data.body.split('\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '12px' }}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      );

    case 'market_overview':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00d4aa' }} />
            <h3 style={{ fontSize: '12px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              Market Overview
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {(data.indices && data.indices.length > 0 ? data.indices : [
              { name: 'DOW JONES', value: 37386.97, changePercent: -0.92 },
              { name: 'S&P 500', value: 4769.83, changePercent: 1.03 },
              { name: 'NASDAQ', value: 15056.97, changePercent: -0.56 },
              { name: 'FTSE 100', value: 7638.03, changePercent: -0.21 },
              { name: 'DAX', value: 17026.47, changePercent: 0.65 },
              { name: 'NIKKEI 225', value: 33836.87, changePercent: 0.95 },
            ]).map((index, idx) => (
              <div key={idx}>
                <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{index.name}</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#00d4aa' }}>
                  {typeof index.value === 'number' ? index.value.toLocaleString() : index.value}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  color: (index.changePercent ?? 0) >= 0 ? '#00d4aa' : '#ef4444',
                  fontWeight: '500'
                }}>
                  {(index.changePercent ?? 0) >= 0 ? '↑' : '↓'} {(index.changePercent ?? 0) >= 0 ? '+' : ''}{index.changePercent}%
                </p>
              </div>
            ))}
          </div>
          {data.marketDate && (
            <p style={{ fontSize: '10px', color: '#666', marginTop: '16px', textAlign: 'center' }}>
              Data as of market close · {data.marketDate}
            </p>
          )}
        </div>
      );

    case 'promo_banner':
      return (
        <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #1a3a5c 0%, #0a1929 100%)' }} />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {data.title && <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{data.title}</h3>}
            {data.subtitle && <p style={{ fontSize: '13px', color: '#ccc', marginBottom: '16px' }}>{data.subtitle}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {data.ctaText && (
                <span style={{ padding: '10px 20px', backgroundColor: 'white', color: 'black', fontWeight: 'bold', borderRadius: '20px', fontSize: '13px' }}>
                  {data.ctaText}
                </span>
              )}
              {data.termsText && <span style={{ fontSize: '11px', color: '#999' }}>{data.termsText}</span>}
            </div>
          </div>
        </div>
      );

    case 'featured_story':
      return (
        <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
          {data.imageUrl && (
            <div style={{ position: 'relative' }}>
              <img src={data.imageUrl} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <span style={{ 
                position: 'absolute', 
                top: '12px', 
                left: '12px', 
                padding: '4px 12px', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                fontSize: '10px', 
                fontWeight: 'bold',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                Featured Story
              </span>
              {data.subtitle && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '12px', 
                  left: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: 'white'
                }}>
                  <span style={{ color: '#00d4aa', fontSize: '20px' }}>↘</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.subtitle}</span>
                </div>
              )}
            </div>
          )}
          <div style={{ padding: '20px' }}>
            {data.categoryTags && data.categoryTags.length > 0 && (
              <p style={{ fontSize: '11px', color: '#00d4aa', marginBottom: '8px', textTransform: 'uppercase' }}>
                {data.categoryTags.join(' · ')}
              </p>
            )}
            {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>{data.title}</h3>}
            {data.body && <p style={{ fontSize: '14px', color: '#999', lineHeight: '1.6', marginBottom: '16px' }}>{data.body}</p>}
            {data.ctaText && (
              <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600' }}>
                {data.ctaText} →
              </p>
            )}
          </div>
        </div>
      );

    case 'why_it_matters':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '6px', 
              backgroundColor: '#fbbf24', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'black',
              fontSize: '16px'
            }}>
              ★
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              {data.title || 'Why it Matters'}
            </h3>
          </div>
          {data.body && <p style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>{data.body}</p>}
        </div>
      );

    case 'premium_cta':
      return (
        <div style={{ marginBottom: '24px', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ 
            width: '100%', 
            minHeight: '220px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1f4e 30%, #1a1a2e 70%, #16213e 100%)',
            padding: '28px',
            display: 'flex',
            position: 'relative'
          }}>
            <div style={{ flex: 1, zIndex: 1 }}>
              <p style={{ fontSize: '11px', color: '#00d4aa', letterSpacing: '3px', marginBottom: '2px', fontWeight: '500' }}>PREMIUM</p>
              <p style={{ fontSize: '9px', color: '#666', letterSpacing: '2px', marginBottom: '16px' }}>MEMBERSHIP</p>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px', lineHeight: '1.2' }}>
                {data.title || 'Introducing Premium+'}
              </h3>
              <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px', lineHeight: '1.5', maxWidth: '280px' }}>
                {data.body || 'Access exclusive investment perks and lifestyle memberships all in one app.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ 
                  padding: '12px 24px', 
                  backgroundColor: 'white', 
                  color: 'black', 
                  fontWeight: 'bold', 
                  borderRadius: '24px', 
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  {data.ctaText || 'Get Premium+'}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>{data.termsText || 'T&Cs apply.'}</span>
              </div>
            </div>
            <div style={{ 
              position: 'absolute', 
              right: '20px', 
              top: '50%', 
              transform: 'translateY(-50%) rotate(-15deg)',
              width: '120px',
              height: '80px',
              background: 'linear-gradient(135deg, #d4a574 0%, #b8956a 50%, #8b6914 100%)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              opacity: 0.9
            }} />
          </div>
        </div>
      );

    case 'feedback':
      return (
        <div style={{ marginBottom: '24px', padding: '32px 24px', backgroundColor: '#1a1a1a', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            {data.feedbackQuestion || "How was today's newsletter?"}
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            {data.feedbackSubtext || 'Your feedback helps us improve'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '36px' }}>
            <span style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>🤩</span>
            <span style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>😊</span>
            <span style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>🙄</span>
            <span style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>😕</span>
          </div>
        </div>
      );

    case 'referral':
      return (
        <div style={{ 
          marginBottom: '24px', 
          padding: '24px', 
          background: 'linear-gradient(135deg, #0d4a42 0%, #0a3d36 100%)',
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '16px' 
        }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '14px', 
            backgroundColor: 'rgba(239, 68, 68, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '6px' }}>
              {data.referralTitle || 'Refer a Friend, Earn Rewards'}
            </h3>
            <p style={{ fontSize: '14px', color: '#b0c4c0', marginBottom: '12px', lineHeight: '1.5' }}>
              {data.referralBody || 'Share baraka with friends and earn up to $50 in free stocks for each successful referral.'}
            </p>
            <p style={{ color: '#00d4aa', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              {data.referralCtaText || 'Get Your Referral Link'} <span style={{ marginLeft: '4px' }}>→</span>
            </p>
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
  
  // Get issue info from newsletter or header block
  const headerBlock = sortedBlocks.find(b => b.blockType === 'newsletter_header');
  const headerData = headerBlock?.blockDataJson as { issueNumber?: number; issueDate?: string } || {};
  const issueNumber = newsletter.issueNumber || headerData.issueNumber || 147;
  const issueDate = newsletter.issueDate || headerData.issueDate || 'WEDNESDAY, FEB 4, 2026';
  
  return (
    <div className="bg-background rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Live Preview</h3>
        <p className="text-xs text-muted-foreground">HTML output preview</p>
      </div>
      <ScrollArea className="flex-1">
        <div style={{ backgroundColor: '#0a0a0a', minHeight: '100%', padding: '20px' }}>
          <div style={{ maxWidth: '100%', backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#0d1117', padding: '32px 24px 48px', textAlign: 'center' }}>
              {/* Logo Section */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#888', fontSize: '20px' }}>✳</span>
                  <div>
                    <span style={{ fontSize: '22px', fontWeight: '300', color: 'white', letterSpacing: '1px' }}>akhbaraka</span>
                    <p style={{ fontSize: '8px', color: '#666', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>FRESH FINANCIAL NEWS</p>
                  </div>
                </div>
                <div style={{ width: '1px', height: '32px', backgroundColor: '#333', margin: '0 8px' }} />
                <div style={{ 
                  width: '28px', 
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4C8 4 5 7 5 11v6c0 2 1 3 3 3h8c2 0 3-1 3-3v-6c0-4-3-7-7-7z" fill="#666"/>
                    <circle cx="9" cy="12" r="1.5" fill="#0d1117"/>
                    <circle cx="15" cy="12" r="1.5" fill="#0d1117"/>
                  </svg>
                </div>
              </div>

              {/* Issue Info */}
              <p style={{ 
                fontSize: '11px', 
                color: '#666', 
                margin: '0 0 32px 0',
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                ISSUE #{issueNumber} · {issueDate.toUpperCase()}
              </p>

              {/* Subject (Article Title) */}
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: 'white', 
                margin: '0 0 20px 0',
                lineHeight: '1.2',
                letterSpacing: '-0.5px'
              }}>
                {newsletter.subject || 'Markets Surge as S&P 500 Hits New Peak'}
              </h1>

              {/* Preheader (Article Excerpt) */}
              {newsletter.preheader && (
                <p style={{ 
                  fontSize: '16px', 
                  color: '#888', 
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {newsletter.preheader}
                </p>
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
                  <Button size="sm" variant="ghost" onClick={() => {
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

    case 'hero':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Newsletter headline"
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
            <Label className="text-xs text-muted-foreground">Image URL</Label>
            <Input
              value={data.imageUrl as string || ''}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="/attached_assets/..."
              data-testid="inline-input-imageUrl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA Text</Label>
              <Input
                value={data.ctaText as string || ''}
                onChange={(e) => updateField('ctaText', e.target.value)}
                placeholder="Button text"
                data-testid="inline-input-ctaText"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA URL</Label>
              <Input
                value={data.ctaUrl as string || ''}
                onChange={(e) => updateField('ctaUrl', e.target.value)}
                placeholder="https://..."
                data-testid="inline-input-ctaUrl"
              />
            </div>
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Let's Stay in Touch"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Body Text</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Questions or suggestions? Reach us at..."
              rows={2}
              data-testid="inline-input-body"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Contact Email</Label>
            <Input
              value={data.contactEmail as string || ''}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="support@getbaraka.com"
              data-testid="inline-input-contactEmail"
            />
          </div>
        </div>
      );

    case 'newsletter_header':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Logo URL (optional)</Label>
            <Input
              value={data.logoUrl as string || ''}
              onChange={(e) => updateField('logoUrl', e.target.value)}
              placeholder="Leave empty for default logo"
              data-testid="inline-input-logoUrl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Issue Number</Label>
              <Input
                type="number"
                value={data.issueNumber as number || ''}
                onChange={(e) => updateField('issueNumber', parseInt(e.target.value) || 0)}
                placeholder="147"
                data-testid="inline-input-issueNumber"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Issue Date</Label>
              <Input
                value={data.issueDate as string || ''}
                onChange={(e) => updateField('issueDate', e.target.value)}
                placeholder="Wednesday, Feb 4, 2026"
                data-testid="inline-input-issueDate"
              />
            </div>
          </div>
        </div>
      );

    case 'main_article':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Greeting (use {'{{first_name}}'} for personalization)</Label>
            <Input
              value={data.greeting as string || ''}
              onChange={(e) => updateField('greeting', e.target.value)}
              placeholder="{{first_name}}"
              data-testid="inline-input-greeting"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Article Body</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Stocks surged on Tuesday, propelling Wall Street to a higher close..."
              rows={6}
              data-testid="inline-input-body"
            />
          </div>
        </div>
      );

    case 'market_overview':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Market Date</Label>
            <Input
              value={data.marketDate as string || ''}
              onChange={(e) => updateField('marketDate', e.target.value)}
              placeholder="Dec 25, 2023 · 4:00 PM EST"
              data-testid="inline-input-marketDate"
            />
          </div>
          <p className="text-xs text-muted-foreground">Market indices are fetched automatically. Add custom indices below:</p>
          <div className="space-y-2">
            {((data.indices as Array<{name?: string; value?: number; changePercent?: number}>) || []).map((index, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <Input
                  value={index.name || ''}
                  onChange={(e) => {
                    const indices = [...((data.indices as Array<{name?: string; value?: number; changePercent?: number}>) || [])];
                    indices[idx] = { ...indices[idx], name: e.target.value };
                    updateField('indices', indices);
                  }}
                  placeholder="Index name"
                  className="text-xs"
                />
                <Input
                  type="number"
                  value={index.value || ''}
                  onChange={(e) => {
                    const indices = [...((data.indices as Array<{name?: string; value?: number; changePercent?: number}>) || [])];
                    indices[idx] = { ...indices[idx], value: parseFloat(e.target.value) };
                    updateField('indices', indices);
                  }}
                  placeholder="Value"
                  className="text-xs"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={index.changePercent || ''}
                  onChange={(e) => {
                    const indices = [...((data.indices as Array<{name?: string; value?: number; changePercent?: number}>) || [])];
                    indices[idx] = { ...indices[idx], changePercent: parseFloat(e.target.value) };
                    updateField('indices', indices);
                  }}
                  placeholder="% Change"
                  className="text-xs"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const indices = [...((data.indices as Array<{name?: string; value?: number; changePercent?: number}>) || [])];
                indices.push({ name: '', value: 0, changePercent: 0 });
                updateField('indices', indices);
              }}
              data-testid="button-add-index"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Index
            </Button>
          </div>
        </div>
      );

    case 'promo_banner':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Bitcoin ETFs are available on baraka"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Subtitle</Label>
            <Input
              value={data.subtitle as string || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="11 different Bitcoin ETFs available for you to buy and sell."
              data-testid="inline-input-subtitle"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Background Image URL</Label>
            <Input
              value={data.imageUrl as string || ''}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="/attached_assets/..."
              data-testid="inline-input-imageUrl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA Button Text</Label>
              <Input
                value={data.ctaText as string || ''}
                onChange={(e) => updateField('ctaText', e.target.value)}
                placeholder="Discover Bitcoin ETFs"
                data-testid="inline-input-ctaText"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA URL</Label>
              <Input
                value={data.ctaUrl as string || ''}
                onChange={(e) => updateField('ctaUrl', e.target.value)}
                placeholder="https://..."
                data-testid="inline-input-ctaUrl"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Terms Text</Label>
            <Input
              value={data.termsText as string || ''}
              onChange={(e) => updateField('termsText', e.target.value)}
              placeholder="T&Cs apply."
              data-testid="inline-input-termsText"
            />
          </div>
        </div>
      );

    case 'featured_story':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Story Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Saudi Aramco boosts dividend despite a 25% drop in 2023 profit"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Headline / Tagline</Label>
            <Input
              value={data.subtitle as string || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="Oil Profits Dive"
              data-testid="inline-input-subtitle"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Category Tags (comma-separated)</Label>
            <Input
              value={((data.categoryTags as string[]) || []).join(', ')}
              onChange={(e) => updateField('categoryTags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="SAUDI ARAMCO, ENERGY MARKETS"
              data-testid="inline-input-categoryTags"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Story Body / Excerpt</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="A unit of Saudi Arabia's sovereign investor has entered private credit..."
              rows={4}
              data-testid="inline-input-body"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Featured Image URL</Label>
            <Input
              value={data.imageUrl as string || ''}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              placeholder="/attached_assets/..."
              data-testid="inline-input-imageUrl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA Text</Label>
              <Input
                value={data.ctaText as string || ''}
                onChange={(e) => updateField('ctaText', e.target.value)}
                placeholder="Read Full Story"
                data-testid="inline-input-ctaText"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA URL</Label>
              <Input
                value={data.ctaUrl as string || ''}
                onChange={(e) => updateField('ctaUrl', e.target.value)}
                placeholder="https://..."
                data-testid="inline-input-ctaUrl"
              />
            </div>
          </div>
        </div>
      );

    case 'why_it_matters':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || 'Why it Matters'}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Why it Matters"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Insight Text</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Broadcom's move shows that AI exposure alone is no longer enough to impress investors..."
              rows={4}
              data-testid="inline-input-body"
            />
          </div>
        </div>
      );

    case 'premium_cta':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.title as string || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Introducing Premium+"
              data-testid="inline-input-title"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={data.body as string || ''}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Access exclusive investment perks and lifestyle memberships all in one app."
              rows={2}
              data-testid="inline-input-body"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA Button Text</Label>
              <Input
                value={data.ctaText as string || ''}
                onChange={(e) => updateField('ctaText', e.target.value)}
                placeholder="Get Premium+"
                data-testid="inline-input-ctaText"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA URL</Label>
              <Input
                value={data.ctaUrl as string || ''}
                onChange={(e) => updateField('ctaUrl', e.target.value)}
                placeholder="https://..."
                data-testid="inline-input-ctaUrl"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Terms Text</Label>
            <Input
              value={data.termsText as string || ''}
              onChange={(e) => updateField('termsText', e.target.value)}
              placeholder="T&Cs apply."
              data-testid="inline-input-termsText"
            />
          </div>
        </div>
      );

    case 'feedback':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Question</Label>
            <Input
              value={data.feedbackQuestion as string || ''}
              onChange={(e) => updateField('feedbackQuestion', e.target.value)}
              placeholder="How was today's newsletter?"
              data-testid="inline-input-feedbackQuestion"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Subtext</Label>
            <Input
              value={data.feedbackSubtext as string || ''}
              onChange={(e) => updateField('feedbackSubtext', e.target.value)}
              placeholder="Your feedback helps us improve"
              data-testid="inline-input-feedbackSubtext"
            />
          </div>
        </div>
      );

    case 'referral':
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={data.referralTitle as string || ''}
              onChange={(e) => updateField('referralTitle', e.target.value)}
              placeholder="Refer a Friend, Earn Rewards"
              data-testid="inline-input-referralTitle"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={data.referralBody as string || ''}
              onChange={(e) => updateField('referralBody', e.target.value)}
              placeholder="Share baraka with friends and earn up to $50 in free stocks for each successful referral."
              rows={2}
              data-testid="inline-input-referralBody"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA Text</Label>
              <Input
                value={data.referralCtaText as string || ''}
                onChange={(e) => updateField('referralCtaText', e.target.value)}
                placeholder="Get Your Referral Link"
                data-testid="inline-input-referralCtaText"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CTA URL</Label>
              <Input
                value={data.referralCtaUrl as string || ''}
                onChange={(e) => updateField('referralCtaUrl', e.target.value)}
                placeholder="https://..."
                data-testid="inline-input-referralCtaUrl"
              />
            </div>
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
      return { title: 'In Other News', sourceType: 'external', newsItems: [] };
    case 'call_to_action':
      return { title: '', subtitle: '', buttonText: '', buttonUrl: '' };
    case 'footer':
      return { title: "Let's Stay in Touch", body: 'Questions or suggestions? Reach us at', contactEmail: 'support@getbaraka.com' };
    case 'newsletter_header':
      return { logoUrl: '', issueNumber: 1, issueDate: '' };
    case 'main_article':
      return { greeting: '{{first_name}}', body: '' };
    case 'market_overview':
      return { marketDate: '', indices: [] };
    case 'promo_banner':
      return { title: '', subtitle: '', imageUrl: '', ctaText: '', ctaUrl: '', termsText: 'T&Cs apply.' };
    case 'featured_story':
      return { title: '', subtitle: '', body: '', imageUrl: '', categoryTags: [], ctaText: 'Read Full Story', ctaUrl: '' };
    case 'why_it_matters':
      return { title: 'Why it Matters', body: '' };
    case 'premium_cta':
      return { title: 'Introducing Premium+', body: '', ctaText: 'Get Premium+', ctaUrl: '', termsText: 'T&Cs apply.' };
    case 'feedback':
      return { feedbackQuestion: "How was today's newsletter?", feedbackSubtext: 'Your feedback helps us improve' };
    case 'referral':
      return { referralTitle: 'Refer a Friend, Earn Rewards', referralBody: 'Share baraka with friends and earn up to $50 in free stocks for each successful referral.', referralCtaText: 'Get Your Referral Link', referralCtaUrl: '' };
    default:
      return {};
  }
};

export default function AdminNewsletterEdit() {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [selectedBlockType, setSelectedBlockType] = useState<NewsletterBlockType>('introduction');
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [editingSettings, setEditingSettings] = useState<{
    subject: string;
    preheader: string;
    issueNumber: number;
    issueDate: string;
    templateId: string;
    locale: 'en' | 'ar';
    status: NewsletterStatus;
  } | null>(null);

  const toggleBlockExpanded = (blockId: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });
  };

  const expandBlock = (blockId: string) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev);
      next.add(blockId);
      return next;
    });
  };

  const newsletterId = params.id;

  const { data: newsletter, isLoading: newsletterLoading } = useQuery<Newsletter>({
    queryKey: ['/api/newsletters', newsletterId],
    enabled: !!newsletterId,
  });

  // Fetch all templates for the template selector
  const { data: templates } = useQuery<NewsletterTemplate[]>({
    queryKey: ['/api/newsletter-templates'],
  });

  // Initialize editing settings when newsletter loads
  useEffect(() => {
    if (newsletter && !editingSettings) {
      setEditingSettings({
        subject: newsletter.subject || '',
        preheader: newsletter.preheader || '',
        issueNumber: newsletter.issueNumber || 147,
        issueDate: newsletter.issueDate || 'Wednesday, Feb 4, 2026',
        templateId: newsletter.templateId || '',
        locale: newsletter.locale || 'en',
        status: newsletter.status || 'draft',
      });
    }
  }, [newsletter, editingSettings]);

  // Update newsletter settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<Newsletter>) => 
      apiRequest('PUT', `/api/newsletters/${newsletterId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters', newsletterId] });
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      toast({ title: 'Settings saved' });
    },
    onError: () => toast({ title: 'Failed to save settings', variant: 'destructive' }),
  });

  const handleSaveSettings = () => {
    if (!editingSettings) return;
    updateSettingsMutation.mutate({
      subject: editingSettings.subject,
      preheader: editingSettings.preheader,
      issueNumber: editingSettings.issueNumber,
      issueDate: editingSettings.issueDate,
      templateId: editingSettings.templateId,
      locale: editingSettings.locale,
      status: editingSettings.status,
    });
  };


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

  const { data: stockPages } = useQuery<StockPage[]>({
    queryKey: ['/api/stock-pages'],
  });

  const { data: blogPosts } = useQuery<Array<{ id: string; title_en: string; excerpt_en?: string; featuredImageUrl?: string; slug: string }>>({
    queryKey: ['/api/blog-posts'],
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
    onSuccess: async (response) => {
      const result = await refetchBlocks();
      // Auto-expand the newly added block (it will be at the end)
      if (result.data && result.data.length > 0) {
        const newBlock = result.data[result.data.length - 1];
        if (newBlock?.id) {
          expandBlock(newBlock.id);
        }
      }
      toast({ title: 'Block added' });
    },
    onError: () => toast({ title: 'Failed to add block', variant: 'destructive' }),
  });

  const updateBlockMutation = useMutation({
    mutationFn: ({ blockId, data }: { blockId: string; data: Partial<NewsletterBlockInstance> }) => 
      apiRequest('POST', `/api/newsletters/${newsletterId}/blocks/${blockId}/update`, data),
    onSuccess: () => {
      refetchBlocks();
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

  const handleQuickAddCustomBlock = (blockType: NewsletterBlockType) => {
    const defaultData = getBlockDataWithTemplateDefaults(blockType);
    addBlockMutation.mutate({
      blockType,
      blockDataJson: defaultData,
    });
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
          {/* Newsletter Settings Section */}
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between gap-2 cursor-pointer hover-elevate">
                  <div>
                    <CardTitle>Newsletter Settings</CardTitle>
                    <CardDescription>Subject, preheader, template, and status</CardDescription>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  {editingSettings && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={editingSettings.subject}
                          onChange={(e) => setEditingSettings({ ...editingSettings, subject: e.target.value })}
                          placeholder="Enter email subject..."
                          data-testid="input-subject"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preheader">Preheader</Label>
                        <Input
                          id="preheader"
                          value={editingSettings.preheader}
                          onChange={(e) => setEditingSettings({ ...editingSettings, preheader: e.target.value })}
                          placeholder="Preview text shown in inbox..."
                          maxLength={120}
                          data-testid="input-preheader"
                        />
                        <p className="text-xs text-muted-foreground">{editingSettings.preheader.length}/120 characters</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="issueNumber">Issue Number</Label>
                          <Input
                            id="issueNumber"
                            type="number"
                            value={editingSettings.issueNumber}
                            onChange={(e) => setEditingSettings({ ...editingSettings, issueNumber: parseInt(e.target.value) || 0 })}
                            placeholder="147"
                            data-testid="input-issue-number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Input
                            id="issueDate"
                            value={editingSettings.issueDate}
                            onChange={(e) => setEditingSettings({ ...editingSettings, issueDate: e.target.value })}
                            placeholder="Wednesday, Feb 4, 2026"
                            data-testid="input-issue-date"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Template</Label>
                          <Select
                            value={editingSettings.templateId || 'none'}
                            onValueChange={(value) => setEditingSettings({ ...editingSettings, templateId: value === 'none' ? '' : value })}
                          >
                            <SelectTrigger data-testid="select-template">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No template</SelectItem>
                              {templates?.map((t) => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Locale</Label>
                          <Select
                            value={editingSettings.locale}
                            onValueChange={(value: 'en' | 'ar') => setEditingSettings({ ...editingSettings, locale: value })}
                          >
                            <SelectTrigger data-testid="select-locale">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={editingSettings.status}
                          onValueChange={(value: NewsletterStatus) => setEditingSettings({ ...editingSettings, status: value })}
                        >
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button 
                          onClick={handleSaveSettings}
                          disabled={updateSettingsMutation.isPending}
                          data-testid="button-save-settings"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Content Blocks Section */}
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
                  <DropdownMenuLabel>Content Block Types</DropdownMenuLabel>
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
                <div className="space-y-3">
                  {sortedBlocks.map((block, index) => {
                    const isExpanded = expandedBlocks.has(block.id);
                    return (
                      <div
                        key={block.id}
                        className="border rounded-lg bg-card overflow-hidden"
                        data-testid={`block-instance-${block.id}`}
                      >
                        <div 
                          className="flex items-center gap-2 p-3 cursor-pointer hover-elevate"
                          onClick={() => toggleBlockExpanded(block.id)}
                          data-testid={`block-header-${block.id}`}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                          <Badge variant="secondary" className="text-xs">
                            {getBlockTypeLabel(block.blockType)}
                          </Badge>
                          <span className="text-xs text-muted-foreground truncate flex-1">
                            {(block.blockDataJson as Record<string, unknown>)?.title as string || `Block #${block.sortOrder + 1}`}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t">
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
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Plus className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No blocks yet</p>
                  <p className="text-sm">Use the "Add Block" dropdown above to add content blocks</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="h-full border rounded-lg overflow-hidden" data-testid="live-preview-panel">
          <LivePreviewPanel newsletter={newsletter} blocks={sortedBlocks} />
        </div>
      </div>


    </div>
  );
}
