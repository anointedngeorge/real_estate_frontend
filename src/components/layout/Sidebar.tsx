import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserCircle,
  Building2,
  TrendingUp,
  CreditCard,
  BarChart3,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useDashboard } from '@/context/DashboardContext';
import { systemSettings } from '@/lib/axios_functions';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: UserCheck, label: 'Realtors', path: '/realtors' },
  { icon: UserCircle, label: 'Clients', path: '/clients' },
  { icon: Building2, label: 'Properties', path: '/properties' },
  { icon: TrendingUp, label: 'Sales', path: '/sales' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Share2, label: 'Marketing', path: '/marketing' },
];

const settingsNavItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['main']);
  
  const location = useLocation();

  const { user } = useDashboard();
  const settings = systemSettings();
  

  const fullname = user?.data?.first_name + " " + user?.data?.last_name;
  

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  const NavItem = ({ icon: Icon, label, path }: { icon: typeof LayoutDashboard; label: string; path: string }) => {
    const isActive = location.pathname === path;
    
    return (
      <NavLink
        to={path}
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent text-sidebar-primary",
          collapsed && "justify-center px-2"
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sidebar-primary rounded-r" />
        )}
        <Icon className={cn("h-5 w-5 shrink-0", collapsed ? "mr-0" : "")} />
        {!collapsed && <span>{label}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b border-sidebar-border px-4",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
            A
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">{settings?.company_name}</span>
              {/* <span className="text-xs text-sidebar-muted">Estate & Property</span> */}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Collapsible
          open={openGroups.includes('main')}
          onOpenChange={() => toggleGroup('main')}
        >
          {!collapsed && (
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground">
                <span>Main Menu</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  openGroups.includes('main') && "rotate-180"
                )} />
              </button>
            </CollapsibleTrigger>
          )}
          <CollapsibleContent className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="my-4 border-t border-sidebar-border" />

        <div className="space-y-1">
          {settingsNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        <div className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2",
          collapsed && "justify-center px-2"
        )}>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="User"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-sidebar-border"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-sidebar" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{fullname.toUpperCase()}</p>
              <p className="text-xs text-sidebar-muted truncate">{user?.user?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  );
}
