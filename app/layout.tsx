import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import {
  Inter,
  Geist_Mono,
  Geist as V0_Font_Geist,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from 'next/font/google';
import { Header } from '@/components/header';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

// Initialize fonts
const _geist = V0_Font_Geist({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const _geistMono = V0_Font_Geist_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Process Monitor - Ease.io Challenge',
  description: 'Evaluate whether actions comply with established guidelines',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${inter.className}`}>
        <NuqsAdapter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <Header />
              {children}
            </div>
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
