import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SalonAgent } from '@/lib/agent/agent';

// Erstelle eine Instanz des Supabase-Clients
const supabase = createRouteHandlerClient({ cookies });

// Erstelle eine Instanz des Agenten mit Supabase
const agent = new SalonAgent(supabase);

export async function POST(req: Request) {
  try {
    console.log('Starting chat request...');
    const { message } = await req.json();
    console.log('Received message:', message);

    // Prüfe ob der API-Key vorhanden ist
    const { data: settings } = await supabase
      .from('settings')
      .select('api_keys')
      .single();

    const deepseekApiKey = settings?.api_keys?.deepseekApiKey || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

    console.log('API Key exists:', !!deepseekApiKey);

    if (!deepseekApiKey) {
      throw new Error('Deepseek API Key nicht konfiguriert');
    }

    // Verarbeite die Nachricht mit dem Agenten
    const agentResponse = await agent.processMessage(message);

    // Hole die Cookies
    const cookieStore = await cookies();

    // Speichere den Chat-Verlauf anonym
    const { error: chatError } = await supabase
      .from('chat_history')
      .insert([
        {
          user_message: message,
          role: 'user',
          session_id: cookieStore.get('session_id')?.value || undefined
        },
        {
          ai_response: agentResponse.text,
          role: 'assistant',
          session_id: cookieStore.get('session_id')?.value || undefined
        }
      ]);

    if (chatError) {
      console.error('Error saving chat history:', chatError);
      // Fahre trotz Fehler bei der Speicherung fort
    }

    // Sende die Antwort des Agenten zurück
    return NextResponse.json({
      response: agentResponse.text,
      actions: agentResponse.actions || [],
      data: agentResponse.data || null
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Ein unerwarteter Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
