'use client';

import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';

interface DateSelectionProps {
  onSelect: (date: string) => void;
}

export const DateSelection = ({ onSelect }: DateSelectionProps) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {[...Array(14).keys()].map((i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(addDays(new Date(), i + 1).toISOString().split('T')[0])}
          className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-center"
        >
          <div className="font-medium">
            {format(addDays(new Date(), i + 1), 'EEEE', { locale: de })}
          </div>
          <div className="text-sm text-gray-600">
            {format(addDays(new Date(), i + 1), 'd. MMMM', { locale: de })}
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};
