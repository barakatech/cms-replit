import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, MoreHorizontal, Shield, Edit3, Eye, Trash2, Mail, UserPlus, PenLine, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import type { CmsTeamMember, CmsTeamMemberRole } from '@shared/schema';

const inviteFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

const roleConfig: Record<CmsTeamMemberRole, { label: string; icon: typeof Shield; variant: 'default' | 'secondary' | 'outline'; color: string }> = {
  admin: { label: 'ADMIN', icon: Shield, variant: 'default', color: 'bg-primary text-primary-foreground' },
  editor: { label: 'EDITOR', icon: Edit3, variant: 'secondary', color: 'bg-blue-500/20 text-blue-500' },
  viewer: { label: 'VIEWER', icon: Eye, variant: 'outline', color: 'bg-muted text-muted-foreground' },
};

const rolePermissions = [
  {
    role: 'ADMIN',
    icon: Shield,
    color: 'text-primary',
    description: 'Full access including user management and settings',
    permissions: ['Manage all content', 'User management', 'System settings', 'View analytics', 'Publish content'],
  },
  {
    role: 'EDITOR',
    icon: Edit3,
    color: 'text-blue-500',
    description: 'Can manage content (blogs, newsletters, spotlights)',
    permissions: ['Create & edit content', 'Publish blogs', 'Manage newsletters', 'Create spotlights', 'View analytics'],
  },
  {
    role: 'VIEWER',
    icon: Eye,
    color: 'text-muted-foreground',
    description: 'Read-only access',
    permissions: ['View all content', 'View analytics', 'Download reports'],
  },
];

function UserCard({ member, onEdit, onChangeRole, onSendEmail, onDelete }: { 
  member: CmsTeamMember; 
  onEdit: () => void; 
  onChangeRole: () => void;
  onSendEmail: () => void;
  onDelete: () => void;
}) {
  const roleInfo = roleConfig[member.role];
  const RoleIcon = roleInfo.icon;
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const joinedDate = member.joinedAt ? format(new Date(member.joinedAt), 'MMM yyyy') : 'Unknown';

  return (
    <Card className="relative hover-elevate" data-testid={`card-user-${member.id}`}>
      <CardContent className="p-6">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid={`button-user-menu-${member.id}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit} data-testid={`menu-edit-${member.id}`}>
                <PenLine className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onChangeRole} data-testid={`menu-change-role-${member.id}`}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSendEmail} data-testid={`menu-send-email-${member.id}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive"
                data-testid={`menu-delete-${member.id}`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg" data-testid={`text-user-name-${member.id}`}>{member.name}</h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-user-email-${member.id}`}>{member.email}</p>
          </div>

          <div className="flex items-center justify-between w-full mt-2">
            <Badge 
              className={`flex items-center gap-1 ${roleInfo.color}`}
              data-testid={`badge-role-${member.id}`}
            >
              <RoleIcon className="h-3 w-3" />
              {roleInfo.label}
            </Badge>
            <span className="text-sm text-muted-foreground">Joined {joinedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InviteCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="border-dashed cursor-pointer hover-elevate"
      onClick={onClick}
      data-testid="card-invite-user"
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] gap-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold">Invite Team Member</h3>
          <p className="text-sm text-muted-foreground">Add a new user to your team</p>
        </div>
      </CardContent>
    </Card>
  );
}

function UserCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center justify-between w-full mt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RolePermissionsCard() {
  return (
    <Card data-testid="card-role-permissions">
      <CardHeader>
        <CardTitle className="text-lg">Role Permissions</CardTitle>
        <CardDescription>What each role can do in the CMS</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rolePermissions.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.role} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${role.color}`} />
                  <span className="font-semibold">{role.role}</span>
                </div>
                <p className="text-sm text-muted-foreground">{role.description}</p>
                <ul className="space-y-1">
                  {role.permissions.map((perm) => (
                    <li key={perm} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState<CmsTeamMember | null>(null);
  const [changeRoleMember, setChangeRoleMember] = useState<CmsTeamMember | null>(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<CmsTeamMember | null>(null);

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
    },
  });

  const { data: members, isLoading } = useQuery<CmsTeamMember[]>({
    queryKey: ['/api/team-members'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InviteFormData) => apiRequest('POST', '/api/team-members', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      toast({ title: 'Invitation sent', description: 'Team member has been invited.' });
      setInviteDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to invite team member.', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CmsTeamMember> }) => 
      apiRequest('PATCH', `/api/team-members/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      toast({ title: 'User updated', description: 'Team member has been updated.' });
      setEditMember(null);
      setChangeRoleMember(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update team member.', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/team-members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      toast({ title: 'User removed', description: 'Team member has been removed.' });
      setDeleteConfirmMember(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to remove team member.', variant: 'destructive' });
    },
  });

  const handleInviteSubmit = (data: InviteFormData) => {
    createMutation.mutate(data);
  };

  const handleRoleChange = (memberId: string, newRole: CmsTeamMemberRole) => {
    updateMutation.mutate({ id: memberId, data: { role: newRole } });
  };

  const handleSendEmail = (member: CmsTeamMember) => {
    window.location.href = `mailto:${member.email}`;
    toast({ title: 'Opening email client', description: `Composing email to ${member.name}` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Users</h1>
          <p className="text-muted-foreground mt-1">Manage team members and their permissions</p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)} data-testid="button-invite-user">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <UserCardSkeleton />
            <UserCardSkeleton />
            <UserCardSkeleton />
          </>
        ) : (
          <>
            {members?.map((member) => (
              <UserCard
                key={member.id}
                member={member}
                onEdit={() => setEditMember(member)}
                onChangeRole={() => setChangeRoleMember(member)}
                onSendEmail={() => handleSendEmail(member)}
                onDelete={() => setDeleteConfirmMember(member)}
              />
            ))}
            <InviteCard onClick={() => setInviteDialogOpen(true)} />
          </>
        )}
      </div>

      <RolePermissionsCard />

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent data-testid="dialog-invite-user">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your CMS team.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInviteSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} data-testid="input-invite-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} data-testid="input-invite-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-invite-role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin - Full access
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            <Edit3 className="h-4 w-4" />
                            Editor - Content management
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Viewer - Read-only access
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-send-invite">
                  <Mail className="h-4 w-4 mr-2" />
                  {createMutation.isPending ? 'Sending...' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!changeRoleMember} onOpenChange={() => setChangeRoleMember(null)}>
        <DialogContent data-testid="dialog-change-role">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Select a new role for {changeRoleMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select 
              value={changeRoleMember?.role} 
              onValueChange={(value) => changeRoleMember && handleRoleChange(changeRoleMember.id, value as CmsTeamMemberRole)}
            >
              <SelectTrigger data-testid="select-change-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin - Full access
                  </div>
                </SelectItem>
                <SelectItem value="editor">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Editor - Content management
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Viewer - Read-only access
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleMember(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editMember} onOpenChange={() => setEditMember(null)}>
        <DialogContent data-testid="dialog-edit-user">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update details for {editMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={editMember?.avatarUrl} alt={editMember?.name} />
                <AvatarFallback>{editMember?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{editMember?.name}</p>
                <p className="text-sm text-muted-foreground">{editMember?.email}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              User details can be edited in the user's profile settings. Use the "Change Role" option to update permissions.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMember(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmMember} onOpenChange={() => setDeleteConfirmMember(null)}>
        <DialogContent data-testid="dialog-confirm-delete">
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {deleteConfirmMember?.name} from the team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmMember(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmMember && deleteMutation.mutate(deleteConfirmMember.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Removing...' : 'Remove User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
