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
  { time: '00:00', calls: 12 },
  { time: '04:00', calls: 8 },
  { time: '08:00', calls: 25 },
  { time: '12:00', calls: 42 },
  { time: '16:00', calls: 38 },
  { time: '20:00', calls: 18 },
  { time: '24:00', calls: 10 },
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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Chamadas nas Últimas 24h</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={callsData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
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
                dataKey="calls"
                stroke="hsl(239 84% 67%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCalls)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Tendência Semanal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={callsData}>
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
              <Line
                type="monotone"
                dataKey="calls"
                stroke="hsl(262 83% 58%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(262 83% 58%)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 shadow-card">
        <h3 className="font-semibold mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          {[
            { agent: 'João Silva', action: 'finalizou uma chamada', time: 'há 2 minutos', duration: '4m 23s' },
            { agent: 'Maria Santos', action: 'iniciou uma chamada', time: 'há 5 minutos', duration: 'em andamento' },
            { agent: 'Pedro Costa', action: 'entrou em pausa', time: 'há 15 minutos', duration: '-' },
            { agent: 'Ana Lima', action: 'finalizou uma chamada', time: 'há 20 minutos', duration: '2m 11s' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {activity.agent.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.agent} <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{activity.duration}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
