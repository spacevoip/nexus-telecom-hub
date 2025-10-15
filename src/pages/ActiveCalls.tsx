import { useState, useEffect } from 'react';
import { Phone, Headphones, PhoneOff, ArrowRightLeft, Settings, Mic, Hash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CallActionModal } from '@/components/modals/CallActionModal';
import { toast } from '@/hooks/use-toast';

interface ActiveCall {
  id: string;
  extension: string;
  agent: string;
  callerId: string;
  destination: string;
  duration: number;
  status: 'talking' | 'ringing';
}

const mockCalls: ActiveCall[] = [
  { id: '1', extension: '101', agent: 'João Silva', callerId: '1001', destination: '(11) 98765-4321', duration: 225, status: 'talking' },
  { id: '2', extension: '102', agent: 'Maria Santos', callerId: '1002', destination: '(21) 99887-6543', duration: 82, status: 'talking' },
  { id: '3', extension: '103', agent: 'Pedro Costa', callerId: '1003', destination: '(85) 91234-5678', duration: 15, status: 'ringing' },
  { id: '4', extension: '104', agent: 'Ana Lima', callerId: '1004', destination: '(11) 93456-7890', duration: 5, status: 'ringing' },
];

export default function ActiveCalls() {
  const [calls, setCalls] = useState<ActiveCall[]>(mockCalls);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'transfer' | 'listen' | null>(null);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);
  const [managingCallId, setManagingCallId] = useState<string | null>(null);

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
    setManagingCallId(managingCallId === callId ? null : callId);
  };

  const handleInjectAudio = (callId: string) => {
    toast({
      title: 'Injetar Áudio',
      description: 'Iniciando injeção de áudio na chamada...',
    });
  };

  const handleCaptureDigits = (callId: string) => {
    toast({
      title: 'Capturar Dígitos',
      description: 'Iniciando captura de dígitos...',
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
        {calls.map((call) => {
          const isManaging = managingCallId === call.id;
          
          return (
            <Card key={call.id} className="p-5 shadow-card hover:shadow-lg transition-smooth">
              {/* Header - Destination */}
              <div className="flex items-start justify-between mb-4 pb-3 border-b">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Destino</p>
                  <p className="font-bold text-lg truncate">{call.destination}</p>
                </div>
                {getStatusBadge(call.status)}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ramal</p>
                  <p className="font-semibold text-sm">{call.extension}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Agente</p>
                  <p className="font-semibold text-sm truncate">{call.agent}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">CallerID</p>
                  <p className="font-semibold text-sm font-mono text-primary">{call.callerId}</p>
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

              {/* Actions - Fixed Height Container */}
              <div className="h-[72px]">
                {!isManaging ? (
                  <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleManageCall(call.id)}
                    >
                      <Settings className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-xs">Gerenciar</span>
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
                ) : (
                  <div className="space-y-2 animate-fade-in">
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleInjectAudio(call.id)}
                      >
                        <Mic className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs">Injetar</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleCaptureDigits(call.id)}
                      >
                        <Hash className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs">Captura</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleTransfer(call.id)}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs">Transfer</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleListen(call.id)}
                      >
                        <Headphones className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs">Escutar</span>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleManageCall(call.id)}
                      >
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        <span className="text-xs">Voltar</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
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
