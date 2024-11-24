export interface AnalysisResult {
  score: number;
  suggestions: string[];
  keywords: string[];
  impact: {
    co2: string;
    water: string;
    waste: string;
  };
}

export class SustainabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SustainabilityError';
  }
}