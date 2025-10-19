import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  Phone,
  FileText,
  Mic,
  Settings,
  Activity,
  BarChart3,
  UserPlus,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  UserCog,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Navigation items by role
const navItems = {
  user: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Agentes', path: '/agents' },
    { icon: Phone, label: 'Chamadas Ativas', path: '/active-calls' },
    { icon: FileText, label: 'CDR', path: '/cdr' },
    { icon: Mic, label: 'Áudios', path: '/audios' },
    { icon: CreditCard, label: 'Planos', path: '/plans' },
    { icon: BarChart3, label: 'Desempenho', path: '/performance' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Usuários', path: '/users' },
    { icon: UserPlus, label: 'Agentes', path: '/agents' },
    { icon: UserCog, label: 'Agentes Clientes', path: '/client-agents' },
    { icon: Phone, label: 'Chamadas Ativas', path: '/active-calls' },
    { icon: FileText, label: 'CDR', path: '/cdr' },
    { icon: Mic, label: 'Áudios', path: '/audios' },
    { icon: CreditCard, label: 'Planos', path: '/plans' },
    { icon: CreditCard, label: 'Tarifas', path: '/rates' },
    { icon: Activity, label: 'Status Sistema', path: '/system-status' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ],
  reseller: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Clientes', path: '/users' },
    { icon: UserCog, label: 'Agentes Clientes', path: '/client-agents' },
    { icon: CreditCard, label: 'Planos', path: '/plans' },
    { icon: CreditCard, label: 'Tarifas', path: '/rates' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[user?.role as keyof typeof navItems] || navItems.user;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`py-6 px-4 border-b border-border ${collapsed && !isMobile ? 'px-3' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base text-foreground">PABX Online</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1.5">
          {items.map((item, index) => {
            const showDivider = user?.role === 'admin' && (index === 4 || index === 7 || index === 9);
            return (
              <li key={item.path}>
                {showDivider && <div className="h-px bg-border/60 my-3 mx-2" />}
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    } ${collapsed && !isMobile ? 'justify-center px-2' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section - Compacta */}
      <div className={`p-3 border-t border-border space-y-2 ${collapsed && !isMobile ? 'px-2' : ''}`}>
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary-foreground">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
              >
                <Bell className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-7 w-7"
              >
                {theme === 'light' ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}
        
        {(collapsed && !isMobile) && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-8"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-full h-8"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-8 ${
            collapsed && !isMobile ? 'px-2' : ''
          }`}
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || isMobile) && <span className="ml-2 text-sm">Sair</span>}
        </Button>
      </div>
    </>
  );

  // Mobile version with Sheet
  if (isMobile) {
    return (
      <>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 md:hidden bg-card border border-border shadow-lg"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop version
  return (
    <aside
      className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full border border-border bg-card shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      <SidebarContent />
    </aside>
  );
}
