import { createClient } from '@supabase/supabase-js';

async function testServices() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching services:', error);
    return;
  }

  console.log('Services found:', services?.length);
  console.log('Services:', services);
}

testServices();
