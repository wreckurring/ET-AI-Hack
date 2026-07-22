import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Under-Tow | National Cyber Fraud Protection Platform',
  description: 'AI-Powered Digital Public Safety Intelligence Platform for cyber crime reporting, fast-freeze account holds, and law enforcement intelligence.',
  keywords: ['Under-Tow', 'Cyber Fraud', 'MHA', '1930 Helpline', 'Fast Freeze', 'AI Scam Detector'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-200">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
