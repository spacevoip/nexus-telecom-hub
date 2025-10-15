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
import { toast } from "@/hooks/use-toast";

interface CallActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "transfer" | "listen" | null;
  callId?: number;
}

export function CallActionModal({ open, onOpenChange, action, callId }: CallActionModalProps) {
  const [extension, setExtension] = useState("");

  useEffect(() => {
    if (!open) {
      setExtension("");
    }
  }, [open]);

  const handleClose = () => {
    setExtension("");
    onOpenChange(false);
  };

  const handleAction = () => {
    if (action === "transfer" && !extension) {
      toast({
        title: "Erro",
        description: "Informe o ramal de destino",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: action === "transfer" 
        ? `Chamada transferida para ramal ${extension}` 
        : "Escuta ativada com sucesso",
    });
    
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {action === "transfer" ? "Transferir Chamada" : "Escutar Chamada"}
          </DialogTitle>
          <DialogDescription>
            {action === "transfer" 
              ? "Informe o ramal para onde deseja transferir a chamada" 
              : "Você está prestes a escutar esta chamada em andamento"}
          </DialogDescription>
        </DialogHeader>

        {action === "transfer" && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="extension">Ramal de Destino</Label>
              <Input
                id="extension"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
                placeholder="Ex: 105"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAction}>
            {action === "transfer" ? "Transferir" : "Iniciar Escuta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
