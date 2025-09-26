"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Trash2, Plus, Minus, ShoppingBag, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";


export function CartSheetContent() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-2xl font-bold font-headline">عربة التسوق</SheetTitle>
        <SheetDescription>لديك {cartCount} منتج في عربتك</SheetDescription>
      </SheetHeader>
      
      {cartCount === 0 ? (
        <div className="flex flex-col items-center justify-center h-full pt-10">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">عربة التسوق فارغة</h2>
          <p className="mt-2 text-muted-foreground">اكتشف منتجاتنا الرائعة</p>
          <SheetClose asChild>
            <Button asChild className="mt-6">
                <Link href="/products">ابدأ التسوق</Link>
            </Button>
          </SheetClose>
        </div>
      ) : (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6">
                <ul className="divide-y divide-border px-6">
                    {cartItems.map(item => {
                    const itemImage = getPlaceholderImage(item.product.imageIds[0]);
                    return (
                        <li key={item.id} className="flex items-center py-4">
                            <div className="relative h-20 w-20 rounded-md overflow-hidden ml-4 flex-shrink-0">
                                <Image
                                src={itemImage.imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                data-ai-hint={itemImage.imageHint}
                                />
                            </div>
                            <div className="flex-grow">
                                <SheetClose asChild>
                                    <Link href={`/products/${item.product.id}`} className="font-semibold hover:text-primary text-sm leading-tight">{item.product.name}</Link>
                                </SheetClose>
                                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(item.product.price)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                    <Minus className="h-3 w-3" />
                                    </Button>
                                    <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                                    className="w-12 h-7 text-center"
                                    />
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end mr-2">
                                <span className="font-semibold text-sm mb-2">{formatCurrency(item.product.price * item.quantity)}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </li>
                    );
                    })}
                </ul>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-6 border-t bg-background -mx-6 px-6 pb-6">
                <div className="w-full space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                        <span>الإجمالي</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <SheetClose asChild>
                        <Button asChild size="lg" className="w-full">
                            <Link href="/checkout">المتابعة للدفع</Link>
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">متابعة التسوق</Button>
                    </SheetClose>
                </div>
            </SheetFooter>
        </div>
      )}
    </>
  );
}
