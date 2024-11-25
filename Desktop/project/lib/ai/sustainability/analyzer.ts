import { SUSTAINABILITY_CONFIG } from './config';
import type { SustainabilityScore, ProductData } from './types';

const MINIMUM_SUSTAINABILITY_SCORE = 70;

export async function analyzeSustainability(product: ProductData): Promise<SustainabilityScore> {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const prompt = `Analysiere folgendes Produkt hinsichtlich Nachhaltigkeit:
    
    Name: ${product.name}
    Beschreibung: ${product.description}
    Materialien: ${product.materials.join(', ')}
    Herkunft: ${product.origin}
    ${product.productionDetails ? `Produktion: ${product.productionDetails}` : ''}
    ${product.packaging ? `Verpackung: ${product.packaging}` : ''}
    ${product.certifications?.length ? `Vorhandene Zertifikate: ${product.certifications.join(', ')}` : ''}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Naturio Marketplace'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: SUSTAINABILITY_CONFIG.prompts.productAnalysis
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response - content missing');
    }

    const result = JSON.parse(data.choices[0].message.content);

    // Validate the result structure
    if (!result || typeof result.score !== 'number' || !result.ratings || !result.impact) {
      throw new Error('Invalid analysis result format');
    }

    // Return the analysis result
    return result;
  } catch (error) {
    console.error('Sustainability analysis failed:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze sustainability');
  }
}