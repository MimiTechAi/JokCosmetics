import { BookingOptimizationResult } from '@/types/booking';

const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

interface ParsedBookingSuggestion {
  date: string;
  time: string;
  duration: number;
}

function parseBookingSuggestions(suggestions: string): ParsedBookingSuggestion[] {
  try {
    // Versuche zunächst, die Antwort als JSON zu parsen
    const jsonMatch = suggestions.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        return parsed.map(suggestion => ({
          date: suggestion.date,
          time: suggestion.time,
          duration: Number(suggestion.duration)
        }));
      }
    }

    // Fallback: Extrahiere Datum und Zeit aus dem Text
    const dateTimeRegex = /(\d{4}-\d{2}-\d{2})[^\d]*(\d{2}:\d{2})/g;
    const matches = Array.from(suggestions.matchAll(dateTimeRegex));
    
    return matches.map(match => ({
      date: match[1],
      time: match[2],
      duration: 60 // Standard-Dauer in Minuten
    }));
  } catch (error) {
    console.warn('Fehler beim Parsen der Buchungsvorschläge:', error);
    return [];
  }
}

export async function optimizeBookings({ prompt, currentBookings, businessHours }: {
  prompt: string;
  currentBookings: any[];
  businessHours: { start: string; end: string };
}): Promise<BookingOptimizationResult> {
  try {
    const response = await fetch(`${GEMINI_API_URL}/generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Als KI-Assistent für einen Kosmetiksalon, analysiere bitte folgende Situation:
            
            Aktuelle Buchungen:
            ${JSON.stringify(currentBookings, null, 2)}
            
            Geschäftszeiten:
            ${JSON.stringify(businessHours, null, 2)}
            
            Benutzeranfrage:
            ${prompt}
            
            Bitte gib eine strukturierte Antwort mit konkreten Vorschlägen zur Optimierung der Termine.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Fehler bei der Gemini API-Anfrage');
    }

    const data = await response.json();
    const suggestions = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Keine Vorschläge verfügbar';
    const parsedSuggestions = parseBookingSuggestions(suggestions);

    return {
      suggestedBookings: parsedSuggestions,
      explanation: suggestions
    };
  } catch (error) {
    console.error('Fehler bei der KI-Optimierung:', error);
    throw new Error(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
  }
}

export async function suggestTimeSlots(date: string, duration: number): Promise<any> {
  // Implementierung für Zeitslot-Vorschläge
  return {
    success: true,
    suggestions: []
  };
}
