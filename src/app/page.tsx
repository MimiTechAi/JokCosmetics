import { Hero } from '@/components/Hero'
import Services from '@/components/Services'
import Gallery from '@/components/Gallery'
import AboutUs from '@/components/AboutUs'
import { Contact } from '@/components/Contact'

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full">
        <Hero />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* Services Section */}
        <section id="services" className="py-20 animate-slide-up">
          <div className="rounded-3xl shadow-luxury bg-background p-8">
            <Services 
              title="Unsere exklusiven Dienstleistungen"
              subtitle="Entdecken Sie unsere Meisterwerke der Schönheit - perfektioniert für Ihre Einzigartigkeit"
            />
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-accent/10 animate-slide-up">
          <div className="rounded-3xl shadow-luxury bg-background p-8">
            <Gallery />
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 animate-slide-up">
          <div className="rounded-3xl shadow-luxury bg-background p-8">
            <AboutUs />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-accent/10 animate-slide-up">
          <div className="rounded-3xl shadow-luxury bg-background p-8">
            <Contact />
          </div>
        </section>
      </div>
    </div>
  )
}
