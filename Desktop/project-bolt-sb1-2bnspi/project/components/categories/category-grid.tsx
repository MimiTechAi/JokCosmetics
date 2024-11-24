"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mainCategories } from '@/lib/categories';
import { Search } from 'lucide-react';
import { CategoryFilters } from './category-filters';
import { cn } from '@/lib/utils';

export function CategoryGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filteredCategories = mainCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.some(filter => category.filters?.includes(filter));
    return matchesSearch && matchesFilters;
  });

  return (
    <section className="py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Kategorien</Badge>
          <h2 className="text-3xl font-bold mb-4">Entdecken Sie unsere Vielfalt</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Von Bio-Lebensmitteln bis zu nachhaltiger Mode – finden Sie Produkte, die gut für Sie und die Umwelt sind
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kategorien durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <CategoryFilters
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Link key={category.id} href={`/kategorie/${category.slug}`}>
              <Card className={cn(
                "group relative overflow-hidden hover:shadow-lg transition-all duration-300",
                category.featured && "md:col-span-2 md:row-span-2"
              )}>
                <div className={cn(
                  "relative aspect-[4/3]",
                  category.featured && "aspect-[4/5]"
                )}>
                  <Image
                    src={category.image!}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.description}</p>
                    {category.filters && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {category.filters.map((filter) => (
                          <Badge 
                            key={filter}
                            variant="secondary"
                            className="bg-white/10 hover:bg-white/20"
                          >
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Keine Kategorien gefunden. Bitte versuchen Sie es mit anderen Suchkriterien.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}