import { Link, useLocation } from 'wouter';
import { TrendingUp, BookOpen, RefreshCw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';

export default function BarakaHeader() {
  const [location] = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { href: '/stocks', label: 'Stocks', icon: TrendingUp },
    { href: '/blog', label: 'Learn', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/discover">
            <span className="text-xl font-bold text-primary cursor-pointer" data-testid="link-baraka-logo">
              baraka
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" data-testid="nav-admin">
                Admin
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.reload()}
            data-testid="button-refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="font-medium"
            data-testid="button-language"
          >
            AR
          </Button>
        </div>
      </div>
    </header>
  );
}
