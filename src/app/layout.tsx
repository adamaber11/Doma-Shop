import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/CartContext';

const favicon = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cpath fill='%232563eb' d='M25,20 C20,20 20,25 20,30 L20,70 C20,75 20,80 25,80 L75,80 C80,80 80,75 80,70 L80,30 C80,25 80,20 75,20 L25,20 Z' /%3e%3ctext x='50' y='62' font-size='40' fill='white' text-anchor='middle' font-family='Arial, sans-serif' font-weight='bold'%3eD%3c/text%3e%3c/svg%3e";

export const metadata: Metadata = {
  title: 'Doma',
  description: 'A complete E-commerce website using Firebase.',
  icons: {
    icon: favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <CartProvider>
            {children}
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
