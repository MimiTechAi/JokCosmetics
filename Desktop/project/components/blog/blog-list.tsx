"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Calendar, Clock, User } from "lucide-react";

// Sample blog posts data - In production, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: "Nachhaltiger Konsum im Alltag",
    excerpt: "Praktische Tipps für einen umweltbewussten Lebensstil",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
    date: "2024-03-15",
    readTime: "5 min",
    author: "Maria Schmidt",
    categories: ["Nachhaltigkeit", "Lifestyle"]
  },
  {
    id: 2,
    title: "Zero Waste: Der ultimative Guide",
    excerpt: "So reduzieren Sie Ihren Müll effektiv",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80",
    date: "2024-03-10",
    readTime: "8 min",
    author: "Thomas Weber",
    categories: ["Zero Waste", "Tipps"]
  },
  {
    id: 3,
    title: "Fair Trade: Was steckt dahinter?",
    excerpt: "Ein Blick hinter die Kulissen des fairen Handels",
    image: "https://images.unsplash.com/photo-1531928351158-2f736078e0a1?auto=format&fit=crop&q=80",
    date: "2024-03-05",
    readTime: "6 min",
    author: "Laura Müller",
    categories: ["Fair Trade", "Bildung"]
  }
];

const categories = [
  "Alle Kategorien",
  "Nachhaltigkeit",
  "Lifestyle",
  "Zero Waste",
  "Fair Trade",
  "Tipps",
  "Bildung"
];

export function BlogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle Kategorien");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === "Alle Kategorien" || 
      post.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Blog durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                      {category}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('de-DE')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Keine Blog-Beiträge gefunden</h3>
          <p className="text-muted-foreground">
            Bitte versuchen Sie es mit anderen Suchkriterien.
          </p>
        </Card>
      )}
    </div>
  );
}