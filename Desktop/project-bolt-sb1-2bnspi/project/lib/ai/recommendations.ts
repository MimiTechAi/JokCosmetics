import { AIRecommendation } from '@/types/ai';
import { AI_CONFIG } from './config';

export async function generateRecommendations(
  userPreferences: string[],
  productHistory: string[]
): Promise<AIRecommendation[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: AI_CONFIG.headers,
      body: JSON.stringify({
        model: AI_CONFIG.defaultModel,
        messages: [
          {
            role: 'system',
            content: AI_CONFIG.prompts.recommendations
          },
          {
            role: 'user',
            content: `Generiere Produktempfehlungen basierend auf diesen Präferenzen: 
            ${userPreferences.join(', ')} 
            und dieser Kaufhistorie: ${productHistory.join(', ')}`
          }
        ],
        temperature: 0.7,
        max_tokens: AI_CONFIG.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error('Fehler bei der API-Anfrage');
    }

    const data = await response.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    return recommendations;
  } catch (error) {
    console.error('Empfehlungsfehler:', error);
    throw error;
  }
}