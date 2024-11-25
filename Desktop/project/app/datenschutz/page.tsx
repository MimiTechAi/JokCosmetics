import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, User, Database, BarChart3, Server, Mail } from "lucide-react";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Datenschutz</Badge>
          <h1 className="text-4xl font-bold mb-6">Datenschutzerklärung</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Informationen zum Schutz und zur Verarbeitung Ihrer personenbezogenen Daten
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1: Overview */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">1. Datenschutz auf einen Blick</h2>
                <p className="text-muted-foreground">Allgemeine Hinweise</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground space-y-4">
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
                identifiziert werden können.
              </p>
            </div>
          </Card>

          {/* Section 2: Data Collection */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">2. Datenerfassung auf unserer Website</h2>
                <p className="text-muted-foreground">Verantwortlichkeit und Erfassung</p>
              </div>
            </div>
            <div className="pl-16 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Wer ist verantwortlich für die Datenerfassung?</h3>
                <p className="text-muted-foreground">
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie
                  dem Impressum dieser Website entnehmen.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Wie erfassen wir Ihre Daten?</h3>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um
                    Daten handeln, die Sie in ein Kontaktformular eingeben.
                  </p>
                  <p>
                    Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere
                    IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
                    Uhrzeit des Seitenaufrufs).
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Your Rights */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Database className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">3. Ihre Rechte</h2>
                <p className="text-muted-foreground">Datenschutzrechte der betroffenen Person</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground space-y-4">
              <p>
                Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten
                personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser
                Daten zu verlangen.
              </p>
            </div>
          </Card>

          {/* Section 4: Analysis Tools */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">4. Analyse-Tools und Tools von Drittanbietern</h2>
                <p className="text-muted-foreground">Verwendung von Analysewerkzeugen</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground space-y-4">
              <p>
                Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit
                sogenannten Analyseprogrammen.
              </p>
            </div>
          </Card>

          {/* Section 5: Hosting */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Server className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">5. Hosting</h2>
                <p className="text-muted-foreground">Hosting-Informationen</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground space-y-4">
              <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
              <p>[Hosting-Anbieter]</p>
              <p>
                Detaillierte Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von
                [Hosting-Anbieter].
              </p>
            </div>
          </Card>

          {/* Section 6: Contact Form */}
          <Card className="p-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">6. Kontaktformular</h2>
                <p className="text-muted-foreground">Datenverarbeitung bei Kontaktaufnahme</p>
              </div>
            </div>
            <div className="pl-16 text-muted-foreground space-y-4">
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular
                inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von
                Anschlussfragen bei uns gespeichert.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}