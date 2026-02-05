import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bitcoin, 
  Plus, 
  Edit, 
  Eye,
  Search,
  Trash2,
  AlertCircle,
  Star,
  Lock,
  Unlock
} from 'lucide-react';
import { useState } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { CryptoPage } from '@shared/schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCrypto() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('all');
  const [complianceFilter, setComplianceFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cryptoToDelete, setCryptoToDelete] = useState<CryptoPage | null>(null);

  const { data: cryptoPages, isLoading } = useQuery<CryptoPage[]>({
    queryKey: ['/api/crypto/pages'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/crypto/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crypto/pages'] });
      toast({ title: 'Crypto page deleted successfully' });
      setDeleteDialogOpen(false);
      setCryptoToDelete(null);
    },
    onError: () => {
      toast({ title: 'Failed to delete crypto page', variant: 'destructive' });
    },
  });

  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, locked }: { id: string; locked: boolean }) => {
      await apiRequest('POST', `/api/crypto/pages/${id}/toggle-lock`, { editorialLocked: locked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crypto/pages'] });
      toast({ title: 'Editorial lock updated' });
    },
  });

  const handleDeleteClick = (crypto: CryptoPage) => {
    setCryptoToDelete(crypto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cryptoToDelete) {
      deleteMutation.mutate(cryptoToDelete.id);
    }
  };

  const filteredCryptos = cryptoPages?.filter(page => {
    const matchesSearch = 
      page.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.coingeckoId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesAssetType = assetTypeFilter === 'all' || page.assetType === assetTypeFilter;
    const matchesCompliance = complianceFilter === 'all' || page.complianceStatus === complianceFilter;
    const matchesFeatured = featuredFilter === 'all' || 
      (featuredFilter === 'featured' && page.featured) ||
      (featuredFilter === 'not_featured' && !page.featured);
    
    return matchesSearch && matchesStatus && matchesAssetType && matchesCompliance && matchesFeatured;
  });

  // Sort by rank ascending
  const sortedCryptos = filteredCryptos?.sort((a, b) => (a.marketCapRank || 999) - (b.marketCapRank || 999));

  const assetTypes = ['coin', 'token', 'stablecoin', 'wrapped', 'defi', 'nft', 'meme'];

  const statusColors: Record<string, string> = {
    published: 'bg-brand',
    draft: 'bg-yellow-500',
    archived: 'bg-muted',
  };

  const complianceStatusColors: Record<string, string> = {
    pass: 'bg-green-500',
    pending: 'bg-yellow-500',
    fail: 'bg-red-500',
    override: 'bg-blue-500',
  };

  const assetTypeLabels: Record<string, string> = {
    coin: 'Coin',
    token: 'Token',
    stablecoin: 'Stablecoin',
    wrapped: 'Wrapped',
    defi: 'DeFi',
    nft: 'NFT',
    meme: 'Meme',
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Crypto Pages</h1>
          <p className="text-muted-foreground mt-1">Manage cryptocurrency landing pages</p>
        </div>
        <Button onClick={() => navigate('/admin/crypto/new/edit')} data-testid="button-create-crypto">
          <Plus className="h-4 w-4 mr-2" />
          New Crypto Page
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Bitcoin className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Pages</span>
            </div>
            <p className="text-2xl font-bold">{cryptoPages?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Published</span>
            </div>
            <p className="text-2xl font-bold">
              {cryptoPages?.filter(p => p.status === 'published').length ?? 0}
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
              {cryptoPages?.filter(p => p.status === 'draft').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Compliance Issues</span>
            </div>
            <p className="text-2xl font-bold">
              {cryptoPages?.filter(p => p.complianceStatus === 'fail').length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, symbol, or CoinGecko ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-crypto"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger className="w-32" data-testid="select-asset-type-filter">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {assetTypes.map(t => (
                    <SelectItem key={t} value={t}>{assetTypeLabels[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                <SelectTrigger className="w-32" data-testid="select-compliance-filter">
                  <SelectValue placeholder="Compliance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compliance</SelectItem>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="override">Override</SelectItem>
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-32" data-testid="select-featured-filter">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="not_featured">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : sortedCryptos?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bitcoin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No crypto pages found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/admin/crypto/new/edit')}
                data-testid="button-create-first-crypto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first crypto page
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Crypto</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Locked</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCryptos?.map((crypto) => (
                    <TableRow key={crypto.id} data-testid={`row-crypto-${crypto.id}`}>
                      <TableCell>
                        <Badge variant="outline">#{crypto.marketCapRank || '-'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{crypto.title_en || crypto.name}</p>
                          {crypto.coingeckoId && (
                            <p className="text-xs text-muted-foreground">{crypto.coingeckoId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {crypto.symbol.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">{assetTypeLabels[crypto.assetType]}</span>
                      </TableCell>
                      <TableCell>
                        {crypto.featured && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={complianceStatusColors[crypto.complianceStatus]}>
                          {crypto.complianceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[crypto.status]}>
                          {crypto.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleLockMutation.mutate({ 
                            id: crypto.id, 
                            locked: !crypto.editorialLocked 
                          })}
                          data-testid={`button-toggle-lock-${crypto.id}`}
                        >
                          {crypto.editorialLocked ? (
                            <Lock className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(crypto.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => navigate(`/admin/crypto/${crypto.id}/edit`)}
                            data-testid={`button-edit-crypto-${crypto.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {crypto.status === 'published' && (
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => window.open(`/crypto/${crypto.slug}`, '_blank')}
                              data-testid={`button-view-crypto-${crypto.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDeleteClick(crypto)}
                            data-testid={`button-delete-crypto-${crypto.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Crypto Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{cryptoToDelete?.title_en || cryptoToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
