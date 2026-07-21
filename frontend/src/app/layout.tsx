import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RAKSHA-NET | AI Cyber Fraud Intelligence Platform (India)',
  description: 'National Cyber Fraud Intelligence, Evidence Hash Verification, Spatial Hotspot Analytics, and Fast-Freeze Platform for India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-cyber-900 text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
