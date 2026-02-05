/**
 * BinanceCryptoDataService - Server-side API aggregation for live crypto market data
 * 
 * Features:
 * - Binance REST API as sole data source for live market data
 * - In-memory caching with TTL and stale-while-revalidate
 * - No external API calls from frontend (all server-side)
 * - Rate limit handling with backoff and stale data serving
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  swr: number;
}

class BinanceCache {
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

// ========== Binance API Types ==========

export interface BinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  symbols: BinanceSymbolInfo[];
}

export interface BinanceSymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  quoteAssetPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: BinanceFilter[];
  permissions: string[];
}

export interface BinanceFilter {
  filterType: string;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  minQty?: string;
  maxQty?: string;
  stepSize?: string;
  minNotional?: string;
}

export interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface BinanceDepth {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface BinanceTrade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

// ========== Our Normalized Types ==========

export interface BinanceMarketPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  bidPrice: number;
  askPrice: number;
  weightedAvgPrice: number;
  openPrice: number;
  count: number;
  closeTime: number;
  tickSize?: string;
  stepSize?: string;
  minNotional?: string;
}

export interface BinanceSummary {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
  weightedAvgPrice: number;
  count: number;
  closeTime: number;
  spreadPct: number;
  tickSize?: string;
  stepSize?: string;
  minNotional?: string;
  fetchedAt: string;
}

export interface BinanceChartPoint {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BinanceOrderBookEntry {
  price: number;
  qty: number;
}

export interface BinanceOrderBook {
  lastUpdateId: number;
  bids: BinanceOrderBookEntry[];
  asks: BinanceOrderBookEntry[];
  fetchedAt: string;
}

export interface BinanceRecentTrade {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

export interface BinanceTradesList {
  trades: BinanceRecentTrade[];
  fetchedAt: string;
}

class BinanceCryptoDataService {
  private cache = new BinanceCache();
  // Try multiple Binance API endpoints for availability
  private baseUrls = [
    'https://api.binance.com/api/v3',
    'https://api1.binance.com/api/v3',
    'https://api2.binance.com/api/v3',
    'https://api3.binance.com/api/v3',
    'https://api4.binance.com/api/v3',
  ];
  private currentBaseUrlIndex = 0;
  
  // Cache TTLs in seconds
  private readonly TTL = {
    EXCHANGE_INFO: 43200,    // 12 hours
    TICKER_24HR: 30,         // 30 seconds
    MARKET_LIST: 60,         // 1 minute
    KLINES: 120,             // 2 minutes (shorter intervals need more frequent updates)
    DEPTH: 10,               // 10 seconds
    TRADES: 15,              // 15 seconds
  };
  
  // Stale-while-revalidate windows in seconds
  private readonly SWR = {
    EXCHANGE_INFO: 86400,    // 24 hours
    TICKER_24HR: 1800,       // 30 minutes
    MARKET_LIST: 1800,       // 30 minutes
    KLINES: 3600,            // 1 hour
    DEPTH: 300,              // 5 minutes
    TRADES: 900,             // 15 minutes
  };

  private lastRequestTime = 0;
  private minRequestInterval = 100; // Minimum ms between requests

  private get baseUrl(): string {
    return this.baseUrls[this.currentBaseUrlIndex];
  }

  private rotateBaseUrl(): void {
    this.currentBaseUrlIndex = (this.currentBaseUrlIndex + 1) % this.baseUrls.length;
    console.log(`Rotating to Binance API: ${this.baseUrl}`);
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    
    // Try fetching with retry on geo-block (451) or server errors
    let response = await fetch(url);
    
    if (response.status === 451 || response.status === 403 || response.status >= 500) {
      // Try rotating to next endpoint
      const originalIndex = this.currentBaseUrlIndex;
      this.rotateBaseUrl();
      
      // Replace the base URL in the request
      const newUrl = url.replace(this.baseUrls[originalIndex], this.baseUrl);
      response = await fetch(newUrl);
    }
    
    return response;
  }

  /**
   * Get exchange info (symbols, filters, etc.)
   */
  async getExchangeInfo(): Promise<BinanceExchangeInfo | null> {
    const cacheKey = 'exchange_info';
    
    const cached = this.cache.get<BinanceExchangeInfo>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const response = await this.rateLimitedFetch(`${this.baseUrl}/exchangeInfo`);
      
      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        console.error('Binance exchangeInfo error:', response.status);
        return cached.data || null;
      }

      const data: BinanceExchangeInfo = await response.json();
      this.cache.set(cacheKey, data, this.TTL.EXCHANGE_INFO, this.SWR.EXCHANGE_INFO);
      return data;
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      return cached.data || null;
    }
  }

  /**
   * Get top trading pairs by quote volume
   */
  async getTopPairs(options: { quoteAsset?: string; limit?: number } = {}): Promise<BinanceMarketPair[]> {
    const { quoteAsset = 'USDT', limit = 100 } = options;
    const cacheKey = `top_pairs_${quoteAsset}_${limit}`;
    
    const cached = this.cache.get<BinanceMarketPair[]>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      // Get exchange info and 24hr tickers
      const [exchangeInfo, tickersResponse] = await Promise.all([
        this.getExchangeInfo(),
        this.rateLimitedFetch(`${this.baseUrl}/ticker/24hr`),
      ]);

      if (!exchangeInfo || !tickersResponse.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        return cached.data || [];
      }

      const tickers: Binance24hrTicker[] = await tickersResponse.json();
      
      // Filter to USDT pairs that are TRADING
      const usdtSymbols = new Set(
        exchangeInfo.symbols
          .filter(s => s.quoteAsset === quoteAsset && s.status === 'TRADING' && s.isSpotTradingAllowed)
          .map(s => s.symbol)
      );

      // Create symbol info map
      const symbolInfoMap = new Map<string, BinanceSymbolInfo>();
      exchangeInfo.symbols.forEach(s => symbolInfoMap.set(s.symbol, s));

      // Filter and sort by quote volume
      const filteredTickers = tickers
        .filter(t => usdtSymbols.has(t.symbol))
        .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, limit);

      const pairs: BinanceMarketPair[] = filteredTickers.map(t => {
        const info = symbolInfoMap.get(t.symbol);
        const filters = info?.filters || [];
        const priceFilter = filters.find(f => f.filterType === 'PRICE_FILTER');
        const lotFilter = filters.find(f => f.filterType === 'LOT_SIZE');
        const notionalFilter = filters.find(f => f.filterType === 'NOTIONAL') || filters.find(f => f.filterType === 'MIN_NOTIONAL');

        return {
          symbol: t.symbol,
          baseAsset: info?.baseAsset || t.symbol.replace(quoteAsset, ''),
          quoteAsset: info?.quoteAsset || quoteAsset,
          status: info?.status || 'TRADING',
          lastPrice: parseFloat(t.lastPrice),
          priceChange: parseFloat(t.priceChange),
          priceChangePercent: parseFloat(t.priceChangePercent),
          highPrice: parseFloat(t.highPrice),
          lowPrice: parseFloat(t.lowPrice),
          volume: parseFloat(t.volume),
          quoteVolume: parseFloat(t.quoteVolume),
          bidPrice: parseFloat(t.bidPrice),
          askPrice: parseFloat(t.askPrice),
          weightedAvgPrice: parseFloat(t.weightedAvgPrice),
          openPrice: parseFloat(t.openPrice),
          count: t.count,
          closeTime: t.closeTime,
          tickSize: priceFilter?.tickSize,
          stepSize: lotFilter?.stepSize,
          minNotional: notionalFilter?.minNotional,
        };
      });

      this.cache.set(cacheKey, pairs, this.TTL.MARKET_LIST, this.SWR.MARKET_LIST);
      return pairs;
    } catch (error) {
      console.error('Error fetching top pairs:', error);
      return cached.data || [];
    }
  }

  /**
   * Get 24hr summary for a specific symbol
   */
  async getSummary(symbol: string): Promise<BinanceSummary | null> {
    const cacheKey = `summary_${symbol}`;
    
    const cached = this.cache.get<BinanceSummary>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const [tickerResponse, exchangeInfo] = await Promise.all([
        this.rateLimitedFetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`),
        this.getExchangeInfo(),
      ]);

      if (!tickerResponse.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        console.error('Binance ticker error:', tickerResponse.status);
        return cached.data || null;
      }

      const ticker: Binance24hrTicker = await tickerResponse.json();
      const symbolInfo = exchangeInfo?.symbols.find(s => s.symbol === symbol);
      
      const filters = symbolInfo?.filters || [];
      const priceFilter = filters.find(f => f.filterType === 'PRICE_FILTER');
      const lotFilter = filters.find(f => f.filterType === 'LOT_SIZE');
      const notionalFilter = filters.find(f => f.filterType === 'NOTIONAL') || filters.find(f => f.filterType === 'MIN_NOTIONAL');

      const bid = parseFloat(ticker.bidPrice);
      const ask = parseFloat(ticker.askPrice);
      const mid = (bid + ask) / 2;
      const spreadPct = mid > 0 ? ((ask - bid) / mid) * 100 : 0;

      const summary: BinanceSummary = {
        symbol: ticker.symbol,
        baseAsset: symbolInfo?.baseAsset || symbol.replace(/USDT|BUSD|BTC|ETH$/, ''),
        quoteAsset: symbolInfo?.quoteAsset || 'USDT',
        status: symbolInfo?.status || 'TRADING',
        lastPrice: parseFloat(ticker.lastPrice),
        priceChange: parseFloat(ticker.priceChange),
        priceChangePercent: parseFloat(ticker.priceChangePercent),
        openPrice: parseFloat(ticker.openPrice),
        highPrice: parseFloat(ticker.highPrice),
        lowPrice: parseFloat(ticker.lowPrice),
        volume: parseFloat(ticker.volume),
        quoteVolume: parseFloat(ticker.quoteVolume),
        bidPrice: bid,
        bidQty: parseFloat(ticker.bidQty),
        askPrice: ask,
        askQty: parseFloat(ticker.askQty),
        weightedAvgPrice: parseFloat(ticker.weightedAvgPrice),
        count: ticker.count,
        closeTime: ticker.closeTime,
        spreadPct,
        tickSize: priceFilter?.tickSize,
        stepSize: lotFilter?.stepSize,
        minNotional: notionalFilter?.minNotional,
        fetchedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, summary, this.TTL.TICKER_24HR, this.SWR.TICKER_24HR);
      return summary;
    } catch (error) {
      console.error('Error fetching summary:', error);
      return cached.data || null;
    }
  }

  /**
   * Get kline (candlestick) data
   */
  async getKlines(symbol: string, interval: string = '1h', limit: number = 500): Promise<BinanceChartPoint[]> {
    const cacheKey = `klines_${symbol}_${interval}_${limit}`;
    
    const cached = this.cache.get<BinanceChartPoint[]>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );

      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        console.error('Binance klines error:', response.status);
        return cached.data || [];
      }

      const klines: unknown[][] = await response.json();
      
      const chartPoints: BinanceChartPoint[] = klines.map((k) => ({
        t: k[0] as number,
        open: parseFloat(k[1] as string),
        high: parseFloat(k[2] as string),
        low: parseFloat(k[3] as string),
        close: parseFloat(k[4] as string),
        volume: parseFloat(k[5] as string),
      }));

      // Adjust TTL based on interval
      const ttl = interval === '1m' ? 30 : interval === '5m' ? 60 : this.TTL.KLINES;
      this.cache.set(cacheKey, chartPoints, ttl, this.SWR.KLINES);
      return chartPoints;
    } catch (error) {
      console.error('Error fetching klines:', error);
      return cached.data || [];
    }
  }

  /**
   * Get order book depth
   */
  async getDepth(symbol: string, limit: number = 10): Promise<BinanceOrderBook | null> {
    const cacheKey = `depth_${symbol}_${limit}`;
    
    const cached = this.cache.get<BinanceOrderBook>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/depth?symbol=${symbol}&limit=${limit}`
      );

      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        console.error('Binance depth error:', response.status);
        return cached.data || null;
      }

      const depth: BinanceDepth = await response.json();
      
      const orderBook: BinanceOrderBook = {
        lastUpdateId: depth.lastUpdateId,
        bids: depth.bids.map(([price, qty]) => ({
          price: parseFloat(price),
          qty: parseFloat(qty),
        })),
        asks: depth.asks.map(([price, qty]) => ({
          price: parseFloat(price),
          qty: parseFloat(qty),
        })),
        fetchedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, orderBook, this.TTL.DEPTH, this.SWR.DEPTH);
      return orderBook;
    } catch (error) {
      console.error('Error fetching depth:', error);
      return cached.data || null;
    }
  }

  /**
   * Get recent trades
   */
  async getTrades(symbol: string, limit: number = 20): Promise<BinanceTradesList | null> {
    const cacheKey = `trades_${symbol}_${limit}`;
    
    const cached = this.cache.get<BinanceTradesList>(cacheKey);
    if (cached.data && !cached.isStale) {
      return cached.data;
    }

    try {
      const response = await this.rateLimitedFetch(
        `${this.baseUrl}/trades?symbol=${symbol}&limit=${limit}`
      );

      if (!response.ok) {
        if (cached.data && cached.isSwr) {
          return cached.data;
        }
        console.error('Binance trades error:', response.status);
        return cached.data || null;
      }

      const trades: BinanceTrade[] = await response.json();
      
      const tradesList: BinanceTradesList = {
        trades: trades.map(t => ({
          id: t.id,
          price: parseFloat(t.price),
          qty: parseFloat(t.qty),
          time: t.time,
          isBuyerMaker: t.isBuyerMaker,
        })),
        fetchedAt: new Date().toISOString(),
      };

      this.cache.set(cacheKey, tradesList, this.TTL.TRADES, this.SWR.TRADES);
      return tradesList;
    } catch (error) {
      console.error('Error fetching trades:', error);
      return cached.data || null;
    }
  }

  /**
   * Get list of tradeable USDT pairs (for CMS dropdown)
   */
  async getTradeablePairs(quoteAsset: string = 'USDT'): Promise<Array<{ symbol: string; baseAsset: string; quoteAsset: string }>> {
    const exchangeInfo = await this.getExchangeInfo();
    if (!exchangeInfo) return [];

    return exchangeInfo.symbols
      .filter(s => s.quoteAsset === quoteAsset && s.status === 'TRADING' && s.isSpotTradingAllowed)
      .map(s => ({
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
      }))
      .sort((a, b) => a.baseAsset.localeCompare(b.baseAsset));
  }
}

export const binanceDataService = new BinanceCryptoDataService();
