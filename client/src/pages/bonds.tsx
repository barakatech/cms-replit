import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Landmark, 
  Search, 
  Star, 
  ArrowRight,
  TrendingUp,
  Calendar,
  Shield,
  Percent
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import type { BondPage } from '@shared/schema';

export default function BondsLanding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  const isRTL = language === 'ar';

  const { data: bonds = [], isLoading } = useQuery<BondPage[]>({
    queryKey: ['/api/bond-pages'],
  });

  const publishedBonds = bonds.filter(b => b.status === 'published');
  
  const filteredBonds = publishedBonds.filter(bond => {
    const query = searchQuery.toLowerCase();
    const title = language === 'en' ? bond.title_en : bond.title_ar;
    const issuerName = language === 'en' ? bond.issuerName_en : bond.issuerName_ar;
    return (
      title?.toLowerCase().includes(query) ||
      issuerName?.toLowerCase().includes(query) ||
      bond.isin?.toLowerCase().includes(query) ||
      bond.currency?.toLowerCase().includes(query)
    );
  });

  const featuredBonds = publishedBonds.filter(b => b.featured).slice(0, 3);
  const displayFeatured = featuredBonds.length > 0 ? featuredBonds : publishedBonds.slice(0, 3);

  const labels = {
    en: {
      heroTitle: 'Explore Bonds',
      heroSubtitle: 'Discover fixed-income investment opportunities with stable returns.',
      searchPlaceholder: 'Search by name, issuer, or ISIN...',
      featuredBonds: 'Featured Bonds',
      allBonds: 'All Bonds',
      bonds: 'bonds',
      ytm: 'YTM',
      coupon: 'Coupon',
      maturity: 'Maturity',
      riskLevel: 'Risk',
      currency: 'Currency',
      noResults: 'No bonds found matching your search.',
      disclaimer: 'Capital at risk. For informational purposes only. Not investment advice.',
    },
    ar: {
      heroTitle: 'استكشف السندات',
      heroSubtitle: 'اكتشف فرص الاستثمار ذات الدخل الثابت مع عوائد مستقرة.',
      searchPlaceholder: 'البحث بالاسم أو المُصدر أو ISIN...',
      featuredBonds: 'السندات المميزة',
      allBonds: 'جميع السندات',
      bonds: 'سندات',
      ytm: 'العائد حتى الاستحقاق',
      coupon: 'الكوبون',
      maturity: 'الاستحقاق',
      riskLevel: 'المخاطرة',
      currency: 'العملة',
      noResults: 'لم يتم العثور على سندات تطابق بحثك.',
      disclaimer: 'رأس المال في خطر. للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.',
    },
  };

  const t = labels[language];

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'very_high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  const BondCard = ({ bond, featured = false }: { bond: BondPage; featured?: boolean }) => {
    const title = language === 'en' ? bond.title_en : bond.title_ar;
    
    return (
      <Link href={`/bonds/${bond.slug}`}>
        <Card 
          className={`hover-elevate cursor-pointer h-full ${featured ? 'border-primary/20' : ''}`}
          data-testid={`bond-card-${bond.slug}`}
        >
          <CardContent className={`p-5 ${featured ? 'pb-6' : ''}`}>
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {bond.featured && (
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  )}
                  <Badge variant="outline" className="text-xs shrink-0">
                    {bond.currency || 'USD'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {language === 'en' ? bond.issuerName_en : bond.issuerName_ar}
                </p>
              </div>
            </div>
            
            <div className={`mt-4 grid grid-cols-2 gap-3 text-xs ${isRTL ? 'text-right' : ''}`}>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.ytm}</p>
                <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {bond.ytm ? `${bond.ytm.toFixed(2)}%` : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.coupon}</p>
                <p className="font-semibold flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  {bond.couponRate ? `${bond.couponRate.toFixed(2)}%` : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.maturity}</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(bond.maturityDate ?? null)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.riskLevel}</p>
                <Badge className={`text-xs ${getRiskColor(bond.riskLevel)}`}>
                  {bond.riskLevel || 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const BondRow = ({ bond }: { bond: BondPage }) => {
    const title = language === 'en' ? bond.title_en : bond.title_ar;
    
    return (
      <Link href={`/bonds/${bond.slug}`}>
        <Card className="hover-elevate cursor-pointer" data-testid={`bond-row-${bond.slug}`}>
          <CardContent className="p-4">
            <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-4 flex-1 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <div className={`min-w-0 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-sm line-clamp-1">{title}</span>
                    {bond.featured && (
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {language === 'en' ? bond.issuerName_en : bond.issuerName_ar}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`hidden sm:block ${isRTL ? 'text-left' : 'text-right'}`}>
                  <p className="text-xs text-muted-foreground">{t.ytm}</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {bond.ytm ? `${bond.ytm.toFixed(2)}%` : '-'}
                  </p>
                </div>
                <div className={`hidden md:block ${isRTL ? 'text-left' : 'text-right'}`}>
                  <p className="text-xs text-muted-foreground">{t.coupon}</p>
                  <p className="font-medium">{bond.couponRate ? `${bond.couponRate.toFixed(2)}%` : '-'}</p>
                </div>
                <div className={`hidden lg:block ${isRTL ? 'text-left' : 'text-right'}`}>
                  <p className="text-xs text-muted-foreground">{t.maturity}</p>
                  <p className="font-medium">{formatDate(bond.maturityDate ?? null)}</p>
                </div>
                <Badge variant="outline" className="shrink-0">{bond.currency || 'USD'}</Badge>
                <Badge className={`shrink-0 ${getRiskColor(bond.riskLevel)}`}>
                  {bond.riskLevel || 'N/A'}
                </Badge>
                <ArrowRight className={`h-5 w-5 text-muted-foreground shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
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
                <Landmark className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight" data-testid="page-title">
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
              data-testid="input-search-bonds"
            />
          </div>

          {isLoading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </div>
          )}

          {!isLoading && searchQuery === '' && displayFeatured.length > 0 && (
            <section className="space-y-4">
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Star className="h-5 w-5 text-amber-500" />
                {t.featuredBonds}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayFeatured.map((bond) => (
                  <BondCard key={bond.id} bond={bond} featured />
                ))}
              </div>
            </section>
          )}

          {!isLoading && (
            <section className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-xl font-semibold">{t.allBonds}</h2>
                <Badge variant="secondary">
                  {filteredBonds.length} {t.bonds}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {filteredBonds.map((bond) => (
                  <BondRow key={bond.id} bond={bond} />
                ))}
              </div>
              
              {filteredBonds.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Landmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t.noResults}</p>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              <span>{t.disclaimer}</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
