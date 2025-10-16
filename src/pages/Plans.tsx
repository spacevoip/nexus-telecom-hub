import { useState } from 'react';
import { Plus, Edit, Eye, Trash2, Users, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { PlanModal } from '@/components/modals/PlanModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  price: string;
  minutes: string;
  agents: number;
  calls: number;
  clients: number;
  features: string[];
  active: boolean;
}

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Básico',
    price: 'R$ 99',
    minutes: '1.000',
    agents: 3,
    calls: 5,
    clients: 12,
    features: ['Gravação básica', 'Relatórios simples', 'Suporte email'],
    active: true,
  },
  {
    id: '2',
    name: 'Profissional',
    price: 'R$ 299',
    minutes: '3.000',
    agents: 10,
    calls: 15,
    clients: 18,
    features: ['Gravação ilimitada', 'Relatórios avançados', 'URA personalizada', 'Suporte prioritário'],
    active: true,
  },
  {
    id: '3',
    name: 'Empresarial',
    price: 'R$ 799',
    minutes: '10.000',
    agents: 30,
    calls: 50,
    clients: 8,
    features: ['Gravação ilimitada', 'Relatórios avançados', 'URA personalizada', 'Suporte 24/7', 'API completa', 'Gerente dedicado'],
    active: true,
  },
];

export default function Plans() {
  const { user } = useAuth();
  const [plans] = useState<Plan[]>(mockPlans);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Controle de acesso: apenas admin e reseller
  if (user?.role !== 'admin' && user?.role !== 'reseller') {
    return <Navigate to="/dashboard" replace />;
  }

  const isReseller = user?.role === 'reseller';

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan({
      id: parseInt(plan.id),
      name: plan.name,
      price: parseFloat(plan.price.replace('R$ ', '').replace('.', '')),
      minutes: parseInt(plan.minutes.replace('.', '')),
      agents: plan.agents,
      concurrent: plan.calls,
      features: plan.features,
    });
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = (id: string) => {
    setPlanToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Plano removido',
      description: 'O plano foi removido com sucesso',
    });
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleSavePlan = (plan: any) => {
    console.log('Salvando plano:', plan);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isReseller ? 'Meus Planos' : 'Gerenciar Planos'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isReseller
              ? 'Visualize e customize planos para seus clientes'
              : 'Crie e gerencie os planos disponíveis'}
          </p>
        </div>
        <Button className="gradient-primary shadow-primary" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4 mr-2" />
          {isReseller ? 'Criar Plano Customizado' : 'Novo Plano'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Planos</p>
          <p className="text-2xl font-bold mt-1">{plans.length}</p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Planos Ativos</p>
          <p className="text-2xl font-bold text-success mt-1">
            {plans.filter(p => p.active).length}
          </p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {plans.reduce((acc, plan) => acc + plan.clients, 0)}
          </p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Receita Estimada</p>
          <p className="text-2xl font-bold text-accent mt-1">R$ 12.4k</p>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="p-6 shadow-card hover:shadow-lg transition-smooth flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={plan.active ? 'status-badge-active' : 'status-badge-inactive'}
              >
                {plan.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            {/* Limits */}
            <div className="space-y-3 mb-4 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Minutos:</span>
                <span className="font-semibold">{plan.minutes}/mês</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Agentes:</span>
                <span className="font-semibold">{plan.agents}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chamadas simultâneas:</span>
                <span className="font-semibold">{plan.calls}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">FEATURES</p>
              <ul className="space-y-1.5">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Clients */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg mb-4">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold">{plan.clients}</span> clientes ativos
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                Ver
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                <Edit className="w-3 h-3" />
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            {isReseller && (
              <div className="mt-3 p-2 bg-accent/10 rounded text-xs text-center">
                Sua margem: <span className="font-semibold text-accent">R$ 50</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <PlanModal
        open={isPlanModalOpen}
        onOpenChange={setIsPlanModalOpen}
        plan={selectedPlan}
        onSave={handleSavePlan}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Confirmar exclusão de plano"
        description="Tem certeza que deseja excluir este plano? Os usuários vinculados a ele serão afetados."
      />
    </div>
  );
}
