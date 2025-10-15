import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/agents': 'Agentes',
    '/active-calls': 'Chamadas Ativas',
    '/cdr': 'Relatório de Chamadas',
    '/audios': 'Áudios',
    '/users': 'Usuários',
    '/plans': 'Planos',
    '/settings': 'Configurações',
    '/reports': 'Relatórios',
    '/system-status': 'Status do Sistema'
  };
  return routes[pathname] || 'Dashboard';
};

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
