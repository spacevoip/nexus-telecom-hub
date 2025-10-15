import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'suspended';
  registeredAt: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'João Empresa Ltda', email: 'joao@empresa.com', company: 'Empresa Tech', plan: 'Profissional', status: 'active', registeredAt: '10/01/2025' },
  { id: '2', name: 'Maria Tech SA', email: 'maria@tech.com', company: 'Tech Solutions', plan: 'Empresarial', status: 'active', registeredAt: '15/02/2025' },
  { id: '3', name: 'Pedro Telecom', email: 'pedro@telecom.com', company: 'Telecom Brasil', plan: 'Básico', status: 'suspended', registeredAt: '20/03/2025' },
  { id: '4', name: 'Ana Digital', email: 'ana@digital.com', company: 'Digital Corp', plan: 'Profissional', status: 'active', registeredAt: '05/04/2025' },
  { id: '5', name: 'Carlos Services', email: 'carlos@services.com', company: 'Services Inc', plan: 'Básico', status: 'active', registeredAt: '12/05/2025' },
];

export default function Users() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.company.toLowerCase().includes(search.toLowerCase())
  );

  const isReseller = user?.role === 'reseller';
  const isAdmin = user?.role === 'admin';

  const getStatusBadge = (status: User['status']) => {
    return status === 'active' ? (
      <Badge variant="outline" className="status-badge-active">Ativo</Badge>
    ) : (
      <Badge variant="outline" className="status-badge-error">Suspenso</Badge>
    );
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isReseller ? 'Meus Clientes' : 'Gerenciar Usuários'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isReseller
              ? 'Gerencie os clientes da sua revenda'
              : 'Visualize e gerencie todos os usuários do sistema'}
          </p>
        </div>
        <Button className="gradient-primary shadow-primary">
          <Plus className="w-4 h-4 mr-2" />
          {isReseller ? 'Novo Cliente' : 'Novo Usuário'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Ativos</p>
          <p className="text-2xl font-bold text-success mt-1">{stats.active}</p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Suspensos</p>
          <p className="text-2xl font-bold text-destructive mt-1">{stats.suspended}</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Usuário</th>
                <th className="text-left p-4 font-semibold text-sm">Empresa</th>
                <th className="text-left p-4 font-semibold text-sm">Plano</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Data Cadastro</th>
                <th className="text-right p-4 font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-border hover:bg-accent/50 transition-smooth"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{user.company}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="p-4">{getStatusBadge(user.status)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.registeredAt}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Ver detalhes">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          {user.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Suspender"
                              className="text-warning hover:text-warning"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Ativar"
                              className="text-success hover:text-success"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
