import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Search
} from 'lucide-react';
import type { TickerCatalogEntry } from '@shared/schema';

interface EditingEntry {
  ticker: string;
  displayName: string;
  category: string;
}

export default function AdminTickerCatalog() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TickerCatalogEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<EditingEntry>({ ticker: '', displayName: '', category: '' });

  const { data: entries, isLoading } = useQuery<TickerCatalogEntry[]>({
    queryKey: ['/api/ticker-catalog'],
  });

  const createMutation = useMutation({
    mutationFn: (data: { ticker: string; displayName?: string; category?: string }) => 
      apiRequest('POST', '/api/ticker-catalog', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ticker-catalog'] });
      toast({ title: 'Ticker added' });
      setEditDialogOpen(false);
      setEditingEntry({ ticker: '', displayName: '', category: '' });
    },
    onError: (error: Error) => toast({ title: error.message || 'Failed to add ticker', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TickerCatalogEntry> }) => 
      apiRequest('PUT', `/api/ticker-catalog/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ticker-catalog'] });
      toast({ title: 'Ticker updated' });
      setEditDialogOpen(false);
      setSelectedEntry(null);
    },
    onError: () => toast({ title: 'Failed to update ticker', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/ticker-catalog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ticker-catalog'] });
      toast({ title: 'Ticker deleted' });
      setDeleteDialogOpen(false);
      setSelectedEntry(null);
    },
    onError: () => toast({ title: 'Failed to delete ticker', variant: 'destructive' }),
  });

  const handleCreateNew = () => {
    setSelectedEntry(null);
    setEditingEntry({ ticker: '', displayName: '', category: '' });
    setEditDialogOpen(true);
  };

  const handleEdit = (entry: TickerCatalogEntry) => {
    setSelectedEntry(entry);
    setEditingEntry({
      ticker: entry.ticker,
      displayName: entry.displayName || '',
      category: entry.category || '',
    });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingEntry.ticker.trim()) {
      toast({ title: 'Ticker is required', variant: 'destructive' });
      return;
    }

    if (!/^[A-Za-z.]{1,6}$/.test(editingEntry.ticker)) {
      toast({ title: 'Invalid ticker format (1-6 characters A-Z, optional dot)', variant: 'destructive' });
      return;
    }

    if (selectedEntry) {
      updateMutation.mutate({ 
        id: selectedEntry.id, 
        data: { 
          displayName: editingEntry.displayName || undefined,
          category: editingEntry.category || undefined,
        }
      });
    } else {
      createMutation.mutate({
        ticker: editingEntry.ticker,
        displayName: editingEntry.displayName || undefined,
        category: editingEntry.category || undefined,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredEntries = entries?.filter(entry => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return entry.ticker.toLowerCase().includes(q) || 
           entry.displayName?.toLowerCase().includes(q) ||
           entry.category?.toLowerCase().includes(q);
  });

  const categories = Array.from(new Set(entries?.map(e => e.category).filter(Boolean) || []));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Ticker Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage stock tickers for newsletter blocks</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-add-ticker">
          <Plus className="h-4 w-4 mr-2" />
          Add Ticker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Tickers</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-count">{entries?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Categories</span>
            </div>
            <p className="text-2xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Technology</span>
            </div>
            <p className="text-2xl font-bold">
              {entries?.filter(e => e.category === 'Technology').length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Tickers</CardTitle>
              <CardDescription>Stock tickers available for newsletter blocks</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredEntries && filteredEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id} data-testid={`row-ticker-${entry.id}`}>
                    <TableCell className="font-mono font-bold" data-testid={`text-ticker-${entry.id}`}>
                      {entry.ticker}
                    </TableCell>
                    <TableCell>{entry.displayName || '-'}</TableCell>
                    <TableCell>
                      {entry.category ? (
                        <Badge variant="outline">{entry.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(entry.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(entry)}
                          data-testid={`button-edit-${entry.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEntry(entry);
                            setDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-${entry.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">{searchQuery ? 'No matching tickers' : 'No tickers yet'}</p>
              <p className="text-sm">{searchQuery ? 'Try a different search term' : 'Add your first ticker to the catalog'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEntry ? 'Edit Ticker' : 'Add Ticker'}</DialogTitle>
            <DialogDescription>
              {selectedEntry ? 'Update ticker information' : 'Add a new ticker to the catalog'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker Symbol *</Label>
              <Input
                id="ticker"
                value={editingEntry.ticker}
                onChange={(e) => setEditingEntry({ ...editingEntry, ticker: e.target.value.toUpperCase() })}
                placeholder="e.g., AAPL"
                disabled={!!selectedEntry}
                maxLength={6}
                data-testid="input-ticker"
              />
              <p className="text-xs text-muted-foreground">1-6 characters, A-Z and dot allowed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={editingEntry.displayName}
                onChange={(e) => setEditingEntry({ ...editingEntry, displayName: e.target.value })}
                placeholder="e.g., Apple Inc."
                data-testid="input-display-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editingEntry.category}
                onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })}
                placeholder="e.g., Technology"
                data-testid="input-category"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticker</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedEntry?.ticker}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedEntry && deleteMutation.mutate(selectedEntry.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
