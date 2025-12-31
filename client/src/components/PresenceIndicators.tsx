import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import type { UserPresence } from '@shared/schema';

interface PresenceAvatarsProps {
  presences: UserPresence[];
  maxVisible?: number;
}

export function PresenceAvatars({ presences, maxVisible = 5 }: PresenceAvatarsProps) {
  if (presences.length === 0) return null;

  const visible = presences.slice(0, maxVisible);
  const overflow = presences.length - maxVisible;

  return (
    <div className="flex items-center gap-1" data-testid="presence-avatars">
      <div className="flex -space-x-2">
        {visible.map((presence) => (
          <Tooltip key={presence.id}>
            <TooltipTrigger asChild>
              <div 
                className="relative"
                style={{ zIndex: visible.length - visible.indexOf(presence) }}
              >
                <Avatar 
                  className="h-7 w-7 border-2 border-background"
                  style={{ borderColor: presence.userColor }}
                >
                  <AvatarImage src={presence.avatarUrl} alt={presence.userName} />
                  <AvatarFallback 
                    style={{ backgroundColor: presence.userColor }}
                    className="text-white text-xs font-medium"
                  >
                    {presence.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span 
                  className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background"
                  aria-label="Online"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="font-medium">{presence.userName}</p>
              {presence.field && (
                <p className="text-xs text-muted-foreground">
                  Editing: {presence.field}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      {overflow > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
              +{overflow}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{overflow} more editor{overflow > 1 ? 's' : ''}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

interface PresenceBadgeProps {
  presences: UserPresence[];
}

export function PresenceBadge({ presences }: PresenceBadgeProps) {
  if (presences.length === 0) return null;

  return (
    <Badge 
      variant="outline" 
      className="gap-1 text-xs"
      data-testid="presence-badge"
    >
      <span 
        className="h-2 w-2 rounded-full bg-green-500 animate-pulse" 
        aria-hidden="true"
      />
      {presences.length} editing
    </Badge>
  );
}

interface FieldPresenceIndicatorProps {
  presences: UserPresence[];
  field: string;
}

export function FieldPresenceIndicator({ presences, field }: FieldPresenceIndicatorProps) {
  const editingField = presences.filter(p => p.field === field);
  
  if (editingField.length === 0) return null;

  return (
    <div 
      className="flex items-center gap-1 text-xs text-muted-foreground"
      data-testid={`field-presence-${field}`}
    >
      <div className="flex -space-x-1">
        {editingField.slice(0, 3).map((presence) => (
          <Tooltip key={presence.id}>
            <TooltipTrigger asChild>
              <Avatar 
                className="h-5 w-5 border border-background"
                style={{ borderColor: presence.userColor }}
              >
                <AvatarFallback 
                  style={{ backgroundColor: presence.userColor }}
                  className="text-white text-[10px]"
                >
                  {presence.userName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{presence.userName} is editing</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <span className="ml-1">
        {editingField.length === 1 
          ? `${editingField[0].userName} is editing`
          : `${editingField.length} people editing`
        }
      </span>
    </div>
  );
}

interface ActiveEditorsBarProps {
  presences: UserPresence[];
  contentType: string;
}

export function ActiveEditorsBar({ presences, contentType }: ActiveEditorsBarProps) {
  if (presences.length === 0) return null;

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'stock': return 'stock page';
      case 'blog': return 'blog post';
      case 'banner': return 'banner';
      case 'discover': return 'discover settings';
      default: return 'content';
    }
  };

  return (
    <div 
      className="flex items-center justify-between px-4 py-2 bg-accent/50 border-b"
      data-testid="active-editors-bar"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Currently editing this {getContentTypeLabel()}:
        </span>
        <PresenceAvatars presences={presences} />
      </div>
      <span className="text-xs text-muted-foreground">
        Changes sync in real-time
      </span>
    </div>
  );
}

interface PresenceConnectionStatusProps {
  isConnected: boolean;
}

export function PresenceConnectionStatus({ isConnected }: PresenceConnectionStatusProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}
          data-testid="presence-connection-status"
        />
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isConnected ? 'Connected - Real-time sync active' : 'Reconnecting...'}
      </TooltipContent>
    </Tooltip>
  );
}
