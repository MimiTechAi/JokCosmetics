'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface Settings {
  id: string;
  site_name: string;
  contact_email: string;
  contact_phone: string;
  business_hours: string;
  maintenance_mode: boolean;
  instagram_url?: string;
  facebook_url?: string;
}

interface Json {
  [key: string]: any;
}

interface DatabaseSettings {
  id: string;
  role: string;
  setting_key: string;
  setting_value: Json;
  created_at: string;
  updated_at: string;
}

const defaultSettings: Settings = {
  id: '',
  site_name: 'JOK Cosmetics',
  contact_email: '',
  contact_phone: '',
  business_hours: '',
  maintenance_mode: false,
  instagram_url: '',
  facebook_url: '',
};

const defaultDatabaseSettings: DatabaseSettings = {
  id: '',
  role: 'admin',
  setting_key: '',
  setting_value: {},
  created_at: '',
  updated_at: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadSettings();
  }, []);

  const checkAuthAndLoadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile?.role || profile.role !== 'admin') {
        router.push('/auth/login');
        return;
      }

      await loadSettings();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler bei der Authentifizierung';
      console.error('Auth error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
      router.push('/auth/login');
    }
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, create default settings
          const insertSettings = async (settings: DatabaseSettings) => {
            const { error } = await supabase
              .from('settings')
              .insert([{
                role: settings.role,
                setting_key: settings.setting_key,
                setting_value: settings.setting_value
              }]);

            if (error) throw error;
          };

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'site_name',
            setting_value: { value: defaultSettings.site_name },
          });

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'contact_email',
            setting_value: { value: defaultSettings.contact_email },
          });

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'contact_phone',
            setting_value: { value: defaultSettings.contact_phone },
          });

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'business_hours',
            setting_value: { value: defaultSettings.business_hours },
          });

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'maintenance_mode',
            setting_value: { value: defaultSettings.maintenance_mode },
          });

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'instagram_url',
            setting_value: { value: defaultSettings.instagram_url },
          });

          await insertSettings({
            ...defaultDatabaseSettings,
            setting_key: 'facebook_url',
            setting_value: { value: defaultSettings.facebook_url },
          });

          setSettings(defaultSettings);
        } else {
          throw error;
        }
      } else {
        const settings = [data] as DatabaseSettings[];
        const loadedSettings: Settings = {
          ...defaultSettings,
        };

        settings.forEach((setting) => {
          switch (setting.setting_key) {
            case 'site_name':
              loadedSettings.site_name = setting.setting_value.value;
              break;
            case 'contact_email':
              loadedSettings.contact_email = setting.setting_value.value;
              break;
            case 'contact_phone':
              loadedSettings.contact_phone = setting.setting_value.value;
              break;
            case 'business_hours':
              loadedSettings.business_hours = setting.setting_value.value;
              break;
            case 'maintenance_mode':
              loadedSettings.maintenance_mode = setting.setting_value.value;
              break;
            case 'instagram_url':
              loadedSettings.instagram_url = setting.setting_value.value;
              break;
            case 'facebook_url':
              loadedSettings.facebook_url = setting.setting_value.value;
              break;
            default:
              break;
          }
        });

        setSettings(loadedSettings);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Laden der Einstellungen';
      console.error('Settings error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const updateSettings = async (settings: DatabaseSettings) => {
        const { error } = await supabase
          .from('settings')
          .upsert([{
            role: settings.role,
            setting_key: settings.setting_key,
            setting_value: settings.setting_value
          }], {
            onConflict: 'id',
          });

        if (error) throw error;
      };

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'site_name',
        setting_value: { value: settings.site_name },
      });

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'contact_email',
        setting_value: { value: settings.contact_email },
      });

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'contact_phone',
        setting_value: { value: settings.contact_phone },
      });

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'business_hours',
        setting_value: { value: settings.business_hours },
      });

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'maintenance_mode',
        setting_value: { value: settings.maintenance_mode },
      });

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'instagram_url',
        setting_value: { value: settings.instagram_url },
      });

      await updateSettings({
        ...defaultDatabaseSettings,
        setting_key: 'facebook_url',
        setting_value: { value: settings.facebook_url },
      });

      toast({
        title: 'Erfolg',
        description: 'Einstellungen wurden gespeichert',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Speichern der Einstellungen';
      console.error('Save error:', error);
      setError(message);
      toast({
        title: 'Fehler',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Einstellungen</h1>
        <Button 
          variant="luxury"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <div className="luxury-card space-y-8">
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="site_name">Website Name</Label>
            <Input
              id="site_name"
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Kontakt E-Mail</Label>
            <Input
              id="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Kontakt Telefon</Label>
            <Input
              id="contact_phone"
              value={settings.contact_phone}
              onChange={(e) => handleChange('contact_phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_hours">Öffnungszeiten</Label>
            <Input
              id="business_hours"
              value={settings.business_hours}
              onChange={(e) => handleChange('business_hours', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input
              id="instagram_url"
              value={settings.instagram_url}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook URL</Label>
            <Input
              id="facebook_url"
              value={settings.facebook_url}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance_mode">Wartungsmodus</Label>
            <Switch
              id="maintenance_mode"
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
