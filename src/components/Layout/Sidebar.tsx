import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Phone,
  History,
  AudioLines,
  Settings,
  FileText,
  CreditCard,
  UserCog,
  BarChart3,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = {
  user: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Agentes', path: '/agents' },
    { icon: Phone, label: 'Chamadas Ativas', path: '/active-calls' },
    { icon: History, label: 'Histórico CDR', path: '/cdr' },
    { icon: AudioLines, label: 'Áudios', path: '/audios' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Agentes', path: '/agents' },
    { icon: Phone, label: 'Chamadas Ativas', path: '/active-calls' },
    { icon: History, label: 'CDR Global', path: '/cdr' },
    { icon: CreditCard, label: 'Planos', path: '/plans' },
    { icon: UserCog, label: 'Usuários', path: '/users' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Activity, label: 'Status Sistema', path: '/system-status' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ],
  reseller: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Agentes', path: '/agents' },
    { icon: Phone, label: 'Chamadas Ativas', path: '/active-calls' },
    { icon: History, label: 'Histórico CDR', path: '/cdr' },
    { icon: CreditCard, label: 'Planos', path: '/plans' },
    { icon: UserCog, label: 'Clientes', path: '/users' },
    { icon: FileText, label: 'Relatórios', path: '/reports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const items = user ? navItems[user.role] : navItems.user;

  return (
    <aside className={cn(
      "border-r border-border bg-card flex flex-col transition-all duration-300 ease-in-out relative",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-md hover:shadow-lg transition-smooth"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary shrink-0">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-lg block whitespace-nowrap">PABX Online</span>
              <span className="text-xs text-muted-foreground block whitespace-nowrap">Sistema de Chamadas</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-smooth text-sm font-medium group relative',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                  collapsed ? "mx-auto" : ""
                )} />
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-border">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover" />
                  </div>
                )}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-primary-foreground" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center gap-3 mb-3 px-3 py-2 rounded-xl hover:bg-accent transition-smooth cursor-pointer",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-primary">
            <span className="text-sm font-bold text-primary-foreground">
              {user?.name.charAt(0)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
