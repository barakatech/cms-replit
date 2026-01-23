import { useState } from 'react';
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LayoutDashboard, FileText, Image, Settings, BookOpen, Megaphone, Compass, Layers, BarChart3, Smartphone, Radio, ExternalLink, ChevronDown, Mail, Sparkles, LayoutTemplate, Users, ClipboardList, Shield, Newspaper } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, testId: 'link-dashboard' },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3, testId: 'link-analytics' },
  { title: 'Discover Page', url: '/admin/discover', icon: Compass, testId: 'link-discover' },
  { title: 'Landing Pages', url: '/admin/pages', icon: Layers, testId: 'link-landing-pages' },
  { title: 'Stock Pages', url: '/admin/stocks', icon: FileText, testId: 'link-stock-pages' },
];

const blogSubItems = [
  { title: 'Blog Posts', url: '/admin/blog', icon: BookOpen, testId: 'link-blog-posts' },
  { title: 'Stories', url: '/admin/stories', icon: Newspaper, testId: 'link-stories' },
  { title: 'Newsletters', url: '/admin/newsletters', icon: Mail, testId: 'link-newsletters' },
  { title: 'Spotlights', url: '/admin/spotlights', icon: Sparkles, testId: 'link-spotlights' },
  { title: 'Templates', url: '/admin/templates', icon: LayoutTemplate, testId: 'link-templates' },
  { title: 'Subscribers', url: '/admin/subscribers', icon: Users, testId: 'link-subscribers' },
];

const bottomMenuItems = [
  { title: 'Banners', url: '/banners', icon: Megaphone, testId: 'link-banners' },
  { title: 'Mobile Install', url: '/admin/mobile-install', icon: Smartphone, testId: 'link-mobile-install' },
  { title: 'Marketing Pixels', url: '/admin/marketing-pixels', icon: Radio, testId: 'link-marketing-pixels' },
  { title: 'Assets', url: '/assets', icon: Image, testId: 'link-assets' },
];

const adminSubItems = [
  { title: 'Users', url: '/admin/users', icon: Shield, testId: 'link-users' },
  { title: 'Compliance', url: '/admin/compliance', icon: Shield, testId: 'link-compliance' },
  { title: 'Audit Log', url: '/admin/audit-log', icon: ClipboardList, testId: 'link-audit-log' },
  { title: 'Settings', url: '/admin/settings', icon: Settings, testId: 'link-settings' },
];

export function AppSidebar() {
  const [location] = useLocation();
  const isBlogSectionActive = blogSubItems.some(item => location.startsWith(item.url));
  const isAdminSectionActive = adminSubItems.some(item => location.startsWith(item.url));
  const [blogOpen, setBlogOpen] = useState(isBlogSectionActive);
  const [adminOpen, setAdminOpen] = useState(isAdminSectionActive);

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

              <Collapsible open={blogOpen} onOpenChange={setBlogOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="link-blog-section" className={isBlogSectionActive ? 'bg-sidebar-accent' : ''}>
                      <BookOpen className="h-4 w-4" />
                      <span>Blog & Content</span>
                      <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${blogOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {blogSubItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={location === item.url || location.startsWith(item.url)}>
                            <Link href={item.url} data-testid={item.testId}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="link-admin-section" className={isAdminSectionActive ? 'bg-sidebar-accent' : ''}>
                      <Settings className="h-4 w-4" />
                      <span>Administration</span>
                      <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {adminSubItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={location === item.url || location.startsWith(item.url)}>
                            <Link href={item.url} data-testid={item.testId}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/discover" data-testid="link-back-to-site">
                <ExternalLink />
                <span>Back to Main Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
