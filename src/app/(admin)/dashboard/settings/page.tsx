
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getHomepageSettings, updateHomepageSettings, getContactInfoSettings, updateContactInfoSettings } from '@/services/settings-service';
import type { HomepageSettings, ContactInfoSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import Image from 'next/image';

const homepageSettingsSchema = z.object({
  heroTitle: z.string().min(3, "العنوان الرئيسي قصير جدًا"),
  heroSubtitle: z.string().min(10, "العنوان الفرعي قصير جدًا"),
  heroImageUrl: z.string().url("يجب أن يكون رابطًا صالحًا"),
});

const contactInfoSettingsSchema = z.object({
    email: z.string().email("بريد إلكتروني غير صالح"),
    phone: z.string().min(5, "رقم الهاتف قصير جدًا"),
    address: z.string().min(10, "العنوان قصير جدًا"),
});

const combinedSchema = homepageSettingsSchema.merge(contactInfoSettingsSchema);

type SettingsFormValues = z.infer<typeof combinedSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(combinedSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const [homepageSettings, contactInfoSettings] = await Promise.all([
          getHomepageSettings(),
          getContactInfoSettings(),
        ]);
        if (homepageSettings && contactInfoSettings) {
          form.reset({ ...homepageSettings, ...contactInfoSettings });
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
        toast({ title: "خطأ", description: "فشل في جلب الإعدادات.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form, toast]);
  
  const heroImageUrl = form.watch('heroImageUrl');

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      const homepageValues = {
        heroTitle: values.heroTitle,
        heroSubtitle: values.heroSubtitle,
        heroImageUrl: values.heroImageUrl,
      };
      const contactInfoValues = {
          email: values.email,
          phone: values.phone,
          address: values.address,
      };
      await Promise.all([
        updateHomepageSettings(homepageValues),
        updateContactInfoSettings(contactInfoValues),
      ]);
      toast({ title: "نجاح", description: "تم تحديث الإعدادات بنجاح." });
    } catch (error) {
      console.error("Failed to update settings", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإعدادات.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64 mt-2' />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-24 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-40 w-full' /></div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64 mt-2' />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                    <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الواجهة الرئيسية</CardTitle>
            <CardDescription>تخصيص محتوى قسم الهيرو في الصفحة الرئيسية.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="heroTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان الرئيسي للهيرو</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان الفرعي للهيرو</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="heroImageUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط صورة الهيرو</FormLabel>
                    <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
             )} />
              {heroImageUrl && (
                  <div>
                      <FormLabel>معاينة الصورة الحالية</FormLabel>
                      <div className="mt-2 relative aspect-video w-full max-w-lg rounded-md overflow-hidden border">
                          <Image src={heroImageUrl} alt="معاينة صورة الهيرو" fill className="object-cover"/>
                      </div>
                  </div>
              )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>إعدادات معلومات التواصل</CardTitle>
                <CardDescription>تعديل معلومات التواصل التي تظهر في صفحة "اتصل بنا".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl><Textarea rows={2} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        <div className='flex justify-end'>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ كل التغييرات'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
