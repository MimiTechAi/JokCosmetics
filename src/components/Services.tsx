'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageContainer } from '@/components/ui/image-container';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from "@/components/ui/card";

// Interfaces bleiben gleich...
interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  benefits: string[];
  features?: {
    icon: string;
    text: string;
  }[];
  techniques?: string[];
}

interface ServicesProps {
  title: string;
  subtitle: string;
}

const services: Service[] = [
  {
    id: 'powder-brows',
    category: 'Permanent Make-up',
    title: 'Powder Brows',
    description: 'Sanft schattierte Augenbrauen für einen natürlichen, pudrigen Look. Ideal für einen weichen, definierten Augenbraueneffekt.',
    duration: '120-180 Min',
    price: '399€',
    image: '/images/WhatsApp Image 2025-01-09 at 22.31.21.jpeg',
    benefits: [
      'Natürlicher, pudrig-weicher Look',
      'Langanhaltende Ergebnisse (2-4 Jahre)',
      'Schmerzarme Behandlung',
      'Individuell anpassbare Form'
    ],
    features: [
      { icon: '🎯', text: 'KI-gestützte Symmetrieanalyse' },
      { icon: '🎨', text: 'Individuelle Farbabstimmung' },
      { icon: '✨', text: 'Nano-Pigmente' }
    ],
    techniques: [
      'Digital Powder Technique',
      'Ombre Shading',
      'Hybrid Brows'
    ]
  },
  {
    id: 'lip-blush',
    category: 'Permanent Make-up',
    title: 'Sensual Lips',
    description: 'Professionelle Lippenkonturierung und sanfte Farbpigmentierung für verführerisch volle Lippen mit natürlichem Farbverlauf.',
    duration: '120-180 Min',
    price: '399€',
    image: '/images/services/lips-art.jpg',
    benefits: [
      'Natürlicher Farbverlauf',
      'Definierte Lippenkontur',
      'Optisch vollere Lippen',
      'Haltbarkeit 2-5 Jahre'
    ],
    features: [
      { icon: '💋', text: '3D-Volumeneffekt' },
      { icon: '🎨', text: 'Bio-Pigmente' },
      { icon: '✨', text: 'Aquarell-Technik' }
    ]
  },
  {
    id: 'volume-lashes',
    category: 'Wimpern',
    title: 'Volume Lashes',
    description: 'Voluminöse Wimpernverlängerung für einen dramatischen Look. Mehrere feine Wimpern pro Naturwimper für mehr Fülle.',
    duration: '120 Min',
    price: '109€',
    image: '/images/WhatsApp Image 2024-10-12 at 20.31.42.jpeg',
    benefits: [
      'Mehr Volumen',
      '2D-6D Technik',
      'Dramatischer Effekt',
      'Haltbar bis zu 4 Wochen'
    ],
    features: [
      { icon: '👁️', text: 'Ultra-leichte Seide' },
      { icon: '✨', text: 'Nano-Beschichtung' },
      { icon: '🔍', text: 'Präzisions-Mapping' }
    ]
  },
  {
    id: 'mega-volume',
    category: 'Wimpern',
    title: 'Mega Volume',
    description: 'Maximales Volumen für einen spektakulären Look. Ultra-leichte Wimpernfächer für einen glamourösen Augenaufschlag.',
    duration: '150 Min',
    price: '129€',
    image: '/images/WhatsApp Image 2024-10-12 at 20.34.53.jpeg',
    benefits: [
      'Maximales Volumen',
      '6D-16D Technik',
      'Glamour-Effekt',
      'Professionelles Styling'
    ],
    features: [
      { icon: '👑', text: 'Premium-Seide' },
      { icon: '💫', text: 'Volumen-Boost' },
      { icon: '🎯', text: 'Perfect-Match' }
    ]
  },
  {
    id: 'classic-lashes',
    category: 'Wimpern',
    title: 'Classic Lashes',
    description: 'Natürliche Wimpernverlängerung für einen dezenten, aber effektiven Look. Eine Kunstwimper pro Naturwimper.',
    duration: '90 Min',
    price: '89€',
    image: '/images/WhatsApp Image 2024-10-12 at 20.33.49.jpeg',
    benefits: [
      'Natürlicher Look',
      '1:1 Technik',
      'Leichtes Tragegefühl',
      'Ideal für Anfänger'
    ],
    features: [
      { icon: '🌿', text: 'Naturseide' },
      { icon: '💫', text: 'Leichtgewicht' },
      { icon: '✨', text: 'Anti-Allergen' }
    ]
  },
  {
    id: 'lash-lift',
    category: 'Wimpern',
    title: 'Lash Lift & Tint',
    description: 'Natürliches Lifting Ihrer eigenen Wimpern mit zusätzlicher Färbung für einen ausdrucksstarken Blick.',
    duration: '60 Min',
    price: '69€',
    image: '/images/WhatsApp Image 2024-10-12 at 20.35.10.jpeg',
    benefits: [
      'Hält 6-8 Wochen',
      'Keine Extensions nötig',
      'Wasserfest',
      'Natürlicher Look'
    ],
    features: [
      { icon: '🌊', text: 'Keratin-Behandlung' },
      { icon: '🎨', text: 'Individuelle Färbung' },
      { icon: '✨', text: 'Pflegende Wirkstoffe' }
    ]
  }
];

const ServiceCard = ({ service, onClick }: { service: Service; onClick: () => void }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden group hover:shadow-luxury-hover transition-all duration-500 glass-effect border border-white/20">
        <div className="relative w-full h-64">
          <ImageContainer
            src={service.image}
            alt={service.title}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="transition-transform duration-700 group-hover:scale-110"
            style={{ height: '16rem' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Preis-Badge */}
          <div className="absolute top-4 right-4 gradient-primary text-white px-6 py-2 rounded-full backdrop-blur-md shadow-lg
            transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 border border-white/20 animate-shimmer">
            {service.price}
          </div>
        </div>

        <CardContent className="p-8 relative z-10">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium gradient-text mb-2 tracking-wider uppercase animate-shimmer">
                {service.category}
              </p>
              <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 leading-relaxed">{service.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
              <span className="flex items-center glass-effect px-3 py-1 rounded-full">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration}
              </span>
              <span className="flex items-center glass-effect px-3 py-1 rounded-full">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Premium
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ServiceModal = ({ service, onClose }: { service: Service; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-luxury"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative w-full h-[400px] md:h-[600px] group">
            <ImageContainer
              src={service.image}
              alt={service.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none transition-transform duration-700 group-hover:scale-105"
              style={{ height: '100%' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
          </div>
          
          <div className="p-8 space-y-6">
            <button
              onClick={onClose}
              aria-label="Schließen"
              className="absolute top-4 right-4 gradient-primary text-white rounded-full p-3
                hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block gradient-text text-sm font-medium tracking-wider uppercase animate-shimmer"
              >
                {service.category}
              </motion.span>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold mt-2 gradient-text animate-shimmer"
              >
                {service.title}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mt-4 leading-relaxed"
              >
                {service.description}
              </motion.p>
            </div>

            {service.features && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-lg gradient-text">
                  Besondere Features
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 glass-effect p-3 rounded-xl">
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="text-gray-600 text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-lg gradient-text">
                Vorteile
              </h4>
              <ul className="grid grid-cols-2 gap-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2 glass-effect p-3 rounded-xl">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {service.techniques && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-lg gradient-text">
                  Angewandte Techniken
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.techniques.map((technique, index) => (
                    <span
                      key={index}
                      className="glass-effect px-4 py-2 rounded-full text-sm gradient-border"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-between items-center pt-6 border-t border-gray-100"
            >
              <div>
                <span className="text-gray-500">Dauer: </span>
                <span className="font-medium text-gray-700">{service.duration}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="font-bold text-3xl gradient-text animate-shimmer">
                  {service.price}
                </span>
              </div>
              <Link
                href={`/booking?service=${service.id}`}
                className="gradient-primary hover:opacity-90 text-white px-8 py-3 rounded-full
                  transition-all duration-300 transform hover:scale-105 hover:shadow-luxury font-medium tracking-wide"
              >
                Jetzt buchen
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Services = ({ title, subtitle }: ServicesProps) => {
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const categories = ['Alle', 'Wimpern', 'Permanent Make-up'];

  const filteredServices = selectedCategory === 'Alle'
    ? services
    : services.filter(service => service.category === selectedCategory);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Überschrift mit Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-shimmer">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Kategorien */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                selectedCategory === category
                  ? 'gradient-primary text-white shadow-luxury border border-white/20'
                  : 'glass-effect text-gray-600 hover:bg-white/80 border border-gray-200 hover:border-primary/20'
              }`}
              whileHover={{ 
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-medium tracking-wide">
                {category}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          layout
        >
          <AnimatePresence mode="sync">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {selectedService && (
            <ServiceModal
              service={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Services;
