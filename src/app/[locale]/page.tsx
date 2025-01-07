import Navigation from '@/components/Navigation';
import Services from '@/components/Services';
import AboutUs from '@/components/AboutUs';
import Gallery from '@/components/Gallery';
import BlogSection from '@/components/BlogSection';
import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap';
import Image from 'next/image';
import Link from 'next/link';
import { getServices } from '@/lib/supabase/client';
import { getTranslations } from '@/lib/i18n';

export const revalidate = 3600; // Revalidate every hour

export default async function Home({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const [services, t] = await Promise.all([
    getServices(),
    getTranslations(locale)
  ]);

  return (
    <>
      <Navigation locale={locale} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
          <Image
            src="/images/services/WhatsApp Image 2024-10-12 at 20.35.10.jpeg"
            alt="Jok Cosmetics Salon"
            fill
            priority
            className="object-cover"
            quality={100}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center text-white py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              {t.home.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
              {t.home.hero.subtitle}
            </p>
            <Link 
              href="/booking" 
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors duration-300"
            >
              {t.home.hero.cta}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-neutral-50">
        <div className="container-custom">
          <h2 className="section-title text-center mb-12">
            {t.home.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="animate-fadeInUp"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        {service.price} €
                      </span>
                      <Link
                        href={`/booking?service=${service.id}`}
                        className="btn-secondary"
                      >
                        {t.common.bookNow}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <AboutUs />

      {/* Gallery Section */}
      <Gallery />

      {/* Blog Section */}
      <BlogSection />

      {/* Location Map */}
      <LocationMap />

      {/* Contact Form */}
      <ContactForm />
    </>
  );
}
