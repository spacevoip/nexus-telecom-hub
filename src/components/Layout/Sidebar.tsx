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
      <div className={`py-4 px-4 border-b border-border/50 ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Phone className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-base truncate text-foreground">PABX Online</h1>
              <p className="text-[11px] text-muted-foreground/80 truncate">Sistema de Chamadas</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-0.5">
          {items.map((item, index) => {
            const showDivider = user?.role === 'admin' && (index === 4 || index === 7 || index === 9);
            return (
              <li key={item.path}>
                {showDivider && <div className="h-px bg-border/40 my-2 mx-2" />}
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-md transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    } ${collapsed && !isMobile ? 'justify-center px-2' : ''}`
                  }
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {(!collapsed || isMobile) && (
                    <span className="font-medium text-[13px] tracking-wide">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className={`p-3 border-t border-border/50 bg-muted/20 ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className={`flex items-start gap-2.5 mb-2 ${collapsed && !isMobile ? 'flex-col' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-[13px] font-semibold text-primary-foreground">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[13px] truncate text-foreground">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground/80 truncate">{user?.email}</p>
              <p className="text-[11px] text-primary font-medium mt-0.5">
                {user?.role === 'admin' ? 'Administrador' : user?.role === 'reseller' ? 'Revenda' : 'Plano Profissional'}
              </p>
            </div>
          )}
          {(!collapsed || isMobile) && (
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-7 w-7 hover:bg-background/80"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-7 w-7 hover:bg-background/80"
              >
                {theme === 'light' ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-8 ${
            collapsed && !isMobile ? 'px-2' : ''
          }`}
          onClick={logout}
        >
          <LogOut className="w-3.5 h-3.5" />
          {(!collapsed || isMobile) && <span className="ml-2 text-[13px]">Sair</span>}
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
        collapsed ? 'w-16' : 'w-64'
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
