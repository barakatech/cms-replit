import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { QualityBars, QualityBarsCompact } from '@/components/QualityBars';
import { 
  Shield, 
  Search, 
  Settings, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Sparkles,
  Save,
  Trash2,
  Plus,
  Play
} from 'lucide-react';
import type { ComplianceScanRun, ComplianceCheckerSettings, ComplianceRule, BlogPost } from '@shared/schema';

function InboxTab() {
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [, navigate] = useLocation();
  
  const { data: scans, isLoading } = useQuery<ComplianceScanRun[]>({
    queryKey: ['/api/compliance/scans', contentTypeFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (contentTypeFilter !== 'all') params.set('contentType', contentTypeFilter);
      if (statusFilter !== 'all') params.set('approvalStatus', statusFilter);
      const res = await fetch(`/api/compliance/scans?${params.toString()}`);
      return res.json();
    },
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-40" data-testid="select-content-type">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="stock_page">Stock Page</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => navigate('/admin/compliance/scan')} data-testid="button-new-scan">
          <Plus className="h-4 w-4 mr-2" />
          New Scan
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : scans?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No compliance scans found</p>
            <Button className="mt-4" onClick={() => navigate('/admin/compliance/scan')} data-testid="button-start-scanning">
              Start Scanning Content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scans?.map(scan => (
            <Card 
              key={scan.id} 
              className="cursor-pointer hover-elevate"
              onClick={() => navigate(`/admin/compliance/scan/${scan.id}`)}
              data-testid={`card-scan-${scan.id}`}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(scan.approvalStatus)}
                      <span className="font-medium truncate">{scan.contentTitle}</span>
                      <Badge variant="outline" className="text-xs">{scan.contentType}</Badge>
                      <Badge variant="outline" className="text-xs">{scan.locale.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      Scanned {new Date(scan.scannedAt).toLocaleDateString()} at {new Date(scan.scannedAt).toLocaleTimeString()}
                    </p>
                    {scan.complianceFindings.length > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        {scan.complianceFindings.length} compliance issue{scan.complianceFindings.length !== 1 ? 's' : ''} found
                      </p>
                    )}
                  </div>
                  
                  <div className="w-48 flex-shrink-0">
                    <QualityBarsCompact
                      complianceScore={scan.complianceScore}
                      complianceLabel={scan.complianceLabel}
                      complianceFindings={scan.complianceFindings}
                      englishScore={scan.englishScore}
                      englishLabel={scan.englishLabel}
                      englishFindings={scan.englishFindings}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ScannerTab() {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<{ type: string; id: string; title: string } | null>(null);
  const [customText, setCustomText] = useState('');
  const [scanResult, setScanResult] = useState<ComplianceScanRun | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });
  
  const runScan = async () => {
    if (!selectedContent && !customText.trim()) {
      toast({ title: 'Error', description: 'Please select content or enter text to scan', variant: 'destructive' });
      return;
    }
    
    setIsScanning(true);
    try {
      const scanData = {
        contentType: selectedContent?.type || 'social',
        contentId: selectedContent?.id || 'custom',
        contentTitle: selectedContent?.title || 'Custom Text',
        originalText: customText || 'Sample content to scan',
        locale: 'en' as const,
      };
      
      const result = await apiRequest('POST', '/api/compliance/scans', scanData);
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
    if (!scanResult) return;
    
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
    }
  };
  
  const scrollToFindings = () => {
    document.getElementById('findings-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content to Scan
            </CardTitle>
            <CardDescription>
              Select existing content or paste custom text to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Blog Post</Label>
              <Select 
                value={selectedContent?.id || ''} 
                onValueChange={(id) => {
                  const post = blogPosts?.find(p => p.id === id);
                  if (post) {
                    setSelectedContent({ type: 'blog', id: post.id, title: post.title_en });
                    setCustomText((post.content_en || '').replace(/<[^>]*>/g, ' ').trim());
                  }
                }}
              >
                <SelectTrigger data-testid="select-blog-post">
                  <SelectValue placeholder="Choose a blog post..." />
                </SelectTrigger>
                <SelectContent>
                  {blogPosts?.slice(0, 20).map(post => (
                    <SelectItem key={post.id} value={post.id}>{post.title_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">— or —</div>
            
            <div>
              <Label>Custom Text</Label>
              <Textarea
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setSelectedContent(null);
                }}
                placeholder="Paste or type content to scan for compliance..."
                className="min-h-[200px]"
                data-testid="textarea-custom-text"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={runScan} disabled={isScanning} data-testid="button-run-scan">
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Compliance Scan
                  </>
                )}
              </Button>
              
              {scanResult && (
                <Button variant="outline" onClick={runEnglishAnalysis} data-testid="button-english-analysis">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run English Check
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {scanResult && (
          <Card id="findings-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scanResult.complianceFindings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No compliance issues found</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {scanResult.complianceFindings.map((finding, i) => (
                      <Card key={finding.id} className="border-l-4" style={{ 
                        borderLeftColor: finding.severity === 'critical' ? '#ef4444' : 
                                         finding.severity === 'high' ? '#f97316' : 
                                         finding.severity === 'medium' ? '#eab308' : '#3b82f6'
                      }}>
                        <CardContent className="py-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">{finding.severity}</Badge>
                                <span className="font-medium">{finding.ruleName}</span>
                                {finding.dfsaRef && (
                                  <Badge variant="secondary" className="text-xs">{finding.dfsaRef}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{finding.message}</p>
                              {finding.suggestedFix && (
                                <p className="text-sm text-green-600 mt-1">
                                  Suggested fix: {finding.suggestedFix}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {scanResult.englishFindings.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">English Language Issues</h4>
                  <div className="space-y-2">
                    {scanResult.englishFindings.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm p-2 bg-muted rounded">
                        <Badge variant="outline" className="text-xs">{issue.type}</Badge>
                        <div className="flex-1">
                          <p>{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-green-600">Suggestion: {issue.suggestion}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="space-y-4">
        {scanResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Quality Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <QualityBars
                complianceScore={scanResult.complianceScore}
                complianceLabel={scanResult.complianceLabel}
                complianceFindings={scanResult.complianceFindings}
                englishScore={scanResult.englishScore}
                englishLabel={scanResult.englishLabel}
                englishFindings={scanResult.englishFindings}
                overallScore={scanResult.riskScore}
                onComplianceClick={scrollToFindings}
                variant="full"
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>Run a scan to see quality scores</p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" disabled={!scanResult} data-testid="button-apply-amendments">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Apply Compliance Amendments
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled={!scanResult || !scanResult.englishScore} data-testid="button-apply-edits">
              <Sparkles className="h-4 w-4 mr-2" />
              Apply Language Edits
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { toast } = useToast();
  
  const { data: settings, isLoading } = useQuery<ComplianceCheckerSettings>({
    queryKey: ['/api/compliance/settings'],
  });
  
  const { data: rules } = useQuery<ComplianceRule[]>({
    queryKey: ['/api/compliance/rules'],
  });
  
  const [localSettings, setLocalSettings] = useState<ComplianceCheckerSettings | null>(null);
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  
  const saveSettings = async () => {
    if (!localSettings) return;
    try {
      await apiRequest('PUT', '/api/compliance/settings', localSettings);
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/settings'] });
      toast({ title: 'Settings saved', description: 'Compliance checker settings have been updated.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
  };
  
  const runTestAnalysis = async () => {
    if (!testText.trim()) return;
    try {
      const result = await apiRequest('POST', '/api/compliance/analyze-english', { text: testText });
      const data = await result.json();
      setTestResult(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to run test analysis', variant: 'destructive' });
    }
  };
  
  if (isLoading || !settings) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }
  
  const currentSettings = localSettings || settings;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integrations</CardTitle>
          <CardDescription>Configure English quality scoring providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable English Quality Scoring</Label>
              <p className="text-sm text-muted-foreground">Analyze text for grammar, spelling, and clarity</p>
            </div>
            <Switch
              checked={currentSettings.enableEnglishQualityScoring}
              onCheckedChange={(checked) => setLocalSettings({ ...currentSettings, enableEnglishQualityScoring: checked })}
              data-testid="switch-enable-english"
            />
          </div>
          
          {currentSettings.enableEnglishQualityScoring && (
            <>
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select 
                  value={currentSettings.englishScoringProvider}
                  onValueChange={(v) => setLocalSettings({ ...currentSettings, englishScoringProvider: v as any })}
                >
                  <SelectTrigger data-testid="select-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="writing_assistant">Generic Writing Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {currentSettings.englishScoringProvider === 'openai' && (
                <div className="space-y-2">
                  <Label>OpenAI Model</Label>
                  <Select 
                    value={currentSettings.openaiModel || 'gpt-4o'}
                    onValueChange={(v) => setLocalSettings({ ...currentSettings, openaiModel: v })}
                  >
                    <SelectTrigger data-testid="select-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Label>Test Analysis</Label>
                <Textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Enter text to test the English quality analyzer..."
                  className="mt-2"
                  data-testid="textarea-test"
                />
                <Button onClick={runTestAnalysis} className="mt-2" variant="outline" data-testid="button-test">
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </Button>
                
                {testResult && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-medium">Score: {testResult.englishScore ?? 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Label: {testResult.englishLabel}</p>
                    <p className="text-sm text-muted-foreground">Provider: {testResult.provider}</p>
                    {testResult.englishFindings?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Issues found:</p>
                        <ul className="text-sm list-disc ml-4">
                          {testResult.englishFindings.slice(0, 5).map((f: any, i: number) => (
                            <li key={i}>{f.message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          
          <Button onClick={saveSettings} data-testid="button-save-settings">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance Rules (DFSA)</CardTitle>
          <CardDescription>{rules?.length || 0} rules configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rules?.map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Switch checked={rule.isActive} disabled />
                  <div>
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-sm text-muted-foreground">{rule.dfsaRef}</p>
                  </div>
                </div>
                <Badge variant={rule.severity === 'critical' ? 'destructive' : 'outline'}>
                  {rule.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Score Thresholds</CardTitle>
          <CardDescription>Configure label thresholds for compliance and English scores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Compliant (score &gt;=)</Label>
              <Input 
                type="number" 
                value={currentSettings.complianceThresholds.compliant}
                onChange={(e) => setLocalSettings({
                  ...currentSettings,
                  complianceThresholds: { ...currentSettings.complianceThresholds, compliant: parseInt(e.target.value) }
                })}
                data-testid="input-threshold-compliant"
              />
            </div>
            <div>
              <Label>Needs Review (score &gt;=)</Label>
              <Input 
                type="number" 
                value={currentSettings.complianceThresholds.needsReview}
                onChange={(e) => setLocalSettings({
                  ...currentSettings,
                  complianceThresholds: { ...currentSettings.complianceThresholds, needsReview: parseInt(e.target.value) }
                })}
                data-testid="input-threshold-review"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Excellent English (score &gt;=)</Label>
              <Input 
                type="number" 
                value={currentSettings.englishThresholds.excellent}
                onChange={(e) => setLocalSettings({
                  ...currentSettings,
                  englishThresholds: { ...currentSettings.englishThresholds, excellent: parseInt(e.target.value) }
                })}
                data-testid="input-threshold-excellent"
              />
            </div>
            <div>
              <Label>Good English (score &gt;=)</Label>
              <Input 
                type="number" 
                value={currentSettings.englishThresholds.good}
                onChange={(e) => setLocalSettings({
                  ...currentSettings,
                  englishThresholds: { ...currentSettings.englishThresholds, good: parseInt(e.target.value) }
                })}
                data-testid="input-threshold-good"
              />
            </div>
          </div>
          
          <Button onClick={saveSettings} data-testid="button-save-thresholds">
            <Save className="h-4 w-4 mr-2" />
            Save Thresholds
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCompliance() {
  const [activeTab, setActiveTab] = useState('inbox');
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Compliance Checker
          </h1>
          <p className="text-muted-foreground">
            Scan content for regulatory compliance and language quality
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox" data-testid="tab-inbox">
            <FileText className="h-4 w-4 mr-2" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="scanner" data-testid="tab-scanner">
            <Search className="h-4 w-4 mr-2" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="mt-6">
          <InboxTab />
        </TabsContent>
        
        <TabsContent value="scanner" className="mt-6">
          <ScannerTab />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
