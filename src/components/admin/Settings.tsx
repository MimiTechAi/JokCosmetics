'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Settings {
  businessHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  breakTimes: { start: string; end: string }[];
  holidays: { date: string; description: string }[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  apiKeys: {
    googleMaps: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    reminderHours: number;
  };
  booking: {
    defaultDuration: number;
    minNoticeHours: number;
  };
  display: {
    currency: string;
    language: string;
    timeZone: string;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    businessHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '09:00', close: '14:00', isOpen: true },
      sunday: { open: '09:00', close: '18:00', isOpen: false },
    },
    breakTimes: [{ start: '12:00', end: '13:00' }],
    holidays: [],
    contact: {
      phone: '',
      email: '',
      address: '',
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      tiktok: '',
    },
    apiKeys: {
      googleMaps: '',
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      reminderHours: 24,
    },
    booking: {
      defaultDuration: 60,
      minNoticeHours: 24,
    },
    display: {
      currency: 'EUR',
      language: 'de',
      timeZone: 'Europe/Berlin',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert(settings);

      if (error) throw error;
      alert('Einstellungen erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Fehler beim Speichern der Einstellungen');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Einstellungen</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('business')}
            className={`${
              activeTab === 'business'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Geschäftszeiten
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`${
              activeTab === 'contact'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Kontakt & Social Media
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`${
              activeTab === 'api'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            API & Integration
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Benachrichtigungen
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'business' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Öffnungszeiten</h3>
              {Object.entries(settings.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 mb-4">
                  <span className="w-32 capitalize">{day}</span>
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessHours: {
                          ...settings.businessHours,
                          [day]: { ...hours, isOpen: e.target.checked },
                        },
                      })
                    }
                  />
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessHours: {
                          ...settings.businessHours,
                          [day]: { ...hours, open: e.target.value },
                        },
                      })
                    }
                    disabled={!hours.isOpen}
                    className="border-gray-300 rounded-md shadow-sm"
                  />
                  <span>bis</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessHours: {
                          ...settings.businessHours,
                          [day]: { ...hours, close: e.target.value },
                        },
                      })
                    }
                    disabled={!hours.isOpen}
                    className="border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktdaten</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="tel"
                    value={settings.contact.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, phone: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, email: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <textarea
                    value={settings.contact.address}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, address: e.target.value },
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="url"
                    value={settings.socialMedia.instagram}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialMedia: { ...settings.socialMedia, instagram: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="url"
                    value={settings.socialMedia.facebook}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialMedia: { ...settings.socialMedia, facebook: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">TikTok</label>
                  <input
                    type="url"
                    value={settings.socialMedia.tiktok}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialMedia: { ...settings.socialMedia, tiktok: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Maps API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKeys.googleMaps}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apiKeys: { ...settings.apiKeys, googleMaps: e.target.value },
                    })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Benachrichtigungseinstellungen
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailEnabled: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    E-Mail-Benachrichtigungen aktivieren
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          smsEnabled: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    SMS-Benachrichtigungen aktivieren
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Erinnerung versenden (Stunden vor Termin)
                  </label>
                  <input
                    type="number"
                    value={settings.notifications.reminderHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          reminderHours: parseInt(e.target.value),
                        },
                      })
                    }
                    min="1"
                    max="72"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          {isSaving ? 'Wird gespeichert...' : 'Einstellungen speichern'}
        </button>
      </div>
    </div>
  );
}
