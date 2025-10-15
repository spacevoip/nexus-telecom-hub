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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Plan {
  id: number;
  name: string;
  price: number;
  minutes: number;
  agents: number;
  concurrent: number;
  features: string[];
}

interface PlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan | null;
  onSave: (plan: Omit<Plan, "id"> & { id?: number }) => void;
}

export function PlanModal({ open, onOpenChange, plan, onSave }: PlanModalProps) {
  const initialState = {
    name: "",
    price: 0,
    minutes: 0,
    agents: 0,
    concurrent: 0,
    features: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (open) {
      if (plan) {
        setFormData({
          name: plan.name,
          price: plan.price,
          minutes: plan.minutes,
          agents: plan.agents,
          concurrent: plan.concurrent,
          features: plan.features.join("\n"),
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [plan, open]);

  const handleClose = () => {
    setFormData(initialState);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!formData.name || formData.price <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const features = formData.features.split("\n").filter(f => f.trim());
    
    onSave({
      ...(plan ? { id: plan.id } : {}),
      name: formData.name,
      price: formData.price,
      minutes: formData.minutes,
      agents: formData.agents,
      concurrent: formData.concurrent,
      features,
    });
    
    handleClose();
    toast({
      title: "Sucesso",
      description: plan ? "Plano atualizado com sucesso" : "Plano criado com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar Plano" : "Criar Novo Plano"}</DialogTitle>
          <DialogDescription>
            {plan ? "Atualize as informações do plano" : "Configure um novo plano de serviço"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-name">Nome do Plano *</Label>
            <Input
              id="plan-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Plano Empresarial"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Preço Mensal (R$) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="299.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="minutes">Minutos Inclusos</Label>
              <Input
                id="minutes"
                type="number"
                value={formData.minutes}
                onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) })}
                placeholder="3000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="agents">Número de Agentes</Label>
              <Input
                id="agents"
                type="number"
                value={formData.agents}
                onChange={(e) => setFormData({ ...formData, agents: parseInt(e.target.value) })}
                placeholder="10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="concurrent">Chamadas Simultâneas</Label>
              <Input
                id="concurrent"
                type="number"
                value={formData.concurrent}
                onChange={(e) => setFormData({ ...formData, concurrent: parseInt(e.target.value) })}
                placeholder="15"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="features">Features (uma por linha)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="URA Avançada&#10;Relatórios Personalizados&#10;Suporte Prioritário"
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {plan ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
