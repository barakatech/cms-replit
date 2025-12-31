import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { type StockPage } from '@/lib/mockData';

interface StockChartPanelProps {
  stock: StockPage;
  language: 'en' | 'ar';
}

type TimeFrame = '1D' | '1W' | '1M' | '6M' | '1Y' | 'MAX';

function generateChartData(basePrice: number, timeframe: TimeFrame, isPositive: boolean): Array<{ time: string; price: number }> {
  const points: Array<{ time: string; price: number }> = [];
  let numPoints = 24;
  let volatility = 0.02;
  
  switch (timeframe) {
    case '1D':
      numPoints = 24;
      volatility = 0.005;
      break;
    case '1W':
      numPoints = 7;
      volatility = 0.015;
      break;
    case '1M':
      numPoints = 30;
      volatility = 0.025;
      break;
    case '6M':
      numPoints = 26;
      volatility = 0.04;
      break;
    case '1Y':
      numPoints = 52;
      volatility = 0.06;
      break;
    case 'MAX':
      numPoints = 60;
      volatility = 0.08;
      break;
  }

  const trend = isPositive ? 0.001 : -0.001;
  let currentPrice = basePrice * (1 - (numPoints * trend));
  
  for (let i = 0; i < numPoints; i++) {
    const randomChange = (Math.random() - 0.5) * volatility * basePrice;
    currentPrice = currentPrice + randomChange + (trend * basePrice);
    currentPrice = Math.max(currentPrice, basePrice * 0.5);
    
    let timeLabel = '';
    switch (timeframe) {
      case '1D':
        timeLabel = `${i}:00`;
        break;
      case '1W':
        timeLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7];
        break;
      case '1M':
        timeLabel = `${i + 1}`;
        break;
      case '6M':
        timeLabel = `W${i + 1}`;
        break;
      case '1Y':
        timeLabel = `W${i + 1}`;
        break;
      case 'MAX':
        timeLabel = `M${i + 1}`;
        break;
    }
    
    points.push({
      time: timeLabel,
      price: Math.round(currentPrice * 100) / 100,
    });
  }
  
  points[points.length - 1].price = basePrice;
  
  return points;
}

export function StockChartPanel({ stock, language }: StockChartPanelProps) {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
  const isRTL = language === 'ar';
  const isPositive = stock.dynamicData.change >= 0;
  
  const chartData = useMemo(() => {
    return generateChartData(stock.dynamicData.price, timeframe, isPositive);
  }, [stock.dynamicData.price, timeframe, isPositive]);

  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '6M', '1Y', 'MAX'];
  
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const yMin = minPrice - priceRange * 0.1;
  const yMax = maxPrice + priceRange * 0.1;

  const performanceValue = stock.dynamicData.performance[timeframe as keyof typeof stock.dynamicData.performance] || 0;

  return (
    <Card data-testid="stock-chart-panel">
      <CardContent className="pt-6">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm text-muted-foreground">
              {language === 'en' ? 'Performance' : 'الأداء'}
            </span>
            <span 
              className={`font-semibold ${performanceValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              data-testid="chart-performance"
            >
              {performanceValue >= 0 ? '+' : ''}{performanceValue}%
            </span>
          </div>
          
          <div className={`flex items-center gap-1 p-1 bg-muted/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setTimeframe(tf)}
                data-testid={`button-timeframe-${tf.toLowerCase()}`}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-[300px] w-full" data-testid="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[yMin, yMax]}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border rounded-lg shadow-lg p-2 text-sm">
                        <p className="font-semibold">${payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} 
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {language === 'en' 
            ? 'Past performance is not indicative of future results.' 
            : 'الأداء السابق لا يشير إلى النتائج المستقبلية.'}
        </p>
      </CardContent>
    </Card>
  );
}
