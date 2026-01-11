import { Home, MessageSquare, Trash2, Heart } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
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
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary fill-primary/20" />
          </div>
          <div>
            <h1 className="font-script text-2xl text-foreground leading-none">
              Sarah & Samad's
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">RSVP Manager</p>
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
                            ? "bg-primary/10 text-primary" 
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

      <SidebarFooter className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          Sarah & Samad • August 2026
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}