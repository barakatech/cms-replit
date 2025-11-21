import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import StockEditor from '@/pages/stock-editor';
import Assets from '@/pages/assets';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
