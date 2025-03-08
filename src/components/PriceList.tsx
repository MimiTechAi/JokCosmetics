'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface PriceCategory {
  name: string;
  services: PriceService[];
}

interface PriceService {
  name: string;
  price: string;
  description?: string;
  duration?: string;
  additionalOptions?: {
    name: string;
    price: string;
  }[];
}

interface PriceListProps {
  onSelectService?: (serviceName: string) => void;
  showBookButtons?: boolean;
  onServiceSelect?: (serviceId: string) => void;
}

export function PriceList({ onSelectService, showBookButtons = false, onServiceSelect }: PriceListProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    if (onSelectService) {
      onSelectService(serviceName);
    }
  };

  const handleBookClick = (serviceName: string) => {
    if (onServiceSelect) {
      onServiceSelect(serviceName);
    }
  };

  const categories: PriceCategory[] = [
    {
      name: 'Permanent Make-up',
      services: [
        {
          name: 'POWDERBROWS/OMBRÉ BROWS',
          price: '249€',
          description: 'Powder Brows (Schattierung) durch Permanent Make-up',
          duration: '120 Min'
        },
        {
          name: 'SENSUAL LIPS (MIT KONTUR)',
          price: '259€',
          description: 'Natürliche Lippenkontur und -schattierung',
          duration: '120 Min'
        },
        {
          name: 'AQUARELL LIPS',
          price: '249€',
          description: 'Aquarell-Technik für sanft schattierte Lippen',
          duration: '120 Min'
        },
        {
          name: 'DARK LIPS NEUTRALIZATION',
          price: '249€',
          duration: '120 Min'
        }
      ]
    },
    {
      name: 'Nachbehandlungen',
      services: [
        {
          name: 'ERSTE NACHARBEIT',
          price: '69€',
          description: 'Erste Auffrischung des Permanent Make-ups innerhalb von 6 Wochen',
          duration: '120 Min'
        },
        {
          name: 'ZWEITE NACHARBEIT',
          price: '59€',
          description: 'Zweite Auffrischung des Permanent Make-ups innerhalb von 6 Wochen',
          duration: '90 Min'
        },
        {
          name: 'AUFFRISCHUNG INNERHALB VON 18 MONATE',
          price: '159€',
          description: 'Auffrischung des bestehenden Permanent Make-ups',
          duration: '120 Min'
        }
      ]
    },
    {
      name: 'Wimpernverlängerung',
      services: [
        {
          name: 'MEGA VOLUMEN (AB 5D)',
          price: '125€',
          description: 'Mega-Volumen (ab 5D)',
          duration: '120 Min',
          additionalOptions: [
            { name: 'BIS ZU 2 WOCHEN', price: '55€' },
            { name: 'BIS ZU 3 WOCHEN', price: '65€' },
            { name: 'BIS ZU 4 WOCHEN', price: '75€' }
          ]
        },
        {
          name: 'LIGHT VOLUMEN (2D-4D)',
          price: '115€',
          description: 'Leichtes Volumen-Finish mit 2-4 Wimpern pro Naturwimper',
          duration: '120 Min',
          additionalOptions: [
            { name: 'BIS ZU 2 WOCHEN', price: '50€' },
            { name: 'BIS ZU 3 WOCHEN', price: '60€' },
            { name: 'BIS ZU 4 WOCHEN', price: '70€' }
          ]
        },
        {
          name: '1:1 TECHNIK',
          price: '99€',
          description: 'Klassische Wimpernverlängerung mit natürlichem Effekt',
          duration: '120 Min',
          additionalOptions: [
            { name: 'BIS ZU 2 WOCHEN', price: '45€' },
            { name: 'BIS ZU 3 WOCHEN', price: '55€' },
            { name: 'BIS ZU 4 WOCHEN', price: '65€' }
          ]
        }
      ]
    },
    {
      name: 'Gesichtsbehandlung',
      services: [
        {
          name: 'BROWLIFTING (INKL FÄRBEN)',
          price: '45€',
          duration: '45 Min'
        },
        {
          name: 'MICRONEEDLING',
          price: '69€',
          description: 'Intensive Hautverbesserung durch Microneedling',
          duration: '45 Min'
        },
        {
          name: 'BB GLOW',
          price: '79€',
          description: 'BB Glow Behandlung',
          duration: '45 Min'
        },
        {
          name: 'MICRONEEDLING & BB GLOW',
          price: '99€',
          description: 'Kombination aus Microneedling und BB Glow für optimale Ergebnisse',
          duration: '90 Min'
        }
      ]
    },
    {
      name: 'Zusätzliche Leistungen',
      services: [
        {
          name: 'WISPY / WET SET',
          price: '10€'
        },
        {
          name: 'FREMDARBEIT AUFFÜLLEN',
          price: '80€'
        },
        {
          name: 'WIMPERN ENTFERNEN',
          price: '15-20€'
        }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-wider">Preisliste</h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mt-4"></div>
      </div>

      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
            {category.name}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {category.services.map((service) => (
              <div 
                key={service.name} 
                id={service.name.replace(/\s+/g, '-').toLowerCase()}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  selectedService === service.name 
                    ? 'border-2 border-pink-500 transform scale-[1.02]' 
                    : 'hover:shadow-lg hover:border-pink-200 border-2 border-transparent'
                }`}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => handleServiceClick(service.name)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{service.name}</h4>
                    <span className="text-xl font-bold text-pink-600">{service.price}</span>
                  </div>
                  
                  {service.description && (
                    <p className="text-gray-600 mb-2">{service.description}</p>
                  )}
                  
                  {service.duration && (
                    <p className="text-sm text-gray-500">Dauer: {service.duration}</p>
                  )}
                  
                  {service.additionalOptions && service.additionalOptions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-2">Nachfüllen:</p>
                      <ul className="space-y-1">
                        {service.additionalOptions.map((option) => (
                          <li key={option.name} className="flex justify-between text-sm">
                            <span className="text-gray-600">{option.name}</span>
                            <span className="font-medium text-gray-800">{option.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {(showBookButtons || onServiceSelect) && (
                  <div className="px-6 pb-6 pt-2">
                    <button 
                      onClick={() => handleBookClick(service.name)}
                      className="block w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium text-center rounded-md transition-colors duration-300"
                    >
                      Jetzt buchen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
