import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"
import { format } from "https://deno.land/std@0.168.0/datetime/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendEmail(to: string, subject: string, content: string) {
  const client = new SmtpClient();

  try {
    await client.connectTLS({
      hostname: Deno.env.get('EMAIL_HOST') || 'smtp.gmail.com',
      port: Number(Deno.env.get('EMAIL_PORT')) || 587,
      username: Deno.env.get('EMAIL_USER'),
      password: Deno.env.get('EMAIL_PASSWORD'),
    });

    await client.send({
      from: Deno.env.get('EMAIL_FROM'),
      to: to,
      subject: subject,
      content: content,
    });

    await client.close();
    return true;
  } catch (error) {
    console.error('E-Mail-Fehler:', error);
    throw error;
  }
}

async function sendWhatsApp(phone: string, message: string) {
  const WHATSAPP_NUMBER = Deno.env.get('NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER');
  if (!WHATSAPP_NUMBER) {
    throw new Error('WhatsApp-Geschäftsnummer nicht konfiguriert');
  }

  const formattedPhone = phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  await sendEmail(
    Deno.env.get('ADMIN_EMAIL') || '',
    '📱 Neue Buchung - WhatsApp-Nachricht senden',
    `
    Eine neue Buchung wurde erstellt. Bitte senden Sie die folgende Nachricht über WhatsApp:
    
    Telefonnummer: ${phone}
    
    Nachricht:
    ${message}
    
    Direkter WhatsApp-Link:
    ${whatsappUrl}
    `
  );

  return true;
}

async function processNotificationQueue(supabase: any) {
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
    .limit(10);

  if (fetchError) {
    console.error('Fehler beim Laden der Benachrichtigungen:', fetchError);
    return;
  }

  for (const notification of notifications) {
    try {
      // Markiere als "in Bearbeitung"
      await supabase
        .from('notification_queue')
        .update({ status: 'processing', last_attempt: new Date().toISOString() })
        .eq('id', notification.id);

      // Sende die Benachrichtigung
      if (notification.notification_type === 'email') {
        await sendEmail(
          notification.recipient_email,
          notification.subject,
          notification.content
        );
      } else if (notification.notification_type === 'whatsapp') {
        await sendWhatsApp(
          notification.recipient_phone,
          notification.content
        );
      }

      // Markiere als erfolgreich gesendet
      await supabase
        .from('notification_queue')
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', notification.id);

      // Füge zur Historie hinzu
      await supabase
        .from('notification_history')
        .insert({
          queue_id: notification.id,
          booking_id: notification.booking_id,
          notification_type: notification.notification_type,
          status: 'sent',
          recipient_email: notification.recipient_email,
          recipient_phone: notification.recipient_phone,
          subject: notification.subject,
          content: notification.content,
          sent_at: new Date().toISOString()
        });

    } catch (error) {
      console.error(`Fehler beim Senden der Benachrichtigung ${notification.id}:`, error);
      
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    await processNotificationQueue(supabase);

    return new Response(
      JSON.stringify({ message: 'Benachrichtigungen erfolgreich verarbeitet' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Fehler:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
