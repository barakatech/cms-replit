import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface DynamicDataDisplayProps {
  stock: StockPage;
}

export default function DynamicDataDisplay({ stock }: DynamicDataDisplayProps) {
  const { dynamicData } = stock;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-2">Market Data</h3>
        <p className="text-muted-foreground">
          Real-time market data powered by the Market Data Service
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These values are powered by the Market Data Service and are read-only in this editor.
          Data updates automatically every few seconds during market hours.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Price</div>
            <div className="text-2xl font-bold flex items-center gap-2" data-testid="text-price">
              ${dynamicData.price.toFixed(2)}
              {dynamicData.changePercent > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div className={`text-sm mt-1 ${dynamicData.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dynamicData.change > 0 ? '+' : ''}
              {dynamicData.change.toFixed(2)} ({dynamicData.changePercent > 0 ? '+' : ''}
              {dynamicData.changePercent.toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
            <div className="text-2xl font-bold" data-testid="text-marketcap">{dynamicData.marketCap}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Volume</div>
            <div className="text-2xl font-bold" data-testid="text-volume">{dynamicData.volume}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">P/E Ratio</div>
            <div className="text-2xl font-bold" data-testid="text-pe">{dynamicData.pe}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">EPS</div>
            <div className="text-2xl font-bold" data-testid="text-eps">{dynamicData.eps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Dividend Yield</div>
            <div className="text-2xl font-bold" data-testid="text-dividend">{dynamicData.dividend}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyst Sentiment</CardTitle>
          <CardDescription>Distribution of analyst ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div
                className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${dynamicData.sentiment.buy}%` }}
              >
                {dynamicData.sentiment.buy}%
              </div>
              <div
                className="bg-yellow-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${dynamicData.sentiment.hold}%` }}
              >
                {dynamicData.sentiment.hold}%
              </div>
              <div
                className="bg-red-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${dynamicData.sentiment.sell}%` }}
              >
                {dynamicData.sentiment.sell}%
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Buy ({dynamicData.sentiment.buy}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Hold ({dynamicData.sentiment.hold}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Sell ({dynamicData.sentiment.sell}%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance</CardTitle>
          <CardDescription>Historical price performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(dynamicData.performance).map(([period, value]) => (
              <div key={period} className="text-center">
                <div className="text-sm text-muted-foreground mb-1">{period}</div>
                <div className={`text-lg font-bold ${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {value > 0 ? '+' : ''}
                  {value.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-muted/50 rounded-lg h-40 flex items-center justify-center">
            <svg className="w-full h-full p-4" viewBox="0 0 400 120">
              <polyline
                points="0,100 50,80 100,90 150,60 200,70 250,40 300,50 350,20 400,30"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              <polyline
                points="0,100 50,80 100,90 150,60 200,70 250,40 300,50 350,20 400,30"
                fill="url(#gradient)"
                opacity="0.2"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
