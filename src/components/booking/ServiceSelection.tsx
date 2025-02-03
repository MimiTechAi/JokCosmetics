'use client';

import { motion } from 'framer-motion';
import { Service } from '@/types/service';

interface ServiceSelectionProps {
  services: { [key: string]: Service[] };
  onSelect: (serviceId: string) => void;
}

export const ServiceSelection = ({ services, onSelect }: ServiceSelectionProps) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      {Object.entries(services).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => onSelect(service.id)}
              >
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600 font-medium">
                    {service.price}€
                  </span>
                  <span className="text-gray-500">
                    {service.duration} Min.
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};
