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

interface Agent {
  id: number;
  name: string;
  extension: string;
  email: string;
  status: "online" | "offline" | "paused";
}

interface AgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: Agent | null;
  onSave: (agent: Omit<Agent, "id"> & { id?: number }) => void;
}

export function AgentModal({ open, onOpenChange, agent, onSave }: AgentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    extension: "",
    email: "",
    status: "offline" as Agent["status"],
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        extension: agent.extension,
        email: agent.email,
        status: agent.status,
      });
    } else {
      setFormData({
        name: "",
        extension: "",
        email: "",
        status: "offline",
      });
    }
  }, [agent, open]);

  const handleSave = () => {
    if (!formData.name || !formData.extension || !formData.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onSave(agent ? { ...formData, id: agent.id } : formData);
    onOpenChange(false);
    toast({
      title: "Sucesso",
      description: agent ? "Agente atualizado com sucesso" : "Agente criado com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{agent ? "Editar Agente" : "Criar Novo Agente"}</DialogTitle>
          <DialogDescription>
            {agent ? "Atualize as informações do agente" : "Preencha os dados para criar um novo agente"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo do agente"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="extension">Ramal *</Label>
            <Input
              id="extension"
              value={formData.extension}
              onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
              placeholder="Ex: 101"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="agente@empresa.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: Agent["status"]) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {agent ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
