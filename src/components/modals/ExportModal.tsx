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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Escolha o formato para exportar os dados
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">CSV</p>
                  <p className="text-sm text-muted-foreground">Arquivo de valores separados por vírgula</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileSpreadsheet className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Excel</p>
                  <p className="text-sm text-muted-foreground">Planilha do Microsoft Excel (.xlsx)</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-3 cursor-pointer flex-1">
                <FileDown className="h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium">PDF</p>
                  <p className="text-sm text-muted-foreground">Documento em formato PDF</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
