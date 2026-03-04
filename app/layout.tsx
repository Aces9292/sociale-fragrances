import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailPopup from '@/components/EmailPopup';
import { Providers } from '@/components/Providers';


export const metadata: Metadata = {
  title: 'Millennial Ma | Nostalgia Candles for Millennial Moms | SOCIALE',
  description: 'Hand-poured nostalgia for the teens we were and the moms we are. Shop the Millennial Ma collection — artisanal candles with Y2K soul.',
  keywords: ['millennial mom gifts', 'nostalgia candles', 'Y2K gifts', 'mother\'s day candles', 'millennial candles', 'soy candles', 'handcrafted candles', 'Connecticut'],
  openGraph: {
    title: 'Millennial Ma | Nostalgia Candles for Millennial Moms | SOCIALE',
    description: 'Hand-poured nostalgia for the teens we were and the moms we are. Shop the Millennial Ma collection — artisanal candles with Y2K soul.',
    type: 'website',
    images: ['/images/campaign/ma-pink-car.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Millennial Ma | Nostalgia Candles | SOCIALE',
    description: 'For the teens we were. And the moms we are.',
    images: ['/images/campaign/ma-pink-car.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-black">
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <EmailPopup />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
