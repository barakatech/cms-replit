import { useState } from 'react';
import LivePreview from '@/components/LivePreview';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStocks } from '@/lib/mockData';

export default function LivePreviewExample() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-background">
        <h3 className="font-semibold">Live Preview Example</h3>
        <Tabs value={lang} onValueChange={(v) => setLang(v as 'en' | 'ar')}>
          <TabsList>
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="ar">AR</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 overflow-auto bg-muted/20">
        <LivePreview stock={mockStocks[0]} language={lang} />
      </div>
    </div>
  );
}
