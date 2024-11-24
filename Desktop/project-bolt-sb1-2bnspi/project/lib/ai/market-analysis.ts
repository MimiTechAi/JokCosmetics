"use client";

import { MarketTrendAnalysis } from '@/types/ai';
import { AI_CONFIG } from './config';

export async function analyzeMarketTrends(
  category: string,
  description: string
): Promise<MarketTrendAnalysis> {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Naturio Marketplace',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: `Du bist ein Experte für Marktanalyse im Bereich nachhaltiger Produkte.
            Analysiere die aktuellen Markttrends und erstelle eine detaillierte Analyse.
            
            Antworte ausschließlich auf Deutsch und mit einem JSON-Objekt in diesem Format:
            {
              "trend_score": number (0-100),
              "market_potential": number (0-100),
              "growth_rate": string,
              "competition_level": string,
              "target_demographics": string[],
              "recommendations": string[],
              "keywords": [
                {
                  "keyword": string,
                  "growth": string,
                  "trend": "up" | "down"
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Analysiere die aktuellen Markttrends für nachhaltige Produkte${category !== 'all' ? ` in der Kategorie ${category}` : ''}.
            ${description ? `Zusätzlicher Kontext: ${description}` : ''}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(errorData.error?.message || `API request failed (${response.status})`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Invalid API response - content missing');
    }

    let result;
    try {
      result = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid response format from AI service');
    }

    return result;
  } catch (error) {
    console.error('Market Analysis Error:', error);
    throw error;
  }
}