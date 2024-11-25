"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface AddressTabProps {
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function AddressTab({ onSave, isLoading }: AddressTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="street">Straße und Hausnummer</Label>
          <Input id="street" placeholder="Musterstraße 123" />
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
        <div className="space-y-2">
          <Label htmlFor="country">Land</Label>
          <Input id="country" placeholder="Deutschland" />
        </div>
        <Button onClick={onSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Adresse speichern
        </Button>
      </div>
    </Card>
  );
}