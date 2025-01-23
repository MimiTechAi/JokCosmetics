import { handleBookingActions, handleCustomerActions, handleServiceActions, handleAnalyticsActions } from './actions';
import { SupabaseClient } from '@supabase/supabase-js';
import { DeepseekAgent } from './deepseek';

export type AgentResponse = {
  text: string;
  actions?: any[];
  data?: any;
};

export type ActionIntent = {
  action: string;
  params: Record<string, any>;
};

export type RevenueData = {
  revenue: number;
  bookings: number;
  popularServices: string[];
};

export type Message = {
  role: string;
  content: string;
};

export class SalonAgent {
  private supabase: SupabaseClient;
  private messageHistory: Message[] = [];
  private aiAgent: DeepseekAgent | null = null;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async initializeAI(apiKey: string) {
    if (!this.aiAgent) {
      this.aiAgent = new DeepseekAgent(apiKey);
    }
  }

  async processMessage(message: string): Promise<AgentResponse> {
    try {
      // Versuche zuerst spezifische Aktionen zu erkennen
      const intent = await this.analyzeIntent(message.toLowerCase());
      if (intent.action !== 'UNKNOWN') {
        const actionResponse = await this.executeAction(intent);
        const formattedResponse = this.formatResponse(intent, actionResponse);
        return {
          text: formattedResponse,
          actions: [intent],
          data: actionResponse
        };
      }

      // Wenn keine spezifische Aktion erkannt wurde, nutze Deepseek
      if (!this.aiAgent) {
        const { data: settings } = await this.supabase
          .from('settings')
          .select('api_keys')
          .single();
        
        const apiKey = settings?.api_keys?.deepseekApiKey || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
        if (!apiKey) {
          throw new Error('Kein API-Schlüssel gefunden');
        }
        
        await this.initializeAI(apiKey);
      }

      const response = await this.aiAgent?.generateResponse(message);
      return {
        text: response || 'Entschuldigung, ich konnte keine passende Antwort generieren.',
        actions: [],
        data: null
      };

    } catch (error) {
      console.error('Error processing message:', error);
      return {
        text: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        actions: [],
        data: null
      };
    }
  }

  private async analyzeIntent(message: string): Promise<ActionIntent> {
    // Umsatzabfragen
    if (message.includes('umsatz') || message.includes('umsätze')) {
      const timeframe = this.extractTimeframe(message);
      return {
        action: 'GET_REVENUE',
        params: { timeframe }
      };
    }

    // Serviceanfragen
    if (message.includes('service') || message.includes('behandlung') || message.includes('angebot')) {
      return {
        action: 'GET_SERVICES',
        params: {
          category: this.extractServiceCategory(message)
        }
      };
    }

    // Terminanfragen
    if (message.includes('termin') || message.includes('zeit') || message.includes('verfügbar')) {
      const timeframe = this.extractTimeframe(message);
      return {
        action: 'CHECK_AVAILABILITY',
        params: {
          timeframe,
          service: this.extractService(message)
        }
      };
    }

    return {
      action: 'UNKNOWN',
      params: {}
    };
  }

  private extractTimeframe(message: string): { start: string; end: string } {
    const today = new Date();
    
    if (message.includes('letzte woche')) {
      const start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start: start.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    }

    if (message.includes('dieser monat') || message.includes('diesen monat')) {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        start: start.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    }

    // Standard: Heute
    return {
      start: today.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  }

  private extractServiceCategory(message: string): string {
    const message_lower = message.toLowerCase();
    
    // Definiere Kategorien und ihre zugehörigen Schlüsselwörter
    const categories = {
      'Haare': ['haar', 'schnitt', 'färben', 'coloration', 'frisur'],
      'Nägel': ['nagel', 'maniküre', 'pediküre', 'gel'],
      'Gesicht': ['gesicht', 'maske', 'reinigung', 'peeling'],
      'Massage': ['massage', 'wellness', 'entspannung'],
      'Kosmetik': ['kosmetik', 'make-up', 'schminken']
    };

    // Durchsuche die Nachricht nach Kategorie-Schlüsselwörtern
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => message_lower.includes(keyword))) {
        return category;
      }
    }

    // Standardkategorie zurückgeben, wenn keine spezifische gefunden wurde
    return 'Alle';
  }

  private extractService(message: string): string {
    const serviceKeywords = {
      'haarschnitt': 'Haarschnitt',
      'färben': 'Färben',
      'coloring': 'Färben',
      'styling': 'Styling',
      'waschen': 'Waschen',
      'föhnen': 'Föhnen',
      'maniküre': 'Maniküre',
      'pediküre': 'Pediküre'
    };

    const messageLower = message.toLowerCase();
    for (const [keyword, service] of Object.entries(serviceKeywords)) {
      if (messageLower.includes(keyword)) {
        return service;
      }
    }
    return '';
  }

  private async executeAction(intent: ActionIntent): Promise<any> {
    switch (intent.action) {
      case 'GET_REVENUE':
        return this.getRevenue(intent.params.timeframe);
      case 'GET_SERVICES':
        return handleServiceActions({ type: 'GET_SERVICES', params: intent.params });
      case 'CHECK_AVAILABILITY':
        return this.checkAvailability(intent.params.timeframe, intent.params.service);
      default:
        return null;
    }
  }

  private async getRevenue(timeframe: { start: string; end: string }): Promise<RevenueData> {
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('*, services(price, title)')
      .gte('booking_date', timeframe.start)
      .lte('booking_date', timeframe.end);

    const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.services?.price || 0), 0) || 0;
    const totalBookings = bookings?.length || 0;

    // Beliebte Services ermitteln
    const serviceStats = bookings?.reduce((acc: Record<string, number>, booking) => {
      const serviceTitle = booking.services?.title;
      if (serviceTitle) {
        acc[serviceTitle] = (acc[serviceTitle] || 0) + 1;
      }
      return acc;
    }, {});

    const popularServices = Object.entries(serviceStats || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    return {
      revenue: totalRevenue,
      bookings: totalBookings,
      popularServices
    };
  }

  async checkAvailability(timeframe: { start: string; end: string }, service: string): Promise<{ available: boolean; slots: number; nextAvailable: string | null }> {
    try {
      // Prüfe die Verfügbarkeit in der Datenbank
      const { data: bookings, error } = await this.supabase
        .from('bookings')
        .select('*')
        .gte('start_time', timeframe.start)
        .lte('end_time', timeframe.end)
        .eq('service', service);

      if (error) throw error;

      // Wenn keine Buchungen in diesem Zeitraum existieren, ist der Termin verfügbar
      const available = bookings.length === 0;
      const slots = available ? 1 : 0;
      const nextAvailable = available ? null : 'Bitte wählen Sie einen anderen Termin aus.';

      return { available, slots, nextAvailable };
    } catch (error) {
      console.error('Fehler beim Prüfen der Verfügbarkeit:', error);
      throw error;
    }
  }

  private formatResponse(intent: ActionIntent, data: any): string {
    switch (intent.action) {
      case 'GET_REVENUE':
        if (data.bookings === 0) {
          return `In diesem Zeitraum gab es noch keine Buchungen. Möchten Sie wissen, welche Services wir anbieten?`;
        }
        return `Die Umsätze betragen ${data.revenue.toFixed(2)}€ bei ${data.bookings} Buchungen. ${
          data.popularServices.length > 0 
            ? `Die beliebtesten Services waren: ${data.popularServices.join(', ')}.` 
            : ''
        }`;

      case 'GET_SERVICES':
        if (!data?.length) {
          return 'Aktuell sind keine Services in dieser Kategorie verfügbar. Möchten Sie alle verfügbaren Services sehen?';
        }
        return `Folgende Services bieten wir an:\n${
          data.map((s: any) => `- ${s.title} (${s.duration} Min, ${s.price.toFixed(2)}€)`).join('\n')
        }`;

      case 'CHECK_AVAILABILITY':
        if (!data.available) {
          return `Leider sind zu diesem Zeitpunkt keine Termine verfügbar. Wie wäre es mit ${data.nextAvailable}?`;
        }
        return `Ja, wir haben noch ${data.slots} freie Termine. Möchten Sie einen Termin buchen?`;

      default:
        return 'Ich kann Ihnen mit Terminen, Umsätzen und Serviceinformationen helfen. Was möchten Sie wissen?';
    }
  }

  public getMessageHistory() {
    return this.messageHistory;
  }

  public clearHistory() {
    this.messageHistory = [];
  }
}
