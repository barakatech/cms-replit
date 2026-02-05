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
  TrendingUp,
  TrendingDown,
  BarChart3,
  Coins,
  Flame,
  Eye,
  Zap
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import { useLanguage } from '@/lib/language-context';
import type { CryptoPage, CryptoMarketSnapshot } from '@shared/schema';

export default function CryptoLanding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { language, isRTL } = useLanguage();

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
    
    const matchesSearch = (
      title?.toLowerCase().includes(query) ||
      crypto.name?.toLowerCase().includes(query) ||
      crypto.symbol?.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    const snapshot = snapshotMap.get(crypto.coingeckoId || '');
    
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return crypto.featured;
    if (activeFilter === 'top-10') return crypto.marketCapRank && crypto.marketCapRank <= 10;
    if (activeFilter === 'gainers') return snapshot?.priceChange24hPct && snapshot.priceChange24hPct > 0;
    if (activeFilter === 'losers') return snapshot?.priceChange24hPct && snapshot.priceChange24hPct < 0;
    return true;
  });

  const labels = {
    en: {
      heroTitle: 'Discover crypto',
      heroSubtitle: 'Explore the top cryptocurrencies by market capitalization.',
      searchPlaceholder: 'Search by name or symbol...',
      all: 'All Crypto',
      featured: 'Featured',
      top10: 'Top 10',
      gainers: 'Gainers',
      losers: 'Losers',
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
      heroTitle: 'اكتشف العملات الرقمية',
      heroSubtitle: 'اكتشف أفضل العملات الرقمية حسب القيمة السوقية.',
      searchPlaceholder: 'البحث بالاسم أو الرمز...',
      all: 'جميع العملات',
      featured: 'المميزة',
      top10: 'أفضل 10',
      gainers: 'الرابحون',
      losers: 'الخاسرون',
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

  const filters = [
    { id: 'all', label: t.all, icon: Bitcoin },
    { id: 'featured', label: t.featured, icon: Star },
    { id: 'top-10', label: t.top10, icon: Zap },
    { id: 'gainers', label: t.gainers, icon: TrendingUp },
    { id: 'losers', label: t.losers, icon: TrendingDown },
  ];

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
      <Link href={`/crypto/v2/${crypto.slug}`}>
        <Card 
          className={`hover-elevate cursor-pointer h-full ${featured ? 'border-primary/20' : ''}`}
          data-testid={`crypto-card-${crypto.slug}`}
        >
          <CardContent className={`p-5 ${featured ? 'pb-6' : ''}`}>
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                {crypto.logoUrl || snapshot?.image ? (
                  <img src={crypto.logoUrl || snapshot?.image} alt={crypto.name} className="w-10 h-10" />
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
            <h1 className="text-4xl font-bold tracking-tight" data-testid="text-hero-title">
              {t.heroTitle}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="relative max-w-xl mx-auto">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-12 text-right' : 'pl-12'} h-12 text-base rounded-full border-muted`}
              data-testid="input-search-crypto"
            />
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={`gap-2 rounded-full ${activeFilter === filter.id ? '' : 'bg-background'}`}
                data-testid={`filter-${filter.id}`}
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>

          {pagesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-48" />
              ))}
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

          {!pagesLoading && filteredCryptos.length === 0 && publishedCryptos.length > 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.noResults}</p>
            </div>
          )}

          {!pagesLoading && filteredCryptos.length > 0 && (
            <div className="space-y-6">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="secondary">
                  {filteredCryptos.length} {t.cryptos}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCryptos.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} featured={crypto.featured} />
                ))}
              </div>
            </div>
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
