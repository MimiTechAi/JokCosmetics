"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

interface NotificationsTabProps {
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function NotificationsTab({ onSave, isLoading }: NotificationsTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Bestellbestätigungen</Label>
            <p className="text-sm text-muted-foreground">
              E-Mail-Benachrichtigungen über neue Bestellungen
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Newsletter</Label>
            <p className="text-sm text-muted-foreground">
              Informationen über nachhaltige Produkte und Angebote
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Statusaktualisierungen</Label>
            <p className="text-sm text-muted-foreground">
              Benachrichtigungen über Änderungen am Bestellstatus
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <Button onClick={onSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Einstellungen speichern
        </Button>
      </div>
    </Card>
  );
}