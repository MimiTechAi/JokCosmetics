import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Jok Cosmetics - Beauty Salon Bad Liebenzell',
  description: 'Ihr Premium Beauty Salon in Bad Liebenzell. Powderbrows, Wimpernverlängerungen und mehr. Entdecken Sie Ihre wahre Schönheit bei Jok Cosmetics.',
  keywords: 'Beauty Salon Bad Liebenzell, Permanent Make-up Schwarzwald, Wimpernverlängerung Bad Liebenzell, Powderbrows',
};

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <main className="min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
