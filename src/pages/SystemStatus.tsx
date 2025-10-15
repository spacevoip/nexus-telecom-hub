import { useMemo } from 'react';
import { Activity, Server, Database, HardDrive, Wifi, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Service {
  name: string;
  status: 'operational' | 'slow' | 'down';
  latency: string;
  uptime: string;
}

const services: Service[] = [
  { name: 'API Gateway', status: 'operational', latency: '45ms', uptime: '99.98%' },
  { name: 'SIP Server', status: 'operational', latency: '12ms', uptime: '99.99%' },
  { name: 'Database', status: 'operational', latency: '8ms', uptime: '100%' },
  { name: 'Storage', status: 'slow', latency: '250ms', uptime: '99.95%' },
  { name: 'Authentication', status: 'operational', latency: '35ms', uptime: '99.97%' },
  { name: 'CDN', status: 'operational', latency: '18ms', uptime: '99.99%' },
];

export default function SystemStatus() {
  const getStatusIcon = (status: Service['status']) => {
    if (status === 'operational') return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === 'slow') return <AlertCircle className="w-4 h-4 text-warning" />;
    return <AlertCircle className="w-4 h-4 text-destructive" />;
  };

  const getStatusBadge = (status: Service['status']) => {
    const variants = {
      operational: { label: 'Operacional', className: 'status-badge-active' },
      slow: { label: 'Lento', className: 'status-badge-paused' },
      down: { label: 'Inativo', className: 'status-badge-error' },
    };
    const variant = variants[status];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const overallHealth = useMemo(() => 
    services.filter(s => s.status === 'operational').length / services.length * 100,
    []
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Status do Sistema</h1>
          <p className="text-muted-foreground mt-1">
            Monitoramento em tempo real dos serviços
          </p>
        </div>
        <Button variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Ver Histórico
        </Button>
      </div>

      {/* Overall Health */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Saúde Geral do Sistema</h2>
            <p className="text-muted-foreground mt-1">Todos os sistemas operando normalmente</p>
          </div>
          <div className="text-4xl font-bold text-success">{overallHealth.toFixed(1)}%</div>
        </div>
        <Progress value={overallHealth} className="h-3" />
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requisições/s</p>
              <p className="text-xl font-bold">1.247</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Erro</p>
              <p className="text-xl font-bold">0.02%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latência Média</p>
              <p className="text-xl font-bold">58ms</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-xl font-bold">99.97%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Services Status */}
      <Card className="p-6 shadow-card">
        <h2 className="text-xl font-semibold mb-4">Status dos Serviços</h2>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-4 flex-1">
                {getStatusIcon(service.status)}
                <div className="flex-1">
                  <p className="font-medium">{service.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Latência: <span className="font-mono font-semibold">{service.latency}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Uptime: <span className="font-semibold">{service.uptime}</span>
                    </span>
                  </div>
                </div>
              </div>
              {getStatusBadge(service.status)}
            </div>
          ))}
        </div>
      </Card>

      {/* API Documentation */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Documentação da API</h2>
            <p className="text-muted-foreground mt-1">
              Acesse a documentação completa da API REST
            </p>
          </div>
          <Button className="gradient-primary shadow-primary">
            Ver Documentação
          </Button>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chaves de API</h2>
          <Button variant="outline" size="sm">Criar Nova Chave</Button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Produção', key: 'pk_live_**********************abc', created: '10/10/2025', lastUsed: 'há 2 minutos' },
            { name: 'Desenvolvimento', key: 'pk_test_**********************xyz', created: '05/09/2025', lastUsed: 'há 1 hora' },
          ].map((apiKey, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">{apiKey.name}</p>
                <p className="text-sm font-mono text-muted-foreground mt-1">{apiKey.key}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Criada: {apiKey.created}</span>
                  <span>•</span>
                  <span>Último uso: {apiKey.lastUsed}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                Revogar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
