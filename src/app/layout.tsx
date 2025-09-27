import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Doma',
  description: 'A complete E-commerce website using Firebase.',
  icons: {
    icon: 'https://res.cloudinary.com/doqltxyb2/image/upload/v1759015201/D_hm7dda.png',
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
