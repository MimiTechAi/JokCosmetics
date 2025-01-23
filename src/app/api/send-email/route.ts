import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@jok-cosmetics.com',
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('E-Mail-Versand fehlgeschlagen:', error);
    return NextResponse.json(
      { success: false, error: 'E-Mail-Versand fehlgeschlagen' },
      { status: 500 }
    );
  }
}
