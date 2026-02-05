import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Landmark, 
  TrendingUp, 
  Calendar, 
  Shield, 
  AlertTriangle,
  Building2,
  Percent,
  Clock,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { RichText } from '@/components/RichText';
import type { BondPage } from '@shared/schema';

export default function BondDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: bond, isLoading, error } = useQuery<BondPage>({
    queryKey: ['/api/bond-pages/slug', slug],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-64 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !bond) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Landmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Bond Not Found</h1>
        <p className="text-muted-foreground mb-6">The bond you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const riskLevelColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    very_high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-brand/10 via-background to-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <Landmark className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    {bond.instrumentType?.replace(/_/g, ' ') || 'Bond'}
                  </Badge>
                  {bond.riskLevel && (
                    <Badge className={`ml-2 ${riskLevelColors[bond.riskLevel]}`}>
                      {bond.riskLevel.replace(/_/g, ' ')} risk
                    </Badge>
                  )}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-bond-title">
                {bond.title_en}
              </h1>
              <p className="text-lg text-muted-foreground">
                Issued by {bond.issuerName_en}
              </p>
              {bond.heroSummary_en && (
                <div className="mt-4 max-w-2xl">
                  <RichText html={bond.heroSummary_en} className="text-muted-foreground" />
                </div>
              )}
            </div>

            <Card className="w-full md:w-80 shrink-0">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Yield to Maturity</p>
                  <p className="text-4xl font-bold text-brand" data-testid="text-ytm">
                    {bond.ytm ? `${bond.ytm.toFixed(2)}%` : 'N/A'}
                  </p>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coupon</p>
                    <p className="font-medium">{bond.couponRate ? `${bond.couponRate}%` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium">{bond.cleanPrice ? bond.cleanPrice.toFixed(2) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium">{bond.currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-medium">{bond.creditRatingDisplay || 'NR'}</p>
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg" data-testid="button-invest">
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-brand" />
                <span className="text-sm text-muted-foreground">Coupon Rate</span>
              </div>
              <p className="text-2xl font-bold">{bond.couponRate ? `${bond.couponRate}%` : 'Zero'}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {bond.couponFrequency?.replace(/_/g, ' ') || 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-brand" />
                <span className="text-sm text-muted-foreground">Maturity</span>
              </div>
              <p className="text-2xl font-bold">
                {bond.isPerpetual ? 'Perpetual' : formatDate(bond.maturityDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                {bond.principalRepaymentType?.replace(/_/g, ' ') || 'At Maturity'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-brand" />
                <span className="text-sm text-muted-foreground">Credit Rating</span>
              </div>
              <p className="text-2xl font-bold">{bond.creditRatingDisplay || 'NR'}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {bond.seniority?.replace(/_/g, ' ') || 'Unsecured'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-brand" />
                <span className="text-sm text-muted-foreground">Min Investment</span>
              </div>
              <p className="text-2xl font-bold">
                {bond.minInvestment ? `${bond.currency} ${bond.minInvestment.toLocaleString()}` : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                Denomination: {bond.denomination?.toLocaleString() || 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {bond.howItWorks_en && (
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichText html={bond.howItWorks_en} className="text-muted-foreground" />
                </CardContent>
              </Card>
            )}

            {(bond.duration || bond.convexity) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {bond.duration && (
                      <div>
                        <p className="text-sm text-muted-foreground">Modified Duration</p>
                        <p className="text-xl font-bold">{bond.duration.toFixed(2)}</p>
                      </div>
                    )}
                    {bond.macaulayDuration && (
                      <div>
                        <p className="text-sm text-muted-foreground">Macaulay Duration</p>
                        <p className="text-xl font-bold">{bond.macaulayDuration.toFixed(2)}</p>
                      </div>
                    )}
                    {bond.convexity && (
                      <div>
                        <p className="text-sm text-muted-foreground">Convexity</p>
                        <p className="text-xl font-bold">{bond.convexity.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  {bond.interestRateSensitivityNotes_en && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm">{bond.interestRateSensitivityNotes_en}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {bond.riskDisclosure_en && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Disclosure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichText html={bond.riskDisclosure_en} className="text-muted-foreground" />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Issuer Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bond.issuerLogo && (
                  <img 
                    src={bond.issuerLogo} 
                    alt={bond.issuerName_en}
                    className="h-12 object-contain"
                  />
                )}
                <div>
                  <p className="font-medium">{bond.issuerName_en}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {bond.issuerType?.replace(/_/g, ' ') || 'Unknown'} • {bond.issuerSector || 'N/A'}
                  </p>
                </div>
                {bond.issuerShortDescription_en && (
                  <p className="text-sm text-muted-foreground">
                    {bond.issuerShortDescription_en}
                  </p>
                )}
                {bond.issuerCountry && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Country: </span>
                    <span>{bond.issuerCountry}</span>
                  </div>
                )}
                {bond.issuerWebsite && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={bond.issuerWebsite} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Trading Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tradable</span>
                  <Badge variant={bond.tradableOnPlatform ? 'default' : 'secondary'}>
                    {bond.tradableOnPlatform ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {bond.liquidityScore && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Liquidity Score</span>
                    <span className="font-medium">{bond.liquidityScore}/10</span>
                  </div>
                )}
                {bond.settlementDays && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Settlement</span>
                    <span className="font-medium">T+{bond.settlementDays}</span>
                  </div>
                )}
                {bond.isin && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ISIN</span>
                    <span className="font-mono text-xs">{bond.isin}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
