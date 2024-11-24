"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    text: "Naturio hat meine Erwartungen übertroffen. Die Qualität der Produkte und der Service sind erstklassig.",
    author: "Maria Schmidt",
    role: "Zufriedene Kundin",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    text: "Als Händler schätze ich besonders die faire Zusammenarbeit und die Unterstützung durch das Naturio-Team.",
    author: "Thomas Weber",
    role: "Händler für Bio-Produkte",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    text: "Endlich eine Plattform, die Nachhaltigkeit wirklich ernst nimmt. Hier finde ich alles, was ich brauche.",
    author: "Laura Müller",
    role: "Stammkundin",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
  }
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-950">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl font-bold mb-4">Das sagen unsere Händler</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Erfahrungen von zufriedenen Händlern auf unserem Marktplatz
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-6">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].author}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <Quote className="h-8 w-8 text-emerald-600 mb-6" />
              <p className="text-lg mb-6 italic">
                {testimonials[currentIndex].text}
              </p>
              <div>
                <p className="font-semibold">{testimonials[currentIndex].author}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </Card>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
            onClick={prev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12"
            onClick={next}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "w-4 bg-emerald-600" 
                  : "bg-emerald-200 hover:bg-emerald-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}