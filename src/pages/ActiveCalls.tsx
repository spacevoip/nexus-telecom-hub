import { useState, useEffect } from 'react';
import { Phone, Headphones, PhoneOff, ArrowRightLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallActionModal } from '@/components/modals/CallActionModal';
import { toast } from '@/hooks/use-toast';

interface ActiveCall {
  id: string;
  origin: string;
  destination: string;
  client: string;
  duration: number;
  status: 'talking' | 'ringing';
}

const mockCalls: ActiveCall[] = [
  { id: '1', origin: 'Ramal 101', destination: '(11) 98765-4321', client: 'João Silva', duration: 225, status: 'talking' },
  { id: '2', origin: 'Ramal 102', destination: '(21) 99887-6543', client: 'Maria Santos', duration: 82, status: 'talking' },
  { id: '3', origin: 'Ramal 103', destination: '(85) 91234-5678', client: 'Pedro Costa', duration: 15, status: 'ringing' },
  { id: '4', origin: 'Ramal 104', destination: '(11) 93456-7890', client: 'Ana Lima', duration: 5, status: 'ringing' },
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
      talking: { label: 'Em Atendimento', className: 'status-badge-active' },
      ringing: { label: 'Chamando', className: 'status-badge-paused' },
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

  const handleManageCall = (callId: string) => {
    toast({
      title: 'Gerenciar chamada',
      description: 'Abrindo opções de gerenciamento...',
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
        <Card className="p-4 shadow-card hover:shadow-lg transition-smooth">
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
        <Card className="p-4 shadow-card hover:shadow-lg transition-smooth">
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
        <Card className="p-4 shadow-card hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chamando</p>
              <p className="text-2xl font-bold text-warning">
                {calls.filter((c) => c.status === 'ringing').length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calls Grid */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {calls.map((call) => (
          <Card key={call.id} className="p-5 shadow-card hover:shadow-lg transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Origem</p>
                <p className="font-semibold text-sm truncate">{call.origin}</p>
              </div>
              {getStatusBadge(call.status)}
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground text-xs">Destino:</span>
                <span className="font-medium text-sm">{call.destination}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground text-xs">Cliente:</span>
                <span className="font-medium text-sm truncate ml-2">{call.client}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Duração</span>
                <span className="text-xl font-bold font-mono text-primary">
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
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleListen(call.id)}>
                <Headphones className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Escutar</span>
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleManageCall(call.id)}>
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Gerenciar</span>
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleTransfer(call.id)}>
                <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Transferir</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" 
                onClick={handleEndCall}
              >
                <PhoneOff className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Encerrar</span>
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
