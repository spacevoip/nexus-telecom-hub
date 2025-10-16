import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Rate {
  id: string;
  prefix: string;
  destination: string;
  pricePerMinute: number;
  currency: string;
  status: 'active' | 'inactive';
}

const mockRates: Rate[] = [
  { id: '1', prefix: '55', destination: 'Brasil', pricePerMinute: 0.15, currency: 'R$', status: 'active' },
  { id: '2', prefix: '1', destination: 'EUA/Canadá', pricePerMinute: 0.10, currency: 'R$', status: 'active' },
  { id: '3', prefix: '44', destination: 'Reino Unido', pricePerMinute: 0.25, currency: 'R$', status: 'active' },
  { id: '4', prefix: '351', destination: 'Portugal', pricePerMinute: 0.20, currency: 'R$', status: 'active' },
];

export default function Rates() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [rates, setRates] = useState<Rate[]>(mockRates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [formData, setFormData] = useState({
    prefix: '',
    destination: '',
    pricePerMinute: '',
    currency: 'R$',
    status: 'active',
    notes: '',
  });

  const filteredRates = rates.filter((rate) =>
    rate.destination.toLowerCase().includes(search.toLowerCase()) ||
    rate.prefix.includes(search)
  );

  const isReseller = user?.role === 'reseller';

  const handleCreate = () => {
    setSelectedRate(null);
    setFormData({
      prefix: '',
      destination: '',
      pricePerMinute: '',
      currency: 'R$',
      status: 'active',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (rate: Rate) => {
    setSelectedRate(rate);
    setFormData({
      prefix: rate.prefix,
      destination: rate.destination,
      pricePerMinute: rate.pricePerMinute.toString(),
      currency: rate.currency,
      status: rate.status,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.prefix || !formData.destination || !formData.pricePerMinute) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: selectedRate ? 'Tarifa atualizada' : 'Tarifa criada',
      description: selectedRate
        ? 'A tarifa foi atualizada com sucesso'
        : 'Nova tarifa foi criada com sucesso',
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    toast({
      title: 'Tarifa removida',
      description: 'A tarifa foi removida com sucesso',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tarifas</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {isReseller
              ? 'Gerencie as tarifas para seus clientes'
              : 'Configure as tarifas de ligações do sistema'}
          </p>
        </div>
        <Button className="gradient-primary shadow-primary w-full sm:w-auto" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarifa
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por destino ou prefixo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Rates Table/Cards */}
      <Card className="shadow-card overflow-hidden">
        {isMobile ? (
          /* Mobile Card View */
          <div className="divide-y divide-border">
            {filteredRates.map((rate) => (
              <div key={rate.id} className="p-4 hover:bg-accent/50 transition-smooth">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{rate.destination}</p>
                    <p className="text-sm text-muted-foreground">Prefixo: +{rate.prefix}</p>
                  </div>
                  <Badge variant="outline" className="status-badge-active">
                    {rate.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor/minuto:</span>
                    <span className="font-medium text-primary">
                      {rate.currency} {rate.pricePerMinute.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(rate)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(rate.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                  <th className="text-left p-4 font-semibold text-sm">Prefixo</th>
                  <th className="text-left p-4 font-semibold text-sm">Destino</th>
                  <th className="text-left p-4 font-semibold text-sm">Valor/Minuto</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-right p-4 font-semibold text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="border-t border-border hover:bg-accent/50 transition-smooth"
                  >
                    <td className="p-4 font-medium">+{rate.prefix}</td>
                    <td className="p-4">{rate.destination}</td>
                    <td className="p-4">
                      <span className="font-medium text-primary">
                        {rate.currency} {rate.pricePerMinute.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="status-badge-active">
                        {rate.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(rate)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(rate.id)}
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
        )}
      </Card>

      {/* Rate Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRate ? 'Editar Tarifa' : 'Nova Tarifa'}
            </DialogTitle>
            <DialogDescription>
              {selectedRate
                ? 'Atualize as informações da tarifa'
                : 'Preencha os dados para criar uma nova tarifa'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefixo Internacional *</Label>
              <Input
                id="prefix"
                placeholder="Ex: 55"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destino *</Label>
              <Input
                id="destination"
                placeholder="Ex: Brasil"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Valor por Minuto (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.pricePerMinute}
                onChange={(e) => setFormData({ ...formData, pricePerMinute: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre esta tarifa"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="gradient-primary shadow-primary" onClick={handleSave}>
              {selectedRate ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
