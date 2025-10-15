import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'admin' | 'reseller';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@pabx.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@pabx.com',
      name: 'Administrador',
      role: 'admin',
    },
  },
  'usuario@empresa.com': {
    password: 'user123',
    user: {
      id: '2',
      email: 'usuario@empresa.com',
      name: 'João Silva',
      role: 'user',
      company: 'Empresa Tech Ltda',
      plan: 'Profissional',
    },
  },
  'revenda@telecom.com': {
    password: 'reseller123',
    user: {
      id: '3',
      email: 'revenda@telecom.com',
      name: 'Maria Santos',
      role: 'reseller',
      company: 'Telecom Revenda SA',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('user', JSON.stringify(mockUser.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
