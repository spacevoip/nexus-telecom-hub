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
      <DialogContent className="sm:max-w-[480px] animate-in">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {agent ? "Editar Agente" : "Novo Agente"}
          </DialogTitle>
          <DialogDescription>
            {agent ? "Atualize as informações do agente" : "Configure um novo agente no sistema"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="extension" className="text-sm font-medium">
              Ramal
            </Label>
            <Input
              id="extension"
              value={formData.extension}
              disabled
              className="bg-muted/50 cursor-not-allowed font-mono h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome do Agente *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: João Silva"
              className="h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className="h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="callerId" className="text-sm font-medium">
              Caller ID *
            </Label>
            <Input
              id="callerId"
              value={formData.callerId}
              onChange={(e) => setFormData({ ...formData, callerId: e.target.value })}
              placeholder="Ex: João Silva <101>"
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1 sm:flex-none gradient-primary shadow-primary">
            {agent ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
