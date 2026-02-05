import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bitcoin, 
  ExternalLink,
  Star,
  Eye,
  AlertTriangle
} from 'lucide-react';
import BarakaHeader from '@/components/BarakaHeader';
import { useLanguage } from '@/lib/language-context';
import type { CryptoPage } from '@shared/schema';

export default function CryptoDemoGallery() {
  const { language, isRTL } = useLanguage();

  const { data: cryptoPages = [], isLoading } = useQuery<CryptoPage[]>({
    queryKey: ['/api/crypto/pages'],
  });

  const seededPages = cryptoPages
    .filter(c => c.marketCapRank && c.marketCapRank <= 100)
    .sort((a, b) => (a.marketCapRank || 999) - (b.marketCapRank || 999));

  const labels = {
    en: {
      title: 'Crypto Demo Gallery',
      subtitle: 'Preview of all 100 seeded cryptocurrency pages for demo purposes.',
      warning: 'Demo Mode - Not indexed by search engines',
      viewPage: 'View Page',
      status: 'Status',
      rank: 'Rank',
      published: 'Published',
      draft: 'Draft',
      noPages: 'No Seeded Pages Found',
      noPagesDesc: 'Run the seed script to generate the top 100 crypto pages.',
      runCommand: 'Run: npm run seed:crypto-top100',
      featured: 'Featured',
    },
    ar: {
      title: 'معرض العملات الرقمية التجريبي',
      subtitle: 'معاينة لجميع صفحات العملات الرقمية المئة للعرض التجريبي.',
      warning: 'وضع العرض - غير مفهرس بواسطة محركات البحث',
      viewPage: 'عرض الصفحة',
      status: 'الحالة',
      rank: 'الترتيب',
      published: 'منشور',
      draft: 'مسودة',
      noPages: 'لم يتم العثور على صفحات',
      noPagesDesc: 'قم بتشغيل سكريبت البذور لإنشاء أفضل 100 صفحة عملات رقمية.',
      runCommand: 'نفذ: npm run seed:crypto-top100',
      featured: 'مميز',
    },
  };

  const t = labels[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(20)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <BarakaHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bitcoin className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="text-gallery-title">{t.title}</h1>
          </div>
          <p className="text-muted-foreground mb-4">{t.subtitle}</p>
          
          <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-700 dark:text-yellow-400">{t.warning}</span>
          </div>
        </div>

        {seededPages.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t.noPages}</h3>
              <p className="text-muted-foreground mb-4">{t.noPagesDesc}</p>
              <code className="bg-muted px-3 py-2 rounded text-sm">{t.runCommand}</code>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {seededPages.length} seeded crypto pages
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {seededPages.map((crypto) => (
                <Card 
                  key={crypto.id} 
                  className="hover-elevate transition-all"
                  data-testid={`card-crypto-${crypto.slug}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            #{crypto.marketCapRank}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{crypto.name}</h3>
                          <span className="text-xs text-muted-foreground uppercase">{crypto.symbol}</span>
                        </div>
                      </div>
                      {crypto.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge 
                        variant={crypto.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {crypto.status === 'published' ? t.published : t.draft}
                      </Badge>
                      {crypto.featured && (
                        <Badge variant="outline" className="text-xs">{t.featured}</Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3 truncate">
                      /crypto/{crypto.slug}
                    </div>
                    
                    <Link href={`/crypto/${crypto.slug}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        data-testid={`button-view-${crypto.slug}`}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        {t.viewPage}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
