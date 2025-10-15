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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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

  const items = user ? navItems[user.role] : navItems.user;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">PABX Online</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth text-sm font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {user?.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
