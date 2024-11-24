import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export async function generateTOTPSecret() {
  const secret = authenticator.generateSecret();
  return secret;
}

export async function generateQRCode(email: string, secret: string) {
  const service = 'Naturio Marketplace';
  const otpauth = authenticator.keyuri(email, service, secret);
  const qrCode = await QRCode.toDataURL(otpauth);
  return qrCode;
}

export function verifyTOTP(token: string, secret: string) {
  return authenticator.verify({ token, secret });
}

export function generateTOTP(secret: string) {
  return authenticator.generate(secret);
}