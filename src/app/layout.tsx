import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import Chatbot from '../components/Chatbot';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: 'Real Estate Broker',
  description: 'Your Trusted Partner in Finding the Perfect Property',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body>
        <LanguageProvider>
          {children}
          <Chatbot />
        </LanguageProvider>
      </body>
    </html>
  );
}
