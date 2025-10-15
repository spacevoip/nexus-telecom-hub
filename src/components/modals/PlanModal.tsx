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
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          <DialogDescription>
            {plan ? "Atualize as informações" : "Configure um novo plano"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="plan-name" className="text-xs font-medium">Nome *</Label>
            <Input
              id="plan-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Plano Empresarial"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor="price" className="text-xs font-medium">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="299"
                className="h-9 text-sm"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="minutes" className="text-xs font-medium">Minutos</Label>
              <Input
                id="minutes"
                type="number"
                value={formData.minutes}
                onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) })}
                placeholder="3000"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor="agents" className="text-xs font-medium">Agentes</Label>
              <Input
                id="agents"
                type="number"
                value={formData.agents}
                onChange={(e) => setFormData({ ...formData, agents: parseInt(e.target.value) })}
                placeholder="10"
                className="h-9 text-sm"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="concurrent" className="text-xs font-medium">Simultâneas</Label>
              <Input
                id="concurrent"
                type="number"
                value={formData.concurrent}
                onChange={(e) => setFormData({ ...formData, concurrent: parseInt(e.target.value) })}
                placeholder="15"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="features" className="text-xs font-medium">Features (1 por linha)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="URA Avançada&#10;Relatórios&#10;Suporte 24/7"
              rows={3}
              className="text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleSave} size="sm" className="flex-1 sm:flex-none">
            {plan ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
