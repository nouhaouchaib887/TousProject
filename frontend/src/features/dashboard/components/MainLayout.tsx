import React from 'react';
import AppSidebar from '../../../components/layout/AppSideBar';
import Topbar from '../../../components/layout/AppTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // Le Provider doit être TOUT en haut
    <SidebarProvider> 
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
        
        {/* 1. La Sidebar */}
        <AppSidebar  />

        {/* 2. La zone de droite */}
        <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden relative">
          
          <Topbar />

          <main className="flex-1 overflow-hidden p-8">
            <div className="h-full overflow-y-auto overflow-x-hidden">
              <div className="max-w-7xl mx-auto px-4">
                {children}
              </div>
            </div>
          </main>
          
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
