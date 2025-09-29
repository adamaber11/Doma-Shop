

"use client";

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updatePopupAd, getPopupAdById } from '@/services/product-service';
import type { Ad } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const adSchema = z.object({
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  linkUrl: z.string().url("يجب أن يكون رابط الانتقال صالحًا"),
  isActive: z.boolean().default(true),
  displayPages: z.array(z.string()).min(1, "الرجاء اختيار صفحة واحدة على الأقل"),
  duration: z.coerce.number().min(0, "المدة يجب أن تكون رقمًا موجبًا").default(0),
});

export default function EditPopupAdPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const adId = Array.isArray(id) ? id[0] : id;

  const { toast } = useToast();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof adSchema>>({
    resolver: zodResolver(adSchema),
  });
  
  const imageUrlValue = form.watch('imageUrl');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedAd = await getPopupAdById(adId);

        if (fetchedAd) {
          setAd(fetchedAd);
          form.reset({
              ...fetchedAd,
              duration: fetchedAd.duration ?? 0,
              displayPages: fetchedAd.displayPages ?? ['all']
          });
        } else {
            toast({ title: "خطأ", description: "لم يتم العثور على الإعلان.", variant: "destructive" });
            router.push('/dashboard/popup-ads');
        }
      } catch (error) {
        console.error("Failed to fetch ad", error);
        toast({ title: "خطأ", description: "فشل في جلب بيانات الإعلان.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (adId) {
        fetchData();
    }
  }, [adId, form, router, toast]);

  const onSubmit = async (values: z.infer<typeof adSchema>) => {
    try {
      await updatePopupAd(adId, values);
      toast({ title: "نجاح", description: "تم تحديث الإعلان بنجاح." });
      router.push('/dashboard/popup-ads');
    } catch (error) {
      console.error("Failed to update ad", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإعلان.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-4 w-64 mt-2' />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                <div className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                <div className="space-y-2"><Skeleton className='h-24 w-full' /></div>
            </CardContent>
            <CardFooter className='justify-end'>
                <Skeleton className='h-10 w-32' />
            </CardFooter>
        </Card>
    );
  }

  if (!ad) {
      return null;
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>تعديل الإعلان المنبثق</CardTitle>
                            <CardDescription>تحديث تفاصيل الإعلان أدناه.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/popup-ads">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى الإعلانات المنبثقة
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة الإعلان</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {imageUrlValue && (
                        <div>
                            <FormLabel>معاينة الصورة</FormLabel>
                            <div className="mt-2 relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                                <Image src={imageUrlValue} alt="معاينة الإعلان" fill className="object-cover"/>
                            </div>
                        </div>
                    )}

                    <FormField control={form.control} name="linkUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط الانتقال عند النقر</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <FormField
                        control={form.control}
                        name="displayPages"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>عرض في الصفحات</FormLabel>
                                 <Select onValueChange={(value) => field.onChange(value === 'all' ? ['all'] : [value])} defaultValue={field.value.includes('all') ? 'all' : field.value[0]}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر مكان ظهور الإعلان" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="all">كل الصفحات</SelectItem>
                                        <SelectItem value="home">الصفحة الرئيسية فقط</SelectItem>
                                        <SelectItem value="products">صفحة المنتجات فقط</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>اختر أين يجب أن يظهر هذا الإعلان المنبثق.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>مدة العرض (بالثواني)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                 <FormDescription>
                                    كم ثانية يجب أن يظهر الإعلان قبل ظهور زر الإغلاق؟ (0 لإظهاره فورًا).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                     <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>إعلان نشط</FormLabel>
                                    <FormDescription>
                                        هل يجب عرض هذا الإعلان للمستخدمين؟
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className='justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري التحديث...' : 'حفظ التغييرات'}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

    