"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  price: string;
  sustainability_score: number;
  image: string;
  tags: string[];
}

const mockRecommendations: ProductRecommendation[] = [
  {
    id: "1",
    name: "Bambus Zahnbürsten Set",
    description: "100% biologisch abbaubare Zahnbürsten aus nachhaltigem Bambus",
    price: "12,99 €",
    sustainability_score: 95,
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80",
    tags: ["Plastikfrei", "Zero Waste", "Vegan"]
  },
  {
    id: "2",
    name: "Bio-Baumwoll T-Shirt",
    description: "Fair produziertes T-Shirt aus 100% Bio-Baumwolle",
    price: "29,99 €",
    sustainability_score: 90,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
    tags: ["Fair Trade", "Bio", "Nachhaltig"]
  }
];

export function ProductRecommender() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);

  const getRecommendations = async () => {
    setIsLoading(true);
    try {
      // In production, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecommendations(mockRecommendations);
      
      toast({
        title: "Empfehlungen geladen",
        description: "Ihre personalisierten Produktempfehlungen wurden aktualisiert.",
      });
    } catch (error) {
      console.error("Failed to load recommendations:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Empfehlungen konnten nicht geladen werden.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Persönliche Empfehlungen</h3>
            <p className="text-sm text-muted-foreground">
              Nachhaltige Produkte basierend auf Ihren Interessen
            </p>
          </div>
          <Button
            onClick={getRecommendations}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border p-2"
            >
              <div className="relative aspect-square mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    {product.sustainability_score}% Nachhaltig
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold">{product.price}</span>
                  <Button size="sm">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <Icons.sparkles className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Klicken Sie auf den Button oben, um personalisierte Empfehlungen zu erhalten
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}