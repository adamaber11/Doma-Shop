
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect } from 'react';

const shippingSchema = z.object({
  name: z.string().min(2, "الاسم قصير جدًا"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  address: z.string().min(5, "العنوان قصير جدًا"),
  city: z.string().min(2, "المدينة قصيرة جدًا"),
  zip: z.string().regex(/^\d{5}$/, "رمز بريدي غير صالح"),
  country: z.string().min(2, "الدولة مطلوبة"),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, cartCount } = useCart();
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: "", email: "", address: "", city: "", zip: "", country: ""
    }
  });

  useEffect(() => {
    if (cartCount === 0) {
      router.push('/products');
    }
  }, [cartCount, router]);

  if (cartCount === 0) {
    return null; // Render nothing while redirecting
  }

  const onSubmit = (values: z.infer<typeof shippingSchema>) => {
    console.log("Order placed:", { values, cartItems, cartTotal });
    const orderId = `order_${new Date().getTime()}`;
    clearCart();
    router.push(`/confirmation/${orderId}`);
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">الدفع</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الشحن</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl><Input placeholder="جون دو" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl><Input placeholder="123 الشارع الرئيسي" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>المدينة</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>الرمز البريدي</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel>الدولة</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">هذا متجر تجريبي. لن تتم معالجة أي دفعة حقيقية.</p>
                  <div className="mt-4 p-4 border rounded-md bg-secondary">
                      <p className="font-semibold">بوابة دفع وهمية</p>
                      <p className="text-sm">انقر على "إتمام الطلب" لمحاكاة عملية دفع ناجحة.</p>
                  </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>طلبك</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {cartItems.map(item => {
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <li key={item.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatCurrency(price * item.quantity)}</p>
                      </li>
                    );
                  })}
                </ul>
                <Separator className="my-4" />
                <div className="space-y-2">
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
                </div>
              </CardContent>
            </Card>
            <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="w-full mt-6">
                  إتمام الطلب
              </Button>
          </div>
        </div>
      </div>
  );
}
