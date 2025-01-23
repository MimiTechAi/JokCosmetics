import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

type BusinessHour = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_closed: boolean;
};

const DAYS = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
];

export default function BusinessHours() {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessHours();
  }, []);

  async function fetchBusinessHours() {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('day_of_week');

      if (error) throw error;
      setHours(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Geschäftszeiten:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateBusinessHours(day: number, updates: Partial<BusinessHour>) {
    try {
      const { error } = await supabase
        .from('business_hours')
        .update(updates)
        .eq('day_of_week', day);

      if (error) throw error;
      fetchBusinessHours();
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Geschäftszeiten:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-serif mb-6">Geschäftszeiten</h2>
      <div className="space-y-4">
        {DAYS.map((day, index) => {
          const dayHours = hours.find(h => h.day_of_week === index) || {
            day_of_week: index,
            start_time: '09:00',
            end_time: '17:00',
            is_closed: true
          };

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32">
                <span className="font-medium">{day}</span>
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={!dayHours.is_closed}
                  onChange={(e) => updateBusinessHours(index, {
                    is_closed: !e.target.checked
                  })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2">Geöffnet</span>
              </label>

              {!dayHours.is_closed && (
                <>
                  <input
                    type="time"
                    value={dayHours.start_time}
                    onChange={(e) => updateBusinessHours(index, {
                      start_time: e.target.value
                    })}
                    className="border rounded px-2 py-1"
                  />
                  <span>bis</span>
                  <input
                    type="time"
                    value={dayHours.end_time}
                    onChange={(e) => updateBusinessHours(index, {
                      end_time: e.target.value
                    })}
                    className="border rounded px-2 py-1"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
