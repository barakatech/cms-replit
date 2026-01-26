import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, FileText, Type, ShieldCheck, BookOpen } from 'lucide-react';

interface ContentScorePanelProps {
  title: string;
  excerpt: string;
  content: string;
  language: 'en' | 'ar';
}

interface ScoreResult {
  score: number;
  label: string;
  color: string;
  icon: typeof CheckCircle;
}

interface Issue {
  type: 'grammar' | 'compliance' | 'readability';
  severity: 'error' | 'warning' | 'suggestion';
  message: string;
}

function getScoreResult(score: number): ScoreResult {
  if (score >= 80) {
    return { score, label: 'Excellent', color: 'text-green-600 dark:text-green-400', icon: CheckCircle };
  } else if (score >= 60) {
    return { score, label: 'Good', color: 'text-yellow-600 dark:text-yellow-400', icon: AlertCircle };
  } else {
    return { score, label: 'Needs Work', color: 'text-red-600 dark:text-red-400', icon: XCircle };
  }
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function analyzeContent(title: string, excerpt: string, content: string, language: 'en' | 'ar') {
  const plainContent = stripHtml(content);
  const plainExcerpt = stripHtml(excerpt);
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  const sentenceCount = plainContent.split(/[.!?]+/).filter(Boolean).length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  const issues: Issue[] = [];
  
  let grammarScore = 100;
  let complianceScore = 100;
  let readabilityScore = 100;
  
  if (!title.trim()) {
    grammarScore -= 20;
    issues.push({ type: 'grammar', severity: 'error', message: 'Title is required' });
  } else if (title.length < 10) {
    grammarScore -= 10;
    issues.push({ type: 'grammar', severity: 'warning', message: 'Title is too short (min 10 characters)' });
  } else if (title.length > 70) {
    grammarScore -= 5;
    issues.push({ type: 'grammar', severity: 'suggestion', message: 'Title is long (recommended: under 70 characters)' });
  }
  
  if (!plainExcerpt.trim()) {
    grammarScore -= 15;
    issues.push({ type: 'grammar', severity: 'error', message: 'Excerpt is required' });
  } else if (plainExcerpt.length < 50) {
    grammarScore -= 10;
    issues.push({ type: 'grammar', severity: 'warning', message: 'Excerpt is too short (min 50 characters)' });
  }
  
  if (wordCount < 100) {
    grammarScore -= 15;
    issues.push({ type: 'grammar', severity: 'warning', message: `Content is short (${wordCount} words, recommended: 300+)` });
  } else if (wordCount < 300) {
    grammarScore -= 5;
    issues.push({ type: 'grammar', severity: 'suggestion', message: `Consider expanding content (${wordCount} words)` });
  }
  
  if (language === 'en') {
    const doubleSpaces = (plainContent.match(/  +/g) || []).length;
    if (doubleSpaces > 0) {
      grammarScore -= Math.min(doubleSpaces * 2, 10);
      issues.push({ type: 'grammar', severity: 'warning', message: `Found ${doubleSpaces} double spaces` });
    }
    
    const repeatedWords = plainContent.match(/\b(\w+)\s+\1\b/gi) || [];
    if (repeatedWords.length > 0) {
      grammarScore -= Math.min(repeatedWords.length * 3, 15);
      issues.push({ type: 'grammar', severity: 'warning', message: `Found ${repeatedWords.length} repeated consecutive words` });
    }
  }
  
  const prohibitedTerms = ['guaranteed returns', 'risk-free', 'get rich quick', 'insider information', '100% safe'];
  const contentLower = plainContent.toLowerCase();
  prohibitedTerms.forEach(term => {
    if (contentLower.includes(term)) {
      complianceScore -= 25;
      issues.push({ type: 'compliance', severity: 'error', message: `Prohibited term: "${term}"` });
    }
  });
  
  const cautionTerms = ['investment advice', 'financial advice', 'we recommend', 'you should buy', 'you should sell'];
  cautionTerms.forEach(term => {
    if (contentLower.includes(term)) {
      complianceScore -= 10;
      issues.push({ type: 'compliance', severity: 'warning', message: `Review term: "${term}" - ensure proper disclaimers` });
    }
  });
  
  const hasDisclaimer = contentLower.includes('disclaimer') || 
                        contentLower.includes('not financial advice') ||
                        contentLower.includes('for informational purposes');
  if (!hasDisclaimer && wordCount > 200) {
    complianceScore -= 15;
    issues.push({ type: 'compliance', severity: 'suggestion', message: 'Consider adding a disclaimer for investment content' });
  }
  
  if (avgWordsPerSentence > 25) {
    readabilityScore -= 20;
    issues.push({ type: 'readability', severity: 'warning', message: 'Sentences are too long (avg > 25 words)' });
  } else if (avgWordsPerSentence > 20) {
    readabilityScore -= 10;
    issues.push({ type: 'readability', severity: 'suggestion', message: 'Some sentences could be shorter' });
  }
  
  const paragraphs = content.split(/<\/p>|<br\s*\/?>/i).filter(p => stripHtml(p).trim().length > 0);
  if (paragraphs.length < 3 && wordCount > 200) {
    readabilityScore -= 10;
    issues.push({ type: 'readability', severity: 'suggestion', message: 'Consider breaking content into more paragraphs' });
  }
  
  const hasHeadings = /<h[1-6][^>]*>/i.test(content);
  if (!hasHeadings && wordCount > 300) {
    readabilityScore -= 10;
    issues.push({ type: 'readability', severity: 'suggestion', message: 'Consider adding headings for longer content' });
  }
  
  grammarScore = Math.max(0, Math.min(100, grammarScore));
  complianceScore = Math.max(0, Math.min(100, complianceScore));
  readabilityScore = Math.max(0, Math.min(100, readabilityScore));
  
  const overallScore = Math.round((grammarScore + complianceScore + readabilityScore) / 3);
  
  return {
    grammarScore,
    complianceScore,
    readabilityScore,
    overallScore,
    wordCount,
    issues,
  };
}

export function ContentScorePanel({ title, excerpt, content, language }: ContentScorePanelProps) {
  const analysis = useMemo(() => 
    analyzeContent(title, excerpt, content, language),
    [title, excerpt, content, language]
  );
  
  const overall = getScoreResult(analysis.overallScore);
  const grammar = getScoreResult(analysis.grammarScore);
  const compliance = getScoreResult(analysis.complianceScore);
  const readability = getScoreResult(analysis.readabilityScore);
  
  const errorCount = analysis.issues.filter(i => i.severity === 'error').length;
  const warningCount = analysis.issues.filter(i => i.severity === 'warning').length;
  
  return (
    <Card className="sticky top-4" data-testid="content-score-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Content Score</span>
          <div className={`text-2xl font-bold ${overall.color}`} data-testid="overall-score">
            {analysis.overallScore}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5" />
                Grammar
              </span>
              <span className={grammar.color}>{analysis.grammarScore}</span>
            </div>
            <Progress value={analysis.grammarScore} className="h-1.5" data-testid="grammar-score" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Compliance
              </span>
              <span className={compliance.color}>{analysis.complianceScore}</span>
            </div>
            <Progress value={analysis.complianceScore} className="h-1.5" data-testid="compliance-score" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Readability
              </span>
              <span className={readability.color}>{analysis.readabilityScore}</span>
            </div>
            <Progress value={analysis.readabilityScore} className="h-1.5" data-testid="readability-score" />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {analysis.wordCount} words
          </span>
          <div className="flex gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0" data-testid="error-count">
                {errorCount} errors
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" data-testid="warning-count">
                {warningCount} warnings
              </Badge>
            )}
          </div>
        </div>
        
        {analysis.issues.length > 0 && (
          <div className="space-y-2 pt-2 border-t max-h-48 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground">Issues</p>
            {analysis.issues.map((issue, idx) => (
              <div 
                key={idx} 
                className={`text-xs p-2 rounded-md ${
                  issue.severity === 'error' 
                    ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                    : issue.severity === 'warning'
                    ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                }`}
                data-testid={`issue-${idx}`}
              >
                <span className="font-medium capitalize">{issue.type}: </span>
                {issue.message}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
