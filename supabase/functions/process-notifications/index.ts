import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function processNotifications(supabase: any) {
  // Hole ausstehende Benachrichtigungen
  const { data: notifications, error: fetchError } = await supabase
    .from('notification_queue')
    .select(`
      *,
      bookings (
        *,
        customers (*),
        services (*)
      )
    `)
    .eq('status', 'pending')
    .lt('attempts', 3) // Maximal 3 Versuche
    .order('created_at', { ascending: true })
    .limit(10);

  if (fetchError) {
    console.error('Fehler beim Laden der Benachrichtigungen:', fetchError);
    return;
  }

  // Sende jede Benachrichtigung an die send-notifications Edge Function
  for (const notification of notifications) {
    try {
      const response = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
          body: JSON.stringify({ notification }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aktualisiere den Status in der Queue
      await supabase
        .from('notification_queue')
        .update({ 
          status: 'processing',
          last_attempt: new Date().toISOString(),
          attempts: notification.attempts + 1
        })
        .eq('id', notification.id);

    } catch (error) {
      console.error(`Fehler beim Verarbeiten der Benachrichtigung ${notification.id}:`, error);
      
      // Aktualisiere Fehlerstatus
      await supabase
        .from('notification_queue')
        .update({ 
          status: 'failed',
          error_message: error.message,
          attempts: notification.attempts + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', notification.id);
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await processNotifications(supabase);

    return new Response(
      JSON.stringify({ message: 'Benachrichtigungsverarbeitung gestartet' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Fehler:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
