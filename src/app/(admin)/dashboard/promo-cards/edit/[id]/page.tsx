
"use client";

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updatePromoCard, getPromoCardById } from '@/services/product-service';
import type { PromoCard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const promoCardSchema = z.object({
  title: z.string().min(3, "العنوان قصير جدًا"),
  imageUrl: z.string().url("يجب أن يكون رابط الصورة صالحًا"),
  linkUrl: z.string().url("يجب أن يكون رابط الانتقال صالحًا"),
  linkText: z.string().min(2, "نص الرابط قصير جدًا"),
});

export default function EditPromoCardPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const cardId = Array.isArray(id) ? id[0] : id;

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof promoCardSchema>>({
    resolver: zodResolver(promoCardSchema),
  });
  
  const imageUrlValue = form.watch('imageUrl');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedCard = await getPromoCardById(cardId);
        if (fetchedCard) {
          form.reset(fetchedCard);
        } else {
            toast({ title: "خطأ", description: "لم يتم العثور على البطاقة.", variant: "destructive" });
            router.push('/dashboard/promo-cards');
        }
      } catch (error) {
        console.error("Failed to fetch promo card", error);
        toast({ title: "خطأ", description: "فشل في جلب بيانات البطاقة.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (cardId) {
        fetchData();
    }
  }, [cardId, form, router, toast]);

  const onSubmit = async (values: z.infer<typeof promoCardSchema>) => {
    try {
      await updatePromoCard(cardId, values);
      toast({ title: "نجاح", description: "تم تحديث البطاقة الترويجية بنجاح." });
      router.push('/dashboard/promo-cards');
    } catch (error) {
      console.error("Failed to update card", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث البطاقة.",
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
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2"><Skeleton className='h-4 w-24' /><Skeleton className='h-10 w-full' /></div>
                ))}
            </CardContent>
            <CardFooter className='justify-end'>
                <Skeleton className='h-10 w-32' />
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>تعديل البطاقة الترويجية</CardTitle>
                            <CardDescription>تحديث تفاصيل البطاقة أدناه.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard/promo-cards">
                               <ArrowRight className="h-4 w-4" />
                                الرجوع إلى البطاقات
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel>العنوان</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>رابط صورة البطاقة</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {imageUrlValue && (
                        <div>
                            <FormLabel>معاينة الصورة</FormLabel>
                            <div className="mt-2 relative aspect-square w-full max-w-sm rounded-md overflow-hidden border">
                                <Image src={imageUrlValue} alt="معاينة البطاقة" fill className="object-cover"/>
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
                     <FormField control={form.control} name="linkText" render={({ field }) => (
                        <FormItem>
                            <FormLabel>نص الرابط</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
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
