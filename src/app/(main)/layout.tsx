"use client";

import { usePathname } from 'next/navigation';
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isHomePage && <Header />}
      <main className="flex-1">{children}</main>
      {isHomePage && <Footer />}
    </div>
  );
}
