import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  title: 'SOCIALE | Handcrafted Candles',
  description: 'Natural soy wax candles. Handcrafted in Connecticut.',
  keywords: ['candles', 'soy candles', 'luxury candles', 'handcrafted', 'Connecticut'],
  openGraph: {
    title: 'SOCIALE | Handcrafted Candles',
    description: 'Natural soy wax candles. Handcrafted in Connecticut.',
    type: 'website',
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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
