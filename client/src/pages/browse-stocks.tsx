import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  ArrowRight,
  Building2,
  Filter,
  LayoutGrid,
  List,
  Globe,
  ChevronRight
} from 'lucide-react';
import type { StockPage, StockTheme } from '@shared/schema';
import BarakaHeader from '@/components/BarakaHeader';
import ThemeIcon from '@/components/ThemeIcon';
import { StockLogo } from '@/components/StockLogo';

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'ticker' | 'sector';

export default function BrowseStocksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('ticker');

  const { data: stockPages = [], isLoading: stocksLoading } = useQuery<StockPage[]>({
    queryKey: ['/api/stock-pages'],
  });

  const { data: stockThemes = [], isLoading: themesLoading } = useQuery<StockTheme[]>({
    queryKey: ['/api/discover/themes'],
  });

  const isLoading = stocksLoading || themesLoading;

  const publishedStocks = useMemo(() => 
    stockPages.filter(s => s.status === 'published'),
    [stockPages]
  );

  const sectors = useMemo(() => {
    const sectorSet = new Set<string>();
    publishedStocks.forEach(stock => {
      if (stock.sector) sectorSet.add(stock.sector);
    });
    return Array.from(sectorSet).sort();
  }, [publishedStocks]);

  const filteredStocks = useMemo(() => {
    let result = publishedStocks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s => s.ticker.toLowerCase().includes(query) ||
             s.companyName_en?.toLowerCase().includes(query) ||
             s.sector?.toLowerCase().includes(query)
      );
    }

    if (selectedSector !== 'all') {
      result = result.filter(s => s.sector === selectedSector);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.companyName_en || '').localeCompare(b.companyName_en || '');
        case 'ticker':
          return a.ticker.localeCompare(b.ticker);
        case 'sector':
          return (a.sector || '').localeCompare(b.sector || '');
        default:
          return 0;
      }
    });

    return result;
  }, [publishedStocks, searchQuery, selectedSector, sortBy]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const stocksByLetter = useMemo(() => {
    const grouped: Record<string, StockPage[]> = {};
    filteredStocks.forEach(stock => {
      const letter = stock.ticker.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(stock);
    });
    return grouped;
  }, [filteredStocks]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
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
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-browse-title">
              Browse All Stocks
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Explore our complete directory of {publishedStocks.length} stocks available on Baraka. 
            Search, filter, and discover investment opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ticker or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-stocks"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                data-testid="button-view-grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Badge 
            variant={selectedSector === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedSector('all')}
            data-testid="filter-all"
          >
            All Sectors
          </Badge>
          {sectors.map(sector => (
            <Badge
              key={sector}
              variant={selectedSector === sector ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedSector(sector)}
              data-testid={`filter-${sector.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {sector}
            </Badge>
          ))}
        </div>

        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
          <TabsList>
            <TabsTrigger value="ticker" data-testid="sort-ticker">Sort by Ticker</TabsTrigger>
            <TabsTrigger value="name" data-testid="sort-name">Sort by Name</TabsTrigger>
            <TabsTrigger value="sector" data-testid="sort-sector">Sort by Sector</TabsTrigger>
          </TabsList>
        </Tabs>

        {stockThemes.length > 0 && !searchQuery && selectedSector === 'all' && (
          <section className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Browse by Theme</h2>
              <Link href="/themes">
                <Button variant="ghost" size="sm" data-testid="link-all-themes">
                  View All Themes
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {stockThemes.slice(0, 8).map(theme => (
                <Link key={theme.id} href={`/stocks/themes/${theme.slug}`}>
                  <Badge variant="outline" className="cursor-pointer gap-1.5 py-1.5 px-3" data-testid={`theme-${theme.slug}`}>
                    <ThemeIcon name={theme.icon} className="h-3.5 w-3.5" />
                    {theme.title_en}
                    <ChevronRight className="h-3 w-3" />
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="text-sm text-muted-foreground">
          Showing {filteredStocks.length} of {publishedStocks.length} stocks
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map(stock => (
              <Link key={stock.id} href={`/stocks/${stock.slug}`}>
                <Card className="hover-elevate cursor-pointer h-full group" data-testid={`card-stock-${stock.ticker}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <StockLogo ticker={stock.ticker} companyName={stock.companyName_en} size="lg" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{stock.ticker}</h3>
                            {stock.exchange && (
                              <Badge variant="outline" className="text-xs">
                                {stock.exchange}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {stock.companyName_en}
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    {stock.sector && (
                      <Badge variant="secondary" className="text-xs">
                        {stock.sector}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {alphabet.map(letter => {
              const stocks = stocksByLetter[letter];
              if (!stocks || stocks.length === 0) return null;
              
              return (
                <div key={letter}>
                  <h3 className="text-lg font-bold text-primary mb-3 sticky top-0 bg-background py-2">
                    {letter}
                  </h3>
                  <div className="space-y-2">
                    {stocks.map(stock => (
                      <Link key={stock.id} href={`/stocks/${stock.slug}`}>
                        <div 
                          className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border"
                          data-testid={`row-stock-${stock.ticker}`}
                        >
                          <div className="flex items-center gap-4">
                            <StockLogo ticker={stock.ticker} companyName={stock.companyName_en} size="sm" />
                            <span className="font-bold w-16">{stock.ticker}</span>
                            <span className="text-muted-foreground">{stock.companyName_en}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {stock.sector && (
                              <Badge variant="outline" className="text-xs">
                                {stock.sector}
                              </Badge>
                            )}
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredStocks.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedSector('all'); }} data-testid="button-clear-filters">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Can't find what you're looking for?</h3>
            <p className="text-muted-foreground mb-4">
              Explore our curated stock themes or check out the latest market trends.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/themes">
                <Button data-testid="button-explore-themes">
                  Explore Themes
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
