export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  materials: string;
  origin: {
    country: string;
    manufacturer: string;
    productionType: string;
    certifications: string;
  };
  packaging: {
    type: string;
    material: string;
    dimensions: string;
    weight: string;
    notes: string;
  };
  shipping: {
    method: string;
    provider: string;
    estimatedDays: string;
    carbonOffset: boolean;
    restrictions: string;
    freeShipping: boolean;
    internationalShipping: boolean;
  };
}

export interface SustainabilityResult {
  score: number;
  ratings: {
    materials: number;
    production: number;
    transport: number;
    packaging: number;
    lifecycle: number;
    social: number;
  };
  impact: {
    co2: string;
    water: string;
    waste: string;
  };
}