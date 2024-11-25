"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { Package, Upload, Truck, Leaf } from "lucide-react";
import Image from "next/image";
import type { ProductFormData, SustainabilityResult } from "@/types/product";

interface ProductFormProps {
  onClose: () => void;
}

type TabId = "details" | "origin" | "packaging" | "shipping";

export function ProductForm({ onClose }: ProductFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [isLoading, setIsLoading] = useState(false);
  const [sustainabilityScore, setSustainabilityScore] = useState<number | null>(null);
  const [sustainabilityResult, setSustainabilityResult] = useState<SustainabilityResult | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    materials: "",
    origin: {
      country: "",
      manufacturer: "",
      productionType: "",
      certifications: ""
    },
    packaging: {
      type: "",
      material: "",
      dimensions: "",
      weight: "",
      notes: ""
    },
    shipping: {
      method: "",
      provider: "",
      estimatedDays: "",
      carbonOffset: false,
      restrictions: "",
      freeShipping: false,
      internationalShipping: false
    }
  });

  const handleFormChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    updateFormProgress();
  };

  const updateFormProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.entries(formData).filter(([_, value]) => {
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'boolean') return true;
      if (typeof value === 'object') {
        return Object.values(value).some(v => 
          typeof v === 'string' ? v.trim() !== '' : v !== null
        );
      }
      return false;
    }).length;
    setFormProgress((filledFields / totalFields) * 100);
  };

  const handleSaveDraft = async () => {
    toast({
      title: "Entwurf gespeichert",
      description: "Ihr Produkt wurde als Entwurf gespeichert.",
    });
  };

  const handleSustainabilityCheck = async (): Promise<boolean> => {
    if (!formData.name || !formData.description || !formData.materials) {
      toast({
        variant: "destructive",
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
      });
      return false;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult: SustainabilityResult = {
        score: 85,
        ratings: {
          materials: 90,
          production: 85,
          transport: 80,
          packaging: 85,
          lifecycle: 80,
          social: 90
        },
        impact: {
          co2: "-2.5kg CO₂",
          water: "-150L",
          waste: "-0.5kg"
        }
      };

      setSustainabilityResult(mockResult);
      setSustainabilityScore(mockResult.score);

      toast({
        title: `Nachhaltigkeits-Score: ${mockResult.score}%`,
        description: mockResult.score >= 70 
          ? "Ihr Produkt erfüllt die Nachhaltigkeitskriterien!"
          : "Ihr Produkt erreicht nicht den erforderlichen Nachhaltigkeits-Score von 70%.",
        variant: mockResult.score >= 70 ? "default" : "destructive"
      });

      return mockResult.score >= 70;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analyse fehlgeschlagen",
        description: error instanceof Error ? error.message : "Die Nachhaltigkeitsanalyse konnte nicht durchgeführt werden.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sustainabilityScore || sustainabilityScore < 70) {
      toast({
        variant: "destructive",
        title: "Produkt kann nicht gespeichert werden",
        description: "Bitte verbessern Sie die Nachhaltigkeitskriterien Ihres Produkts.",
      });
      return;
    }

    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Produkt gespeichert",
        description: "Das Produkt wurde erfolgreich hinzugefügt.",
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Das Produkt konnte nicht gespeichert werden.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Neues Produkt hinzufügen</DialogTitle>
          <p className="text-muted-foreground">Erstellen Sie ein nachhaltiges Produkt für Ihren Shop</p>
        </DialogHeader>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Formular-Fortschritt</span>
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900">
              {Math.round(formProgress)}%
            </Badge>
          </div>
          <Progress 
            value={formProgress} 
            className="h-2 bg-emerald-100 dark:bg-emerald-900"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value: TabId) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-4 bg-muted/20">
            <TabsTrigger 
              value="details" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900"
            >
              <Package className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="origin" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900"
            >
              <Upload className="h-4 w-4" />
              Herkunft
            </TabsTrigger>
            <TabsTrigger 
              value="packaging" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900"
            >
              <Package className="h-4 w-4" />
              Verpackung
            </TabsTrigger>
            <TabsTrigger 
              value="shipping" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-900"
            >
              <Truck className="h-4 w-4" />
              Versand
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card className="p-6 border-emerald-100 dark:border-emerald-900">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Produktname</Label>
                  <Input 
                    className="border-emerald-100 dark:border-emerald-900 focus:ring-emerald-500"
                    placeholder="z.B. Bio-Baumwoll T-Shirt"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kategorie</Label>
                  <Input 
                    className="border-emerald-100 dark:border-emerald-900 focus:ring-emerald-500"
                    placeholder="z.B. Mode"
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-sm font-medium">Produktbeschreibung</Label>
                <Textarea
                  className="mt-2 border-emerald-100 dark:border-emerald-900 focus:ring-emerald-500"
                  placeholder="Beschreiben Sie Ihr Produkt..."
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Similar structure for other tabs */}
        </Tabs>

        {sustainabilityResult && (
          <Card className="mt-6 p-6 bg-emerald-50/50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Nachhaltigkeitsanalyse
            </h3>
            {/* Analysis content */}
          </Card>
        )}

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-900"
          >
            <Icons.save className="mr-2 h-4 w-4" />
            Als Entwurf speichern
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-red-50 dark:hover:bg-red-900"
            >
              Abbrechen
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSustainabilityCheck}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Leaf className="mr-2 h-4 w-4" />
              )}
              Nachhaltigkeitsanalyse
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !sustainabilityScore || sustainabilityScore < 70}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Produkt speichern'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}