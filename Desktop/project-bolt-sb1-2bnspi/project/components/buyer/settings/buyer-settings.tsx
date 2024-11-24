"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  CreditCard,
  Shield,
  MapPin,
  Save,
  Settings,
} from "lucide-react";
import { ProfileTab } from "./tabs/profile-tab";
import { NotificationsTab } from "./tabs/notifications-tab";
import { PaymentTab } from "./tabs/payment-tab";
import { SecurityTab } from "./tabs/security-tab";
import { AddressTab } from "./tabs/address-tab";

export function BuyerSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
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
          Verwalten Sie Ihre persönlichen Einstellungen
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profil
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
          <TabsTrigger value="address" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Adressen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab onSave={handleSave} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab onSave={handleSave} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentTab onSave={handleSave} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab onSave={handleSave} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="address">
          <AddressTab onSave={handleSave} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}