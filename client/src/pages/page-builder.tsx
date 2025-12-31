import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { 
  Save, Eye, Globe, Smartphone, Monitor, ChevronLeft, Trash2, Copy, 
  GripVertical, Plus, Settings, Send, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';
import type { LandingPage, LandingPageSection, LandingPageSectionType } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SectionPreview } from '@/components/landing-page/SectionPreview';

const sectionTypes: { type: LandingPageSectionType; name: string; description: string; icon: string }[] = [
  { type: 'hero', name: 'Hero', description: 'Main headline with CTA', icon: 'layout' },
  { type: 'valueProps', name: 'Value Props', description: '3-6 benefit cards', icon: 'sparkles' },
  { type: 'features', name: 'Features', description: 'Feature list with images', icon: 'list' },
  { type: 'socialProof', name: 'Social Proof', description: 'Logos & testimonials', icon: 'users' },
  { type: 'pricing', name: 'Pricing', description: 'Pricing plans table', icon: 'creditCard' },
  { type: 'offerBannerRail', name: 'Offer Banner Rail', description: 'Promotional banners', icon: 'tag' },
  { type: 'content', name: 'Content', description: 'Rich text content', icon: 'fileText' },
  { type: 'faq', name: 'FAQ', description: 'Question & answer list', icon: 'helpCircle' },
  { type: 'leadForm', name: 'Lead Form', description: 'Contact form', icon: 'mail' },
  { type: 'newsletter', name: 'Newsletter', description: 'Email signup', icon: 'newspaper' },
  { type: 'footerCta', name: 'Footer CTA', description: 'Final call to action', icon: 'arrowRight' },
];

export default function PageBuilder() {
  const [, params] = useRoute('/admin/pages/:id/edit');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const pageId = params?.id;
  
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [localPage, setLocalPage] = useState<LandingPage | null>(null);

  const { data: page, isLoading } = useQuery<LandingPage>({
    queryKey: ['/api/landing-pages', pageId],
    enabled: !!pageId,
  });

  useEffect(() => {
    if (page && !localPage) {
      setLocalPage(page);
    }
  }, [page, localPage]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<LandingPage>) => {
      const res = await apiRequest('PUT', `/api/landing-pages/${pageId}`, data);
      return res.json() as Promise<LandingPage>;
    },
    onSuccess: (updated: LandingPage) => {
      setLocalPage(updated);
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      toast({ title: 'Saved', description: 'Changes saved successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/landing-pages/${pageId}/publish`);
      return res.json() as Promise<LandingPage>;
    },
    onSuccess: (updated: LandingPage) => {
      setLocalPage(updated);
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      toast({ title: 'Published', description: 'Page is now live!' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to publish', variant: 'destructive' });
    },
  });

  const handleSave = () => {
    if (!localPage) return;
    saveMutation.mutate(localPage);
  };

  const sections = localPage?.localeContent[locale]?.sections || [];
  const selectedSection = sections.find(s => s.id === selectedSectionId);

  const updateSection = (sectionId: string, updates: Partial<LandingPageSection>) => {
    if (!localPage) return;
    
    const updatedSections = sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    );
    
    setLocalPage({
      ...localPage,
      localeContent: {
        ...localPage.localeContent,
        [locale]: {
          ...localPage.localeContent[locale],
          sections: updatedSections as LandingPageSection[],
        },
      },
    });
  };

  const addSection = (type: LandingPageSectionType) => {
    if (!localPage) return;
    
    const newSection: LandingPageSection = {
      id: `section-${Date.now()}`,
      type,
      enabled: true,
      order: sections.length,
      data: getDefaultSectionData(type),
    } as LandingPageSection;
    
    const updatedSections = [...sections, newSection];
    
    setLocalPage({
      ...localPage,
      localeContent: {
        ...localPage.localeContent,
        [locale]: {
          ...localPage.localeContent[locale],
          sections: updatedSections as LandingPageSection[],
        },
      },
    });
    
    setSelectedSectionId(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    if (!localPage) return;
    
    const updatedSections = sections.filter(s => s.id !== sectionId);
    
    setLocalPage({
      ...localPage,
      localeContent: {
        ...localPage.localeContent,
        [locale]: {
          ...localPage.localeContent[locale],
          sections: updatedSections as LandingPageSection[],
        },
      },
    });
    
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!localPage) return;
    
    const index = sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...sections];
    [updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]];
    updatedSections.forEach((s, i) => s.order = i);
    
    setLocalPage({
      ...localPage,
      localeContent: {
        ...localPage.localeContent,
        [locale]: {
          ...localPage.localeContent[locale],
          sections: updatedSections as LandingPageSection[],
        },
      },
    });
  };

  if (isLoading || !localPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading builder...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pages')} data-testid="button-back">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold" data-testid="text-page-title">{localPage.localeContent.en.title || 'Untitled Page'}</h1>
            <p className="text-xs text-muted-foreground">/p/{localPage.slug}</p>
          </div>
          <Badge variant={localPage.status === 'published' ? 'default' : 'secondary'}>
            {localPage.status}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Locale Toggle */}
          <Tabs value={locale} onValueChange={(v) => setLocale(v as 'en' | 'ar')}>
            <TabsList>
              <TabsTrigger value="en" data-testid="tab-locale-en">EN</TabsTrigger>
              <TabsTrigger value="ar" data-testid="tab-locale-ar">AR</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Device Preview */}
          <div className="flex items-center border rounded-md">
            <Button 
              variant={devicePreview === 'desktop' ? 'secondary' : 'ghost'} 
              size="icon"
              onClick={() => setDevicePreview('desktop')}
              data-testid="button-preview-desktop"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={devicePreview === 'mobile' ? 'secondary' : 'ghost'} 
              size="icon"
              onClick={() => setDevicePreview('mobile')}
              data-testid="button-preview-mobile"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button variant="outline" onClick={() => window.open(`/p/${localPage.slug}/preview`, '_blank')} data-testid="button-preview">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          <Button variant="outline" onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save">
            <Save className="mr-2 h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          
          <Button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending} data-testid="button-publish">
            <Send className="mr-2 h-4 w-4" />
            {publishMutation.isPending ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Sections Library */}
        <div className="w-64 border-r bg-card">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </h3>
          </div>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2 space-y-1">
              {sectionTypes.map((st) => (
                <Button
                  key={st.type}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => addSection(st.type)}
                  data-testid={`button-add-${st.type}`}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{st.name}</span>
                    <span className="text-xs text-muted-foreground">{st.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Canvas Preview */}
        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div 
            className={`mx-auto bg-background rounded-lg shadow-lg overflow-hidden transition-all ${
              devicePreview === 'mobile' ? 'max-w-[375px]' : 'max-w-[1200px]'
            }`}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No sections yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Click "Add Section" in the left panel to start building your page.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {sections.sort((a, b) => a.order - b.order).map((section) => (
                  <div 
                    key={section.id}
                    className={`relative group cursor-pointer ${!section.enabled ? 'opacity-50' : ''} ${
                      selectedSectionId === section.id ? 'ring-2 ring-primary ring-inset' : ''
                    }`}
                    onClick={() => setSelectedSectionId(section.id)}
                    data-testid={`section-${section.id}`}
                  >
                    {/* Section Controls */}
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); updateSection(section.id, { enabled: !section.enabled }); }}
                      >
                        {section.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Section Type Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur text-xs">
                        {section.type}
                      </Badge>
                    </div>
                    
                    {/* Section Preview */}
                    <SectionPreview section={section} locale={locale} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties Editor */}
        <div className="w-80 border-l bg-card">
          <Tabs defaultValue="section" className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="section">Section</TabsTrigger>
              <TabsTrigger value="page">Page Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <TabsContent value="section" className="p-4 space-y-4 mt-0">
                {selectedSection ? (
                  <SectionEditor 
                    section={selectedSection} 
                    locale={locale}
                    onUpdate={(updates) => updateSection(selectedSection.id, updates)}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select a section to edit its properties</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="page" className="p-4 space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Page Title ({locale.toUpperCase()})</Label>
                  <Input
                    value={localPage.localeContent[locale].title}
                    onChange={(e) => setLocalPage({
                      ...localPage,
                      localeContent: {
                        ...localPage.localeContent,
                        [locale]: { ...localPage.localeContent[locale], title: e.target.value },
                      },
                    })}
                    data-testid="input-page-title-edit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description ({locale.toUpperCase()})</Label>
                  <Textarea
                    value={localPage.localeContent[locale].description}
                    onChange={(e) => setLocalPage({
                      ...localPage,
                      localeContent: {
                        ...localPage.localeContent,
                        [locale]: { ...localPage.localeContent[locale], description: e.target.value },
                      },
                    })}
                    rows={3}
                    data-testid="input-page-description"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Header Variant</Label>
                  <Select 
                    value={localPage.settings.headerVariant} 
                    onValueChange={(v) => setLocalPage({
                      ...localPage,
                      settings: { ...localPage.settings, headerVariant: v as 'default' | 'minimal' | 'hidden' },
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Footer Variant</Label>
                  <Select 
                    value={localPage.settings.footerVariant} 
                    onValueChange={(v) => setLocalPage({
                      ...localPage,
                      settings: { ...localPage.settings, footerVariant: v as 'default' | 'minimal' | 'hidden' },
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="p-4 space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Meta Title ({locale.toUpperCase()})</Label>
                  <Input
                    value={localPage.localeContent[locale].seo.metaTitle}
                    onChange={(e) => setLocalPage({
                      ...localPage,
                      localeContent: {
                        ...localPage.localeContent,
                        [locale]: { 
                          ...localPage.localeContent[locale], 
                          seo: { ...localPage.localeContent[locale].seo, metaTitle: e.target.value } 
                        },
                      },
                    })}
                    data-testid="input-meta-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description ({locale.toUpperCase()})</Label>
                  <Textarea
                    value={localPage.localeContent[locale].seo.metaDescription}
                    onChange={(e) => setLocalPage({
                      ...localPage,
                      localeContent: {
                        ...localPage.localeContent,
                        [locale]: { 
                          ...localPage.localeContent[locale], 
                          seo: { ...localPage.localeContent[locale].seo, metaDescription: e.target.value } 
                        },
                      },
                    })}
                    rows={3}
                    data-testid="input-meta-description"
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Index Page</Label>
                  <Switch
                    checked={localPage.localeContent[locale].seo.robotsIndex}
                    onCheckedChange={(checked) => setLocalPage({
                      ...localPage,
                      localeContent: {
                        ...localPage.localeContent,
                        [locale]: { 
                          ...localPage.localeContent[locale], 
                          seo: { ...localPage.localeContent[locale].seo, robotsIndex: checked } 
                        },
                      },
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Follow Links</Label>
                  <Switch
                    checked={localPage.localeContent[locale].seo.robotsFollow}
                    onCheckedChange={(checked) => setLocalPage({
                      ...localPage,
                      localeContent: {
                        ...localPage.localeContent,
                        [locale]: { 
                          ...localPage.localeContent[locale], 
                          seo: { ...localPage.localeContent[locale].seo, robotsFollow: checked } 
                        },
                      },
                    })}
                  />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Section Editor Component
function SectionEditor({ 
  section, 
  locale, 
  onUpdate 
}: { 
  section: LandingPageSection; 
  locale: 'en' | 'ar';
  onUpdate: (updates: Partial<LandingPageSection>) => void;
}) {
  const updateData = (key: string, value: any) => {
    onUpdate({
      data: {
        ...section.data,
        [key]: value,
      },
    } as Partial<LandingPageSection>);
  };

  const data = section.data as any;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize">{section.type} Section</h3>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Enabled</Label>
          <Switch
            checked={section.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          />
        </div>
      </div>
      
      <Separator />
      
      {/* Dynamic fields based on section type */}
      {section.type === 'hero' && (
        <>
          <div className="space-y-2">
            <Label>Eyebrow Text</Label>
            <Input
              value={data.eyebrowText?.[locale] || ''}
              onChange={(e) => updateData('eyebrowText', { ...data.eyebrowText, [locale]: e.target.value })}
              placeholder="e.g., Limited Time Offer"
            />
          </div>
          <div className="space-y-2">
            <Label>Headline</Label>
            <Textarea
              value={data.headline?.[locale] || ''}
              onChange={(e) => updateData('headline', { ...data.headline, [locale]: e.target.value })}
              placeholder="Main headline text"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Subheadline</Label>
            <Textarea
              value={data.subheadline?.[locale] || ''}
              onChange={(e) => updateData('subheadline', { ...data.subheadline, [locale]: e.target.value })}
              placeholder="Supporting text"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA Text</Label>
            <Input
              value={data.primaryCTA?.text?.[locale] || ''}
              onChange={(e) => updateData('primaryCTA', { 
                ...data.primaryCTA, 
                text: { ...data.primaryCTA?.text, [locale]: e.target.value } 
              })}
              placeholder="Get Started"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary CTA URL</Label>
            <Input
              value={data.primaryCTA?.url || ''}
              onChange={(e) => updateData('primaryCTA', { ...data.primaryCTA, url: e.target.value })}
              placeholder="/signup"
            />
          </div>
        </>
      )}
      
      {section.type === 'valueProps' && (
        <>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={data.title?.[locale] || ''}
              onChange={(e) => updateData('title', { ...data.title, [locale]: e.target.value })}
              placeholder="Why Choose Us?"
            />
          </div>
          <Separator />
          <Label>Value Cards</Label>
          <p className="text-xs text-muted-foreground">Edit the cards in the preview by clicking on them</p>
        </>
      )}
      
      {section.type === 'faq' && (
        <>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={data.title?.[locale] || ''}
              onChange={(e) => updateData('title', { ...data.title, [locale]: e.target.value })}
              placeholder="Frequently Asked Questions"
            />
          </div>
        </>
      )}
      
      {section.type === 'content' && (
        <>
          <div className="space-y-2">
            <Label>Title (Optional)</Label>
            <Input
              value={data.title?.[locale] || ''}
              onChange={(e) => updateData('title', { ...data.title, [locale]: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={data.richText?.[locale] || ''}
              onChange={(e) => updateData('richText', { ...data.richText, [locale]: e.target.value })}
              rows={6}
              placeholder="Enter your content here..."
            />
          </div>
        </>
      )}
      
      {section.type === 'newsletter' && (
        <>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={data.title?.[locale] || ''}
              onChange={(e) => updateData('title', { ...data.title, [locale]: e.target.value })}
              placeholder="Stay Updated"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={data.subtitle?.[locale] || ''}
              onChange={(e) => updateData('subtitle', { ...data.subtitle, [locale]: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={data.buttonText?.[locale] || ''}
              onChange={(e) => updateData('buttonText', { ...data.buttonText, [locale]: e.target.value })}
              placeholder="Subscribe"
            />
          </div>
        </>
      )}
      
      {section.type === 'footerCta' && (
        <>
          <div className="space-y-2">
            <Label>Headline</Label>
            <Textarea
              value={data.headline?.[locale] || ''}
              onChange={(e) => updateData('headline', { ...data.headline, [locale]: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Supporting Text</Label>
            <Textarea
              value={data.supportingText?.[locale] || ''}
              onChange={(e) => updateData('supportingText', { ...data.supportingText, [locale]: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              value={data.cta?.text?.[locale] || ''}
              onChange={(e) => updateData('cta', { 
                ...data.cta, 
                text: { ...data.cta?.text, [locale]: e.target.value } 
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>CTA URL</Label>
            <Input
              value={data.cta?.url || ''}
              onChange={(e) => updateData('cta', { ...data.cta, url: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Default section data helper
function getDefaultSectionData(type: LandingPageSectionType): any {
  switch (type) {
    case 'hero':
      return {
        headline: { en: 'Your Headline Here', ar: 'عنوانك هنا' },
        subheadline: { en: 'Supporting text goes here', ar: 'النص الداعم يذهب هنا' },
        primaryCTA: { text: { en: 'Get Started', ar: 'ابدأ الآن' }, url: '/signup', variant: 'primary' },
      };
    case 'valueProps':
      return {
        title: { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
        cards: [
          { icon: 'Zap', title: { en: 'Fast', ar: 'سريع' }, description: { en: 'Lightning fast experience', ar: 'تجربة سريعة كالبرق' } },
          { icon: 'Shield', title: { en: 'Secure', ar: 'آمن' }, description: { en: 'Bank-level security', ar: 'أمان على مستوى البنوك' } },
          { icon: 'Heart', title: { en: 'Trusted', ar: 'موثوق' }, description: { en: 'Loved by millions', ar: 'محبوب من الملايين' } },
        ],
      };
    case 'faq':
      return {
        title: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
        items: [
          { question: { en: 'Sample Question?', ar: 'سؤال نموذجي؟' }, answer: { en: 'Sample answer goes here.', ar: 'الإجابة النموذجية تذهب هنا.' } },
        ],
      };
    case 'content':
      return {
        richText: { en: '<p>Your content here...</p>', ar: '<p>المحتوى الخاص بك هنا...</p>' },
      };
    case 'newsletter':
      return {
        title: { en: 'Stay Updated', ar: 'ابقَ على اطلاع' },
        subtitle: { en: 'Get the latest news and updates', ar: 'احصل على آخر الأخبار والتحديثات' },
        buttonText: { en: 'Subscribe', ar: 'اشترك' },
      };
    case 'footerCta':
      return {
        headline: { en: 'Ready to Get Started?', ar: 'مستعد للبدء؟' },
        cta: { text: { en: 'Sign Up Now', ar: 'سجل الآن' }, url: '/signup', variant: 'primary' },
      };
    case 'features':
      return {
        title: { en: 'Features', ar: 'الميزات' },
        features: [
          { title: { en: 'Feature 1', ar: 'الميزة 1' }, description: { en: 'Description', ar: 'الوصف' } },
        ],
      };
    case 'socialProof':
      return {
        title: { en: 'Trusted By', ar: 'موثوق من قبل' },
        logos: [],
      };
    case 'pricing':
      return {
        title: { en: 'Pricing', ar: 'الأسعار' },
        plans: [],
        complianceNote: { en: '', ar: '' },
      };
    case 'offerBannerRail':
      return {
        positionKey: 'landing_offers_rail',
      };
    case 'leadForm':
      return {
        title: { en: 'Get in Touch', ar: 'تواصل معنا' },
        fields: { name: true, email: true, phone: false, country: false },
        submitText: { en: 'Submit', ar: 'إرسال' },
        successMessage: { en: 'Thank you!', ar: 'شكرًا لك!' },
        formKey: 'contact',
      };
    default:
      return {};
  }
}