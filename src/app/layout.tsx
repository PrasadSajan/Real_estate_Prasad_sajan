import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Real Estate Broker',
  description: 'Your Trusted Partner in Finding the Perfect Property',
};

import { LanguageProvider } from '../context/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
