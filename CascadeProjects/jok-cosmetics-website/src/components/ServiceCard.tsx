'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ServiceCardProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
}

const ServiceCard = ({ title, description, duration, price, image }: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="relative h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-serif mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>⏱ {duration}</span>
          <span className="font-semibold text-primary text-lg">€{price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
