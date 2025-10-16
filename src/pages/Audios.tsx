import { useState, useMemo } from 'react';
import { Upload, Play, Pause, Download, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AudioUploadModal } from '@/components/modals/AudioUploadModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { toast } from '@/hooks/use-toast';

interface Audio {
  id: string;
  name: string;
  duration: string;
  category: 'greeting' | 'ivr' | 'hold' | 'announcement';
  uploadDate: string;
}

const mockAudios: Audio[] = [
  { id: '1', name: 'Bem-vindo à empresa', duration: '00:15', category: 'greeting', uploadDate: '10/10/2025' },
  { id: '2', name: 'Aguarde, conectando...', duration: '00:08', category: 'hold', uploadDate: '10/10/2025' },
  { id: '3', name: 'Música de espera 1', duration: '02:30', category: 'hold', uploadDate: '09/10/2025' },
  { id: '4', name: 'Menu principal URA', duration: '00:45', category: 'ivr', uploadDate: '08/10/2025' },
  { id: '5', name: 'Horário de atendimento', duration: '00:20', category: 'announcement', uploadDate: '08/10/2025' },
  { id: '6', name: 'Feriados e exceções', duration: '00:35', category: 'announcement', uploadDate: '07/10/2025' },
];

// Memoized waveform component to prevent re-render on every parent update
const WaveformDisplay = ({ audioId, isPlaying }: { audioId: string; isPlaying: boolean }) => {
  const waveformHeights = useMemo(() => 
    Array.from({ length: 40 }).map(() => Math.random() * 100),
    [audioId]
  );

  return (
    <div className="h-16 bg-muted rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
      <div className="flex items-end gap-1 h-12">
        {waveformHeights.map((height, i) => (
          <div
            key={i}
            className="w-1 bg-primary/30 rounded-full transition-all"
            style={{
              height: `${height}%`,
              opacity: isPlaying ? 0.8 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function Audios() {
  const [search, setSearch] = useState('');
  const [audios] = useState<Audio[]>(mockAudios);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [audioToDelete, setAudioToDelete] = useState<string | null>(null);

  const filteredAudios = audios.filter((audio) =>
    audio.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryBadge = (category: Audio['category']) => {
    const variants = {
      greeting: { label: 'Saudação', className: 'bg-primary/10 text-primary border-primary/20' },
      ivr: { label: 'URA', className: 'bg-accent/10 text-accent border-accent/20' },
      hold: { label: 'Espera', className: 'bg-warning/10 text-warning border-warning/20' },
      announcement: { label: 'Anúncio', className: 'bg-success/10 text-success border-success/20' },
    };
    const variant = variants[category];
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };


  const handleUpload = (audio: any) => {
    console.log('Upload:', audio);
  };

  const handleDelete = (id: string) => {
    setAudioToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    toast({
      title: 'Áudio removido',
      description: 'O áudio foi removido com sucesso',
    });
    setIsDeleteModalOpen(false);
    setAudioToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de Áudios</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie mensagens, URA e músicas de espera
          </p>
        </div>
        <Button className="gradient-primary shadow-primary" onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload de Áudio
        </Button>
      </div>


      {/* Search */}
      <Card className="p-4 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar áudios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Audio Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAudios.map((audio) => (
          <Card key={audio.id} className="p-6 shadow-card hover:shadow-lg transition-smooth">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{audio.name}</h3>
                <p className="text-sm text-muted-foreground">{audio.uploadDate}</p>
              </div>
              {getCategoryBadge(audio.category)}
            </div>

            {/* Waveform Placeholder */}
            <WaveformDisplay audioId={audio.id} isPlaying={playingId === audio.id} />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-medium">{audio.duration}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPlayingId(playingId === audio.id ? null : audio.id)}
                >
                  {playingId === audio.id ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Download iniciado' })}>
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(audio.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AudioUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUpload}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Confirmar exclusão de áudio"
        description="Tem certeza que deseja excluir este áudio? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
