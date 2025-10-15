import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className={`flex items-center justify-end gap-2 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 ${
          isMobile ? 'px-4 py-3 pl-16' : 'px-6 py-4'
        }`}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
            ) : (
              <Sun className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
            )}
          </Button>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
