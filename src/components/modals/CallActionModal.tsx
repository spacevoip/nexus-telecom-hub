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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "transfer" ? "Transferir" : "Escutar"}
          </DialogTitle>
          <DialogDescription>
            {action === "transfer" 
              ? "Informe o ramal de destino" 
              : "Você irá escutar esta chamada"}
          </DialogDescription>
        </DialogHeader>

        {action === "transfer" && (
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="extension" className="text-xs font-medium">Ramal de Destino</Label>
            <Input
              id="extension"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              placeholder="Ex: 105"
              className="h-9 text-sm"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleAction} size="sm" className="flex-1 sm:flex-none">
            {action === "transfer" ? "Transferir" : "Escutar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
