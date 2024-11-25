"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Filter } from "lucide-react";
import Image from "next/image";

interface ProductGridProps {
  categoryId?: string;
  filters?: string[];
  certifications?: string[];
}

// Sample products - In production, fetch from API
const products = [
  {
    id: 1,
    name: "Bio-Baumwoll T-Shirt",
    price: "29,99 €",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
    description: "100% Bio-Baumwolle, fair produziert",
    badges: ["Bio", "Fair Trade"],
    sustainabilityScore: 92
  },
  {
    id: 2,
    name: "Bambuszahnbürste Set",
    price: "12,99 €",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80",
    description: "Nachhaltige Zahnpflege aus Bambus",
    badges: ["Plastikfrei", "Vegan"],
    sustainabilityScore: 95
  },
  {
    id: 3,
    name: "Wiederverwendbare Wasserflasche",
    price: "24,99 €",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80",
    description: "BPA-frei, perfekt für unterwegs",
    badges: ["Zero Waste", "BPA-frei"],
    sustainabilityScore: 88
  },
  {
    id: 4,
    name: "Bio-Kaffeebohnen",
    price: "16,99 €",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80",
    description: "Fair gehandelter Bio-Kaffee",
    badges: ["Bio", "Fair Trade"],
    sustainabilityScore: 90
  }
];

export function ProductGrid({ categoryId, filters, certifications }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.some(filter => product.badges.includes(filter));
    
    return matchesSearch && matchesFilters;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "sustainability":
        return b.sustainabilityScore - a.sustainabilityScore;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Produkte durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sortieren nach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Empfohlen</SelectItem>
            <SelectItem value="price-asc">Preis aufsteigend</SelectItem>
            <SelectItem value="price-desc">Preis absteigend</SelectItem>
            <SelectItem value="sustainability">Nachhaltigkeit</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedFilters(prev =>
                  prev.includes(filter)
                    ? prev.filter(f => f !== filter)
                    : [...prev, filter]
                );
              }}
            >
              {filter}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                    {badge}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold">{product.price}</p>
                <Badge variant="secondary">
                  {product.sustainabilityScore}% Nachhaltig
                </Badge>
              </div>
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Zum Warenkorb
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Keine Produkte gefunden</h3>
          <p className="text-muted-foreground">
            Bitte versuchen Sie es mit anderen Suchkriterien.
          </p>
        </Card>
      )}
    </div>
  );
}