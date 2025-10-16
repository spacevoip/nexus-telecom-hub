import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Users, Phone, DollarSign, Clock, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ExportModal } from '@/components/modals/ExportModal';

const monthlyData = [
  { month: 'Jan', calls: 340, revenue: 12400 },
  { month: 'Fev', calls: 420, revenue: 15200 },
  { month: 'Mar', calls: 380, revenue: 14100 },
  { month: 'Abr', calls: 510, revenue: 18300 },
  { month: 'Mai', calls: 490, revenue: 17800 },
  { month: 'Jun', calls: 560, revenue: 20500 },
];

const planDistribution = [
  { name: 'Básico', value: 35, color: 'hsl(var(--accent))' },
  { name: 'Profissional', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Empresarial', value: 20, color: 'hsl(var(--success))' },
];

export default function Reports() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const metrics = [
    {
      icon: Phone,
      label: 'Total de Chamadas',
      value: '2.700',
      change: '+12%',
      trend: 'up',
      color: 'text-primary',
    },
    {
      icon: DollarSign,
      label: 'Receita Total',
      value: 'R$ 98.300',
      change: '+8%',
      trend: 'up',
      color: 'text-success',
    },
    {
      icon: Users,
      label: 'Novos Clientes',
      value: '24',
      change: '+15%',
      trend: 'up',
      color: 'text-accent',
    },
    {
      icon: Clock,
      label: 'Tempo Médio',
      value: '5m 42s',
      change: '-3%',
      trend: 'down',
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Análise consolidada do desempenho
          </p>
        </div>
        <Button className="gradient-primary shadow-primary" onClick={() => setIsExportModalOpen(true)}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <LineChartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Tendências</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <PieChartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Análise</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-lg transition-smooth">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          metric.trend === 'up' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {metric.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs. mês anterior</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Calls */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Chamadas Mensais</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
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
                  <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Trend */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Evolução de Receita</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
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
                    dataKey="revenue"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--success))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Plan Distribution */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Distribuição de Planos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Performers */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Top Agentes</h3>
              <div className="space-y-4">
                {[
                  { name: 'João Silva', calls: 245, duration: '18h 32m', rating: 4.9 },
                  { name: 'Maria Santos', calls: 198, duration: '15h 20m', rating: 4.8 },
                  { name: 'Pedro Costa', calls: 176, duration: '13h 45m', rating: 4.7 },
                  { name: 'Ana Lima', calls: 165, duration: '12h 18m', rating: 4.6 },
                  { name: 'Carlos Souza', calls: 142, duration: '10h 55m', rating: 4.5 },
                ].map((agent, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-primary">
                        <span className="text-xs font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {agent.calls} chamadas • {agent.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-warning">★</span>
                      <span className="text-sm font-semibold">{agent.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Exportar Relatório Completo"
      />
    </div>
  );
}
