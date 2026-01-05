import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink, Sparkles } from 'lucide-react';
import type { StockTheme, StockPage } from '@shared/schema';
import BarakaHeader from '@/components/BarakaHeader';

export default function StockThemePage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: stockThemes = [], isLoading: themesLoading } = useQuery<StockTheme[]>({
    queryKey: ['/api/discover/themes'],
  });
  
  const { data: stockPages = [], isLoading: stocksLoading } = useQuery<StockPage[]>({
    queryKey: ['/api/stock-pages'],
  });

  const theme = stockThemes.find((t: StockTheme) => t.slug === slug);
  const isLoading = themesLoading || stocksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-48 w-full mb-8 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="flex items-center justify-center flex-1 py-20">
          <Card className="max-w-md mx-auto text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Theme Not Found</h1>
            <p className="text-muted-foreground mb-6">The stock theme you're looking for doesn't exist.</p>
            <Link href="/discover">
              <Button data-testid="button-back-discover">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Discover
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const themeStockPages = theme.tickers.map(ticker => {
    const stockPage = stockPages.find(s => s.ticker === ticker);
    return {
      ticker,
      stockPage,
      hasPage: !!stockPage && stockPage.status === 'published',
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <BarakaHeader />
      <div className="bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/discover">
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discover
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{theme.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold" data-testid="text-theme-title">{theme.title_en}</h1>
                {theme.isNew && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    New
                  </Badge>
                )}
                {theme.isFeatured && (
                  <Badge variant="outline">Featured</Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{theme.description_en}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{theme.tickers.length} stocks</span>
            <span>Theme ID: {theme.slug}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Stocks in this Theme</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeStockPages.map(({ ticker, stockPage, hasPage }) => (
            <Card 
              key={ticker} 
              className={`hover-elevate transition-all ${!hasPage ? 'opacity-60' : ''}`}
              data-testid={`card-stock-${ticker}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{ticker}</h3>
                    {stockPage && (
                      <p className="text-sm text-muted-foreground">{stockPage.companyName_en}</p>
                    )}
                  </div>
                  {hasPage ? (
                    <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-50 dark:bg-green-900/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {stockPage && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {stockPage.description_en}
                  </p>
                )}
                {hasPage && stockPage ? (
                  <Link href={`/stocks/${stockPage.slug}`}>
                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-${ticker}`}>
                      View Stock Page
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Page Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-muted/30">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Want to learn more?</h3>
            <p className="text-muted-foreground mb-4">
              Explore our educational content to understand investing in {theme.title_en.toLowerCase()}.
            </p>
            <Link href="/blog">
              <Button data-testid="button-learn-more">
                Read Investment Guides
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
