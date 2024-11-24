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

    const { productName, description } = await req.json();
    
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
            content: `Du bist ein Experte für nachhaltige Produktbeschreibungen. Optimiere die Beschreibung für das spezifische Produkt.
              
              Wichtige Regeln:
              - Analysiere die eingegebene Beschreibung genau
              - Erstelle eine einzigartige, auf das Produkt zugeschnittene Beschreibung
              - Hebe spezifische Nachhaltigkeitsaspekte hervor
              - Verwende nur Informationen aus der Eingabebeschreibung
              - Keine Standardtexte oder Platzhalter
              - Antworte ausschließlich auf Deutsch
              - Fokussiere auf die konkreten Eigenschaften des genannten Produkts`
          },
          {
            role: 'user',
            content: `Optimiere diese Produktbeschreibung für "${productName}":

${description}

Erstelle eine verbesserte Version, die die spezifischen Nachhaltigkeitsaspekte dieses Produkts hervorhebt.`
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
    const optimizedDescription = data.choices[0].message.content;

    return NextResponse.json({ optimizedDescription });
  } catch (error) {
    console.error('AI Optimization Error:', error);
    return NextResponse.json(
      { 
        error: 'Optimierung fehlgeschlagen',
        message: error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten'
      },
      { status: 500 }
    );
  }
}