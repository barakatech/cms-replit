import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import type { ComplianceFinding, EnglishIssue, ComplianceLabel, EnglishQualityLabel } from '@shared/schema';

interface QualityBarsProps {
  complianceScore: number;
  complianceLabel: ComplianceLabel;
  complianceFindings?: ComplianceFinding[];
  englishScore: number | null;
  englishLabel: EnglishQualityLabel;
  englishFindings?: EnglishIssue[];
  overallScore?: number;
  variant?: 'compact' | 'full';
  onComplianceClick?: () => void;
  onEnglishClick?: () => void;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-lime-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function getScoreGradient(score: number): string {
  if (score >= 85) return 'from-green-500 to-green-600';
  if (score >= 70) return 'from-lime-500 to-lime-600';
  if (score >= 60) return 'from-yellow-500 to-yellow-600';
  if (score >= 40) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

function getComplianceLabelText(label: ComplianceLabel): string {
  switch (label) {
    case 'compliant': return 'Compliant';
    case 'needs_review': return 'Needs Review';
    case 'high_risk': return 'High Risk';
  }
}

function getEnglishLabelText(label: EnglishQualityLabel): string {
  switch (label) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'needs_edits': return 'Needs Edits';
    case 'not_configured': return 'Not configured';
  }
}

function ComplianceTooltipContent({ findings }: { findings: ComplianceFinding[] }) {
  const topFindings = findings.slice(0, 3);
  
  if (topFindings.length === 0) {
    return <p className="text-sm">No compliance issues found</p>;
  }
  
  return (
    <div className="space-y-2 max-w-xs">
      <p className="font-medium text-sm">Top Compliance Issues:</p>
      {topFindings.map((finding, i) => (
        <div key={i} className="text-xs space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] px-1 py-0",
                finding.severity === 'critical' && 'border-red-500 text-red-600',
                finding.severity === 'high' && 'border-orange-500 text-orange-600',
                finding.severity === 'medium' && 'border-yellow-500 text-yellow-700',
                finding.severity === 'low' && 'border-blue-500 text-blue-600'
              )}
            >
              {finding.severity}
            </Badge>
            {finding.dfsaRef && (
              <span className="text-muted-foreground">{finding.dfsaRef}</span>
            )}
          </div>
          <p className="text-muted-foreground">{finding.message}</p>
        </div>
      ))}
      {findings.length > 3 && (
        <p className="text-xs text-muted-foreground">+{findings.length - 3} more issues</p>
      )}
    </div>
  );
}

function EnglishTooltipContent({ findings }: { findings: EnglishIssue[] }) {
  const topFindings = findings.slice(0, 3);
  
  if (topFindings.length === 0) {
    return <p className="text-sm">No language issues found</p>;
  }
  
  return (
    <div className="space-y-2 max-w-xs">
      <p className="font-medium text-sm">Top Language Issues:</p>
      {topFindings.map((finding, i) => (
        <div key={i} className="text-xs space-y-0.5">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] px-1 py-0",
                finding.type === 'grammar' && 'border-purple-500 text-purple-600',
                finding.type === 'spelling' && 'border-red-500 text-red-600',
                finding.type === 'clarity' && 'border-blue-500 text-blue-600',
                finding.type === 'tone' && 'border-teal-500 text-teal-600'
              )}
            >
              {finding.type}
            </Badge>
          </div>
          <p className="text-muted-foreground">{finding.message}</p>
          {finding.suggestion && (
            <p className="text-green-600 dark:text-green-400">Fix: {finding.suggestion}</p>
          )}
        </div>
      ))}
      {findings.length > 3 && (
        <p className="text-xs text-muted-foreground">+{findings.length - 3} more issues</p>
      )}
    </div>
  );
}

export function QualityBars({
  complianceScore,
  complianceLabel,
  complianceFindings = [],
  englishScore,
  englishLabel,
  englishFindings = [],
  overallScore,
  variant = 'full',
  onComplianceClick,
  onEnglishClick,
  className,
}: QualityBarsProps) {
  const isCompact = variant === 'compact';
  const barHeight = isCompact ? 'h-2' : 'h-4';
  const textSize = isCompact ? 'text-xs' : 'text-sm';
  
  return (
    <div className={cn('space-y-3', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onComplianceClick}
            className={cn(
              'w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md',
              onComplianceClick && 'cursor-pointer hover:opacity-90 transition-opacity'
            )}
            aria-label={`Compliance score ${complianceScore} ${getComplianceLabelText(complianceLabel)}`}
            data-testid="bar-compliance"
          >
            <div className="space-y-1">
              {!isCompact && (
                <div className="flex items-center justify-between">
                  <span className={cn('font-medium', textSize)}>Compliance</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        complianceLabel === 'compliant' && 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950',
                        complianceLabel === 'needs_review' && 'border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-950',
                        complianceLabel === 'high_risk' && 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950'
                      )}
                    >
                      {getComplianceLabelText(complianceLabel)}
                    </Badge>
                    <span className={cn('font-semibold', textSize)}>{complianceScore}</span>
                  </div>
                </div>
              )}
              <div className={cn('w-full bg-muted rounded-full overflow-hidden', barHeight)}>
                <div 
                  className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-300', getScoreGradient(complianceScore))}
                  style={{ width: `${complianceScore}%` }}
                />
              </div>
              {isCompact && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Compliance</span>
                  <span className="font-medium">{complianceScore}</span>
                </div>
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-sm">
          <ComplianceTooltipContent findings={complianceFindings} />
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onEnglishClick}
            className={cn(
              'w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md',
              onEnglishClick && englishScore !== null && 'cursor-pointer hover:opacity-90 transition-opacity'
            )}
            aria-label={englishScore !== null 
              ? `English quality score ${englishScore} ${getEnglishLabelText(englishLabel)}`
              : 'English quality scoring not configured'}
            disabled={englishScore === null}
            data-testid="bar-english"
          >
            <div className="space-y-1">
              {!isCompact && (
                <div className="flex items-center justify-between">
                  <span className={cn('font-medium', textSize)}>English Quality</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        englishLabel === 'excellent' && 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950',
                        englishLabel === 'good' && 'border-lime-500 text-lime-600 bg-lime-50 dark:bg-lime-950',
                        englishLabel === 'needs_edits' && 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950',
                        englishLabel === 'not_configured' && 'border-gray-400 text-gray-500 bg-gray-50 dark:bg-gray-950'
                      )}
                    >
                      {getEnglishLabelText(englishLabel)}
                    </Badge>
                    <span className={cn('font-semibold', textSize)}>
                      {englishScore !== null ? englishScore : '—'}
                    </span>
                  </div>
                </div>
              )}
              <div className={cn('w-full bg-muted rounded-full overflow-hidden', barHeight)}>
                {englishScore !== null ? (
                  <div 
                    className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-300', getScoreGradient(englishScore))}
                    style={{ width: `${englishScore}%` }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-700 opacity-40" />
                  </div>
                )}
              </div>
              {isCompact && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">English</span>
                  <span className="font-medium">{englishScore !== null ? englishScore : '—'}</span>
                </div>
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-sm">
          {englishScore !== null ? (
            <EnglishTooltipContent findings={englishFindings} />
          ) : (
            <p className="text-sm">English quality scoring is not configured. Enable it in Settings.</p>
          )}
        </TooltipContent>
      </Tooltip>

      {overallScore !== undefined && (
        <div className="pt-2 border-t">
          <div className="space-y-1">
            {!isCompact && (
              <div className="flex items-center justify-between">
                <span className={cn('font-medium', textSize)}>Overall Risk</span>
                <span className={cn('font-semibold', textSize)}>{overallScore}</span>
              </div>
            )}
            <div className={cn('w-full bg-muted rounded-full overflow-hidden', barHeight)}>
              <div 
                className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-300', getScoreGradient(100 - overallScore))}
                style={{ width: `${overallScore}%` }}
              />
            </div>
            {isCompact && (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Risk</span>
                <span className="font-medium">{overallScore}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {variant === 'full' && (
        <p className="text-xs text-muted-foreground italic mt-2">
          English scoring is assistance-only; final review required.
        </p>
      )}
    </div>
  );
}

export function QualityBarsCompact(props: Omit<QualityBarsProps, 'variant'>) {
  return <QualityBars {...props} variant="compact" />;
}
