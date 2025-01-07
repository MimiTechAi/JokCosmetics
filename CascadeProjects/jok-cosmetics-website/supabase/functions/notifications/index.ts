import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: "template";
  template: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        currency?: {
          fallback_value: string;
          code: string;
          amount_1000: number;
        };
        date_time?: {
          fallback_value: string;
        };
      }>;
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { type, bookingId } = await req.json()

    // Hole Buchungsdetails
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        customers (
          first_name,
          last_name,
          whatsapp,
          email
        ),
        services (
          name,
          price
        )
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError) throw bookingError

    const customer = booking.customers
    const service = booking.services
    const appointmentDate = new Date(booking.requested_date)

    // WhatsApp-Nachricht vorbereiten
    const message: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: customer.whatsapp.replace(/[^0-9]/g, ''), // Entferne alle Nicht-Zahlen
      type: "template",
      template: {
        name: type === 'BOOKING_CONFIRMATION' ? "booking_confirmation" : "appointment_reminder",
        language: { code: "de" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: `${customer.first_name} ${customer.last_name}` },
              { type: "text", text: service.name },
              {
                type: "date_time",
                date_time: { fallback_value: appointmentDate.toLocaleString('de-DE') }
              },
              {
                type: "currency",
                currency: {
                  fallback_value: `${service.price}€`,
                  code: "EUR",
                  amount_1000: service.price * 1000
                }
              }
            ]
          }
        ]
      }
    }

    // Sende WhatsApp-Nachricht
    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v17.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      }
    )

    if (!whatsappResponse.ok) {
      throw new Error('WhatsApp API Fehler: ' + await whatsappResponse.text())
    }

    // Speichere Benachrichtigungsstatus
    await supabaseClient
      .from('notifications')
      .insert([
        {
          booking_id: bookingId,
          type,
          status: 'sent',
          sent_at: new Date().toISOString()
        }
      ])

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
