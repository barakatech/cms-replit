import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Settings, 
  Sparkles, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Bell, 
  Mail, 
  Eye,
  EyeOff,
  Plus,
  X,
  GripVertical,
  Loader2
} from 'lucide-react';
import { blogCategories } from '@/lib/discoverData';
import { mockBlogs } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { DiscoverSettings, StockTheme, OfferBanner } from '@shared/schema';

export default function AdminDiscover() {
  const { toast } = useToast();
  
  const { data: fetchedSettings, isLoading } = useQuery<DiscoverSettings>({
    queryKey: ['/api/discover/settings'],
  });
  
  const { data: stockThemes = [] } = useQuery<StockTheme[]>({
    queryKey: ['/api/discover/themes'],
  });
  
  const { data: offerBanners = [] } = useQuery<OfferBanner[]>({
    queryKey: ['/api/discover/offers'],
  });
  
  const [settings, setSettings] = useState<DiscoverSettings | null>(null);
  
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (updatedSettings: DiscoverSettings): Promise<{ success: boolean; settings: DiscoverSettings }> => {
      const response = await apiRequest('PUT', '/api/discover/settings', updatedSettings);
      return response.json();
    },
    onSuccess: (data) => {
      if (data?.settings) {
        setSettings(data.settings);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/discover/settings'] });
      toast({ title: 'Settings saved successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    }
  });

  const handleSave = async () => {
    if (settings) {
      saveMutation.mutate(settings);
    }
  };

  const updateSetting = <K extends keyof DiscoverSettings>(key: K, value: DiscoverSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const toggleSectionVisibility = (section: keyof DiscoverSettings['sectionVisibility']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      sectionVisibility: {
        ...settings.sectionVisibility,
        [section]: !settings.sectionVisibility[section]
      }
    });
  };
  
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Discover Page Settings
          </h1>
          <p className="text-muted-foreground">Configure the content and layout of the /discover page</p>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending} data-testid="btn-save-settings">
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="hero" data-testid="tab-hero">Hero</TabsTrigger>
          <TabsTrigger value="themes" data-testid="tab-themes">Themes</TabsTrigger>
          <TabsTrigger value="stocks" data-testid="tab-stocks">Stocks</TabsTrigger>
          <TabsTrigger value="learn" data-testid="tab-learn">Learn</TabsTrigger>
          <TabsTrigger value="offers" data-testid="tab-offers">Offers</TabsTrigger>
          <TabsTrigger value="visibility" data-testid="tab-visibility">Visibility</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Configure the main hero area with search and quick chips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hero Title (English)</Label>
                  <Input
                    value={settings.heroTitle_en}
                    onChange={(e) => updateSetting('heroTitle_en', e.target.value)}
                    data-testid="input-hero-title-en"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Title (Arabic)</Label>
                  <Input
                    value={settings.heroTitle_ar}
                    onChange={(e) => updateSetting('heroTitle_ar', e.target.value)}
                    dir="rtl"
                    data-testid="input-hero-title-ar"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle (English)</Label>
                  <Input
                    value={settings.heroSubtitle_en}
                    onChange={(e) => updateSetting('heroSubtitle_en', e.target.value)}
                    data-testid="input-hero-subtitle-en"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle (Arabic)</Label>
                  <Input
                    value={settings.heroSubtitle_ar}
                    onChange={(e) => updateSetting('heroSubtitle_ar', e.target.value)}
                    dir="rtl"
                    data-testid="input-hero-subtitle-ar"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Chips</Label>
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/50">
                  {settings.heroChips.map((chip, i) => (
                    <div key={i} className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <span className="text-sm">{chip.label_en}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          const newChips = [...settings.heroChips];
                          newChips.splice(i, 1);
                          updateSetting('heroChips', newChips);
                        }}
                        data-testid={`remove-chip-${i}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateSetting('heroChips', [...settings.heroChips, { label_en: 'New Chip', label_ar: 'رقاقة جديدة', href: '/' }]);
                    }}
                    data-testid="add-chip"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Chip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Featured Themes
              </CardTitle>
              <CardDescription>Select which themes to feature prominently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Newly Added Theme</Label>
                  <Select
                    value={settings.featuredThemeNewSlug}
                    onValueChange={(v) => updateSetting('featuredThemeNewSlug', v)}
                  >
                    <SelectTrigger data-testid="select-theme-new">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockThemes.map((theme: StockTheme) => (
                        <SelectItem key={theme.slug} value={theme.slug}>
                          {theme.icon} {theme.title_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Theme of the Month</Label>
                  <Select
                    value={settings.featuredThemeMonthSlug}
                    onValueChange={(v) => updateSetting('featuredThemeMonthSlug', v)}
                  >
                    <SelectTrigger data-testid="select-theme-month">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockThemes.map((theme: StockTheme) => (
                        <SelectItem key={theme.slug} value={theme.slug}>
                          {theme.icon} {theme.title_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Other Themes (Grid)</Label>
                <div className="flex flex-wrap gap-2">
                  {stockThemes.map((theme: StockTheme) => {
                    const isSelected = settings.otherThemeSlugs.includes(theme.slug);
                    return (
                      <Badge
                        key={theme.slug}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (isSelected) {
                            updateSetting('otherThemeSlugs', settings.otherThemeSlugs.filter(s => s !== theme.slug));
                          } else {
                            updateSetting('otherThemeSlugs', [...settings.otherThemeSlugs, theme.slug]);
                          }
                        }}
                        data-testid={`toggle-theme-${theme.slug}`}
                      >
                        {theme.icon} {theme.title_en}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending & Featured Stocks
              </CardTitle>
              <CardDescription>Configure the stock lists for trending tabs and featured grid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.trendingTabs.map((tab, tabIndex) => (
                <div key={tab.key} className="space-y-2">
                  <Label>{tab.label_en} Tickers</Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50">
                    {tab.tickers.map((ticker, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => {
                        const newTabs = [...settings.trendingTabs];
                        newTabs[tabIndex].tickers = newTabs[tabIndex].tickers.filter((_, idx) => idx !== i);
                        updateSetting('trendingTabs', newTabs);
                      }}>
                        {ticker} ×
                      </Badge>
                    ))}
                    <Input
                      className="w-24 h-7 text-sm"
                      placeholder="Add..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.toUpperCase();
                          if (val && !tab.tickers.includes(val)) {
                            const newTabs = [...settings.trendingTabs];
                            newTabs[tabIndex].tickers.push(val);
                            updateSetting('trendingTabs', newTabs);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      data-testid={`input-add-${tab.key}`}
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <Label>Featured Stocks Grid</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50">
                  {settings.featuredTickers.map((ticker, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => {
                      updateSetting('featuredTickers', settings.featuredTickers.filter((_, idx) => idx !== i));
                    }}>
                      {ticker} ×
                    </Badge>
                  ))}
                  <Input
                    className="w-24 h-7 text-sm"
                    placeholder="Add..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.toUpperCase();
                        if (val && !settings.featuredTickers.includes(val)) {
                          updateSetting('featuredTickers', [...settings.featuredTickers, val]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    data-testid="input-add-featured"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learn" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learn Section
              </CardTitle>
              <CardDescription>Configure featured articles and categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Featured Article</Label>
                <Select
                  value={settings.learnFeaturedPostId}
                  onValueChange={(v) => updateSetting('learnFeaturedPostId', v)}
                >
                  <SelectTrigger data-testid="select-featured-post">
                    <SelectValue placeholder="Select article" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBlogs.map(post => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.title.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Secondary Articles</Label>
                <div className="flex flex-wrap gap-2">
                  {mockBlogs.filter(p => p.id !== settings.learnFeaturedPostId).map(post => {
                    const isSelected = settings.learnSecondaryPostIds.includes(post.id);
                    return (
                      <Badge
                        key={post.id}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (isSelected) {
                            updateSetting('learnSecondaryPostIds', settings.learnSecondaryPostIds.filter(id => id !== post.id));
                          } else {
                            updateSetting('learnSecondaryPostIds', [...settings.learnSecondaryPostIds, post.id]);
                          }
                        }}
                        data-testid={`toggle-post-${post.id}`}
                      >
                        {post.title.en.slice(0, 30)}...
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Featured Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map(cat => {
                    const isSelected = settings.learnCategorySlugs.includes(cat.slug);
                    return (
                      <Badge
                        key={cat.id}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (isSelected) {
                            updateSetting('learnCategorySlugs', settings.learnCategorySlugs.filter(s => s !== cat.slug));
                          } else {
                            updateSetting('learnCategorySlugs', [...settings.learnCategorySlugs, cat.slug]);
                          }
                        }}
                        data-testid={`toggle-category-${cat.slug}`}
                      >
                        {cat.name.en}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Offers & Banners
              </CardTitle>
              <CardDescription>Manage promotional banners for the discover page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offerBanners.map((banner: OfferBanner) => (
                  <div 
                    key={banner.id} 
                    className="flex items-center gap-4 p-4 border rounded-lg"
                    data-testid={`offer-item-${banner.id}`}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: banner.backgroundColor }}
                    >
                      {banner.order}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{banner.title_en}</h4>
                      <p className="text-sm text-muted-foreground">{banner.subtitle_en}</p>
                    </div>
                    <Badge variant={banner.status === 'active' ? 'default' : 'secondary'}>
                      {banner.status}
                    </Badge>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  <Bell className="h-4 w-4 inline mr-1" />
                  To add or edit banners, go to the Banners page
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settings.sectionVisibility.offers ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                Section Visibility
              </CardTitle>
              <CardDescription>Toggle which sections are visible on the discover page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'offers', label: 'Offers & Promotions', icon: Sparkles },
                  { key: 'themes', label: 'Stock Themes & Trackers', icon: Star },
                  { key: 'trending', label: 'Trending Stocks', icon: TrendingUp },
                  { key: 'featured', label: 'Featured Stocks', icon: TrendingUp },
                  { key: 'priceAlerts', label: 'Price Alerts Subscription', icon: Bell },
                  { key: 'learn', label: 'Learn Section', icon: BookOpen },
                  { key: 'newsletter', label: 'Newsletter Signup', icon: Mail },
                  { key: 'disclosures', label: 'Footer Disclosures', icon: Settings },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{label}</span>
                    </div>
                    <Switch
                      checked={settings.sectionVisibility[key as keyof DiscoverSettings['sectionVisibility']]}
                      onCheckedChange={() => toggleSectionVisibility(key as keyof DiscoverSettings['sectionVisibility'])}
                      data-testid={`toggle-visibility-${key}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
