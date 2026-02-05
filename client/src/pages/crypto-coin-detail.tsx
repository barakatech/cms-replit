import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Copy, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  Flame,
  ExternalLink,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import SignUpCTA from '@/components/SignUpCTA';
import type { CryptoPage, CryptoMarketSnapshot } from '@shared/schema';

type TimeframeKey = '1D' | '7D' | '1M' | '3M' | '1Y' | 'YTD';

interface ChartDataPoint {
  timestamp: number;
  price: number;
}

interface NewsItem {
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: string;
}

const CRYPTO_METADATA: Record<string, { name: string; contract?: string; coingeckoId: string }> = {
  BTC: { name: 'Bitcoin', coingeckoId: 'bitcoin' },
  ETH: { name: 'Ethereum', coingeckoId: 'ethereum' },
  SOL: { name: 'Solana', contract: 'So11111111111111111111111111111111111111112', coingeckoId: 'solana' },
  USDT: { name: 'Tether', contract: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', coingeckoId: 'tether' },
  BNB: { name: 'BNB', coingeckoId: 'binancecoin' },
  XRP: { name: 'XRP', coingeckoId: 'ripple' },
  USDC: { name: 'USD Coin', contract: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', coingeckoId: 'usd-coin' },
  ADA: { name: 'Cardano', coingeckoId: 'cardano' },
  DOGE: { name: 'Dogecoin', coingeckoId: 'dogecoin' },
  AVAX: { name: 'Avalanche', coingeckoId: 'avalanche-2' },
};

function generateFallbackChartData(
  currentPrice: number,
  timeframe: TimeframeKey,
  seed: number = 42
): ChartDataPoint[] {
  const pointCounts: Record<TimeframeKey, number> = {
    '1D': 96,
    '7D': 168,
    '1M': 120,
    '3M': 90,
    '1Y': 365,
    'YTD': 180,
  };

  const volatilityMap: Record<TimeframeKey, number> = {
    '1D': 0.03,
    '7D': 0.05,
    '1M': 0.08,
    '3M': 0.12,
    '1Y': 0.25,
    'YTD': 0.20,
  };

  const points = pointCounts[timeframe];
  const volatility = volatilityMap[timeframe];
  const data: ChartDataPoint[] = [];
  
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  let price = currentPrice * (1 - volatility * 0.5 + seededRandom(seed) * volatility);
  const now = Date.now();
  const intervalMs = (timeframe === '1D' ? 15 * 60 : 60 * 60) * 1000;

  for (let i = 0; i < points; i++) {
    const change = (seededRandom(seed + i * 7) - 0.5) * volatility * currentPrice * 0.1;
    price = Math.max(price + change, currentPrice * 0.5);
    
    if (i === points - 1) {
      price = currentPrice;
    }
    
    data.push({
      timestamp: now - (points - i) * intervalMs,
      price,
    });
  }

  return data;
}

function truncateAddress(address: string): string {
  if (!address || address.length < 15) return address;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

function formatPrice(price?: number): string {
  if (price === undefined || price === null) return '—';
  if (price >= 1) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (price >= 0.01) {
    return price.toFixed(4);
  }
  return price.toFixed(8);
}

function CoinHeader({ 
  name, 
  symbol, 
  logoUrl, 
  contract,
  isHot = true 
}: { 
  name: string; 
  symbol: string; 
  logoUrl?: string; 
  contract?: string;
  isHot?: boolean;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!contract) return;
    navigator.clipboard.writeText(contract);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Contract address copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  }, [contract, toast]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-8 w-8" />
          ) : (
            <span className="text-lg font-bold text-white">{symbol[0]}</span>
          )}
        </div>
        <h1 className="text-xl font-bold text-white">
          {name} Price ({symbol})
        </h1>
        {isHot && (
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 gap-1">
            <Flame className="h-3 w-3" />
            HOT
          </Badge>
        )}
      </div>
      
      {contract && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Contract Address:</span>
          <code className="text-gray-300">{truncateAddress(contract)}</code>
          <button 
            onClick={handleCopy}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            data-testid="button-copy-contract"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function PriceRow({ 
  symbol, 
  name, 
  price, 
  changePercent,
  timeframe = '1D'
}: { 
  symbol: string; 
  name: string; 
  price?: number;
  changePercent?: number;
  timeframe?: string;
}) {
  const isPositive = (changePercent ?? 0) >= 0;
  
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="text-gray-400 text-sm">
        {symbol} to USD: 1 {name} equals{' '}
        <span className="text-white font-semibold">${formatPrice(price)} USD</span>
      </div>
      {changePercent !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
          <span className="text-gray-500 ml-1">{timeframe}</span>
        </div>
      )}
    </div>
  );
}

function TimeframeTabs({ 
  value, 
  onChange 
}: { 
  value: TimeframeKey; 
  onChange: (v: TimeframeKey) => void;
}) {
  const tabs: TimeframeKey[] = ['1D', '7D', '1M', '3M', '1Y', 'YTD'];
  
  return (
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
            value === tab 
              ? 'bg-primary text-primary-foreground' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          data-testid={`tab-timeframe-${tab}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function PriceChart({ 
  data, 
  isLoading,
  lastUpdated
}: { 
  data: ChartDataPoint[];
  isLoading?: boolean;
  lastUpdated?: string;
}) {
  if (isLoading) {
    return (
      <div className="h-[300px] bg-gray-800/50 rounded-lg flex items-center justify-center">
        <Skeleton className="h-full w-full bg-gray-700" />
      </div>
    );
  }

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="space-y-2">
      <div className="h-[300px] bg-gray-900/50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="timestamp" 
              hide 
            />
            <YAxis 
              domain={[minPrice - padding, maxPrice + padding]}
              orientation="right"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={(v) => `$${formatPrice(v)}`}
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelFormatter={(ts) => new Date(ts).toLocaleString()}
              formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#99FFDD" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#99FFDD' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {lastUpdated && (
        <p className="text-xs text-gray-500">
          Page last updated: {lastUpdated} (UTC+0)
        </p>
      )}
    </div>
  );
}

function BuyPanel({ 
  symbol, 
  name, 
  price,
  logoUrl
}: { 
  symbol: string; 
  name: string; 
  price?: number;
  logoUrl?: string;
}) {
  const [activeTab, setActiveTab] = useState<'buy' | 'trade'>('buy');
  const [buyAmount, setBuyAmount] = useState('1');
  const [spendAmount, setSpendAmount] = useState('');

  const estimatedSpend = useMemo(() => {
    const qty = parseFloat(buyAmount) || 0;
    return price ? (qty * price).toFixed(2) : '0.00';
  }, [buyAmount, price]);

  const feeComparison = [
    { name: 'Binance', fee: 0.1, highlight: true },
    { name: 'Kraken', fee: 0.26, highlight: false },
    { name: 'Coinbase', fee: 1.99, highlight: false },
  ];

  return (
    <Card className="bg-gray-800/80 border-gray-700">
      <CardContent className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'trade')}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger 
              value="buy" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-buy"
            >
              Buy {symbol}
            </TabsTrigger>
            <TabsTrigger 
              value="trade"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-trade"
            >
              Trade {symbol}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">You Buy</label>
            <div className="relative">
              <Input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pr-16"
                placeholder="0"
                data-testid="input-buy-amount"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {logoUrl ? (
                  <img src={logoUrl} alt={symbol} className="h-5 w-5 rounded-full" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {symbol[0]}
                  </div>
                )}
                <span className="text-sm text-gray-300">{symbol}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              1 {symbol} ~ USD ${formatPrice(price)}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">You Spend</label>
            <div className="relative">
              <Input
                type="text"
                value={spendAmount || estimatedSpend}
                onChange={(e) => setSpendAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pr-16"
                placeholder="0.00"
                data-testid="input-spend-amount"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="bg-gray-600 text-gray-200">
                  USD
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <SignUpCTA
          variant="default"
          size="lg"
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold"
          customText={`Buy ${symbol}`}
          ticker={symbol}
        />

        <div className="space-y-3 pt-2">
          <p className="text-xs text-gray-400">
            Binance has the lowest transaction fee rate amongst all major trading platforms.
          </p>
          <div className="space-y-2">
            {feeComparison.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className={`text-xs w-20 ${item.highlight ? 'text-primary font-medium' : 'text-gray-400'}`}>
                  {item.name}
                </span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.highlight ? 'bg-primary' : 'bg-gray-500'}`}
                    style={{ width: `${Math.min(item.fee * 50, 100)}%` }}
                  />
                </div>
                <span className={`text-xs w-12 text-right ${item.highlight ? 'text-primary font-medium' : 'text-gray-400'}`}>
                  {item.fee}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsSection({ symbol, name }: { symbol: string; name: string }) {
  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/crypto/news', symbol, name],
    queryFn: async () => {
      const res = await fetch(`/api/crypto/news?symbol=${symbol}&name=${encodeURIComponent(name)}`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Latest News</h2>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Latest News</h2>
        <p className="text-gray-500 text-sm">No recent news available for {name}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Latest {name} News</h2>
      <div className="grid gap-3">
        {news.slice(0, 6).map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-800/60 border border-gray-700 rounded-lg hover:bg-gray-700/60 transition-colors group"
            data-testid={`news-item-${i}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-primary flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function CryptoCoinDetail() {
  const { symbol: symbolParam } = useParams<{ symbol: string }>();
  const symbol = symbolParam?.toUpperCase() || 'BTC';
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1D');

  const metadata = CRYPTO_METADATA[symbol] || { 
    name: symbol, 
    coingeckoId: symbol.toLowerCase() 
  };

  const { data: cryptoPages = [] } = useQuery<CryptoPage[]>({
    queryKey: ['/api/crypto/pages'],
  });

  const cryptoPage = cryptoPages.find(
    (p) => p.symbol?.toUpperCase() === symbol
  );

  const { data: snapshots = [] } = useQuery<CryptoMarketSnapshot[]>({
    queryKey: ['/api/crypto/snapshots'],
  });

  const snapshot = snapshots.find(
    (s) => s.providerCoinId === (cryptoPage?.coingeckoId || metadata.coingeckoId)
  );

  const { data: chartData, isLoading: chartLoading } = useQuery<ChartDataPoint[]>({
    queryKey: ['/api/crypto/data', metadata.coingeckoId, 'chart', timeframe],
    queryFn: async () => {
      try {
        const days = timeframe === '1D' ? 1 : timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '1Y' ? 365 : 180;
        const res = await fetch(`/api/crypto/data/${metadata.coingeckoId}/chart?days=${days}`);
        if (!res.ok) throw new Error('Chart API failed');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        throw new Error('Empty chart data');
      } catch {
        return generateFallbackChartData(snapshot?.priceUsd || 100, timeframe, symbol.charCodeAt(0));
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const displayChartData = chartData || generateFallbackChartData(snapshot?.priceUsd || 100, timeframe, symbol.charCodeAt(0));
  const lastUpdated = new Date().toISOString().replace('T', ' ').slice(0, 19);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/crypto">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Crypto
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Markets</span>
              <ChevronRight className="h-4 w-4 text-gray-600" />
              <span className="text-gray-400">Crypto</span>
              <ChevronRight className="h-4 w-4 text-gray-600" />
              <span className="text-white font-medium">{symbol}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <CoinHeader
              name={cryptoPage?.name || metadata.name}
              symbol={symbol}
              logoUrl={cryptoPage?.logoUrl || snapshot?.image}
              contract={metadata.contract}
              isHot={snapshot?.rank ? snapshot.rank <= 20 : true}
            />

            <PriceRow
              symbol={symbol}
              name={cryptoPage?.name || metadata.name}
              price={snapshot?.priceUsd}
              changePercent={snapshot?.priceChange24hPct}
              timeframe={timeframe}
            />

            <TimeframeTabs value={timeframe} onChange={setTimeframe} />

            <PriceChart
              data={displayChartData}
              isLoading={chartLoading}
              lastUpdated={lastUpdated}
            />
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <BuyPanel
                symbol={symbol}
                name={cryptoPage?.name || metadata.name}
                price={snapshot?.priceUsd}
                logoUrl={cryptoPage?.logoUrl || snapshot?.image}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <NewsSection symbol={symbol} name={cryptoPage?.name || metadata.name} />
        </div>
      </main>
    </div>
  );
}
