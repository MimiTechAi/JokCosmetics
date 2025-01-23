import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { format } from 'https://esm.sh/date-fns@2'
import { de } from 'https://esm.sh/date-fns@2/locale'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Booking {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  service_type: string
  additional_services: string[]
  booking_date: string
  booking_time: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: bookings, error: fetchError } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('notification_sent', false)
      .limit(10)

    if (fetchError) {
      console.error('Fehler beim Abrufen der Buchungen:', fetchError)
      throw fetchError
    }

    console.log('Gefundene Buchungen:', bookings)

    for (const booking of bookings) {
      try {
        // E-Mail-Text für den Admin
        const adminText = `
🌟 Neue Buchung bei JOK Cosmetics 🌟

📅 Termin: ${format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}
⏰ Zeit: ${booking.booking_time} Uhr
👤 Kunde: ${booking.client_name}
📱 Telefon: ${booking.client_phone}
📧 E-Mail: ${booking.client_email}
💅 Service: ${booking.service_type}
${booking.additional_services?.length ? `✨ Zusätzliche Services: ${booking.additional_services.join(', ')}\n` : ''}
${booking.notes ? `📝 Anmerkungen: ${booking.notes}` : ''}

WhatsApp: https://wa.me/${booking.client_phone.replace(/[^0-9]/g, '')}
`

        // E-Mail-Text für den Kunden
        const customerText = `
🌟 Ihre Buchung bei JOK Cosmetics 🌟

Vielen Dank für Ihre Buchung! 

📅 Ihr Termin: ${format(new Date(booking.booking_date), 'dd.MM.yyyy', { locale: de })}
⏰ Uhrzeit: ${booking.booking_time} Uhr
💅 Service: ${booking.service_type}
${booking.additional_services?.length ? `✨ Zusätzliche Services: ${booking.additional_services.join(', ')}\n` : ''}

Sie erhalten in Kürze eine Bestätigung von uns.

Bei Fragen erreichen Sie uns unter:
📱 Telefon: +49 173 5390928
💬 WhatsApp: https://wa.me/491735390928
📧 E-Mail: thansuda22@googlemail.com

Ihr JOK Cosmetics Team
`

        // Sende Admin-E-Mail
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'JOK Cosmetics <buchung@jok-cosmetics.de>',
            to: 'thansuda22@googlemail.com',
            subject: `✨ Neue Buchung von ${booking.client_name}`,
            text: adminText,
          }),
        })

        if (!adminEmailResponse.ok) {
          throw new Error('Fehler beim Senden der Admin-E-Mail')
        }

        // Sende Kunden-E-Mail
        const customerEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'JOK Cosmetics <buchung@jok-cosmetics.de>',
            to: booking.client_email,
            subject: '🌟 Ihre Buchung bei JOK Cosmetics',
            text: customerText,
          }),
        })

        if (!customerEmailResponse.ok) {
          throw new Error('Fehler beim Senden der Kunden-E-Mail')
        }

        // Markiere die Buchung als benachrichtigt
        const { error: updateError } = await supabaseClient
          .from('bookings')
          .update({ notification_sent: true })
          .eq('id', booking.id)

        if (updateError) {
          console.error('Fehler beim Aktualisieren der Buchung:', updateError)
          throw updateError
        }

        console.log('Benachrichtigungen erfolgreich gesendet für Buchung:', booking.id)

      } catch (error) {
        console.error('Fehler bei der Verarbeitung der Buchung:', error)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Allgemeiner Fehler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
