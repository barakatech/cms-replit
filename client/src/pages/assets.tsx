import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Upload, Image, FileText, Video } from 'lucide-react';
import { mockAssets, type Asset } from '@/lib/mockData';

export default function Assets() {
  const [assets] = useState<Asset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-12 w-12 text-muted-foreground" />;
      case 'video':
        return <Video className="h-12 w-12 text-muted-foreground" />;
      case 'document':
        return <FileText className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Asset Library</h1>
          <p className="text-muted-foreground mt-1">Manage images, videos, and documents</p>
        </div>
        <Button data-testid="button-upload">
          <Upload className="h-4 w-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <Card
            key={asset.id}
            className="cursor-pointer hover-elevate transition-all"
            onClick={() => setSelectedAsset(asset)}
            data-testid={`card-asset-${asset.id}`}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-3 text-4xl">
                {asset.thumbnail}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium truncate" data-testid={`text-filename-${asset.id}`}>
                  {asset.fileName}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs no-default-hover-elevate">
                    {asset.type}
                  </Badge>
                  <Badge
                    className={`text-xs no-default-hover-elevate ${
                      asset.isPublic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {asset.isPublic ? 'Public' : 'Restricted'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <SheetContent className="w-96">
          {selectedAsset && (
            <>
              <SheetHeader>
                <SheetTitle>Asset Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-6xl">
                  {selectedAsset.thumbnail}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">File Name</Label>
                    <p className="font-medium">{selectedAsset.fileName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <p className="font-medium capitalize">{selectedAsset.type}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Upload Date</Label>
                    <p className="font-medium">{selectedAsset.uploadDate}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alt-en">Alt Text (EN)</Label>
                    <Input
                      id="alt-en"
                      value={selectedAsset.altText.en}
                      onChange={(e) =>
                        setSelectedAsset({
                          ...selectedAsset,
                          altText: { ...selectedAsset.altText, en: e.target.value },
                        })
                      }
                      data-testid="input-alt-en"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alt-ar">Alt Text (AR)</Label>
                    <Input
                      id="alt-ar"
                      value={selectedAsset.altText.ar}
                      onChange={(e) =>
                        setSelectedAsset({
                          ...selectedAsset,
                          altText: { ...selectedAsset.altText, ar: e.target.value },
                        })
                      }
                      dir="rtl"
                      className="text-right"
                      data-testid="input-alt-ar"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
