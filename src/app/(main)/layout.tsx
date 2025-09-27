"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { Footer } from '@/components/layout/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header isHomePage={isHomePage} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
