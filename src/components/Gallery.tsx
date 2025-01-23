'use client';

import { useState } from 'react';
import { ImageContainer } from '@/components/ui/image-container';
import { motion } from 'framer-motion';

const galleryImages = [
  {
    src: '/images/gallery/WhatsApp Image 2024-10-12 at 20.31.43.jpeg',
    category: 'Wimpern',
    alt: 'Wimpernverlängerung Beispiel'
  },
  {
    src: '/images/gallery/WhatsApp Image 2024-10-12 at 20.33.49.jpeg',
    category: 'Permanent Make-up',
    alt: 'Permanent Make-up Beispiel'
  },
  {
    src: '/images/gallery/WhatsApp Image 2024-10-12 at 20.34.53.jpeg',
    category: 'Microblading',
    alt: 'Microblading Beispiel'
  },
  {
    src: '/images/gallery/WhatsApp Image 2025-01-09 at 22.31.21.jpeg',
    category: 'Kosmetik',
    alt: 'Kosmetik Behandlung'
  },
  {
    src: '/images/services/powder-brows.jpg',
    category: 'Permanent Make-up',
    alt: 'Powder Brows'
  },
  {
    src: '/images/services/lashes-mega-volume.jpg',
    category: 'Wimpern',
    alt: 'Mega Volume Lashes'
  }
];

const categories = ['Alle', 'Wimpern', 'Permanent Make-up', 'Microblading', 'Kosmetik'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('Alle');

  const filteredImages = activeCategory === 'Alle'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <section className="py-20" id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text animate-shimmer"
        >
          Unsere Galerie
        </motion.h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                activeCategory === category
                ? 'bg-black text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="aspect-w-4 aspect-h-3">
                <ImageContainer
                  src={image.src}
                  alt={image.alt}
                  className="rounded-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
