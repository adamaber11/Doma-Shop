"use client";

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { MinimalFooter } from '@/components/layout/MinimalFooter';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      {!isHomePage && <MinimalFooter />}
    </div>
  );
}
