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
  Landmark, 
  Plus, 
  Edit, 
  Eye,
  Search,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { BondPage } from '@shared/schema';
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

export default function AdminBonds() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [issuerTypeFilter, setIssuerTypeFilter] = useState<string>('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bondToDelete, setBondToDelete] = useState<BondPage | null>(null);

  const { data: bondPages, isLoading } = useQuery<BondPage[]>({
    queryKey: ['/api/bond-pages'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/bond-pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bond-pages'] });
      toast({ title: 'Bond page deleted successfully' });
      setDeleteDialogOpen(false);
      setBondToDelete(null);
    },
    onError: () => {
      toast({ title: 'Failed to delete bond page', variant: 'destructive' });
    },
  });

  const handleDeleteClick = (bond: BondPage) => {
    setBondToDelete(bond);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bondToDelete) {
      deleteMutation.mutate(bondToDelete.id);
    }
  };

  const filteredBonds = bondPages?.filter(page => {
    const matchesSearch = 
      page.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.issuerName_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.isin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.currency.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesCurrency = currencyFilter === 'all' || page.currency === currencyFilter;
    const matchesIssuerType = issuerTypeFilter === 'all' || page.issuerType === issuerTypeFilter;
    const matchesRiskLevel = riskLevelFilter === 'all' || page.riskLevel === riskLevelFilter;
    
    return matchesSearch && matchesStatus && matchesCurrency && matchesIssuerType && matchesRiskLevel;
  });

  const currencies = Array.from(new Set(bondPages?.map(p => p.currency) || []));
  const issuerTypes = Array.from(new Set(bondPages?.map(p => p.issuerType) || []));
  const riskLevels = Array.from(new Set(bondPages?.map(p => p.riskLevel) || []));

  const statusColors: Record<string, string> = {
    published: 'bg-brand',
    draft: 'bg-yellow-500',
    archived: 'bg-muted',
  };

  const riskLevelColors: Record<string, string> = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    very_high: 'bg-red-500',
  };

  const complianceStatusColors: Record<string, string> = {
    pass: 'bg-green-500',
    pending: 'bg-yellow-500',
    fail: 'bg-red-500',
    override: 'bg-blue-500',
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
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Bond Pages</h1>
          <p className="text-muted-foreground mt-1">Manage fixed income investment pages</p>
        </div>
        <Button onClick={() => navigate('/admin/bonds/new/edit')} data-testid="button-create-bond">
          <Plus className="h-4 w-4 mr-2" />
          New Bond Page
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total Pages</span>
            </div>
            <p className="text-2xl font-bold">{bondPages?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Published</span>
            </div>
            <p className="text-2xl font-bold">
              {bondPages?.filter(p => p.status === 'published').length ?? 0}
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
              {bondPages?.filter(p => p.status === 'draft').length ?? 0}
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
              {bondPages?.filter(p => p.complianceStatus === 'fail').length ?? 0}
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
                placeholder="Search by title, issuer, ISIN, or currency..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-bonds"
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

              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-32" data-testid="select-currency-filter">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  {currencies.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={issuerTypeFilter} onValueChange={setIssuerTypeFilter}>
                <SelectTrigger className="w-36" data-testid="select-issuer-filter">
                  <SelectValue placeholder="Issuer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Issuers</SelectItem>
                  {issuerTypes.map(t => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                <SelectTrigger className="w-32" data-testid="select-risk-filter">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  {riskLevels.map(r => (
                    <SelectItem key={r} value={r}>{r.replace(/_/g, ' ')}</SelectItem>
                  ))}
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
          ) : filteredBonds?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Landmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bond pages found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/admin/bonds/new/edit')}
                data-testid="button-create-first-bond"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first bond page
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bond</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>YTM</TableHead>
                    <TableHead>Maturity</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBonds?.map((bond) => (
                    <TableRow key={bond.id} data-testid={`row-bond-${bond.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bond.title_en}</p>
                          {bond.isin && (
                            <p className="text-xs text-muted-foreground">ISIN: {bond.isin}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{bond.issuerName_en}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {bond.issuerType.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{bond.currency}</Badge>
                      </TableCell>
                      <TableCell>
                        {bond.ytm ? `${bond.ytm.toFixed(2)}%` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {bond.isPerpetual ? 'Perpetual' : formatDate(bond.maturityDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={riskLevelColors[bond.riskLevel]}>
                          {bond.riskLevel.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={complianceStatusColors[bond.complianceStatus]}>
                          {bond.complianceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[bond.status]}>
                          {bond.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => navigate(`/admin/bonds/${bond.id}/edit`)}
                            data-testid={`button-edit-bond-${bond.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {bond.status === 'published' && (
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => window.open(`/bonds/${bond.slug}`, '_blank')}
                              data-testid={`button-view-bond-${bond.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDeleteClick(bond)}
                            data-testid={`button-delete-bond-${bond.id}`}
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
            <AlertDialogTitle>Delete Bond Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bondToDelete?.title_en}"? This action cannot be undone.
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
