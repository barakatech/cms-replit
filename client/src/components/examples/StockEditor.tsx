import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import StockEditor from '@/pages/stock-editor';

export default function StockEditorExample() {
  return (
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
  );
}
