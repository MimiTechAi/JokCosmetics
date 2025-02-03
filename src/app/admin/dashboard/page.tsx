'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/admin/Calendar";
import { BookingManagement } from "@/components/admin/BookingManagement";

export default function DashboardPage() {
  const {
    isLoading,
    stats,
    recentBookings,
    chatMessages,
    refreshData,
    addChatMessage
  } = useDashboard();

  const handleKIAssistant = async (message: string) => {
    try {
      addChatMessage(message, 'user');
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Starten des KI-Assistenten');
      }

      addChatMessage(data.response, 'assistant');
    } catch (error: any) {
      console.error('Error starting AI chat:', error);
      alert('Fehler: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Willkommen im Admin-Bereich</h1>
        <p className="text-lg opacity-90">
          Verwalten Sie Ihre Dienstleistungen und Buchungen effizient
        </p>
      </div>

      {/* Statistiken */}
      <DashboardStats stats={stats} />

      {/* Hauptbereich */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Linke Spalte - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleKIAssistant('Starte eine neue Konversation als Kosmetiksalon-Assistent.')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                KI-Assistent öffnen
              </button>
              
              <button
                onClick={refreshData}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Daten aktualisieren
              </button>
            </div>
          </div>

          {/* Letzte Buchungen */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Letzte Buchungen</h2>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.customer?.name || 'Unbekannter Kunde'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.service?.name || 'Unbekannter Service'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Bestätigt' :
                       booking.status === 'pending' ? 'Ausstehend' : 'Storniert'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(booking.booking_date).toLocaleDateString('de-DE')} um {booking.booking_time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rechte Spalte - Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid grid-cols-3 gap-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="calendar"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Kalender
                </TabsTrigger>
                <TabsTrigger 
                  value="bookings"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Buchungen
                </TabsTrigger>
                <TabsTrigger 
                  value="services"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Services
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-6">
                <Calendar />
              </TabsContent>
              
              <TabsContent value="bookings" className="mt-6">
                <BookingManagement />
              </TabsContent>
              
              <TabsContent value="services" className="mt-6">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">Services-Verwaltung</h3>
                  <p className="text-gray-500">Hier können Sie Ihre Dienstleistungen verwalten.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* KI-Chat */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">KI-Assistent</h2>
        <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 mb-4">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white shadow-md text-gray-800'
                }`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString('de-DE')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
