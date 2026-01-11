import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/wedding/AppSidebar';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-[#F5F5DC]/80 backdrop-blur-md border-b border-border/50 px-4 h-16 relative flex items-center">
            
            {/* Menu Icon (Left Aligned) */}
            {/* Added relative and z-10 to ensure it sits above the centered text layer if screens are small */}
            <SidebarTrigger className="relative z-10 p-2 rounded-lg hover:bg-black/5 transition-colors h-10 w-10 [&_svg]:size-6">
              <Menu className="w-6 h-6 text-foreground" />
            </SidebarTrigger>
            
            {/* Centered Text Container */}
            {/* Using absolute positioning ensures this is dead-center relative to the screen, not the icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <h1 className="font-script text-2xl text-foreground leading-none">
                Sarah & Samad
              </h1>
              <p className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
                2nd August 2026
              </p>
            </div>
            
          </div>
          
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}