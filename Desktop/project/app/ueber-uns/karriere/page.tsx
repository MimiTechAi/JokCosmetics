import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, MapPin, Users, Rocket, GraduationCap, Heart, Mail } from "lucide-react";

export default function KarrierePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Karriere</Badge>
          <h1 className="text-4xl font-bold mb-6">Karriere bei Naturio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Werden Sie Teil unseres Teams und helfen Sie uns dabei, nachhaltigen Konsum zu fördern und die Zukunft des E-Commerce zu gestalten
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Warum Naturio?</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-medium">Sinnstiftende Arbeit</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aktiver Beitrag zu mehr Nachhaltigkeit
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-medium">Flexible Arbeitszeiten</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Remote-Optionen verfügbar
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-medium">Flache Hierarchien</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Offene Kommunikationskultur
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-medium">Weiterbildung</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regelmäßige Entwicklungsmöglichkeiten
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Briefcase className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Offene Stellen</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Senior Full-Stack Entwickler (m/w/d)</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Vollzeit
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Remote möglich
                      </span>
                    </div>
                  </div>
                  <Button>Jetzt bewerben</Button>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Weiterentwicklung unserer E-Commerce-Plattform
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Implementierung neuer Features
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Code-Reviews und technische Konzeption
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Nachhaltigkeitsmanager (m/w/d)</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Vollzeit
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Bad Liebenzell
                      </span>
                    </div>
                  </div>
                  <Button>Jetzt bewerben</Button>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Prüfung und Bewertung von Produkten
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Weiterentwicklung der Nachhaltigkeitskriterien
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Beratung von Händlern
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Initiativbewerbung</h2>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Sie finden keine passende Stelle, möchten aber trotzdem Teil unseres Teams werden? 
                Wir freuen uns über Ihre Initiativbewerbung!
              </p>
              <Button size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Initiativbewerbung senden
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}