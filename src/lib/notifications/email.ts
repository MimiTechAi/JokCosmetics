import { Booking } from '@/types/booking';
import { Customer } from '@/types/customer';
import { Service } from '@/types/service';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  try {
    const response = await fetch('/api/notify/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendEmailNotification(
  booking: Booking,
  customer: Customer,
  service: Service
) {
  const formattedDate = format(new Date(booking.booking_date), "dd. MMMM yyyy", { locale: de });
  
  const emailData: EmailData = {
    to: customer.email,
    subject: 'Buchungsbestätigung - Jok Cosmetics',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d53f8c;">Buchungsbestätigung</h1>
        <p>Sehr geehrte/r ${customer.first_name} ${customer.last_name},</p>
        <p>vielen Dank für Ihre Buchung bei Jok Cosmetics. Hier sind Ihre Buchungsdetails:</p>
        
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #2d3748; margin-top: 0;">Gebuchter Service</h2>
          <p style="margin: 5px 0;"><strong>${service.name}</strong></p>
          <p style="margin: 5px 0;">Datum: ${formattedDate}</p>
          <p style="margin: 5px 0;">Uhrzeit: ${booking.booking_time}</p>
          <p style="margin: 5px 0;">Dauer: ${service.duration} Minuten</p>
          <p style="margin: 5px 0;">Preis: ${service.price}€</p>
        </div>

        <p>Adresse:</p>
        <p style="margin: 5px 0;">Jok Cosmetics</p>
        <p style="margin: 5px 0;">Bad Liebenzell</p>
        
        <div style="margin-top: 30px;">
          <p>Bei Fragen können Sie uns gerne kontaktieren:</p>
          <p>WhatsApp: <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER}">+49 173 5390928</a></p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #666;">
            Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
          </p>
        </div>
      </div>
    `,
  };

  const adminEmailData: EmailData = {
    to: process.env.ADMIN_EMAIL || 'admin@jok-cosmetics.de',
    subject: 'Neue Buchung eingegangen - Jok Cosmetics',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d53f8c;">Neue Buchung</h1>
        
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #2d3748; margin-top: 0;">Buchungsdetails</h2>
          <p style="margin: 5px 0;"><strong>Kunde:</strong> ${customer.first_name} ${customer.last_name}</p>
          <p style="margin: 5px 0;"><strong>E-Mail:</strong> ${customer.email}</p>
          ${customer.phone ? `<p style="margin: 5px 0;"><strong>Telefon:</strong> ${customer.phone}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Service:</strong> ${service.name}</p>
          <p style="margin: 5px 0;"><strong>Datum:</strong> ${formattedDate}</p>
          <p style="margin: 5px 0;"><strong>Uhrzeit:</strong> ${booking.booking_time}</p>
          <p style="margin: 5px 0;"><strong>Dauer:</strong> ${service.duration} Minuten</p>
          <p style="margin: 5px 0;"><strong>Preis:</strong> ${service.price}€</p>
          ${booking.notes ? `<p style="margin: 5px 0;"><strong>Notizen:</strong> ${booking.notes}</p>` : ''}
        </div>
        
        <div style="margin-top: 20px;">
          <p>Bitte bestätigen Sie den Termin im Dashboard.</p>
        </div>
      </div>
    `,
  };

  try {
    // Sende E-Mail an Kunden
    const customerResponse = await sendEmail(emailData);

    // Sende E-Mail an Admin
    const adminResponse = await sendEmail(adminEmailData);

    return customerResponse && adminResponse;
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return false;
  }
}

export async function sendBookingConfirmation(
  booking: Booking,
  customer: Customer,
  service: Service
): Promise<boolean> {
  try {
    await sendEmailNotification(booking, customer, service);
    return true;
  } catch (error) {
    console.error('Fehler beim Senden der Buchungsbestätigung:', error);
    return false;
  }
}
