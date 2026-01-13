import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Plus, Trash2, GripVertical, Link as LinkIcon, TrendingUp } from 'lucide-react';
import type { AssetLink, InsertAssetLink, StockPage } from '@shared/schema';

const COLLECTION_KEY = 'assets-under-500';

export default function AdminAssetsUnder500() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: assetLinks = [], isLoading } = useQuery<AssetLink[]>({
    queryKey: ['/api/admin/asset-links', COLLECTION_KEY],
    queryFn: async () => {
      const res = await fetch(`/api/admin/asset-links/${COLLECTION_KEY}`);
      if (!res.ok) throw new Error('Failed to fetch asset links');
      return res.json();
    },
  });

  const { data: stockPages = [] } = useQuery<StockPage[]>({
    queryKey: ['/api/admin/stocks'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAssetLink) => apiRequest('POST', '/api/admin/asset-links', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/asset-links', COLLECTION_KEY] });
      toast({ title: 'Asset added successfully' });
      setIsAddDialogOpen(false);
      setSelectedTicker('');
      setSearchQuery('');
    },
    onError: () => toast({ title: 'Failed to add asset', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetLink> }) =>
      apiRequest('PUT', `/api/admin/asset-links/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/asset-links', COLLECTION_KEY] });
      toast({ title: 'Asset updated' });
    },
    onError: () => toast({ title: 'Failed to update asset', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/asset-links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/asset-links', COLLECTION_KEY] });
      toast({ title: 'Asset removed' });
    },
    onError: () => toast({ title: 'Failed to remove asset', variant: 'destructive' }),
  });

  const handleAddAsset = () => {
    if (!selectedTicker) {
      toast({ title: 'Please select a stock', variant: 'destructive' });
      return;
    }

    const existingTickers = assetLinks.map(link => link.ticker);
    if (existingTickers.includes(selectedTicker)) {
      toast({ title: 'This stock is already in the list', variant: 'destructive' });
      return;
    }

    const maxOrder = assetLinks.length > 0 ? Math.max(...assetLinks.map(l => l.displayOrder)) : 0;
    
    createMutation.mutate({
      collectionKey: COLLECTION_KEY,
      ticker: selectedTicker,
      displayOrder: maxOrder + 1,
      enabled: true,
    });
  };

  const toggleEnabled = (link: AssetLink) => {
    updateMutation.mutate({
      id: link.id,
      data: { enabled: !link.enabled },
    });
  };

  const getStockInfo = (ticker: string) => {
    return stockPages.find(s => s.ticker === ticker);
  };

  const filteredStocks = stockPages.filter(stock => {
    const query = searchQuery.toLowerCase();
    const existingTickers = assetLinks.map(link => link.ticker);
    return !existingTickers.includes(stock.ticker) && (
      stock.ticker.toLowerCase().includes(query) ||
      stock.companyName_en.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Assets Under $500</h1>
          <p className="text-muted-foreground">Manage the curated list of stocks priced under $500</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-asset">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Asset</DialogTitle>
              <DialogDescription>
                Select a stock to add to the "Assets Under $500" collection
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Stocks</Label>
                <Input
                  id="search"
                  placeholder="Search by ticker or company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-stocks"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Stock</Label>
                <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                  <SelectTrigger data-testid="select-stock">
                    <SelectValue placeholder="Choose a stock..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStocks.slice(0, 20).map((stock) => (
                      <SelectItem key={stock.id} value={stock.ticker} data-testid={`select-item-${stock.ticker}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.ticker}</span>
                          <span className="text-muted-foreground text-sm truncate max-w-[200px]">
                            {stock.companyName_en}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filteredStocks.length > 20 && (
                  <p className="text-xs text-muted-foreground">
                    Showing first 20 results. Type to search for more.
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button 
                onClick={handleAddAsset} 
                disabled={!selectedTicker || createMutation.isPending}
                data-testid="button-confirm-add"
              >
                {createMutation.isPending ? 'Adding...' : 'Add Asset'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Asset Collection
          </CardTitle>
          <CardDescription>
            {assetLinks.length} {assetLinks.length === 1 ? 'asset' : 'assets'} in this collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assetLinks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No assets added yet</p>
              <p className="text-sm">Click "Add Asset" to start building your collection</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetLinks.map((link, index) => {
                  const stock = getStockInfo(link.ticker);
                  return (
                    <TableRow key={link.id} data-testid={`row-asset-${link.id}`}>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 opacity-50" />
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {link.ticker}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {stock?.companyName_en || <span className="text-muted-foreground italic">Unknown</span>}
                      </TableCell>
                      <TableCell>
                        {stock?.sector ? (
                          <Badge variant="secondary">{stock.sector}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={() => toggleEnabled(link)}
                            data-testid={`switch-enabled-${link.id}`}
                          />
                          <span className="text-sm text-muted-foreground">
                            {link.enabled ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(link.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${link.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
