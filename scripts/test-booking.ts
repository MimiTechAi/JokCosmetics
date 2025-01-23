import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rttrdlnidqcstsdacmrw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestBooking() {
  // 1. Get services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .limit(1);

  if (servicesError) {
    console.error('Error fetching services:', servicesError);
    return;
  }

  if (!services || services.length === 0) {
    console.error('No services found');
    return;
  }

  // 2. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user:', userError);
    return;
  }

  if (!user) {
    console.error('No user found - please sign in first');
    return;
  }

  // 3. Create booking
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 24); // Booking for tomorrow
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + services[0].duration);

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([
      {
        customer_id: user.id,
        service_id: services[0].id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending',
        notes: 'Test-Buchung zur Überprüfung des Systems'
      }
    ])
    .select()
    .single();

  if (bookingError) {
    console.error('Error creating booking:', bookingError);
    return;
  }

  console.log('Test-Buchung erfolgreich erstellt:', booking);

  // 4. Check notification queue
  const { data: notifications, error: notificationError } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('booking_id', booking.id);

  if (notificationError) {
    console.error('Error checking notifications:', notificationError);
    return;
  }

  console.log('Benachrichtigungen in der Queue:', notifications);
}

createTestBooking();
