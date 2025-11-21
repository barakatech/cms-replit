import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { type StockPage } from '@/lib/mockData';

interface DynamicDataDisplayProps {
  stock: StockPage;
}

interface PriceChartProps {
  price: number;
  ticker: string;
}

function PriceChart({ price, ticker }: PriceChartProps) {
  // Generate mock historical data points (30 days)
  const generateHistoricalData = () => {
    const data: { date: string; price: number }[] = [];
    const today = new Date();
    const basePrice = price;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic price variation
      const variation = (Math.random() - 0.5) * (basePrice * 0.15);
      const dayPrice = basePrice + variation - (i * 0.3);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.max(dayPrice, basePrice * 0.85),
      });
    }
    
    return data;
  };

  const data = generateHistoricalData();
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  
  // SVG dimensions
  const width = 800;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Calculate points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.price - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  // Create area fill points
  const areaPoints = `${padding.left},${padding.top + chartHeight} ${points} ${padding.left + chartWidth},${padding.top + chartHeight}`;
  
  // Y-axis labels
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const value = minPrice + (priceRange * i / (yTicks - 1));
    return {
      y: padding.top + chartHeight - (i / (yTicks - 1)) * chartHeight,
      value: value.toFixed(2),
    };
  });
  
  // X-axis labels (show every 5th day)
  const xLabels = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  return (
    <div className="w-full">
      <div className="text-sm font-medium mb-2">30-Day Price Chart - ${price.toFixed(2)}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={label.y}
              x2={width - padding.right}
              y2={label.y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          </g>
        ))}
        
        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={label.y}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            ${label.value}
          </text>
        ))}
        
        {/* Area fill */}
        <polygon
          points={areaPoints}
          fill="url(#priceGradient)"
          opacity="0.2"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = padding.left + (i / (data.length - 1)) * chartWidth;
          const y = padding.top + chartHeight - ((d.price - minPrice) / priceRange) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--primary))"
              className="opacity-0 hover:opacity-100 transition-opacity"
            >
              <title>{d.date}: ${d.price.toFixed(2)}</title>
            </circle>
          );
        })}
        
        {/* X-axis labels */}
        {xLabels.map((d, i) => {
          const index = data.indexOf(d);
          const x = padding.left + (index / (data.length - 1)) * chartWidth;
          return (
            <text
              key={i}
              x={x}
              y={height - 5}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {d.date}
            </text>
          );
        })}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
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
          <div className="mt-6 bg-muted/50 rounded-lg p-4">
            <PriceChart price={dynamicData.price} ticker={stock.ticker} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
