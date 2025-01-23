import { Booking } from '@/types/booking';
import { Customer } from '@/types/customer';
import { Service } from '@/types/service';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const WHATSAPP_BUSINESS_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

interface BookingDetails {
  customerName: string;
  serviceName: string;
  bookingDate: Date;
  bookingTime: string;
  customerPhone?: string;
  customerEmail: string;
  notes?: string;
}

export async function sendWhatsAppNotification(
  booking: Booking,
  customer: Customer,
  service: Service
) {
  const bookingDetails: BookingDetails = {
    customerName: `${customer.first_name} ${customer.last_name}`,
    serviceName: service.name,
    bookingDate: new Date(booking.booking_date),
    bookingTime: booking.booking_time,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    notes: booking.notes || ''
  };

  try {
    const formattedDate = format(bookingDetails.bookingDate, "dd. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de });
    
    const message = `🎉 Neue Buchungsanfrage!\n\n` +
      `👤 Kunde: ${bookingDetails.customerName}\n` +
      `💅 Service: ${bookingDetails.serviceName}\n` +
      `📅 Termin: ${formattedDate}\n` +
      `📧 E-Mail: ${bookingDetails.customerEmail}\n` +
      (bookingDetails.customerPhone ? `📱 Telefon: ${bookingDetails.customerPhone}\n` : '') +
      (bookingDetails.notes ? `📝 Notizen: ${bookingDetails.notes}\n` : '') +
      `\nBitte bestätigen Sie den Termin über das Dashboard.`;

    // WhatsApp Business API Link erstellen
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Öffne WhatsApp im neuen Tab
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Fehler beim Senden der WhatsApp-Nachricht:', error);
    return false;
  }
}
