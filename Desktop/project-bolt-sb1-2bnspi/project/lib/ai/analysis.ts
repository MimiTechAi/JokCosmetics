import { AnalysisResult, SustainabilityError } from '@/types/sustainability';

export function validateAnalysisResult(data: any): AnalysisResult {
  if (!data || typeof data !== 'object') {
    throw new SustainabilityError('Invalid analysis response format');
  }

  if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
    throw new SustainabilityError('Invalid sustainability score');
  }

  if (!Array.isArray(data.suggestions) || !data.suggestions.every((s: any) => typeof s === 'string')) {
    throw new SustainabilityError('Invalid suggestions format');
  }

  if (!Array.isArray(data.keywords) || !data.keywords.every((k: any) => typeof k === 'string')) {
    throw new SustainabilityError('Invalid keywords format');
  }

  if (!data.impact || typeof data.impact !== 'object') {
    throw new SustainabilityError('Invalid impact data');
  }

  const { co2, water, waste } = data.impact;
  if (typeof co2 !== 'string' || typeof water !== 'string' || typeof waste !== 'string') {
    throw new SustainabilityError('Invalid impact metrics format');
  }

  return {
    score: data.score,
    suggestions: data.suggestions,
    keywords: data.keywords,
    impact: {
      co2,
      water,
      waste
    }
  };
}