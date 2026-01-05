import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/hooks/use-theme';
import { UserProvider } from '@/lib/user-context';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
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
import AdminStocks from '@/pages/admin-stocks';
import PageBuilder from '@/pages/page-builder';
import LandingPagePublic from '@/pages/landing-page';
import StockThemePage from '@/pages/stock-theme';
import ThemesPage from '@/pages/themes';
import BrowseStocksPage from '@/pages/browse-stocks';
import ReferEarnPage from '@/pages/refer-earn';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/discover" />} />
      <Route path="/discover" component={Discover} />
      <Route path="/stocks" component={StocksDiscover} />
      <Route path="/stocks/browse" component={BrowseStocksPage} />
      <Route path="/themes" component={ThemesPage} />
      <Route path="/stocks/themes/:slug" component={StockThemePage} />
      <Route path="/themes/:slug" component={StockThemePage} />
      <Route path="/stocks/:slug" component={StockDetail} />
      <Route path="/blog" component={BlogHome} />
      <Route path="/refer" component={ReferEarnPage} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={() => <Redirect to="/dashboard" />} />
      <Route path="/admin/stocks">
        {() => (
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
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
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
        )}
      </Route>
      <Route path="/editor/:ticker">
        {() => (
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
        )}
      </Route>
      <Route path="/assets">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
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
        )}
      </Route>
      <Route path="/banners">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/discover">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/pages">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/pages/:id/edit">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/analytics">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/mobile-install">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/marketing-pixels">
        {() => (
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
        )}
      </Route>
      <Route path="/admin/stocks/:id/edit">
        {() => (
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
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
