import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/hooks/use-theme';
import { UserProvider } from '@/lib/user-context';
import { AuthProvider } from '@/lib/auth-context';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import StockEditor from '@/pages/stock-editor';
import AdminStockEditor from '@/pages/admin-stock-editor';
import Assets from '@/pages/assets';
import Blog from '@/pages/blog';
import Banners from '@/pages/banners';
import StocksDirectory from '@/pages/stocks';
import StockDetail from '@/pages/stock-detail';
import StocksDiscover from '@/pages/stocks-discover';
import BlogHome from '@/pages/blog-home';
import Discover from '@/pages/discover';
import AdminDiscover from '@/pages/admin-discover';
import AdminPages from '@/pages/admin-pages';
import AdminAnalytics from '@/pages/admin-analytics';
import AdminMobileInstall from '@/pages/admin-mobile-install';
import AdminMarketingPixels from '@/pages/admin-marketing-pixels';
import AdminCTAPerformance from '@/pages/admin-cta-performance';
import AdminStocks from '@/pages/admin-stocks';
import AdminNewsletters from '@/pages/admin-newsletters';
import AdminNewsletterEdit from '@/pages/admin-newsletter-edit';
import AdminTemplates from '@/pages/admin-templates';
import AdminSchemaBlocks from '@/pages/admin-schema-blocks';
import AdminBlocksLibrary from '@/pages/admin-blocks-library';
import AdminSchemaBlockDefinitions from '@/pages/admin-schema-block-definitions';
import AdminSpotlights from '@/pages/admin-spotlights';
import AdminSubscribers from '@/pages/admin-subscribers';
import AdminSettings from '@/pages/admin-settings';
import AdminUsers from '@/pages/admin-users';
import AdminAuditLog from '@/pages/admin-audit-log';
import AdminCompliance from '@/pages/admin-compliance';
import PageBuilder from '@/pages/page-builder';
import LandingPagePublic from '@/pages/landing-page';
import StockThemePage from '@/pages/stock-theme';
import ThemesPage from '@/pages/themes';
import BrowseStocksPage from '@/pages/browse-stocks';
import ReferEarnPage from '@/pages/refer-earn';
import SignupPage from '@/pages/signup';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/discover" />} />
      <Route path="/discover" component={Discover} />
      <Route path="/stocks" component={StocksDiscover} />
      <Route path="/stocks/browse" component={BrowseStocksPage} />
      <Route path="/themes" component={ThemesPage} />
      <Route path="/stocks/themes" component={ThemesPage} />
      <Route path="/stocks/themes/:slug" component={StockThemePage} />
      <Route path="/themes/:slug" component={StockThemePage} />
      <Route path="/stocks/:slug" component={StockDetail} />
      <Route path="/blog" component={BlogHome} />
      <Route path="/refer" component={ReferEarnPage} />
      <Route path="/referral" component={ReferEarnPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={() => <Redirect to="/dashboard" />} />
      <Route path="/admin/stocks">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminStocks />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <Dashboard />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/editor/:ticker">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <TopBar />
                  <main className="flex-1 overflow-hidden">
                    <StockEditor />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/assets">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <Assets />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <Blog />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/banners">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <Banners />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/discover">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminDiscover />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/pages">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminPages />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/pages/:id/edit">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <main className="flex-1 overflow-hidden">
                    <PageBuilder />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/analytics">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminAnalytics />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/analytics/cta-performance">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminCTAPerformance />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/mobile-install">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminMobileInstall />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/marketing-pixels">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminMarketingPixels />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/newsletters">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminNewsletters />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/newsletters/:id">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminNewsletterEdit />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/subscribers">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminSubscribers />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/templates">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminTemplates />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/schema-blocks">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminSchemaBlocks />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blocks-library">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminBlocksLibrary />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/schema-block-definitions">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminSchemaBlockDefinitions />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/spotlights">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminSpotlights />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/compliance/:rest*">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminCompliance />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/compliance">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminCompliance />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminSettings />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminUsers />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/audit-log">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <main className="flex-1 overflow-auto">
                    <AdminAuditLog />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/stocks/:id/edit">
        {() => (
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <TopBar />
                  <main className="flex-1 overflow-hidden">
                    <AdminStockEditor />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/p/:slug" component={LandingPagePublic} />
      <Route path="/p/:slug/preview" component={LandingPagePublic} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <UserProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
