"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { optimizeProductDescription } from "@/lib/ai/product-optimizer";
import type { OptimizedProduct } from "@/lib/ai/product-optimizer";

interface DescriptionOptimizerProps {
  productName: string;
  currentDescription: string;
  category?: string;
  onClose: () => void;
  onUpdate: (optimizedDescription: string) => void;
}

export function DescriptionOptimizer({
  productName,
  currentDescription,
  category,
  onClose,
  onUpdate,
}: DescriptionOptimizerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(currentDescription);
  const [optimizedProduct, setOptimizedProduct] = useState<OptimizedProduct | null>(null);

  const handleOptimize = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Fehlende Beschreibung",
        description: "Bitte geben Sie eine Produktbeschreibung ein.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await optimizeProductDescription(
        productName,
        description.trim(),
        category
      );

      setOptimizedProduct(result);
      
      toast({
        title: "Beschreibung optimiert",
        description: "Die KI hat eine optimierte Version generiert.",
      });
    } catch (error) {
      console.error("Optimization error:", error);
      toast({
        variant: "destructive",
        title: "Optimierung fehlgeschlagen",
        description: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (optimizedProduct) {
      onUpdate(optimizedProduct.description);
      onClose();
      toast({
        title: "Beschreibung aktualisiert",
        description: "Die optimierte Version wurde übernommen.",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Produktbeschreibung optimieren</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{productName}</h3>
            {category && (
              <Badge variant="secondary" className="mb-4">
                {category}
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Aktuelle Beschreibung
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                placeholder="Beschreiben Sie Ihr Produkt..."
              />
            </div>

            <Button
              onClick={handleOptimize}
              disabled={isLoading || !description.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Optimiere...
                </>
              ) : (
                <>
                  <Icons.sparkles className="mr-2 h-4 w-4" />
                  Mit KI optimieren
                </>
              )}
            </Button>

            {optimizedProduct && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Optimierte Beschreibung
                  </label>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {optimizedProduct.description}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    SEO-Optimierung
                  </label>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Titel:</strong> {optimizedProduct.seoTitle}
                    </p>
                    <p className="text-sm">
                      <strong>Meta-Beschreibung:</strong> {optimizedProduct.seoDescription}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Highlights
                  </label>
                  <ul className="list-disc list-inside space-y-1">
                    {optimizedProduct.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm">{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Keywords
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {optimizedProduct.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <Button variant="outline" onClick={onClose}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleApply}>
                    Vorschlag übernehmen
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}