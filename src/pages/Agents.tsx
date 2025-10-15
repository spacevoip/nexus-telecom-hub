import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentModal } from '@/components/modals/AgentModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface Agent {
  id: string;
  name: string;
  extension: string;
  callerId: string;
  status: 'online' | 'offline' | 'pause';
}

const mockAgents: Agent[] = [
  { id: '1', name: 'João Silva', extension: '101', callerId: '1001', status: 'online' },
  { id: '2', name: 'Maria Santos', extension: '102', callerId: '1002', status: 'pause' },
  { id: '3', name: 'Pedro Costa', extension: '103', callerId: '1003', status: 'offline' },
  { id: '4', name: 'Ana Lima', extension: '104', callerId: '1004', status: 'online' },
  { id: '5', name: 'Carlos Souza', extension: '105', callerId: '1005', status: 'online' },
  { id: '6', name: 'Juliana Alves', extension: '106', callerId: '1006', status: 'pause' },
];

export default function Agents() {
  const [search, setSearch] = useState('');
  const [agents] = useState<Agent[]>(mockAgents);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.extension.includes(search)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Calculate stats
  const totalAgents = filteredAgents.length;
  const onlineAgents = filteredAgents.filter(a => a.status === 'online').length;
  const offlineAgents = filteredAgents.filter(a => a.status === 'offline' || a.status === 'pause').length;

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
      password: "******",
      callerId: agent.callerId,
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Todos</p>
              <p className="text-2xl font-bold text-primary">{totalAgents}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-2xl font-bold text-success">{onlineAgents}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-2xl font-bold text-muted-foreground">{offlineAgents}</p>
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
                <th className="text-left p-4 font-semibold text-sm">CallerID</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-right p-4 font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.length > 0 ? (
                paginatedAgents.map((agent) => (
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
                    <td className="p-4">
                      <span className="font-mono text-sm text-primary">{agent.callerId}</span>
                    </td>
                    <td className="p-4">{getStatusBadge(agent.status)}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum agente encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = page === 1 || 
                                   page === totalPages || 
                                   Math.abs(page - currentPage) <= 1;
                  
                  const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
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
