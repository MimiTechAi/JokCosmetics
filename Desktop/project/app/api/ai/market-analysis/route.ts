import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const rateLimiter = rateLimit({ limit: 10, windowMs: 60000 });

export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await rateLimiter(req);
    if (rateLimitResult.status === 429) {
      return rateLimitResult;
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'AI-Service nicht konfiguriert' },
        { status: 503 }
      );
    }

    const { category, description } = await req.json();
    
    if (!category?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Kategorie und Beschreibung erforderlich' },
        { status: 400 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
            Analysiere die Produktkategorie und -beschreibung und erstelle eine detaillierte Marktanalyse.
            
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
            content: `Analysiere den Markt für folgendes Produkt:
            Kategorie: ${category}
            Beschreibung: ${description}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API-Fehler (${response.status})`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Market Analysis API Error:', error);
    return NextResponse.json(
      { 
        error: 'Analyse fehlgeschlagen',
        message: error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten'
      },
      { status: 500 }
    );
  }
}