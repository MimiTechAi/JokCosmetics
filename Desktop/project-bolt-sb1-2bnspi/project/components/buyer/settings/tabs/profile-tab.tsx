"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Settings } from "lucide-react";

interface ProfileTabProps {
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function ProfileTab({ onSave, isLoading }: ProfileTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Max Mustermann" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="max@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" type="tel" placeholder="+49 123 4567890" />
        </div>
        <Button onClick={onSave} disabled={isLoading}>
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
  );
}