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
import { LayoutDashboard, FileText, Image, Settings, BookOpen, Megaphone, Compass, Layers } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, testId: 'link-dashboard' },
  { title: 'Discover Page', url: '/admin/discover', icon: Compass, testId: 'link-discover' },
  { title: 'Landing Pages', url: '/admin/pages', icon: Layers, testId: 'link-landing-pages' },
  { title: 'Stock Pages', url: '/dashboard', icon: FileText, testId: 'link-stock-pages' },
  { title: 'Blog', url: '/admin/blog', icon: BookOpen, testId: 'link-blog' },
  { title: 'Banners', url: '/banners', icon: Megaphone, testId: 'link-banners' },
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
