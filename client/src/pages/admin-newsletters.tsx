import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  Send,
  Mail,
  ArrowLeft,
  Eye,
  ExternalLink,
  Sparkles,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  FileText,
  Globe,
  ChevronDown,
  MoreVertical,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Lightbulb,
  Newspaper,
  Layers
} from 'lucide-react';
import type { Newsletter, NewsletterTemplate, NewsletterContentBlock, NewsletterStatus } from '@shared/schema';

type ViewMode = 'list' | 'editor';

type BlockTypeOption = 'hero' | 'intro' | 'featured' | 'articles' | 'cta' | 'footer';

const CONTENT_BLOCK_TYPES: { type: BlockTypeOption; label: string; icon: typeof FileText; description: string }[] = [
  { type: 'hero', label: 'Hero', icon: Star, description: 'Hero section with title, content, and CTA' },
  { type: 'intro', label: 'Introduction', icon: FileText, description: 'Introduction paragraph' },
  { type: 'featured', label: 'Featured', icon: TrendingUp, description: 'Featured content section' },
  { type: 'articles', label: 'Articles', icon: Newspaper, description: 'List of articles' },
  { type: 'cta', label: 'Call to Action', icon: Send, description: 'Call to action button' },
  { type: 'footer', label: 'Footer', icon: Globe, description: 'Footer section' },
];

const getDefaultBlockContent = (type: BlockTypeOption): NewsletterContentBlock => {
  switch (type) {
    case 'hero':
      return { type: 'hero', title: 'Newsletter Title', content: 'Newsletter description...', imageUrl: '', ctaText: '', ctaUrl: '' };
    case 'intro':
      return { type: 'intro', title: 'Introduction', content: 'Welcome to our newsletter...', imageUrl: '' };
    case 'featured':
      return { type: 'featured', title: 'Featured', content: 'Featured content description', imageUrl: '' };
    case 'articles':
      return { type: 'articles', title: 'Latest Articles', articles: [] };
    case 'cta':
      return { type: 'cta', title: 'Take Action', ctaText: 'Learn More', ctaUrl: '' };
    case 'footer':
      return { type: 'footer', content: 'Thank you for reading!' };
    default:
      return { type: 'intro', title: '', content: '' };
  }
};

export default function AdminNewsletters() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localeFilter, setLocaleFilter] = useState<string>('all');
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [editingNewsletter, setEditingNewsletter] = useState<Partial<Newsletter> | null>(null);

  const { data: newsletters, isLoading } = useQuery<Newsletter[]>({
    queryKey: ['/api/newsletters'],
  });

  const { data: templates } = useQuery<NewsletterTemplate[]>({
    queryKey: ['/api/newsletter-templates'],
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Newsletter>) => apiRequest('POST', '/api/newsletters', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      toast({ title: 'Newsletter created' });
      setViewMode('list');
      setEditingNewsletter(null);
    },
    onError: () => toast({ title: 'Failed to create newsletter', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Newsletter> }) => 
      apiRequest('PUT', `/api/newsletters/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      toast({ title: 'Newsletter updated' });
      setViewMode('list');
      setEditingNewsletter(null);
    },
    onError: () => toast({ title: 'Failed to update newsletter', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/newsletters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      toast({ title: 'Newsletter deleted' });
    },
    onError: () => toast({ title: 'Failed to delete newsletter', variant: 'destructive' }),
  });

  const sendTestMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/newsletters/${id}/send-test`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      toast({ title: 'Test email sent' });
    },
    onError: () => toast({ title: 'Failed to send test email', variant: 'destructive' }),
  });

  const sendMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/newsletters/${id}/send`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
      toast({ title: 'Newsletter sent successfully' });
    },
    onError: () => toast({ title: 'Failed to send newsletter', variant: 'destructive' }),
  });

  const filteredNewsletters = newsletters?.filter((n) => {
    const matchesSearch = n.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
    const matchesLocale = localeFilter === 'all' || n.locale === localeFilter;
    return matchesSearch && matchesStatus && matchesLocale;
  });

  const getStatusColor = (status: NewsletterStatus) => {
    switch (status) {
      case 'sent': return 'bg-brand';
      case 'ready': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-muted';
    }
  };

  const handleCreateNew = () => {
    const defaultTemplate = templates?.[0];
    const newNewsletter: Partial<Newsletter> = {
      subject: '',
      preheader: '',
      templateId: defaultTemplate?.id || '',
      contentBlocks: defaultTemplate?.schemaJson.blocks.map(b => ({
        type: b.type,
        title: '',
        content: '',
        imageUrl: '',
        ctaText: '',
        ctaUrl: '',
      })) || [],
      status: 'draft',
      locale: 'en',
    };
    setEditingNewsletter(newNewsletter);
    setSelectedNewsletter(null);
    setViewMode('editor');
  };

  const handleEdit = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setEditingNewsletter({ ...newsletter });
    setViewMode('editor');
  };

  const handleDuplicate = (newsletter: Newsletter) => {
    const duplicated: Partial<Newsletter> = {
      subject: `${newsletter.subject} (Copy)`,
      preheader: newsletter.preheader,
      templateId: newsletter.templateId,
      contentBlocks: [...newsletter.contentBlocks],
      status: 'draft',
      locale: newsletter.locale,
    };
    setEditingNewsletter(duplicated);
    setSelectedNewsletter(null);
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!editingNewsletter) return;
    
    if (selectedNewsletter) {
      updateMutation.mutate({ id: selectedNewsletter.id, data: editingNewsletter });
    } else {
      createMutation.mutate(editingNewsletter);
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!editingNewsletter?.contentBlocks) return;
    const blocks = [...editingNewsletter.contentBlocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setEditingNewsletter({ ...editingNewsletter, contentBlocks: blocks });
  };

  const updateBlock = (index: number, field: keyof NewsletterContentBlock, value: string) => {
    if (!editingNewsletter?.contentBlocks) return;
    const blocks = [...editingNewsletter.contentBlocks];
    blocks[index] = { ...blocks[index], [field]: value };
    setEditingNewsletter({ ...editingNewsletter, contentBlocks: blocks });
  };

  const addBlock = (type: BlockTypeOption) => {
    const newBlock = getDefaultBlockContent(type);
    const blocks = editingNewsletter?.contentBlocks ? [...editingNewsletter.contentBlocks, newBlock] : [newBlock];
    setEditingNewsletter({ ...editingNewsletter, contentBlocks: blocks });
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} block added` });
  };

  const deleteBlock = (index: number) => {
    if (!editingNewsletter?.contentBlocks) return;
    const blocks = [...editingNewsletter.contentBlocks];
    blocks.splice(index, 1);
    setEditingNewsletter({ ...editingNewsletter, contentBlocks: blocks });
    toast({ title: 'Block deleted' });
  };

  if (viewMode === 'editor' && editingNewsletter) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setViewMode('list'); setEditingNewsletter(null); setSelectedNewsletter(null); }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-editor-title">
                {selectedNewsletter ? 'Edit Newsletter' : 'New Newsletter'}
              </h1>
              <p className="text-muted-foreground">Configure newsletter content and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedNewsletter && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => sendTestMutation.mutate(selectedNewsletter.id)}
                  disabled={sendTestMutation.isPending}
                  data-testid="button-send-test"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toast({ title: 'Create Spotlight', description: 'This will create a spotlight from this newsletter' })}
                  data-testid="button-create-spotlight"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Spotlight
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={() => { setViewMode('list'); setEditingNewsletter(null); setSelectedNewsletter(null); }}
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
                <CardTitle>Newsletter Settings</CardTitle>
                <CardDescription>Basic information about the newsletter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={editingNewsletter.subject || ''}
                    onChange={(e) => setEditingNewsletter({ ...editingNewsletter, subject: e.target.value })}
                    placeholder="Enter email subject..."
                    data-testid="input-subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preheader">Preheader</Label>
                  <Input
                    id="preheader"
                    value={editingNewsletter.preheader || ''}
                    onChange={(e) => setEditingNewsletter({ ...editingNewsletter, preheader: e.target.value })}
                    placeholder="Preview text shown in inbox..."
                    maxLength={120}
                    data-testid="input-preheader"
                  />
                  <p className="text-xs text-muted-foreground">{(editingNewsletter.preheader || '').length}/120 characters</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <Select
                      value={editingNewsletter.templateId || ''}
                      onValueChange={(value) => {
                        const template = templates?.find(t => t.id === value);
                        setEditingNewsletter({ 
                          ...editingNewsletter, 
                          templateId: value,
                          contentBlocks: template?.schemaJson.blocks.map(b => ({
                            type: b.type,
                            title: '',
                            content: '',
                            imageUrl: '',
                            ctaText: '',
                            ctaUrl: '',
                          })) || editingNewsletter.contentBlocks
                        });
                      }}
                    >
                      <SelectTrigger data-testid="select-template">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates?.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <Select
                      value={editingNewsletter.locale || 'en'}
                      onValueChange={(value: 'en' | 'ar') => setEditingNewsletter({ ...editingNewsletter, locale: value })}
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
                  <Label>Status</Label>
                  <Select
                    value={editingNewsletter.status || 'draft'}
                    onValueChange={(value: NewsletterStatus) => setEditingNewsletter({ ...editingNewsletter, status: value })}
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Content Blocks</CardTitle>
                  <CardDescription>Edit the content sections of your newsletter</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button data-testid="button-add-content-block">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Block
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Content Block Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {CONTENT_BLOCK_TYPES.map((blockType) => (
                      <DropdownMenuItem
                        key={blockType.type}
                        onClick={() => addBlock(blockType.type)}
                        data-testid={`dropdown-add-${blockType.type}`}
                      >
                        <blockType.icon className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">{blockType.label}</div>
                          <div className="text-xs text-muted-foreground">{blockType.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingNewsletter.contentBlocks?.map((block, index) => (
                  <Card key={index} className="bg-surface2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="capitalize">{block.type}</Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              data-testid={`button-block-menu-${index}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={index === 0}
                              onClick={() => moveBlock(index, 'up')}
                              data-testid={`menu-block-up-${index}`}
                            >
                              <ArrowUp className="h-4 w-4 mr-2" />
                              Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={index === (editingNewsletter.contentBlocks?.length || 0) - 1}
                              onClick={() => moveBlock(index, 'down')}
                              data-testid={`menu-block-down-${index}`}
                            >
                              <ArrowDown className="h-4 w-4 mr-2" />
                              Move Down
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteBlock(index)}
                              className="text-destructive"
                              data-testid={`menu-block-delete-${index}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Block
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={block.title || ''}
                          onChange={(e) => updateBlock(index, 'title', e.target.value)}
                          placeholder="Block title..."
                          data-testid={`input-block-title-${index}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={block.content || ''}
                          onChange={(e) => updateBlock(index, 'content', e.target.value)}
                          placeholder="Block content..."
                          rows={3}
                          data-testid={`input-block-content-${index}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={block.imageUrl || ''}
                          onChange={(e) => updateBlock(index, 'imageUrl', e.target.value)}
                          placeholder="https://..."
                          data-testid={`input-block-image-${index}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>CTA Text</Label>
                          <Input
                            value={block.ctaText || ''}
                            onChange={(e) => updateBlock(index, 'ctaText', e.target.value)}
                            placeholder="Button text..."
                            data-testid={`input-block-cta-text-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA URL</Label>
                          <Input
                            value={block.ctaUrl || ''}
                            onChange={(e) => updateBlock(index, 'ctaUrl', e.target.value)}
                            placeholder="https://..."
                            data-testid={`input-block-cta-url-${index}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!editingNewsletter.contentBlocks || editingNewsletter.contentBlocks.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content blocks. Select a template to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>HTML output preview</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] border rounded-md bg-white">
                  {selectedNewsletter?.htmlOutput ? (
                    <iframe
                      srcDoc={selectedNewsletter.htmlOutput}
                      className="w-full h-full min-h-[580px]"
                      title="Newsletter Preview"
                      data-testid="iframe-preview"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[580px] text-muted-foreground">
                      <div className="text-center">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Save the newsletter to generate HTML preview</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
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
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Newsletter Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage email newsletters</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-newsletter">
          <Plus className="h-4 w-4 mr-2" />
          New Newsletter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-total-count">{newsletters?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Send className="h-4 w-4 text-brand" />
              <span className="text-xs text-muted-foreground">Sent</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-sent-count">
              {newsletters?.filter(n => n.status === 'sent').length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Scheduled</span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-scheduled-count">
              {newsletters?.filter(n => n.status === 'scheduled').length ?? 0}
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
              {newsletters?.filter(n => n.status === 'draft').length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Newsletters</CardTitle>
              <CardDescription>Click on a newsletter to edit it</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]" data-testid="select-filter-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={localeFilter} onValueChange={setLocaleFilter}>
                <SelectTrigger className="w-[100px]" data-testid="select-filter-locale">
                  <SelectValue placeholder="Locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="ar">AR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : filteredNewsletters?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNewsletters.map((newsletter) => (
                  <TableRow 
                    key={newsletter.id}
                    className="cursor-pointer hover-elevate"
                    onClick={() => handleEdit(newsletter)}
                    data-testid={`row-newsletter-${newsletter.id}`}
                  >
                    <TableCell className="font-medium" data-testid={`text-subject-${newsletter.id}`}>
                      <div className="max-w-[250px]">
                        <div className="truncate">{newsletter.subject}</div>
                        {newsletter.preheader && (
                          <div className="text-xs text-muted-foreground truncate">{newsletter.preheader}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase" data-testid={`badge-locale-${newsletter.id}`}>
                        <Globe className="h-3 w-3 mr-1" />
                        {newsletter.locale}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`no-default-hover-elevate ${getStatusColor(newsletter.status)}`}
                        data-testid={`badge-status-${newsletter.id}`}
                      >
                        {newsletter.status}
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-source-${newsletter.id}`}>
                      {newsletter.sourceBlogPostId ? (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Blog
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-date-${newsletter.id}`}>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {newsletter.sentAt 
                          ? new Date(newsletter.sentAt).toLocaleDateString()
                          : newsletter.scheduledAt 
                            ? new Date(newsletter.scheduledAt).toLocaleDateString()
                            : new Date(newsletter.createdAt).toLocaleDateString()
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setLocation(`/admin/newsletters/${newsletter.id}`)}
                          data-testid={`button-open-${newsletter.id}`}
                          title="Open Block Editor"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(newsletter)}
                          data-testid={`button-edit-${newsletter.id}`}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDuplicate(newsletter)}
                          data-testid={`button-duplicate-${newsletter.id}`}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {(newsletter.status === 'draft' || newsletter.status === 'ready') && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => sendTestMutation.mutate(newsletter.id)}
                            disabled={sendTestMutation.isPending}
                            data-testid={`button-send-test-${newsletter.id}`}
                            title="Send Test"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        {newsletter.status === 'ready' && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => sendMutation.mutate(newsletter.id)}
                            disabled={sendMutation.isPending}
                            data-testid={`button-send-${newsletter.id}`}
                            title="Send"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              data-testid={`button-delete-${newsletter.id}`}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Newsletter</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{newsletter.subject}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" data-testid="button-cancel-delete">Cancel</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteMutation.mutate(newsletter.id)}
                                disabled={deleteMutation.isPending}
                                data-testid="button-confirm-delete"
                              >
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No newsletters found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreateNew}
                data-testid="button-create-first"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Newsletter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
