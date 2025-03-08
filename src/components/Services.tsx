'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useServices } from '@/hooks/useServices';
import { Service } from '@/lib/services/types';
import { Clock } from '@/components/icons/clock';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface ServiceData extends Service {
  category: string;
  image_url: string;
  category_id: string;
  is_active: boolean;
  sort_order: number;
  slug: string;
}

interface ServicesProps {
  title: string;
  subtitle: string;
}

const services: ServiceData[] = [
  {
    id: 'powder-brows',
    category: 'Permanent Make-up',
    category_id: 'permanent-makeup',
    title: 'Powder Brows',
    description: 'Sanft schattierte Augenbrauen für einen natürlichen, pudrigen Look. Ideal für einen weichen, definierten Augenbraueneffekt.',
    duration: '120-180 Min',
    price: '249€',
    image_url: '/images/WhatsApp Image 2024-10-12 at 20.35.10.jpeg',
    benefits: [
      'Natürlicher, pudrig-weicher Look',
      'Langanhaltende Ergebnisse (2-4 Jahre)',
      'Schmerzarme Behandlung',
      'Individuell anpassbare Form'
    ],
    features: [
      { icon: '🎨', text: 'Individuelle Farbabstimmung' },
      { icon: '✨', text: 'Nano-Pigmente' },
      { icon: '📏', text: 'Präzise Formgebung' }
    ],
    techniques: [
      'Digital Powder Technique',
      'Ombre-Effekt',
      'Hybrid-Technik'
    ],
    is_active: true,
    sort_order: 1,
    slug: 'powder-brows'
  },
  {
    id: 'permanent-makeup',
    category: 'Permanent Make-up',
    category_id: 'permanent-makeup',
    title: 'Permanent Make-up',
    description: 'Professionelle Lippenkonturierung und sanfte Farbpigmentierung für verführerisch volle Lippen mit natürlichem Farbverlauf.',
    duration: '120-180 Min',
    price: '259€',
    image_url: '/images/WhatsApp Image 2024-10-12 at 20.31.43.jpeg',
    benefits: [
      'Natürlicher Farbverlauf',
      'Definierte Lippenkontur',
      'Langanhaltende Ergebnisse',
      'Individuelle Farbberatung'
    ],
    features: [
      { icon: '💋', text: '3D-Konturierung' },
      { icon: '🎨', text: 'Organische Pigmente' },
      { icon: '✨', text: 'Aquarell-Technik' }
    ],
    is_active: true,
    sort_order: 2,
    slug: 'permanent-makeup'
  },
  {
    id: 'volume-lashes',
    category: 'Wimpern',
    category_id: 'lashes',
    title: 'Volume Lashes',
    description: 'Voluminöse Wimpernverlängerung für einen dramatischen Look. Mehrere feine Wimpern pro Naturwimper für mehr Fülle.',
    duration: '120 Min',
    price: '115€',
    image_url: '/images/WhatsApp Image 2024-10-12 at 20.31.42.jpeg',
    benefits: [
      'Mehr Volumen',
      '2D-6D Technik',
      'Natürlicher Look',
      'Lange Haltbarkeit'
    ],
    features: [
      { icon: '👁️', text: 'Individuelle Anpassung' },
      { icon: '🔍', text: 'Premium Materialien' },
      { icon: '✨', text: 'Leichtgewicht-Design' }
    ],
    is_active: true,
    sort_order: 3,
    slug: 'volume-lashes'
  },
  {
    id: 'mega-volume',
    category: 'Wimpern',
    category_id: 'lashes',
    title: 'Mega Volume',
    description: 'Maximales Volumen für einen spektakulären Look. Ultra-leichte Wimpernfächer für einen glamourösen Augenaufschlag.',
    duration: '150 Min',
    price: '125€',
    image_url: '/images/WhatsApp Image 2024-10-12 at 20.34.53.jpeg',
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
    ],
    is_active: true,
    sort_order: 4,
    slug: 'mega-volume'
  },
  {
    id: 'wispy-lashes',
    category: 'Wimpern',
    category_id: 'lashes',
    title: 'Wispy Lashes',
    description: 'Natürlich geschwungene Wimpernverlängerung für einen verspielten, aber eleganten Look. Perfekte Mischung aus Länge und Volumen.',
    duration: '90 Min',
    price: '125€',
    image_url: '/images/WhatsApp Image 2024-10-12 at 20.33.49.jpeg',
    benefits: [
      'Natürlicher Look',
      'Verspielte Optik',
      'Leichtes Tragegefühl',
      'Perfekt für jeden Anlass'
    ],
    features: [
      { icon: '🌿', text: 'Naturseide' },
      { icon: '💫', text: 'Leichtgewicht' },
      { icon: '✨', text: 'Anti-Allergen' }
    ],
    is_active: true,
    sort_order: 5,
    slug: 'wispy-lashes'
  },
  {
    id: 'classic-lashes',
    category: 'Wimpern',
    category_id: 'lashes',
    title: 'Classic Lashes',
    description: 'Natürliche Wimpernverlängerung für einen dezenten, aber effektiven Look. Eine Kunstwimper pro Naturwimper.',
    duration: '90 Min',
    price: '99€',
    image_url: '/images/classic lashes.jpeg',
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
    ],
    is_active: true,
    sort_order: 6,
    slug: 'classic-lashes'
  }
];

const ServiceCard = ({ service, onClick }: { service: ServiceData; onClick: () => void }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="relative group h-full"
      layout
    >
      <Card 
        onClick={onClick}
        className="service-card overflow-hidden cursor-pointer h-full flex flex-col"
      >
        <div className="relative h-[250px] overflow-hidden">
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <div className="mb-2 text-sm font-medium text-primary/80">
              {service.category}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {service.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm mt-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary/70" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Premium</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ServiceModal = ({ service, onClose }: { service: ServiceData; onClose: () => void }) => {
  const router = useRouter();

  const handleBooking = () => {
    onClose();
    router.push('/book');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative w-full h-[400px] md:h-[600px] group">
            <Image
              src={service.image_url}
              alt={service.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
          </div>
          
          <div className="p-8 space-y-6 bg-white dark:bg-gray-900">
            <button
              onClick={onClose}
              aria-label="Schließen"
              className="absolute top-4 right-4 bg-primary text-white rounded-full p-2
                hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-primary mb-2 block"
              >
                {service.category}
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold gradient-text mb-2"
              >
                {service.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 text-lg"
              >
                {service.description}
              </motion.p>
            </div>

            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-gray-600 dark:text-gray-300">{service.duration}</span>
              </div>
              <span className="text-2xl font-bold gradient-text">{service.price}</span>
            </div>

            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-3">Vorteile</h4>
                <ul className="space-y-2">
                  {service.benefits?.map((benefit, index) => (
                    <li key={index}>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-primary">•</span>
                        <span>{benefit}</span>
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.features && service.features.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-3">Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="text-gray-600 dark:text-gray-300">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button 
                variant="luxury" 
                size="lg" 
                className="w-full"
                onClick={handleBooking}
              >
                Jetzt Termin vereinbaren
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function Services({ title, subtitle }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl text-gray-600">{subtitle}</p>
      </div>

      <div className="mb-8">
        <Input
          type="search"
          placeholder="Suchen Sie nach Dienstleistungen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md mx-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Services;
