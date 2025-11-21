import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface InternalLinkingEditorProps {
  stock: StockPage;
  onChange: (stock: StockPage) => void;
}

export default function InternalLinkingEditor({ stock, onChange }: InternalLinkingEditorProps) {
  const [newTicker, setNewTicker] = useState('');

  const addManualLink = () => {
    if (newTicker.trim() && !stock.internalLinks.manual.includes(newTicker.toUpperCase())) {
      onChange({
        ...stock,
        internalLinks: {
          ...stock.internalLinks,
          manual: [...stock.internalLinks.manual, newTicker.toUpperCase()],
        },
      });
      setNewTicker('');
    }
  };

  const removeManualLink = (ticker: string) => {
    onChange({
      ...stock,
      internalLinks: {
        ...stock.internalLinks,
        manual: stock.internalLinks.manual.filter((t) => t !== ticker),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Internal Linking</h3>
        <p className="text-muted-foreground">
          Manage related stocks and cross-linking suggestions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auto Suggestions</CardTitle>
          <CardDescription>
            Automatically generated based on sector, user behavior, and market data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stock.internalLinks.autoSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                data-testid={`suggestion-${suggestion.ticker}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-sm">{suggestion.ticker}</span>
                  <Badge variant="outline" className="text-xs no-default-hover-elevate">
                    {suggestion.reason}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manual Override</CardTitle>
          <CardDescription>Add or remove related stock tickers manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="add-ticker" className="sr-only">
                Add ticker
              </Label>
              <Input
                id="add-ticker"
                placeholder="Enter ticker symbol (e.g., AAPL)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && addManualLink()}
                data-testid="input-add-ticker"
              />
            </div>
            <Button onClick={addManualLink} data-testid="button-add-ticker">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {stock.internalLinks.manual.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stock.internalLinks.manual.map((ticker) => (
                <Badge
                  key={ticker}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-mono gap-2 no-default-hover-elevate"
                  data-testid={`badge-manual-${ticker}`}
                >
                  {ticker}
                  <button
                    onClick={() => removeManualLink(ticker)}
                    className="ml-1 hover:text-destructive"
                    data-testid={`button-remove-${ticker}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
              No manual links added yet. Use the input above to add related stock tickers.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
