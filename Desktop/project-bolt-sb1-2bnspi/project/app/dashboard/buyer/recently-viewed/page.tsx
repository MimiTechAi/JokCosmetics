import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types";

const recentlyViewed: Product[] = [
  {
    id: 1,
    name: "Bio-Baumwoll T-Shirt",
    price: "29,99 €",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
    description: "100% Bio-Baumwolle, fair produziert"
  },
  {
    id: 2,
    name: "Bambuszahnbürste Set",
    price: "12,99 €",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80",
    description: "Nachhaltige Zahnpflege aus Bambus"
  }
];

export default function RecentlyViewedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kürzlich angesehen</h2>
        <p className="text-muted-foreground">
          Produkte, die Sie sich zuletzt angesehen haben
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recentlyViewed.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white dark:bg-gray-950 p-2 rounded-full shadow-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-2">{product.description}</p>
              <p className="text-lg font-bold mb-4">{product.price}</p>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Zum Warenkorb
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {recentlyViewed.length === 0 && (
        <Card className="p-12 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Keine kürzlich angesehenen Produkte</h3>
          <p className="text-muted-foreground mb-4">
            Sie haben sich noch keine Produkte angesehen.
          </p>
          <Button>Produkte entdecken</Button>
        </Card>
      )}
    </div>
  );
}