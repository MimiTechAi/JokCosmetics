import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, CheckCircle2, Users, Rocket, Shield, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function HaendlerWerdenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Händler werden</Badge>
          <h1 className="text-4xl font-bold mb-6">Händler werden bei Naturio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Werden Sie Teil des führenden Marktplatzes für nachhaltige Produkte und erreichen Sie umweltbewusste Kunden
          </p>
        </div>

        {/* Rest of the component remains the same */}
      </div>
    </div>
  );
}