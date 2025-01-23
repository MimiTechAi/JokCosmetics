import { Service } from '@/types/types'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  onClick: () => void
}

export function ServiceCard({ service, isSelected, onClick }: ServiceCardProps) {
  const defaultImage = '/images/services/powder-brows.jpg'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden cursor-pointer transition-all duration-300',
          'hover:shadow-lg border-2',
          isSelected ? 'border-black bg-black/5' : 'border-transparent'
        )}
        onClick={onClick}
      >
        <div className="relative w-full h-48">
          <Image
            src={service.image_url || defaultImage}
            alt={service.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300',
            isSelected ? 'opacity-70' : 'opacity-0'
          )} />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-black">
              {service.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-black">
                {service.price}€
              </span>
              <span className="text-sm text-gray-500">
                {service.duration} Min.
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description}
          </p>
          <div 
            className={cn(
              'absolute bottom-0 left-0 right-0 h-1 bg-black transform origin-left transition-transform duration-300',
              isSelected ? 'scale-x-100' : 'scale-x-0'
            )}
          />
        </div>
      </Card>
    </motion.div>
  )
}
