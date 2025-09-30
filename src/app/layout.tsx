import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/CartContext';
import { ClientOnly } from '@/components/layout/ClientOnly';
<<<<<<< HEAD
import Script from 'next/script';
=======
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
>>>>>>> 8f8db34 (الموقع تقيل جدا جدا جدا)

export const metadata: Metadata = {
  title: 'Doma Online Shop',
  description: 'A complete E-commerce website using Firebase.',
  keywords: [
    'تسوق أونلاين', 'شراء منتجات', 'عروض وخصومات', 'أفضل الأسعار', 'تسوق من الإنترنت', 
    'منتجات جديدة', 'هواتف ذكية', 'ملابس', 'أحذية', 'إكسسوارات', 'أجهزة كهربائية', 
    'أدوات منزلية', 'شحن سريع', 'الدفع عند الاستلام'
  ],
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
<<<<<<< HEAD
    <html lang="ar" dir="rtl">
      <head>
        {/* كود التحقق من جوجل */}
        <meta
          name="google-site-verification"
          content="Q93NKffchZec6bIJJZWfLdrOh__ENY5f6NLi00joc7s"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
=======
    <html lang="ar" dir="rtl" className={`${inter.variable}`}>
>>>>>>> 8f8db34 (الموقع تقيل جدا جدا جدا)
      <body>
        <CartProvider>
          <ClientOnly>
            {children}
            <Toaster />
          </ClientOnly>
        </CartProvider>

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}

