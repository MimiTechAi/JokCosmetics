import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { de } from 'date-fns/locale';

interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: number;
  customer: string;
  service: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  
  // Beispiel-Termine
  const appointments: Appointment[] = [
    {
      id: "1",
      date: "2025-01-09",
      time: "10:00",
      duration: 60,
      customer: "Anna Schmidt",
      service: "Klassische Maniküre"
    },
    // ... weitere Termine
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getDayAppointments = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { locale: de });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg ${
              view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Tag
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg ${
              view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Woche
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentDate(prev => view === 'day' ? addDays(prev, -1) : subWeeks(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <span className="font-medium">
            {view === 'day' 
              ? format(currentDate, 'dd. MMMM yyyy', { locale: de })
              : `${format(startOfWeek(currentDate, { locale: de }), 'dd. MMMM', { locale: de })} - ${format(addDays(startOfWeek(currentDate, { locale: de }), 6), 'dd. MMMM yyyy', { locale: de })}`
            }
          </span>
          <button
            onClick={() => setCurrentDate(prev => view === 'day' ? addDays(prev, 1) : addWeeks(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* Kalender */}
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[100px_1fr] divide-x">
          {/* Zeitachse */}
          <div className="bg-gray-50">
            {timeSlots.map(time => (
              <div key={time} className="h-20 p-2 text-sm text-gray-500 border-b">
                {time}
              </div>
            ))}
          </div>

          {/* Termine */}
          {view === 'day' ? (
            <div className="relative">
              {timeSlots.map(time => (
                <div key={time} className="h-20 border-b">
                  {/* Hier können Termine angezeigt werden */}
                </div>
              ))}
              {getDayAppointments(currentDate).map(apt => (
                <div
                  key={apt.id}
                  className="absolute left-0 right-0 bg-blue-100 border-l-4 border-blue-500 p-2 m-1 rounded"
                  style={{
                    top: `${parseInt(apt.time.split(':')[0]) * 80}px`,
                    height: `${(apt.duration / 60) * 80}px`
                  }}
                >
                  <div className="font-medium">{apt.customer}</div>
                  <div className="text-sm text-gray-600">{apt.service}</div>
                  <div className="text-sm text-gray-500">{apt.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 divide-x">
              {getWeekDays().map(day => (
                <div key={day.toString()} className="relative">
                  <div className="sticky top-0 bg-gray-50 p-2 text-center border-b">
                    {format(day, 'EEEEEE', { locale: de })}
                    <br />
                    {format(day, 'dd.MM')}
                  </div>
                  {timeSlots.map(time => (
                    <div key={time} className="h-20 border-b">
                      {/* Hier können Termine angezeigt werden */}
                    </div>
                  ))}
                  {getDayAppointments(day).map(apt => (
                    <div
                      key={apt.id}
                      className="absolute left-0 right-0 bg-blue-100 border-l-4 border-blue-500 p-2 m-1 rounded"
                      style={{
                        top: `${parseInt(apt.time.split(':')[0]) * 80 + 40}px`,
                        height: `${(apt.duration / 60) * 80}px`
                      }}
                    >
                      <div className="font-medium">{apt.customer}</div>
                      <div className="text-sm text-gray-600">{apt.service}</div>
                      <div className="text-sm text-gray-500">{apt.time}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
