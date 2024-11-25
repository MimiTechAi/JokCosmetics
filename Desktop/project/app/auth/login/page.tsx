"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll simulate a successful login
      // In production, this would validate credentials against your backend
      setTimeout(() => {
        // Redirect to seller dashboard for demo
        router.push("/dashboard/seller");
        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen zurück bei Naturio!",
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler bei der Anmeldung",
        description: "Bitte überprüfen Sie Ihre Anmeldedaten.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Anmelden</h1>
        <p className="text-muted-foreground">
          Melden Sie sich an, um auf Ihr Konto zuzugreifen
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                placeholder="m.mustermann@example.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Anmelden
          </Button>
        </Card>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Noch kein Konto?{" "}
        <Link
          href="/auth/register"
          className="text-emerald-600 hover:text-emerald-700"
        >
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}