'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimeSelectionProps {
  serviceId: string;
  date: string;
  onSelect: (time: string) => void;
}

export const TimeSelection = ({ serviceId, date, onSelect }: TimeSelectionProps) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await fetch(
          `/api/availability?date=${date}&serviceId=${serviceId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch available times');
        }
        
        const times = await response.json();
        setAvailableTimes(times);
      } catch (err) {
        setError('Fehler beim Laden der verfügbaren Zeiten');
        console.error('Error fetching available times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [date, serviceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-pink-600 hover:text-pink-700"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (availableTimes.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">
          Keine verfügbaren Termine an diesem Tag.
          <br />
          Bitte wählen Sie einen anderen Tag.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {availableTimes.map((time) => (
        <motion.button
          key={time}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(time)}
          className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          {time}
        </motion.button>
      ))}
    </motion.div>
  );
};
