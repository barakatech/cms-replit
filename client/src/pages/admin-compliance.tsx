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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Shield, 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Save,
  Trash2,
  Plus,
  Play,
  Link,
  Download,
  Upload,
  Edit,
  Filter,
  History,
  BookOpen
} from 'lucide-react';
import type { ComplianceScanRun, ComplianceCheckerSettings, ComplianceRule, BlogPost } from '@shared/schema';

const CATEGORIES = [
  { value: 'guaranteed_returns', label: 'Guaranteed Returns' },
  { value: 'fomo_urgency', label: 'FOMO/Urgency' },
  { value: 'misleading_claims', label: 'Misleading Claims' },
  { value: 'advice_language', label: 'Advice Language' },
  { value: 'regulatory_claims', label: 'Regulatory Claims' },
  { value: 'personalized_claims', label: 'Personalized Claims' },
  { value: 'performance_claims', label: 'Performance Claims' },
  { value: 'other', label: 'Other' },
] as const;

const MATCH_TYPES = [
  { value: 'exact', label: 'Exact Word', description: 'Matches whole words only' },
  { value: 'contains', label: 'Contains', description: 'Matches anywhere in text' },
  { value: 'regex', label: 'Regex', description: 'Custom regex pattern' },
] as const;

const SEVERITIES = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
] as const;

function RulesTab() {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ComplianceRule | null>(null);
  
  const [newRule, setNewRule] = useState({
    name: '',
    phrase: '',
    description: '',
    category: 'other' as const,
    matchType: 'exact' as const,
    severity: 'medium' as const,
    message: '',
    suggestedFix: '',
    dfsaRef: '',
    pattern: '',
  });
  
  const { data: rules, isLoading } = useQuery<ComplianceRule[]>({
    queryKey: ['/api/compliance/rules'],
  });
  
  const createRuleMutation = useMutation({
    mutationFn: async (data: typeof newRule) => {
      const res = await apiRequest('POST', '/api/compliance/rules', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/rules'] });
      setIsAddDialogOpen(false);
      resetNewRule();
      toast({ title: 'Rule created', description: 'Compliance rule added successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create rule', variant: 'destructive' });
    },
  });
  
  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ComplianceRule> }) => {
      const res = await apiRequest('PUT', `/api/compliance/rules/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/rules'] });
      setEditingRule(null);
      toast({ title: 'Rule updated', description: 'Compliance rule updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update rule', variant: 'destructive' });
    },
  });
  
  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/compliance/rules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/rules'] });
      toast({ title: 'Rule deleted', description: 'Compliance rule removed' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete rule', variant: 'destructive' });
    },
  });
  
  const resetNewRule = () => {
    setNewRule({
      name: '',
      phrase: '',
      description: '',
      category: 'other',
      matchType: 'exact',
      severity: 'medium',
      message: '',
      suggestedFix: '',
      dfsaRef: '',
      pattern: '',
    });
  };
  
  const filteredRules = rules?.filter(rule => {
    if (categoryFilter !== 'all' && rule.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && rule.severity !== severityFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return rule.name.toLowerCase().includes(query) || 
             rule.phrase.toLowerCase().includes(query) ||
             rule.description.toLowerCase().includes(query);
    }
    return true;
  }) || [];
  
  const exportRulesCSV = () => {
    if (!rules) return;
    const headers = ['name', 'phrase', 'category', 'matchType', 'severity', 'message', 'suggestedFix', 'dfsaRef', 'enabled'];
    const csvContent = [
      headers.join(','),
      ...rules.map(r => [
        `"${r.name}"`,
        `"${r.phrase}"`,
        r.category,
        r.matchType,
        r.severity,
        `"${r.message}"`,
        `"${r.suggestedFix || ''}"`,
        `"${r.dfsaRef || ''}"`,
        r.enabled,
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance-rules.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export complete', description: `Exported ${rules.length} rules` });
  };
  
  const toggleRuleEnabled = (rule: ComplianceRule) => {
    updateRuleMutation.mutate({
      id: rule.id,
      data: { enabled: !rule.enabled },
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-60"
              data-testid="input-search-rules"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44" data-testid="select-category-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-36" data-testid="select-severity-filter">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {SEVERITIES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportRulesCSV} data-testid="button-export-csv">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-rule">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Compliance Rule</DialogTitle>
                <DialogDescription>
                  Create a new keyword or phrase to flag in content
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rule Name</Label>
                    <Input
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="e.g., Guaranteed Returns"
                      data-testid="input-rule-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phrase/Keyword</Label>
                    <Input
                      value={newRule.phrase}
                      onChange={(e) => setNewRule({ ...newRule, phrase: e.target.value })}
                      placeholder="e.g., guaranteed profit"
                      data-testid="input-rule-phrase"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newRule.category} onValueChange={(v) => setNewRule({ ...newRule, category: v as any })}>
                      <SelectTrigger data-testid="select-rule-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Match Type</Label>
                    <Select value={newRule.matchType} onValueChange={(v) => setNewRule({ ...newRule, matchType: v as any })}>
                      <SelectTrigger data-testid="select-rule-match-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MATCH_TYPES.map(m => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select value={newRule.severity} onValueChange={(v) => setNewRule({ ...newRule, severity: v as any })}>
                      <SelectTrigger data-testid="select-rule-severity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITIES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    placeholder="Why this phrase is flagged..."
                    data-testid="input-rule-description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Message (shown in findings)</Label>
                  <Input
                    value={newRule.message}
                    onChange={(e) => setNewRule({ ...newRule, message: e.target.value })}
                    placeholder="This language may imply guaranteed returns..."
                    data-testid="input-rule-message"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Suggested Fix (optional)</Label>
                    <Input
                      value={newRule.suggestedFix}
                      onChange={(e) => setNewRule({ ...newRule, suggestedFix: e.target.value })}
                      placeholder="Alternative wording to use..."
                      data-testid="input-rule-suggested-fix"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>DFSA Reference (optional)</Label>
                    <Input
                      value={newRule.dfsaRef}
                      onChange={(e) => setNewRule({ ...newRule, dfsaRef: e.target.value })}
                      placeholder="e.g., COB 3.2.1"
                      data-testid="input-rule-dfsa-ref"
                    />
                  </div>
                </div>
                
                {newRule.matchType === 'regex' && (
                  <div className="space-y-2">
                    <Label>Custom Regex Pattern</Label>
                    <Input
                      value={newRule.pattern}
                      onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                      placeholder="e.g., \\bguaranteed?\\s+returns?\\b"
                      className="font-mono text-sm"
                      data-testid="input-rule-pattern"
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={() => createRuleMutation.mutate(newRule)}
                  disabled={!newRule.name || !newRule.phrase || !newRule.message}
                  data-testid="button-save-new-rule"
                >
                  Create Rule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Compliance Rules
          </CardTitle>
          <CardDescription>
            {filteredRules.length} of {rules?.length || 0} rules shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Active</TableHead>
                    <TableHead>Name / Phrase</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map(rule => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRuleEnabled(rule)}
                          data-testid={`switch-rule-${rule.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">{rule.phrase}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {CATEGORIES.find(c => c.value === rule.category)?.label || rule.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.matchType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.severity === 'critical' || rule.severity === 'high' ? 'destructive' : 'outline'}>
                          {rule.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingRule(rule)}
                            data-testid={`button-edit-rule-${rule.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRuleMutation.mutate(rule.id)}
                            data-testid={`button-delete-rule-${rule.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Compliance Rule</DialogTitle>
          </DialogHeader>
          
          {editingRule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                    data-testid="input-edit-rule-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phrase/Keyword</Label>
                  <Input
                    value={editingRule.phrase}
                    onChange={(e) => setEditingRule({ ...editingRule, phrase: e.target.value })}
                    data-testid="input-edit-rule-phrase"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editingRule.category} onValueChange={(v) => setEditingRule({ ...editingRule, category: v as any })}>
                    <SelectTrigger data-testid="select-edit-rule-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Match Type</Label>
                  <Select value={editingRule.matchType} onValueChange={(v) => setEditingRule({ ...editingRule, matchType: v as any })}>
                    <SelectTrigger data-testid="select-edit-rule-match-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATCH_TYPES.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={editingRule.severity} onValueChange={(v) => setEditingRule({ ...editingRule, severity: v as any })}>
                    <SelectTrigger data-testid="select-edit-rule-severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITIES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingRule.description}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  data-testid="input-edit-rule-description"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Message</Label>
                <Input
                  value={editingRule.message}
                  onChange={(e) => setEditingRule({ ...editingRule, message: e.target.value })}
                  data-testid="input-edit-rule-message"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Suggested Fix</Label>
                  <Input
                    value={editingRule.suggestedFix || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, suggestedFix: e.target.value })}
                    data-testid="input-edit-rule-suggested-fix"
                  />
                </div>
                <div className="space-y-2">
                  <Label>DFSA Reference</Label>
                  <Input
                    value={editingRule.dfsaRef || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, dfsaRef: e.target.value })}
                    data-testid="input-edit-rule-dfsa-ref"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={() => editingRule && updateRuleMutation.mutate({ id: editingRule.id, data: editingRule })}
              data-testid="button-update-rule"
            >
              Update Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScanContentTab() {
  const { toast } = useToast();
  const [scanMode, setScanMode] = useState<'blog' | 'text' | 'url'>('blog');
  const [customText, setCustomText] = useState('');
  const [urlToScan, setUrlToScan] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ComplianceScanRun | null>(null);
  
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });
  
  const runBlogScan = async () => {
    const post = blogPosts?.find(p => p.id === selectedBlogId);
    if (!post) return;
    
    setIsScanning(true);
    try {
      const textContent = (post.content_en || '').replace(/<[^>]*>/g, ' ').trim();
      const result = await apiRequest('POST', '/api/compliance/scans', {
        contentType: 'blog',
        contentId: post.id,
        contentTitle: post.title_en,
        originalText: textContent,
        locale: 'en',
      });
      const scan = await result.json();
      setScanResult(scan);
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/scans'] });
      toast({ title: 'Scan complete', description: `Found ${scan.complianceFindings.length} issues` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to scan blog post', variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };
  
  const runTextScan = async () => {
    if (!customText.trim()) return;
    
    setIsScanning(true);
    try {
      const result = await apiRequest('POST', '/api/compliance/scan-text', { text: customText });
      const scan = await result.json();
      setScanResult(scan);
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/scans'] });
      toast({ title: 'Scan complete', description: `Found ${scan.complianceFindings.length} issues` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to scan text', variant: 'destructive' });
    } finally {
      setIsScanning(false);
    }
  };
  
  const runUrlScan = async () => {
    if (!urlToScan.trim()) return;
    
    setIsScanning(true);
    try {
      const result = await apiRequest('POST', '/api/compliance/scan-url', { url: urlToScan });
      const data = await result.json();
      
      if (data.error) {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
        return;
      }
      
      setScanResult(data.scan);
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/scans'] });
      toast({ title: 'URL scanned', description: `Found ${data.scan.complianceFindings.length} issues in "${data.title}"` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to scan URL', variant: 'destructive' });
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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Scan Content
            </CardTitle>
            <CardDescription>
              Check content for compliance issues before publishing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={scanMode} onValueChange={(v) => setScanMode(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="blog" data-testid="tab-scan-blog">
                  <FileText className="h-4 w-4 mr-2" />
                  Blog Post
                </TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-scan-text">
                  <Edit className="h-4 w-4 mr-2" />
                  Custom Text
                </TabsTrigger>
                <TabsTrigger value="url" data-testid="tab-scan-url">
                  <Link className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="blog" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Select Blog Post</Label>
                  <Select value={selectedBlogId} onValueChange={setSelectedBlogId}>
                    <SelectTrigger data-testid="select-scan-blog">
                      <SelectValue placeholder="Choose a blog post to scan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {blogPosts?.map(post => (
                        <SelectItem key={post.id} value={post.id}>
                          <span className="flex items-center gap-2">
                            {post.title_en}
                            <Badge variant="outline" className="ml-2">{post.status}</Badge>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={runBlogScan} disabled={!selectedBlogId || isScanning} data-testid="button-scan-blog">
                  {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Scan Blog Post
                </Button>
              </TabsContent>
              
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Paste or type content</Label>
                  <Textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter content to scan for compliance issues..."
                    className="min-h-[200px]"
                    data-testid="textarea-scan-text"
                  />
                </div>
                <Button onClick={runTextScan} disabled={!customText.trim() || isScanning} data-testid="button-scan-text">
                  {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Scan Text
                </Button>
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Enter URL to scan</Label>
                  <Input
                    value={urlToScan}
                    onChange={(e) => setUrlToScan(e.target.value)}
                    placeholder="https://example.com/article"
                    data-testid="input-scan-url"
                  />
                  <p className="text-sm text-muted-foreground">
                    The page content will be fetched and scanned for compliance issues
                  </p>
                </div>
                <Button onClick={runUrlScan} disabled={!urlToScan.trim() || isScanning} data-testid="button-scan-url">
                  {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Scan URL
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {scanResult && (
          <Card>
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
                    {scanResult.complianceFindings.map((finding) => (
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
                                  Suggested: {finding.suggestedFix}
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
              
              {scanResult.englishFindings && scanResult.englishFindings.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">English Language Issues</h4>
                  <div className="space-y-2">
                    {scanResult.englishFindings.map((issue: any, i: number) => (
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
        {scanResult && (
          <Card>
            <CardHeader>
              <CardTitle>Scan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Compliance Score</span>
                <Badge variant={scanResult.complianceScore >= 80 ? 'default' : 'destructive'}>
                  {scanResult.complianceScore}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={scanResult.complianceLabel === 'Compliant' ? 'default' : 'outline'}>
                  {scanResult.complianceLabel}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Issues Found</span>
                <Badge variant="secondary">{scanResult.complianceFindings.length}</Badge>
              </div>
              {scanResult.englishScore !== undefined && (
                <div className="flex items-center justify-between">
                  <span>English Score</span>
                  <Badge variant="outline">{scanResult.englishScore}%</Badge>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={runEnglishAnalysis} data-testid="button-english-check">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run English Check
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ScanHistoryTab() {
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
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
  
  const updateScanStatus = async (scanId: string, status: 'approved' | 'rejected') => {
    try {
      await apiRequest('PUT', `/api/compliance/scans/${scanId}`, {
        approvalStatus: status,
        reviewedBy: 'admin',
        reviewedAt: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/scans'] });
      toast({ title: 'Status updated', description: `Scan marked as ${status}` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
          <SelectTrigger className="w-40" data-testid="select-history-content-type">
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
          <SelectTrigger className="w-40" data-testid="select-history-status">
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Scan History
          </CardTitle>
          <CardDescription>
            Review past compliance scans and their outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : scans?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scan history yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {scans?.map(scan => (
                  <Card key={scan.id} className="hover-elevate cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(scan.approvalStatus)}
                            <span className="font-medium truncate">{scan.contentTitle}</span>
                            <Badge variant="outline">{scan.contentType}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Scanned: {new Date(scan.scannedAt).toLocaleDateString()} · 
                            {scan.complianceFindings.length} issues found
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={scan.complianceScore >= 80 ? 'default' : 'destructive'}>
                            {scan.complianceScore}%
                          </Badge>
                          {scan.approvalStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateScanStatus(scan.id, 'approved')}
                                data-testid={`button-approve-${scan.id}`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateScanStatus(scan.id, 'rejected')}
                                data-testid={`button-reject-${scan.id}`}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCompliance() {
  const [activeTab, setActiveTab] = useState('rules');
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Compliance Checker
          </h1>
          <p className="text-muted-foreground">
            Manage compliance rules and scan content for regulatory issues
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rules" data-testid="tab-rules">
            <BookOpen className="h-4 w-4 mr-2" />
            Rules & Keywords
          </TabsTrigger>
          <TabsTrigger value="scan" data-testid="tab-scan">
            <Search className="h-4 w-4 mr-2" />
            Scan Content
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">
            <History className="h-4 w-4 mr-2" />
            Scan History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules" className="mt-6">
          <RulesTab />
        </TabsContent>
        
        <TabsContent value="scan" className="mt-6">
          <ScanContentTab />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <ScanHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
