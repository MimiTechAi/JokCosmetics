import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Häufig gestellte Fragen</h1>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>Wie funktioniert der Bestellprozess?</AccordionTrigger>
          <AccordionContent>
            Der Bestellprozess ist einfach: Wählen Sie Ihre Produkte aus, legen Sie sie in den Warenkorb und
            gehen Sie zur Kasse. Sie können zwischen verschiedenen Zahlungsmethoden wählen und erhalten nach
            der Bestellung eine Bestätigungs-E-Mail.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Wie lange dauert die Lieferung?</AccordionTrigger>
          <AccordionContent>
            Die Lieferzeit wird vom jeweiligen Händler festgelegt und ist bei jedem Produkt angegeben.
            Durchschnittlich beträgt sie 2-4 Werktage innerhalb Deutschlands.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Wie kann ich ein Produkt zurückgeben?</AccordionTrigger>
          <AccordionContent>
            Rückgaben werden direkt mit dem jeweiligen Händler abgewickelt. Die spezifischen
            Rückgabebedingungen finden Sie in den Produktdetails oder kontaktieren Sie den Händler direkt.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Wie werden die Produkte auf Nachhaltigkeit geprüft?</AccordionTrigger>
          <AccordionContent>
            Alle Produkte durchlaufen einen strengen Prüfprozess. Wir überprüfen Materialien,
            Produktionsbedingungen und Zertifizierungen. Nur Produkte, die unsere Nachhaltigkeitskriterien
            erfüllen, werden auf dem Marktplatz angeboten.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}