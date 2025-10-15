import { useState, useEffect } from 'react';
import { Phone, Headphones, Pause, PhoneOff, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallActionModal } from '@/components/modals/CallActionModal';
import { toast } from '@/hooks/use-toast';

interface ActiveCall {
  id: string;
  from: string;
  to: string;
  agent: string;
  duration: number;
  status: 'talking' | 'ringing' | 'queue';
}

const mockCalls: ActiveCall[] = [
  { id: '1', from: '(11) 98765-4321', to: 'Ramal 101', agent: 'João Silva', duration: 225, status: 'talking' },
  { id: '2', from: '(21) 99887-6543', to: 'Ramal 102', agent: 'Maria Santos', duration: 82, status: 'talking' },
  { id: '3', from: '(85) 91234-5678', to: '-', agent: 'Aguardando...', duration: 15, status: 'queue' },
];

export default function ActiveCalls() {
  const [calls, setCalls] = useState<ActiveCall[]>(mockCalls);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'transfer' | 'listen' | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCalls((prevCalls) =>
        prevCalls.map((call) => ({
          ...call,
          duration: call.duration + 1,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: ActiveCall['status']) => {
    const variants = {
      talking: { label: 'Em atendimento', className: 'status-badge-active' },
      ringing: { label: 'Tocando', className: 'status-badge-paused' },
      queue: { label: 'Na fila', className: 'status-badge-error' },
    };
    const variant = variants[status];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const handleTransfer = (callId: string) => {
    setSelectedCallId(parseInt(callId));
    setModalAction('transfer');
    setIsCallModalOpen(true);
  };

  const handleListen = (callId: string) => {
    setSelectedCallId(parseInt(callId));
    setModalAction('listen');
    setIsCallModalOpen(true);
  };

  const handleEndCall = () => {
    toast({
      title: 'Chamada encerrada',
      description: 'A chamada foi finalizada com sucesso',
    });
  };

  const handlePauseCall = () => {
    toast({
      title: 'Chamada pausada',
      description: 'A chamada foi colocada em espera',
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Chamadas Ativas</h1>
        <p className="text-muted-foreground mt-1">
          Monitore as chamadas em tempo real
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ativas</p>
              <p className="text-2xl font-bold text-primary">{calls.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Em Atendimento</p>
              <p className="text-2xl font-bold text-success">
                {calls.filter((c) => c.status === 'talking').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-success" />
            </div>
          </div>
        </Card>
        <Card className="p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Na Fila</p>
              <p className="text-2xl font-bold text-warning">
                {calls.filter((c) => c.status === 'queue').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calls Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calls.map((call) => (
          <Card key={call.id} className="p-6 shadow-card hover:shadow-lg transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Origem</p>
                <p className="font-semibold">{call.from}</p>
              </div>
              {getStatusBadge(call.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Destino:</span>
                <span className="font-medium">{call.to}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Agente:</span>
                <span className="font-medium">{call.agent}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Duração</span>
                <span className="text-2xl font-bold font-mono text-primary">
                  {formatDuration(call.duration)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{
                    width: `${Math.min((call.duration / 600) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleListen(call.id)}>
                <Headphones className="w-3 h-3 mr-1" />
                Escutar
              </Button>
              <Button size="sm" variant="outline" onClick={handlePauseCall}>
                <Pause className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleTransfer(call.id)}>
                <ArrowRightLeft className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={handleEndCall}>
                <PhoneOff className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {calls.length === 0 && (
        <Card className="p-12 text-center shadow-card">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhuma chamada ativa</h3>
          <p className="text-muted-foreground">
            As chamadas aparecerão aqui quando iniciadas
          </p>
        </Card>
      )}

      <CallActionModal
        open={isCallModalOpen}
        onOpenChange={setIsCallModalOpen}
        action={modalAction}
        callId={selectedCallId || undefined}
      />
    </div>
  );
}
