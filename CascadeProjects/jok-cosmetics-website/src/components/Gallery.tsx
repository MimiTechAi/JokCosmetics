'use client';

import Image from 'next/image';

const galleryImages = [
  {
    src: '/images/services/powder-brows.jpg',
    alt: 'Powder Brows',
  },
  {
    src: '/images/services/microblading.jpg',
    alt: 'Microblading',
  },
  {
    src: '/images/services/lashes-classic.jpg',
    alt: 'Klassische Wimpernverlängerung',
  },
  {
    src: '/images/services/lashes-volume.jpg',
    alt: 'Volume Lashes',
  },
  {
    src: '/images/services/lash-lift.jpg',
    alt: 'Lash Lifting',
  },
  {
    src: '/images/services/combo-brows.jpg',
    alt: 'Combo Brows',
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Unsere Arbeiten</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie eine Auswahl unserer besten Arbeiten und lassen Sie sich von 
            den Ergebnissen unserer professionellen Behandlungen inspirieren.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="relative h-80 rounded-lg overflow-hidden group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
