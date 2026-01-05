import type { Metadata } from 'next';

import AppProviders from '@/shared/core/providers/app-providers';
import Layout from '@/shared/ui/components/layout/Layout';

import './globals.css';

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
    <body className="font-sans antialiased">
      <AppProviders>
        <Layout>{children}</Layout>
      </AppProviders>
    </body>
  </html>
);

export default RootLayout;
