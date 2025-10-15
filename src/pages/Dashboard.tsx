import { useAuth } from '@/contexts/AuthContext';
import { Phone, Users, Clock, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const callsData = [
  { time: '00:00', chamadas: 12, atendidas: 10 },
  { time: '04:00', chamadas: 8, atendidas: 7 },
  { time: '08:00', chamadas: 25, atendidas: 22 },
  { time: '12:00', chamadas: 42, atendidas: 38 },
  { time: '16:00', chamadas: 38, atendidas: 35 },
  { time: '20:00', chamadas: 18, atendidas: 16 },
  { time: '24:00', chamadas: 10, atendidas: 9 },
];

const agents = [
  { name: 'João Silva', status: 'online', avatar: 'JS', calls: 12, callerId: '1001' },
  { name: 'Maria Santos', status: 'busy', avatar: 'MS', calls: 8, callerId: '1002' },
  { name: 'Pedro Costa', status: 'online', avatar: 'PC', calls: 15, callerId: '1003' },
  { name: 'Ana Lima', status: 'pause', avatar: 'AL', calls: 6, callerId: '1004' },
];

export default function Dashboard() {
  const { user } = useAuth();

  const stats = user?.role === 'admin' ? [
    { icon: Phone, label: 'Chamadas Ativas', value: '247', change: '+12%', color: 'text-primary' },
    { icon: Users, label: 'Usuários Ativos', value: '38', suffix: 'empresas', color: 'text-success' },
    { icon: DollarSign, label: 'Receita MRR', value: 'R$ 45.890', change: '+8%', color: 'text-accent' },
    { icon: TrendingUp, label: 'Taxa Conversão', value: '23%', change: '+3%', color: 'text-warning' },
  ] : user?.role === 'reseller' ? [
    { icon: Phone, label: 'Chamadas Ativas', value: '47', change: '+8%', color: 'text-primary' },
    { icon: Users, label: 'Clientes Ativos', value: '8', suffix: 'empresas', color: 'text-success' },
    { icon: DollarSign, label: 'Comissão do Mês', value: 'R$ 2.890', change: '+15%', color: 'text-accent' },
    { icon: Activity, label: 'Uso Médio', value: '65%', change: '+5%', color: 'text-warning' },
  ] : [
    { icon: Phone, label: 'Chamadas Ativas', value: '8', color: 'text-primary' },
    { icon: Activity, label: 'Total Hoje', value: '127', change: '+15%', color: 'text-success' },
    { icon: Clock, label: 'Tempo Médio', value: '4m 32s', change: '-8%', color: 'text-accent' },
    { icon: Users, label: 'Agentes Online', value: '5', suffix: '/12', color: 'text-warning' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'admin'
            ? 'Visão geral do sistema'
            : user?.role === 'reseller'
            ? 'Acompanhe seus clientes'
            : 'Confira o desempenho das suas chamadas'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 shadow-card hover:shadow-lg transition-smooth">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-2xl font-bold">
                    {stat.value}
                  </h3>
                  {stat.suffix && (
                    <span className="text-sm text-muted-foreground">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                {stat.change && (
                  <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                    {stat.change} vs. mês anterior
                  </p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart - Chamadas x Atendidas */}
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-4">Chamadas x Atendidas (Últimas 24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={callsData}>
            <defs>
              <linearGradient id="colorChamadas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAtendidas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="time"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="chamadas"
              name="Chamadas"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorChamadas)"
            />
            <Area
              type="monotone"
              dataKey="atendidas"
              name="Atendidas"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAtendidas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Agentes Recentes */}
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-4">Agentes Recentes</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-card/50 hover:shadow-md transition-smooth">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {agent.avatar}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                    agent.status === 'online' ? 'bg-success' : 
                    agent.status === 'busy' ? 'bg-destructive' : 'bg-warning'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Ramal: {agent.callerId}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium capitalize ${
                    agent.status === 'online' ? 'text-success' : 
                    agent.status === 'busy' ? 'text-destructive' : 'text-warning'
                  }`}>
                    {agent.status === 'online' ? 'Disponível' : 
                     agent.status === 'busy' ? 'Em chamada' : 'Em pausa'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Chamadas hoje</span>
                  <span className="font-semibold text-primary">{agent.calls}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
