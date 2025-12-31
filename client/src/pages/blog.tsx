import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockBlogs, type BlogPost, type BlogStatus } from '@/lib/mockData';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Clock, User, Tag, ArrowLeft, Globe, Image } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLanguage, setEditLanguage] = useState<'en' | 'ar'>('en');

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id} data-testid={`row-blog-${blog.id}`}>
                  <TableCell data-testid={`text-blog-title-${blog.id}`}>
                    <div className="space-y-1">
                      <div className="font-medium">{blog.title.en}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {blog.readTime} min read
                      </div>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-blog-author-${blog.id}`}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {blog.author}
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-blog-category-${blog.id}`}>
                    <Badge variant="outline">{blog.category}</Badge>
                  </TableCell>
                  <TableCell data-testid={`text-blog-status-${blog.id}`}>
                    <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
                  </TableCell>
                  <TableCell data-testid={`text-blog-date-${blog.id}`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {blog.publishDate || blog.lastUpdated}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" data-testid={`button-view-blog-${blog.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditBlog(blog)} data-testid={`button-edit-blog-${blog.id}`}>
                        <Edit className="h-4 w-4" />
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredBlogs.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No blog posts found
            </div>
          )}
        </CardContent>
      </Card>

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
