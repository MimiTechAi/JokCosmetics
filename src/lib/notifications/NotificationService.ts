import { supabase } from '../supabase/client';

export type NotificationType = 'BOOKING_CONFIRMATION' | 'BOOKING_REMINDER' | 'FEEDBACK_REQUEST';

interface NotificationData {
  bookingId: string;
}

export class NotificationService {
  private static async sendWhatsAppMessage(phone: string, message: string) {
    // Öffne WhatsApp mit vorformulierter Nachricht
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  public static async sendNotification(
    type: NotificationType,
    data: NotificationData
  ) {
    try {
      // Hole Buchungsdetails aus der Datenbank
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (
            first_name,
            last_name,
            whatsapp
          ),
          services (
            name,
            price,
            duration
          )
        `)
        .eq('id', data.bookingId)
        .single();

      if (bookingError) throw bookingError;

      // Erstelle die Nachricht basierend auf dem Typ
      let message = '';
      const dateTime = new Date(booking.requested_date).toLocaleString('de-DE');
      
      switch (type) {
        case 'BOOKING_CONFIRMATION':
          message = `🎉 Buchungsbestätigung - Jok Cosmetics\n\n` +
            `Hallo ${booking.customers.first_name},\n` +
            `Ihre Buchung wurde bestätigt!\n\n` +
            `📅 Termin: ${dateTime}\n` +
            `💅 Service: ${booking.services.name}\n` +
            `⏱ Dauer: ${booking.services.duration} Minuten\n` +
            `💰 Preis: ${booking.services.price}€\n\n` +
            `Wir freuen uns auf Sie!\n` +
            `Ihr Jok Cosmetics Team`;
          break;

        case 'BOOKING_REMINDER':
          message = `⏰ Terminerinnerung - Jok Cosmetics\n\n` +
            `Hallo ${booking.customers.first_name},\n` +
            `nicht vergessen - Ihr Termin ist morgen!\n\n` +
            `📅 Termin: ${dateTime}\n` +
            `💅 Service: ${booking.services.name}\n\n` +
            `Wir freuen uns auf Sie!\n` +
            `Ihr Jok Cosmetics Team`;
          break;

        case 'FEEDBACK_REQUEST':
          message = `⭐ Feedback - Jok Cosmetics\n\n` +
            `Hallo ${booking.customers.first_name},\n` +
            `wie hat Ihnen Ihr Besuch gefallen?\n\n` +
            `Wir würden uns über Ihre Bewertung freuen:\n` +
            `https://jok-cosmetics.de/feedback\n\n` +
            `Vielen Dank!\n` +
            `Ihr Jok Cosmetics Team`;
          break;
      }

      // Sende WhatsApp Nachricht
      await this.sendWhatsAppMessage(booking.customers.whatsapp, message);

      // Speichere Benachrichtigungsstatus
      await supabase.from('notifications').insert([
        {
          booking_id: data.bookingId,
          type,
          status: 'sent',
          sent_at: new Date().toISOString()
        }
      ]);

      return true;
    } catch (error) {
      console.error('Fehler beim Senden der Benachrichtigung:', error);
      return false;
    }
  }

  public static async scheduleReminder(bookingId: string, reminderDate: Date) {
    try {
      // Speichere geplante Erinnerung in der Datenbank
      const { error } = await supabase.from('scheduled_reminders').insert([
        {
          booking_id: bookingId,
          reminder_date: reminderDate.toISOString(),
          status: 'pending'
        }
      ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Fehler beim Planen der Erinnerung:', error);
      return false;
    }
  }
}
