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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { FileText, FileSpreadsheet, FileDown } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export function ExportModal({ open, onOpenChange, title = "Exportar Dados" }: ExportModalProps) {
  const [format, setFormat] = useState("csv");

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: `Seu arquivo ${format.toUpperCase()} será baixado em instantes`,
    });
    
    // Simulação de download
    setTimeout(() => {
      toast({
        title: "Sucesso",
        description: "Arquivo exportado com sucesso",
      });
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Escolha o formato
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <RadioGroup value={format} onValueChange={setFormat} className="gap-2">
            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">CSV</p>
                  <p className="text-xs text-muted-foreground">Valores separados</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileSpreadsheet className="h-4 w-4 text-success" />
                <div className="text-sm">
                  <p className="font-medium">Excel</p>
                  <p className="text-xs text-muted-foreground">Planilha (.xlsx)</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileDown className="h-4 w-4 text-destructive" />
                <div className="text-sm">
                  <p className="font-medium">PDF</p>
                  <p className="text-xs text-muted-foreground">Documento PDF</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm" className="flex-1 sm:flex-none">
            Cancelar
          </Button>
          <Button onClick={handleExport} size="sm" className="flex-1 sm:flex-none">
            <FileDown className="mr-2 h-3 w-3" />
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
