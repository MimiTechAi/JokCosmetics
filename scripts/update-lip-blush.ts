import { getServices, updateService } from '@/lib/supabase/services.js';

async function main() {
  try {
    const services = await getServices();
    const lipBlushService = services.find(service => 
      service.name.toLowerCase().includes('lip blush')
    );

    if (!lipBlushService) {
      console.error('Lip Blush service not found');
      return;
    }

    console.log('Updating Lip Blush service:', lipBlushService);

    const updatedService = await updateService(lipBlushService.id, {
      name: 'Sensual Lips',
      image_url: '/images/services/lips-art.jpg'
    });

    console.log('Service updated successfully:', updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
  }
}

main();