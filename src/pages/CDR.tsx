import { useState, useMemo, useEffect } from 'react';
import { Download, Filter, Calendar, Search, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExportModal } from '@/components/modals/ExportModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';

interface CDRRecord {
  id: string;
  dateTime: string;
  from: string;
  to: string;
  agent: string;
  duration: string;
  status: 'completed' | 'missed' | 'abandoned';
  cost: number;
}

const mockCDR: CDRRecord[] = [
  { id: '1', dateTime: '15/10/2025 14:32', from: '(11) 98765-4321', to: 'Ramal 101', agent: 'João Silva', duration: '00:04:23', status: 'completed', cost: 2.35 },
  { id: '2', dateTime: '15/10/2025 14:15', from: '(21) 99887-6543', to: 'Ramal 102', agent: 'Maria Santos', duration: '00:02:11', status: 'completed', cost: 1.45 },
  { id: '3', dateTime: '15/10/2025 13:58', from: '(85) 91234-5678', to: '-', agent: '-', duration: '00:00:00', status: 'missed', cost: 0 },
  { id: '4', dateTime: '15/10/2025 13:45', from: '(47) 98888-7777', to: 'Ramal 103', agent: 'Pedro Costa', duration: '00:06:47', status: 'completed', cost: 3.67 },
  { id: '5', dateTime: '15/10/2025 13:30', from: '(11) 97777-6666', to: 'Ramal 104', agent: 'Ana Lima', duration: '00:03:15', status: 'completed', cost: 1.89 },
  { id: '6', dateTime: '15/10/2025 13:12', from: '(21) 96666-5555', to: '-', agent: '-', duration: '00:00:15', status: 'abandoned', cost: 0.12 },
  { id: '7', dateTime: '15/10/2025 12:58', from: '(85) 95555-4444', to: 'Ramal 101', agent: 'João Silva', duration: '00:08:32', status: 'completed', cost: 4.52 },
  { id: '8', dateTime: '15/10/2025 12:45', from: '(47) 94444-3333', to: 'Ramal 102', agent: 'Maria Santos', duration: '00:01:56', status: 'completed', cost: 1.23 },
  { id: '9', dateTime: '15/10/2025 12:30', from: '(11) 93333-2222', to: 'Ramal 103', agent: 'Pedro Costa', duration: '00:05:12', status: 'completed', cost: 2.78 },
  { id: '10', dateTime: '15/10/2025 12:15', from: '(21) 92222-1111', to: 'Ramal 104', agent: 'Ana Lima', duration: '00:03:45', status: 'completed', cost: 2.01 },
  { id: '11', dateTime: '15/10/2025 12:00', from: '(85) 91111-0000', to: '-', agent: '-', duration: '00:00:00', status: 'missed', cost: 0 },
  { id: '12', dateTime: '15/10/2025 11:45', from: '(47) 90000-9999', to: 'Ramal 101', agent: 'João Silva', duration: '00:07:23', status: 'completed', cost: 3.89 },
];

export default function CDR() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [records, setRecords] = useState<CDRRecord[]>(mockCDR);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = 
        record.from.includes(debouncedSearch) ||
        record.agent.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, debouncedSearch, statusFilter]);

  const getStatusBadge = (status: CDRRecord['status']) => {
    const variants = {
      completed: { label: 'Completada', className: 'status-badge-active' },
      missed: { label: 'Não atendida', className: 'status-badge-error' },
      abandoned: { label: 'Abandonada', className: 'status-badge-paused' },
    };
    const variant = variants[status];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const stats = useMemo(() => ({
    total: records.length,
    completed: records.filter(r => r.status === 'completed').length,
    missed: records.filter(r => r.status === 'missed').length,
    abandoned: records.filter(r => r.status === 'abandoned').length,
  }), [records]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(currentRecords.map(r => r.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, id]);
    } else {
      setSelectedRecords(selectedRecords.filter(rid => rid !== id));
    }
  };

  const handleDelete = () => {
    setRecords(records.filter(r => !selectedRecords.includes(r.id)));
    setSelectedRecords([]);
    setIsDeleteModalOpen(false);
    toast({
      title: "Registros excluídos",
      description: `${selectedRecords.length} registro(s) excluído(s) com sucesso.`,
    });
  };

  const allSelected = currentRecords.length > 0 && currentRecords.every(r => selectedRecords.includes(r.id));
  const someSelected = selectedRecords.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Histórico de Chamadas</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Visualize e exporte o histórico completo
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {someSelected && (
            <Button 
              variant="destructive" 
              className="flex-1 sm:flex-initial"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir ({selectedRecords.length})
            </Button>
          )}
          <Button className="gradient-primary shadow-primary flex-1 sm:flex-initial" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Completadas</p>
          <p className="text-2xl font-bold text-success mt-1">{stats.completed}</p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Não Atendidas</p>
          <p className="text-2xl font-bold text-destructive mt-1">{stats.missed}</p>
        </Card>
        <Card className="p-4 shadow-card">
          <p className="text-sm text-muted-foreground">Abandonadas</p>
          <p className="text-2xl font-bold text-warning mt-1">{stats.abandoned}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou agente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
              <SelectItem value="missed">Não atendidas</SelectItem>
              <SelectItem value="abandoned">Abandonadas</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
        </div>
      </Card>

      {/* Table/Cards */}
      <Card className="shadow-card overflow-hidden">
        {isMobile ? (
          /* Mobile Card View */
          <div className="divide-y divide-border">
            {currentRecords.map((record) => (
              <div key={record.id} className="p-4 hover:bg-accent/50 transition-smooth">
                <div className="flex items-start gap-3 mb-3">
                  <Checkbox
                    checked={selectedRecords.includes(record.id)}
                    onCheckedChange={(checked) => handleSelectRecord(record.id, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">{record.dateTime}</p>
                    <p className="font-mono text-sm font-medium mt-1">{record.from}</p>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
                <div className="space-y-2 text-sm ml-8">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destino:</span>
                    <span className="font-medium">{record.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agente:</span>
                    <span className="font-medium">{record.agent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-mono font-semibold">{record.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custo:</span>
                    <span className="font-semibold text-success">R$ {record.cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Table View */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">Data/Hora</th>
                  <th className="text-left p-4 font-semibold text-sm">Origem</th>
                  <th className="text-left p-4 font-semibold text-sm">Destino</th>
                  <th className="text-left p-4 font-semibold text-sm">Agente</th>
                  <th className="text-left p-4 font-semibold text-sm">Duração</th>
                  <th className="text-left p-4 font-semibold text-sm">Custo</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-border hover:bg-accent/50 transition-smooth"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRecord(record.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4 text-sm">{record.dateTime}</td>
                    <td className="p-4">
                      <span className="font-mono text-sm">{record.from}</span>
                    </td>
                    <td className="p-4 text-sm">{record.to}</td>
                    <td className="p-4 text-sm">{record.agent}</td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-medium">{record.duration}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-success">R$ {record.cost.toFixed(2)}</span>
                    </td>
                    <td className="p-4">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} de {filteredRecords.length} registros
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
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
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Exportar Histórico CDR"
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title="Excluir registros"
        description={`Tem certeza que deseja excluir ${selectedRecords.length} registro(s)? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
