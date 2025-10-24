import { useState, useEffect } from 'react';
import { Phone, Headphones, PhoneOff, ArrowRightLeft, Settings, Mic, Hash, ArrowLeft, Trash2, Download, Play, Pause, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

type ActionView = 'actions' | 'inject' | 'inject-predefined' | 'inject-tts' | 'capture' | 'transfer' | 'listen' | 'listen-mode' | 'record';

export default function ActiveCalls() {
  const [calls, setCalls] = useState<ActiveCall[]>(mockCalls);
  const [managingCallId, setManagingCallId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<ActionView>('actions');
  const [capturedDigits, setCapturedDigits] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [spyExtension, setSpyExtension] = useState('');
  const [listenMode, setListenMode] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [injectMode, setInjectMode] = useState('');
  const [ttsText, setTtsText] = useState('');
  const [ttsMode, setTtsMode] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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

  const handleEndCall = () => {
    toast({
      title: 'Chamada encerrada',
      description: 'A chamada foi finalizada com sucesso',
    });
  };

  const handleManageCall = (callId: string) => {
    if (managingCallId === callId) {
      setManagingCallId(null);
      setCurrentAction('actions');
    } else {
      setManagingCallId(callId);
      setCurrentAction('actions');
    }
  };

  const handleBackToActions = () => {
    setCurrentAction('actions');
    setCapturedDigits('');
    setIsCapturing(false);
    setTransferTarget('');
    setSpyExtension('');
    setListenMode('');
    setSelectedAudio('');
    setInjectMode('');
    setTtsText('');
    setTtsMode('');
    setIsRecording(false);
  };

  const handleDownloadDigits = () => {
    const blob = new Blob([capturedDigits], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'digitos-capturados.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Download iniciado',
      description: 'Os dígitos foram salvos em arquivo txt',
    });
  };

  const handleConfirmTransfer = () => {
    if (!transferTarget) {
      toast({
        title: 'Erro',
        description: 'Selecione um destino para transferência',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Transferência iniciada',
      description: `Transferindo chamada para ${transferTarget}`,
    });
    handleBackToActions();
  };

  const handleConfirmListen = () => {
    if (!listenMode) {
      toast({
        title: 'Erro',
        description: 'Selecione um modo de escuta',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Escuta iniciada',
      description: `Modo: ${listenMode === 'listen' ? 'Só Ouvir' : 'Participar'}`,
    });
    handleBackToActions();
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

              {/* Info Grid - Esconde apenas no card sendo gerenciado quando em inject ou capture */}
              {!(isManaging && ['inject-predefined', 'inject-tts', 'capture'].includes(currentAction)) && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ramal</p>
                    <p className="font-semibold text-sm">{call.extension}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Agente</p>
                    <p className="font-semibold text-sm truncate">{call.agent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">CallerID</p>
                    <p className="font-semibold text-sm font-mono text-primary">{call.callerId}</p>
                  </div>
                </div>
              )}

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

              {/* Actions - Dynamic Height Container */}
              <div className="min-h-[72px]">
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
                  <>
                    {/* AÇÕES PRINCIPAIS */}
                    {currentAction === 'actions' && (
                      <div className="space-y-2 animate-scale-in">
                        <div className="grid grid-cols-4 gap-1.5">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-1.5" 
                            onClick={() => setCurrentAction('inject')}
                          >
                            <Mic className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Injetar</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-1.5" 
                            onClick={() => setCurrentAction('capture')}
                          >
                            <Hash className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Captura</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-1.5" 
                            onClick={() => setCurrentAction('transfer')}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Transfer</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-1.5" 
                            onClick={() => setCurrentAction('listen')}
                          >
                            <Headphones className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Escutar</span>
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-1.5" 
                            onClick={() => setCurrentAction('record')}
                          >
                            <Radio className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Gravar</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-1.5 text-destructive hover:text-destructive hover:bg-destructive/10" 
                            onClick={handleEndCall}
                          >
                            <PhoneOff className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Encerrar</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-9 px-2" 
                            onClick={() => handleManageCall(call.id)}
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* INJETAR ÁUDIO - OPÇÕES */}
                    {currentAction === 'inject' && (
                      <div className="space-y-2 animate-scale-in">
                        <p className="text-xs font-semibold text-center mb-2">Injetar Áudio</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-auto py-2 px-2" 
                            onClick={() => setCurrentAction('inject-predefined')}
                          >
                            <Mic className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Áudio Predefinido</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-auto py-2 px-2" 
                            onClick={() => setCurrentAction('inject-tts')}
                          >
                            <Mic className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] ml-1 leading-tight">Áudio a partir de Texto (TTS)</span>
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full h-9" 
                          onClick={handleBackToActions}
                        >
                          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs">Voltar</span>
                        </Button>
                      </div>
                    )}

                    {/* INJETAR ÁUDIO PREDEFINIDO - Usa o espaço do Info Grid */}
                    {currentAction === 'inject-predefined' && (
                      <div className="space-y-3 mb-4 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Áudio Predefinido</p>
                        
                        <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Selecione um áudio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aguarde">Aguarde um momento</SelectItem>
                            <SelectItem value="transferindo">Transferindo chamada</SelectItem>
                            <SelectItem value="horario">Fora do horário</SelectItem>
                            <SelectItem value="pausa">Música em espera</SelectItem>
                            <SelectItem value="satisfacao">Pesquisa de satisfação</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={injectMode} onValueChange={setInjectMode}>
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Modo: Cliente / Todos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Cliente</SelectItem>
                            <SelectItem value="all">Todos</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-8" 
                            onClick={() => toast({ title: 'Reproduzindo áudio', description: 'Reproduzindo preview...' })}
                            disabled={!selectedAudio}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            <span className="text-xs">Ouvir</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="w-full h-8" 
                            onClick={() => {
                              toast({ title: 'Áudio injetado', description: `Injetado para ${injectMode === 'client' ? 'cliente' : 'todos'}` });
                              handleBackToActions();
                            }}
                            disabled={!selectedAudio || !injectMode}
                          >
                            <Mic className="w-3 h-3 mr-1" />
                            <span className="text-xs">Injetar</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-8" 
                            onClick={() => setCurrentAction('capture')}
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            <span className="text-xs">DTMF</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-8" 
                            onClick={() => setCurrentAction('inject')}
                          >
                            <ArrowLeft className="w-3 h-3 mr-1" />
                            <span className="text-xs">Voltar</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* INJETAR ÁUDIO TTS - Usa o espaço do Info Grid */}
                    {currentAction === 'inject-tts' && (
                      <div className="space-y-3 mb-4 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Áudio a partir de Texto (TTS)</p>
                        
                        <textarea 
                          className="w-full min-h-[60px] p-2 text-xs rounded-lg border border-input bg-background resize-none"
                          placeholder="Digite o texto para converter em áudio..."
                          value={ttsText}
                          onChange={(e) => setTtsText(e.target.value)}
                        />

                        <Select value={ttsMode} onValueChange={setTtsMode}>
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue placeholder="Modo: Cliente / Todos / Ouvir" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">Cliente</SelectItem>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="listen">Ouvir</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button 
                          size="sm" 
                          variant="default" 
                          className="w-full h-8" 
                          onClick={() => {
                            toast({ title: 'TTS injetado', description: `Convertido e injetado (${ttsMode})` });
                            handleBackToActions();
                          }}
                          disabled={!ttsText.trim() || !ttsMode}
                        >
                          <Mic className="w-3 h-3 mr-1.5" />
                          <span className="text-xs">Injetar TTS</span>
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-8" 
                            onClick={() => setCurrentAction('capture')}
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            <span className="text-xs">DTMF</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full h-8" 
                            onClick={() => setCurrentAction('inject')}
                          >
                            <ArrowLeft className="w-3 h-3 mr-1" />
                            <span className="text-xs">Voltar</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* CAPTURAR DÍGITOS */}
                    {currentAction === 'capture' && (
                      <div className="space-y-3 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Capturar Dígitos</p>
                        <div className="bg-muted/30 rounded-lg p-4 min-h-[80px] flex items-center justify-center border-2 border-dashed border-primary/20">
                          <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                            {capturedDigits || '---'}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            size="sm" 
                            variant={isCapturing ? "default" : "outline"}
                            className="w-full" 
                            onClick={() => {
                              setIsCapturing(!isCapturing);
                              if (!isCapturing) {
                                toast({ title: 'Captura iniciada', description: 'Capturando dígitos...' });
                                // Simulação de captura
                                setTimeout(() => setCapturedDigits(prev => prev + Math.floor(Math.random() * 10)), 1000);
                              } else {
                                toast({ title: 'Captura pausada' });
                              }
                            }}
                          >
                            {isCapturing ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                            <span className="text-xs">{isCapturing ? 'Pausar' : 'Iniciar'}</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => {
                              setCapturedDigits('');
                              toast({ title: 'Dígitos limpos' });
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Limpar</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleDownloadDigits}
                            disabled={!capturedDigits}
                          >
                            <Download className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Baixar</span>
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full" 
                          onClick={handleBackToActions}
                        >
                          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs">Voltar</span>
                        </Button>
                      </div>
                    )}

                    {/* TRANSFERIR */}
                    {currentAction === 'transfer' && (
                      <div className="space-y-3 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Você deseja transferir para quem a chamada?</p>
                        <Select value={transferTarget} onValueChange={setTransferTarget}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o destino" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="101">Ramal 101 - João Silva</SelectItem>
                            <SelectItem value="102">Ramal 102 - Maria Santos</SelectItem>
                            <SelectItem value="103">Ramal 103 - Pedro Costa</SelectItem>
                            <SelectItem value="104">Ramal 104 - Ana Lima</SelectItem>
                            <SelectItem value="suporte">Grupo Suporte</SelectItem>
                            <SelectItem value="vendas">Grupo Vendas</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="w-full" 
                            onClick={handleConfirmTransfer}
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs">Confirmar Transferência</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleBackToActions}
                          >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs">Voltar</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* ESCUTAR - RAMAL ESPIÃO */}
                    {currentAction === 'listen' && (
                      <div className="space-y-3 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Qual é seu ramal espião?</p>
                        <Select value={spyExtension} onValueChange={(value) => {
                          setSpyExtension(value);
                          setTimeout(() => setCurrentAction('listen-mode'), 300);
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione seu ramal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="201">Ramal 201</SelectItem>
                            <SelectItem value="202">Ramal 202</SelectItem>
                            <SelectItem value="203">Ramal 203</SelectItem>
                            <SelectItem value="204">Ramal 204</SelectItem>
                            <SelectItem value="205">Ramal 205</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full" 
                          onClick={handleBackToActions}
                        >
                          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs">Voltar</span>
                        </Button>
                      </div>
                    )}

                    {/* ESCUTAR - MODO */}
                    {currentAction === 'listen-mode' && (
                      <div className="space-y-3 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Qual modo usar?</p>
                        <Select value={listenMode} onValueChange={setListenMode}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o modo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="listen">Só Ouvir</SelectItem>
                            <SelectItem value="participate">Participar</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="w-full" 
                            onClick={handleConfirmListen}
                          >
                            <Headphones className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs">Iniciar Escuta</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleBackToActions}
                          >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs">Voltar</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* GRAVAR */}
                    {currentAction === 'record' && (
                      <div className="space-y-3 animate-scale-in">
                        <p className="text-xs font-semibold text-center">Gravação de Chamada</p>
                        
                        {!isRecording ? (
                          <>
                            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                              <p className="text-sm">Clique em Start para iniciar</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="w-full" 
                                onClick={() => {
                                  setIsRecording(true);
                                  toast({ title: 'Gravação iniciada', description: 'A chamada está sendo gravada' });
                                }}
                              >
                                <Play className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-xs">Start</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full" 
                                onClick={handleBackToActions}
                              >
                                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-xs">Voltar</span>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                              <p className="text-sm font-semibold">Gravando...</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="w-full" 
                                onClick={() => {
                                  setIsRecording(false);
                                  toast({ title: 'Gravação parada', description: 'A gravação foi interrompida' });
                                }}
                              >
                                <Pause className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-xs">Parar</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full" 
                                onClick={handleBackToActions}
                              >
                                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-xs">Voltar</span>
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
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

    </div>
  );
}
