import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Ban, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserModal } from '@/components/modals/UserModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { UserManagementPanel } from '@/components/UserManagementPanel';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'suspended';
  registeredAt: string;
  balance: number;
  minuteBalance: number;
  planActivationDate: string;
  planExpirationDate: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'João Empresa Ltda', email: 'joao@empresa.com', company: 'Empresa Tech', plan: 'Profissional', status: 'active', registeredAt: '10/01/2025', balance: 150.00, minuteBalance: 300, planActivationDate: '10/01/2025', planExpirationDate: '10/02/2025' },
  { id: '2', name: 'Maria Tech SA', email: 'maria@tech.com', company: 'Tech Solutions', plan: 'Empresarial', status: 'active', registeredAt: '15/02/2025', balance: 280.50, minuteBalance: 500, planActivationDate: '15/02/2025', planExpirationDate: '15/03/2025' },
  { id: '3', name: 'Pedro Telecom', email: 'pedro@telecom.com', company: 'Telecom Brasil', plan: 'Básico', status: 'suspended', registeredAt: '20/03/2025', balance: 0.00, minuteBalance: 0, planActivationDate: '20/03/2025', planExpirationDate: '20/04/2025' },
  { id: '4', name: 'Ana Digital', email: 'ana@digital.com', company: 'Digital Corp', plan: 'Profissional', status: 'active', registeredAt: '05/04/2025', balance: 95.75, minuteBalance: 180, planActivationDate: '05/04/2025', planExpirationDate: '05/05/2025' },
  { id: '5', name: 'Carlos Services', email: 'carlos@services.com', company: 'Services Inc', plan: 'Básico', status: 'active', registeredAt: '12/05/2025', balance: 210.00, minuteBalance: 420, planActivationDate: '12/05/2025', planExpirationDate: '12/06/2025' },
];

export default function Users() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [users] = useState<User[]>(mockUsers);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isManagementPanelOpen, setIsManagementPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

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

  const getDaysRemaining = (expirationDate: string) => {
    const today = new Date();
    const expiration = new Date(expirationDate.split('/').reverse().join('-'));
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  }), [users]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser({
      id: parseInt(user.id),
      name: user.name,
      email: user.email,
      company: user.company,
      plan: user.plan.toLowerCase(),
      status: user.status,
    });
    setIsUserModalOpen(true);
  };

  const handleManageUser = (user: User) => {
    setSelectedUser(user);
    setIsManagementPanelOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido com sucesso',
    });
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = (user: any) => {
    console.log('Salvando usuário:', user);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isReseller ? 'Meus Clientes' : 'Gerenciar Usuários'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {isReseller
              ? 'Gerencie os clientes da sua revenda'
              : 'Visualize e gerencie todos os usuários do sistema'}
          </p>
        </div>
        <Button className="gradient-primary shadow-primary w-full sm:w-auto" onClick={handleCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          {isReseller ? 'Novo Cliente' : 'Novo Usuário'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-3">
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

      {/* Users Table/Cards */}
      <Card className="shadow-card overflow-hidden">
        {isMobile ? (
          /* Mobile Card View */
          <div className="divide-y divide-border">
            {filteredUsers.map((user) => {
              const daysRemaining = getDaysRemaining(user.planExpirationDate);
              return (
                <div key={user.id} className="p-4 hover:bg-accent/50 transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {getStatusBadge(user.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Card className="p-2 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Saldo</p>
                      <p className="text-sm font-semibold text-success">R$ {user.balance.toFixed(2)}</p>
                    </Card>
                    <Card className="p-2 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Minutos</p>
                      <p className="text-sm font-semibold text-primary">{user.minuteBalance} min</p>
                    </Card>
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Empresa:</span>
                      <span className="font-medium">{user.company}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Plano:</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {user.plan}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Ativação:</span>
                      <span className="font-medium">{user.planActivationDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dias restantes:</span>
                      <Badge variant="outline" className={daysRemaining > 7 ? 'status-badge-active' : daysRemaining > 0 ? 'bg-warning/10 text-warning border-warning/20' : 'status-badge-error'}>
                        {daysRemaining > 0 ? `${daysRemaining} dias` : 'Expirado'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="gradient-primary shadow-primary h-8 w-8" 
                      onClick={() => handleManageUser(user)}
                      title="Gerenciar"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold text-xs">Usuário</th>
                  <th className="text-left p-3 font-semibold text-xs">Empresa</th>
                  <th className="text-left p-3 font-semibold text-xs">Plano</th>
                  <th className="text-left p-3 font-semibold text-xs">Financeiro</th>
                  <th className="text-left p-3 font-semibold text-xs">Ativação</th>
                  <th className="text-left p-3 font-semibold text-xs">Dias Restantes</th>
                  <th className="text-left p-3 font-semibold text-xs">Status</th>
                  <th className="text-right p-3 font-semibold text-xs">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const daysRemaining = getDaysRemaining(user.planExpirationDate);
                  return (
                    <tr
                      key={user.id}
                      className="border-t border-border hover:bg-accent/50 transition-smooth"
                    >
                      <td className="p-3">
                        <div className="max-w-[180px]">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-xs truncate max-w-[120px]">{user.company}</p>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
                          {user.plan}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">R$</span>
                            <span className="font-semibold text-xs text-success">{user.balance.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">Min:</span>
                            <span className="font-semibold text-xs text-primary">{user.minuteBalance}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-xs whitespace-nowrap">{user.planActivationDate}</p>
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs whitespace-nowrap ${
                            daysRemaining > 7 
                              ? 'status-badge-active' 
                              : daysRemaining > 0 
                                ? 'bg-warning/10 text-warning border-warning/20' 
                                : 'status-badge-error'
                          }`}
                        >
                          {daysRemaining > 0 ? `${daysRemaining} dias` : 'Expirado'}
                        </Badge>
                      </td>
                      <td className="p-3">{getStatusBadge(user.status)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="default" 
                            size="icon" 
                            className="gradient-primary shadow-primary h-8 w-8"
                            onClick={() => handleManageUser(user)}
                            title="Gerenciar"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-8 w-8"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredUsers.length} de {users.length} usuários
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Próximo</Button>
          </div>
        </div>
      </Card>

      <UserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Confirmar exclusão de usuário"
        description="Tem certeza que deseja excluir este usuário? Todos os seus dados serão removidos."
      />

      <Sheet open={isManagementPanelOpen} onOpenChange={setIsManagementPanelOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          {selectedUser && (
            <UserManagementPanel
              user={selectedUser}
              onClose={() => setIsManagementPanelOpen(false)}
              onSave={handleSaveUser}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
