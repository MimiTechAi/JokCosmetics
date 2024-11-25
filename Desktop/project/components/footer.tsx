// Update Footer component to remove career link
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Facebook, Twitter, Instagram, Youtube, Leaf } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-xl">Naturio</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Gemeinsam für eine nachhaltige Zukunft. Entdecken Sie handverlesene, umweltfreundliche Produkte von vertrauenswürdigen Händlern.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com" target="_blank" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" target="_blank" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Über Uns</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/ueber-uns/geschichte" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  Unsere Geschichte
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns/nachhaltigkeit" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  Nachhaltigkeit
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns/haendler-werden" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  Händler werden
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hilfe</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/hilfe/faq" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/hilfe/kontakt" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Bleiben Sie informiert über neue nachhaltige Produkte und Angebote.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Abonnieren
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MimiTech Ai GmbH. Alle Rechte vorbehalten.</p>
          <p className="mt-2">Lindenplatz 23, 75378 Bad Liebenzell</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/agb" className="hover:text-emerald-600 transition-colors">AGB</Link>
            <span>•</span>
            <Link href="/datenschutz" className="hover:text-emerald-600 transition-colors">Datenschutz</Link>
            <span>•</span>
            <Link href="/impressum" className="hover:text-emerald-600 transition-colors">Impressum</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}