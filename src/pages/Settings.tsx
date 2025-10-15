import { useState } from 'react';
import { User, Lock, CreditCard, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

export default function Settings() {
  const { user } = useAuth();
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const planData = {
    name: user?.plan || 'Profissional',
    price: 'R$ 299/mês',
    minutesUsed: 1245,
    minutesTotal: 3000,
    agentsUsed: 5,
    agentsTotal: 10,
    callsUsed: 8,
    callsTotal: 15,
  };

  return (
    <div className="space-y-6 animate-in max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e informações
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="plan">
            <CreditCard className="w-4 h-4 mr-2" />
            Plano
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue={user?.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
              </div>

              {user?.company && (
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" defaultValue={user.company} disabled />
                </div>
              )}

              <Button className="gradient-primary shadow-primary mt-4">
                Salvar Alterações
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-6">Alterar Senha</h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current">Senha Atual</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">Nova Senha</Label>
                <Input id="new" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                <Input id="confirm" type="password" />
              </div>
              <Button className="gradient-primary shadow-primary">
                Atualizar Senha
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Autenticação de Dois Fatores</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ativar 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Sessões Ativas</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Chrome - Windows</p>
                  <p className="text-sm text-muted-foreground">São Paulo, BR • Agora</p>
                </div>
                <Badge variant="outline" className="status-badge-active">Atual</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Safari - iPhone</p>
                  <p className="text-sm text-muted-foreground">São Paulo, BR • há 2 horas</p>
                </div>
                <Button variant="outline" size="sm" className="text-destructive">
                  Encerrar
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Plano {planData.name}</h2>
                <p className="text-2xl font-bold text-primary mt-1">{planData.price}</p>
              </div>
              <Button className="gradient-primary shadow-primary">
                Fazer Upgrade
              </Button>
            </div>

            <div className="space-y-6">
              {/* Minutes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Minutos</span>
                  <span className="text-sm text-muted-foreground">
                    {planData.minutesUsed.toLocaleString()} / {planData.minutesTotal.toLocaleString()}
                  </span>
                </div>
                <Progress value={(planData.minutesUsed / planData.minutesTotal) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((planData.minutesUsed / planData.minutesTotal) * 100)}% utilizado
                </p>
              </div>

              {/* Agents */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Agentes</span>
                  <span className="text-sm text-muted-foreground">
                    {planData.agentsUsed} / {planData.agentsTotal}
                  </span>
                </div>
                <Progress value={(planData.agentsUsed / planData.agentsTotal) * 100} className="h-2" />
              </div>

              {/* Concurrent Calls */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Ligações Simultâneas</span>
                  <span className="text-sm text-muted-foreground">
                    {planData.callsUsed} / {planData.callsTotal}
                  </span>
                </div>
                <Progress value={(planData.callsUsed / planData.callsTotal) * 100} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Features Incluídas</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm">Gravação de chamadas ilimitada</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm">Relatórios avançados</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm">URA personalizada</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success text-xs">✓</span>
                </div>
                <span className="text-sm">Suporte prioritário</span>
              </li>
            </ul>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-6">Preferências de Notificação</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por email
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por SMS
                  </p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-6">Tipos de Notificação</h2>
            <div className="space-y-4">
              {[
                { label: 'Nova chamada recebida', checked: true },
                { label: 'Chamada perdida', checked: true },
                { label: 'Agente offline', checked: true },
                { label: 'Limite de minutos atingido', checked: true },
                { label: 'Relatório semanal', checked: false },
                { label: 'Atualizações do sistema', checked: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm">{item.label}</span>
                  <Switch defaultChecked={item.checked} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
