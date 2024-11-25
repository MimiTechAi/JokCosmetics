"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { analyzeSustainability } from "@/lib/ai/sustainability/analyzer";
import { optimizeProductDescription } from "@/lib/ai/product-optimizer";
import { Icons } from "@/components/icons";
import { Package, Upload, Truck, Leaf } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductFormProps {
  onClose: () => void;
}

export function ProductForm({ onClose }: ProductFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [sustainabilityScore, setSustainabilityScore] = useState<number | null>(null);
  const [sustainabilityResult, setSustainabilityResult] = useState<any>(null);
  const [optimizedDescription, setOptimizedDescription] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleOptimizeDescription = async () => {
    if (!formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Fehlende Beschreibung",
        description: "Bitte geben Sie eine Produktbeschreibung ein.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await optimizeProductDescription(
        formData.name,
        formData.description,
        formData.category
      );

      setFormData({
        ...formData,
        description: result.description
      });
      setOptimizedDescription(result.description);

      toast({
        title: "Beschreibung optimiert",
        description: "Die KI hat Ihre Produktbeschreibung optimiert.",
      });
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        variant: "destructive",
        title: "Optimierung fehlgeschlagen",
        description: error instanceof Error ? error.message : "Die Beschreibung konnte nicht optimiert werden.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSustainabilityCheck = async () => {
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
      const result = await analyzeSustainability({
        name: formData.name,
        description: formData.description,
        materials: formData.materials.split(',').map(m => m.trim()),
        origin: formData.origin.country,
        productionDetails: formData.origin.productionType,
        packaging: formData.packaging.type,
        certifications: formData.origin.certifications.split(',').map(c => c.trim())
      });

      setSustainabilityResult(result);
      setSustainabilityScore(result.score);

      toast({
        title: `Nachhaltigkeits-Score: ${result.score}%`,
        description: result.score >= 70 
          ? "Ihr Produkt erfüllt die Nachhaltigkeitskriterien!"
          : "Ihr Produkt erreicht nicht den erforderlichen Nachhaltigkeits-Score von 70%.",
        variant: result.score >= 70 ? "default" : "destructive"
      });

      return result.score >= 70;
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
      
      // Here would be your API call to save the product
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
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
          <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="origin" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Herkunft
            </TabsTrigger>
            <TabsTrigger value="packaging" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Verpackung
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Versand
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Produktname</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Bio-Baumwoll T-Shirt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="z.B. Mode"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preis (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Lagerbestand</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Produktbilder</Label>
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`Produktbild ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Icons.close className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {images.length < 4 && (
                  <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple={images.length === 0}
                      />
                      <Icons.plus className="h-6 w-6 text-muted-foreground" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Produktbeschreibung</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOptimizeDescription}
                  disabled={isLoading || !formData.description.trim()}
                >
                  <Icons.sparkles className="mr-2 h-4 w-4" />
                  Mit KI optimieren
                </Button>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreiben Sie Ihr Produkt..."
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="origin" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Herkunftsland</Label>
                  <Input
                    id="country"
                    value={formData.origin.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      origin: { ...formData.origin, country: e.target.value }
                    })}
                    placeholder="z.B. Deutschland"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Hersteller</Label>
                  <Input
                    id="manufacturer"
                    value={formData.origin.manufacturer}
                    onChange={(e) => setFormData({
                      ...formData,
                      origin: { ...formData.origin, manufacturer: e.target.value }
                    })}
                    placeholder="Name des Herstellers"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productionType">Produktionsart</Label>
                <Input
                  id="productionType"
                  value={formData.origin.productionType}
                  onChange={(e) => setFormData({
                    ...formData,
                    origin: { ...formData.origin, productionType: e.target.value }
                  })}
                  placeholder="z.B. Fair Trade, Bio-Produktion"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials">Materialien</Label>
                <Input
                  id="materials"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="z.B. Bio-Baumwolle, recyceltes Polyester"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Zertifizierungen</Label>
                <Input
                  id="certifications"
                  value={formData.origin.certifications}
                  onChange={(e) => setFormData({
                    ...formData,
                    origin: { ...formData.origin, certifications: e.target.value }
                  })}
                  placeholder="z.B. GOTS, Fair Trade"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packaging" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="packagingType">Verpackungsart</Label>
                  <Input
                    id="packagingType"
                    value={formData.packaging.type}
                    onChange={(e) => setFormData({
                      ...formData,
                      packaging: { ...formData.packaging, type: e.target.value }
                    })}
                    placeholder="z.B. Karton, Beutel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packagingMaterial">Material</Label>
                  <Input
                    id="packagingMaterial"
                    value={formData.packaging.material}
                    onChange={(e) => setFormData({
                      ...formData,
                      packaging: { ...formData.packaging, material: e.target.value }
                    })}
                    placeholder="z.B. Recycelter Karton"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Abmessungen</Label>
                  <Input
                    id="dimensions"
                    value={formData.packaging.dimensions}
                    onChange={(e) => setFormData({
                      ...formData,
                      packaging: { ...formData.packaging, dimensions: e.target.value }
                    })}
                    placeholder="z.B. 20x30x10 cm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Gewicht</Label>
                  <Input
                    id="weight"
                    value={formData.packaging.weight}
                    onChange={(e) => setFormData({
                      ...formData,
                      packaging: { ...formData.packaging, weight: e.target.value }
                    })}
                    placeholder="z.B. 500g"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packagingNotes">Zusätzliche Informationen</Label>
                <Textarea
                  id="packagingNotes"
                  value={formData.packaging.notes}
                  onChange={(e) => setFormData({
                    ...formData,
                    packaging: { ...formData.packaging, notes: e.target.value }
                  })}
                  placeholder="Weitere Informationen zur Verpackung..."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">Versandart</Label>
                  <Input
                    id="shippingMethod"
                    value={formData.shipping.method}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, method: e.target.value }
                    })}
                    placeholder="z.B. Standard, Express"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingProvider">Versanddienstleister</Label>
                  <Input
                    id="shippingProvider"
                    value={formData.shipping.provider}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, provider: e.target.value }
                    })}
                    placeholder="z.B. DHL, DPD"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Lieferzeit (Tage)</Label>
                <Input
                  id="estimatedDays"
                  value={formData.shipping.estimatedDays}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: { ...formData.shipping, estimatedDays: e.target.value }
                  })}
                  placeholder="z.B. 2-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingRestrictions">Versandbeschränkungen</Label>
                <Textarea
                  id="shippingRestrictions"
                  value={formData.shipping.restrictions}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipping: { ...formData.shipping, restrictions: e.target.value }
                  })}
                  placeholder="Besondere Hinweise zum Versand..."
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.shipping.carbonOffset}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, carbonOffset: e.target.checked }
                    })}
                  />
                  <span>CO₂-neutraler Versand</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.shipping.freeShipping}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, freeShipping: e.target.checked }
                    })}
                  />
                  <span>Kostenloser Versand</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.shipping.internationalShipping}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, internationalShipping: e.target.checked }
                    })}
                  />
                  <span>Internationaler Versand möglich</span>
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {sustainabilityResult && (
          <div className="mt-6 p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
            <h3 className="font-semibold mb-4">Nachhaltigkeitsanalyse</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span>Gesamtscore:</span>
                <span className={`font-bold ${sustainabilityResult.score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {sustainabilityResult.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Ressourcenverbrauch</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>CO₂ Einsparung:</span>
                      <span className="font-medium text-emerald-600">{sustainabilityResult.impact.co2}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Wasserverbrauch:</span>
                      <span className="font-medium text-emerald-600">{sustainabilityResult.impact.water}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Abfallreduzierung:</span>
                      <span className="font-medium text-emerald-600">{sustainabilityResult.impact.waste}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Materialien & Produktion</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Materialqualität:</span>
                      <span className="font-medium">{sustainabilityResult.ratings.materials}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Produktionsprozess:</span>
                      <span className="font-medium">{sustainabilityResult.ratings.production}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Transportwege:</span>
                      <span className="font-medium">{sustainabilityResult.ratings.transport}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Zertifizierungspotenzial</h4>
                <div className="flex flex-wrap gap-2">
                  {sustainabilityResult.certifications.ready.map((cert: string) => (
                    <Badge key={cert} variant="default">{cert}</Badge>
                  ))}
                  {sustainabilityResult.certifications.potential.map((cert: string) => (
                    <Badge key={cert} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              </div>

              {sustainabilityResult.score < 70 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Verbesserungsvorschläge</h4>
                  <ul className="space-y-1">
                    {sustainabilityResult.improvements.high.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button 
            variant="secondary"
            onClick={handleSustainabilityCheck}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Analysiere...
              </>
            ) : (
              <>
                <Leaf className="mr-2 h-4 w-4" />
                Nachhaltigkeitsanalyse
              </>
            )}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !sustainabilityScore || sustainabilityScore < 70}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Speichere...
              </>
            ) : (
              'Produkt speichern'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}