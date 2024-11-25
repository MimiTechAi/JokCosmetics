"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, fetch the post data from your API
    // For now, we'll use mock data
    setPost({
      id: slug,
      title: "Nachhaltiger Konsum im Alltag",
      content: `
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <h2>Praktische Tipps</h2>
        <ul>
          <li>Tipp 1: Reduzieren Sie Plastikverpackungen</li>
          <li>Tipp 2: Kaufen Sie saisonal und regional</li>
          <li>Tipp 3: Nutzen Sie wiederverwendbare Produkte</li>
        </ul>
      `,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      date: "2024-03-15",
      readTime: "5 min",
      author: "Maria Schmidt",
      categories: ["Nachhaltigkeit", "Lifestyle"]
    });
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="aspect-video bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <Card className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Beitrag nicht gefunden</h2>
        <p className="text-muted-foreground mb-6">
          Der gesuchte Artikel konnte leider nicht gefunden werden.
        </p>
        <Link href="/blog">
          <Button>Zurück zum Blog</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <article className="container max-w-4xl mx-auto px-4 py-16">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 hover:bg-emerald-100 dark:hover:bg-emerald-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Blog
          </Button>
        </Link>

        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category: string) => (
                <Badge key={category} variant="secondary" className="bg-white/10 hover:bg-white/20">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
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

        <Card className="p-8 mb-8">
          <div className="prose dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="outline" className="space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Vorheriger Artikel</span>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="space-x-2">
              <Heart className="h-4 w-4" />
              <span>Gefällt mir</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Teilen</span>
            </Button>
          </div>
          <Button variant="outline" className="space-x-2">
            <span>Nächster Artikel</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </article>
    </div>
  );
}