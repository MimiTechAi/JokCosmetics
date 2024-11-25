"use client";

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck,
  Users, 
  Recycle,
  TreePine,
  type LucideIcon
} from 'lucide-react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ParallaxSectionProps {
  image: string;
  title: string;
  features: Feature[];
}

// Icon-Mapping als Objekt definieren
const IconMap: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  'users': Users,
  'recycle': Recycle,
  'tree-pine': TreePine,
};

export function ParallaxSection({ image, title, features }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const scrolled = window.scrollY;
      const rate = scrolled * 0.5;
      sectionRef.current.style.backgroundPositionY = `${rate}px`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderIcon = (iconName: string) => {
    const Icon = IconMap[iconName];
    return Icon ? <Icon className="h-6 w-6 text-emerald-400" /> : null;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="container max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-white/20 text-white">Features</Badge>
          <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="flex flex-col items-center text-center text-white">
                <div className="p-3 bg-emerald-600/20 rounded-full mb-4">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}