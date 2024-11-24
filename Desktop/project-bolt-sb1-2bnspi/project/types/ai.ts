export interface AIRecommendation {
  id: string;
  name: string;
  description: string;
  price: string;
  sustainability_score: number;
  image: string;
  tags: string[];
  confidence: number;
}

export interface MarketTrendAnalysis {
  trend_score: number;
  market_potential: number;
  growth_rate: string;
  competition_level: string;
  target_demographics: string[];
  recommendations: string[];
  keywords: {
    keyword: string;
    growth: string;
    trend: 'up' | 'down';
  }[];
}

export interface ProgressData {
  total_analyses: number;
  improved_products: number;
  average_score: number;
  total_co2_saved: string;
  total_water_saved: string;
  total_waste_reduced: string;
  last_analysis: string;
}