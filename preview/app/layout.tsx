import './globals.css';
import type { ReactNode } from 'react';
import { SiteHeader } from '@nav/SiteHeader';

export const metadata = {
  title: 'Humanaut Health — Nav Preview',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <SiteHeader />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
