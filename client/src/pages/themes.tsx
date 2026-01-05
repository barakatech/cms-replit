import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';
import type { StockTheme } from '@shared/schema';
import BarakaHeader from '@/components/BarakaHeader';
import ThemeIcon from '@/components/ThemeIcon';

export default function ThemesPage() {
  const { data: stockThemes = [], isLoading } = useQuery<StockTheme[]>({
    queryKey: ['/api/discover/themes'],
  });
  const featuredThemes = stockThemes.filter(t => t.isFeatured);
  const newThemes = stockThemes.filter(t => t.isNew);
  const allThemes = stockThemes.filter(t => !t.isFeatured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <BarakaHeader />
        <div className="bg-gradient-to-b from-primary/5 to-background border-b">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BarakaHeader />
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-themes-title">
              Stock Themes & Trackers
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover curated collections of stocks organized by sector, trend, or investment style. 
            Explore themes that match your investment interests.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {featuredThemes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Featured Themes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredThemes.map(theme => (
                <Link key={theme.id} href={`/stocks/themes/${theme.slug}`}>
                  <Card className="hover-elevate cursor-pointer h-full group" data-testid={`card-featured-${theme.slug}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ThemeIcon name={theme.icon} className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {theme.title_en}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {theme.tickers.length} stocks
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {theme.description_en}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {theme.tickers.slice(0, 4).map(ticker => (
                            <Badge key={ticker} variant="secondary" className="text-xs">
                              {ticker}
                            </Badge>
                          ))}
                          {theme.tickers.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{theme.tickers.length - 4}
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {newThemes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">New Themes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newThemes.map(theme => (
                <Link key={theme.id} href={`/stocks/themes/${theme.slug}`}>
                  <Card className="hover-elevate cursor-pointer h-full group" data-testid={`card-new-${theme.slug}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <ThemeIcon name={theme.icon} className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {theme.title_en}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {theme.tickers.length} stocks
                          </p>
                        </div>
                        <Badge className="gap-1 shrink-0">
                          <Sparkles className="h-3 w-3" />
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {theme.description_en}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-6">All Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allThemes.map(theme => (
              <Link key={theme.id} href={`/stocks/themes/${theme.slug}`}>
                <Card className="hover-elevate cursor-pointer h-full group" data-testid={`card-theme-${theme.slug}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ThemeIcon name={theme.icon} className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {theme.title_en}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {theme.tickers.length} stocks
                        </p>
                      </div>
                      {theme.isNew && (
                        <Badge variant="secondary" className="gap-1 shrink-0">
                          <Sparkles className="h-3 w-3" />
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {theme.description_en}
                    </p>
                    <div className="flex gap-1 flex-wrap">
                      {theme.tickers.slice(0, 3).map(ticker => (
                        <Badge key={ticker} variant="outline" className="text-xs">
                          {ticker}
                        </Badge>
                      ))}
                      {theme.tickers.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{theme.tickers.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Looking for specific stocks?</h3>
            <p className="text-muted-foreground mb-4">
              Browse our complete stock directory or search for individual companies.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/stocks">
                <Button data-testid="button-browse-stocks">
                  Browse All Stocks
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="outline" data-testid="button-discover">
                  Go to Discover
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
