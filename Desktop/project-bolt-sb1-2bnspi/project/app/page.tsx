import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  ArrowRight
} from 'lucide-react';
import { CategoryGrid } from '@/components/category-grid';
import { ImpactCounter } from '@/components/impact-counter';
import { PricingSection } from '@/components/pricing-section';
import { TestimonialSlider } from '@/components/testimonial-slider';
import { HeroSlideshow } from '@/components/hero-slideshow';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Slideshow */}
      <div className="relative h-screen">
        <HeroSlideshow />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-100 border-emerald-500/30 backdrop-blur-sm">
              Jetzt Neu: Naturio Marketplace
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Nachhaltiger Konsum <br className="hidden sm:inline" />
              <span className="text-emerald-400">leicht gemacht</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
              Entdecken Sie handverlesene, nachhaltige Produkte von vertrauenswürdigen Händlern
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/register?type=seller">
                <Button 
                  size="lg" 
                  className="text-lg bg-emerald-600 hover:bg-emerald-700 text-white transform hover:scale-105 transition-all w-full sm:w-auto"
                >
                  Jetzt Händler werden <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kategorien">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all w-full sm:w-auto"
                >
                  Jetzt zum Marktplatz <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-emerald-200 text-lg">
                Provisionsfrei für faire Preise und bessere Margen
              </p>
              <p className="text-gray-300 text-base">
                Entdecken Sie nachhaltige Produkte von geprüften Anbietern
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white dark:bg-gray-950">
        <ImpactCounter />
        <CategoryGrid />
        <PricingSection />
        <TestimonialSlider />
        <Footer />
      </div>
    </div>
  );
}