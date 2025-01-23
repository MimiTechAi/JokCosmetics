import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB | Jok Cosmetics',
  description: 'Allgemeine Geschäftsbedingungen von Jok Cosmetics by Thansuda',
}

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>
      
      <div className="prose prose-lg">
        <h2>§1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen und Behandlungen, 
          die von Jok Cosmetics by Thansuda (nachfolgend "Studio" genannt) angeboten und durchgeführt werden.
        </p>

        <h2>§2 Terminvereinbarung und Stornierung</h2>
        <p>
          (1) Termine können über unsere Website, telefonisch oder per WhatsApp vereinbart werden.<br/>
          (2) Eine kostenlose Stornierung ist bis 24 Stunden vor dem vereinbarten Termin möglich.<br/>
          (3) Bei späteren Absagen oder Nichterscheinen behalten wir uns vor, 50% des Behandlungspreises in Rechnung zu stellen.
        </p>

        <h2>§3 Preise und Zahlung</h2>
        <p>
          (1) Es gelten die zum Zeitpunkt der Terminvereinbarung ausgewiesenen Preise.<br/>
          (2) Die Zahlung erfolgt direkt nach der Behandlung in bar oder per EC-Karte.<br/>
          (3) Gutscheine sind drei Jahre ab Ausstellungsdatum gültig.
        </p>

        <h2>§4 Gesundheitliche Hinweise</h2>
        <p>
          (1) Der Kunde ist verpflichtet, über bestehende Krankheiten, Allergien oder Unverträglichkeiten zu informieren.<br/>
          (2) Bei Permanent Make-up und Wimpernverlängerung ist ein Beratungsgespräch vor der ersten Behandlung verpflichtend.
        </p>

        <h2>§5 Gewährleistung</h2>
        <p>
          (1) Wir führen alle Behandlungen nach bestem Wissen und Gewissen durch.<br/>
          (2) Bei Permanent Make-up ist eine Nachbehandlung im Preis inbegriffen.<br/>
          (3) Die Haltbarkeit von Wimpernverlängerungen ist von verschiedenen Faktoren abhängig und kann variieren.
        </p>

        <h2>§6 Haftung</h2>
        <p>
          (1) Das Studio haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit.<br/>
          (2) Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.<br/>
          (3) Der Kunde haftet für Schäden, die durch falsche Angaben oder Nichtbeachtung der Pflegehinweise entstehen.
        </p>

        <h2>§7 Jugendschutz</h2>
        <p>
          (1) Kunden unter 18 Jahren benötigen eine schriftliche Einverständniserklärung der Erziehungsberechtigten.<br/>
          (2) Bestimmte Behandlungen werden erst ab 18 Jahren durchgeführt.
        </p>

        <h2>§8 Datenschutz</h2>
        <p>
          Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung 
          und den geltenden Datenschutzbestimmungen.
        </p>

        <h2>§9 Schlussbestimmungen</h2>
        <p>
          (1) Erfüllungsort ist der Sitz des Studios.<br/>
          (2) Es gilt deutsches Recht.<br/>
          (3) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>

        <div className="mt-8">
          <p>Stand: Januar 2025</p>
          <p>Jok Cosmetics by Thansuda</p>
        </div>
      </div>
    </div>
  )
}
