import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Plus, 
  Edit, 
  Trash2,
  Settings2,
  FileCode,
  TrendingUp,
  Calendar,
  Briefcase,
  Image,
  BookOpen,
  BarChart3
} from 'lucide-react';
import type { SchemaBlockDefinition } from '@shared/schema';

type ViewMode = 'list' | 'editor';

const BLOCK_TYPE_ICONS: Record<string, typeof TrendingUp> = {
  'stock_list_manual': TrendingUp,
  'options_ideas_manual': Briefcase,
  'market_snapshot_manual': BarChart3,
  'top_themes_manual': TrendingUp,
  'econ_calendar_manual': Calendar,
  'earnings_watch_manual': BarChart3,
  'education_card': BookOpen,
  'promo_banner': Image,
};

interface EditingDefinition {
  blockType: string;
  name: string;
  description: string;
  defaultSchemaJson: Record<string, unknown>;
  defaultSettingsJson: Record<string, unknown>;
}

export default function AdminSchemaBlockDefinitions() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDefinition, setSelectedDefinition] = useState<SchemaBlockDefinition | null>(null);
  const [editingDefinition, setEditingDefinition] = useState<EditingDefinition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [definitionToDelete, setDefinitionToDelete] = useState<SchemaBlockDefinition | null>(null);

  const { data: definitions, isLoading } = useQuery<SchemaBlockDefinition[]>({
    queryKey: ['/api/schema-block-definitions'],
  });

  const createMutation = useMutation({
    mutationFn: (data: EditingDefinition) => 
      apiRequest('POST', '/api/schema-block-definitions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-block-definitions'] });
      toast({ title: 'Definition created' });
      setViewMode('list');
      setEditingDefinition(null);
      setSelectedDefinition(null);
    },
    onError: () => toast({ title: 'Failed to create definition', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditingDefinition> }) => 
      apiRequest('PUT', `/api/schema-block-definitions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-block-definitions'] });
      toast({ title: 'Definition updated' });
      setViewMode('list');
      setEditingDefinition(null);
      setSelectedDefinition(null);
    },
    onError: () => toast({ title: 'Failed to update definition', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/schema-block-definitions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schema-block-definitions'] });
      toast({ title: 'Definition deleted' });
      setDeleteDialogOpen(false);
      setDefinitionToDelete(null);
    },
    onError: () => toast({ title: 'Failed to delete definition', variant: 'destructive' }),
  });

  const handleCreate = () => {
    setSelectedDefinition(null);
    setEditingDefinition({
      blockType: '',
      name: '',
      description: '',
      defaultSchemaJson: {},
      defaultSettingsJson: {},
    });
    setViewMode('editor');
  };

  const handleEdit = (definition: SchemaBlockDefinition) => {
    setSelectedDefinition(definition);
    setEditingDefinition({
      blockType: definition.blockType,
      name: definition.name,
      description: definition.description || '',
      defaultSchemaJson: definition.defaultSchemaJson as Record<string, unknown> || {},
      defaultSettingsJson: definition.defaultSettingsJson as Record<string, unknown> || {},
    });
    setViewMode('editor');
  };

  const handleSave = () => {
    if (!editingDefinition) return;
    if (selectedDefinition) {
      updateMutation.mutate({ id: selectedDefinition.id, data: editingDefinition });
    } else {
      createMutation.mutate(editingDefinition);
    }
  };

  const handleDelete = (definition: SchemaBlockDefinition) => {
    setDefinitionToDelete(definition);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (definitionToDelete) {
      deleteMutation.mutate(definitionToDelete.id);
    }
  };

  const getBlockTypeIcon = (blockType: string) => {
    const IconComponent = BLOCK_TYPE_ICONS[blockType] || FileCode;
    return <IconComponent className="h-4 w-4" />;
  };

  if (viewMode === 'editor' && editingDefinition) {
    return (
      <div className="p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => {
              setViewMode('list');
              setEditingDefinition(null);
              setSelectedDefinition(null);
            }}
            data-testid="button-back"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedDefinition ? 'Edit Schema Block Definition' : 'Create Schema Block Definition'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Definition Details
            </CardTitle>
            <CardDescription>
              Define the canonical structure and default settings for this block type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Block Type ID</Label>
                <Input
                  value={editingDefinition.blockType}
                  onChange={(e) => setEditingDefinition({ ...editingDefinition, blockType: e.target.value })}
                  placeholder="e.g. stock_list_manual"
                  disabled={!!selectedDefinition}
                  data-testid="input-block-type"
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for this block type (cannot be changed after creation)
                </p>
              </div>
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={editingDefinition.name}
                  onChange={(e) => setEditingDefinition({ ...editingDefinition, name: e.target.value })}
                  placeholder="e.g. Stock List (Manual)"
                  data-testid="input-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editingDefinition.description}
                onChange={(e) => setEditingDefinition({ ...editingDefinition, description: e.target.value })}
                placeholder="Brief description of what this block type is used for"
                rows={2}
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label>Default Schema JSON</Label>
              <Textarea
                value={JSON.stringify(editingDefinition.defaultSchemaJson, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditingDefinition({ ...editingDefinition, defaultSchemaJson: parsed });
                  } catch {
                    // Allow invalid JSON during editing
                  }
                }}
                placeholder='{"field": {"required": true}}'
                rows={6}
                className="font-mono text-sm"
                data-testid="input-default-schema"
              />
              <p className="text-xs text-muted-foreground">
                JSON schema defining required fields and validation rules for this block type
              </p>
            </div>

            <div className="space-y-2">
              <Label>Default Settings JSON</Label>
              <Textarea
                value={JSON.stringify(editingDefinition.defaultSettingsJson, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditingDefinition({ ...editingDefinition, defaultSettingsJson: parsed });
                  } catch {
                    // Allow invalid JSON during editing
                  }
                }}
                placeholder='{"max_items": 10, "show_notes": true}'
                rows={6}
                className="font-mono text-sm"
                data-testid="input-default-settings"
              />
              <p className="text-xs text-muted-foreground">
                Default settings that will be used unless overridden at template or issue level
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave}
                disabled={!editingDefinition.blockType || !editingDefinition.name || createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Definition'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setViewMode('list');
                  setEditingDefinition(null);
                  setSelectedDefinition(null);
                }}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Schema Block Definitions</h1>
          <p className="text-muted-foreground">
            Manage canonical block structures and default settings for each block type
          </p>
        </div>
        <Button onClick={handleCreate} data-testid="button-create">
          <Plus className="h-4 w-4 mr-2" />
          Add Definition
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Block Type Definitions
          </CardTitle>
          <CardDescription>
            Each definition specifies the structure and default settings for a block type.
            Templates can override these defaults, and individual newsletter issues can override template settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : definitions && definitions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Default Settings</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {definitions.map((def) => (
                  <TableRow key={def.id} data-testid={`row-definition-${def.id}`}>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getBlockTypeIcon(def.blockType)}
                        {def.blockType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{def.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {def.description || '—'}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {Object.keys(def.defaultSettingsJson || {}).length} settings
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(def)}
                          data-testid={`button-edit-${def.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(def)}
                          data-testid={`button-delete-${def.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No schema block definitions found</p>
              <p className="text-sm mt-2">Create your first definition to establish block type defaults</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Schema Block Definition</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the definition for "{definitionToDelete?.name}"? 
              This will remove the default settings for this block type.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
