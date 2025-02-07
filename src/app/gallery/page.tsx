'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { PageContainer } from '@/components/PageContainer';

const galleryImages = [
  {
    src: '/images/classic lashes.jpeg',
    alt: 'Classic Lashes',
    title: 'Classic Lashes'
  },
  {
    src: '/images/lashes-mega-volume.jpg',
    alt: 'Mega Volume Lashes',
    title: 'Mega Volume'
  },
  {
    src: '/images/lashes-refill-classic.jpg',
    alt: 'Classic Lashes Refill',
    title: 'Classic Refill'
  },
  {
    src: '/images/lashes-refill-volume.jpg',
    alt: 'Volume Lashes Refill',
    title: 'Volume Refill'
  }
];

export default function GalleryPage() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <PageContainer>
      <div ref={ref} className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
            Unsere Galerie
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie unsere professionellen Wimpern-Stylings und lassen Sie sich von den 
            beeindruckenden Ergebnissen inspirieren
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <h3 className="text-xl font-semibold">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
