import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import Assets from '@/pages/assets';

export default function AssetsExample() {
  return (
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
  );
}
