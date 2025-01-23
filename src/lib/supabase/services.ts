import { supabase } from './client';
import { Service } from '@/types/types';

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function updateService(id: string, updates: Partial<Service>) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}