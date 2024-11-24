"use client";

import { AI_CONFIG } from './config';

export interface SelfHelpResponse {
  answer: string;
  tips: string[];
  nextSteps: string[];
  supportHint?: string;
}

export async function getSelfHelp(question: string): Promise<SelfHelpResponse> {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        ...AI_CONFIG.headers,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.defaultModel,
        messages: [
          {
            role: 'system',
            content: AI_CONFIG.prompts.selfHelp
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: AI_CONFIG.maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(errorData.error?.message || `API request failed (${response.status})`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    validateSelfHelpResponse(result);
    return result;
  } catch (error) {
    console.error('Self-help request failed:', error);
    throw error instanceof Error ? error : new Error('Failed to get self-help response');
  }
}

function validateSelfHelpResponse(data: any): asserts data is SelfHelpResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }

  if (typeof data.answer !== 'string' || !data.answer) {
    throw new Error('Missing or invalid answer');
  }

  if (!Array.isArray(data.tips) || !data.tips.every(tip => typeof tip === 'string')) {
    throw new Error('Invalid tips format');
  }

  if (!Array.isArray(data.nextSteps) || !data.nextSteps.every(step => typeof step === 'string')) {
    throw new Error('Invalid nextSteps format');
  }

  if (data.supportHint !== undefined && typeof data.supportHint !== 'string') {
    throw new Error('Invalid supportHint format');
  }
}