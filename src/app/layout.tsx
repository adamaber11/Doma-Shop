import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Doma',
  description: 'A complete E-commerce website using Firebase.',
  keywords: [
    'متجر إلكتروني',
    'تسوق أونلاين',
    'عروض تسوق',
    'أفضل الأسعار',
    'منتجات أصلية',
    'Online Shopping',
    'Buy Online',
    'Best Deals',
    'Shop Now',
    'هواتف ذكية',
    'موبايلات أندرويد',
    'iPhone',
    'سماعات بلوتوث',
    'شاشات سمارت',
    'لابتوبات',
    'Tablets',
    'Smart Watches',
    'Electronics Online Store',
    'ملابس رجالي',
    'ملابس حريمي',
    'ملابس أطفال',
    'أحذية رياضية',
    'ملابس ماركات',
    'Hijab Fashion',
    'Men’s Fashion Online',
    'Women’s Dresses',
    'Kids Clothes',
    'Online Shoes',
    'أثاث مودرن',
    'ديكور منزلي',
    'أدوات المطبخ',
    'أجهزة منزلية',
    'Home Appliances',
    'Kitchen Tools',
    'Furniture Online',
    'Smart Home Products',
    'عطور أصلية',
    'مستحضرات تجميل',
    'كريمات بشرة',
    'مكياج أونلاين',
    'عناية بالشعر',
    'Perfumes Online',
    'Makeup Store',
    'Skincare Products',
    'Beauty Shop',
    'أدوات رياضية',
    'ملابس رياضية',
    'أجهزة جيم منزلية',
    'Protein Supplements',
    'Sportswear Online',
    'Fitness Equipment',
    'خصومات حصرية',
    'الدفع عند الاستلام',
    'شحن مجاني',
    'تخفيضات اليوم',
    'Best Price Online',
    'Free Shipping',
    'Cash on Delivery',
    'Daily Deals',
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
