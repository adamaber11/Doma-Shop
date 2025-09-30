

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
import { useEffect, useState } from 'react';
import { addOrder } from '@/services/product-service';
import { getShippingRates } from '@/services/settings-service';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wallet, Truck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ShippingRate } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const shippingSchema = z.object({
  name: z.string().min(2, "الاسم قصير جدًا"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  address: z.string().min(5, "العنوان قصير جدًا"),
  city: z.string().min(2, "المدينة قصيرة جدًا"),
  zip: z.string().regex(/^\d{5}$/, "رمز بريدي غير صالح"),
  country: z.string().min(2, "الدولة مطلوبة"),
  governorate: z.string({ required_error: "يرجى اختيار المحافظة" }),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: "", email: "", address: "", city: "", zip: "", country: "Egypt",
    }
  });

  const selectedGovernorateId = form.watch('governorate');
  const selectedRate = shippingRates.find(rate => rate.id === selectedGovernorateId);
  const shippingCost = selectedRate ? selectedRate.cost : 0;
  const totalWithShipping = cartTotal + shippingCost;


  useEffect(() => {
    if (cartCount === 0) {
      router.push('/products');
    }
  }, [cartCount, router]);

  useEffect(() => {
    const fetchRates = async () => {
        setLoadingRates(true);
        try {
            const rates = await getShippingRates();
            setShippingRates(rates);
        } catch (error) {
            console.error("Failed to fetch shipping rates", error);
            toast({ title: "خطأ", description: "فشل في تحميل أسعار الشحن." });
        } finally {
            setLoadingRates(false);
        }
    }
    fetchRates();
  }, [toast]);


  if (cartCount === 0) {
    return null; // Render nothing while redirecting
  }

  const onSubmit = async (values: z.infer<typeof shippingSchema>) => {
    if (!selectedRate) {
        toast({ title: "خطأ", description: "يرجى اختيار محافظة لحساب الشحن.", variant: "destructive" });
        return;
    }

    try {
        const orderData = {
            customerName: values.name,
            customerEmail: values.email,
            shippingAddress: {
                governorate: selectedRate.governorate,
                address: values.address,
                city: values.city,
                zip: values.zip,
                country: values.country,
            },
            items: cartItems.map(item => ({
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.salePrice ?? item.product.price,
            })),
            total: totalWithShipping,
            shippingCost: shippingCost,
            paymentMethod: 'cod' as const,
        };
        const newOrder = await addOrder(orderData);
        clearCart();
        router.push(`/confirmation/${newOrder.id}`);
    } catch (error) {
        console.error("Failed to create order", error);
        toast({
            title: "خطأ",
            description: "فشل في إنشاء الطلب. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
        });
    }
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
                    
                    <FormField control={form.control} name="governorate" render={({ field }) => (
                        <FormItem>
                            <FormLabel>المحافظة</FormLabel>
                            {loadingRates ? <Skeleton className="h-10 w-full" /> : (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر محافظتك" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {shippingRates.map(rate => (
                                    <SelectItem key={rate.id} value={rate.id}>{rate.governorate}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            )}
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
                          <FormControl><Input {...field} disabled /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Alert variant="destructive" className="mt-8">
                <Truck className="h-4 w-4" />
                <AlertTitle>معلومات الشحن</AlertTitle>
                <AlertDescription>
                    الشحن من 3 ايام الى 7 ايام
                </AlertDescription>
            </Alert>
            
             <Card className="mt-8">
              <CardHeader>
                <CardTitle>طريقة الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                 <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} defaultValue="cod">
                    <div className="flex items-center space-x-2 rounded-md border p-4">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer">
                            <Wallet className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <span className="font-semibold">الدفع عند الاستلام</span>
                                <p className="text-xs text-muted-foreground">ادفع نقدًا عند وصول طلبك إلى باب منزلك.</p>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
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
                    const variant = item.product.variants.find(v => v.color === item.selectedColor);
                    const placeholder = getPlaceholderImage('product-1');
                    const itemImage = variant?.imageUrls[0] || placeholder.imageUrl;
                    return (
                      <li key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0">
                            <Image
                                src={itemImage}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">{formatCurrency(price * item.quantity)}</p>
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
                    <span>{shippingCost > 0 ? formatCurrency(shippingCost) : (selectedGovernorateId ? 'مجاني' : 'اختر محافظة')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span>{formatCurrency(totalWithShipping)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="w-full mt-6" disabled={form.formState.isSubmitting || loadingRates}>
                  {form.formState.isSubmitting ? 'جاري إتمام الطلب...' : 'إتمام الطلب'}
              </Button>
          </div>
        </div>
      </div>
  );
}

    
