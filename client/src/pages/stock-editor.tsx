import { useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Send, Upload } from 'lucide-react';
import { mockStocks, type StockPage } from '@/lib/mockData';
import MetadataEditor from '@/components/MetadataEditor';
import ContentEditor from '@/components/ContentEditor';
import DynamicDataDisplay from '@/components/DynamicDataDisplay';
import InternalLinkingEditor from '@/components/InternalLinkingEditor';
import LivePreview from '@/components/LivePreview';

export default function StockEditor() {
  const [, params] = useRoute('/editor/:ticker');
  const ticker = params?.ticker || 'AAPL';
  
  const stockData = mockStocks.find((s) => s.ticker === ticker) || mockStocks[0];
  const [stock, setStock] = useState<StockPage>(stockData);
  const [activeSection, setActiveSection] = useState('metadata');
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>('en');

  const sections = [
    { id: 'metadata', label: 'Metadata' },
    { id: 'content', label: 'Content' },
    { id: 'dynamic', label: 'Dynamic Data' },
    { id: 'linking', label: 'Internal Linking' },
  ];

  const handleSave = () => {
    console.log('Saving draft:', stock);
  };

  const handleSubmitReview = () => {
    console.log('Submitting for review:', stock);
    setStock({ ...stock, status: 'in_review' });
  };

  const handlePublish = () => {
    console.log('Publishing:', stock);
    setStock({ ...stock, status: 'published' });
  };

  const getStatusColor = (status: StockPage['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-48 border-r bg-muted/30 p-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover-elevate'
              }`}
              data-testid={`button-section-${section.id}`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold" data-testid="text-stock-name">
                {stock.ticker} - {stock.companyName}
              </h2>
              <Badge className={`${getStatusColor(stock.status)} no-default-hover-elevate`} data-testid="badge-status">
                {stock.status === 'published' ? 'Published' : stock.status === 'in_review' ? 'In Review' : 'Draft'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave} data-testid="button-save-draft">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={handleSubmitReview} data-testid="button-submit-review">
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </Button>
              <Button
                onClick={handlePublish}
                disabled={stock.status !== 'in_review'}
                data-testid="button-publish"
              >
                <Upload className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {activeSection === 'metadata' && (
            <MetadataEditor stock={stock} onChange={setStock} />
          )}
          {activeSection === 'content' && (
            <ContentEditor stock={stock} onChange={setStock} />
          )}
          {activeSection === 'dynamic' && (
            <DynamicDataDisplay stock={stock} />
          )}
          {activeSection === 'linking' && (
            <InternalLinkingEditor stock={stock} onChange={setStock} />
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-2/5 border-l bg-muted/20 overflow-auto">
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Live Preview</h3>
            <Tabs value={previewLang} onValueChange={(v) => setPreviewLang(v as 'en' | 'ar')}>
              <TabsList>
                <TabsTrigger value="en" data-testid="button-preview-en">EN</TabsTrigger>
                <TabsTrigger value="ar" data-testid="button-preview-ar">AR</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <LivePreview stock={stock} language={previewLang} />
      </div>
    </div>
  );
}
