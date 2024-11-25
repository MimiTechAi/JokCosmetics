import { AI_CONFIG } from './config';

export interface OptimizedProduct {
  description: string;
  seoTitle: string;
  seoDescription: string;
  highlights: string[];
  keywords: string[];
}

export async function optimizeProductDescription(
  productName: string,
  description: string,
  category?: string
): Promise<OptimizedProduct> {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
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
            content: `Du bist ein Experte für Produktbeschreibungen im Bereich nachhaltiger E-Commerce.
            
            Optimiere die Produktbeschreibung und erstelle:
            - Eine SEO-optimierte Version der Beschreibung
            - Einen optimierten SEO-Titel
            - Eine Meta-Beschreibung
            - 3-5 Produkt-Highlights
            - Relevante Keywords
            
            Antworte ausschließlich im folgenden JSON-Format:
            {
              "description": string,
              "seoTitle": string,
              "seoDescription": string,
              "highlights": string[],
              "keywords": string[]
            }`
          },
          {
            role: 'user',
            content: `Optimiere folgende Produktbeschreibung für "${productName}"${category ? ` in der Kategorie "${category}"` : ''}:

${description}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return result;
  } catch (error) {
    console.error('Product optimization failed:', error);
    throw error instanceof Error ? error : new Error('Failed to optimize product description');
  }
}

export { analyzeProduct } from './service';