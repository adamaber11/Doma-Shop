"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  message: z.string().min(10, "يجب أن لا تقل الرسالة عن 10 أحرف"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" }
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    console.log("Contact form submitted:", values);
    toast({
      title: "تم إرسال الرسالة!",
      description: "شكرًا لتواصلك معنا. سنعود إليك قريبًا.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">اتصل بنا</h1>
        <p className="mt-2 text-lg text-muted-foreground">نحب أن نسمع منك. إليك كيفية الوصول إلينا.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full"><Mail className="h-6 w-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">البريد الإلكتروني</h3>
              <p className="text-muted-foreground">support@doma.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full"><Phone className="h-6 w-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">الهاتف</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full"><MapPin className="h-6 w-6" /></div>
            <div>
              <h3 className="font-semibold text-lg">العنوان</h3>
              <p className="text-muted-foreground">123 شارع التجارة، المدينة الرقمية، 10101</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>أرسل لنا رسالة</CardTitle>
              <CardDescription>املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl><Input placeholder="اسمك" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl><Input type="email" placeholder="بريدك الإلكتروني" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرسالة</FormLabel>
                      <FormControl><Textarea placeholder="كيف يمكننا المساعدة؟" rows={6} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full">إرسال الرسالة</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
