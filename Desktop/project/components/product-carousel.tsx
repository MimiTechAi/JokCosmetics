"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  badges: string[];
}

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (isAnimating || !containerRef.current) return;

    setIsAnimating(true);
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth;
    const newIndex = direction === 'left' 
      ? Math.max(currentIndex - 1, 0)
      : Math.min(currentIndex + 1, Math.max(products.length - 4, 0));

    container.scrollTo({
      left: newIndex * (scrollAmount / 4),
      behavior: 'smooth'
    });

    setCurrentIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden snap-start snap-always hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                {product.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
                    {badge}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-4">{product.price}</p>
              <Button className="w-full group">
                <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Zum Warenkorb
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        onClick={() => scroll('left')}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        onClick={() => scroll('right')}
        disabled={currentIndex >= Math.max(products.length - 4, 0)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}