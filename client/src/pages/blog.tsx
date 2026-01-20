import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Edit, Trash2, Eye, Calendar, User, ArrowLeft, Globe, Image, Sparkles, Mail, Send, Rocket, Loader2, Check, BookOpen, Megaphone, Newspaper } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import type { SpotlightBanner, Newsletter, BlogPost, InsertBlogPost, Story, InsertStory } from '@shared/schema';

type BlogStatus = 'draft' | 'published' | 'archived';

interface EditableBlogPost {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  seoTitle: { en: string; ar: string };
  seoDescription: { en: string; ar: string };
  publishedAt?: string;
}

function toEditablePost(post: BlogPost): EditableBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: { en: post.title_en, ar: post.title_ar },
    excerpt: { en: post.excerpt_en, ar: post.excerpt_ar },
    content: { en: post.content_en, ar: post.content_ar },
    featuredImage: post.featuredImage || '',
    category: post.category,
    tags: post.tags,
    author: post.author,
    status: post.status,
    seoTitle: { en: post.seo?.metaTitle_en || '', ar: post.seo?.metaTitle_ar || '' },
    seoDescription: { en: post.seo?.metaDescription_en || '', ar: post.seo?.metaDescription_ar || '' },
    publishedAt: post.publishedAt,
  };
}

function toApiPost(post: EditableBlogPost, forcePublishNow?: boolean): InsertBlogPost {
  let publishedAt = post.publishedAt;
  if (forcePublishNow && post.status === 'published' && !publishedAt) {
    publishedAt = new Date().toISOString();
  }
  
  return {
    slug: post.slug,
    title_en: post.title.en,
    title_ar: post.title.ar,
    excerpt_en: post.excerpt.en,
    excerpt_ar: post.excerpt.ar,
    content_en: post.content.en,
    content_ar: post.content.ar,
    featuredImage: post.featuredImage || undefined,
    category: post.category,
    tags: post.tags,
    author: post.author,
    status: post.status,
    seo: {
      metaTitle_en: post.seoTitle.en,
      metaTitle_ar: post.seoTitle.ar,
      metaDescription_en: post.seoDescription.en,
      metaDescription_ar: post.seoDescription.ar,
    },
    publishedAt,
  };
}

function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <Skeleton className="w-48 h-36 flex-shrink-0" />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </Card>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBlog, setSelectedBlog] = useState<EditableBlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editLanguage, setEditLanguage] = useState<'en' | 'ar'>('en');
  const { toast } = useToast();

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  const { data: spotlights = [] } = useQuery<SpotlightBanner[]>({
    queryKey: ['/api/spotlights'],
  });

  const { data: newsletters = [] } = useQuery<Newsletter[]>({
    queryKey: ['/api/newsletters'],
  });

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ['/api/stories'],
  });

  const spotlightsByBlogId = useMemo(() => {
    const map: Record<string, SpotlightBanner> = {};
    spotlights.forEach(s => {
      if (s.blogPostId) map[s.blogPostId] = s;
    });
    return map;
  }, [spotlights]);

  const newslettersByBlogId = useMemo(() => {
    const map: Record<string, Newsletter> = {};
    newsletters.forEach(n => {
      if (n.sourceBlogPostId) map[n.sourceBlogPostId] = n;
    });
    return map;
  }, [newsletters]);

  const storiesByBlogId = useMemo(() => {
    const map: Record<string, Story> = {};
    stories.forEach(s => {
      if (s.sourceBlogPostId) map[s.sourceBlogPostId] = s;
    });
    blogPosts.forEach(blog => {
      if (!map[blog.id]) {
        const matchingStory = stories.find(s => 
          !s.sourceBlogPostId && s.title_en === blog.title_en
        );
        if (matchingStory) {
          map[blog.id] = matchingStory;
        }
      }
    });
    return map;
  }, [stories, blogPosts]);

  const createBlogMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest('POST', '/api/blog-posts', data);
      return response.json() as Promise<BlogPost>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({ title: 'Blog created', description: 'Blog post has been created successfully.' });
      setIsEditing(false);
      setIsCreatingNew(false);
      setSelectedBlog(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create blog post.', variant: 'destructive' });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertBlogPost }) => {
      const response = await apiRequest('PUT', `/api/blog-posts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({ title: 'Blog updated', description: 'Blog post has been updated successfully.' });
      setIsEditing(false);
      setIsCreatingNew(false);
      setSelectedBlog(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update blog post.', variant: 'destructive' });
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      toast({ title: 'Blog deleted', description: 'Blog post has been deleted.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete blog post.', variant: 'destructive' });
    },
  });

  const createSpotlightMutation = useMutation({
    mutationFn: async (blog: BlogPost) => {
      const response = await apiRequest('POST', '/api/spotlights', {
        title: blog.title_en,
        subtitle: blog.excerpt_en.slice(0, 90),
        imageUrl: blog.featuredImage || '',
        ctaText: 'Read Article',
        ctaUrl: `/blog/${blog.slug}`,
        appDeepLink: `baraka://blog/${blog.slug}`,
        placements: ['blog', 'home', 'discover'],
        status: 'draft',
        sourceType: 'from_blog',
        blogPostId: blog.id,
        locale: 'en',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotlights'] });
    },
  });

  const createNewsletterMutation = useMutation({
    mutationFn: async (blog: BlogPost) => {
      const response = await apiRequest('POST', '/api/newsletters', {
        subject: blog.title_en,
        preheader: blog.excerpt_en.slice(0, 120),
        templateId: '1',
        contentBlocks: [
          { type: 'hero' as const, title: blog.title_en, imageUrl: blog.featuredImage || '', ctaText: 'Read Article', ctaUrl: `/blog/${blog.slug}` },
          { type: 'intro' as const, content: blog.excerpt_en },
          { type: 'footer' as const, content: 'baraka - Zero commission trading' },
        ],
        status: 'draft',
        sourceBlogPostId: blog.id,
        locale: 'en',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/newsletters'] });
    },
  });

  const createStoryMutation = useMutation({
    mutationFn: async ({ blogId, blog }: { blogId: string; blog: EditableBlogPost }) => {
      const storyData: InsertStory = {
        title_en: blog.title.en,
        title_ar: blog.title.ar,
        snippet_en: blog.excerpt.en,
        snippet_ar: blog.excerpt.ar,
        imageUrl: blog.featuredImage || '',
        content_html_en: blog.content.en,
        content_html_ar: blog.content.ar,
        whyItMatters_en: '',
        whyItMatters_ar: '',
        tickers: [],
        status: 'draft',
        locale: 'both',
        sourceBlogPostId: blogId,
      };
      const response = await apiRequest('POST', '/api/stories', storyData);
      return response.json() as Promise<Story>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
    },
  });

  const [isPublishingEverywhere, setIsPublishingEverywhere] = useState(false);

  const handlePublishEverywhere = async () => {
    if (!selectedBlog || isCreatingNew) return;
    
    setIsPublishingEverywhere(true);
    
    const blogId = selectedBlog.id;
    const existingBlogPost = blogPosts.find(b => b.id === blogId);
    
    if (!existingBlogPost) {
      toast({ title: 'Error', description: 'Blog post not found. Please save first.', variant: 'destructive' });
      setIsPublishingEverywhere(false);
      return;
    }

    const createdItems: string[] = [];
    const failedItems: string[] = [];
    const existingSpotlight = spotlightsByBlogId[blogId];
    const existingNewsletter = newslettersByBlogId[blogId];
    const existingStory = storiesByBlogId[blogId];

    const updatedPost = { ...selectedBlog, status: 'published' as BlogStatus };
    if (!updatedPost.publishedAt) {
      updatedPost.publishedAt = new Date().toISOString();
    }

    try {
      await apiRequest('PUT', `/api/blog-posts/${blogId}`, toApiPost(updatedPost));
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      createdItems.push('Published blog');
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to publish blog post.', variant: 'destructive' });
      setIsPublishingEverywhere(false);
      return;
    }

    const blogDataForSync: BlogPost = {
      ...existingBlogPost,
      slug: updatedPost.slug,
      title_en: updatedPost.title.en,
      title_ar: updatedPost.title.ar,
      excerpt_en: updatedPost.excerpt.en,
      excerpt_ar: updatedPost.excerpt.ar,
      content_en: updatedPost.content.en,
      content_ar: updatedPost.content.ar,
      featuredImage: updatedPost.featuredImage,
      category: updatedPost.category,
      tags: updatedPost.tags,
      author: updatedPost.author,
      status: 'published',
    };

    if (!existingStory) {
      try {
        await createStoryMutation.mutateAsync({ blogId, blog: updatedPost });
        createdItems.push('Story');
      } catch (e) {
        console.error('Failed to create story:', e);
        failedItems.push('Story');
      }
    }

    if (!existingSpotlight) {
      try {
        await createSpotlightMutation.mutateAsync(blogDataForSync);
        createdItems.push('Spotlight');
      } catch (e) {
        console.error('Failed to create spotlight:', e);
        failedItems.push('Spotlight');
      }
    }

    if (!existingNewsletter) {
      try {
        await createNewsletterMutation.mutateAsync(blogDataForSync);
        createdItems.push('Newsletter');
      } catch (e) {
        console.error('Failed to create newsletter:', e);
        failedItems.push('Newsletter');
      }
    }

    setIsPublishingEverywhere(false);
    setIsEditing(false);
    setSelectedBlog(null);

    if (failedItems.length > 0) {
      toast({
        title: 'Published with some issues',
        description: `Created: ${createdItems.join(', ')}. Failed: ${failedItems.join(', ')}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Published Everywhere!',
        description: createdItems.length > 0 
          ? `Created: ${createdItems.join(', ')}`
          : 'Content already exists in all channels',
      });
    }
  };

  const handlePublishBlog = async (blog: BlogPost) => {
    const existingSpotlight = spotlightsByBlogId[blog.id];
    const existingNewsletter = newslettersByBlogId[blog.id];
    
    try {
      const editablePost = toEditablePost(blog);
      editablePost.status = 'published';
      if (!editablePost.publishedAt) {
        editablePost.publishedAt = new Date().toISOString();
      }
      
      await apiRequest('PUT', `/api/blog-posts/${blog.id}`, toApiPost(editablePost));
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to publish blog post.', variant: 'destructive' });
      return;
    }
    
    const createdItems: string[] = [];
    
    if (!existingSpotlight) {
      try {
        await createSpotlightMutation.mutateAsync(blog);
        createdItems.push('Spotlight banner');
      } catch (e) {
        console.error('Failed to create spotlight:', e);
      }
    }
    
    if (!existingNewsletter) {
      try {
        await createNewsletterMutation.mutateAsync(blog);
        createdItems.push('Newsletter draft');
      } catch (e) {
        console.error('Failed to create newsletter:', e);
      }
    }
    
    toast({
      title: 'Blog Published!',
      description: createdItems.length > 0 
        ? `Auto-created: ${createdItems.join(', ')}`
        : 'No new content was auto-created (already exists)',
    });
  };

  const filteredBlogs = blogPosts.filter((blog) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      blog.title_en.toLowerCase().includes(searchLower) ||
      blog.title_ar.toLowerCase().includes(searchLower) ||
      blog.author.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default:
        return '';
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setSelectedBlog(toEditablePost(blog));
    setIsCreatingNew(false);
    setIsEditing(true);
  };

  const handleSaveBlog = () => {
    if (!selectedBlog) return;
    
    const updatedPost = { ...selectedBlog };
    if (updatedPost.status === 'published' && !updatedPost.publishedAt) {
      updatedPost.publishedAt = new Date().toISOString();
    }
    
    const apiData = toApiPost(updatedPost);
    
    if (isCreatingNew) {
      createBlogMutation.mutate(apiData);
    } else {
      updateBlogMutation.mutate({ id: selectedBlog.id, data: apiData });
    }
  };

  const handleDeleteBlog = (id: string) => {
    deleteBlogMutation.mutate(id);
  };

  const handleCreateNew = () => {
    const newBlog: EditableBlogPost = {
      id: '',
      slug: '',
      title: { en: '', ar: '' },
      excerpt: { en: '', ar: '' },
      content: { en: '', ar: '' },
      author: '',
      category: '',
      tags: [],
      featuredImage: '',
      status: 'draft',
      seoTitle: { en: '', ar: '' },
      seoDescription: { en: '', ar: '' },
    };
    setSelectedBlog(newBlog);
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  const isSaving = createBlogMutation.isPending || updateBlogMutation.isPending;

  if (isEditing && selectedBlog) {
    return (
      <div className="p-6 space-y-6" dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setIsCreatingNew(false); setSelectedBlog(null); }} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{isCreatingNew ? 'New Blog Post' : 'Edit Blog Post'}</h1>
              <p className="text-muted-foreground">Manage blog post content and settings</p>
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
            <Button variant="outline" onClick={handleSaveBlog} disabled={isSaving || isPublishingEverywhere} data-testid="button-save-blog">
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            {!isCreatingNew && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handlePublishEverywhere} 
                    disabled={isSaving || isPublishingEverywhere}
                    className="gap-2"
                    data-testid="button-publish-everywhere"
                  >
                    {isPublishingEverywhere ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        Publish Everywhere
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-medium mb-1">One-click publishing</p>
                  <p className="text-xs text-muted-foreground">Publishes blog and auto-creates Story, Newsletter, and Spotlight in one click</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blog Content</CardTitle>
                <CardDescription>Edit the main content of your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title ({editLanguage.toUpperCase()})</Label>
                  <Input
                    id="title"
                    value={selectedBlog.title[editLanguage]}
                    onChange={(e) => setSelectedBlog({
                      ...selectedBlog,
                      title: { ...selectedBlog.title, [editLanguage]: e.target.value }
                    })}
                    placeholder="Enter blog title..."
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={selectedBlog.slug}
                    onChange={(e) => setSelectedBlog({ ...selectedBlog, slug: e.target.value })}
                    placeholder="blog-post-url-slug"
                    data-testid="input-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt ({editLanguage.toUpperCase()})</Label>
                  <Textarea
                    id="excerpt"
                    value={selectedBlog.excerpt[editLanguage]}
                    onChange={(e) => setSelectedBlog({
                      ...selectedBlog,
                      excerpt: { ...selectedBlog.excerpt, [editLanguage]: e.target.value }
                    })}
                    placeholder="Brief summary of the blog post..."
                    rows={3}
                    data-testid="input-excerpt"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content ({editLanguage.toUpperCase()})</Label>
                  <RichTextEditor
                    content={selectedBlog.content[editLanguage]}
                    onChange={(value) => setSelectedBlog({
                      ...selectedBlog,
                      content: { ...selectedBlog.content, [editLanguage]: value }
                    })}
                    placeholder="Write your blog content here..."
                    dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="featuredImage"
                      value={selectedBlog.featuredImage}
                      onChange={(e) => setSelectedBlog({ ...selectedBlog, featuredImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      data-testid="input-featured-image"
                    />
                    <Button variant="outline" size="icon" data-testid="button-browse-image">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedBlog.featuredImage && (
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img 
                        src={selectedBlog.featuredImage} 
                        alt="Featured" 
                        className="w-full h-40 object-cover"
                        data-testid="img-featured-preview"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>Configure blog post metadata and publishing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={selectedBlog.author}
                      onChange={(e) => setSelectedBlog({ ...selectedBlog, author: e.target.value })}
                      placeholder="Author name"
                      data-testid="input-author"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedBlog.category}
                      onValueChange={(value) => setSelectedBlog({ ...selectedBlog, category: value })}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Analysis">Analysis</SelectItem>
                        <SelectItem value="Strategy">Strategy</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Tips">Tips</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedBlog.status}
                      onValueChange={(value: BlogStatus) => setSelectedBlog({ ...selectedBlog, status: value })}
                    >
                      <SelectTrigger data-testid="select-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <Input
                      id="featuredImage"
                      value={selectedBlog.featuredImage}
                      onChange={(e) => setSelectedBlog({ ...selectedBlog, featuredImage: e.target.value })}
                      placeholder="/images/blog-image.jpg"
                      data-testid="input-featuredimage"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={selectedBlog.tags.join(', ')}
                    onChange={(e) => setSelectedBlog({
                      ...selectedBlog,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    })}
                    placeholder="investing, stocks, tips"
                    data-testid="input-tags"
                  />
                </div>
              </CardContent>
            </Card>

            {!isCreatingNew && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-primary" />
                    Content Distribution
                  </CardTitle>
                  <CardDescription>
                    Use "Publish Everywhere" to create content across all channels at once
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${storiesByBlogId[selectedBlog.id] ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                        <BookOpen className={`h-5 w-5 ${storiesByBlogId[selectedBlog.id] ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Story</p>
                        <p className="text-xs text-muted-foreground">
                          {storiesByBlogId[selectedBlog.id] ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Created
                            </span>
                          ) : 'Will be created'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${spotlightsByBlogId[selectedBlog.id] ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                        <Megaphone className={`h-5 w-5 ${spotlightsByBlogId[selectedBlog.id] ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Spotlight</p>
                        <p className="text-xs text-muted-foreground">
                          {spotlightsByBlogId[selectedBlog.id] ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Created
                            </span>
                          ) : 'Will be created'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${newslettersByBlogId[selectedBlog.id] ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                        <Newspaper className={`h-5 w-5 ${newslettersByBlogId[selectedBlog.id] ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Newsletter</p>
                        <p className="text-xs text-muted-foreground">
                          {newslettersByBlogId[selectedBlog.id] ? (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Created
                            </span>
                          ) : 'Will be created'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your blog post for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title ({editLanguage.toUpperCase()})</Label>
                  <Input
                    id="seoTitle"
                    value={selectedBlog.seoTitle[editLanguage]}
                    onChange={(e) => setSelectedBlog({
                      ...selectedBlog,
                      seoTitle: { ...selectedBlog.seoTitle, [editLanguage]: e.target.value }
                    })}
                    placeholder="SEO optimized title..."
                    data-testid="input-seotitle"
                  />
                  <p className="text-xs text-muted-foreground">{selectedBlog.seoTitle[editLanguage].length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description ({editLanguage.toUpperCase()})</Label>
                  <Textarea
                    id="seoDescription"
                    value={selectedBlog.seoDescription[editLanguage]}
                    onChange={(e) => setSelectedBlog({
                      ...selectedBlog,
                      seoDescription: { ...selectedBlog.seoDescription, [editLanguage]: e.target.value }
                    })}
                    placeholder="Meta description for search results..."
                    rows={3}
                    data-testid="input-seodescription"
                  />
                  <p className="text-xs text-muted-foreground">{selectedBlog.seoDescription[editLanguage].length}/160 characters</p>
                </div>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Search Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer">
                        {selectedBlog.seoTitle[editLanguage] || 'Page Title'}
                      </div>
                      <div className="text-green-700 dark:text-green-500 text-sm">
                        baraka.com/blog/{selectedBlog.slug || 'your-blog-slug'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedBlog.seoDescription[editLanguage] || 'Your meta description will appear here...'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-blog">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-blog"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-filter-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No blog posts found. Click "New Post" to create one.
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden border-border/50 hover-elevate" data-testid={`card-blog-${blog.id}`}>
              <div className="flex">
                <div className="w-48 h-36 flex-shrink-0 relative">
                  {blog.featuredImage ? (
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title_en}
                      className="w-full h-full object-cover"
                      data-testid={`img-blog-${blog.id}`}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(blog.status)} data-testid={`badge-status-${blog.id}`}>
                          {blog.status}
                        </Badge>
                        <Badge variant="outline">EN</Badge>
                        <Badge variant="outline">{blog.category}</Badge>
                        {blog.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground leading-tight" data-testid={`text-blog-title-${blog.id}`}>
                        {blog.title_en}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {blog.excerpt_en}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {blog.publishedAt || blog.updatedAt}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          by {blog.author}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        {spotlightsByBlogId[blog.id] ? (
                          <Link href="/admin/spotlights">
                            <Badge variant="outline" className="cursor-pointer gap-1 text-amber-500 border-amber-500/50">
                              <Sparkles className="h-3 w-3" />
                              Spotlight
                            </Badge>
                          </Link>
                        ) : null}
                        {newslettersByBlogId[blog.id] ? (
                          <Link href="/admin/newsletters">
                            <Badge variant="outline" className="cursor-pointer gap-1 text-blue-500 border-blue-500/50">
                              <Mail className="h-3 w-3" />
                              Newsletter
                            </Badge>
                          </Link>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1">
                        {blog.status !== 'published' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handlePublishBlog(blog)}
                                disabled={createSpotlightMutation.isPending || createNewsletterMutation.isPending || updateBlogMutation.isPending}
                                data-testid={`button-publish-blog-${blog.id}`}
                              >
                                <Send className="h-4 w-4 text-green-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Publish & auto-create spotlight + newsletter</TooltipContent>
                          </Tooltip>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleEditBlog(blog)} data-testid={`button-edit-blog-${blog.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-view-blog-${blog.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-delete-blog-${blog.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Blog Post</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{blog.title_en}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" data-testid="button-cancel-delete">Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDeleteBlog(blog.id)} data-testid="button-confirm-delete">Delete</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{blogPosts.filter((b) => b.status === 'published').length}</div>
            <div className="text-sm text-muted-foreground">Published Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{blogPosts.filter((b) => b.status === 'draft').length}</div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{blogPosts.length}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
