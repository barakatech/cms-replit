import { Link, useLocation } from 'wouter';
import { TrendingUp, BookOpen, RefreshCw, Moon, Sun, Landmark, Bitcoin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

interface BarakaHeaderProps {
  showTradeCTA?: boolean;
  tradeTicker?: string;
  tradeLabel?: string;
}

export default function BarakaHeader({ showTradeCTA, tradeTicker, tradeLabel }: BarakaHeaderProps = {}) {
  const [location] = useLocation();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const navItems = [
    { href: '/stocks', label: language === 'en' ? 'Stocks' : 'الأسهم', icon: TrendingUp },
    { href: '/bonds', label: language === 'en' ? 'Bonds' : 'السندات', icon: Landmark },
    { href: '/crypto', label: language === 'en' ? 'Crypto' : 'العملات', icon: Bitcoin },
    { href: '/blog', label: language === 'en' ? 'Learn' : 'تعلم', icon: BookOpen },
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
                    data-testid={`nav-${item.href.slice(1)}`}
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
          {showTradeCTA && tradeTicker && (
            <Link href="/signup">
              <Button 
                variant="default" 
                size="sm" 
                className="font-medium gap-1"
                data-testid="header-trade-cta"
              >
                <TrendingUp className="h-4 w-4" />
                {tradeLabel || `Trade ${tradeTicker}`}
              </Button>
            </Link>
          )}
          
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
            className="font-medium gap-1"
            onClick={toggleLanguage}
            data-testid="button-language"
          >
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'AR' : 'EN'}
          </Button>
        </div>
      </div>
    </header>
  );
}
