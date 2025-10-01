
"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/hooks/use-cart";
import { CartSheetContent } from "@/components/cart/CartSheetContent";
import { cn } from "@/lib/utils";
import { UserAuth } from "./UserAuth";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "../ui/separator";
import { MobileCategories } from "./MobileCategories";
import { ClientOnly } from "./ClientOnly";

const navLinks = [
  { href: "/", label: "الرئيسيه" },
  { href: "/products", label: "المنتجات" },
  { href: "/offers", label: "العروض" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

export function Header() {
  const { cartCount } = useCart();
  const { user } = useAuth();
  
  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-colors duration-300 border-b bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60"
  );

  return (
    <header className={headerClasses}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
            <Logo />
        </div>
        <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
                
                {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                    {label}
                </Link>
                ))}
            </nav>
            <div className="flex items-center gap-2 md:gap-4">

                <ClientOnly>
                  <UserAuth />
                </ClientOnly>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">عربة التسوق</span>
                        <ClientOnly>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                {cartCount}
                                </span>
                            )}
                        </ClientOnly>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-md">
                        <CartSheetContent />
                    </SheetContent>
                </Sheet>
                 <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">فتح قائمة التنقل</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="flex flex-col">
                        <SheetHeader>
                            <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>
                            <div className="p-4">
                                <Logo />
                            </div>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto">
                             <div className="p-4">
                                <Separator className="mb-4" />
                                <MobileCategories />
                                <Separator className="my-4" />
                             </div>
                            <nav className="flex flex-col gap-1 p-4 pt-0">
                                {navLinks.map(({ href, label }) => (
                                    <SheetClose key={href} asChild>
                                        <Link href={href} className="text-lg font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                                            {label}
                                        </Link>
                                    </SheetClose>
                                ))}
                                 
                            </nav>
                        </div>
                        <Separator />
                        <div className="p-4">
                            {user ? (
                                 <SheetClose asChild>
                                    <Link href="/profile" className="flex items-center gap-3">
                                        <User className="h-6 w-6 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{user.displayName || user.email}</span>
                                            <span className="text-xs text-muted-foreground">عرض الملف الشخصي</span>
                                        </div>
                                    </Link>
                                 </SheetClose>
                            ) : (
                                <SheetClose asChild>
                                    <Link href="/login">
                                        <Button className="w-full">تسجيل الدخول</Button>
                                    </Link>
                                </SheetClose>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
