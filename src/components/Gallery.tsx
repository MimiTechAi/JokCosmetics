'use client';

import { useState } from 'react';
import { ImageContainer } from '@/components/ui/image-container';
import { motion } from 'framer-motion';
import Image from 'next/image';

const galleryImages = [
  {
    src: '/images/gallery/WhatsApp Image 2024-10-12 at 20.33.49.jpeg',
    category: 'Classic Lashes',
    alt: 'Klassische Wimpernverlängerung - Natürlicher Look'
  },
  {
    src: '/images/gallery/WhatsApp Image 2024-10-12 at 20.34.53.jpeg',
    category: 'Volume Lashes',
    alt: 'Volume Wimpern - Dramatischer Look'
  },
  {
    src: '/images/services/lashes-mega-volume.jpg',
    category: 'Mega Volume',
    alt: 'Mega Volume Wimpern - Luxuriöser Look'
  },
  {
    src: '/images/gallery/WhatsApp Image 2024-10-12 at 20.31.43.jpeg',
    category: 'Classic Lashes',
    alt: 'Klassische Wimpernverlängerung - Seitenansicht'
  },
  {
    src: '/images/services/lashes-refill-volume.jpg',
    category: 'Volume Lashes',
    alt: 'Volume Wimpern - Nahaufnahme'
  },
  {
    src: '/images/gallery/WhatsApp Image 2025-01-09 at 22.31.21.jpeg',
    category: 'Mega Volume',
    alt: 'Mega Volume Wimpern - Detailansicht'
  }
];

const categories = ['Alle', 'Classic Lashes', 'Volume Lashes', 'Mega Volume'];

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
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
