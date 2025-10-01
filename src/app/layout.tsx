import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata = {
  title: "Doma Shop",
  description: "Doma Online Shop - Your one-stop shop for everything.",
  keywords: [
    "تسوق أونلاين",
    "شراء منتجات",
    "عروض",
    "خصومات",
    "إلكترونيات",
    "هواتف محمولة",
    "لابتوبات",
    "كمبيوترات",
    "ملابس",
    "أحذية",
    "إكسسوارات",
    "ساعات",
    "جيم",
    "معدات رياضية",
    "مستحضرات تجميل",
    "مكياج",
    "عطور",
    "أدوات منزلية",
    "ديكور",
    "ألعاب أطفال",
    "كتب",
    "أجهزة كهربائية",
    "إضاءة",
    "أثاث",
    "منتجات صحية",
    "مستلزمات مكتبية",
    "أدوات سفر",
    "أجهزة ذكية",
    "موديلات حديثة",
    "تسوق من الإنترنت",
    "توصيل سريع",
    "شراء آمن"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
