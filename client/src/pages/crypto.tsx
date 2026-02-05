import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bitcoin, 
  Search, 
  Star, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Coins
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import type { CryptoPage, CryptoMarketSnapshot } from '@shared/schema';

export default function CryptoLanding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  const isRTL = language === 'ar';

  const { data: cryptoPages = [], isLoading: pagesLoading } = useQuery<CryptoPage[]>({
    queryKey: ['/api/crypto/pages'],
  });

  const { data: snapshots = [] } = useQuery<CryptoMarketSnapshot[]>({
    queryKey: ['/api/crypto/snapshots'],
  });

  const snapshotMap = new Map(snapshots.map(s => [s.providerCoinId, s]));

  const publishedCryptos = cryptoPages.filter(c => c.status === 'published');
  
  const filteredCryptos = publishedCryptos.filter(crypto => {
    const query = searchQuery.toLowerCase();
    const title = language === 'en' ? crypto.title_en : crypto.title_ar;
    return (
      title?.toLowerCase().includes(query) ||
      crypto.name?.toLowerCase().includes(query) ||
      crypto.symbol?.toLowerCase().includes(query)
    );
  });

  const featuredCryptos = publishedCryptos.filter(c => c.featured).slice(0, 3);
  const displayFeatured = featuredCryptos.length > 0 ? featuredCryptos : publishedCryptos.slice(0, 3);

  const labels = {
    en: {
      heroTitle: 'Explore Crypto',
      heroSubtitle: 'Discover the top cryptocurrencies by market capitalization.',
      searchPlaceholder: 'Search by name or symbol...',
      featuredCryptos: 'Featured Cryptocurrencies',
      allCryptos: 'All Cryptocurrencies',
      cryptos: 'cryptocurrencies',
      price: 'Price',
      change24h: '24h Change',
      marketCap: 'Market Cap',
      rank: 'Rank',
      noResults: 'No cryptocurrencies found matching your search.',
      disclaimer: 'Capital at risk. Crypto assets are highly volatile. Not investment advice.',
      noCryptos: 'No Cryptocurrencies Yet',
      noCryptosDesc: 'Check back later for cryptocurrency listings.',
    },
    ar: {
      heroTitle: 'استكشف العملات الرقمية',
      heroSubtitle: 'اكتشف أفضل العملات الرقمية حسب القيمة السوقية.',
      searchPlaceholder: 'البحث بالاسم أو الرمز...',
      featuredCryptos: 'العملات الرقمية المميزة',
      allCryptos: 'جميع العملات الرقمية',
      cryptos: 'عملات رقمية',
      price: 'السعر',
      change24h: 'التغيير ٢٤س',
      marketCap: 'القيمة السوقية',
      rank: 'الترتيب',
      noResults: 'لم يتم العثور على عملات رقمية تطابق بحثك.',
      disclaimer: 'رأس المال في خطر. الأصول الرقمية شديدة التقلب. ليست نصيحة استثمارية.',
      noCryptos: 'لا توجد عملات رقمية بعد',
      noCryptosDesc: 'تحقق مرة أخرى لاحقًا للحصول على قوائم العملات الرقمية.',
    },
  };

  const t = labels[language];

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (cap?: number) => {
    if (!cap) return '-';
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const CryptoCard = ({ crypto, featured = false }: { crypto: CryptoPage; featured?: boolean }) => {
    const title = language === 'en' ? crypto.title_en : crypto.title_ar;
    const snapshot = snapshotMap.get(crypto.coingeckoId || '');
    const priceChange = snapshot?.priceChange24hPct;
    const isPositive = priceChange && priceChange >= 0;
    
    return (
      <Link href={`/crypto/${crypto.slug}`}>
        <Card 
          className={`hover-elevate cursor-pointer h-full ${featured ? 'border-primary/20' : ''}`}
          data-testid={`crypto-card-${crypto.slug}`}
        >
          <CardContent className={`p-5 ${featured ? 'pb-6' : ''}`}>
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {snapshot?.image ? (
                  <img src={snapshot.image} alt={crypto.name} className="w-10 h-10" />
                ) : (
                  <Bitcoin className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {crypto.featured && (
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  )}
                  <Badge variant="outline" className="text-xs shrink-0">
                    #{crypto.marketCapRank || '-'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title || crypto.name}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {crypto.symbol}
                </p>
              </div>
            </div>
            
            <div className={`mt-4 grid grid-cols-2 gap-3 text-xs ${isRTL ? 'text-right' : ''}`}>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.price}</p>
                <p className="font-semibold">
                  {formatPrice(snapshot?.priceUsd)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.change24h}</p>
                <p className={`font-semibold flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {priceChange ? `${priceChange.toFixed(2)}%` : '-'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground mb-0.5">{t.marketCap}</p>
                <p className={`font-semibold flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <BarChart3 className="h-3 w-3" />
                  {formatMarketCap(snapshot?.marketCapUsd)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <BarakaHeader />

      <main className="container mx-auto px-4 py-8">
        <div className={`max-w-5xl mx-auto space-y-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bitcoin className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight" data-testid="text-hero-title">
              {t.heroTitle}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                data-testid="button-lang-en"
              >
                English
              </Button>
              <Button
                variant={language === 'ar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('ar')}
                data-testid="button-lang-ar"
              >
                العربية
              </Button>
            </div>
          </div>

          <div className="relative max-w-lg mx-auto">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12 text-lg`}
              data-testid="input-search-crypto"
            />
          </div>

          {pagesLoading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            </div>
          )}

          {!pagesLoading && publishedCryptos.length === 0 && (
            <div className="text-center py-16">
              <Coins className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">{t.noCryptos}</h2>
              <p className="text-muted-foreground mb-6">
                {t.noCryptosDesc}
              </p>
            </div>
          )}

          {!pagesLoading && searchQuery === '' && displayFeatured.length > 0 && (
            <section className="space-y-4">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="h-5 w-5 text-amber-500" />
                {t.featuredCryptos}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayFeatured.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} featured />
                ))}
              </div>
            </section>
          )}

          {!pagesLoading && publishedCryptos.length > 0 && (
            <section className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-xl font-semibold">{t.allCryptos}</h2>
                <Badge variant="secondary">
                  {filteredCryptos.length} {t.cryptos}
                </Badge>
              </div>

              {filteredCryptos.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t.noResults}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCryptos.map((crypto) => (
                    <CryptoCard key={crypto.id} crypto={crypto} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

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
