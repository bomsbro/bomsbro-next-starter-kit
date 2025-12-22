import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import AppProviders from '@/shared/core/providers/app-providers';
import Layout from '@/shared/ui/components/layout/Layout';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Minimal Blog',
  description: 'A minimal blog built with Next.js',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="ko">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AppProviders>
        <Layout>{children}</Layout>
      </AppProviders>
    </body>
  </html>
);

export default RootLayout;
