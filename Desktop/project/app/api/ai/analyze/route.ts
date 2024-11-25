import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateAnalysisResult } from '@/lib/ai/analysis';

const rateLimiter = rateLimit({ limit: 10, windowMs: 60000 });

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimiter(req);
    if (rateLimitResult?.status === 429) {
      return rateLimitResult;
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'AI-Service nicht konfiguriert' },
        { status: 503 }
      );
    }

    const { description } = await req.json();
    
    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'Produktbeschreibung erforderlich' },
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
            content: `Du bist ein Experte für Nachhaltigkeitsanalyse. Analysiere Produktbeschreibungen und gib eine detaillierte Bewertung zurück. Die Antwort sollte folgendes Format haben:
            {
              "score": number (0-100),
              "suggestions": string[],
              "keywords": string[],
              "impact": {
                "co2": string,
                "water": string,
                "waste": string
              }
            }`
          },
          {
            role: 'user',
            content: `Analysiere folgende Produktbeschreibung hinsichtlich Nachhaltigkeit: ${description}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API-Fehler (${response.status})`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    const validatedResult = validateAnalysisResult(result);

    return NextResponse.json(validatedResult);
  } catch (error) {
    console.error('AI Analysis API Error:', error);
    return NextResponse.json(
      { 
        error: 'Analyse fehlgeschlagen',
        message: error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}