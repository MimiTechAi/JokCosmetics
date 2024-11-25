"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { verifyTOTP } from "@/lib/2fa";
import { Loader2 } from "lucide-react";

interface TwoFactorSetupProps {
  qrCode: string;
  secret: string;
  onComplete: () => void;
}

export function TwoFactorSetup({ qrCode, secret, onComplete }: TwoFactorSetupProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setIsVerifying(true);
    setError("");

    try {
      const isValid = verifyTOTP(code, secret);
      if (isValid) {
        onComplete();
      } else {
        setError("Invalid code. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Zwei-Faktor-Authentifizierung einrichten</h2>
        <p className="text-muted-foreground">
          Scannen Sie den QR-Code mit Ihrer Authenticator-App
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <Image
            src={qrCode}
            alt="2FA QR Code"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backup-code">Backup-Code</Label>
        <Input
          id="backup-code"
          value={secret}
          readOnly
          className="font-mono text-center"
        />
        <p className="text-sm text-muted-foreground">
          Speichern Sie diesen Code sicher für den Notfall
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verification-code">Verifizierungscode</Label>
        <Input
          id="verification-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleVerify}
        disabled={code.length !== 6 || isVerifying}
      >
        {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verifizieren und Aktivieren
      </Button>
    </Card>
  );
}