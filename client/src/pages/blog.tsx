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
import { mockBlogs, type BlogPost, type BlogStatus } from '@/lib/mockData';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock, User, Tag, ArrowLeft, Globe, Image, Sparkles, Mail, Send, ExternalLink, Check } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import type { SpotlightBanner, Newsletter } from '@shared/schema';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLanguage, setEditLanguage] = useState<'en' | 'ar'>('en');
  const { toast } = useToast();

  const { data: spotlights = [] } = useQuery<SpotlightBanner[]>({
    queryKey: ['/api/spotlights'],
  });

  const { data: newsletters = [] } = useQuery<Newsletter[]>({
    queryKey: ['/api/newsletters'],
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

  const createSpotlightMutation = useMutation({
    mutationFn: async (blog: BlogPost) => {
      const response = await apiRequest('POST', '/api/spotlights', {
        title: blog.title.en,
        subtitle: blog.excerpt.en.slice(0, 90),
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
        subject: blog.title.en,
        preheader: blog.excerpt.en.slice(0, 120),
        templateId: '1',
        contentBlocks: [
          { type: 'hero' as const, title: blog.title.en, imageUrl: blog.featuredImage || '', ctaText: 'Read Article', ctaUrl: `/blog/${blog.slug}` },
          { type: 'intro' as const, content: blog.excerpt.en },
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

  const handlePublishBlog = async (blog: BlogPost) => {
    const existingSpotlight = spotlightsByBlogId[blog.id];
    const existingNewsletter = newslettersByBlogId[blog.id];
    
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, status: 'published' as BlogStatus, publishDate: new Date().toISOString().split('T')[0] } : b));
    
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

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.title.ar.includes(searchQuery) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
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
    setSelectedBlog({ ...blog });
    setIsEditing(true);
  };

  const handleSaveBlog = () => {
    if (selectedBlog) {
      setBlogs(blogs.map((b) => (b.id === selectedBlog.id ? selectedBlog : b)));
      setIsEditing(false);
      setSelectedBlog(null);
    }
  };

  const handleDeleteBlog = (id: string) => {
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  const handleCreateNew = () => {
    const newBlog: BlogPost = {
      id: `new-${Date.now()}`,
      slug: '',
      title: { en: '', ar: '' },
      excerpt: { en: '', ar: '' },
      content: { en: '', ar: '' },
      author: '',
      category: '',
      tags: [],
      featuredImage: '',
      status: 'draft',
      publishDate: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      readTime: 0,
      seoTitle: { en: '', ar: '' },
      seoDescription: { en: '', ar: '' },
    };
    setSelectedBlog(newBlog);
    setIsEditing(true);
  };

  const isNewPost = selectedBlog?.id.startsWith('new-');

  if (isEditing && selectedBlog) {
    return (
      <div className="p-6 space-y-6" dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setSelectedBlog(null); }} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{isNewPost ? 'New Blog Post' : 'Edit Blog Post'}</h1>
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
            <Button onClick={handleSaveBlog} data-testid="button-save-blog">Save Changes</Button>
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
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      value={selectedBlog.readTime}
                      onChange={(e) => setSelectedBlog({ ...selectedBlog, readTime: parseInt(e.target.value) || 0 })}
                      data-testid="input-readtime"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={selectedBlog.publishDate}
                      onChange={(e) => setSelectedBlog({ ...selectedBlog, publishDate: e.target.value })}
                      data-testid="input-publishdate"
                    />
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="overflow-hidden border-border/50 hover-elevate" data-testid={`card-blog-${blog.id}`}>
            <div className="flex">
              <div className="w-48 h-36 flex-shrink-0 relative">
                {blog.featuredImage ? (
                  <img 
                    src={blog.featuredImage} 
                    alt={blog.title.en}
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
                      {blog.title.en}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {blog.excerpt.en}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {blog.publishDate || blog.lastUpdated}
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
                              disabled={createSpotlightMutation.isPending || createNewsletterMutation.isPending}
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
                              Are you sure you want to delete "{blog.title.en}"? This action cannot be undone.
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
        ))}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No blog posts found
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{blogs.filter((b) => b.status === 'published').length}</div>
            <div className="text-sm text-muted-foreground">Published Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{blogs.filter((b) => b.status === 'draft').length}</div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{blogs.length}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
