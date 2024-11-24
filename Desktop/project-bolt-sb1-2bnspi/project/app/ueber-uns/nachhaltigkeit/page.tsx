import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Recycle, Shield, Users, Award, TreePine } from "lucide-react";

export default function NachhaltigkeitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Nachhaltigkeit</Badge>
          <h1 className="text-4xl font-bold mb-6">Nachhaltigkeit bei Naturio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nachhaltigkeit ist nicht nur ein Trend, sondern unsere Überzeugung
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Unsere Prinzipien</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Produktprüfung</h3>
                <p className="text-sm text-muted-foreground">
                  Strenge Prüfung aller Produkte auf Nachhaltigkeit
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Regionale Produktion</h3>
                <p className="text-sm text-muted-foreground">
                  Förderung regionaler und fairer Produktion
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Transparenz</h3>
                <p className="text-sm text-muted-foreground">
                  Transparente Lieferketten und Kommunikation
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <h3 className="font-medium mb-2">Verpackung</h3>
                <p className="text-sm text-muted-foreground">
                  Plastikfreie und klimaneutrale Versandlösungen
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Produktprüfung</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Jedes Produkt auf unserem Marktplatz durchläuft eine gründliche Nachhaltigkeitsprüfung.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Materialien & Rohstoffe</span>
                  <span className="text-emerald-600">95%</span>
                </div>
                <Progress value={95} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Produktionsprozess</span>
                  <span className="text-emerald-600">90%</span>
                </div>
                <Progress value={90} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Arbeitsbedingungen</span>
                  <span className="text-emerald-600">100%</span>
                </div>
                <Progress value={100} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transportwege</span>
                  <span className="text-emerald-600">85%</span>
                </div>
                <Progress value={85} />
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <TreePine className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Umweltschutz</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Recycle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-medium mb-2">CO₂-Kompensation</h3>
                <p className="text-sm text-muted-foreground">
                  Wir kompensieren unseren CO₂-Ausstoß
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <TreePine className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-medium mb-2">Aufforstung</h3>
                <p className="text-sm text-muted-foreground">
                  Ein Baum für jede 100. Bestellung
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-medium mb-2">Soziale Verantwortung</h3>
                <p className="text-sm text-muted-foreground">
                  Faire Arbeitsbedingungen garantiert
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}