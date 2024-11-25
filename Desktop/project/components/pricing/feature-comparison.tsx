import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Minus } from "lucide-react";

interface FeatureComparisonProps {
  open: boolean;
  onClose: () => void;
}

const features = {
  "Produktverwaltung": {
    "Anzahl Produkte": {
      starter: "Bis zu 3",
      basis: "Bis zu 10",
      standard: "Bis zu 25",
      pro: "Bis zu 100",
      business: "Unbegrenzt"
    },
    "Produktbeschreibungen": {
      starter: true,
      basis: true,
      standard: true,
      pro: true,
      business: true
    },
    "Produktvarianten": {
      starter: false,
      basis: true,
      standard: true,
      pro: true,
      business: true
    },
    "Lagerbestandsverwaltung": {
      starter: "Basic",
      basis: "Standard",
      standard: "Erweitert",
      pro: "Premium",
      business: "Enterprise"
    }
  },
  "KI-Funktionen": {
    "Selbsthilfe-Assistent": {
      starter: "Basic",
      basis: "Standard",
      standard: "Erweitert",
      pro: "Premium",
      business: "Custom"
    },
    "Produktoptimierung": {
      starter: false,
      basis: "Basic",
      standard: "Standard",
      pro: "Premium",
      business: "Enterprise"
    },
    "Marktanalyse": {
      starter: false,
      basis: false,
      standard: "Basic",
      pro: "Premium",
      business: "Enterprise"
    },
    "Personalisierte Empfehlungen": {
      starter: false,
      basis: false,
      standard: true,
      pro: true,
      business: true
    }
  },
  "Analytics & Reporting": {
    "Verkaufsübersichten": {
      starter: "Basic",
      basis: "Standard",
      standard: "Erweitert",
      pro: "Premium",
      business: "Enterprise"
    },
    "Kundenanalyse": {
      starter: false,
      basis: "Basic",
      standard: "Standard",
      pro: "Premium",
      business: "Enterprise"
    },
    "Trendanalysen": {
      starter: false,
      basis: false,
      standard: true,
      pro: true,
      business: true
    }
  }
};

export function FeatureComparison({ open, onClose }: FeatureComparisonProps) {
  const renderValue = (value: any) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
      ) : (
        <Minus className="h-5 w-5 text-gray-300 mx-auto" />
      );
    }
    return value;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Feature-Vergleich</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {Object.entries(features).map(([category, categoryFeatures]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-emerald-50 dark:bg-emerald-950/50">
                      <TableHead className="w-[200px] font-semibold">Feature</TableHead>
                      <TableHead className="text-center font-semibold">Starter</TableHead>
                      <TableHead className="text-center font-semibold">Basis</TableHead>
                      <TableHead className="text-center font-semibold">Standard</TableHead>
                      <TableHead className="text-center font-semibold">Pro</TableHead>
                      <TableHead className="text-center font-semibold">Business</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(categoryFeatures).map(([feature, values]: [string, any]) => (
                      <TableRow key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableCell className="font-medium">{feature}</TableCell>
                        <TableCell className="text-center">{renderValue(values.starter)}</TableCell>
                        <TableCell className="text-center">{renderValue(values.basis)}</TableCell>
                        <TableCell className="text-center">{renderValue(values.standard)}</TableCell>
                        <TableCell className="text-center">{renderValue(values.pro)}</TableCell>
                        <TableCell className="text-center">{renderValue(values.business)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}