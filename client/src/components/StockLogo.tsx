import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockLogoProps {
  ticker: string;
  companyName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallbackIcon?: boolean;
}

const tickerToDomain: Record<string, string> = {
  'AAPL': 'apple.com',
  'MSFT': 'microsoft.com',
  'GOOGL': 'google.com',
  'GOOG': 'google.com',
  'AMZN': 'amazon.com',
  'META': 'meta.com',
  'TSLA': 'tesla.com',
  'NVDA': 'nvidia.com',
  'JPM': 'jpmorganchase.com',
  'V': 'visa.com',
  'JNJ': 'jnj.com',
  'WMT': 'walmart.com',
  'PG': 'pg.com',
  'MA': 'mastercard.com',
  'UNH': 'unitedhealthgroup.com',
  'HD': 'homedepot.com',
  'DIS': 'thewaltdisneycompany.com',
  'PYPL': 'paypal.com',
  'BAC': 'bankofamerica.com',
  'NFLX': 'netflix.com',
  'ADBE': 'adobe.com',
  'CRM': 'salesforce.com',
  'INTC': 'intel.com',
  'AMD': 'amd.com',
  'CSCO': 'cisco.com',
  'PEP': 'pepsico.com',
  'KO': 'coca-colacompany.com',
  'NKE': 'nike.com',
  'MRK': 'merck.com',
  'ABT': 'abbott.com',
  'TMO': 'thermofisher.com',
  'COST': 'costco.com',
  'AVGO': 'broadcom.com',
  'TXN': 'ti.com',
  'QCOM': 'qualcomm.com',
  'HON': 'honeywell.com',
  'LOW': 'lowes.com',
  'ORCL': 'oracle.com',
  'IBM': 'ibm.com',
  'GE': 'ge.com',
  'CAT': 'caterpillar.com',
  'BA': 'boeing.com',
  'MMM': '3m.com',
  'GS': 'goldmansachs.com',
  'AXP': 'americanexpress.com',
  'SBUX': 'starbucks.com',
  'MCD': 'mcdonalds.com',
  'CVX': 'chevron.com',
  'XOM': 'exxonmobil.com',
  'LMT': 'lockheedmartin.com',
  'RTX': 'rtx.com',
  'UPS': 'ups.com',
  'FDX': 'fedex.com',
  'NOW': 'servicenow.com',
  'SNOW': 'snowflake.com',
  'ZM': 'zoom.us',
  'SHOP': 'shopify.com',
  'SQ': 'squareup.com',
  'UBER': 'uber.com',
  'LYFT': 'lyft.com',
  'ABNB': 'airbnb.com',
  'COIN': 'coinbase.com',
  'PLTR': 'palantir.com',
  'SNAP': 'snap.com',
  'PINS': 'pinterest.com',
  'TWTR': 'twitter.com',
  'SPOT': 'spotify.com',
  'SLB': 'slb.com',
  'T': 'att.com',
  'VZ': 'verizon.com',
  'TMUS': 't-mobile.com',
};

const sizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

const iconSizeMap = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

function getLogoUrl(ticker: string): string {
  const domain = tickerToDomain[ticker.toUpperCase()];
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  return `https://logo.clearbit.com/${ticker.toLowerCase()}.com`;
}

function getInitials(ticker: string, companyName?: string): string {
  if (companyName) {
    const words = companyName.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  }
  return ticker.substring(0, 2).toUpperCase();
}

export function StockLogo({ 
  ticker, 
  companyName, 
  size = 'md', 
  className,
  showFallbackIcon = true 
}: StockLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const logoUrl = getLogoUrl(ticker);
  const initials = getInitials(ticker, companyName);
  
  if (hasError) {
    if (showFallbackIcon) {
      return (
        <div 
          className={cn(
            sizeMap[size],
            'rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0',
            className
          )}
          data-testid={`stock-logo-fallback-${ticker}`}
        >
          <TrendingUp className={iconSizeMap[size]} />
        </div>
      );
    }
    return (
      <div 
        className={cn(
          sizeMap[size],
          'rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0',
          className
        )}
        data-testid={`stock-logo-initials-${ticker}`}
      >
        {initials}
      </div>
    );
  }
  
  return (
    <div className={cn(sizeMap[size], 'relative shrink-0', className)}>
      {isLoading && (
        <div 
          className={cn(
            sizeMap[size],
            'absolute inset-0 rounded-full bg-muted animate-pulse'
          )}
        />
      )}
      <img
        src={logoUrl}
        alt={`${companyName || ticker} logo`}
        className={cn(
          sizeMap[size],
          'rounded-full object-contain bg-white',
          isLoading && 'opacity-0'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        data-testid={`stock-logo-${ticker}`}
      />
    </div>
  );
}
