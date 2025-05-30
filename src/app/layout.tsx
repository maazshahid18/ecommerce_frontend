import './globals.css'; 
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Navbar from '../../components/Navbar'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Test Store', 
  description: 'A beautiful e-commerce test store built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children} 
      </body>
    </html>
  );
}