import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Book, FileText, Truck, RotateCcw, Shield, Lock, Scale } from "lucide-react";

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">AGB</Badge>
          <h1 className="text-4xl font-bold mb-6">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unsere Geschäftsbedingungen für eine faire und transparente Zusammenarbeit
          </p>
        </div>

        <div className="space-y-6">
          {/* Geltungsbereich */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Book className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§1 Geltungsbereich</h2>
                <p className="text-muted-foreground">Anwendungsbereich der AGB</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Diese Allgemeinen Geschäftsbedingungen gelten für alle gegenwärtigen und zukünftigen Geschäftsbeziehungen
                zwischen der MimiTech Ai GmbH (nachfolgend &ldquo;Naturio&rdquo; genannt) und dem Kunden.
              </p>
            </div>
          </Card>

          {/* Vertragsschluss */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§2 Vertragsschluss</h2>
                <p className="text-muted-foreground">Zustandekommen des Vertrags</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Der Vertrag kommt durch Angebot und Annahme zustande. Der Kunde gibt durch seine Bestellung ein
                verbindliches Angebot ab. Wir können dieses Angebot innerhalb von zwei Werktagen durch Zusendung einer
                Auftragsbestätigung annehmen.
              </p>
            </div>
          </Card>

          {/* Preise und Zahlung */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Scale className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§3 Preise und Zahlung</h2>
                <p className="text-muted-foreground">Zahlungsbedingungen</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt per Vorkasse,
                Kreditkarte, PayPal oder auf Rechnung.
              </p>
            </div>
          </Card>

          {/* Lieferung */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§4 Lieferung</h2>
                <p className="text-muted-foreground">Lieferbedingungen</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Die Lieferung erfolgt innerhalb Deutschlands. Die Lieferzeit beträgt in der Regel 2-4 Werktage. Bei
                Lieferverzögerungen werden Sie umgehend informiert.
              </p>
            </div>
          </Card>

          {/* Widerrufsrecht */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <RotateCcw className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§5 Widerrufsrecht</h2>
                <p className="text-muted-foreground">Informationen zum Widerruf</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
                Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in
                Besitz genommen haben.
              </p>
            </div>
          </Card>

          {/* Gewährleistung */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§6 Gewährleistung</h2>
                <p className="text-muted-foreground">Garantie und Gewährleistung</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln der Kaufsache haben Sie zunächst die Wahl, ob
                die Nacherfüllung durch Nachbesserung oder Ersatzlieferung erfolgen soll.
              </p>
            </div>
          </Card>

          {/* Datenschutz */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Lock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§7 Datenschutz</h2>
                <p className="text-muted-foreground">Datenschutzbestimmungen</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Die Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten erfolgt unter Beachtung unserer
                Datenschutzerklärung und der geltenden gesetzlichen Vorschriften.
              </p>
            </div>
          </Card>

          {/* Schlussbestimmungen */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Scale className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">§8 Schlussbestimmungen</h2>
                <p className="text-muted-foreground">Rechtliche Grundlagen</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort und Gerichtsstand ist Bad Liebenzell.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}