'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface Settings {
  id?: string;
  businessHours: {
    start: string;
    end: string;
  };
  breakTime: {
    start: string;
    duration: number;
  };
}

const defaultSettings: Settings = {
  businessHours: {
    start: '09:00',
    end: '18:00'
  },
  breakTime: {
    start: '12:00',
    duration: 60
  }
};

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Keine Einstellungen gefunden, verwende Standardeinstellungen
          await saveSettings(defaultSettings);
        } else {
          throw error;
        }
      }

      if (data) {
        setSettings({
          ...defaultSettings,
          ...data,
        });
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
      toast({
        title: 'Fehler',
        description: 'Die Einstellungen konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsToSave: Settings = settings) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert(settingsToSave);

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Die Einstellungen wurden gespeichert.',
      });
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
      toast({
        title: 'Fehler',
        description: 'Die Einstellungen konnten nicht gespeichert werden.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">Lade Einstellungen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Einstellungen</h1>
        <Button onClick={() => saveSettings()} disabled={loading}>
          Einstellungen speichern
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Geschäftszeiten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Öffnungszeit</label>
                <Input
                  type="time"
                  value={settings.businessHours.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      start: e.target.value
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schließzeit</label>
                <Input
                  type="time"
                  value={settings.businessHours.end}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      end: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pausenzeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Beginn</label>
                <Input
                  type="time"
                  value={settings.breakTime.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    breakTime: {
                      ...settings.breakTime,
                      start: e.target.value
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dauer (Minuten)</label>
                <Input
                  type="number"
                  min="0"
                  value={settings.breakTime.duration}
                  onChange={(e) => setSettings({
                    ...settings,
                    breakTime: {
                      ...settings.breakTime,
                      duration: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
