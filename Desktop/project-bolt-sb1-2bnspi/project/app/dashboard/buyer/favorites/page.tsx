import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

const favorites = [
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
  },
  {
    id: 3,
    name: "Wiederverwendbare Wasserflasche",
    price: "24,99 €",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80",
    description: "BPA-frei, perfekt für unterwegs"
  }
];

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Favoriten</h2>
        <p className="text-muted-foreground">
          Ihre gespeicherten nachhaltigen Produkte
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-2">{product.description}</p>
              <p className="text-lg font-bold mb-4">{product.price}</p>
              <div className="flex gap-4">
                <Button className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Zum Warenkorb
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {favorites.length === 0 && (
        <Card className="p-12 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Keine Favoriten</h3>
          <p className="text-muted-foreground mb-4">
            Sie haben noch keine Produkte zu Ihren Favoriten hinzugefügt.
          </p>
          <Button>Produkte entdecken</Button>
        </Card>
      )}
    </div>
  );
}