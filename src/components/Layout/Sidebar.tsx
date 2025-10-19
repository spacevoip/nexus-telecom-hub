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
      <div className={`p-4 border-b border-border ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg truncate">PABX Online</h1>
              <p className="text-xs text-muted-foreground truncate">Sistema de Chamadas</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  } ${collapsed && !isMobile ? 'justify-center' : ''}`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || isMobile) && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className={`p-4 border-t border-border ${collapsed && !isMobile ? 'px-2' : ''}`}>
        <div className={`flex items-start gap-3 mb-3 ${collapsed && !isMobile ? 'flex-col' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-accent-foreground">
              {user?.name.charAt(0)}
            </span>
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <p className="text-xs text-primary font-medium mt-0.5">
                {user?.role === 'admin' ? 'Administrador' : user?.role === 'reseller' ? 'Revenda' : 'Plano Profissional'}
              </p>
            </div>
          )}
          {(!collapsed || isMobile) && (
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-7 w-7"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
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
          )}
        </div>
        <Button
          variant="ghost"
          className={`w-full mt-3 justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
            collapsed && !isMobile ? 'px-2' : ''
          }`}
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || isMobile) && <span className="ml-2">Sair</span>}
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
