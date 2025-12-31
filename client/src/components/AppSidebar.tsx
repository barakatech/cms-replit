import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Image, Settings, BookOpen, Megaphone, Compass, Layers, BarChart3, Smartphone } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, testId: 'link-dashboard' },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3, testId: 'link-analytics' },
  { title: 'Discover Page', url: '/admin/discover', icon: Compass, testId: 'link-discover' },
  { title: 'Landing Pages', url: '/admin/pages', icon: Layers, testId: 'link-landing-pages' },
  { title: 'Stock Pages', url: '/admin/stocks', icon: FileText, testId: 'link-stock-pages' },
  { title: 'Blog', url: '/admin/blog', icon: BookOpen, testId: 'link-blog' },
  { title: 'Banners', url: '/banners', icon: Megaphone, testId: 'link-banners' },
  { title: 'Mobile Install', url: '/admin/mobile-install', icon: Smartphone, testId: 'link-mobile-install' },
  { title: 'Assets', url: '/assets', icon: Image, testId: 'link-assets' },
  { title: 'Settings', url: '#', icon: Settings, testId: 'link-settings' },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary px-4 py-3">
            baraka CMS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
