
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { Home, Package, ShoppingCart, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
       <div className="flex h-screen">
            <div className="hidden md:flex flex-col gap-4 p-4 border-r">
                <Skeleton className="h-10 w-40" />
                <div className="flex flex-col gap-2 mt-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                 <div className="mt-auto flex flex-col gap-2">
                     <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="flex-1 p-8">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2">
             <Logo />
             <SidebarTrigger className="ml-auto" />
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" isActive={true}>
                    <Home />
                    <span>الرئيسية</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/products">
                    <Package />
                    <span>المنتجات</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/orders">
                    <ShoppingCart />
                    <span>الطلبات</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/customers">
                    <Users />
                    <span>العملاء</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                    <span className="font-semibold">{user?.displayName || user?.email}</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
