
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const trackOrderSchema = z.object({
  orderId: z.string().min(1, "رقم الطلب مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
});

export default function TrackOrderPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof trackOrderSchema>>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderId: "", email: "" },
  });

  const onSubmit = (values: z.infer<typeof trackOrderSchema>) => {
    console.log("Track order submitted:", values);
    toast({
      title: "جاري البحث عن الطلب...",
      description: `البحث عن تفاصيل الطلب #${values.orderId}.`,
    });
    // Here you would typically make an API call to fetch order status
    // For now, we'll just show a success toast after a delay.
    setTimeout(() => {
        toast({
            title: "تم العثور على الطلب",
            description: "حالة طلبك: قيد الشحن. من المتوقع أن يصل خلال 3-5 أيام عمل.",
        });
    }, 2000);
  };

  return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>تتبع طلبك</CardTitle>
            <CardDescription>أدخل رقم طلبك وبريدك الإلكتروني لعرض حالته.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الطلب</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: order_12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني للفواتير</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">تتبع الطلب</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
  );
}
