import { Metadata } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jok-cosmetics.de'),
  title: {
    default: 'Jok Cosmetics | Beauty Salon in Bad Liebenzell',
    template: '%s | Jok Cosmetics'
  },
  description: 'Professionelle Permanent Make-up, Microblading und Wimpernverlängerung in Bad Liebenzell. Natürliche Ergebnisse von zertifizierten Experten.',
  keywords: [
    'Permanent Make-up Bad Liebenzell',
    'Microblading Bad Liebenzell',
    'Powder Brows',
    'Wimpernverlängerung',
    'Beauty Salon Bad Liebenzell',
    'Augenbrauen Bad Liebenzell',
    'Kosmetikstudio Bad Liebenzell'
  ],
  authors: [{ name: 'Jok Cosmetics' }],
  creator: 'Jok Cosmetics',
  publisher: 'Jok Cosmetics',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Jok Cosmetics | Beauty Salon in Bad Liebenzell',
    description: 'Professionelle Permanent Make-up, Microblading und Wimpernverlängerung in Bad Liebenzell. Natürliche Ergebnisse von zertifizierten Experten.',
    url: 'https://jok-cosmetics.de',
    siteName: 'Jok Cosmetics',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jok Cosmetics Beauty Salon',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://jok-cosmetics.de',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
