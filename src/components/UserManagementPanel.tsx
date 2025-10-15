import { useState, useEffect } from 'react';
import { X, Save, User, Mail, Building, CreditCard, Shield, Calendar, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface UserManagementPanelProps {
  user: any;
  onClose: () => void;
  onSave: (user: any) => void;
}

export function UserManagementPanel({ user, onClose, onSave }: UserManagementPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    plan: '',
    status: 'active',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        plan: user.plan?.toLowerCase() || 'básico',
        status: user.status || 'active',
        phone: user.phone || '',
        address: user.address || '',
        notes: user.notes || '',
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e email são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    onSave(formData);
    toast({
      title: 'Usuário atualizado',
      description: 'As informações foram salvas com sucesso',
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Usuário</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edite as informações e configurações do usuário
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="info" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="plan">Plano</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="p-6 space-y-6">
            {/* User Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-lg">{formData.name || 'Novo Usuário'}</p>
                <Badge variant="outline" className={formData.status === 'active' ? 'status-badge-active' : 'status-badge-error'}>
                  {formData.status === 'active' ? 'Ativo' : 'Suspenso'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Empresa
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Endereço
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Adicione observações sobre este usuário"
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Plano Atual
                </Label>
                <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="básico">Básico</SelectItem>
                    <SelectItem value="profissional">Profissional</SelectItem>
                    <SelectItem value="empresarial">Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Status da Conta
                </Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Plan Details */}
              <Card className="p-4 bg-muted/30">
                <h3 className="font-semibold mb-3">Detalhes do Plano</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chamadas mensais</span>
                    <span className="font-medium">1.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agentes</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Armazenamento</span>
                    <span className="font-medium">10 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suporte</span>
                    <span className="font-medium">24/7</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="p-6 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cadastrado em</p>
                  <p className="text-sm text-muted-foreground">{user?.registeredAt || '10/01/2025'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de chamadas</span>
                  <span className="font-semibold">847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Chamadas atendidas</span>
                  <span className="font-semibold text-success">782</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taxa de sucesso</span>
                  <span className="font-semibold text-primary">92.3%</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Atividade Recente</h3>
              <div className="space-y-3">
                {[
                  { action: 'Login realizado', time: 'Há 2 horas' },
                  { action: 'Chamada iniciada', time: 'Há 5 horas' },
                  { action: 'Plano atualizado', time: 'Há 2 dias' },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{activity.action}</span>
                    <span className="text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button className="gradient-primary shadow-primary" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
