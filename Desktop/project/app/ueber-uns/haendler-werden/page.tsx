"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Shield, Rocket, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";

export default function HaendlerWerdenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Händler werden</Badge>
          <h1 className="text-4xl font-bold mb-6">Händler werden bei Naturio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Werden Sie Teil des führenden Marktplatzes für nachhaltige Produkte und erreichen Sie umweltbewusste Kunden
          </p>
        </div>

        <div className="grid gap-8">
          {/* Vorteile */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Rocket className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Ihre Vorteile</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <h3 className="font-semibold mb-3">Keine Grundgebühr</h3>
                <p className="text-sm text-muted-foreground">
                  Keine versteckten Kosten oder monatliche Gebühren
                </p>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <h3 className="font-semibold mb-3">Faire Provisionen</h3>
                <p className="text-sm text-muted-foreground">
                  Transparente und faire Provisionsmodelle
                </p>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-center hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <h3 className="font-semibold mb-3">Marketing-Support</h3>
                <p className="text-sm text-muted-foreground">
                  Professionelle Unterstützung bei der Vermarktung
                </p>
              </div>
            </div>
          </Card>

          {/* Anforderungen */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Anforderungen</h2>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <h3 className="font-semibold mb-2">Nachhaltige Produktion</h3>
                <p className="text-muted-foreground">
                  Ihre Produkte müssen nachweislich nachhaltig produziert werden
                </p>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <h3 className="font-semibold mb-2">Faire Arbeitsbedingungen</h3>
                <p className="text-muted-foreground">
                  Garantierte faire Arbeitsbedingungen in der gesamten Lieferkette
                </p>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                <h3 className="font-semibold mb-2">Qualitätssicherung</h3>
                <p className="text-muted-foreground">
                  Regelmäßige Qualitätskontrollen und Zertifizierungen
                </p>
              </div>
            </div>
          </Card>

          {/* Bewerbungsprozess */}
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold">Bewerbungsprozess</h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <ol className="relative space-y-6 before:absolute before:left-4 before:top-8 before:h-[calc(100%-4rem)] before:w-0.5 before:bg-emerald-100 dark:before:bg-emerald-900">
                {[
                  { title: "Registrierung", desc: "Erstellen Sie Ihr Händlerkonto" },
                  { title: "Fragebogen", desc: "Füllen Sie den Partnerfragebogen aus" },
                  { title: "Prüfung", desc: "Prüfung durch unser Nachhaltigkeitsteam" },
                  { title: "Gespräch", desc: "Persönliches Kennenlerngespräch" },
                  { title: "Onboarding", desc: "Einrichtung und Schulung" }
                ].map((step, index) => (
                  <li key={index} className="ml-8">
                    <div className="absolute -left-3">
                      <div className="flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                        <span className="text-xl font-bold text-emerald-600">{index + 1}</span>
                      </div>
                    </div>
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg ml-4 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
            <h2 className="text-2xl font-bold mb-4">Jetzt Händler werden</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Starten Sie noch heute und werden Sie Teil unserer nachhaltigen Community. 
              Registrieren Sie sich als Händler oder kontaktieren Sie uns für weitere Informationen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?type=seller">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 min-w-[200px]">
                  <Store className="mr-2 h-5 w-5" />
                  Als Händler registrieren
                </Button>
              </Link>
              <Link href="/kontakt">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  <Users className="mr-2 h-5 w-5" />
                  Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}