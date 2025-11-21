import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type StockPage } from '@/lib/mockData';

interface MetadataEditorProps {
  stock: StockPage;
  onChange: (stock: StockPage) => void;
}

export default function MetadataEditor({ stock, onChange }: MetadataEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">SEO Metadata</h3>
        <p className="text-muted-foreground">
          Configure meta tags and search engine visibility
        </p>
      </div>

      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en" data-testid="tab-metadata-en">English</TabsTrigger>
          <TabsTrigger value="ar" data-testid="tab-metadata-ar">Arabic</TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="meta-title-en">Meta Title</Label>
            <Input
              id="meta-title-en"
              value={stock.metadata.en.title}
              onChange={(e) =>
                onChange({
                  ...stock,
                  metadata: {
                    ...stock.metadata,
                    en: { ...stock.metadata.en, title: e.target.value },
                  },
                })
              }
              data-testid="input-meta-title-en"
            />
            <p className="text-xs text-muted-foreground">
              {stock.metadata.en.title.length} / 60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-desc-en">Meta Description</Label>
            <Textarea
              id="meta-desc-en"
              value={stock.metadata.en.description}
              onChange={(e) =>
                onChange({
                  ...stock,
                  metadata: {
                    ...stock.metadata,
                    en: { ...stock.metadata.en, description: e.target.value },
                  },
                })
              }
              rows={3}
              data-testid="input-meta-description-en"
            />
            <p className="text-xs text-muted-foreground">
              {stock.metadata.en.description.length} / 160 characters
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ar" className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="meta-title-ar">Meta Title</Label>
            <Input
              id="meta-title-ar"
              value={stock.metadata.ar.title}
              onChange={(e) =>
                onChange({
                  ...stock,
                  metadata: {
                    ...stock.metadata,
                    ar: { ...stock.metadata.ar, title: e.target.value },
                  },
                })
              }
              dir="rtl"
              className="text-right"
              data-testid="input-meta-title-ar"
            />
            <p className="text-xs text-muted-foreground text-right" dir="rtl">
              {stock.metadata.ar.title.length} / 60 حرف
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-desc-ar">Meta Description</Label>
            <Textarea
              id="meta-desc-ar"
              value={stock.metadata.ar.description}
              onChange={(e) =>
                onChange({
                  ...stock,
                  metadata: {
                    ...stock.metadata,
                    ar: { ...stock.metadata.ar, description: e.target.value },
                  },
                })
              }
              rows={3}
              dir="rtl"
              className="text-right"
              data-testid="input-meta-description-ar"
            />
            <p className="text-xs text-muted-foreground text-right" dir="rtl">
              {stock.metadata.ar.description.length} / 160 حرف
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="indexed">Index this page</Label>
          <p className="text-sm text-muted-foreground">
            Allow search engines to index this stock page
          </p>
        </div>
        <Switch
          id="indexed"
          checked={stock.indexed}
          onCheckedChange={(checked) => onChange({ ...stock, indexed: checked })}
          data-testid="switch-indexed"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search Result Preview</CardTitle>
          <CardDescription>How this page will appear in Google search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-sm text-blue-600 hover:underline cursor-pointer">
              {stock.metadata.en.title}
            </div>
            <div className="text-xs text-green-700">
              baraka.com › stocks › {stock.ticker.toLowerCase()}
            </div>
            <div className="text-sm text-muted-foreground">{stock.metadata.en.description}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
