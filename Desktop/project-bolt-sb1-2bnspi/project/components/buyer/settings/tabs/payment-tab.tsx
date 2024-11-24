"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface PaymentTabProps {
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function PaymentTab({ onSave, isLoading }: PaymentTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cardName">Name auf der Karte</Label>
          <Input id="cardName" placeholder="Max Mustermann" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Kartennummer</Label>
          <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Gültig bis</Label>
            <Input id="expiryDate" placeholder="MM/YY" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" />
          </div>
        </div>
        <Button onClick={onSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Zahlungsdaten speichern
        </Button>
      </div>
    </Card>
  );
}