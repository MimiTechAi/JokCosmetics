import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz | Jok Cosmetics',
  description: 'Datenschutzerklärung von Jok Cosmetics by Thansuda',
}

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
      
      <div className="prose prose-lg">
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
          passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
          persönlich identifiziert werden können.
        </p>

        <h3>Datenerfassung auf dieser Website</h3>
        <h4>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten 
          können Sie dem Impressum dieser Website entnehmen.
        </p>

        <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
        <h3>Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
          Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften 
          sowie dieser Datenschutzerklärung.
        </p>

        <h3>Hinweis zur verantwortlichen Stelle</h3>
        <p>
          Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br/>
          Jok Cosmetics by Thansuda<br/>
          [Ihre Adresse]<br/>
          [Ihre Kontaktdaten]
        </p>

        <h2>3. Datenerfassung auf dieser Website</h2>
        <h3>Cookies</h3>
        <p>
          Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät 
          speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
        </p>
        <p>
          Einige Cookies sind "Session-Cookies." Solche Cookies werden nach Ende Ihrer Browser-Sitzung von 
          selbst gelöscht. Hingegen bleiben andere Cookies auf Ihrem Endgerät bestehen, bis Sie diese selbst 
          löschen. Solche Cookies helfen uns, Sie bei Rückkehr auf unserer Website wiederzuerkennen.
        </p>

        <h3>Buchungssystem</h3>
        <p>
          Wenn Sie über unsere Website einen Termin buchen, werden die von Ihnen eingegebenen Daten zur 
          Terminverwaltung und Kontaktaufnahme gespeichert. Diese Daten geben wir nicht ohne Ihre 
          Einwilligung weiter.
        </p>

        <h3>Server-Log-Dateien</h3>
        <p>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
          Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
        </p>
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>

        <h2>4. Analyse-Tools und Werbung</h2>
        <h3>Google Analytics</h3>
        <p>
          Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google 
          Ireland Limited ("Google"), Gordon House, Barrow Street, Dublin 4, Irland.
        </p>

        <h2>5. Plugins und Tools</h2>
        <h3>Google Maps</h3>
        <p>
          Diese Seite nutzt den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited ("Google"), 
          Gordon House, Barrow Street, Dublin 4, Irland.
        </p>

        <h2>6. Ihre Rechte</h2>
        <p>Sie haben folgende Rechte:</p>
        <ul>
          <li>Recht auf Auskunft</li>
          <li>Recht auf Berichtigung oder Löschung</li>
          <li>Recht auf Einschränkung der Verarbeitung</li>
          <li>Recht auf Widerspruch gegen die Verarbeitung</li>
          <li>Recht auf Datenübertragbarkeit</li>
        </ul>

        <div className="mt-8">
          <p>Stand: Januar 2025</p>
          <p>Jok Cosmetics by Thansuda</p>
        </div>
      </div>
    </div>
  )
}
