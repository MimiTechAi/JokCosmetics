"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { Store, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: "buyer",
    // Common fields
    email: "",
    password: "",
    passwordConfirm: "",
    // Personal info
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    zipCode: "",
    city: "",
    // Business info (for sellers)
    businessName: "",
    businessType: "",
    vatId: "",
    // Terms
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const businessTypes = [
    { value: "individual", label: "Einzelunternehmen" },
    { value: "gmbh", label: "GmbH" },
    { value: "kg", label: "KG" },
    { value: "ohg", label: "OHG" },
    { value: "ag", label: "AG" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.passwordConfirm) {
        throw new Error("Passwörter stimmen nicht überein");
      }

      // Validate terms acceptance
      if (!formData.acceptTerms || !formData.acceptPrivacy) {
        throw new Error("Bitte akzeptieren Sie die Nutzungsbedingungen und Datenschutzerklärung");
      }

      // Here you would normally send the data to your API
      console.log("Registration data:", formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to appropriate dashboard
      router.push(formData.userType === "seller" ? "/dashboard/seller" : "/dashboard/buyer");
    } catch (error) {
      console.error("Registration error:", error);
      // Here you would normally show an error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Konto erstellen</h1>
        <p className="text-muted-foreground">
          Wählen Sie Ihren Kontotyp und geben Sie Ihre Details ein
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            {/* Account Type Selection */}
            <RadioGroup
              value={formData.userType}
              onValueChange={(value) => setFormData({ ...formData, userType: value })}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                <Label
                  htmlFor="buyer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <User className="mb-2 h-6 w-6" />
                  Käufer
                </Label>
              </div>
              <div>
                <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                <Label
                  htmlFor="seller"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Store className="mb-2 h-6 w-6" />
                  Händler
                </Label>
              </div>
            </RadioGroup>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Straße und Hausnummer</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">PLZ</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Stadt</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Information (Sellers only) */}
            {formData.userType === "seller" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Geschäftsname</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Unternehmensform</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unternehmensform wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatId">USt-IdNr.</Label>
                  <Input
                    id="vatId"
                    value={formData.vatId}
                    onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Mindestens 8 Zeichen mit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Passwort bestätigen</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  Ich akzeptiere die{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Nutzungsbedingungen
                  </Link>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.acceptPrivacy}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptPrivacy: checked as boolean })
                  }
                  required
                />
                <Label htmlFor="privacy" className="text-sm">
                  Ich akzeptiere die{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>
                </Label>
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Registriere...
                </>
              ) : (
                'Registrieren'
              )}
            </Button>
          </div>
        </Card>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Bereits registriert?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}