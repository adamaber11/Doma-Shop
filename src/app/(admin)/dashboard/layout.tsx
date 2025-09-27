
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Home, Package, ShoppingCart, Users, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.email !== 'adamaber50@gmail.com') {
        router.push('/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  }

  const navLinks = [
    { href: "/dashboard", label: "الرئيسية", icon: Home, active: pathname === '/dashboard' },
    { href: "/dashboard/products", label: "المنتجات", icon: Package, active: pathname.startsWith('/dashboard/products') },
    { href: "/dashboard/orders", label: "الطلبات", icon: ShoppingCart, active: pathname.startsWith('/dashboard/orders') },
    { href: "/dashboard/customers", label: "العملاء", icon: Users, active: pathname.startsWith('/dashboard/customers') },
  ]

  if (loading) {
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
          <Logo />
          <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors text-muted-foreground hover:text-foreground",
                  link.active && "text-foreground font-semibold"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 ml-auto">
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
