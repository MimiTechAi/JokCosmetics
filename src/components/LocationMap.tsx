'use client';

export default function LocationMap() {
  return (
    <section id="location" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Unsere Location</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Besuchen Sie uns in unserem modernen Salon in Bad Liebenzell. 
            Wir freuen uns darauf, Sie bei uns begrüßen zu dürfen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Adresse</h3>
              <p className="text-gray-600">
                Jok Cosmetics<br />
                Kirchstraße 1<br />
                75378 Bad Liebenzell
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Öffnungszeiten</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Montag - Freitag:</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samstag:</span>
                  <span>09:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonntag:</span>
                  <span>Geschlossen</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Kontakt</h3>
              <div className="space-y-2 text-gray-600">
                <p>Telefon: +49 (0) 123 456789</p>
                <p>E-Mail: info@jok-cosmetics.de</p>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="https://maps.google.com/?q=Jok+Cosmetics+Bad+Liebenzell" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Route planen
              </a>
            </div>
          </div>
          
          <div className="h-[400px] lg:h-full min-h-[400px] relative rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2635.975247692164!2d8.729911715674392!3d48.76514997927728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47977af499f849f9%3A0x435b6a8353a8c70f!2sKirchstra%C3%9Fe%201%2C%2075378%20Bad%20Liebenzell!5e0!3m2!1sde!2sde!4v1641234567890!5m2!1sde!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
