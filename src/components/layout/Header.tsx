
"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/hooks/use-cart";
import { CartSheetContent } from "@/components/cart/CartSheetContent";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserAuth } from "./UserAuth";

const navLinks = [
  { href: "/", label: "الرئيسيه" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

export function Header() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return null;
  }
  
  const headerClasses = cn(
    "sticky top-0 z-50 w-full transition-colors duration-300 border-b bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60"
  );

  return (
    <header className={headerClasses}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <Logo />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">فتح قائمة التنقل</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-4">
                <Logo />
                <nav className="flex flex-col gap-4">
                  {navLinks.map(({ href, label }) => (
                    <Link key={href} href={href} className="text-lg font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="ابحث عن منتجات..." className="pr-10 w-64" />
          </div>

          <UserAuth />
          
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">عربة التسوق</span>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount}
                    </span>
                )}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-md">
                <CartSheetContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
