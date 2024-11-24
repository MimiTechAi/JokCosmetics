import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductRecommender } from "@/components/ai/product-recommender";
import {
  Leaf,
  Package,
  Recycle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export default function BuyerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mein Dashboard</h2>
        <p className="text-muted-foreground">
          Willkommen zurück! Hier finden Sie Ihre Übersicht.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 rounded-full dark:bg-emerald-900">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Bestellungen
              </p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
              <Recycle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                CO₂ Einsparung
              </p>
              <h3 className="text-2xl font-bold">142kg</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-violet-100 rounded-full dark:bg-violet-900">
              <Leaf className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nachhaltigkeits-Score
              </p>
              <h3 className="text-2xl font-bold">85/100</h3>
            </div>
          </div>
        </Card>
      </div>

      <ProductRecommender />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Letzte Bestellungen</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center space-x-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Bestellung #{order}23456</p>
                    <p className="text-sm text-muted-foreground">
                      2 Produkte • €49,98
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">In Bearbeitung</Badge>
              </div>
            ))}
          </div>
          <Button variant="link" className="mt-4 w-full">
            Alle Bestellungen ansehen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Nachhaltigkeits-Tipps</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <h4 className="font-medium mb-2">Verpackungsfrei einkaufen</h4>
              <p className="text-sm text-muted-foreground">
                Entdecken Sie unsere neue Kollektion an verpackungsfreien Produkten
                und reduzieren Sie Ihren Plastikverbrauch.
              </p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <h4 className="font-medium mb-2">CO₂-Kompensation</h4>
              <p className="text-sm text-muted-foreground">
                Mit jedem Einkauf können Sie einen Beitrag zur CO₂-Kompensation
                leisten. Erfahren Sie mehr über unser Klimaschutzprogramm.
              </p>
            </div>
          </div>
          <Button variant="link" className="mt-4 w-full">
            Mehr Tipps
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
}