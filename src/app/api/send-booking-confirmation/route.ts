import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sendEmail';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://jok-cosmetics.de';

const getWhatsAppLink = (phone: string) => {
  const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;
  return `https://wa.me/${businessNumber}`;
};

const getGoogleMapsLink = () => {
  return 'https://maps.google.com/?q=JOK+Cosmetics+Bad+Liebenzell+Wilhelmstraße+17';
};

export async function POST(request: Request) {
  try {
    const { booking, service } = await request.json();

    // E-Mail an den Kunden
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 0 auto; background-color: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f8e3e8 0%, #ffd1dc 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #eee; }
            .footer { background: linear-gradient(135deg, #f8e3e8 0%, #ffd1dc 100%); padding: 30px; text-align: center; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 15px 30px; background: #25D366; color: white; text-decoration: none; border-radius: 30px; margin: 15px 0; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .button:hover { transform: translateY(-2px); box-shadow: 0 6px 8px rgba(0,0,0,0.15); }
            .details { background: #fff; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .logo { max-width: 180px; margin-bottom: 20px; }
            .social-links { margin-top: 20px; }
            .social-links a { margin: 0 10px; text-decoration: none; }
            .social-icon { width: 32px; height: 32px; }
            .map-button { display: inline-block; padding: 12px 25px; background: #4285f4; color: white; text-decoration: none; border-radius: 25px; margin: 10px 0; font-weight: bold; }
            .service-image { width: 100%; max-width: 300px; border-radius: 8px; margin: 15px 0; }
            .highlight { color: #ff4d94; font-weight: bold; }
            .price-tag { background: #f8e3e8; padding: 8px 15px; border-radius: 20px; font-weight: bold; display: inline-block; }
            .info-box { background: #f8f9fa; border-left: 4px solid #ff4d94; padding: 15px; margin: 15px 0; }
            .contact-info { display: flex; justify-content: center; gap: 20px; margin-top: 15px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .divider { height: 2px; background: linear-gradient(to right, transparent, #ff4d94, transparent); margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${BASE_URL}/logo.png" alt="JOK Cosmetics" class="logo">
              <h1 style="color: #333; margin: 0; font-size: 28px;">✨ Buchungsbestätigung ✨</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 18px;">Liebe/r ${booking.first_name} ${booking.last_name},</p>
              <p style="font-size: 16px;">wir freuen uns sehr, dass Sie sich für einen Beauty-Service bei JOK Cosmetics entschieden haben! 🎉</p>
              
              <div class="details">
                <h3 style="color: #ff4d94; margin-top: 0;">Ihre Buchungsdetails:</h3>
                <p><strong>Service:</strong> <span class="highlight">${service.title}</span></p>
                <p><strong>Datum:</strong> ${format(new Date(booking.booking_date), 'd. MMMM yyyy', { locale: de })}</p>
                <p><strong>Uhrzeit:</strong> ${booking.booking_time} Uhr</p>
                <div class="price-tag">Preis: ${service.price}€</div>
                <img src="${BASE_URL}/services/${service.slug}.jpg" alt="${service.title}" class="service-image">
              </div>

              <div class="info-box">
                <h3 style="color: #333; margin-top: 0;">📍 Unser Studio:</h3>
                <p>JOK Cosmetics<br>
                Wilhelmstraße 17<br>
                75378 Bad Liebenzell</p>
                <a href="${getGoogleMapsLink()}" class="map-button">
                  🗺️ In Google Maps öffnen
                </a>
              </div>

              <div style="text-align: center;">
                <p style="font-size: 16px;">Haben Sie Fragen zu Ihrem Termin?</p>
                <a href="${getWhatsAppLink(booking.phone)}" class="button">
                  <img src="${BASE_URL}/whatsapp-icon.png" alt="WhatsApp" style="vertical-align: middle; margin-right: 8px; width: 24px;">
                  Via WhatsApp kontaktieren
                </a>
              </div>

              <div class="info-box">
                <h3 style="color: #333; margin-top: 0;">ℹ️ Wichtige Hinweise:</h3>
                <ul style="padding-left: 20px;">
                  <li>Bitte erscheinen Sie 5-10 Minuten vor Ihrem Termin</li>
                  <li>Bei Verhinderung bitten wir um Absage mind. 24 Stunden vorher</li>
                  <li>Kostenlose Parkplätze finden Sie direkt vor dem Studio</li>
                  <li>Bitte kommen Sie ungeschminkt zur Behandlung</li>
                </ul>
              </div>
            </div>

            <div class="footer">
              <p style="font-size: 16px; margin-bottom: 5px;">Mit besten Grüßen,</p>
              <p style="font-size: 18px; font-weight: bold; margin-top: 0;">Ihr JOK Cosmetics Team</p>
              
              <div class="divider"></div>
              
              <div class="contact-info">
                <div class="contact-item">
                  <img src="${BASE_URL}/icons/phone.png" alt="Telefon" style="width: 16px;">
                  <a href="tel:${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER}" style="color: #666; text-decoration: none;">
                    ${process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER}
                  </a>
                </div>
                <div class="contact-item">
                  <img src="${BASE_URL}/icons/web.png" alt="Website" style="width: 16px;">
                  <a href="${BASE_URL}" style="color: #666; text-decoration: none;">jok-cosmetics.de</a>
                </div>
              </div>
              
              <div class="social-links">
                <a href="https://instagram.com/jok.cosmetics" target="_blank">
                  <img src="${BASE_URL}/icons/instagram.png" alt="Instagram" class="social-icon">
                </a>
                <a href="https://facebook.com/jokcosmetics" target="_blank">
                  <img src="${BASE_URL}/icons/facebook.png" alt="Facebook" class="social-icon">
                </a>
                <a href="${getWhatsAppLink('')}" target="_blank">
                  <img src="${BASE_URL}/icons/whatsapp.png" alt="WhatsApp" class="social-icon">
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // E-Mail an den Admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
            .container { max-width: 600px; margin: 0 auto; background-color: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #f8e3e8 0%, #ffd1dc 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; }
            .footer { background: linear-gradient(135deg, #f8e3e8 0%, #ffd1dc 100%); padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .customer-info { border-left: 4px solid #ff4d94; padding: 20px; margin: 20px 0; background: #f8f9fa; }
            .details { background: #fff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #eee; }
            .button { display: inline-block; padding: 15px 30px; background: #25D366; color: white; text-decoration: none; border-radius: 30px; margin: 15px 0; font-weight: bold; }
            .highlight { color: #ff4d94; font-weight: bold; }
            .price-tag { background: #f8e3e8; padding: 8px 15px; border-radius: 20px; font-weight: bold; display: inline-block; }
            .action-buttons { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #333; margin: 0;">🎉 Neue Buchung eingegangen!</h1>
            </div>
            
            <div class="content">
              <div class="customer-info">
                <h3 style="color: #ff4d94; margin-top: 0;">👤 Kundendetails:</h3>
                <p><strong>Name:</strong> ${booking.first_name} ${booking.last_name}</p>
                <p><strong>E-Mail:</strong> <a href="mailto:${booking.email}">${booking.email}</a></p>
                <p><strong>Telefon:</strong> <a href="tel:${booking.phone}">${booking.phone}</a></p>
                ${booking.notes ? `<p><strong>Anmerkungen:</strong> ${booking.notes}</p>` : ''}
              </div>

              <div class="details">
                <h3 style="color: #ff4d94; margin-top: 0;">📅 Buchungsdetails:</h3>
                <p><strong>Service:</strong> <span class="highlight">${service.title}</span></p>
                <p><strong>Datum:</strong> ${format(new Date(booking.booking_date), 'd. MMMM yyyy', { locale: de })}</p>
                <p><strong>Uhrzeit:</strong> ${booking.booking_time} Uhr</p>
                <div class="price-tag">Preis: ${service.price}€</div>
              </div>

              <div class="action-buttons">
                <a href="${getWhatsAppLink(booking.phone)}" class="button" style="background: #25D366;">
                  💬 WhatsApp Chat
                </a>
                <a href="mailto:${booking.email}" class="button" style="background: #ff4d94;">
                  ✉️ E-Mail senden
                </a>
              </div>
            </div>

            <div class="footer">
              <p>Diese E-Mail wurde automatisch generiert von JOK Cosmetics Buchungssystem</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: booking.email,
      subject: '✨ Ihre Buchungsbestätigung - JOK Cosmetics',
      html: customerEmailHtml,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: '🎉 Neue Buchung - JOK Cosmetics',
      html: adminEmailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send confirmation emails' },
      { status: 500 }
    );
  }
}
