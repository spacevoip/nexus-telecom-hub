import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentModal } from '@/components/modals/AgentModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { toast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  extension: string;
  status: 'online' | 'offline' | 'pause';
  duration: string;
}

const mockAgents: Agent[] = [
  { id: '1', name: 'João Silva', extension: '101', status: 'online', duration: 'Ativo há 2h' },
  { id: '2', name: 'Maria Santos', extension: '102', status: 'pause', duration: 'Em pausa há 15min' },
  { id: '3', name: 'Pedro Costa', extension: '103', status: 'offline', duration: 'Offline' },
  { id: '4', name: 'Ana Lima', extension: '104', status: 'online', duration: 'Ativo há 45min' },
  { id: '5', name: 'Carlos Souza', extension: '105', status: 'online', duration: 'Ativo há 1h 30min' },
  { id: '6', name: 'Juliana Alves', extension: '106', status: 'pause', duration: 'Em pausa há 5min' },
];

export default function Agents() {
  const [search, setSearch] = useState('');
  const [agents] = useState<Agent[]>(mockAgents);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.extension.includes(search)
  );

  const getStatusBadge = (status: Agent['status']) => {
    const variants = {
      online: { label: 'Online', className: 'status-badge-active' },
      offline: { label: 'Offline', className: 'status-badge-inactive' },
      pause: { label: 'Pausa', className: 'status-badge-paused' },
    };
    const variant = variants[status];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setIsAgentModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent({
      id: parseInt(agent.id),
      name: agent.name,
      extension: agent.extension,
      email: `${agent.name.toLowerCase().replace(' ', '.')}@empresa.com`,
      status: agent.status as 'online' | 'offline' | 'paused',
    });
    setIsAgentModalOpen(true);
  };

  const handleDeleteAgent = (id: string) => {
    setAgentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Agente removido',
      description: 'O agente foi removido com sucesso',
    });
    setIsDeleteModalOpen(false);
    setAgentToDelete(null);
  };

  const handleSaveAgent = (agent: any) => {
    console.log('Salvando agente:', agent);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os agentes do sistema
          </p>
        </div>
        <Button className="gradient-primary shadow-primary" onClick={handleCreateAgent}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Agente
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou ramal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-2xl font-bold text-success">3</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em Pausa</p>
              <p className="text-2xl font-bold text-warning">2</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-warning" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-2xl font-bold text-muted-foreground">1</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>

      {/* Agents Table */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Agente</th>
                <th className="text-left p-4 font-semibold text-sm">Ramal</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Duração</th>
                <th className="text-right p-4 font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-t border-border hover:bg-accent/50 transition-smooth"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm">{agent.extension}</span>
                  </td>
                  <td className="p-4">{getStatusBadge(agent.status)}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {agent.duration}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAgent(agent)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AgentModal
        open={isAgentModalOpen}
        onOpenChange={setIsAgentModalOpen}
        agent={selectedAgent}
        onSave={handleSaveAgent}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Confirmar exclusão de agente"
        description="Tem certeza que deseja excluir este agente? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
