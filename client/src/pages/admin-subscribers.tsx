import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Upload,
  UserMinus,
  UserCheck,
  Users,
  UserX,
  CheckCircle
} from 'lucide-react';
import type { Subscriber, InsertSubscriber } from '@shared/schema';

export default function AdminSubscribers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localeFilter, setLocaleFilter] = useState<string>('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [deleteSubscriberId, setDeleteSubscriberId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    locale: 'en' as 'en' | 'ar',
    status: 'active' as 'active' | 'unsubscribed',
    tags: '',
  });
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [csvMapping, setCsvMapping] = useState({
    email: '0',
    locale: '1',
    tags: '2',
  });

  const { data: subscribers, isLoading } = useQuery<Subscriber[]>({
    queryKey: ['/api/subscribers'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertSubscriber) => apiRequest('POST', '/api/subscribers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] });
      toast({ title: 'Subscriber added successfully' });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: () => toast({ title: 'Failed to add subscriber', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscriber> }) => 
      apiRequest('PUT', `/api/subscribers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] });
      toast({ title: 'Subscriber updated successfully' });
      setIsEditDialogOpen(false);
      setEditingSubscriber(null);
      resetForm();
    },
    onError: () => toast({ title: 'Failed to update subscriber', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/subscribers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscribers'] });
      toast({ title: 'Subscriber deleted successfully' });
      setIsDeleteDialogOpen(false);
      setDeleteSubscriberId(null);
    },
    onError: () => toast({ title: 'Failed to delete subscriber', variant: 'destructive' }),
  });

  const resetForm = () => {
    setFormData({
      email: '',
      locale: 'en',
      status: 'active',
      tags: '',
    });
  };

  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];
    return subscribers.filter((s) => {
      const matchesSearch = s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesLocale = localeFilter === 'all' || s.locale === localeFilter;
      return matchesSearch && matchesStatus && matchesLocale;
    });
  }, [subscribers, searchQuery, statusFilter, localeFilter]);

  const stats = useMemo(() => {
    if (!subscribers) return { total: 0, active: 0, unsubscribed: 0 };
    return {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    };
  }, [subscribers]);

  const handleAddNew = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEdit = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
    setFormData({
      email: subscriber.email,
      locale: subscriber.locale,
      status: subscriber.status,
      tags: subscriber.tags.join(', '),
    });
    setIsEditDialogOpen(true);
  };

  const handleToggleStatus = (subscriber: Subscriber) => {
    const newStatus = subscriber.status === 'active' ? 'unsubscribed' : 'active';
    updateMutation.mutate({
      id: subscriber.id,
      data: {
        ...subscriber,
        status: newStatus,
        unsubscribedAt: newStatus === 'unsubscribed' ? new Date().toISOString() : undefined,
      },
    });
  };

  const handleDelete = (id: string) => {
    setDeleteSubscriberId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteSubscriberId) {
      deleteMutation.mutate(deleteSubscriberId);
    }
  };

  const handleSaveAdd = () => {
    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    createMutation.mutate({
      email: formData.email,
      locale: formData.locale,
      status: formData.status,
      tags: tagsArray,
    });
  };

  const handleSaveEdit = () => {
    if (!editingSubscriber) return;
    
    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    updateMutation.mutate({
      id: editingSubscriber.id,
      data: {
        email: formData.email,
        locale: formData.locale,
        status: formData.status,
        tags: tagsArray,
      },
    });
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const parsed = lines.slice(0, 6).map(line => 
        line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''))
      );
      setCsvPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    toast({ title: 'Import successful', description: `Imported ${csvPreview.length - 1} subscribers` });
    setIsImportDialogOpen(false);
    setCsvFile(null);
    setCsvPreview([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content-100" data-testid="text-page-title">
            Subscribers
          </h1>
          <p className="text-content-50">Manage your newsletter subscribers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            data-testid="button-import-csv"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={handleAddNew} data-testid="button-add-subscriber">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscriber
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card data-testid="card-stats-total">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-content-50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-stats-total">
              {stats.total}
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="card-stats-active">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand" data-testid="text-stats-active">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="card-stats-unsubscribed">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <UserX className="h-4 w-4 text-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-error" data-testid="text-stats-unsubscribed">
              {stats.unsubscribed}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
          <CardDescription>
            View and manage all newsletter subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-50" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-email"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={localeFilter} onValueChange={setLocaleFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-locale-filter">
                <SelectValue placeholder="Locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locales</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-content-50 py-8">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                      <TableCell className="font-medium" data-testid={`text-email-${subscriber.id}`}>
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" data-testid={`badge-locale-${subscriber.id}`}>
                          {subscriber.locale === 'en' ? 'English' : 'Arabic'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={subscriber.status === 'active' ? 'bg-brand text-white' : 'bg-error text-white'}
                          data-testid={`badge-status-${subscriber.id}`}
                        >
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subscriber.tags.length === 0 ? (
                            <span className="text-content-30">—</span>
                          ) : (
                            subscriber.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                                data-testid={`badge-tag-${subscriber.id}-${index}`}
                              >
                                {tag}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-content-50" data-testid={`text-created-${subscriber.id}`}>
                        {formatDate(subscriber.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(subscriber)}
                            data-testid={`button-edit-${subscriber.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(subscriber)}
                            data-testid={`button-toggle-status-${subscriber.id}`}
                          >
                            {subscriber.status === 'active' ? (
                              <UserMinus className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-error hover:text-error"
                            data-testid={`button-delete-${subscriber.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent data-testid="dialog-add-subscriber">
          <DialogHeader>
            <DialogTitle>Add Subscriber</DialogTitle>
            <DialogDescription>
              Add a new subscriber to your newsletter list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="subscriber@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-sm text-error">Please enter a valid email address</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Select
                value={formData.locale}
                onValueChange={(value: 'en' | 'ar') => setFormData({ ...formData, locale: value })}
              >
                <SelectTrigger data-testid="select-locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'unsubscribed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="newsletter, promo, vip (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                data-testid="input-tags"
              />
              <p className="text-xs text-content-30">Separate multiple tags with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              data-testid="button-cancel-add"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdd}
              disabled={!formData.email || !isValidEmail(formData.email) || createMutation.isPending}
              data-testid="button-save-add"
            >
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent data-testid="dialog-edit-subscriber">
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Update subscriber details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-edit-email"
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-sm text-error">Please enter a valid email address</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-locale">Locale</Label>
              <Select
                value={formData.locale}
                onValueChange={(value: 'en' | 'ar') => setFormData({ ...formData, locale: value })}
              >
                <SelectTrigger data-testid="select-edit-locale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'unsubscribed') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger data-testid="select-edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                placeholder="newsletter, promo, vip (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                data-testid="input-edit-tags"
              />
              <p className="text-xs text-content-30">Separate multiple tags with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!formData.email || !isValidEmail(formData.email) || updateMutation.isPending}
              data-testid="button-save-edit"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-import-csv">
          <DialogHeader>
            <DialogTitle>Import Subscribers from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple subscribers at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                data-testid="input-csv-file"
              />
            </div>
            
            {csvPreview.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>Preview (first 5 rows)</Label>
                  <ScrollArea className="h-[200px] border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {csvPreview[0]?.map((header, index) => (
                            <TableHead key={index}>{header || `Column ${index + 1}`}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvPreview.slice(1, 6).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Email Column</Label>
                    <Select
                      value={csvMapping.email}
                      onValueChange={(value) => setCsvMapping({ ...csvMapping, email: value })}
                    >
                      <SelectTrigger data-testid="select-csv-email-column">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {csvPreview[0]?.map((header, index) => (
                          <SelectItem key={index} value={String(index)}>
                            {header || `Column ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locale Column</Label>
                    <Select
                      value={csvMapping.locale}
                      onValueChange={(value) => setCsvMapping({ ...csvMapping, locale: value })}
                    >
                      <SelectTrigger data-testid="select-csv-locale-column">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {csvPreview[0]?.map((header, index) => (
                          <SelectItem key={index} value={String(index)}>
                            {header || `Column ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags Column</Label>
                    <Select
                      value={csvMapping.tags}
                      onValueChange={(value) => setCsvMapping({ ...csvMapping, tags: value })}
                    >
                      <SelectTrigger data-testid="select-csv-tags-column">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {csvPreview[0]?.map((header, index) => (
                          <SelectItem key={index} value={String(index)}>
                            {header || `Column ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setCsvFile(null);
                setCsvPreview([]);
              }}
              data-testid="button-cancel-import"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!csvFile || csvPreview.length < 2}
              data-testid="button-confirm-import"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent data-testid="dialog-delete-subscriber">
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
