
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getHomepageSettings, updateHomepageSettings } from '@/services/settings-service';
import type { HomepageSettings } from '@/lib/types';
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

const settingsSchema = z.object({
  heroTitle: z.string().min(3, "العنوان الرئيسي قصير جدًا"),
  heroSubtitle: z.string().min(10, "العنوان الفرعي قصير جدًا"),
  heroImageUrl: z.string().url("يجب أن يكون رابطًا صالحًا"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await getHomepageSettings();
        if (settings) {
          form.reset(settings);
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
      await updateHomepageSettings(values);
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
            <CardFooter className='justify-end'>
                <Skeleton className='h-10 w-32' />
            </CardFooter>
        </Card>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الواجهة الرئيسية</CardTitle>
            <CardDescription>تخصيص محتوى قسم الهيرو في الصفحة الرئيسية.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان الرئيسي للهيرو</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان الفرعي للهيرو</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط صورة الهيرو</FormLabel>
                    <FormControl>
                        <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {heroImageUrl && (
                  <div>
                      <FormLabel>معاينة الصورة الحالية</FormLabel>
                      <div className="mt-2 relative aspect-video w-full max-w-lg rounded-md overflow-hidden border">
                          <Image src={heroImageUrl} alt="معاينة صورة الهيرو" fill className="object-cover"/>
                      </div>
                  </div>
              )}
          </CardContent>
          <CardFooter className='justify-end'>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
