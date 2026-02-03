import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { Newsletter, NewsletterBlockInstance } from '@shared/schema';

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

const blockTypeLabels: Record<string, string> = {
  introduction: 'Introduction',
  featured_content: 'Featured Content',
  articles_list: 'Articles List',
  stock_collection: 'Stock Collection',
  assets_under_500: 'Assets Under $500',
  what_users_picked: 'What Users Picked',
  asset_highlight: 'Asset Highlight',
  term_of_the_day: 'Term of The Day',
  in_other_news: 'In Other News',
  call_to_action: 'Call To Action',
};

function renderBlockPreview(block: NewsletterBlockInstance) {
  const data = (block.blockDataJson as BlockData) || {};
  const blockType = block.blockType;

  switch (blockType) {
    case 'introduction':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>{data.title}</h2>}
          {data.subtitle && <p style={{ fontSize: '16px', color: '#666', marginBottom: '12px' }}>{data.subtitle}</p>}
          {data.body && <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{data.body}</p>}
        </div>
      );

    case 'featured_content':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured</h3>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>{data.title}</h2>}
          {data.articles && data.articles.length > 0 && (
            <div>
              {data.articles.map((article, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: idx < data.articles!.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                  <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{article.title || 'Untitled Article'}</p>
                  {article.excerpt && <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{article.excerpt}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'articles_list':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1a1a1a' }}>{data.title}</h3>}
          {data.sourceType === 'external' && data.externalItems && data.externalItems.length > 0 ? (
            <div>
              {data.externalItems.map((item, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{item.title || 'Untitled'}</p>
                  {item.source && <p style={{ fontSize: '12px', color: '#999' }}>Source: {item.source}</p>}
                </div>
              ))}
            </div>
          ) : data.articles && data.articles.length > 0 ? (
            <div>
              {data.articles.map((article, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{article.title || 'Untitled Article'}</p>
                  {article.excerpt && <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{article.excerpt}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No articles selected</p>
          )}
        </div>
      );

    case 'stock_collection':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1a1a1a' }}>{data.title}</h3>}
          {data.mode === 'dynamic' ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Dynamic: {data.dynamicType?.replace('_', ' ').toUpperCase() || 'Top Traded'}</p>
          ) : data.stocks && data.stocks.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {data.stocks.map((stock, idx) => (
                <div key={idx} style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 'bold', color: '#00d4aa', fontSize: '16px' }}>{stock.ticker}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{stock.companyName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No stocks selected</p>
          )}
        </div>
      );

    case 'assets_under_500':
      return (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>{data.title}</h3>}
          <p style={{ color: '#666' }}>
            Max Price: ${data.maxPrice || 500} | Limit: {data.limit || 5} | Sort: {data.sortBy || 'price_asc'}
          </p>
          {data.stocks && data.stocks.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.stocks.map((stock, idx) => (
                <span key={idx} style={{ padding: '4px 12px', backgroundColor: '#00d4aa', color: 'white', borderRadius: '16px', fontSize: '12px' }}>
                  {stock.ticker}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case 'what_users_picked':
      return (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>{data.title}</h3>}
          <p style={{ color: '#666' }}>
            Time Window: {data.timeWindow || '24h'} | Limit: {data.limit || 5}
          </p>
          {data.stocks && data.stocks.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.stocks.map((stock, idx) => (
                <span key={idx} style={{ padding: '4px 12px', backgroundColor: '#1976d2', color: 'white', borderRadius: '16px', fontSize: '12px' }}>
                  {stock.ticker}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case 'asset_highlight':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '2px solid #00d4aa' }}>
          <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>Asset Highlight</h3>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>{data.title}</h2>}
          {data.ticker && <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d4aa', margin: '8px 0' }}>{data.ticker}</p>}
          {data.companyName && <p style={{ color: '#666' }}>{data.companyName}</p>}
          {data.description && <p style={{ marginTop: '12px', color: '#333', lineHeight: '1.6' }}>{data.description}</p>}
        </div>
      );

    case 'term_of_the_day':
      return (
        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#fce4ec', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '14px', color: '#c2185b', marginBottom: '8px', textTransform: 'uppercase' }}>Term of the Day</h3>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>{data.title}</h2>}
          {data.term && <p style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{data.term}</p>}
          {data.definition && <p style={{ marginTop: '8px', color: '#666', lineHeight: '1.6' }}>{data.definition}</p>}
          {data.example && (
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Example:</p>
              <p style={{ color: '#333', fontStyle: 'italic' }}>{data.example}</p>
            </div>
          )}
        </div>
      );

    case 'in_other_news':
      return (
        <div style={{ marginBottom: '24px' }}>
          {data.title && <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1a1a1a' }}>{data.title}</h3>}
          {data.newsItems && data.newsItems.length > 0 ? (
            <div>
              {data.newsItems.map((item, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <p style={{ color: '#1a1a1a' }}>{item.headline || 'Untitled'}</p>
                  {item.source && <p style={{ fontSize: '12px', color: '#999' }}>{item.source}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No news items</p>
          )}
        </div>
      );

    case 'call_to_action':
      return (
        <div style={{ marginBottom: '24px', textAlign: 'center', padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          {data.title && <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{data.title}</h2>}
          {data.body && <p style={{ color: '#ccc', marginBottom: '16px' }}>{data.body}</p>}
          {data.buttonText && (
            <a
              href={data.buttonUrl || '#'}
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#00d4aa',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              {data.buttonText}
            </a>
          )}
        </div>
      );

    default:
      return (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ color: '#666' }}>Block: {blockTypeLabels[blockType] || blockType}</p>
          <pre style={{ fontSize: '12px', color: '#999', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
}

export default function NewsletterPreview() {
  const { id } = useParams<{ id: string }>();

  const { data: newsletter, isLoading: loadingNewsletter } = useQuery<Newsletter>({
    queryKey: ['/api/newsletters', id],
  });

  const { data: blocks, isLoading: loadingBlocks } = useQuery<NewsletterBlockInstance[]>({
    queryKey: ['/api/newsletters', id, 'blocks'],
    enabled: !!id,
  });

  if (loadingNewsletter || loadingBlocks) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <p style={{ color: '#666' }}>Loading preview...</p>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <p style={{ color: '#999' }}>Newsletter not found</p>
      </div>
    );
  }

  const sortedBlocks = [...(blocks || [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#00d4aa' }}>baraka</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>
            {newsletter.subject}
          </h1>
          {newsletter.preheader && (
            <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>{newsletter.preheader}</p>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          {sortedBlocks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No content blocks yet</p>
          ) : (
            sortedBlocks.map((block) => (
              <div key={block.id}>
                {renderBlockPreview(block)}
              </div>
            ))
          )}
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '24px', textAlign: 'center', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
            You received this email because you subscribed to baraka newsletters.
          </p>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
            <a href="#" style={{ color: '#00d4aa' }}>Unsubscribe</a> | <a href="#" style={{ color: '#00d4aa' }}>Manage Preferences</a>
          </p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ fontSize: '12px', color: '#999' }}>
          Preview Mode - This is how the newsletter will appear to subscribers
        </p>
      </div>
    </div>
  );
}
