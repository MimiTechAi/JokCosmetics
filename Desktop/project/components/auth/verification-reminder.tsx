"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationReminderProps {
  email: string;
}

export function VerificationReminder({ email }: VerificationReminderProps) {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const resendVerification = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "E-Mail versendet",
          description: "Bitte überprüfen Sie Ihren Posteingang.",
        });
      } else {
        throw new Error('Failed to resend verification email');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die E-Mail konnte nicht versendet werden.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900">
      <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-200">
        E-Mail-Adresse nicht bestätigt
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2 text-yellow-700 dark:text-yellow-300">
          Bitte bestätigen Sie Ihre E-Mail-Adresse, um alle Funktionen nutzen zu können.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={resendVerification}
          disabled={isResending}
          className="bg-white hover:bg-yellow-50 text-yellow-700 border-yellow-200 hover:border-yellow-300"
        >
          {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Bestätigungslink erneut senden
        </Button>
      </AlertDescription>
    </Alert>
  );
}