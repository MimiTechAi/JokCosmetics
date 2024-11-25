"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Bell,
  CreditCard,
  Shield,
  Store,
  Truck,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate saving settings
    setTimeout(() => {
      toast({
        title: "Einstellungen gespeichert",
        description: "Ihre Änderungen wurden erfolgreich übernommen.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Einstellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Shop- und Kontoeinstellungen
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <Store className="mr-2 h-4 w-4" />
            Shop-Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Benachrichtigungen
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Zahlungen
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Sicherheit
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center">
            <Truck className="mr-2 h-4 w-4" />
            Versand
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop-Name</Label>
                <Input id="shopName" placeholder="Ihr Shop-Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Shop-Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Beschreiben Sie Ihren Shop..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Kontakt-E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="shop@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" placeholder="+49 123 4567890" />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Änderungen speichern
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Neue Bestellungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigungen über neue Bestellungen
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Produktbewertungen</Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigungen über neue Bewertungen
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nachrichten</Label>
                  <p className="text-sm text-muted-foreground">
                    Benachrichtigungen über neue Kundennachrichten
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Einstellungen speichern
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bic">BIC</Label>
                <Input id="bic" placeholder="DEUTDEBBXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Kontoinhaber</Label>
                <Input id="accountHolder" placeholder="Max Mustermann" />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Zahlungsdaten speichern
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Neues Passwort</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Passwort ändern
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Versandadresse</Label>
                <Input id="address" placeholder="Straße und Hausnummer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">PLZ</Label>
                  <Input id="zip" placeholder="12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Stadt</Label>
                  <Input id="city" placeholder="Berlin" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Klimaneutraler Versand</Label>
                  <p className="text-sm text-muted-foreground">
                    CO₂-Kompensation für alle Sendungen
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Versandeinstellungen speichern
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}