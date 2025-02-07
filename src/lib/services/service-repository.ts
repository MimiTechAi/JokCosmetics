import { createClient } from '@supabase/supabase-js';
import { Service, ServiceCategory } from './types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class ServiceRepository {
  static async getServices(): Promise<Service[]> {
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          name
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }

    if (!services) {
      return [];
    }

    return services;
  }

  static async getServicesByCategory(categoryId: string): Promise<Service[]> {
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          name
        )
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching services by category:', error);
      throw new Error('Failed to fetch services by category');
    }

    if (!services) {
      return [];
    }

    return services;
  }

  static async getCategories(): Promise<ServiceCategory[]> {
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }

    if (!categories) {
      return [];
    }

    return categories;
  }

  static async getServiceById(id: string): Promise<Service | null> {
    const { data: service, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service by id:', error);
      throw new Error('Failed to fetch service');
    }

    return service;
  }
}

// Static fallback data
const staticServices: Service[] = [
  {
    id: 'powder-brows',
    category_id: 'permanent-makeup',
    title: 'Powder Brows',
    description: 'Sanft schattierte Augenbrauen für einen natürlichen, pudrigen Look. Ideal für einen weichen, definierten Augenbraueneffekt.',
    duration: '120-180 Min',
    price: '399€',
    image_url: '/images/WhatsApp Image 2025-01-09 at 22.31.21.jpeg',
    benefits: [
      'Natürlicher, pudrig-weicher Look',
      'Langanhaltende Ergebnisse (2-4 Jahre)',
      'Schmerzarme Behandlung',
      'Individuell anpassbare Form'
    ],
    features: [
      { icon: '🎯', text: 'KI-gestützte Symmetrieanalyse' },
      { icon: '🎨', text: 'Individuelle Farbabstimmung' },
      { icon: '✨', text: 'Nano-Pigmente' }
    ],
    techniques: [
      'Digital Powder Technique',
      'Ombre-Effekt',
      'Hybrid-Technik'
    ],
    is_active: true,
    sort_order: 1,
    slug: 'powder-brows'
  },
  // ... other static services
];
