import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function VerifiedPage() {
  return (
    <div className="container max-w-md mx-auto pt-16">
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">E-Mail bestätigt!</h1>
        <p className="text-muted-foreground mb-6">
          Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können sich jetzt anmelden.
        </p>
        <Link href="/auth/login">
          <Button className="w-full">Zum Login</Button>
        </Link>
      </Card>
    </div>
  );
}