"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Plus,
  Search,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ProductForm } from "@/components/product-form";
import { MarketAnalysis } from "@/components/market-analysis";

const products = [
  {
    id: 1,
    name: "Bio-Baumwoll T-Shirt",
    category: "Mode",
    price: "29,99 €",
    stock: 45,
    status: "Aktiv",
    sustainability: 92,
  },
  {
    id: 2,
    name: "Bambuszahnbürste Set",
    category: "Hygiene",
    price: "12,99 €",
    stock: 145,
    status: "Aktiv",
    sustainability: 95,
  },
  {
    id: 3,
    name: "Wiederverwendbare Wasserflasche",
    category: "Haushalt",
    price: "24,99 €",
    stock: 28,
    status: "Niedrig",
    sustainability: 88,
  },
];

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produkte</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre nachhaltigen Produkte
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Produkt hinzufügen
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="products" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Produkte
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Marktanalyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Produkte durchsuchen..."
                  className="w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sortieren
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead>Preis</TableHead>
                    <TableHead>Bestand</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Nachhaltigkeit</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "Aktiv"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`font-medium ${
                              product.sustainability >= 90
                                ? "text-emerald-600"
                                : "text-orange-600"
                            }`}
                          >
                            {product.sustainability}%
                          </span>
                          {product.sustainability >= 90 && (
                            <Sparkles className="h-4 w-4 ml-1 text-emerald-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Bearbeiten
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <MarketAnalysis />
        </TabsContent>
      </Tabs>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </div>
  );
}