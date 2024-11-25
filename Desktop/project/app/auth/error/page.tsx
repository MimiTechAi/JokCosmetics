import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const errorMessages = {
  'missing-token': 'Kein Verifizierungstoken gefunden.',
  'invalid-token': 'Der Verifizierungslink ist ungültig oder abgelaufen.',
  'verification-failed': 'Die Verifizierung ist fehlgeschlagen.',
  'default': 'Ein unerwarteter Fehler ist aufgetreten.',
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessage = errorMessages[searchParams.error as keyof typeof errorMessages] || errorMessages.default;

  return (
    <div className="container max-w-md mx-auto pt-16">
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Fehler</h1>
        <p className="text-muted-foreground mb-6">
          {errorMessage}
        </p>
        <Link href="/auth/login">
          <Button className="w-full">Zum Login</Button>
        </Link>
      </Card>
    </div>
  );
}