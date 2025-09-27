
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
import { addContactMessage } from '@/services/product-service';
import { useEffect, useState } from 'react';
import { getContactInfoSettings } from '@/services/settings-service';
import type { ContactInfoSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  message: z.string().min(10, "يجب أن لا تقل الرسالة عن 10 أحرف"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfoSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" }
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await getContactInfoSettings();
        setContactInfo(settings);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    try {
        await addContactMessage(values);
        toast({
            title: "تم إرسال الرسالة!",
            description: "شكرًا لتواصلك معنا. سنعود إليك قريبًا.",
        });
        form.reset();
    } catch (error) {
        console.error("Failed to send message", error);
        toast({
            title: "خطأ",
            description: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
            variant: "destructive"
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">اتصل بنا</h1>
        <p className="mt-2 text-lg text-muted-foreground">نحب أن نسمع منك. إليك كيفية الوصول إلينا.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          {loading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className='space-y-2'>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full"><Mail className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-semibold text-lg">البريد الإلكتروني</h3>
                  <p className="text-muted-foreground">{contactInfo?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full"><Phone className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-semibold text-lg">الهاتف</h3>
                  <p className="text-muted-foreground">{contactInfo?.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full"><MapPin className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-semibold text-lg">العنوان</h3>
                  <p className="text-muted-foreground">{contactInfo?.address}</p>
                </div>
              </div>
            </>
          )}
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
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
