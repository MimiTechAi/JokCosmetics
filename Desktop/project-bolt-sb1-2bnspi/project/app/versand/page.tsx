import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Truck, Package, Recycle, Clock } from "lucide-react";

export default function VersandPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Versand</Badge>
          <h1 className="text-4xl font-bold mb-6">Versand & Retouren</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Klimaneutral, nachhaltig und kundenfreundlich
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Versandinformationen</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-medium">Versandkosten</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Deutschland: Kostenloser Versand ab 50€
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Österreich & Schweiz: 9,95€
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    EU-Länder: 12,95€
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Lieferzeiten</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Deutschland: 2-4 Werktage
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Österreich & Schweiz: 3-5 Werktage
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    EU-Länder: 5-7 Werktage
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Retouren</h2>
            </div>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Rücksendeablauf</h3>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-center">
                      <span className="mr-2">1.</span>
                      Melden Sie die Retoure in Ihrem Kundenkonto an
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">2.</span>
                      Drucken Sie das Retourenlabel aus
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">3.</span>
                      Verpacken Sie die Ware sicher
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">4.</span>
                      Geben Sie das Paket bei einer Postfiliale ab
                    </li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Rückerstattung</h3>
                  <p className="text-muted-foreground">
                    Nach Eingang und Prüfung der Retoure erhalten Sie den Kaufpreis innerhalb von 14 Tagen zurück.
                    Die Rückzahlung erfolgt auf demselben Weg wie die ursprüngliche Zahlung.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Recycle className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Nachhaltige Verpackung</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Wir verwenden ausschließlich umweltfreundliche Verpackungsmaterialien:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Recycelte Kartonagen</h3>
                <p className="text-sm text-muted-foreground">
                  100% recycelbare und wiederverwendbare Versandkartons
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Plastikfreies Füllmaterial</h3>
                <p className="text-sm text-muted-foreground">
                  Naturmaterialien zum Schutz Ihrer Bestellung
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Kompostierbare Versandtaschen</h3>
                <p className="text-sm text-muted-foreground">
                  Biologisch abbaubare Alternativen zu Plastik
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Papierklebeband</h3>
                <p className="text-sm text-muted-foreground">
                  Recyclingfähige Verschlussmaterialien
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}