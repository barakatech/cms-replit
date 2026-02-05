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
  ArrowLeft,
  Coins,
  AlertTriangle,
  ChartLine
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import { useLanguage } from '@/lib/language-context';
import type { CryptoPage, CryptoMarketSnapshot } from '@shared/schema';

export default function CryptoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, isRTL } = useLanguage();

  const { data: crypto, isLoading, error } = useQuery<CryptoPage>({
    queryKey: ['/api/crypto/pages/slug', slug],
  });

  const { data: snapshots = [] } = useQuery<CryptoMarketSnapshot[]>({
    queryKey: ['/api/crypto/snapshots'],
    enabled: !!crypto,
  });

  const snapshot = snapshots.find(s => s.providerCoinId === crypto?.coingeckoId);

  const labels = {
    en: {
      backToCrypto: 'Back to Crypto',
      notFound: 'Cryptocurrency Not Found',
      notFoundDesc: "The cryptocurrency you're looking for doesn't exist or has been removed.",
      currentPrice: 'Current Price',
      marketCap: 'Market Cap',
      volume24h: '24h Volume',
      circulatingSupply: 'Circulating Supply',
      allTimeHigh: 'All-Time High',
      trade: 'Trade',
      whatIs: 'What is',
      howItWorks: 'How It Works',
      useCases: 'Use Cases',
      riskFactors: 'Risk Factors',
      supplyInfo: 'Supply Information',
      totalSupply: 'Total Supply',
      maxSupply: 'Max Supply',
      disclaimers: 'Disclaimers',
      disclaimer: 'Capital at risk. Crypto assets are highly volatile. Not investment advice.',
      rank: 'Rank',
    },
    ar: {
      backToCrypto: 'العودة إلى العملات الرقمية',
      notFound: 'العملة الرقمية غير موجودة',
      notFoundDesc: 'العملة الرقمية التي تبحث عنها غير موجودة أو تمت إزالتها.',
      currentPrice: 'السعر الحالي',
      marketCap: 'القيمة السوقية',
      volume24h: 'حجم التداول ٢٤س',
      circulatingSupply: 'العرض المتداول',
      allTimeHigh: 'أعلى سعر تاريخي',
      trade: 'تداول',
      whatIs: 'ما هو',
      howItWorks: 'كيف يعمل',
      useCases: 'حالات الاستخدام',
      riskFactors: 'عوامل المخاطرة',
      supplyInfo: 'معلومات العرض',
      totalSupply: 'إجمالي العرض',
      maxSupply: 'أقصى عرض',
      disclaimers: 'إخلاء المسؤولية',
      disclaimer: 'رأس المال في خطر. الأصول الرقمية شديدة التقلب. ليست نصيحة استثمارية.',
      rank: 'الترتيب',
    },
  };

  const t = labels[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <Bitcoin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t.notFound}</h1>
          <p className="text-muted-foreground mb-6">{t.notFoundDesc}</p>
          <Link href="/crypto">
            <Button variant="outline">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {t.backToCrypto}
            </Button>
          </Link>
        </div>
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

  const title = language === 'en' ? crypto.title_en : crypto.title_ar;
  const heroSummary = language === 'en' ? crypto.heroSummary_en : crypto.heroSummary_ar;
  const whatIsIt = language === 'en' ? crypto.whatIsIt_en : crypto.whatIsIt_ar;
  const howItWorks = language === 'en' ? crypto.howItWorks_en : crypto.howItWorks_ar;
  const useCases = language === 'en' ? crypto.useCases_en : crypto.useCases_ar;
  const risks = language === 'en' ? crypto.risks_en : crypto.risks_ar;
  const disclaimers = language === 'en' ? crypto.disclaimers_en : crypto.disclaimers_ar;

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <BarakaHeader />

      <div className="bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <Link href="/crypto">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {t.backToCrypto}
              </Button>
            </Link>
          </div>

          <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {snapshot?.image ? (
                    <img src={snapshot.image} alt={crypto.name} className="w-14 h-14" />
                  ) : (
                    <Bitcoin className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Badge variant="outline">
                      {t.rank} #{crypto.marketCapRank || snapshot?.rank || '-'}
                    </Badge>
                    <Badge variant="secondary" className="uppercase">
                      {crypto.symbol}
                    </Badge>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-crypto-title">
                {title || crypto.name}
              </h1>
              {heroSummary && (
                <p className="mt-4 text-muted-foreground max-w-2xl">
                  {heroSummary}
                </p>
              )}
            </div>

            <Card className="w-full md:w-80 shrink-0">
              <CardContent className="pt-6">
                <div className={`text-center mb-4 ${isRTL ? 'text-center' : ''}`}>
                  <p className="text-sm text-muted-foreground">{t.currentPrice}</p>
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
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-muted-foreground">{t.marketCap}</p>
                    <p className="font-medium">{formatMarketCap(snapshot?.marketCapUsd)}</p>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-muted-foreground">{t.volume24h}</p>
                    <p className="font-medium">{formatMarketCap(snapshot?.volume24hUsd)}</p>
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg" data-testid="button-trade">
                  {t.trade} {crypto.symbol}
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
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t.marketCap}</span>
              </div>
              <p className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>{formatMarketCap(snapshot?.marketCapUsd)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ChartLine className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t.volume24h}</span>
              </div>
              <p className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>{formatMarketCap(snapshot?.volume24hUsd)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t.circulatingSupply}</span>
              </div>
              <p className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>{formatSupply(snapshot?.circulatingSupply)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t.allTimeHigh}</span>
              </div>
              <p className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>{formatPrice(snapshot?.athUsd)}</p>
            </CardContent>
          </Card>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="lg:col-span-2 space-y-6">
            {whatIsIt && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.whatIs} {crypto.name}?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{whatIsIt}</p>
                </CardContent>
              </Card>
            )}

            {howItWorks && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.howItWorks}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{howItWorks}</p>
                </CardContent>
              </Card>
            )}

            {useCases && useCases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.useCases}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`list-disc space-y-2 text-muted-foreground ${isRTL ? 'list-inside' : 'list-inside'}`}>
                    {useCases.map((useCase, i) => (
                      <li key={i}>{useCase}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {risks && (
              <Card className="border-amber-500/20">
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-amber-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <AlertTriangle className="h-5 w-5" />
                    {t.riskFactors}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{risks}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t.supplyInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.circulatingSupply}</p>
                  <p className="font-medium">{formatSupply(snapshot?.circulatingSupply)} {crypto.symbol}</p>
                </div>
                {snapshot?.totalSupply && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.totalSupply}</p>
                    <p className="font-medium">{formatSupply(snapshot.totalSupply)} {crypto.symbol}</p>
                  </div>
                )}
                {snapshot?.maxSupply && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.maxSupply}</p>
                    <p className="font-medium">{formatSupply(snapshot.maxSupply)} {crypto.symbol}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {disclaimers && disclaimers.length > 0 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">{t.disclaimers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {disclaimers.map((disclaimer, i) => (
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
            {t.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
