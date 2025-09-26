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

const shippingSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City is too short"),
  zip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  country: z.string().min(2, "Country is required"),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: "", email: "", address: "", city: "", zip: "", country: ""
    }
  });

  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') {
        router.push('/products');
    }
    return null;
  }

  const onSubmit = (values: z.infer<typeof shippingSchema>) => {
    console.log("Order placed:", { values, cartItems, cartTotal });
    const orderId = `order_${new Date().getTime()}`;
    clearCart();
    router.push(`/confirmation/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
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
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This is a demo store. No real payment will be processed.</p>
                <div className="mt-4 p-4 border rounded-md bg-secondary">
                    <p className="font-semibold">Dummy Payment Gateway</p>
                    <p className="text-sm">Click "Place Order" to simulate a successful payment.</p>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
           <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Place Order
            </Button>
        </div>
      </div>
    </div>
  );
}
