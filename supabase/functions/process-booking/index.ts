import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { 
      serviceId,
      bookingDate,
      bookingTime,
      firstName,
      lastName,
      email,
      phone,
      notes 
    } = await req.json()

    // 1. Erstelle oder aktualisiere Kunde
    const { data: customer, error: customerError } = await supabaseClient
      .from('customers')
      .upsert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone
      })
      .select()
      .single()

    if (customerError) throw customerError

    // 2. Hole Service-Details
    const { data: service, error: serviceError } = await supabaseClient
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()

    if (serviceError) throw serviceError

    // 3. Erstelle Buchung
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        customer_id: customer.id,
        service_id: serviceId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: 'pending',
        notes: notes || null
      })
      .select(`
        *,
        services (
          id,
          name,
          duration,
          price
        ),
        customers (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .single()

    if (bookingError) throw bookingError

    // 4. Trigger Benachrichtigungen
    const notificationPayload = {
      booking: {
        id: booking.id,
        dateTime: `${bookingDate}T${bookingTime}`,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        serviceName: service.name,
        notes: notes
      }
    }

    await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notifications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify(notificationPayload)
      }
    )

    return new Response(
      JSON.stringify({ success: true, booking }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
