import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Bestätigen Sie Ihre E-Mail-Adresse',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981; text-align: center;">E-Mail-Adresse bestätigen</h1>
        <p>Willkommen bei Naturio! Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #10b981; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            E-Mail bestätigen
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Wenn Sie sich nicht bei Naturio registriert haben, können Sie diese E-Mail ignorieren.
        </p>
        <p style="color: #666; font-size: 14px;">
          Der Link ist 24 Stunden gültig.
        </p>
      </div>
    `,
  });
}