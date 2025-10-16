import { useState, useEffect } from 'react';
import { Save, User, Mail, Building, CreditCard, Shield, Calendar, Phone, UserCog, TrendingUp, Ban, CheckCircle, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
    notes: '',
    role: 'user',
    balance: 0,
    minuteBalance: 0,
  });
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [rechargeType, setRechargeType] = useState<'balance' | 'minutes'>('balance');
  const [rechargeData, setRechargeData] = useState({
    operation: 'add',
    amount: '',
    description: '',
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
        notes: user.notes || '',
        role: user.role || 'user',
        balance: user.balance || 0,
        minuteBalance: user.minuteBalance || 0,
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

  const handleToggleSuspend = () => {
    const newStatus = formData.status === 'active' ? 'suspended' : 'active';
    setFormData({ ...formData, status: newStatus });
    setShowSuspendDialog(false);
    
    toast({
      title: newStatus === 'suspended' ? 'Usuário suspenso' : 'Usuário ativado',
      description: newStatus === 'suspended' 
        ? 'O usuário foi suspenso e não poderá acessar a plataforma' 
        : 'O usuário foi reativado e pode acessar a plataforma',
      variant: newStatus === 'suspended' ? 'destructive' : 'default',
    });
  };

  const handleRecharge = (type: 'balance' | 'minutes') => {
    setRechargeType(type);
    setRechargeData({
      operation: 'add',
      amount: '',
      description: '',
    });
    setShowRechargeDialog(true);
  };

  const handleConfirmRecharge = () => {
    if (!rechargeData.amount || !rechargeData.description) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o valor e a descrição',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(rechargeData.amount);
    let newValue = 0;

    if (rechargeType === 'balance') {
      switch (rechargeData.operation) {
        case 'add':
          newValue = formData.balance + amount;
          break;
        case 'debit':
          newValue = formData.balance - amount;
          break;
        case 'zero':
          newValue = 0;
          break;
        case 'total':
          newValue = amount;
          break;
      }
      setFormData({ ...formData, balance: Math.max(0, newValue) });
    } else {
      switch (rechargeData.operation) {
        case 'add':
          newValue = formData.minuteBalance + amount;
          break;
        case 'debit':
          newValue = formData.minuteBalance - amount;
          break;
        case 'zero':
          newValue = 0;
          break;
        case 'total':
          newValue = amount;
          break;
      }
      setFormData({ ...formData, minuteBalance: Math.max(0, newValue) });
    }

    toast({
      title: 'Recarga realizada',
      description: `${rechargeType === 'balance' ? 'Saldo' : 'Minutos'} atualizado com sucesso`,
    });

    setShowRechargeDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Gerenciar Usuário</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Edite as informações e configurações do usuário
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="info" className="w-full">
          <div className="px-4 sm:px-6 pt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info" className="text-xs sm:text-sm">Informações</TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">Detalhes</TabsTrigger>
              <TabsTrigger value="financial" className="text-xs sm:text-sm">Financeiro</TabsTrigger>
              <TabsTrigger value="plan" className="text-xs sm:text-sm">Plano</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm">Atividade</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* User Avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl font-bold text-primary-foreground">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-base sm:text-lg truncate">{formData.name || 'Novo Usuário'}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={formData.status === 'active' ? 'status-badge-active' : 'status-badge-error'}>
                    {formData.status === 'active' ? 'Ativo' : 'Suspenso'}
                  </Badge>
                  <Button
                    variant={formData.status === 'active' ? 'destructive' : 'outline'}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setShowSuspendDialog(true)}
                  >
                    {formData.status === 'active' ? (
                      <>
                        <Ban className="w-3 h-3 mr-1" />
                        Suspender
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reativar
                      </>
                    )}
                  </Button>
                </div>
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
                <Label htmlFor="role" className="flex items-center gap-2">
                  <UserCog className="w-4 h-4" />
                  Tipo de Usuário
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="reseller">Revenda</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Balance Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Saldos</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="text-xs text-muted-foreground">Saldo (R$)</span>
                    </div>
                    <p className="text-lg font-bold text-success">R$ {formData.balance.toFixed(2)}</p>
                  </Card>
                  <Card className="p-3 bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Minutos</span>
                    </div>
                    <p className="text-lg font-bold text-primary">{formData.minuteBalance} min</p>
                  </Card>
                </div>
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

          <TabsContent value="details" className="p-4 sm:p-6 space-y-4">
            {/* Registration Details */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Informações de Cadastro
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data de cadastro:</span>
                  <span className="font-medium">{user?.registeredAt || '10/01/2025'} às 14:30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cadastrado por:</span>
                  <span className="font-medium">Admin Master</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Última atualização:</span>
                  <span className="font-medium">15/10/2025 às 16:45</span>
                </div>
              </div>
            </Card>

            {/* Plan Details */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Detalhes do Plano
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data de ativação:</span>
                  <span className="font-medium">{user?.planActivationDate || '10/01/2025'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Data de expiração:</span>
                  <span className="font-medium">{user?.planExpirationDate || '10/02/2025'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dias restantes:</span>
                  <Badge 
                    variant="outline" 
                    className={
                      (() => {
                        const today = new Date();
                        const expiration = new Date((user?.planExpirationDate || '10/02/2025').split('/').reverse().join('-'));
                        const diffTime = expiration.getTime() - today.getTime();
                        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return daysRemaining > 7 
                          ? 'status-badge-active' 
                          : daysRemaining > 0 
                            ? 'bg-warning/10 text-warning border-warning/20' 
                            : 'status-badge-error';
                      })()
                    }
                  >
                    {(() => {
                      const today = new Date();
                      const expiration = new Date((user?.planExpirationDate || '10/02/2025').split('/').reverse().join('-'));
                      const diffTime = expiration.getTime() - today.getTime();
                      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return daysRemaining > 0 ? `${daysRemaining} dias` : 'Expirado';
                    })()}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* System Info */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Informações do Sistema
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ID do usuário:</span>
                  <span className="font-mono text-xs">{user?.id || '1'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Último login:</span>
                  <span className="font-medium">15/10/2025 às 18:20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IP do último acesso:</span>
                  <span className="font-mono text-xs">192.168.1.100</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-sm">Saldo (R$)</h3>
                </div>
                <p className="text-2xl font-bold text-success mb-3">R$ {formData.balance.toFixed(2)}</p>
                <Button
                  size="sm"
                  className="w-full gradient-primary shadow-primary"
                  onClick={() => handleRecharge('balance')}
                >
                  Recarga
                </Button>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">Minutos</h3>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{formData.minuteBalance} min</p>
                <Button
                  size="sm"
                  className="w-full gradient-primary shadow-primary"
                  onClick={() => handleRecharge('minutes')}
                >
                  Recarga
                </Button>
              </Card>
            </div>

            <Separator />

            {/* Financial History */}
            <div>
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Histórico Financeiro</h3>
              <Card className="divide-y divide-border">
                {[
                  { type: 'add', description: 'Recarga manual', amount: 100.00, date: '10/10/2025 14:30', balance: true },
                  { type: 'debit', description: 'Chamadas consumidas', amount: -25.50, date: '09/10/2025 16:45', balance: true },
                  { type: 'add', description: 'Adição de minutos', amount: 120, date: '08/10/2025 10:15', balance: false },
                  { type: 'debit', description: 'Minutos consumidos', amount: -45, date: '07/10/2025 18:20', balance: false },
                  { type: 'total', description: 'Ajuste total', amount: 150.00, date: '05/10/2025 09:00', balance: true },
                ].map((item, index) => (
                  <div key={index} className="p-3 hover:bg-accent/50 transition-smooth">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-right ml-2">
                        <p className={`font-semibold text-sm ${
                          item.amount > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {item.amount > 0 ? '+' : ''}{item.balance ? `R$ ${item.amount.toFixed(2)}` : `${item.amount} min`}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.type === 'add' ? 'Crédito' : item.type === 'debit' ? 'Débito' : 'Ajuste'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Detalhes do Plano</h3>
                <div className="space-y-2 text-xs sm:text-sm">
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

              {/* Plan Usage */}
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm sm:text-base">Uso do Plano</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-muted-foreground">Chamadas</span>
                      <span className="font-medium">687 / 1.000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '68.7%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-muted-foreground">Agentes</span>
                      <span className="font-medium">3 / 5</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="text-muted-foreground">Armazenamento</span>
                      <span className="font-medium">6.2 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="p-4 sm:p-6 space-y-4">
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
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Estatísticas</h3>
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
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Atividade Recente</h3>
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-border bg-muted/30">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button className="gradient-primary shadow-primary w-full sm:w-auto" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Suspend/Activate Confirmation Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {formData.status === 'active' ? 'Suspender usuário?' : 'Reativar usuário?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {formData.status === 'active' 
                ? `Tem certeza que deseja suspender ${formData.name}? O usuário não poderá acessar a plataforma até ser reativado.`
                : `Tem certeza que deseja reativar ${formData.name}? O usuário poderá acessar a plataforma novamente.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleSuspend}
              className={formData.status === 'active' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {formData.status === 'active' ? 'Suspender' : 'Reativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recharge Dialog */}
      <AlertDialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Recarga de {rechargeType === 'balance' ? 'Saldo' : 'Minutos'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Realize operações de crédito, débito ou ajuste no {rechargeType === 'balance' ? 'saldo' : 'saldo de minutos'} do usuário
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="operation">Operação</Label>
              <Select value={rechargeData.operation} onValueChange={(value) => setRechargeData({ ...rechargeData, operation: value })}>
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Selecione a operação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Adicionar</SelectItem>
                  <SelectItem value="debit">Debitar</SelectItem>
                  <SelectItem value="zero">Zerar</SelectItem>
                  <SelectItem value="total">Ajuste Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rechargeData.operation !== 'zero' && (
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {rechargeData.operation === 'total' ? 'Valor Total' : 'Valor'}
                  {rechargeType === 'balance' ? ' (R$)' : ' (minutos)'}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step={rechargeType === 'balance' ? '0.01' : '1'}
                  placeholder={rechargeType === 'balance' ? '0.00' : '0'}
                  value={rechargeData.amount}
                  onChange={(e) => setRechargeData({ ...rechargeData, amount: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Descreva o motivo da operação"
                value={rechargeData.description}
                onChange={(e) => setRechargeData({ ...rechargeData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRecharge} className="gradient-primary shadow-primary">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
