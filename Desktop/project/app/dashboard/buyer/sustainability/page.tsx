import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Recycle } from "lucide-react";

export default function SustainabilityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nachhaltigkeit</h2>
        <p className="text-muted-foreground">
          Ihr Beitrag zu einer besseren Umwelt
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold">CO₂ Einsparung</h3>
              <p className="text-2xl font-bold">142kg</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <TreePine className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold">Gepflanzte Bäume</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <Recycle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold">Plastik vermieden</h3>
              <p className="text-2xl font-bold">24kg</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Ihre Nachhaltigkeits-Erfolge</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Nachhaltigkeits-Score</span>
              <span className="text-sm font-medium">85/100</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">Nachhaltige Einkäufe</p>
                <p className="text-sm text-muted-foreground">
                  78% Ihrer Einkäufe sind nachhaltige Produkte
                </p>
              </div>
              <Badge variant="secondary">+12% zum Vormonat</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">Verpackungsfrei</p>
                <p className="text-sm text-muted-foreground">
                  24kg Plastik durch alternative Verpackungen eingespart
                </p>
              </div>
              <Badge variant="secondary">+8% zum Vormonat</Badge>
            </div>
          </div>

          <Button className="w-full">
            <Leaf className="mr-2 h-4 w-4" />
            Mehr über Ihren Beitrag erfahren
          </Button>
        </div>
      </Card>
    </div>
  );
}