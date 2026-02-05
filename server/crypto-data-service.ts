/**
 * CryptoDataService - Server-side API aggregation for live crypto market data
 * 
 * Features:
 * - CoinGecko as primary provider
 * - CoinCap as fallback for basic price data
 * - In-memory caching with TTL and stale-while-revalidate
 * - No external API calls from frontend (all server-side)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL in seconds
  swr: number; // Stale-while-revalidate window in seconds
}

class CryptoDataCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl: number, swr: number = 0): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      swr,
    });
  }

  get<T>(key: string): { data: T | null; isStale: boolean; isSwr: boolean } {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return { data: null, isStale: false, isSwr: false };
    }

    const age = (Date.now() - entry.timestamp) / 1000;
    const isFresh = age < entry.ttl;
    const isStale = age >= entry.ttl;
    const isSwr = age >= entry.ttl && age < (entry.ttl + entry.swr);
    const isExpired = age >= (entry.ttl + entry.swr);

    if (isExpired) {
      return { data: null, isStale: true, isSwr: false };
    }

    return { data: entry.data, isStale, isSwr };
  }

  has(key: string): boolean {
    const result = this.get(key);
    return result.data !== null;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Market data types
export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  priceUsd: number;
  priceChange24hPct: number;
  marketCapUsd: number;
  volume24hUsd: number;
  image?: string;
}

export interface AssetSummary {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  priceChange24hPct: number;
  priceChange7dPct?: number;
  priceChange30dPct?: number;
  marketCapUsd: number;
  volume24hUsd: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  athUsd?: number;
  athDate?: string;
  atlUsd?: number;
  atlDate?: string;
  rank?: number;
  image?: string;
  lastUpdated: string;
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export interface MarketTicker {
  exchange: string;
  pair: string;
  priceUsd: number;
  volume24hUsd: number;
  trustScore?: string;
  tradeUrl?: string;
}

export interface NewsItem {
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: string;
}

class CryptoDataService {
  private cache = new CryptoDataCache();
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private coincapUrl = 'https://api.coincap.io/v2';
  
  // Cache TTLs in seconds
  private readonly TTL = {
    MARKET_LIST: 120,     // 2 minutes
    ASSET_SUMMARY: 60,    // 1 minute
    CHART: 900,           // 15 minutes
    MARKETS: 3600,        // 1 hour
    NEWS: 21600,          // 6 hours
    PROFILE: 86400,       // 24 hours
  };
  
  // Stale-while-revalidate windows in seconds
  private readonly SWR = {
    MARKET_LIST: 1800,    // 30 minutes
    ASSET_SUMMARY: 1800,  // 30 minutes
    CHART: 3600,          // 1 hour
    MARKETS: 21600,       // 6 hours
    NEWS: 43200,          // 12 hours
    PROFILE: 172800,      // 48 hours
  };

  /**
   * Get top coins by market cap
   */
  async getMarketSummaryTop(options: { limit?: number; currency?: string } = {}): Promise<MarketCoin[]> {
    const { limit = 100, currency = 'usd' } = options;
    const cacheKey = `market_top_${limit}_${currency}`;
    
    const cached = this.cache.get<MarketCoin[]>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        return await this.fallbackToCoinCap(limit);
      }

      const data = await response.json();
      const coins: MarketCoin[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        rank: coin.market_cap_rank,
        priceUsd: coin.current_price,
        priceChange24hPct: coin.price_change_percentage_24h || 0,
        marketCapUsd: coin.market_cap,
        volume24hUsd: coin.total_volume,
        image: coin.image,
      }));

      this.cache.set(cacheKey, coins, this.TTL.MARKET_LIST, this.SWR.MARKET_LIST);
      return coins;
    } catch (error) {
      if (cached.data) {
        return cached.data;
      }
      console.error('Error fetching market summary:', error);
      return [];
    }
  }

  /**
   * Fallback to CoinCap API for basic market data
   */
  private async fallbackToCoinCap(limit: number): Promise<MarketCoin[]> {
    try {
      const response = await fetch(`${this.coincapUrl}/assets?limit=${limit}`);
      if (!response.ok) return [];

      const data = await response.json();
      return data.data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toLowerCase(),
        name: coin.name,
        rank: parseInt(coin.rank),
        priceUsd: parseFloat(coin.priceUsd),
        priceChange24hPct: parseFloat(coin.changePercent24Hr) || 0,
        marketCapUsd: parseFloat(coin.marketCapUsd),
        volume24hUsd: parseFloat(coin.volumeUsd24Hr),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get detailed asset summary by CoinGecko ID
   */
  async getAssetSummary(coingeckoId: string, currency: string = 'usd'): Promise<AssetSummary | null> {
    const cacheKey = `asset_summary_${coingeckoId}_${currency}`;
    
    const cached = this.cache.get<AssetSummary>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/coins/${coingeckoId}?localization=false&tickers=false&community_data=false&developer_data=false`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        return null;
      }

      const coin = await response.json();
      const marketData = coin.market_data;

      const summary: AssetSummary = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        priceUsd: marketData.current_price[currency] || 0,
        priceChange24hPct: marketData.price_change_percentage_24h || 0,
        priceChange7dPct: marketData.price_change_percentage_7d,
        priceChange30dPct: marketData.price_change_percentage_30d,
        marketCapUsd: marketData.market_cap[currency] || 0,
        volume24hUsd: marketData.total_volume[currency] || 0,
        circulatingSupply: marketData.circulating_supply,
        totalSupply: marketData.total_supply,
        maxSupply: marketData.max_supply,
        athUsd: marketData.ath[currency],
        athDate: marketData.ath_date[currency],
        atlUsd: marketData.atl[currency],
        atlDate: marketData.atl_date[currency],
        rank: marketData.market_cap_rank,
        image: coin.image?.large,
        lastUpdated: marketData.last_updated || new Date().toISOString(),
      };

      this.cache.set(cacheKey, summary, this.TTL.ASSET_SUMMARY, this.SWR.ASSET_SUMMARY);
      return summary;
    } catch (error) {
      if (cached.data) {
        return cached.data;
      }
      console.error('Error fetching asset summary:', error);
      return null;
    }
  }

  /**
   * Get price chart data
   */
  async getAssetChart(coingeckoId: string, range: string = '7d', currency: string = 'usd'): Promise<ChartDataPoint[]> {
    const cacheKey = `chart_${coingeckoId}_${range}_${currency}`;
    
    const cached = this.cache.get<ChartDataPoint[]>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    // Map range to days
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'max': 3650,
    };
    const days = daysMap[range] || 7;

    try {
      const url = `${this.baseUrl}/coins/${coingeckoId}/market_chart?vs_currency=${currency}&days=${days}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        return [];
      }

      const data = await response.json();
      const chartData: ChartDataPoint[] = data.prices.map((point: [number, number]) => ({
        timestamp: point[0],
        price: point[1],
      }));

      this.cache.set(cacheKey, chartData, this.TTL.CHART, this.SWR.CHART);
      return chartData;
    } catch (error) {
      if (cached.data) {
        return cached.data;
      }
      console.error('Error fetching chart data:', error);
      return [];
    }
  }

  /**
   * Get trading markets/tickers for an asset
   */
  async getAssetMarkets(coingeckoId: string, limit: number = 50): Promise<MarketTicker[]> {
    const cacheKey = `markets_${coingeckoId}_${limit}`;
    
    const cached = this.cache.get<MarketTicker[]>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/coins/${coingeckoId}/tickers?per_page=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        return [];
      }

      const data = await response.json();
      const markets: MarketTicker[] = data.tickers.map((ticker: any) => ({
        exchange: ticker.market?.name || 'Unknown',
        pair: `${ticker.base}/${ticker.target}`,
        priceUsd: ticker.converted_last?.usd || 0,
        volume24hUsd: ticker.converted_volume?.usd || 0,
        trustScore: ticker.trust_score,
        tradeUrl: ticker.trade_url,
      }));

      this.cache.set(cacheKey, markets, this.TTL.MARKETS, this.SWR.MARKETS);
      return markets;
    } catch (error) {
      if (cached.data) {
        return cached.data;
      }
      console.error('Error fetching markets:', error);
      return [];
    }
  }

  /**
   * Get news for an asset (using RSS-like approach with status updates)
   */
  async getAssetNews(query: string, limit: number = 10): Promise<NewsItem[]> {
    const cacheKey = `news_${query}_${limit}`;
    
    const cached = this.cache.get<NewsItem[]>(cacheKey);
    if (cached.data) {
      return cached.data;
    }

    // For now, return empty - would need to integrate with a news API
    // CoinGecko free tier doesn't include news
    const news: NewsItem[] = [];
    this.cache.set(cacheKey, news, this.TTL.NEWS, this.SWR.NEWS);
    return news;
  }

  /**
   * Get basic asset profile (description, links, etc.)
   */
  async getAssetProfile(coingeckoId: string): Promise<{
    description?: string;
    website?: string;
    whitepaper?: string;
    twitter?: string;
    reddit?: string;
    github?: string;
    categories?: string[];
    contracts?: { chain: string; address: string }[];
  } | null> {
    const cacheKey = `profile_${coingeckoId}`;
    
    const cached = this.cache.get<any>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/coins/${coingeckoId}?localization=false&tickers=false&community_data=false&developer_data=false`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        return null;
      }

      const coin = await response.json();
      
      const profile = {
        description: coin.description?.en,
        website: coin.links?.homepage?.[0],
        whitepaper: coin.links?.whitepaper,
        twitter: coin.links?.twitter_screen_name ? `https://twitter.com/${coin.links.twitter_screen_name}` : undefined,
        reddit: coin.links?.subreddit_url,
        github: coin.links?.repos_url?.github?.[0],
        categories: coin.categories,
        contracts: coin.platforms ? Object.entries(coin.platforms)
          .filter(([_, addr]) => addr)
          .map(([chain, address]) => ({ chain, address: address as string })) : [],
      };

      this.cache.set(cacheKey, profile, this.TTL.PROFILE, this.SWR.PROFILE);
      return profile;
    } catch (error) {
      if (cached.data) {
        return cached.data;
      }
      console.error('Error fetching asset profile:', error);
      return null;
    }
  }

  /**
   * Refresh market snapshots and update storage
   */
  async refreshMarketSnapshots(storage: any): Promise<void> {
    try {
      const coins = await this.getMarketSummaryTop({ limit: 100 });
      
      for (const coin of coins) {
        const snapshot = {
          provider: 'coingecko' as const,
          providerCoinId: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          rank: coin.rank,
          priceUsd: coin.priceUsd,
          priceChange24hPct: coin.priceChange24hPct,
          marketCapUsd: coin.marketCapUsd,
          volume24hUsd: coin.volume24hUsd,
          image: coin.image,
          lastUpdatedAt: new Date().toISOString(),
        };
        
        await storage.upsertCryptoMarketSnapshot(snapshot);
      }
    } catch (error) {
      console.error('Error refreshing market snapshots:', error);
    }
  }
}

// Export singleton instance
export const cryptoDataService = new CryptoDataService();
