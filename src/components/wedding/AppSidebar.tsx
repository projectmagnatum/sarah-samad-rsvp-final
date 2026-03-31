import { Home, MessageSquare, Trash2, Heart, LogOut } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar, // Import the hook to control sidebar state
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Responses', url: '/responses', icon: MessageSquare },
  { title: 'Deleted', url: '/deleted', icon: Trash2 },
];

export function AppSidebar() {
  const location = useLocation();
  // We use this hook to close the mobile menu when a link is clicked
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="border-r border-[color-mix(in_srgb,var(--border)_50%,transparent)]">
      <SidebarHeader className="p-6 border-b border-[color-mix(in_srgb,var(--border)_50%,transparent)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] flex items-center justify-center">
            <Heart className="w-5 h-5 text-heading fill-[color-mix(in_srgb,var(--theme)_10%,transparent)]" />
          </div>
          <div>
            <h1 className="font-script text-2xl text-heading leading-none">
              {import.meta.env.VITE_COUPLE_NAME}
            </h1>
            <p className="text-xs text-muted-theme mt-0.5">RSVP Manager</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        // This closes the menu automatically on mobile
                        onClick={() => setOpenMobile(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                          isActive 
                            ? "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        activeClassName=""
                      >
                        <item.icon className={cn(
                          "w-5 h-5",
                          isActive && "text-primary"
                        )} />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-[color-mix(in_srgb,var(--border)_50%,transparent)]">
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
        <p className="text-xs text-muted-theme text-center mt-3">
          {import.meta.env.VITE_WEDDING_DATE}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}