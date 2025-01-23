import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = 'AIzaSyAphB1iwntyOsoXd2IVRe2XObLNl1bqNN8';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );

    if (!response.ok) {
      throw new Error('Fehler bei der KI-Anfrage');
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      suggestions: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Keine Vorschläge verfügbar'
    });

  } catch (error) {
    console.error('KI-Assistent Fehler:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist bei der KI-Verarbeitung aufgetreten' },
      { status: 500 }
    );
  }
}
