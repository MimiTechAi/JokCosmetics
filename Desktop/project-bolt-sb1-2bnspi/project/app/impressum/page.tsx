import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Building2, Phone, Mail, Scale, Shield } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Impressum</Badge>
          <h1 className="text-4xl font-bold mb-6">Impressum</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rechtliche Informationen zu unserem Unternehmen
          </p>
        </div>

        <div className="space-y-6">
          {/* Company Information */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Angaben gemäß § 5 TMG</h2>
                <p className="text-muted-foreground">Unternehmensdetails</p>
              </div>
            </div>
            <div className="pl-16 space-y-2 text-muted-foreground">
              <p>MimiTech AI GmbH</p>
              <p>Lindenplatz 23</p>
              <p>75378 Bad Liebenzell</p>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Kontakt</h2>
                <p className="text-muted-foreground">So erreichen Sie uns</p>
              </div>
            </div>
            <div className="pl-16 space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <p>+49 (0) 123 456789</p>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <p>kontakt@naturio.de</p>
              </div>
            </div>
          </Card>

          {/* Dispute Resolution */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Scale className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Streitschlichtung</h2>
                <p className="text-muted-foreground">Informationen zur Online-Streitbeilegung</p>
              </div>
            </div>
            <div className="pl-16 space-y-4 text-muted-foreground">
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                <br />
                <a 
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </Card>

          {/* Content Liability */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Haftung für Inhalte</h2>
                <p className="text-muted-foreground">Rechtliche Hinweise</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}