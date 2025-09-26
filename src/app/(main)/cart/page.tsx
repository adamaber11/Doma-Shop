"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold font-headline">عربة التسوق فارغة</h1>
        <p className="mt-2 text-muted-foreground">يبدو أنك لم تضف أي شيء إلى سلة التسوق الخاصة بك بعد.</p>
        <Button asChild className="mt-6">
          <Link href="/products">ابدأ التسوق</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">عربة التسوق</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {cartItems.map(item => {
                  const itemImage = getPlaceholderImage(item.product.imageIds[0]);
                  return (
                    <li key={item.id} className="flex items-center p-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden ml-4">
                        <Image
                          src={itemImage.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                           data-ai-hint={itemImage.imageHint}
                        />
                      </div>
                      <div className="flex-grow">
                        <Link href={`/products/${item.product.id}`} className="font-semibold hover:text-primary">{item.product.name}</Link>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 mx-4">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                          className="w-14 h-8 text-center"
                        />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right w-24 font-semibold">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                      <Button variant="ghost" size="icon" className="mr-4 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>مجاني</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">المتابعة للدفع</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
