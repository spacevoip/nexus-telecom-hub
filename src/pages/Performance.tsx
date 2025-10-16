import { useState } from 'react';
import { Phone, PhoneOff, Clock, TrendingUp, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const callsData = [
  { day: 'Seg', success: 45, failed: 5, total: 50 },
  { day: 'Ter', success: 52, failed: 3, total: 55 },
  { day: 'Qua', success: 48, failed: 7, total: 55 },
  { day: 'Qui', success: 61, failed: 4, total: 65 },
  { day: 'Sex', success: 58, failed: 2, total: 60 },
  { day: 'Sáb', success: 32, failed: 3, total: 35 },
  { day: 'Dom', success: 28, failed: 2, total: 30 },
];

const agentPerformance = [
  {
    name: 'João Silva',
    calls: 245,
    successRate: 94.5,
    avgDuration: '5m 42s',
    rating: 4.9,
    failed: 14,
  },
  {
    name: 'Maria Santos',
    calls: 198,
    successRate: 96.2,
    avgDuration: '4m 28s',
    rating: 4.8,
    failed: 8,
  },
  {
    name: 'Pedro Costa',
    calls: 176,
    successRate: 91.5,
    avgDuration: '6m 15s',
    rating: 4.7,
    failed: 15,
  },
  {
    name: 'Ana Lima',
    calls: 165,
    successRate: 93.3,
    avgDuration: '5m 10s',
    rating: 4.6,
    failed: 11,
  },
  {
    name: 'Carlos Souza',
    calls: 142,
    successRate: 89.4,
    avgDuration: '7m 02s',
    rating: 4.5,
    failed: 15,
  },
];

export default function Performance() {
  const totalCalls = 926;
  const successfulCalls = 866;
  const failedCalls = 60;
  const successRate = ((successfulCalls / totalCalls) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Desempenho</h1>
        <p className="text-muted-foreground mt-1">
          Análise detalhada de chamadas e performance dos agentes
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Chamadas</p>
              <h3 className="text-2xl font-bold mt-2">{totalCalls}</h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">+12%</span>
                <span className="text-xs text-muted-foreground">vs. semana anterior</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Phone className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chamadas Bem-Sucedidas</p>
              <h3 className="text-2xl font-bold mt-2 text-success">{successfulCalls}</h3>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">{successRate}%</span>
                <span className="text-xs text-muted-foreground">taxa de sucesso</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chamadas Falhadas</p>
              <h3 className="text-2xl font-bold mt-2 text-destructive">{failedCalls}</h3>
              <div className="flex items-center gap-1 mt-2">
                <XCircle className="w-3 h-3 text-destructive" />
                <span className="text-xs font-medium text-destructive">
                  {((failedCalls / totalCalls) * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">do total</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
              <PhoneOff className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
              <h3 className="text-2xl font-bold mt-2">5m 42s</h3>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-warning" />
                <span className="text-xs font-medium text-warning">-3%</span>
                <span className="text-xs text-muted-foreground">vs. semana anterior</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calls" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-2 mb-6">
          <TabsTrigger value="calls" className="gap-2">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Análise de Chamadas</span>
            <span className="sm:hidden">Chamadas</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Desempenho dos Agentes</span>
            <span className="sm:hidden">Agentes</span>
          </TabsTrigger>
        </TabsList>

        {/* Calls Analysis Tab */}
        <TabsContent value="calls" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calls by Day */}
            <Card className="p-6 shadow-card md:col-span-2">
              <h3 className="font-semibold mb-4">Chamadas por Dia da Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="day"
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
                  <Bar dataKey="success" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} name="Sucesso" />
                  <Bar dataKey="failed" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Falha" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Call Failure Reasons */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Principais Motivos de Falha</h3>
              <div className="space-y-4">
                {[
                  { reason: 'Número não atende', count: 22, percentage: 36.7 },
                  { reason: 'Linha ocupada', count: 15, percentage: 25.0 },
                  { reason: 'Número inválido', count: 12, percentage: 20.0 },
                  { reason: 'Sem sinal', count: 8, percentage: 13.3 },
                  { reason: 'Outros', count: 3, percentage: 5.0 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.reason}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Call Stats */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Estatísticas Detalhadas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">Pico de chamadas</span>
                  </div>
                  <span className="text-sm font-semibold">14:00 - 16:00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm">Chamada mais longa</span>
                  </div>
                  <span className="text-sm font-semibold">18m 32s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-success" />
                    <span className="text-sm">Chamada mais curta</span>
                  </div>
                  <span className="text-sm font-semibold">12s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm">Tempo médio de espera</span>
                  </div>
                  <span className="text-sm font-semibold">8s</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Agents Performance Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid gap-4">
            {agentPerformance.map((agent, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-lg transition-smooth">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Agent Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-primary">
                      <span className="text-sm font-bold text-primary-foreground">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{agent.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-warning">★</span>
                        <span className="text-sm font-semibold">{agent.rating}</span>
                        <span className="text-xs text-muted-foreground">avaliação média</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="text-lg font-bold">{agent.calls}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Sucesso</p>
                      <div className="flex items-center gap-1">
                        <p className="text-lg font-bold text-success">{agent.successRate}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Falhas</p>
                      <p className="text-lg font-bold text-destructive">{agent.failed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tempo Médio</p>
                      <p className="text-lg font-bold text-warning">{agent.avgDuration}</p>
                    </div>
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Taxa de Sucesso</span>
                    <Badge
                      variant="outline"
                      className={
                        agent.successRate >= 95
                          ? 'status-badge-active'
                          : agent.successRate >= 90
                          ? 'status-badge-paused'
                          : 'status-badge-inactive'
                      }
                    >
                      {agent.successRate >= 95 ? 'Excelente' : agent.successRate >= 90 ? 'Bom' : 'Regular'}
                    </Badge>
                  </div>
                  <Progress value={agent.successRate} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
