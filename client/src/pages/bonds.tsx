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
  TrendingUp,
  Calendar,
  Shield,
  Percent,
  Flame,
  Eye,
  Clock
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import { useLanguage } from '@/lib/language-context';
import type { BondPage } from '@shared/schema';

export default function BondsLanding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { language, isRTL } = useLanguage();

  const { data: bonds = [], isLoading } = useQuery<BondPage[]>({
    queryKey: ['/api/bond-pages'],
  });

  const publishedBonds = bonds.filter(b => b.status === 'published');
  
  const filteredBonds = publishedBonds.filter(bond => {
    const query = searchQuery.toLowerCase();
    const title = language === 'en' ? bond.title_en : bond.title_ar;
    const issuerName = language === 'en' ? bond.issuerName_en : bond.issuerName_ar;
    
    const matchesSearch = (
      title?.toLowerCase().includes(query) ||
      issuerName?.toLowerCase().includes(query) ||
      bond.isin?.toLowerCase().includes(query) ||
      bond.currency?.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return bond.featured;
    if (activeFilter === 'high-yield') return bond.ytm && bond.ytm >= 5;
    if (activeFilter === 'low-risk') return bond.riskLevel === 'low';
    if (activeFilter === 'short-term') {
      if (!bond.maturityDate) return false;
      const maturity = new Date(bond.maturityDate);
      const yearsToMaturity = (maturity.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365);
      return yearsToMaturity <= 3;
    }
    return true;
  });

  const featuredBonds = publishedBonds.filter(b => b.featured).slice(0, 3);
  const displayFeatured = featuredBonds.length > 0 ? featuredBonds : publishedBonds.slice(0, 3);

  const labels = {
    en: {
      heroTitle: 'Discover bonds',
      heroSubtitle: 'Explore fixed-income investment opportunities with stable returns.',
      searchPlaceholder: 'Search by name, issuer, or ISIN...',
      all: 'All Bonds',
      featured: 'Featured',
      highYield: 'High Yield',
      lowRisk: 'Low Risk',
      shortTerm: 'Short Term',
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
      heroTitle: 'اكتشف السندات',
      heroSubtitle: 'اكتشف فرص الاستثمار ذات الدخل الثابت مع عوائد مستقرة.',
      searchPlaceholder: 'البحث بالاسم أو المُصدر أو ISIN...',
      all: 'جميع السندات',
      featured: 'المميزة',
      highYield: 'عائد مرتفع',
      lowRisk: 'مخاطر منخفضة',
      shortTerm: 'قصير الأجل',
      bonds: 'سندات',
      ytm: 'العائد',
      coupon: 'الكوبون',
      maturity: 'الاستحقاق',
      riskLevel: 'المخاطرة',
      currency: 'العملة',
      noResults: 'لم يتم العثور على سندات تطابق بحثك.',
      disclaimer: 'رأس المال في خطر. للأغراض المعلوماتية فقط. ليست نصيحة استثمارية.',
    },
  };

  const t = labels[language];

  const filters = [
    { id: 'all', label: t.all, icon: Landmark },
    { id: 'featured', label: t.featured, icon: Star },
    { id: 'high-yield', label: t.highYield, icon: TrendingUp },
    { id: 'low-risk', label: t.lowRisk, icon: Shield },
    { id: 'short-term', label: t.shortTerm, icon: Clock },
  ];

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
                <p className={`font-semibold flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} text-green-600 dark:text-green-400`}>
                  <TrendingUp className="h-3 w-3" />
                  {bond.ytm ? `${bond.ytm.toFixed(2)}%` : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.coupon}</p>
                <p className={`font-semibold flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Percent className="h-3 w-3" />
                  {bond.couponRate ? `${bond.couponRate.toFixed(2)}%` : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">{t.maturity}</p>
                <p className={`font-semibold flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
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

  return (
    <div 
      className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <BarakaHeader />

      <main className="container mx-auto px-4 py-8">
        <div className={`max-w-5xl mx-auto space-y-8 ${isRTL ? 'text-right' : ''}`}>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight" data-testid="page-title">
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
              data-testid="input-search-bonds"
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

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          )}

          {!isLoading && filteredBonds.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.noResults}</p>
            </div>
          )}

          {!isLoading && filteredBonds.length > 0 && (
            <div className="space-y-6">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="secondary">
                  {filteredBonds.length} {t.bonds}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBonds.map((bond) => (
                  <BondCard key={bond.id} bond={bond} featured={bond.featured} />
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
