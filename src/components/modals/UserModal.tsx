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

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: "active" | "suspended";
}

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSave: (user: Omit<User, "id"> & { id?: number }) => void;
}

export function UserModal({ open, onOpenChange, user, onSave }: UserModalProps) {
  const initialState = {
    name: "",
    email: "",
    company: "",
    plan: "basico",
    status: "active" as User["status"],
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          company: user.company,
          plan: user.plan,
          status: user.status,
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [user, open]);

  const handleClose = () => {
    setFormData(initialState);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.company) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onSave(user ? { ...formData, id: user.id } : formData);
    handleClose();
    toast({
      title: "Sucesso",
      description: user ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {user ? "Atualize as informações" : "Cadastre um novo usuário"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="user-name" className="text-xs font-medium">Nome *</Label>
            <Input
              id="user-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="user-email" className="text-xs font-medium">Email *</Label>
            <Input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@empresa.com"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="company" className="text-xs font-medium">Empresa *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Nome da empresa"
              className="h-9 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor="plan" className="text-xs font-medium">Plano</Label>
              <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="empresarial">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="user-status" className="text-xs font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value: User["status"]) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleSave} size="sm" className="flex-1 sm:flex-none">
            {user ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
