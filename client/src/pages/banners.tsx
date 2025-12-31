import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockBanners, type Banner, type BannerStatus, type BannerType } from '@/lib/mockData';
import { Plus, Search, Edit, Trash2, Eye, Calendar, MousePointer, BarChart3, ArrowLeft, Globe, Image, Palette } from 'lucide-react';

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLanguage, setEditLanguage] = useState<'en' | 'ar'>('en');

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch =
      banner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.title.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: BannerStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return '';
    }
  };

  const getTypeColor = (type: BannerType) => {
    switch (type) {
      case 'hero':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'promotional':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'announcement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'feature':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100';
      default:
        return '';
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setSelectedBanner({ ...banner });
    setIsEditing(true);
  };

  const handleSaveBanner = () => {
    if (selectedBanner) {
      const existingIndex = banners.findIndex((b) => b.id === selectedBanner.id);
      if (existingIndex >= 0) {
        setBanners(banners.map((b) => (b.id === selectedBanner.id ? selectedBanner : b)));
      } else {
        setBanners([...banners, selectedBanner]);
      }
      setIsEditing(false);
      setSelectedBanner(null);
    }
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  const handleCreateNew = () => {
    const newBanner: Banner = {
      id: String(Date.now()),
      name: '',
      type: 'promotional',
      title: { en: '', ar: '' },
      subtitle: { en: '', ar: '' },
      ctaText: { en: '', ar: '' },
      ctaUrl: '',
      backgroundImage: '',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      status: 'inactive',
      placement: [],
      startDate: '',
      endDate: '',
      priority: 5,
      targetAudience: 'all-users',
      clickCount: 0,
      impressions: 0,
    };
    setSelectedBanner(newBanner);
    setIsEditing(true);
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return '0.00';
    return ((clicks / impressions) * 100).toFixed(2);
  };

  if (isEditing && selectedBanner) {
    return (
      <div className="p-6 space-y-6" dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setSelectedBanner(null); }} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedBanner.name || 'New Banner'}</h1>
              <p className="text-muted-foreground">Configure banner content and display settings</p>
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
            <Button onClick={handleSaveBanner} data-testid="button-save-banner">Save Banner</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList>
                <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
                <TabsTrigger value="design" data-testid="tab-design">Design</TabsTrigger>
                <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Content</CardTitle>
                    <CardDescription>Edit banner text and call-to-action</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Banner Name (Internal)</Label>
                      <Input
                        id="name"
                        value={selectedBanner.name}
                        onChange={(e) => setSelectedBanner({ ...selectedBanner, name: e.target.value })}
                        placeholder="E.g., Summer Sale Promotion"
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title ({editLanguage.toUpperCase()})</Label>
                      <Input
                        id="title"
                        value={selectedBanner.title[editLanguage]}
                        onChange={(e) => setSelectedBanner({
                          ...selectedBanner,
                          title: { ...selectedBanner.title, [editLanguage]: e.target.value }
                        })}
                        placeholder="Enter banner headline..."
                        data-testid="input-title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Subtitle ({editLanguage.toUpperCase()})</Label>
                      <Input
                        id="subtitle"
                        value={selectedBanner.subtitle[editLanguage]}
                        onChange={(e) => setSelectedBanner({
                          ...selectedBanner,
                          subtitle: { ...selectedBanner.subtitle, [editLanguage]: e.target.value }
                        })}
                        placeholder="Supporting text..."
                        data-testid="input-subtitle"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ctaText">CTA Text ({editLanguage.toUpperCase()})</Label>
                        <Input
                          id="ctaText"
                          value={selectedBanner.ctaText[editLanguage]}
                          onChange={(e) => setSelectedBanner({
                            ...selectedBanner,
                            ctaText: { ...selectedBanner.ctaText, [editLanguage]: e.target.value }
                          })}
                          placeholder="Learn More"
                          data-testid="input-cta-text"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ctaUrl">CTA URL</Label>
                        <Input
                          id="ctaUrl"
                          value={selectedBanner.ctaUrl}
                          onChange={(e) => setSelectedBanner({ ...selectedBanner, ctaUrl: e.target.value })}
                          placeholder="/signup"
                          data-testid="input-cta-url"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Design</CardTitle>
                    <CardDescription>Customize banner appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundImage">Background Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="backgroundImage"
                          value={selectedBanner.backgroundImage}
                          onChange={(e) => setSelectedBanner({ ...selectedBanner, backgroundImage: e.target.value })}
                          placeholder="/images/banner.jpg"
                          data-testid="input-bg-image"
                        />
                        <Button variant="outline" size="icon">
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={selectedBanner.backgroundColor}
                            onChange={(e) => setSelectedBanner({ ...selectedBanner, backgroundColor: e.target.value })}
                            className="w-12 h-10 p-1 cursor-pointer"
                            data-testid="input-bg-color-picker"
                          />
                          <Input
                            value={selectedBanner.backgroundColor}
                            onChange={(e) => setSelectedBanner({ ...selectedBanner, backgroundColor: e.target.value })}
                            className="flex-1"
                            data-testid="input-bg-color-hex"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="textColor"
                            type="color"
                            value={selectedBanner.textColor}
                            onChange={(e) => setSelectedBanner({ ...selectedBanner, textColor: e.target.value })}
                            className="w-12 h-10 p-1 cursor-pointer"
                            data-testid="input-text-color-picker"
                          />
                          <Input
                            value={selectedBanner.textColor}
                            onChange={(e) => setSelectedBanner({ ...selectedBanner, textColor: e.target.value })}
                            className="flex-1"
                            data-testid="input-text-color-hex"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Configure when and where the banner appears</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Banner Type</Label>
                        <Select
                          value={selectedBanner.type}
                          onValueChange={(value: BannerType) => setSelectedBanner({ ...selectedBanner, type: value })}
                        >
                          <SelectTrigger data-testid="select-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hero">Hero</SelectItem>
                            <SelectItem value="promotional">Promotional</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="feature">Feature</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={selectedBanner.status}
                          onValueChange={(value: BannerStatus) => setSelectedBanner({ ...selectedBanner, status: value })}
                        >
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={selectedBanner.startDate}
                          onChange={(e) => setSelectedBanner({ ...selectedBanner, startDate: e.target.value })}
                          data-testid="input-start-date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={selectedBanner.endDate}
                          onChange={(e) => setSelectedBanner({ ...selectedBanner, endDate: e.target.value })}
                          data-testid="input-end-date"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority (1-10)</Label>
                        <Input
                          id="priority"
                          type="number"
                          min="1"
                          max="10"
                          value={selectedBanner.priority}
                          onChange={(e) => setSelectedBanner({ ...selectedBanner, priority: parseInt(e.target.value) || 1 })}
                          data-testid="input-priority"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <Select
                          value={selectedBanner.targetAudience}
                          onValueChange={(value) => setSelectedBanner({ ...selectedBanner, targetAudience: value })}
                        >
                          <SelectTrigger data-testid="select-audience">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-users">All Users</SelectItem>
                            <SelectItem value="new-users">New Users</SelectItem>
                            <SelectItem value="existing-users">Existing Users</SelectItem>
                            <SelectItem value="premium-users">Premium Users</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placement">Placement (comma-separated)</Label>
                      <Input
                        id="placement"
                        value={selectedBanner.placement.join(', ')}
                        onChange={(e) => setSelectedBanner({
                          ...selectedBanner,
                          placement: e.target.value.split(',').map((p) => p.trim()).filter(Boolean)
                        })}
                        placeholder="home-hero, dashboard, stock-pages"
                        data-testid="input-placement"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your banner will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="rounded-lg p-8 min-h-[200px] flex flex-col justify-center"
                  style={{
                    backgroundColor: selectedBanner.backgroundColor,
                    color: selectedBanner.textColor,
                    backgroundImage: selectedBanner.backgroundImage ? `url(${selectedBanner.backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
                >
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedBanner.title[editLanguage] || 'Banner Title'}
                  </h2>
                  <p className="text-lg opacity-90 mb-4">
                    {selectedBanner.subtitle[editLanguage] || 'Banner subtitle text goes here'}
                  </p>
                  <div>
                    <Button
                      style={{
                        backgroundColor: selectedBanner.textColor,
                        color: selectedBanner.backgroundColor,
                      }}
                    >
                      {selectedBanner.ctaText[editLanguage] || 'Call to Action'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedBanner.impressions > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Banner analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedBanner.impressions.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Impressions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedBanner.clickCount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{calculateCTR(selectedBanner.clickCount, selectedBanner.impressions)}%</div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Create and manage promotional banners</p>
        </div>
        <Button onClick={handleCreateNew} data-testid="button-create-banner">
          <Plus className="h-4 w-4 mr-2" />
          New Banner
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-banner"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-filter-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBanners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden" data-testid={`card-banner-${banner.id}`}>
            <div
              className="h-32 flex items-center justify-center p-4"
              style={{
                backgroundColor: banner.backgroundColor,
                color: banner.textColor,
                backgroundImage: banner.backgroundImage ? `url(${banner.backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              data-testid={`preview-banner-${banner.id}`}
            >
              <div className="text-center">
                <div className="font-bold text-lg" data-testid={`text-banner-title-${banner.id}`}>{banner.title.en}</div>
                <div className="text-sm opacity-80" data-testid={`text-banner-subtitle-${banner.id}`}>{banner.subtitle.en}</div>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold" data-testid={`text-banner-name-${banner.id}`}>{banner.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getTypeColor(banner.type)} data-testid={`badge-banner-type-${banner.id}`}>{banner.type}</Badge>
                    <Badge className={getStatusColor(banner.status)} data-testid={`badge-banner-status-${banner.id}`}>{banner.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditBanner(banner)} data-testid={`button-edit-banner-${banner.id}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-delete-banner-${banner.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Banner</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{banner.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" data-testid="button-cancel-delete-banner">Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteBanner(banner.id)} data-testid="button-confirm-delete-banner">Delete</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div data-testid={`text-banner-impressions-${banner.id}`}>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <BarChart3 className="h-3 w-3" />
                    Impressions
                  </div>
                  <div className="font-semibold">{banner.impressions.toLocaleString()}</div>
                </div>
                <div data-testid={`text-banner-clicks-${banner.id}`}>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <MousePointer className="h-3 w-3" />
                    Clicks
                  </div>
                  <div className="font-semibold">{banner.clickCount.toLocaleString()}</div>
                </div>
                <div data-testid={`text-banner-ctr-${banner.id}`}>
                  <div className="text-muted-foreground">CTR</div>
                  <div className="font-semibold">{calculateCTR(banner.clickCount, banner.impressions)}%</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1" data-testid={`text-banner-dates-${banner.id}`}>
                  <Calendar className="h-3 w-3" />
                  {banner.startDate} - {banner.endDate}
                </div>
                <div data-testid={`text-banner-priority-${banner.id}`}>Priority: {banner.priority}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBanners.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No banners found
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{banners.filter((b) => b.status === 'active').length}</div>
            <div className="text-sm text-muted-foreground">Active Banners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{banners.filter((b) => b.status === 'scheduled').length}</div>
            <div className="text-sm text-muted-foreground">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {banners.reduce((acc, b) => acc + b.impressions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Impressions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {banners.reduce((acc, b) => acc + b.clickCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
