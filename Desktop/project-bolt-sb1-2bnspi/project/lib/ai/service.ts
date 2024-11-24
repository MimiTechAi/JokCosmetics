"use client";

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(prompt: string): Promise<any> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenRouter API key is not configured');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Naturio Marketplace',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant helping with sustainable product recommendations.'
            },
            {
              role: 'user',
              content: prompt
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
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export const aiService = AIService.getInstance();

export async function analyzeProduct(description: string): Promise<any> {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Analyse fehlgeschlagen');
    }

    return await response.json();
  } catch (error) {
    console.error('Analysis Service Error:', error);
    throw error;
  }
}