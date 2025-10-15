import { useState, useEffect } from "react";
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
  const initialState = {
    name: "",
    category: "ura",
    file: null as File | null,
  };

  const [name, setName] = useState("");
  const [category, setCategory] = useState("ura");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setCategory("ura");
      setFile(null);
    }
  }, [open]);

  const handleClose = () => {
    setName("");
    setCategory("ura");
    setFile(null);
    onOpenChange(false);
  };

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
    handleClose();
    
    toast({
      title: "Sucesso",
      description: "Áudio enviado com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload de Áudio</DialogTitle>
          <DialogDescription>
            Envie MP3, WAV ou OGG
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="audio-name" className="text-xs font-medium">Nome do Áudio *</Label>
            <Input
              id="audio-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mensagem de boas-vindas"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="category" className="text-xs font-medium">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9">
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

          <div className="grid gap-1.5">
            <Label htmlFor="file" className="text-xs font-medium">Arquivo *</Label>
            <Input
              id="file"
              type="file"
              accept=".mp3,.wav,.ogg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer h-9 text-sm"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleUpload} size="sm" className="flex-1 sm:flex-none">
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
