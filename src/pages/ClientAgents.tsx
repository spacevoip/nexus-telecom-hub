import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Users, Building2, Phone, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientAgent {
  id: string;
  name: string;
  extension: string;
  clientName: string;
  clientCompany: string;
  status: 'online' | 'offline' | 'busy';
  callerId: string;
}

// Mock data - em produção virá do backend
const mockClientAgents: ClientAgent[] = [
  {
    id: '1',
    name: 'Pedro Santos',
    extension: '1001',
    clientName: 'João Silva',
    clientCompany: 'Empresa Tech Ltda',
    status: 'online',
    callerId: '11 98765-4321',
  },
  {
    id: '2',
    name: 'Ana Costa',
    extension: '1002',
    clientName: 'João Silva',
    clientCompany: 'Empresa Tech Ltda',
    status: 'busy',
    callerId: '11 97654-3210',
  },
  {
    id: '3',
    name: 'Carlos Lima',
    extension: '2001',
    clientName: 'Maria Oliveira',
    clientCompany: 'Comercial ABC',
    status: 'offline',
    callerId: '11 96543-2109',
  },
  {
    id: '4',
    name: 'Juliana Souza',
    extension: '2002',
    clientName: 'Maria Oliveira',
    clientCompany: 'Comercial ABC',
    status: 'online',
    callerId: '11 95432-1098',
  },
  {
    id: '5',
    name: 'Roberto Alves',
    extension: '3001',
    clientName: 'Paulo Costa',
    clientCompany: 'Telecom Service',
    status: 'online',
    callerId: '11 94321-0987',
  },
  {
    id: '6',
    name: 'Fernanda Rocha',
    extension: '3002',
    clientName: 'Paulo Costa',
    clientCompany: 'Telecom Service',
    status: 'offline',
    callerId: '11 93210-9876',
  },
];

const ITEMS_PER_PAGE = 5;

export default function ClientAgents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const filteredAgents = mockClientAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.extension.includes(searchTerm) ||
      agent.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.clientCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (agent: ClientAgent) => {
    toast({
      title: 'Editar Agente',
      description: `Editando ${agent.name}`,
    });
  };

  const handleDelete = (agent: ClientAgent) => {
    toast({
      title: 'Agente Excluído',
      description: `${agent.name} foi excluído com sucesso`,
      variant: 'destructive',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      online: { variant: 'default', label: 'Online' },
      offline: { variant: 'secondary', label: 'Offline' },
      busy: { variant: 'destructive', label: 'Ocupado' },
    };
    const statusInfo = variants[status];
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const stats = {
    totalAgents: mockClientAgents.length,
    online: mockClientAgents.filter((a) => a.status === 'online').length,
    totalClients: new Set(mockClientAgents.map((a) => a.clientName)).size,
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Agentes Clientes</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os agentes dos seus clientes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Agentes</p>
              <p className="text-2xl font-bold">{stats.totalAgents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Agentes Online</p>
              <p className="text-2xl font-bold">{stats.online}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold">{stats.totalClients}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Table */}
      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por agente, ramal, cliente ou empresa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>Ramal</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Caller ID</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum agente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.extension}</TableCell>
                    <TableCell>{agent.clientName}</TableCell>
                    <TableCell>{agent.clientCompany}</TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell>{agent.callerId}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(agent)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(agent)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}
