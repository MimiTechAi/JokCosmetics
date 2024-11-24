"use client";

import { useEffect, useState } from 'react';
import { Leaf, Recycle, TreePine } from 'lucide-react';

export function ImpactCounter() {
  const [counts, setCounts] = useState({
    products: 0,
    sellers: 0,
    trees: 0
  });

  useEffect(() => {
    const targets = {
      products: 7842,
      sellers: 324,
      trees: 12567
    };

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    const incrementValues = {
      products: targets.products / steps,
      sellers: targets.sellers / steps,
      trees: targets.trees / steps
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep === steps) {
        clearInterval(timer);
        setCounts(targets);
        return;
      }

      setCounts(prev => ({
        products: Math.min(Math.round(prev.products + incrementValues.products), targets.products),
        sellers: Math.min(Math.round(prev.sellers + incrementValues.sellers), targets.sellers),
        trees: Math.min(Math.round(prev.trees + incrementValues.trees), targets.trees)
      }));

      currentStep++;
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative -mt-12 mb-12 z-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Stat
              icon={<Leaf className="h-6 w-6 text-emerald-600" />}
              label="Nachhaltige Produkte"
              value={counts.products.toLocaleString()}
            />
            <Stat
              icon={<Recycle className="h-6 w-6 text-emerald-600" />}
              label="Aktive Händler"
              value={counts.sellers.toLocaleString()}
            />
            <Stat
              icon={<TreePine className="h-6 w-6 text-emerald-600" />}
              label="Gepflanzte Bäume"
              value={counts.trees.toLocaleString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}