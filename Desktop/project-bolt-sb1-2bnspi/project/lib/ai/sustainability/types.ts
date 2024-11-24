export interface SustainabilityScore {
  score: number;
  ratings: {
    materials: number;
    production: number;
    transport: number;
    packaging: number;
    lifecycle: number;
    social: number;
  };
  certifications: {
    ready: string[];
    potential: string[];
  };
  impact: {
    co2: string;
    water: string;
    waste: string;
  };
  improvements: {
    high: string[];
    medium: string[];
    low: string[];
  };
}

export interface ProductData {
  name: string;
  description: string;
  materials: string[];
  origin: string;
  productionDetails?: string;
  packaging?: string;
  certifications?: string[];
}

export class SustainabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SustainabilityError';
  }
}