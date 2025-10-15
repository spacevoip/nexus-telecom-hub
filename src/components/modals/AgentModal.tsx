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

interface Agent {
  id: number;
  name: string;
  extension: string;
  password: string;
  callerId: string;
}

interface AgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: Agent | null;
  onSave: (agent: Omit<Agent, "id"> & { id?: number }) => void;
}

const generateExtension = () => {
  return `${Math.floor(100 + Math.random() * 900)}`;
};

export function AgentModal({ open, onOpenChange, agent, onSave }: AgentModalProps) {
  const initialState = {
    name: "",
    extension: "",
    password: "",
    callerId: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (open) {
      if (agent) {
        setFormData({
          name: agent.name,
          extension: agent.extension,
          password: agent.password,
          callerId: agent.callerId,
        });
      } else {
        setFormData({
          ...initialState,
          extension: generateExtension(),
        });
      }
    }
  }, [agent, open]);

  const handleClose = () => {
    setFormData(initialState);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.password || !formData.callerId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onSave(agent ? { ...formData, id: agent.id } : formData);
    handleClose();
    toast({
      title: "Sucesso",
      description: agent ? "Agente atualizado com sucesso" : "Agente criado com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {agent ? "Editar Agente" : "Novo Agente"}
          </DialogTitle>
          <DialogDescription>
            {agent ? "Atualize as informações" : "Configure um novo agente"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="extension" className="text-xs font-medium">
              Ramal
            </Label>
            <Input
              id="extension"
              value={formData.extension}
              disabled
              className="bg-muted/50 cursor-not-allowed font-mono h-9 text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs font-medium">
              Nome do Agente *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João Silva"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-xs font-medium">
              Senha *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="callerId" className="text-xs font-medium">
              Caller ID *
            </Label>
            <Input
              id="callerId"
              value={formData.callerId}
              onChange={(e) => setFormData({ ...formData, callerId: e.target.value })}
              placeholder="Ex: João Silva <101>"
              className="h-9 text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleSave} size="sm" className="flex-1 sm:flex-none">
            {agent ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
