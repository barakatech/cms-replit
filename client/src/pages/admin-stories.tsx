import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2, ArrowLeft, Globe, Image, Sparkles, Link as LinkIcon } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Story, InsertStory, SpotlightBanner } from '@shared/schema';

type StoryStatus = 'draft' | 'published';
type StoryLocale = 'en' | 'ar' | 'both';

interface EditableStory {
  id: string;
  title: { en: string; ar: string };
  snippet: { en: string; ar: string };
  imageUrl: string;
  content: { en: string; ar: string };
  whyItMatters: { en: string; ar: string };
  tickers: string[];
  status: StoryStatus;
  locale: StoryLocale;
  linkedSpotlightId?: string;
  linkedNewsletterId?: string;
}

function toEditableStory(story: Story): EditableStory {
  return {
    id: story.id,
    title: { en: story.title_en, ar: story.title_ar },
    snippet: { en: story.snippet_en, ar: story.snippet_ar },
    imageUrl: story.imageUrl,
    content: { en: story.content_html_en, ar: story.content_html_ar },
    whyItMatters: { en: story.whyItMatters_en, ar: story.whyItMatters_ar },
    tickers: story.tickers,
    status: story.status,
    locale: story.locale,
    linkedSpotlightId: story.linkedSpotlightId,
    linkedNewsletterId: story.linkedNewsletterId,
  };
}

function toApiStory(story: EditableStory): InsertStory {
  return {
    title_en: story.title.en,
    title_ar: story.title.ar,
    snippet_en: story.snippet.en,
    snippet_ar: story.snippet.ar,
    imageUrl: story.imageUrl,
    content_html_en: story.content.en,
    content_html_ar: story.content.ar,
    whyItMatters_en: story.whyItMatters.en,
    whyItMatters_ar: story.whyItMatters.ar,
    tickers: story.tickers,
    status: story.status,
    locale: story.locale,
  };
}

function StoryCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <Skeleton className="w-36 h-28 flex-shrink-0" />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminStories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<EditableStory | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editLanguage, setEditLanguage] = useState<'en' | 'ar'>('en');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ['/api/stories'],
  });

  const { data: spotlights = [] } = useQuery<SpotlightBanner[]>({
    queryKey: ['/api/spotlights'],
  });

  const createStoryMutation = useMutation({
    mutationFn: async (data: InsertStory) => {
      const response = await apiRequest('POST', '/api/stories', data);
      return response.json() as Promise<Story>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      toast({ title: 'Story created', description: 'Story has been created successfully.' });
      setIsEditing(false);
      setIsCreatingNew(false);
      setSelectedStory(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create story.', variant: 'destructive' });
    },
  });

  const updateStoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertStory }) => {
      const response = await apiRequest('PUT', `/api/stories/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      toast({ title: 'Story updated', description: 'Story has been updated successfully.' });
      setIsEditing(false);
      setIsCreatingNew(false);
      setSelectedStory(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update story.', variant: 'destructive' });
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/stories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      toast({ title: 'Story deleted', description: 'Story has been deleted.' });
      setDeleteConfirmId(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete story.', variant: 'destructive' });
    },
  });

  const syncSpotlightMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/stories/${id}/sync-spotlight`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/spotlights'] });
      toast({ title: 'Spotlight created', description: 'Story has been synced to a spotlight banner.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to sync to spotlight.', variant: 'destructive' });
    },
  });

  const filteredStories = stories.filter((story) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      story.title_en.toLowerCase().includes(searchLower) ||
      story.title_ar.toLowerCase().includes(searchLower) ||
      story.snippet_en.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return '';
    }
  };

  const getLocaleLabel = (locale: StoryLocale) => {
    switch (locale) {
      case 'en':
        return 'English';
      case 'ar':
        return 'Arabic';
      case 'both':
        return 'EN + AR';
    }
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(toEditableStory(story));
    setIsCreatingNew(false);
    setIsEditing(true);
  };

  const handleSaveStory = () => {
    if (!selectedStory) return;
    
    const apiData = toApiStory(selectedStory);
    
    if (isCreatingNew) {
      createStoryMutation.mutate(apiData);
    } else {
      updateStoryMutation.mutate({ id: selectedStory.id, data: apiData });
    }
  };

  const handleCreateNew = () => {
    const newStory: EditableStory = {
      id: '',
      title: { en: '', ar: '' },
      snippet: { en: '', ar: '' },
      imageUrl: '',
      content: { en: '', ar: '' },
      whyItMatters: { en: '', ar: '' },
      tickers: [],
      status: 'draft',
      locale: 'both',
    };
    setSelectedStory(newStory);
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  const isSaving = createStoryMutation.isPending || updateStoryMutation.isPending;

  if (isEditing && selectedStory) {
    return (
      <div className="p-6 space-y-6" dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setIsCreatingNew(false); setSelectedStory(null); }} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{isCreatingNew ? 'New Story' : 'Edit Story'}</h1>
              <p className="text-content-50">Manage story content and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={editLanguage === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditLanguage('en')}
                data-testid="button-lang-en"
              >
                <Globe className="h-4 w-4 mr-1" />
                EN
              </Button>
              <Button
                variant={editLanguage === 'ar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setEditLanguage('ar')}
                data-testid="button-lang-ar"
              >
                <Globe className="h-4 w-4 mr-1" />
                AR
              </Button>
            </div>
            <Button onClick={handleSaveStory} disabled={isSaving} data-testid="button-save-story">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Story Content</CardTitle>
                <CardDescription>Edit the main content of your story</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title ({editLanguage.toUpperCase()})</Label>
                  <Input
                    id="title"
                    value={selectedStory.title[editLanguage]}
                    onChange={(e) => setSelectedStory({
                      ...selectedStory,
                      title: { ...selectedStory.title, [editLanguage]: e.target.value }
                    })}
                    placeholder="Enter story title..."
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="snippet">Snippet ({editLanguage.toUpperCase()})</Label>
                  <Textarea
                    id="snippet"
                    value={selectedStory.snippet[editLanguage]}
                    onChange={(e) => setSelectedStory({
                      ...selectedStory,
                      snippet: { ...selectedStory.snippet, [editLanguage]: e.target.value }
                    })}
                    placeholder="Brief summary of the story..."
                    rows={3}
                    data-testid="input-snippet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={selectedStory.imageUrl}
                      onChange={(e) => setSelectedStory({ ...selectedStory, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      data-testid="input-image-url"
                    />
                    <Button variant="outline" size="icon" data-testid="button-browse-image">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedStory.imageUrl && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img 
                        src={selectedStory.imageUrl} 
                        alt="Story" 
                        className="w-full h-40 object-cover"
                        data-testid="img-preview"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Content ({editLanguage.toUpperCase()})</Label>
                  <RichTextEditor
                    content={selectedStory.content[editLanguage]}
                    onChange={(value) => setSelectedStory({
                      ...selectedStory,
                      content: { ...selectedStory.content, [editLanguage]: value }
                    })}
                    placeholder="Write your story content here..."
                    dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whyItMatters">Why It Matters ({editLanguage.toUpperCase()})</Label>
                  <Textarea
                    id="whyItMatters"
                    value={selectedStory.whyItMatters[editLanguage]}
                    onChange={(e) => setSelectedStory({
                      ...selectedStory,
                      whyItMatters: { ...selectedStory.whyItMatters, [editLanguage]: e.target.value }
                    })}
                    placeholder="Explain why this story matters to readers..."
                    rows={4}
                    data-testid="input-why-it-matters"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Story Settings</CardTitle>
                <CardDescription>Configure story metadata and publishing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedStory.status}
                      onValueChange={(value: StoryStatus) => setSelectedStory({ ...selectedStory, status: value })}
                    >
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locale">Locale</Label>
                    <Select
                      value={selectedStory.locale}
                      onValueChange={(value: StoryLocale) => setSelectedStory({ ...selectedStory, locale: value })}
                    >
                      <SelectTrigger data-testid="select-locale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="both">Both (EN + AR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tickers">Stock Tickers (comma-separated)</Label>
                  <Input
                    id="tickers"
                    value={selectedStory.tickers.join(', ')}
                    onChange={(e) => setSelectedStory({
                      ...selectedStory,
                      tickers: e.target.value.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)
                    })}
                    placeholder="AAPL, GOOGL, MSFT"
                    data-testid="input-tickers"
                  />
                  <p className="text-xs text-content-30">Enter stock ticker symbols separated by commas</p>
                </div>
                {selectedStory.tickers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.tickers.map((ticker) => (
                      <Badge key={ticker} variant="secondary" className="text-xs">
                        {ticker}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
          <p className="text-content-50">Manage newsletter stories and content</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-story">
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-30" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))
        ) : filteredStories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-content-50 mb-4">No stories found</p>
              <Button onClick={handleCreateNew} variant="outline" data-testid="button-create-story-empty">
                <Plus className="h-4 w-4 mr-2" />
                Create your first story
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredStories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover-elevate" data-testid={`card-story-${story.id}`}>
              <div className="flex">
                {story.imageUrl && (
                  <div className="w-36 h-28 flex-shrink-0 bg-surface2">
                    <img
                      src={story.imageUrl}
                      alt={story.title_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={`text-xs ${getStatusColor(story.status)}`}>
                          {story.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getLocaleLabel(story.locale)}
                        </Badge>
                        {story.linkedSpotlightId && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <LinkIcon className="h-3 w-3" />
                            Spotlight
                          </Badge>
                        )}
                        {story.tickers.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {story.tickers.slice(0, 3).join(', ')}
                            {story.tickers.length > 3 && ` +${story.tickers.length - 3}`}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-content-100 truncate mb-1">
                        {story.title_en || story.title_ar || 'Untitled'}
                      </h3>
                      <p className="text-sm text-content-50 line-clamp-2">
                        {story.snippet_en || story.snippet_ar}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!story.linkedSpotlightId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => syncSpotlightMutation.mutate(story.id)}
                          disabled={syncSpotlightMutation.isPending}
                          title="Sync to Spotlight"
                          data-testid={`button-sync-spotlight-${story.id}`}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditStory(story)}
                        data-testid={`button-edit-${story.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog open={deleteConfirmId === story.id} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmId(story.id)}
                            data-testid={`button-delete-${story.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Story</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{story.title_en || story.title_ar}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} data-testid="button-cancel-delete">
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => deleteStoryMutation.mutate(story.id)}
                              disabled={deleteStoryMutation.isPending}
                              data-testid="button-confirm-delete"
                            >
                              {deleteStoryMutation.isPending ? 'Deleting...' : 'Delete'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
