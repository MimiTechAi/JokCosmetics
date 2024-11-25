import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Leaf, Truck, Users, ShieldCheck, Sparkles, Recycle, Heart } from 'lucide-react';

const mainFeatures = [
  {
    title: "Geprüfte Händler",
    description: "Alle Händler werden sorgfältig ausgewählt",
    icon: UserCheck,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
  },
  {
    title: "Nachhaltigkeit",
    description: "Fokus auf umweltfreundliche Produkte",
    icon: Leaf,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
  },
  {
    title: "Klimaneutraler Versand",
    description: "CO₂-kompensierter Versand",
    icon: Truck,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
  },
  {
    title: "Community",
    description: "Teil einer nachhaltigen Bewegung",
    icon: Users,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
  }
];

const customerBenefits = [
  {
    title: "Qualitätssicherung",
    description: "Strenge Prüfung aller Produkte",
    icon: ShieldCheck,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
  },
  {
    title: "Innovative Produkte",
    description: "Regelmäßig neue nachhaltige Angebote",
    icon: Sparkles,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
  },
  {
    title: "Umweltschutz",
    description: "Aktiver Beitrag zur Nachhaltigkeit",
    icon: Recycle,
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
  },
  {
    title: "Treuevorteile",
    description: "Exklusive Angebote für Stammkunden",
    icon: Heart,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
  }
];

export function CategoryGrid() {
  return (
    <section className="py-24">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Warum Naturio? Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Warum Naturio?</Badge>
          <h2 className="text-3xl font-bold mb-4">Unser Versprechen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie die Grundpfeiler unseres nachhaltigen Marktplatzes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Ihre Vorteile Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Ihre Vorteile</Badge>
          <h2 className="text-3xl font-bold mb-4">Als Naturio Kunde</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profitieren Sie von exklusiven Vorteilen unserer Plattform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customerBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className={`w-12 h-12 rounded-full ${benefit.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}