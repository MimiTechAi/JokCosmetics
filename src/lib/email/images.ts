import fs from 'fs';
import path from 'path';

// Funktion zum Laden und Base64-Kodieren von Bildern
function loadBase64Image(relativePath: string): string {
  const publicPath = path.join(process.cwd(), 'public');
  const imagePath = path.join(publicPath, relativePath);
  
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const extension = path.extname(imagePath).toLowerCase().substring(1);
    const mimeType = extension === 'svg' ? 'image/svg+xml' : `image/${extension}`;
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error(`Error loading image ${relativePath}:`, error);
    return '';
  }
}

// Exportiere Base64-kodierte Bilder
export const LOGO_BASE64 = loadBase64Image('images/jok-logo.png');
export const INSTAGRAM_ICON = loadBase64Image('images/email/instagram.svg');
export const FACEBOOK_ICON = loadBase64Image('images/email/facebook.svg');
