
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";

export function UserAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "تم تسجيل الخروج بنجاح" });
      router.push('/login');
    } catch (error) {
      console.error("Logout error", error);
      toast({
        title: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };
  
  if (!isClient) {
      return (
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">قائمة المستخدم</span>
        </Button>
      )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">قائمة المستخدم</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.email === 'adamaber50@gmail.com' && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="ml-2 h-4 w-4" />
                  <span>لوحه التحكم</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/profile">الملف الشخصي</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">الطلبات</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              تسجيل الخروج
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/signup">إنشاء حساب</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
