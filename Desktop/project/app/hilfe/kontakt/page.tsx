"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function KontaktPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would normally send the data to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Nachricht gesendet",
        description: "Vielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Kontakt</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Kontaktieren Sie uns</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium">Name</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ihr Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">E-Mail</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ihre.email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block font-medium">Nachricht</label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Wie können wir Ihnen helfen?"
                className="min-h-[150px]"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wird gesendet..." : "Nachricht senden"}
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Kontaktinformationen</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium">E-Mail</h3>
                <p className="text-muted-foreground">kontakt@naturio.de</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium">Telefon</h3>
                <p className="text-muted-foreground">+49 (0) 123 456789</p>
                <p className="text-sm text-muted-foreground">Mo-Fr: 9:00 - 17:00 Uhr</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p className="text-muted-foreground">
                  MimiTech Ai GmbH<br />
                  Lindenplatz 23<br />
                  75378 Bad Liebenzell<br />
                  Deutschland
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}