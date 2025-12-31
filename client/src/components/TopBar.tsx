import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

export default function TopBar() {
  const [uiLang, setUiLang] = useState<'EN' | 'AR'>('EN');
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-20">
      <SidebarTrigger data-testid="button-sidebar-toggle" />
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <div className="flex gap-1">
          <Badge
            variant={uiLang === 'EN' ? 'default' : 'outline'}
            className="cursor-pointer no-default-hover-elevate"
            onClick={() => setUiLang('EN')}
            data-testid="button-lang-en"
          >
            EN
          </Badge>
          <Badge
            variant={uiLang === 'AR' ? 'default' : 'outline'}
            className="cursor-pointer no-default-hover-elevate"
            onClick={() => setUiLang('AR')}
            data-testid="button-lang-ar"
          >
            AR
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
