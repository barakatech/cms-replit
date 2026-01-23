import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { QualityBars } from '@/components/QualityBars';
import { Shield, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ComplianceScanRun, ComplianceContentType } from '@shared/schema';

interface QualityBarsWidgetProps {
  contentType: ComplianceContentType;
  contentId: string;
  contentTitle: string;
  text: string;
  locale?: 'en' | 'ar';
  className?: string;
  onComplianceClick?: () => void;
  onEnglishClick?: () => void;
}

export function QualityBarsWidget({
  contentType,
  contentId,
  contentTitle,
  text,
  locale = 'en',
  className,
  onComplianceClick,
  onEnglishClick,
}: QualityBarsWidgetProps) {
  const { toast } = useToast();
  const [scanResult, setScanResult] = useState<ComplianceScanRun | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzingEnglish, setIsAnalyzingEnglish] = useState(false);

  const runComplianceScan = async () => {
    if (!text.trim()) {
      toast({ title: 'No content', description: 'Add some content before scanning.', variant: 'destructive' });
      return;
    }

    setIsScanning(true);
    try {
      const result = await apiRequest('POST', '/api/compliance/scans', {
        contentType,
        contentId,
        contentTitle,
        originalText: text,
        locale,
      });
      const scan = await result.json();
      setScanResult(scan);
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/scans'] });
      toast({ title: 'Scan complete', description: `Compliance score: ${scan.complianceScore}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to run scan', variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };

  const runEnglishAnalysis = async () => {
    if (!scanResult) {
      toast({ title: 'Run compliance scan first', description: 'Please run a compliance scan before English analysis.', variant: 'destructive' });
      return;
    }

    setIsAnalyzingEnglish(true);
    try {
      const result = await apiRequest('POST', '/api/compliance/analyze-english', {
        scanId: scanResult.id,
        text: scanResult.originalText,
      });
      const analysis = await result.json();

      if (analysis.error) {
        toast({ title: 'Note', description: analysis.error, variant: 'destructive' });
        return;
      }

      setScanResult(prev => prev ? {
        ...prev,
        englishScore: analysis.englishScore,
        englishLabel: analysis.englishLabel,
        englishFindings: analysis.englishFindings,
        englishSuggestedEdits: analysis.englishSuggestedEdits,
        englishProvider: analysis.provider,
      } : null);

      toast({ title: 'English analysis complete', description: `Score: ${analysis.englishScore}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to analyze English quality', variant: 'destructive' });
    } finally {
      setIsAnalyzingEnglish(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Quality Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!scanResult ? (
          <div className="text-center py-4">
            <Shield className="h-8 w-8 mx-auto text-muted-foreground mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground mb-3">
              Check your content for compliance and language quality
            </p>
            <Button 
              onClick={runComplianceScan} 
              disabled={isScanning || !text.trim()}
              size="sm"
              className="w-full"
              data-testid="button-widget-scan"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Compliance Scan
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <QualityBars
              complianceScore={scanResult.complianceScore}
              complianceLabel={scanResult.complianceLabel}
              complianceFindings={scanResult.complianceFindings}
              englishScore={scanResult.englishScore}
              englishLabel={scanResult.englishLabel}
              englishFindings={scanResult.englishFindings}
              variant="full"
              onComplianceClick={onComplianceClick}
              onEnglishClick={onEnglishClick}
            />

            <div className="space-y-2 pt-2 border-t">
              <Button 
                onClick={runComplianceScan} 
                disabled={isScanning}
                size="sm"
                variant="outline"
                className="w-full"
                data-testid="button-widget-rescan"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Re-scanning...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-scan Content
                  </>
                )}
              </Button>

              <Button 
                onClick={runEnglishAnalysis} 
                disabled={isAnalyzingEnglish}
                size="sm"
                variant="outline"
                className="w-full"
                data-testid="button-widget-english"
              >
                {isAnalyzingEnglish ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Run English Check
                  </>
                )}
              </Button>
            </div>

            {scanResult.complianceFindings.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-1">Compliance Issues:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {scanResult.complianceFindings.slice(0, 3).map((finding, i) => (
                    <div key={i} className="text-xs p-2 bg-muted rounded">
                      <span className="font-medium">{finding.ruleName}</span>
                      <p className="text-muted-foreground">{finding.message}</p>
                    </div>
                  ))}
                  {scanResult.complianceFindings.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{scanResult.complianceFindings.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {scanResult.englishFindings && scanResult.englishFindings.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-1">Language Issues:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {scanResult.englishFindings.slice(0, 3).map((issue, i) => (
                    <div key={i} className="text-xs p-2 bg-muted rounded">
                      <span className="font-medium capitalize">{issue.type}</span>
                      <p className="text-muted-foreground">{issue.message}</p>
                    </div>
                  ))}
                  {scanResult.englishFindings.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{scanResult.englishFindings.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
