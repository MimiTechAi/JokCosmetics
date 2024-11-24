"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Store, ShoppingBag, Users, Crown, Database, Check, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { FeatureComparison } from './pricing/feature-comparison';

const plans = [
  {
    name: "Starter",
    description: "Ideal für Kleinstanbieter, Hobby-Verkäufer und Neueinsteiger.",
    price: { monthly: "5,99", yearly: "59,90" },
    features: [
      "Bis zu 3 Produkte",
      "KI-basierte Selbsthilfe",
      "Grundlegende Produktverwaltung",
      "Community-Zugang",
      "E-Mail Support"
    ],
    icon: Store,
    popular: false
  },
  {
    name: "Basis",
    description: "Perfekt für kleine Händler und Einzelunternehmer mit regelmäßigem Verkaufsvolumen.",
    price: { monthly: "14,99", yearly: "149,90" },
    features: [
      "Bis zu 10 Produkte",
      "Erweiterte Produktverwaltung",
      "Verkaufsübersichten",
      "Empfohlene Platzierungen",
      "Standard Support",
      "Basis-KI-Funktionen"
    ],
    icon: ShoppingBag,
    popular: false
  },
  {
    name: "Standard",
    description: "Ideal für wachsende Shops mit moderatem Verkaufsvolumen.",
    price: { monthly: "29,99", yearly: "299,90" },
    features: [
      "Bis zu 25 Produkte",
      "Verkaufsübersichten",
      "Marketing-Tools",
      "Basis-Analysefunktionen",
      "Prioritäts-Support",
      "Erweiterte KI-Funktionen"
    ],
    icon: Users,
    popular: true
  },
  {
    name: "Pro",
    description: "Für mittelgroße Anbieter mit professionellen Anforderungen.",
    price: { monthly: "59,99", yearly: "599,90" },
    features: [
      "Bis zu 100 Produkte",
      "Umfassende Analysen",
      "Personalisierte Empfehlungen",
      "Erweiterte Marketing-Tools",
      "Premium Support",
      "Voller KI-Zugang"
    ],
    icon: Crown,
    popular: false
  },
  {
    name: "Business",
    description: "Maßgeschneiderte Lösung für große Händler und Unternehmen.",
    price: { monthly: "199", yearly: "1990" },
    features: [
      "Unbegrenzte Produkte",
      "Vollständige Analyse-Tools",
      "Exklusive Marketing-Tools",
      "Strategische Analysen",
      "Dedizierter Account Manager",
      "Custom AI-Integration"
    ],
    icon: Database,
    popular: false
  }
];

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showFeatureComparison, setShowFeatureComparison] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50 dark:from-gray-950 dark:to-emerald-950/20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Preise</Badge>
          <h2 className="text-3xl font-bold mb-4">Transparente Preisgestaltung</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wählen Sie den passenden Plan für Ihren nachhaltigen Online-Shop. Keine versteckten Gebühren, keine Provisionen.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <span className={billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}>
              Monatlich
            </span>
            <Switch
              checked={billingPeriod === 'yearly'}
              onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
            />
            <span className={billingPeriod === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}>
              Jährlich (-17%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular 
                    ? 'border-emerald-600 dark:border-emerald-400 shadow-lg ring-2 ring-emerald-600 dark:ring-emerald-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                    : 'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-emerald-600 text-white animate-pulse">Beliebt</Badge>
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-white/70 dark:group-hover:text-black/70">{plan.description}</p>
                    </div>
                    <Icon className="h-6 w-6 text-emerald-600 group-hover:text-emerald-400" />
                  </div>
                  <div className="mb-6">
                    <p className="text-3xl font-bold">
                      {plan.price[billingPeriod]}€
                      <span className="text-base font-normal text-muted-foreground group-hover:text-white/70 dark:group-hover:text-black/70">
                        /monat
                      </span>
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-emerald-600 group-hover:text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-sm group-hover:text-white dark:group-hover:text-black">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <Link href="/auth/register?type=seller">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.name === 'Business' ? 'Kontaktieren' : 'Jetzt starten'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setShowFeatureComparison(true)}
            className="group hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
          >
            <ListFilter className="mr-2 h-4 w-4 group-hover:text-emerald-600" />
            Alle Features im Detail vergleichen
          </Button>
        </div>

        <FeatureComparison 
          open={showFeatureComparison} 
          onClose={() => setShowFeatureComparison(false)} 
        />
      </div>
    </section>
  );
}