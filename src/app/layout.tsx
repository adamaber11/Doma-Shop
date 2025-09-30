
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";


export const metadata = {
  title: "Doma Shop",
  description: "Doma Online Shop - Your one-stop shop for everything.",
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
