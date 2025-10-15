import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface AudioUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (audio: { name: string; category: string; file: File | null }) => void;
}

export function AudioUploadModal({ open, onOpenChange, onUpload }: AudioUploadModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("ura");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!name || !file) {
      toast({
        title: "Erro",
        description: "Preencha o nome e selecione um arquivo",
        variant: "destructive",
      });
      return;
    }

    onUpload({ name, category, file });
    onOpenChange(false);
    setName("");
    setCategory("ura");
    setFile(null);
    
    toast({
      title: "Sucesso",
      description: "Áudio enviado com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload de Áudio</DialogTitle>
          <DialogDescription>
            Envie um novo áudio para o sistema (formatos: MP3, WAV, OGG)
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="audio-name">Nome do Áudio *</Label>
            <Input
              id="audio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mensagem de boas-vindas"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ura">URA</SelectItem>
                <SelectItem value="espera">Espera</SelectItem>
                <SelectItem value="saudacao">Saudação</SelectItem>
                <SelectItem value="anuncio">Anúncio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">Arquivo de Áudio *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".mp3,.wav,.ogg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Arquivo: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpload}>
            Fazer Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
