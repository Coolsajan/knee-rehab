import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Knee Rehab Tracker — Hemophilia A Protocol',
  description: '4-week right knee stabilization rehab tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
