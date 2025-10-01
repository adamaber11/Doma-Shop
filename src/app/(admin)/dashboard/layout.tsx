
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Home, Package, ShoppingCart, Users, LogOut, Tags, Settings, Megaphone, Annoyed, MessageSquare, Truck, Mail, Menu, Shield, Star, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/firebase";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== 'adamaber50@gmail.com') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  }

  const navLinks = [
    { href: "/dashboard", label: "الرئيسية", icon: Home, active: pathname === '/dashboard' },
    { href: "/dashboard/products", label: "المنتجات", icon: Package, active: pathname.startsWith('/dashboard/products') },
    { href: "/dashboard/categories", label: "الفئات", icon: Tags, active: pathname.startsWith('/dashboard/categories') },
    { href: "/dashboard/brands", label: "العلامات التجارية", icon: Star, active: pathname.startsWith('/dashboard/brands') },
    { href: "/dashboard/advertisements", label: "البنرات", icon: Megaphone, active: pathname.startsWith('/dashboard/advertisements') },
    { href: "/dashboard/promo-cards", label: "البطاقات الترويجية", icon: CreditCard, active: pathname.startsWith('/dashboard/promo-cards') },
    { href: "/dashboard/popup-ads", label: "الإعلانات المنبثقة", icon: Annoyed, active: pathname.startsWith('/dashboard/popup-ads') },
    { href: "/dashboard/orders", label: "الطلبات", icon: ShoppingCart, active: pathname.startsWith('/dashboard/orders') },
    { href: "/dashboard/customers", label: "العملاء", icon: Users, active: pathname.startsWith('/dashboard/customers') },
    { href: "/dashboard/users", label: "المستخدمين", icon: Shield, active: pathname.startsWith('/dashboard/users') },
    { href: "/dashboard/subscribers", label: "المشتركين", icon: Mail, active: pathname.startsWith('/dashboard/subscribers') },
    { href: "/dashboard/shipping", label: "الشحن", icon: Truck, active: pathname.startsWith('/dashboard/shipping') },
    { href: "/dashboard/messages", label: "الرسائل", icon: MessageSquare, active: pathname.startsWith('/dashboard/messages') },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, active: pathname.startsWith('/dashboard/settings') },
  ]

  if (loading || !user) {
    return (
       <div className="flex flex-col h-screen">
          <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-4 ml-auto">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
          </header>
          <div className="flex-1 p-4 md:p-6 lg:p-8">
              <Skeleton className="h-96 w-full" />
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 flex items-center h-16 px-4 border-b shrink-0 bg-background z-50 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح قائمة التنقل</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <Link href="#" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base mb-6">
                            <Logo />
                            <span className="sr-only">Doma Shop</span>
                        </Link>
                        <nav className="grid gap-6 text-lg font-medium">
                            {navLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
                                <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                                    link.active && "text-foreground"
                                )}
                                >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                                </Link>
                            </SheetClose>
                            ))}
                        </nav>
                    </div>
                </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-start overflow-x-auto no-scrollbar px-4">
            <nav className="flex items-center gap-5 text-sm font-medium lg:gap-6 whitespace-nowrap">
            {navLinks.map(link => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "transition-colors text-muted-foreground hover:text-foreground px-2 py-1",
                    link.active && "text-foreground font-semibold"
                )}
                >
                {link.label}
                </Link>
            ))}
            </nav>
        </div>
        
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || ''} />
                            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/">المتجر</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="ml-2 h-4 w-4" />
                        <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 bg-muted/40 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
