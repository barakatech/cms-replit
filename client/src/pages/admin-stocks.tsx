import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Plus, 
  Edit, 
  Eye,
  Search,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { PresenceAvatars } from '@/components/PresenceIndicators';
import type { StockPage, UserPresence } from '@shared/schema';

export default function AdminStocks() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: stockPages, isLoading } = useQuery<StockPage[]>({
    queryKey: ['/api/stock-pages'],
  });

  const { data: allPresences } = useQuery<UserPresence[]>({
    queryKey: ['/api/presence'],
    refetchInterval: 5000,
  });

  const getPresencesForStock = (stockId: string) => {
    return allPresences?.filter(p => p.contentType === 'stock' && p.contentId === stockId) ?? [];
  };

  const filteredStocks = stockPages?.filter(page => 
    page.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.companyName_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.sector?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    published: 'bg-brand',
    draft: 'bg-yellow-500',
    archived: 'bg-muted',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Stock Pages</h1>
          <p className="text-muted-foreground mt-1">Manage stock landing pages</p>
        </div>
        <Button onClick={() => navigate('/admin/stocks/new/edit')} data-testid="button-create-stock">
          <Plus className="h-4 w-4 mr-2" />
          New Stock Page
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Pages</span>
            </div>
            <p className="text-2xl font-bold">{stockPages?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Published</span>
            </div>
            <p className="text-2xl font-bold">
              {stockPages?.filter(p => p.status === 'published').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Edit className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Drafts</span>
            </div>
            <p className="text-2xl font-bold">
              {stockPages?.filter(p => p.status === 'draft').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Active Editors</span>
            </div>
            <p className="text-2xl font-bold">
              {allPresences?.filter(p => p.contentType === 'stock').length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Stock Pages</CardTitle>
              <CardDescription>Click on a stock to edit it</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-stocks"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filteredStocks?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Editors</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((page) => {
                  const presences = getPresencesForStock(page.id);
                  return (
                    <TableRow 
                      key={page.id} 
                      className="cursor-pointer hover-elevate"
                      onClick={() => navigate(`/admin/stocks/${page.id}/edit`)}
                      data-testid={`row-stock-${page.id}`}
                    >
                      <TableCell className="font-mono font-bold">{page.ticker}</TableCell>
                      <TableCell>{page.companyName_en}</TableCell>
                      <TableCell className="text-muted-foreground">{page.sector}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={`no-default-hover-elevate ${statusColors[page.status]}`}
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {presences.length > 0 ? (
                          <PresenceAvatars presences={presences} maxVisible={3} />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/stocks/${page.id}/edit`);
                          }}
                          data-testid={`button-edit-${page.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No stock pages found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/admin/stocks/new/edit')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Stock Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
