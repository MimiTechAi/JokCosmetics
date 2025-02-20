import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { LOGO_BASE64, INSTAGRAM_ICON, FACEBOOK_ICON } from '@/lib/email/images';

// E-Mail-Template für den Kunden
const getCustomerEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buchungsbestätigung - JOK Cosmetics</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      background: linear-gradient(to right, #fce4ec, #f8bbd0);
      padding: 20px;
      border-radius: 8px;
    }
    .logo {
      max-width: 150px;
      margin-bottom: 20px;
    }
    .booking-details {
      background-color: #fff;
      border: 1px solid #ff69b4;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ff69b4;
      background: linear-gradient(to right, #fce4ec, #f8bbd0);
      padding: 20px;
      border-radius: 8px;
    }
    .social-icons {
      margin-top: 20px;
      text-align: center;
    }
    .social-icons img {
      width: 32px;
      height: 32px;
      margin: 0 10px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #ff69b4;
      color: white;
      text-decoration: none;
      border-radius: 25px;
      margin-top: 20px;
      font-weight: bold;
      text-align: center;
    }
    .important-note {
      background-color: #fff3f7;
      border-left: 4px solid #ff69b4;
      padding: 15px;
      margin: 20px 0;
    }
    .contact-info {
      background-color: #fff;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px dashed #ff69b4;
    }
    h1, h2, h3 {
      color: #ff69b4;
    }
    a {
      color: #ff69b4;
      text-decoration: none;
    }
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    ul li {
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;
    }
    ul li:before {
      content: "✨";
      position: absolute;
      left: 0;
    }
    .powered-by {
      text-align: center;
      padding: 15px;
      background: linear-gradient(135deg, #000000, #333333);
      color: white;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 14px;
    }
    .powered-by span {
      color: #00ffff;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${LOGO_BASE64}" alt="JOK Cosmetics Logo" class="logo">
    <h1>Buchungsbestätigung</h1>
  </div>

  <p>Sehr geehrte/r ${data.customerName},</p>
  
  <p>vielen Dank für Ihre Buchung bei JOK Cosmetics. Wir freuen uns, Sie bei uns begrüßen zu dürfen!</p>

  <div class="booking-details">
    <h2>Ihre Buchungsdetails:</h2>
    <p><strong>Behandlung:</strong> ${data.serviceName}</p>
    <p><strong>Datum:</strong> ${format(new Date(data.bookingDate), 'PPP', { locale: de })}</p>
    <p><strong>Uhrzeit:</strong> ${data.bookingTime} Uhr</p>
    <p><strong>Dauer:</strong> ${data.serviceDuration}</p>
    <p><strong>Preis:</strong> ${data.servicePrice}€</p>
  </div>

  <div class="important-note">
    <h3>Wichtige Informationen:</h3>
    <ul>
      <li>Bitte erscheinen Sie 5-10 Minuten vor Ihrem Termin</li>
      <li>Falls Sie verhindert sind, sagen Sie bitte mindestens 24 Stunden vorher ab</li>
      <li>Bitte kommen Sie ungeschminkt zur Behandlung</li>
      <li>Kostenlose Parkplätze finden Sie direkt vor dem Studio</li>
    </ul>
  </div>

  <div class="contact-info">
    <h3>Unser Studio:</h3>
    <p><strong>JOK Cosmetics</strong><br>
    Wilhelmstraße 17<br>
    75378 Bad Liebenzell</p>

    <h3>Kontakt:</h3>
    <ul>
      <li>Telefon: <a href="tel:+4915234720022">+49 152 34720022</a></li>
      <li>E-Mail: <a href="mailto:thansuda22@googlemail.com">thansuda22@googlemail.com</a></li>
      <li>WhatsApp: <a href="https://wa.me/4915234720022">+49 152 34720022</a></li>
    </ul>
  </div>

  <div class="social-icons">
    <a href="https://www.instagram.com/jok.cosmetics/">
      <img src="${INSTAGRAM_ICON}" alt="Instagram" width="32">
    </a>
    <a href="https://www.facebook.com/jokcosmetics">
      <img src="${FACEBOOK_ICON}" alt="Facebook" width="32">
    </a>
  </div>

  <div class="footer">
    <p>JOK Cosmetics - Ihr Beauty-Experte in Bad Liebenzell</p>
    <p> ${new Date().getFullYear()} JOK Cosmetics. Alle Rechte vorbehalten.</p>
  </div>

  <div class="powered-by">
    🤖 Powered by <span>Mimi Tech AI</span><br>
    <small>Innovative Buchungslösungen für Beauty-Profis</small>
  </div>
</body>
</html>
`;

// E-Mail-Template für den Admin
const getAdminEmailTemplate = (data: any) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Buchung - JOK Cosmetics</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      background: linear-gradient(to right, #fce4ec, #f8bbd0);
      padding: 20px;
      border-radius: 8px;
    }
    .booking-details {
      background-color: #fff;
      border: 1px solid #ff69b4;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .customer-info {
      margin-top: 20px;
      padding: 20px;
      background-color: #fff3f7;
      border: 2px solid #ff69b4;
      border-radius: 8px;
    }
    .action-buttons {
      margin-top: 20px;
      text-align: center;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #ff69b4;
      color: white;
      text-decoration: none;
      border-radius: 25px;
      margin: 10px;
      font-weight: bold;
    }
    h1, h2 {
      color: #ff69b4;
    }
    a {
      color: #ff69b4;
      text-decoration: none;
    }
    .powered-by {
      text-align: center;
      padding: 15px;
      background: linear-gradient(135deg, #000000, #333333);
      color: white;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 14px;
    }
    .powered-by span {
      color: #00ffff;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${LOGO_BASE64}" alt="JOK Cosmetics Logo" style="max-width: 150px;">
    <h1>🎉 Neue Buchung eingegangen!</h1>
  </div>

  <div class="booking-details">
    <h2>Buchungsdetails:</h2>
    <p><strong>Behandlung:</strong> ${data.serviceName}</p>
    <p><strong>Datum:</strong> ${format(new Date(data.bookingDate), 'PPP', { locale: de })}</p>
    <p><strong>Uhrzeit:</strong> ${data.bookingTime} Uhr</p>
    <p><strong>Dauer:</strong> ${data.serviceDuration}</p>
    <p><strong>Preis:</strong> ${data.servicePrice}€</p>
  </div>

  <div class="customer-info">
    <h2>Kundeninformationen:</h2>
    <p><strong>Name:</strong> ${data.customerName}</p>
    <p><strong>E-Mail:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
    <p><strong>Telefon:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
    ${data.notes ? `<p><strong>Anmerkungen:</strong> ${data.notes}</p>` : ''}
  </div>

  <div class="action-buttons">
    <a href="mailto:${data.customerEmail}" class="button">✉️ E-Mail an Kunde</a>
    <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" class="button">💬 WhatsApp</a>
  </div>

  <div class="powered-by">
    🤖 Powered by <span>Mimi Tech AI</span><br>
    <small>Innovative Buchungslösungen für Beauty-Profis</small>
  </div>
</body>
</html>
`;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Typen anpassen
    const { id }: { id: string } = data;

    console.log('Received booking data:', data);

    // Debug: Zeige Umgebungsvariablen (ohne sensible Daten)
    const envDebug = {
      EMAIL_HOST: process.env.EMAIL_HOST ? '✓' : '✗',
      EMAIL_PORT: process.env.EMAIL_PORT ? '✓' : '✗',
      EMAIL_USER: process.env.EMAIL_USER ? '✓' : '✗',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✓' : '✗',
      EMAIL_FROM: process.env.EMAIL_FROM ? '✓' : '✗',
      EMAIL_ADMIN: process.env.EMAIL_ADMIN ? '✓' : '✗',
    };
    console.log('Environment variables status:', envDebug);

    // Überprüfe, ob alle erforderlichen Umgebungsvariablen gesetzt sind
    const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.error('Missing required environment variables:', missingEnvVars);
      return NextResponse.json(
        { error: `Missing environment variables: ${missingEnvVars.join(', ')}` },
        { status: 500 }
      );
    }

    console.log('Creating SMTP transporter...');
    const transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    try {
      console.log('Verifying SMTP connection...');
      // Teste die SMTP-Verbindung
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (smtpError: any) {
      console.error('SMTP connection error:', {
        message: smtpError.message,
        code: smtpError.code,
        command: smtpError.command,
        response: smtpError.response
      });
      return NextResponse.json(
        { error: `SMTP connection failed: ${smtpError.message}` },
        { status: 500 }
      );
    }

    // Sende E-Mail an den Kunden
    try {
      console.log('Sending customer email...');
      await transporter.sendMail({
        from: {
          name: 'JOK Cosmetics',
          address: process.env.EMAIL_FROM!
        },
        to: data.customerEmail,
        subject: 'Ihre Buchungsbestätigung - JOK Cosmetics',
        html: getCustomerEmailTemplate(data)
      });
      console.log('Customer confirmation email sent successfully');
    } catch (customerEmailError: any) {
      console.error('Error sending customer email:', {
        message: customerEmailError.message,
        code: customerEmailError.code,
        command: customerEmailError.command,
        response: customerEmailError.response
      });
      return NextResponse.json(
        { error: `Failed to send customer email: ${customerEmailError.message}` },
        { status: 500 }
      );
    }

    // Sende E-Mail an den Admin (optional)
    if (process.env.EMAIL_ADMIN) {
      try {
        console.log('Sending admin email...');
        await transporter.sendMail({
          from: {
            name: 'JOK Cosmetics Buchungssystem',
            address: process.env.EMAIL_FROM!
          },
          to: process.env.EMAIL_ADMIN,
          subject: 'Neue Buchung eingegangen',
          html: getAdminEmailTemplate(data)
        });
        console.log('Admin notification email sent successfully');
      } catch (adminEmailError: any) {
        console.error('Error sending admin email:', {
          message: adminEmailError.message,
          code: adminEmailError.code,
          command: adminEmailError.command,
          response: adminEmailError.response
        });
        // Wir loggen den Fehler, werfen aber keinen, da die Kunden-E-Mail bereits gesendet wurde
      }
    } else {
      console.log('Skipping admin email (EMAIL_ADMIN not configured)');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email sending error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return NextResponse.json(
      { error: `Failed to send confirmation email: ${error.message}` },
      { status: 500 }
    );
  }
}
