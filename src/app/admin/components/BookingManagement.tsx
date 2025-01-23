import React, { useState } from 'react';

interface Booking {
  id: string;
  date: string;
  time: string;
  customer: string;
  email: string;
  service: string;
  status: string;
  notes?: string;
}

export function BookingManagement() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Beispiel-Buchungen
  const bookings: Booking[] = [
    {
      id: "1",
      date: "2025-01-06",
      time: "12:30",
      customer: "Valana",
      email: "valana@placeholder.com",
      service: "2W Kino",
      status: "Bestätigt",
      notes: ""
    },
    // ... weitere Buchungen
  ];

  const handleAction = (booking: Booking, action: string) => {
    setSelectedBooking(booking);
    switch (action) {
      case "edit":
        // Bearbeiten-Logik
        break;
      case "reschedule":
        // Termin verschieben Logik
        break;
      case "copy":
        // Kopieren Logik
        break;
      case "cancel":
        // Stornieren Logik
        break;
      case "invoice":
        // Abrechnen Logik
        break;
      case "report":
        // Problem melden Logik
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select className="p-2 border rounded-lg">
          <option value="all">Alle Status</option>
          <option value="confirmed">Bestätigt</option>
          <option value="pending">Ausstehend</option>
          <option value="cancelled">Storniert</option>
        </select>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Aktualisieren
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uhrzeit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kunde</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notizen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktion</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.service}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleAction(booking, 'details')}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Termin Details</h3>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Kunde</h4>
                <p>{selectedBooking.customer}</p>
                <p className="text-sm text-gray-500">{selectedBooking.email}</p>
              </div>
              
              <div className="space-y-2">
                <button 
                  className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAction(selectedBooking, 'edit')}
                >
                  <span className="mr-2">✏️</span> Bearbeiten
                </button>
                <button 
                  className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAction(selectedBooking, 'reschedule')}
                >
                  <span className="mr-2">📅</span> Termin verschieben
                </button>
                <button 
                  className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAction(selectedBooking, 'copy')}
                >
                  <span className="mr-2">📋</span> Kopieren
                </button>
                <button 
                  className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAction(selectedBooking, 'cancel')}
                >
                  <span className="mr-2">❌</span> Termin stornieren
                </button>
                <button 
                  className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAction(selectedBooking, 'invoice')}
                >
                  <span className="mr-2">💰</span> Abrechnen
                </button>
                <button 
                  className="w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50"
                  onClick={() => handleAction(selectedBooking, 'report')}
                >
                  <span className="mr-2">⚠️</span> Problem melden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
