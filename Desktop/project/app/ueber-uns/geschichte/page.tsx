import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { History, Users, Target, Rocket, Leaf, Eye, Sparkles } from "lucide-react";

export default function GeschichtePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Über uns</Badge>
          <h1 className="text-4xl font-bold mb-6">Unsere Geschichte</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von der Vision zur führenden Plattform für nachhaltigen Konsum
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <History className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Die Anfänge</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Was als kleine Initiative begann, hat sich zu einem führenden Marktplatz für nachhaltige Produkte entwickelt.
              Unsere Gründer erkannten früh die Notwendigkeit einer Plattform, die nachhaltige Händler und umweltbewusste
              Konsumenten zusammenbringt.
            </p>
          </Card>

          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Unsere Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Wir setzen uns dafür ein, dass nachhaltiger Konsum zur Norm wird. Durch strenge Qualitätskontrollen und
              transparente Kommunikation schaffen wir Vertrauen zwischen Händlern und Kunden.
            </p>
          </Card>

          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Unsere Werte</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-medium">Nachhaltigkeit</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Wir fördern umweltbewusstes Handeln und nachhaltige Produktionsmethoden.
                </p>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-medium">Transparenz</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Offene Kommunikation und nachvollziehbare Prozesse sind uns wichtig.
                </p>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-medium">Innovation</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Wir entwickeln stetig neue Lösungen für nachhaltigen Konsum.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Rocket className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Die Zukunft</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Unser Ziel ist es, weiterhin zu wachsen und noch mehr Menschen den Zugang zu nachhaltigen Produkten zu
              ermöglichen. Dabei bleiben wir unseren Werten treu und setzen auf Innovation und Transparenz.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}