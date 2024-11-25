import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Truck, RotateCcw, Leaf } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h1 className="text-4xl font-bold mb-6">Häufig gestellte Fragen</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hier finden Sie Antworten auf die häufigsten Fragen zu unserem nachhaltigen Marktplatz
          </p>
        </div>

        <Card className="p-8">
          <Accordion type="single" collapsible className="space-y-6">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="flex gap-4 hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-xl font-semibold">Wie funktioniert der Bestellprozess?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-16">
                <div className="space-y-4 text-muted-foreground">
                  <p>Der Bestellprozess ist einfach und transparent:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Wählen Sie Ihre gewünschten Produkte aus</li>
                    <li>Fügen Sie sie Ihrem Warenkorb hinzu</li>
                    <li>Gehen Sie zur Kasse und wählen Sie Ihre Zahlungsmethode</li>
                    <li>Nach der Bestellung erhalten Sie eine Bestätigungs-E-Mail</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="flex gap-4 hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                    <Truck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-xl font-semibold">Wie lange dauert die Lieferung?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-16">
                <div className="space-y-4 text-muted-foreground">
                  <p>Die Lieferzeiten variieren je nach Versandregion:</p>
                  <ul className="space-y-2 pl-4">
                    <li>• Deutschland: 2-4 Werktage</li>
                    <li>• Österreich & Schweiz: 3-5 Werktage</li>
                    <li>• EU-Länder: 5-7 Werktage</li>
                  </ul>
                  <p>Sie erhalten eine Tracking-Nummer, sobald Ihre Bestellung versendet wurde.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="flex gap-4 hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                    <RotateCcw className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-xl font-semibold">Wie kann ich ein Produkt zurückgeben?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-16">
                <div className="space-y-4 text-muted-foreground">
                  <p>Unser Rückgabeprozess ist unkompliziert:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Melden Sie die Rücksendung in Ihrem Kundenkonto an</li>
                    <li>Drucken Sie das Rücksendeetikett aus</li>
                    <li>Verpacken Sie den Artikel sicher</li>
                    <li>Geben Sie das Paket bei einer Postfiliale ab</li>
                  </ol>
                  <p className="mt-4">
                    Sie haben 14 Tage Zeit für die Rücksendung. Die Rückerstattung erfolgt nach Eingang und Prüfung der Ware.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="flex gap-4 hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-xl font-semibold">Wie werden die Produkte auf Nachhaltigkeit geprüft?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pl-16">
                <div className="space-y-4 text-muted-foreground">
                  <p>Unsere Nachhaltigkeitsprüfung umfasst mehrere Aspekte:</p>
                  <ul className="space-y-2 pl-4">
                    <li>• Gründliche Überprüfung der Materialien und Rohstoffe</li>
                    <li>• Analyse der Produktionsbedingungen und -methoden</li>
                    <li>• Bewertung der Transportwege und Logistik</li>
                    <li>• Prüfung vorhandener Zertifizierungen</li>
                    <li>• Evaluation der Verpackungsnachhaltigkeit</li>
                  </ul>
                  <p className="mt-4">
                    Nur Produkte, die unsere strengen Nachhaltigkeitskriterien erfüllen, werden auf dem Marktplatz angeboten.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  );
}