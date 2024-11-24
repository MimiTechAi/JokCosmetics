"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Bio-Baumwoll T-Shirt",
    price: "29,99 €",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
    badges: ["Bio", "Fair Trade"]
  },
  {
    id: 2,
    name: "Bambuszahnbürste Set",
    price: "12,99 €",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80",
    badges: ["Plastikfrei", "Vegan"]
  },
  {
    id: 3,
    name: "Wiederverwendbare Wasserflasche",
    price: "24,99 €",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80",
    badges: ["Zero Waste", "BPA-frei"]
  },
  {
    id: 4,
    name: "Bio-Kaffeebohnen",
    price: "16,99 €",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80",
    badges: ["Bio", "Fair Trade"]
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50 dark:from-gray-950 dark:to-emerald-950/20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Empfohlen</Badge>
          <h2 className="text-3xl font-bold mb-4">Beliebte Produkte</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie unsere meistverkauften nachhaltigen Produkte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  {product.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                      {badge}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.price}</p>
                <Button className="w-full group">
                  <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Zum Warenkorb
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}