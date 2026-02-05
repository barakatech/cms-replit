import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Clock,
  ArrowLeft,
  ExternalLink,
  Coins,
  AlertTriangle,
  ChartLine
} from 'lucide-react';
import type { CryptoPage, CryptoMarketSnapshot } from '@shared/schema';

export default function CryptoDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: crypto, isLoading, error } = useQuery<CryptoPage>({
    queryKey: ['/api/crypto/pages/slug', slug],
  });

  const { data: snapshots = [] } = useQuery<CryptoMarketSnapshot[]>({
    queryKey: ['/api/crypto/snapshots'],
    enabled: !!crypto,
  });

  const snapshot = snapshots.find(s => s.providerCoinId === crypto?.coingeckoId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-64 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Bitcoin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Cryptocurrency Not Found</h1>
        <p className="text-muted-foreground mb-6">The cryptocurrency you're looking for doesn't exist or has been removed.</p>
        <Link href="/crypto">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Crypto
          </Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (cap?: number) => {
    if (!cap) return 'N/A';
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const formatSupply = (supply?: number) => {
    if (!supply) return 'N/A';
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
    return supply.toLocaleString();
  };

  const priceChange = snapshot?.priceChange24hPct;
  const isPositive = priceChange && priceChange >= 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Link href="/crypto">
            <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Crypto
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {snapshot?.image ? (
                    <img src={snapshot.image} alt={crypto.name} className="w-14 h-14" />
                  ) : (
                    <Bitcoin className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Rank #{crypto.marketCapRank || snapshot?.rank || '-'}
                    </Badge>
                    <Badge variant="secondary" className="uppercase">
                      {crypto.symbol}
                    </Badge>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-crypto-title">
                {crypto.title_en || crypto.name}
              </h1>
              {crypto.heroSummary_en && (
                <p className="mt-4 text-muted-foreground max-w-2xl">
                  {crypto.heroSummary_en}
                </p>
              )}
            </div>

            <Card className="w-full md:w-80 shrink-0">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-4xl font-bold text-primary" data-testid="text-price">
                    {formatPrice(snapshot?.priceUsd)}
                  </p>
                  <div className={`flex items-center justify-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">{priceChange ? `${priceChange.toFixed(2)}%` : '-'}</span>
                    <span className="text-muted-foreground text-sm">(24h)</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Market Cap</p>
                    <p className="font-medium">{formatMarketCap(snapshot?.marketCapUsd)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volume (24h)</p>
                    <p className="font-medium">{formatMarketCap(snapshot?.volume24hUsd)}</p>
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg" data-testid="button-trade">
                  Trade {crypto.symbol}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Market Cap</span>
              </div>
              <p className="text-2xl font-bold">{formatMarketCap(snapshot?.marketCapUsd)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <ChartLine className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">24h Volume</span>
              </div>
              <p className="text-2xl font-bold">{formatMarketCap(snapshot?.volume24hUsd)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Circulating Supply</span>
              </div>
              <p className="text-2xl font-bold">{formatSupply(snapshot?.circulatingSupply)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">All-Time High</span>
              </div>
              <p className="text-2xl font-bold">{formatPrice(snapshot?.athUsd)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {crypto.whatIsIt_en && (
              <Card>
                <CardHeader>
                  <CardTitle>What is {crypto.name}?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{crypto.whatIsIt_en}</p>
                </CardContent>
              </Card>
            )}

            {crypto.howItWorks_en && (
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{crypto.howItWorks_en}</p>
                </CardContent>
              </Card>
            )}

            {crypto.useCases_en && crypto.useCases_en.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {crypto.useCases_en.map((useCase, i) => (
                      <li key={i}>{useCase}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {crypto.risks_en && (
              <Card className="border-amber-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{crypto.risks_en}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Supply Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Circulating Supply</p>
                  <p className="font-medium">{formatSupply(snapshot?.circulatingSupply)} {crypto.symbol}</p>
                </div>
                {snapshot?.totalSupply && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total Supply</p>
                    <p className="font-medium">{formatSupply(snapshot.totalSupply)} {crypto.symbol}</p>
                  </div>
                )}
                {snapshot?.maxSupply && (
                  <div>
                    <p className="text-sm text-muted-foreground">Max Supply</p>
                    <p className="font-medium">{formatSupply(snapshot.maxSupply)} {crypto.symbol}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {crypto.disclaimers_en && crypto.disclaimers_en.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Disclaimers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {crypto.disclaimers_en.map((disclaimer, i) => (
                      <li key={i}>{disclaimer}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">
            Capital at risk. Crypto assets are highly volatile. Not investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
