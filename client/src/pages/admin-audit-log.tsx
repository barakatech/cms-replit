import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Search, ClipboardList, Send, Plus, Pencil, Trash2, Zap, Check } from 'lucide-react';
import { format } from 'date-fns';
import { queryClient } from '@/lib/queryClient';
import type { AuditLog, AuditActionType, AuditEntityType } from '@shared/schema';

const actionConfig: Record<string, { label: string; icon: typeof Check; color: string }> = {
  blog_published: { label: 'Publish', icon: Check, color: 'bg-green-500/20 text-green-500' },
  blog_created: { label: 'Create', icon: Plus, color: 'bg-blue-500/20 text-blue-500' },
  blog_updated: { label: 'Update', icon: Pencil, color: 'bg-yellow-500/20 text-yellow-500' },
  blog_deleted: { label: 'Delete', icon: Trash2, color: 'bg-red-500/20 text-red-500' },
  spotlight_auto_created: { label: 'Auto Create', icon: Zap, color: 'bg-purple-500/20 text-purple-500' },
  spotlight_created: { label: 'Create', icon: Plus, color: 'bg-blue-500/20 text-blue-500' },
  spotlight_updated: { label: 'Update', icon: Pencil, color: 'bg-yellow-500/20 text-yellow-500' },
  spotlight_deleted: { label: 'Delete', icon: Trash2, color: 'bg-red-500/20 text-red-500' },
  newsletter_auto_draft_created: { label: 'Auto Create', icon: Zap, color: 'bg-purple-500/20 text-purple-500' },
  newsletter_created: { label: 'Create', icon: Plus, color: 'bg-blue-500/20 text-blue-500' },
  newsletter_updated: { label: 'Update', icon: Pencil, color: 'bg-yellow-500/20 text-yellow-500' },
  newsletter_sent: { label: 'Send', icon: Send, color: 'bg-cyan-500/20 text-cyan-500' },
  newsletter_test_sent: { label: 'Test Send', icon: Send, color: 'bg-cyan-500/20 text-cyan-500' },
  newsletter_deleted: { label: 'Delete', icon: Trash2, color: 'bg-red-500/20 text-red-500' },
  template_created: { label: 'Create', icon: Plus, color: 'bg-blue-500/20 text-blue-500' },
  template_updated: { label: 'Update', icon: Pencil, color: 'bg-yellow-500/20 text-yellow-500' },
  template_deleted: { label: 'Delete', icon: Trash2, color: 'bg-red-500/20 text-red-500' },
  subscriber_created: { label: 'Create', icon: Plus, color: 'bg-blue-500/20 text-blue-500' },
  subscriber_updated: { label: 'Update', icon: Pencil, color: 'bg-yellow-500/20 text-yellow-500' },
  subscriber_unsubscribed: { label: 'Unsubscribe', icon: Trash2, color: 'bg-red-500/20 text-red-500' },
};

const entityConfig: Record<AuditEntityType, { label: string }> = {
  blog_post: { label: 'Blog Post' },
  spotlight: { label: 'Spotlight' },
  newsletter: { label: 'Newsletter' },
  template: { label: 'Template' },
  subscriber: { label: 'Subscriber' },
};

function getActionDescription(log: AuditLog): string {
  const meta = log.metaJson as Record<string, unknown> | undefined;
  const entityLabel = entityConfig[log.entityType]?.label || log.entityType;
  
  if (meta?.title) {
    return `${entityLabel}: "${meta.title}"`;
  }
  if (meta?.subject) {
    return `${entityLabel}: "${meta.subject}"`;
  }
  if (meta?.email) {
    return `${entityLabel}: ${meta.email}`;
  }
  
  return `${entityLabel} (${log.entityId.slice(0, 8)}...)`;
}

function LogEntrySkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

function LogEntry({ log }: { log: AuditLog }) {
  const action = actionConfig[log.actionType] || { label: log.actionType, icon: Pencil, color: 'bg-muted text-muted-foreground' };
  const entity = entityConfig[log.entityType] || { label: log.entityType };
  const ActionIcon = action.icon;
  const initials = log.actorName ? log.actorName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'SY';
  const timestamp = log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy h:mm a') : 'Unknown';
  const description = getActionDescription(log);

  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors" data-testid={`log-entry-${log.id}`}>
      <Avatar className="h-10 w-10">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge className={`flex items-center gap-1 ${action.color}`} data-testid={`badge-action-${log.id}`}>
            <ActionIcon className="h-3 w-3" />
            {action.label}
          </Badge>
          <Badge variant="outline" data-testid={`badge-entity-${log.id}`}>
            {entity.label}
          </Badge>
        </div>
        <p className="text-sm" data-testid={`text-description-${log.id}`}>
          {description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground" data-testid={`text-timestamp-${log.id}`}>
            {timestamp}
          </span>
          <span className="text-xs text-muted-foreground">by</span>
          <span className="text-xs font-medium" data-testid={`text-username-${log.id}`}>
            {log.actorName || 'System'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminAuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const { data: logs, isLoading, refetch, isFetching } = useQuery<AuditLog[]>({
    queryKey: ['/api/audit-logs'],
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/audit-logs'] });
    refetch();
  };

  const filteredLogs = logs?.filter((log) => {
    const description = getActionDescription(log);
    const matchesSearch = searchQuery === '' || 
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.actionType.includes(actionFilter);
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  }) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-page-title">
            <ClipboardList className="h-6 w-6" />
            Audit Log
          </h1>
          <p className="text-muted-foreground mt-1">Track all actions and changes in the system</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isFetching}
          data-testid="button-refresh"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>View and search through all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-action-filter">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="published">Publish</SelectItem>
                <SelectItem value="created">Create</SelectItem>
                <SelectItem value="updated">Update</SelectItem>
                <SelectItem value="deleted">Delete</SelectItem>
                <SelectItem value="sent">Send</SelectItem>
                <SelectItem value="auto">Auto Create</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-entity-filter">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog_post">Blog Post</SelectItem>
                <SelectItem value="spotlight">Spotlight</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px] border rounded-md">
            {isLoading ? (
              <div>
                {[...Array(8)].map((_, i) => (
                  <LogEntrySkeleton key={i} />
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No logs found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))
            )}
          </ScrollArea>

          {filteredLogs.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Showing {filteredLogs.length} of {logs?.length || 0} log entries
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
