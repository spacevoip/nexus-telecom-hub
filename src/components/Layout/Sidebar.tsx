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
  CreditCard,
  UserCog,
  User,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[user?.role as keyof typeof navItems] || navItems.user;

  const FloatingContent = () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-full py-6 px-3">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-primary/90 flex items-center justify-center shadow-lg">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {items.map((item, index) => {
            const showDivider = user?.role === 'admin' && (index === 4 || index === 7 || index === 9);
            return (
              <div key={item.path}>
                {showDivider && <div className="h-px bg-border/30 my-6" />}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-center w-11 h-11 mx-auto rounded-2xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                            : 'text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground hover:scale-105'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-border/30">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-11 h-11 rounded-2xl mx-auto hover:scale-105 transition-transform"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>Tema</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 rounded-2xl mx-auto hover:scale-105 transition-transform"
              >
                <User className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{user?.name}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );

  const MobileSidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm text-foreground">PABX Online</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-0.5">
          {items.map((item, index) => {
            const showDivider = user?.role === 'admin' && (index === 4 || index === 7 || index === 9);
            return (
              <li key={item.path}>
                {showDivider && <div className="h-px bg-border/40 my-2" />}
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary-foreground">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-9"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
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
              className="fixed top-4 left-4 z-50 md:hidden bg-card border border-border shadow-lg rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <MobileSidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop floating sidebar
  return (
    <aside className="fixed left-6 top-6 bottom-6 z-40 w-[72px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-[28px] shadow-2xl flex flex-col">
      <FloatingContent />
    </aside>
  );
}
