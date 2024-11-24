"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Store, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TwoFactorSetup } from "./two-factor-setup";

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [setup2FA, setSetup2FA] = useState<{
    qrCode: string;
    secret: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    userType: "buyer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.setup2FA) {
          setSetup2FA(data.setup2FA);
        } else {
          router.push("/auth/login");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Registrierung fehlgeschlagen",
          description: data.error || "Bitte überprüfen Sie Ihre Eingaben.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (setup2FA) {
    return (
      <TwoFactorSetup
        qrCode={setup2FA.qrCode}
        secret={setup2FA.secret}
        onComplete={() => {
          toast({
            title: "2FA aktiviert",
            description: "Sie können sich jetzt anmelden.",
          });
          router.push("/auth/login");
        }}
      />
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <RadioGroup
          defaultValue={formData.userType}
          onValueChange={(value) =>
            setFormData({ ...formData, userType: value })
          }
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem
              value="buyer"
              id="buyer"
              className="peer sr-only"
            />
            <Label
              htmlFor="buyer"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <User className="mb-2 h-6 w-6" />
              Käufer
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="seller"
              id="seller"
              className="peer sr-only"
            />
            <Label
              htmlFor="seller"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Store className="mb-2 h-6 w-6" />
              Händler
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <p className="text-sm text-muted-foreground">
            Mindestens 8 Zeichen, Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen
          </p>
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrieren
        </Button>
      </form>
    </Card>
  );
}