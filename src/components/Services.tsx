'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    id: '1',
    name: 'Powder Brows',
    description: 'Natürlich aussehende, gepuderte Augenbrauen mit langanhaltender Haltbarkeit.',
    price: 299,
    duration: 120,
    image_url: '/images/services/powder-brows.jpg',
    category: 'Augenbrauen'
  },
  {
    id: '2',
    name: 'Microblading',
    description: 'Präzise, haargenaue Striche für natürlich volle Augenbrauen.',
    price: 299,
    duration: 120,
    image_url: '/images/services/microblading.jpg',
    category: 'Augenbrauen'
  },
  {
    id: '3',
    name: 'Combo Brows',
    description: 'Kombination aus Microblading und Powder Brows für ein optimales Ergebnis.',
    price: 349,
    duration: 150,
    image_url: '/images/services/combo-brows.jpg',
    category: 'Augenbrauen'
  },
  {
    id: '4',
    name: 'Klassische Wimpernverlängerung',
    description: 'Einzelne Wimpernverlängerung für einen natürlichen Look.',
    price: 89,
    duration: 90,
    image_url: '/images/services/lashes-classic.jpg',
    category: 'Wimpern'
  },
  {
    id: '5',
    name: 'Volume Lashes',
    description: 'Voluminöse Wimpernverlängerung für einen dramatischen Look.',
    price: 109,
    duration: 120,
    image_url: '/images/services/lashes-volume.jpg',
    category: 'Wimpern'
  },
  {
    id: '6',
    name: 'Mega Volume Lashes',
    description: 'Maximales Volumen für einen spektakulären Augenaufschlag.',
    price: 129,
    duration: 150,
    image_url: '/images/services/lashes-mega-volume.jpg',
    category: 'Wimpern'
  },
  {
    id: '7',
    name: 'Lash Lifting',
    description: 'Natürliches Lifting Ihrer eigenen Wimpern für einen offenen Blick.',
    price: 69,
    duration: 60,
    image_url: '/images/services/lash-lift.jpg',
    category: 'Wimpern'
  }
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'Augenbrauen', 'Wimpern'];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  return (
    <section id="services" className="py-20 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Unsere Dienstleistungen</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie unser umfangreiches Angebot an professionellen Beauty-Behandlungen.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-pink-50'
              }`}
            >
              {category === 'all' ? 'Alle' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
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
                  <div>
                    <p className="text-lg font-semibold">{service.price} €</p>
                    <p className="text-sm text-gray-500">{service.duration} Min.</p>
                  </div>
                  <Link
                    href={`/booking?service=${service.id}`}
                    className="btn-secondary"
                  >
                    Termin buchen
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
