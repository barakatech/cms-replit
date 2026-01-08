import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  ArrowLeft,
  Eye,
  Sparkles,
  Calendar as CalendarIcon,
  Globe,
  Image,
  LayoutGrid,
  Power,
  PowerOff,
  Smartphone
} from 'lucide-react';
import type { SpotlightBanner, SpotlightStatus, SpotlightPlacement, SpotlightSourceType } from '@shared/schema';

type ViewMode = 'list' | 'editor';

const PLACEMENT_OPTIONS: SpotlightPlacement[] = ['home', 'discover', 'blog', 'stock', 'custom'];

export default function AdminSpotlights() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localeFilter, setLocaleFilter] = useState<string>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [selectedSpotlight, setSelectedSpotlight] = useState<SpotlightBanner | null>(null);
  const [editingSpotlight, setEditingSpotlight] = useState<Partial<SpotlightBanner> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spotlightToDelete, setSpotlightToDelete] = useState<SpotlightBanner | null>(null);

  const { data: spotlights, isLoading } = useQuery<SpotlightBanner[]>({
    queryKey: ['/api/spotlights'],
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<SpotlightBanner>) => apiRequest('POST', '/api/spotlights', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotlights'] });
      toast({ title: 'Spotlight created' });
      setViewMode('list');
      setEditingSpotlight(null);
    },
    onError: () => toast({ title: 'Failed to create spotlight', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpotlightBanner> }) => 
      apiRequest('PUT', `/api/spotlights/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotlights'] });
      toast({ title: 'Spotlight updated' });
      setViewMode('list');
      setEditingSpotlight(null);
    },
    onError: () => toast({ title: 'Failed to update spotlight', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/spotlights/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotlights'] });
      toast({ title: 'Spotlight deleted' });
      setDeleteDialogOpen(false);
      setSpotlightToDelete(null);
    },
    onError: () => toast({ title: 'Failed to delete spotlight', variant: 'destructive' }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SpotlightStatus }) => 
      apiRequest('PUT', `/api/spotlights/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotlights'] });
      toast({ title: 'Status updated' });
    },
    onError: () => toast({ title: 'Failed to update status', variant: 'destructive' }),
  });

  const filteredSpotlights = spotlights?.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesLocale = localeFilter === 'all' || s.locale === localeFilter;
    const matchesPlacement = placementFilter === 'all' || s.placements.includes(placementFilter as SpotlightPlacement);
    return matchesSearch && matchesStatus && matchesLocale && matchesPlacement;
  });

  const getStatusColor = (status: SpotlightStatus) => {
    switch (status) {
      case 'active': return 'bg-brand';
      case 'inactive': return 'bg-muted';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-muted';
    }
  };

  const getSourceTypeLabel = (sourceType: SpotlightSourceType) => {
    switch (sourceType) {
      case 'manual': return 'Manual';
      case 'from_blog': return 'From Blog';
      case 'from_newsletter': return 'From Newsletter';
      default: return sourceType;
    }
  };

  const handleCreateNew = () => {
    const newSpotlight: Partial<SpotlightBanner> = {
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: '',
      ctaUrl: '',
      placements: ['home'],
      status: 'draft',
      sourceType: 'manual',
      locale: 'en',
    };
    setEditingSpotlight(newSpotlight);
    setSelectedSpotlight(null);
    setViewMode('editor');
  };

  const handleEdit = (spotlight: SpotlightBanner) => {
    setSelectedSpotlight(spotlight);
    setEditingSpotlight({ ...spotlight });
    setViewMode('editor');
  };

  const handleDuplicate = (spotlight: SpotlightBanner) => {
    const duplicated: Partial<SpotlightBanner> = {
      title: `${spotlight.title} (Copy)`,
      subtitle: spotlight.subtitle,
      imageUrl: spotlight.imageUrl,
      ctaText: spotlight.ctaText,
      ctaUrl: spotlight.ctaUrl,
      placements: [...spotlight.placements],
      status: 'draft',
      sourceType: 'manual',
      locale: spotlight.locale,
    };
    setEditingSpotlight(duplicated);
    setSelectedSpotlight(null);
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!editingSpotlight) return;
    
    if (!editingSpotlight.title || !editingSpotlight.ctaText || !editingSpotlight.ctaUrl) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    
    if (selectedSpotlight) {
      updateMutation.mutate({ id: selectedSpotlight.id, data: editingSpotlight });
    } else {
      createMutation.mutate(editingSpotlight);
    }
  };

  const handleToggleStatus = (spotlight: SpotlightBanner) => {
    const newStatus: SpotlightStatus = spotlight.status === 'active' ? 'inactive' : 'active';
    toggleStatusMutation.mutate({ id: spotlight.id, status: newStatus });
  };

  const handleConfirmDelete = () => {
    if (spotlightToDelete) {
      deleteMutation.mutate(spotlightToDelete.id);
    }
  };

  const togglePlacement = (placement: SpotlightPlacement) => {
    if (!editingSpotlight) return;
    const current = editingSpotlight.placements || [];
    const updated = current.includes(placement)
      ? current.filter(p => p !== placement)
      : [...current, placement];
    setEditingSpotlight({ ...editingSpotlight, placements: updated });
  };

  const formatSchedule = (startAt?: string, endAt?: string) => {
    if (!startAt && !endAt) return '-';
    const start = startAt ? format(new Date(startAt), 'MMM d, yyyy') : 'Now';
    const end = endAt ? format(new Date(endAt), 'MMM d, yyyy') : 'Forever';
    return `${start} - ${end}`;
  };

  if (viewMode === 'editor' && editingSpotlight) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setViewMode('list'); setEditingSpotlight(null); setSelectedSpotlight(null); }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-editor-title">
                {selectedSpotlight ? 'Edit Spotlight' : 'New Spotlight'}
              </h1>
              <p className="text-muted-foreground">Configure spotlight banner content and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => { setViewMode('list'); setEditingSpotlight(null); setSelectedSpotlight(null); }}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spotlight Content</CardTitle>
                <CardDescription>Basic information about the spotlight banner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-error">*</span></Label>
                  <Input
                    id="title"
                    value={editingSpotlight.title || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, title: e.target.value })}
                    placeholder="Enter spotlight title..."
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={editingSpotlight.subtitle || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, subtitle: e.target.value })}
                    placeholder="Supporting text (max 120 chars)..."
                    maxLength={120}
                    data-testid="input-subtitle"
                  />
                  <p className="text-xs text-muted-foreground">{(editingSpotlight.subtitle || '').length}/120 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={editingSpotlight.imageUrl || ''}
                    onChange={(e) => setEditingSpotlight({ ...editingSpotlight, imageUrl: e.target.value })}
                    placeholder="https://..."
                    data-testid="input-image-url"
                  />
                  {editingSpotlight.imageUrl && (
                    <div className="mt-2 border rounded-md overflow-hidden bg-surface2">
                      <img 
                        src={editingSpotlight.imageUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        data-testid="img-preview"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">CTA Text <span className="text-error">*</span></Label>
                    <Input
                      id="ctaText"
                      value={editingSpotlight.ctaText || ''}
                      onChange={(e) => setEditingSpotlight({ ...editingSpotlight, ctaText: e.target.value })}
                      placeholder="Button text..."
                      data-testid="input-cta-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaUrl">CTA URL <span className="text-error">*</span></Label>
                    <Input
                      id="ctaUrl"
                      value={editingSpotlight.ctaUrl || ''}
                      onChange={(e) => setEditingSpotlight({ ...editingSpotlight, ctaUrl: e.target.value })}
                      placeholder="https://..."
                      data-testid="input-cta-url"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure placement, schedule, and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Placements</Label>
                  <div className="flex flex-wrap gap-2">
                    {PLACEMENT_OPTIONS.map((placement) => (
                      <Badge
                        key={placement}
                        variant={editingSpotlight.placements?.includes(placement) ? 'default' : 'outline'}
                        className={`cursor-pointer capitalize ${editingSpotlight.placements?.includes(placement) ? 'bg-brand' : ''}`}
                        onClick={() => togglePlacement(placement)}
                        data-testid={`badge-placement-${placement}`}
                      >
                        {placement}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" data-testid="button-start-date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingSpotlight.startAt ? format(new Date(editingSpotlight.startAt), 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editingSpotlight.startAt ? new Date(editingSpotlight.startAt) : undefined}
                          onSelect={(date) => setEditingSpotlight({ ...editingSpotlight, startAt: date?.toISOString() })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal" data-testid="button-end-date">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingSpotlight.endAt ? format(new Date(editingSpotlight.endAt), 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editingSpotlight.endAt ? new Date(editingSpotlight.endAt) : undefined}
                          onSelect={(date) => setEditingSpotlight({ ...editingSpotlight, endAt: date?.toISOString() })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editingSpotlight.status || 'draft'}
                      onValueChange={(value: SpotlightStatus) => setEditingSpotlight({ ...editingSpotlight, status: value })}
                    >
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <Select
                      value={editingSpotlight.locale || 'en'}
                      onValueChange={(value: 'en' | 'ar') => setEditingSpotlight({ ...editingSpotlight, locale: value })}
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
                </div>
                <div className="space-y-2">
                  <Label>Source Type</Label>
                  <Select
                    value={editingSpotlight.sourceType || 'manual'}
                    onValueChange={(value: SpotlightSourceType) => setEditingSpotlight({ ...editingSpotlight, sourceType: value })}
                  >
                    <SelectTrigger data-testid="select-source-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="from_blog">From Blog</SelectItem>
                      <SelectItem value="from_newsletter">From Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Preview
                </CardTitle>
                <CardDescription>How the spotlight will appear on mobile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div 
                    className="relative bg-black rounded-[2.5rem] p-2 shadow-xl"
                    style={{ width: '280px' }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
                    <div 
                      className="bg-surface rounded-[2rem] overflow-hidden"
                      style={{ height: '480px' }}
                    >
                      <div className="h-full flex flex-col">
                        <div className="bg-surface2 px-4 py-3 flex items-center justify-between">
                          <span className="text-xs font-semibold">baraka</span>
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted" />
                          </div>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-3 space-y-3">
                          <div 
                            className="rounded-lg overflow-hidden border border-content-10"
                            data-testid="mobile-preview-card"
                          >
                            {editingSpotlight.imageUrl ? (
                              <img 
                                src={editingSpotlight.imageUrl} 
                                alt="Spotlight" 
                                className="w-full h-28 object-cover"
                                onError={(e) => { 
                                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text fill="%23666" font-size="12" x="50" y="55" text-anchor="middle">No Image</text></svg>';
                                }}
                              />
                            ) : (
                              <div className="w-full h-28 bg-surface2 flex items-center justify-center">
                                <Image className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="p-3 bg-surface" dir={editingSpotlight.locale === 'ar' ? 'rtl' : 'ltr'}>
                              <h3 className="font-semibold text-sm truncate text-content-100">
                                {editingSpotlight.title || 'Spotlight Title'}
                              </h3>
                              <p className="text-xs text-content-50 mt-1 line-clamp-2">
                                {editingSpotlight.subtitle || 'Subtitle text goes here...'}
                              </p>
                              <Button 
                                size="sm" 
                                className="mt-3 w-full bg-brand text-black text-xs h-8"
                              >
                                {editingSpotlight.ctaText || 'Learn More'}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="h-8 bg-surface2 rounded-md" />
                            <div className="h-20 bg-surface2 rounded-md" />
                            <div className="h-12 bg-surface2 rounded-md" />
                          </div>
                        </div>
                        
                        <div className="bg-surface2 px-4 py-2 flex justify-around">
                          <div className="w-6 h-6 rounded bg-muted" />
                          <div className="w-6 h-6 rounded bg-muted" />
                          <div className="w-6 h-6 rounded bg-muted" />
                          <div className="w-6 h-6 rounded bg-muted" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Spotlight Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage spotlight banners</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-spotlight">
          <Plus className="h-4 w-4 mr-2" />
          New Spotlight
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-count">{spotlights?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Power className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-active-count">
              {spotlights?.filter(s => s.status === 'active').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <PowerOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Inactive</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-inactive-count">
              {spotlights?.filter(s => s.status === 'inactive').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Edit className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Drafts</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-draft-count">
              {spotlights?.filter(s => s.status === 'draft').length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>All Spotlights</CardTitle>
              <CardDescription>Manage your spotlight banners</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="filter-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={localeFilter} onValueChange={setLocaleFilter}>
                <SelectTrigger className="w-28" data-testid="filter-locale">
                  <SelectValue placeholder="Locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={placementFilter} onValueChange={setPlacementFilter}>
                <SelectTrigger className="w-32" data-testid="filter-placement">
                  <SelectValue placeholder="Placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {PLACEMENT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filteredSpotlights?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Placements</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpotlights.map((spotlight) => (
                  <TableRow 
                    key={spotlight.id} 
                    className="cursor-pointer hover-elevate"
                    onClick={() => handleEdit(spotlight)}
                    data-testid={`row-spotlight-${spotlight.id}`}
                  >
                    <TableCell>
                      {spotlight.imageUrl ? (
                        <img 
                          src={spotlight.imageUrl} 
                          alt={spotlight.title}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-surface2 flex items-center justify-center">
                          <Image className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{spotlight.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{spotlight.subtitle}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {spotlight.placements.slice(0, 3).map((p) => (
                          <Badge key={p} variant="outline" className="text-xs capitalize">{p}</Badge>
                        ))}
                        {spotlight.placements.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{spotlight.placements.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`no-default-hover-elevate capitalize ${getStatusColor(spotlight.status)}`}
                      >
                        {spotlight.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatSchedule(spotlight.startAt, spotlight.endAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs uppercase">{spotlight.locale}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {getSourceTypeLabel(spotlight.sourceType)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleStatus(spotlight)}
                          disabled={toggleStatusMutation.isPending}
                          title={spotlight.status === 'active' ? 'Deactivate' : 'Activate'}
                          data-testid={`button-toggle-${spotlight.id}`}
                        >
                          {spotlight.status === 'active' ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(spotlight)}
                          title="Edit"
                          data-testid={`button-edit-${spotlight.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDuplicate(spotlight)}
                          title="Duplicate"
                          data-testid={`button-duplicate-${spotlight.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setSpotlightToDelete(spotlight); setDeleteDialogOpen(true); }}
                          title="Delete"
                          data-testid={`button-delete-${spotlight.id}`}
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
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No spotlights found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreateNew}
                data-testid="button-create-first"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Spotlight
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Spotlight</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{spotlightToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
