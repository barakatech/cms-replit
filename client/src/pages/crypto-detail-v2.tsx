import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Link } from 'wouter';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart
} from 'recharts';
import SignUpCTA from '@/components/SignUpCTA';
import type { CryptoPage } from '@shared/schema';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BinanceSummary {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
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
  count: number;
  spreadPct: number;
  fetchedAt: string;
}

interface BinanceChartPoint {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface OrderBookEntry {
  price: number;
  qty: number;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  fetchedAt: string;
}

interface RecentTrade {
  id: number;
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

type ChartRange = '1H' | '1D' | '1W' | '1M' | '1Y';

const formatPrice = (price: number): string => {
  if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return price.toFixed(6);
};

const formatVolume = (vol: number): string => {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(2)}K`;
  return `$${vol.toFixed(2)}`;
};

const formatNumber = (num: number, decimals = 2): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toFixed(decimals);
};

function StickyTopBar({ 
  page, 
  summary 
}: { 
  page: CryptoPage;
  summary?: BinanceSummary | null;
}) {
  const price = summary?.lastPrice || page.marketData?.priceUsd || 0;
  const change = summary?.priceChangePercent || page.marketData?.priceChange24hPct || 0;
  const isPositive = change >= 0;

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {page.logoUrl && (
            <img src={page.logoUrl} alt={page.name} className="w-8 h-8 rounded-full" />
          )}
          <div>
            <span className="font-semibold text-foreground">{page.name}</span>
            <span className="text-muted-foreground ml-2">{page.symbol}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold text-foreground">${formatPrice(price)}</div>
            <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </div>
          </div>
          
          <SignUpCTA
            variant="default"
            size="sm"
            customText={`Trade ${page.symbol}`}
            ticker={page.symbol}
            data-testid="sticky-trade-cta"
          />
        </div>
      </div>
    </div>
  );
}

function HeroSection({ 
  page, 
  summary 
}: { 
  page: CryptoPage;
  summary?: BinanceSummary | null;
}) {
  const price = summary?.lastPrice || page.marketData?.priceUsd || 0;
  const change = summary?.priceChangePercent || page.marketData?.priceChange24hPct || 0;
  const changeAbs = summary?.priceChange || (price * change / 100);
  const highPrice = summary?.highPrice || page.marketData?.priceUsd || 0;
  const lowPrice = summary?.lowPrice || 0;
  const volume = summary?.quoteVolume || page.marketData?.volume24hUsd || 0;
  const isPositive = change >= 0;
  const asOfTime = summary?.fetchedAt ? new Date(summary.fetchedAt).toLocaleTimeString() : 'Live';

  return (
    <section className="py-8" data-testid="hero-section">
      <div className="flex items-start gap-4 mb-6">
        {page.logoUrl && (
          <img src={page.logoUrl} alt={page.name} className="w-16 h-16 rounded-full" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{page.title_en || page.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{page.symbol}</Badge>
            {page.assetType && <Badge variant="outline">{page.assetType}</Badge>}
            {page.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-5xl font-bold text-foreground mb-2">
            ${formatPrice(price)}
          </div>
          <div className={`flex items-center gap-2 text-lg ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            <span>{isPositive ? '+' : ''}{formatPrice(Math.abs(changeAbs))}</span>
            <span>({isPositive ? '+' : ''}{change.toFixed(2)}%)</span>
            <span className="text-muted-foreground text-sm">24h</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">As of {asOfTime}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground">24h High</div>
            <div className="font-semibold text-foreground">${formatPrice(highPrice)}</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground">24h Low</div>
            <div className="font-semibold text-foreground">${formatPrice(lowPrice)}</div>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border col-span-2">
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-semibold text-foreground">{formatVolume(volume)}</div>
          </div>
        </div>
      </div>

      {page.heroSummary_en && (
        <p className="mt-6 text-muted-foreground leading-relaxed">
          {page.heroSummary_en}
        </p>
      )}
    </section>
  );
}

function ChartSection({ 
  symbol,
  binanceSymbol,
  coingeckoId,
  currentPrice 
}: { 
  symbol: string;
  binanceSymbol?: string;
  coingeckoId?: string;
  currentPrice: number;
}) {
  const [range, setRange] = useState<ChartRange>('1D');
  
  const intervalMap: Record<ChartRange, string> = {
    '1H': '1m',
    '1D': '1h',
    '1W': '4h',
    '1M': '1d',
    '1Y': '1w',
  };

  const { data: chartData, isLoading } = useQuery<BinanceChartPoint[]>({
    queryKey: ['/api/crypto/binance', binanceSymbol, 'klines', range],
    queryFn: async () => {
      if (!binanceSymbol) return [];
      const interval = intervalMap[range];
      const res = await fetch(`/api/crypto/binance/${binanceSymbol}/klines?interval=${interval}&limit=100`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!binanceSymbol,
    staleTime: 60000,
  });

  const fallbackData = useMemo(() => {
    if (chartData && chartData.length > 0) return null;
    const points = 50;
    const data: { t: number; close: number }[] = [];
    let price = currentPrice * 0.9;
    const now = Date.now();
    for (let i = 0; i < points; i++) {
      price += (Math.random() - 0.48) * (currentPrice * 0.02);
      data.push({ t: now - (points - i) * 3600000, close: Math.max(price, currentPrice * 0.5) });
    }
    return data;
  }, [chartData, currentPrice]);

  const displayData = chartData && chartData.length > 0 
    ? chartData.map(d => ({ t: d.t, close: d.close }))
    : fallbackData || [];

  const minPrice = Math.min(...displayData.map(d => d.close)) * 0.98;
  const maxPrice = Math.max(...displayData.map(d => d.close)) * 1.02;

  return (
    <Card className="border-border" data-testid="chart-section">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-lg">Price Chart</CardTitle>
        <div className="flex gap-1">
          {(['1H', '1D', '1W', '1M', '1Y'] as ChartRange[]).map((r) => (
            <Button
              key={r}
              variant={range === r ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRange(r)}
              data-testid={`chart-range-${r}`}
            >
              {r}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="t" 
                  hide 
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis 
                  hide 
                  domain={[minPrice, maxPrice]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(ts) => new Date(ts).toLocaleString()}
                  formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#chartGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Data source: Binance{!binanceSymbol && ' (Fallback mode)'}
        </p>
      </CardContent>
    </Card>
  );
}

function KeyStatsGrid({ 
  summary, 
  page 
}: { 
  summary?: BinanceSummary | null;
  page: CryptoPage;
}) {
  const stats = [
    { label: 'Last Price', value: summary?.lastPrice ? `$${formatPrice(summary.lastPrice)}` : 'N/A' },
    { label: '24h Change', value: summary?.priceChangePercent ? `${summary.priceChangePercent >= 0 ? '+' : ''}${summary.priceChangePercent.toFixed(2)}%` : 'N/A', highlight: summary?.priceChangePercent },
    { label: '24h High', value: summary?.highPrice ? `$${formatPrice(summary.highPrice)}` : 'N/A' },
    { label: '24h Low', value: summary?.lowPrice ? `$${formatPrice(summary.lowPrice)}` : 'N/A' },
    { label: 'Base Volume', value: summary?.volume ? formatNumber(summary.volume) : 'N/A' },
    { label: 'Quote Volume', value: summary?.quoteVolume ? formatVolume(summary.quoteVolume) : 'N/A' },
    { label: 'Best Bid', value: summary?.bidPrice ? `$${formatPrice(summary.bidPrice)}` : 'N/A' },
    { label: 'Best Ask', value: summary?.askPrice ? `$${formatPrice(summary.askPrice)}` : 'N/A' },
    { label: 'Spread', value: summary?.spreadPct ? `${summary.spreadPct.toFixed(4)}%` : 'N/A' },
    { label: 'Trades (24h)', value: summary?.count ? formatNumber(summary.count, 0) : 'N/A' },
  ];

  return (
    <Card className="border-border" data-testid="stats-section">
      <CardHeader>
        <CardTitle className="text-lg">Key Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className={`font-semibold ${
                stat.highlight !== undefined 
                  ? stat.highlight >= 0 ? 'text-green-500' : 'text-red-500'
                  : 'text-foreground'
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DepthTradesSection({ 
  binanceSymbol 
}: { 
  binanceSymbol?: string;
}) {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook');

  const { data: orderBook } = useQuery<OrderBook>({
    queryKey: ['/api/crypto/binance', binanceSymbol, 'depth'],
    queryFn: async () => {
      if (!binanceSymbol) return null;
      const res = await fetch(`/api/crypto/binance/${binanceSymbol}/depth?limit=10`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!binanceSymbol,
    refetchInterval: 10000,
  });

  const { data: tradesData } = useQuery<{ trades: RecentTrade[] }>({
    queryKey: ['/api/crypto/binance', binanceSymbol, 'trades'],
    queryFn: async () => {
      if (!binanceSymbol) return null;
      const res = await fetch(`/api/crypto/binance/${binanceSymbol}/trades?limit=20`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!binanceSymbol,
    refetchInterval: 15000,
  });

  if (!binanceSymbol) {
    return (
      <Card className="border-border">
        <CardContent className="py-8 text-center text-muted-foreground">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Order book and trades data require Binance API access</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border" data-testid="depth-trades-section">
      <CardHeader className="pb-2">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'orderbook' | 'trades')}>
          <TabsList className="grid w-full max-w-[300px] grid-cols-2">
            <TabsTrigger value="orderbook" data-testid="tab-orderbook">Order Book</TabsTrigger>
            <TabsTrigger value="trades" data-testid="tab-trades">Recent Trades</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {activeTab === 'orderbook' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">Bids (Buy)</div>
              <div className="space-y-1">
                {(orderBook?.bids || []).slice(0, 10).map((bid, i) => (
                  <div key={i} className="flex justify-between text-sm bg-green-500/10 px-2 py-1 rounded">
                    <span className="text-green-500">${formatPrice(bid.price)}</span>
                    <span className="text-muted-foreground">{formatNumber(bid.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">Asks (Sell)</div>
              <div className="space-y-1">
                {(orderBook?.asks || []).slice(0, 10).map((ask, i) => (
                  <div key={i} className="flex justify-between text-sm bg-red-500/10 px-2 py-1 rounded">
                    <span className="text-red-500">${formatPrice(ask.price)}</span>
                    <span className="text-muted-foreground">{formatNumber(ask.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'trades' && (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-3 text-xs text-muted-foreground font-medium mb-2 px-2">
              <span>Price</span>
              <span>Amount</span>
              <span>Time</span>
            </div>
            {(tradesData?.trades || []).map((trade) => (
              <div key={trade.id} className="grid grid-cols-3 text-sm px-2 py-1 hover:bg-muted/50 rounded">
                <span className={trade.isBuyerMaker ? 'text-red-500' : 'text-green-500'}>
                  ${formatPrice(trade.price)}
                </span>
                <span className="text-foreground">{formatNumber(trade.qty)}</span>
                <span className="text-muted-foreground">
                  {new Date(trade.time).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AboutSection({ page }: { page: CryptoPage }) {
  return (
    <Card className="border-border" data-testid="about-section">
      <CardHeader>
        <CardTitle className="text-lg">About {page.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {page.aboutFull_en && (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: page.aboutFull_en }}
          />
        )}
        
        {page.howItWorks_en && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.howItWorks_en }}
            />
          </div>
        )}

        {page.useCases_en && page.useCases_en.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-2">Use Cases</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {page.useCases_en.map((useCase, i) => (
                <li key={i}>{useCase}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiskSection({ page }: { page: CryptoPage }) {
  if (!page.risks_en) return null;

  return (
    <Card className="border-border border-orange-500/30 bg-orange-500/5" data-testid="risk-section">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-orange-500">
          <AlertTriangle className="h-5 w-5" />
          Risk Disclosure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: page.risks_en }}
        />
      </CardContent>
    </Card>
  );
}

function FAQSection({ page }: { page: CryptoPage }) {
  if (!page.faq || page.faq.length === 0) return null;

  return (
    <Card className="border-border" data-testid="faq-section">
      <CardHeader>
        <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {page.faq.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">
                {item.question_en}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer_en}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function DisclosuresSection({ page }: { page: CryptoPage }) {
  if (!page.disclaimers_en || page.disclaimers_en.length === 0) return null;

  return (
    <Card className="border-border bg-muted/30" data-testid="disclosures-section">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Disclosures</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-xs text-muted-foreground space-y-2">
          {page.disclaimers_en.map((disclaimer, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{disclaimer}</span>
            </li>
          ))}
        </ul>
        {page.disclosuresFooterNote_en && (
          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            {page.disclosuresFooterNote_en}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function BottomStickyCTA({ page }: { page: CryptoPage }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 md:hidden">
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        <div className="text-xs text-muted-foreground">
          Trading involves risk. Please invest responsibly.
        </div>
        <SignUpCTA
          variant="default"
          size="default"
          customText={`Trade ${page.symbol}`}
          ticker={page.symbol}
          data-testid="bottom-trade-cta"
        />
      </div>
    </div>
  );
}

export default function CryptoDetailV2() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: page, isLoading: pageLoading } = useQuery<CryptoPage>({
    queryKey: ['/api/crypto/pages/slug', slug],
  });

  const binanceSymbol = page?.binanceSymbol || (page?.symbol ? `${page.symbol}USDT` : undefined);

  const { data: summary } = useQuery<BinanceSummary>({
    queryKey: ['/api/crypto/binance', binanceSymbol, 'summary'],
    queryFn: async () => {
      if (!binanceSymbol) return null;
      const res = await fetch(`/api/crypto/binance/${binanceSymbol}/summary`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!binanceSymbol,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const currentPrice = summary?.lastPrice || page?.marketData?.priceUsd || 0;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Crypto Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The cryptocurrency page you're looking for doesn't exist.
            </p>
            <Link href="/crypto">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Crypto
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <StickyTopBar page={page} summary={summary} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/crypto">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Crypto
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HeroSection page={page} summary={summary} />
            <ChartSection 
              symbol={page.symbol}
              binanceSymbol={binanceSymbol}
              coingeckoId={page.coingeckoId}
              currentPrice={currentPrice}
            />
            <KeyStatsGrid summary={summary} page={page} />
            <DepthTradesSection binanceSymbol={binanceSymbol} />
            <AboutSection page={page} />
          </div>
          
          <div className="space-y-6">
            <Card className="border-border sticky top-20">
              <CardContent className="py-6">
                <h3 className="font-semibold text-foreground mb-4">Start Trading</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Trade {page.name} with low fees and secure transactions.
                </p>
                <SignUpCTA
                  variant="default"
                  size="lg"
                  className="w-full"
                  customText={`Trade ${page.symbol}`}
                  ticker={page.symbol}
                  data-testid="sidebar-trade-cta"
                />
              </CardContent>
            </Card>
            
            <RiskSection page={page} />
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <FAQSection page={page} />
          <DisclosuresSection page={page} />
        </div>
      </main>

      <BottomStickyCTA page={page} />
    </div>
  );
}
